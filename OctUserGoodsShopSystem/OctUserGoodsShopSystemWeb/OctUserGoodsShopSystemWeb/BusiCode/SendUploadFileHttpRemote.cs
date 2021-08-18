using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web;

/// <summary>
/// 【上传文件到远程服务器的Http请求处理】业务逻辑
/// </summary>
namespace SendUploadFileHttpRemoteNS
{
    public class SendUploadFileHttpRemote
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        public SendUploadFileHttpRemote()
        {

        }

        #region 【公共函数】

        /// <summary>
        /// 正式向远程服务器上传文件,【在上传处理页面直接调用此方法】 以multipart/form-data形式发送
        /// </summary>
        /// <param name="pUploadRemoteURL">上传远程服务器URL</param>
        /// <param name="pDicPost">附带的POST参数</param>
        /// <returns></returns>
        public static string sendUploadFileRemote(string pUploadRemoteURL, Dictionary<string, object> pDicPost)
        {
            //获取客户端上传文件域集合
            HttpFileCollection Hfc = System.Web.HttpContext.Current.Request.Files;
            //循环进行前声断咽后声迟并上传文件
            for (int i = 0; i < Hfc.Count; i++)
            {
                //访问指定文件
                HttpPostedFile userHpf = Hfc[i];
                if (userHpf.ContentLength > 0)
                {
                    //传递的POST参数
                    //Dictionary<string, object> _dicPost = new Dictionary<string, object>();
                    //_dicPost.Add("Type", "1");
                    //_dicPost.Add("Data", "传递的数据");

                    System.Net.CookieContainer cookie = new System.Net.CookieContainer();

                    //输出的返回参数
                    string _backMsg = "";

                    //文件上传至远程服务器
                    //HttpPostFile("http://192.168.1.220:96/Upload/UploadFileRemote", userHpf, _dicPost, cookie, ref _backMsg);
                    HttpPostFile(pUploadRemoteURL, userHpf, pDicPost, cookie, ref _backMsg);

                    return _backMsg;
                }
            }
            return "SUFR_02"; //上传文件为空
        }


        /// <summary>
        /// 文件上传至远程服务器
        /// </summary>
        /// <param name="url">远程服务地址</param>
        /// <param name="postedFile">上传文件</param>
        /// <param name="parameters">POST参数</param>
        /// <param name="cookieContainer">cookie</param>
        /// <param name="output">远程服务器响应字符串</param>
        public static void HttpPostFile(string url,
                                        System.Web.HttpPostedFile postedFile,
                                        Dictionary<string, object> parameters,
                                        CookieContainer cookieContainer,
                                        ref string output)
        {
            //1>创建请求
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            //2>Cookie容器
            request.CookieContainer = cookieContainer;
            request.Method = "POST";
            request.Timeout = 20000;
            request.Credentials = System.Net.CredentialCache.DefaultCredentials;
            request.KeepAlive = true;

            string boundary = "----------------------------" + DateTime.Now.Ticks.ToString("x");//分界线
            byte[] boundaryBytes = System.Text.Encoding.ASCII.GetBytes("\r\n--" + boundary + "\r\n");

            request.ContentType = "multipart/form-data; boundary=" + boundary; ;//内容类型

            //3>表单数据模板
            string formdataTemplate = "\r\n--" + boundary + "\r\nContent-Disposition: form-data; name=\"{0}\";\r\n\r\n{1}";

            //4>读取流
            byte[] buffer = new byte[postedFile.ContentLength];
            postedFile.InputStream.Read(buffer, 0, buffer.Length);

            //5>写入请求流数据
            string strHeader = "Content-Disposition:application/x-www-form-urlencoded; name=\"{0}\";filename=\"{1}\"\r\nContent-Type:{2}\r\n\r\n";
            strHeader = string.Format(strHeader,
                                     "filedata",
                                     postedFile.FileName,
                                     postedFile.ContentType);
            //6>HTTP请求头
            byte[] byteHeader = System.Text.ASCIIEncoding.ASCII.GetBytes(strHeader);
            try
            {
                using (Stream stream = request.GetRequestStream())
                {
                    //写入请求流
                    if (null != parameters)
                    {
                        foreach (KeyValuePair<string, object> item in parameters)
                        {
                            stream.Write(boundaryBytes, 0, boundaryBytes.Length);//写入分界线
                            byte[] formBytes = System.Text.Encoding.UTF8.GetBytes(string.Format(formdataTemplate, item.Key, item.Value));
                            stream.Write(formBytes, 0, formBytes.Length);
                        }
                    }
                    //6.0>分界线============================================注意：缺少次步骤，可能导致远程服务器无法获取Request.Files集合
                    stream.Write(boundaryBytes, 0, boundaryBytes.Length);
                    //6.1>请求头
                    stream.Write(byteHeader, 0, byteHeader.Length);
                    //6.2>把文件流写入请求流
                    stream.Write(buffer, 0, buffer.Length);
                    //6.3>写入分隔流
                    byte[] trailer = System.Text.Encoding.ASCII.GetBytes("\r\n--" + boundary + "--\r\n");
                    stream.Write(trailer, 0, trailer.Length);
                    //6.4>关闭流
                    stream.Close();
                }
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                {
                    output = reader.ReadToEnd();
                }
                response.Close();
            }
            catch (Exception ex)
            {
                throw new Exception("上传文件时远程服务器发生异常！", ex);
            }
        }

        #endregion


    }
}
