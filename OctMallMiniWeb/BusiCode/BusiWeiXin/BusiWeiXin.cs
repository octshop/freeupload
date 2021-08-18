using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;

/// <summary>
/// 处理与【微信相关的】 业务逻辑  如果获取微信openid ,access_token等等
/// </summary>
namespace BusiWeiXinNS
{
    public class BusiWeiXin
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        public BusiWeiXin()
        {

        }


        #region 【微信小程序--业务逻辑】

        /// <summary>
        /// 得到打开小程序的页面的 UrlSchem 协议 
        /// </summary>
        /// <param name="pWxPagePath">小程序的页面路径 如：[ /pages/webviewload/webview ] </param>
        /// <param name="pQueryParam">参数值 如[ AID=54&UID=234 ]</param>
        /// <returns>weixin://dl/business/?t=3uGqLFHHS3r </returns>
        public static string getMiniUrlScheme(string pWxPagePath, string pQueryParam)
        {

            //得到ACCESS_TOKEN
            string _ACCESS_TOKEN = GetAccessTokenMsgNS.GetAccessTokenMsg.getAccessTokenFromWeiXin();
            //生成UrlScheme 的请求URL
            string _httpUrl = "https://api.weixin.qq.com/wxa/generatescheme?access_token=" + _ACCESS_TOKEN;

            //构造Json字符串
            string _jsonPOST = "";
            _jsonPOST += "{";
            _jsonPOST += "    \"jump_wxa\":";
            _jsonPOST += "    {";
            _jsonPOST += "        \"path\": \"" + pWxPagePath + "\",";
            _jsonPOST += "        \"query\": \"" + pQueryParam + "\"";
            _jsonPOST += "    },";
            _jsonPOST += "    \"is_expire\":false,";
            _jsonPOST += "    \"expire_time\":1606737600";
            _jsonPOST += "}";

            //正式发送请求
            string _jsonBack = HttpServiceNS.HttpService.SendJsonPostData(_httpUrl, _jsonPOST);
            WriteLogNs.LogClass.WriteLogFile("生成打开小程序UrlScheme=" + _jsonBack);
            JObject _jObj = (JObject)JsonConvert.DeserializeObject(_jsonBack);
            if (_jObj["errmsg"].ToString().Trim() == "ok")
            {
                return _jObj["openlink"].ToString().Trim(); //weixin://dl/business/?t=3uGqLFHHS3r
            }

            return "";

            //{"errcode":0,"errmsg":"ok","openlink":"weixin://dl/business/?t=3uGqLFHHS3r"}

        }

        /// <summary>
        /// 得到小程序二维码  http://192.168.3.10:2000/WxMiniApi/MiniScanImgShow?MiniPagePath=pages/tabbar/index/index&Scene=11023
        /// </summary>
        /// <param name="pWxPagePathAndParam">小程序的页面路径 如：[ pages/webviewload/webview?SID=11 最前面不能加 "/" ]</param>
        /// <param name="pImgWidth">小程序二维码的宽度</param>
        /// <param name="pScene">场景值</param>
        /// <returns></returns>
        public static string getMiniScanImgBase64(string pWxPagePathAndParam, string pImgWidth = "600", string pScene = "SID=1")
        {
            //得到ACCESS_TOKEN
            string _ACCESS_TOKEN = GetAccessTokenMsgNS.GetAccessTokenMsg.getAccessTokenFromWeiXin();
            //生成UrlScheme 的请求URL
            string _httpUrl = "https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=" + _ACCESS_TOKEN;

            //构造Json字符串
            string _jsonPOST = "";
            _jsonPOST += "{";
            _jsonPOST += "\"scene\":\"SID=" + pScene + "\",";
            _jsonPOST += "\"page\":\"" + pWxPagePathAndParam + "\",";
            _jsonPOST += "\"width\":" + pImgWidth + "";
            _jsonPOST += "}";

            #region【发送Http请求】
            byte[] bytes = Encoding.UTF8.GetBytes(_jsonPOST);
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(_httpUrl);
            request.Method = "POST";
            request.ContentLength = bytes.Length;
            request.ContentType = "text/xml";
            Stream reqstream = request.GetRequestStream();
            reqstream.Write(bytes, 0, bytes.Length);

            //声明一个HttpWebRequest请求  
            request.Timeout = 90000;
            //设置连接超时时间  
            request.Headers.Set("Pragma", "no-cache");
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            #endregion


            System.IO.Stream stream = response.GetResponseStream();
            List<byte> _bytesStream = new List<byte>();
            int temp = stream.ReadByte();
            while (temp != -1)
            {
                _bytesStream.Add((byte)temp);
                temp = stream.ReadByte();
            }
            byte[] result = _bytesStream.ToArray();

            //这个Base64可以直接在<img标签中显示
            string _base64Img = Convert.ToBase64String(result);//将byte[]转为base64

            //ViewBag.base64Img = base64;

            //Response.ContentType = "image/Png";
            //Response.OutputStream.Write(result, 0, (int)result.Length);
            //Response.End();

            return _base64Img;
        }

        #endregion




    }
}