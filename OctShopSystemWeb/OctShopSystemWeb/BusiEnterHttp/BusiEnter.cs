using PublicClassNS;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Web;
/// <summary>
/// 处理【第三方与系统的入口 (主要提供给第三方使用)】业务逻辑
/// </summary>
namespace BusiEnterNS
{
    public class BusiEnter
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        public BusiEnter()
        {

        }

        /// <summary>
        /// 得到RSA加密后的签名，需要登录操作的 【签名信息】
        /// </summary>
        /// <param name="pRndKeyRSA">RSA加密后的RndKey</param>
        /// <param name="pUserID">第三方系统，用户ID</param>
        /// <param name="pLoginPwd">第三方系统，用户登录密码 (用SHA1加密)</param>
        /// <param name="pExtraDataArr">额外数据，用“|”隔开</param>
        /// <returns></returns>
        public static string getSignValRSA(string pRndKeyRSA, string pUserID, string pLoginPwd, string pExtraDataArr)
        {
            if (string.IsNullOrWhiteSpace(pRndKeyRSA) || pRndKeyRSA == "UserKey错误")
            {
                return "";
            }

            string _signVal = pRndKeyRSA + "^" + pUserID + "^" + pLoginPwd + "^" + pExtraDataArr;

            _signVal = RSAEncryptSection("", _signVal);

            //必须将加密后文本中的“+”转换成“%2B” 再通过GET方式参数传递 否则会出现“base64长度和加密字符串不正确的错误”
            return _signVal.Replace("+", "%2B");
        }

        /// <summary>
        /// 通过Http请求获取RSA加密后的RndKey, 一种是两小时有效，别一种只能使用一次
        /// </summary>
        /// <param name="pHttpURL">Http请求URL地址</param>
        /// <param name="pUserKeyID">API用户ID(Key关联的用户ID) 与UserKey对应的UserKeyID</param>
        /// <param name="pUserKey">系统分配给Api请求用户的Key值 [9af7f46a-ea52-4aa3-b8c3-9fd484c2af12]</param>
        /// <param name="pOneTime">RndKey是否为只使用一次 [true/false]</param>
        /// <returns></returns>
        public static string httpGetRndKeyRSA(string pHttpURL, string pUserKeyID, string pUserKey, string pOneTime = "false")
        {
            string _rndKey = pUserKeyID + "^" + pUserKey + "^" + pOneTime + "^" + PublicClass.getTotalMillisecond();
            //加密获取RndKey所需要的信息
            string _keyIDUserKeyArr = RSAEncryptSection("", _rndKey);

            //必须将加密后文本中的“+”转换成“%2B” 再通过GET方式参数传递 否则会出现“base64长度和加密字符串不正确的错误”
            _keyIDUserKeyArr = _keyIDUserKeyArr.Replace("+", "%2B");

            //构造POST参数
            Dictionary<string, string> _dic = new Dictionary<string, string>();
            _dic.Add("UserKeyIDAndUserKeyArrRSA", _keyIDUserKeyArr);
            _dic.Add("LangType", "C#");
            //发送Http请求
            string _rndKeyRSA = sendHttp_GetOrPost(pHttpURL, _dic, "POST");

            return _rndKeyRSA;
        }

        #region 【公共调用的函数】

        /// <summary>
        ///分段RSA加密 ，解决不能加密很长的字符串
        /// </summary>
        /// <param name="publickey"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        public static string RSAEncryptSection(string publickey, string content)
        {
            //要加密的数据
            byte[] data = System.Text.Encoding.UTF8.GetBytes(content);

               //公钥
          publickey = @"<RSAKeyValue><Modulus>sTk7pg022uhhgkrcJrPzShmLnTul24dM08919MLR6Wy24IIHMlJjkkY6YZCb2HGRi0SvOfQjkfZuoBi2au6kU3FZEbSjHqFqZPaEL8X47lRd2IZWuipZmh0AEwr4FpKymdP0PxzWloHusuxZcmw9/15To+FOKoehfQZrhBcrccU=</Modulus><Exponent>AQAB</Exponent></RSAKeyValue>";



            RSACryptoServiceProvider rsa = new RSACryptoServiceProvider();
            rsa.FromXmlString(publickey);

            int keySize = rsa.KeySize / 8;


            int bufferSize = keySize - 11;

            byte[] buffer = new byte[bufferSize];


            MemoryStream msInput = new MemoryStream(data);
            MemoryStream msOuput = new MemoryStream();

            int readLen = msInput.Read(buffer, 0, bufferSize);

            while (readLen > 0)
            {
                byte[] dataToEnc = new byte[readLen];

                Array.Copy(buffer, 0, dataToEnc, 0, readLen);


                byte[] encData = rsa.Encrypt(dataToEnc, false);

                msOuput.Write(encData, 0, encData.Length);

                readLen = msInput.Read(buffer, 0, bufferSize);
            }

            msInput.Close();
            byte[] result = msOuput.ToArray();

            msOuput.Close();
            rsa.Clear();

            //得到并返回加密结果
            return Convert.ToBase64String(result);
        }

        /// <summary>
        /// 发送 Http (GET/POST两种方式)
        /// </summary>
        /// <param name="url">请求URL</param>
        /// <param name="parameters">请求参数</param>
        /// <param name="method">请求方法(Post/Get)</param>
        /// <returns>响应内容</returns>
        /// <example> string url1 = "http://v.juhe.cn/usedcar/province";
        ///构造POST的参数
        /// var parameters1 = new Dictionary<string, string>();
        ///parameters1.Add("key", appkey);//你申请的key
        ///parameters1.Add("dtype", "json"); //返回数据的格式,xml或json，默认json
        ///parameters1.Add("method", ""); //固定值：getAllCity
        ///正式发送请求
        ///string result1 = SendHttpRequest.sendPost_Http(url1, parameters1, "get");</example>
        public static string sendHttp_GetOrPost(string url, IDictionary<string, string> parameters, string method)
        {
            if (method.ToLower() == "post")
            {
                HttpWebRequest req = null;
                HttpWebResponse rsp = null;
                System.IO.Stream reqStream = null;
                try
                {
                    req = (HttpWebRequest)WebRequest.Create(url);
                    req.Method = method;
                    req.KeepAlive = false;
                    req.ProtocolVersion = HttpVersion.Version10;
                    req.Timeout = 5000;
                    req.ContentType = "application/x-www-form-urlencoded;charset=utf-8";
                    byte[] postData = Encoding.UTF8.GetBytes(BuildQuery(parameters, "utf8"));
                    reqStream = req.GetRequestStream();
                    reqStream.Write(postData, 0, postData.Length);
                    rsp = (HttpWebResponse)req.GetResponse();
                    Encoding encoding = Encoding.GetEncoding(rsp.CharacterSet);
                    return GetResponseAsString(rsp, encoding);
                }
                catch (Exception ex)
                {
                    return ex.Message;
                }
                finally
                {
                    if (reqStream != null) reqStream.Close();
                    if (rsp != null) rsp.Close();
                }
            }
            else
            {
                //创建请求
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url + "?" + BuildQuery(parameters, "utf8"));

                //GET请求
                request.Method = "GET";
                request.ReadWriteTimeout = 5000;
                request.ContentType = "text/html;charset=UTF-8";
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                Stream myResponseStream = response.GetResponseStream();
                StreamReader myStreamReader = new StreamReader(myResponseStream, Encoding.GetEncoding("utf-8"));

                //返回内容
                string retString = myStreamReader.ReadToEnd();
                return retString;
            }
        }

        /// <summary>
        /// 把响应流转换为文本。
        /// </summary>
        /// <param name="rsp">响应流对象</param>
        /// <param name="encoding">编码方式</param>
        /// <returns>响应文本</returns>
        public static string GetResponseAsString(HttpWebResponse rsp, Encoding encoding)
        {
            System.IO.Stream stream = null;
            StreamReader reader = null;
            try
            {
                // 以字符流的方式读取HTTP响应
                stream = rsp.GetResponseStream();
                reader = new StreamReader(stream, encoding);
                return reader.ReadToEnd();
            }
            finally
            {
                // 释放资源
                if (reader != null) reader.Close();
                if (stream != null) stream.Close();
                if (rsp != null) rsp.Close();
            }
        }

        /// <summary>
        /// 组装普通文本请求参数。
        /// </summary>
        /// <param name="parameters">Key-Value形式请求参数字典</param>
        /// <returns>URL编码后的请求数据</returns>
        public static string BuildQuery(IDictionary<string, string> parameters, string encode)
        {
            StringBuilder postData = new StringBuilder();
            bool hasParam = false;
            IEnumerator<KeyValuePair<string, string>> dem = parameters.GetEnumerator();
            while (dem.MoveNext())
            {
                string name = dem.Current.Key;
                string value = dem.Current.Value;
                // 忽略参数名或参数值为空的参数
                if (!string.IsNullOrEmpty(name))//&& !string.IsNullOrEmpty(value)
                {
                    if (hasParam)
                    {
                        postData.Append("&");
                    }
                    postData.Append(name);
                    postData.Append("=");
                    if (encode == "gb2312")
                    {
                        postData.Append(HttpUtility.UrlEncode(value, Encoding.GetEncoding("gb2312")));
                    }
                    else if (encode == "utf8")
                    {
                        postData.Append(HttpUtility.UrlEncode(value, Encoding.UTF8));
                    }
                    else
                    {
                        postData.Append(value);
                    }
                    hasParam = true;
                }
            }
            return postData.ToString();
        }

        #endregion



    }
}
