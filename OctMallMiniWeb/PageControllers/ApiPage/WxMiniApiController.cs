using HttpServiceNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【微信小程序信息】相关Api控制器
/// </summary>
namespace OctMallMiniWeb.PageControllers.ApiPage
{
    public class WxMiniApiController : Controller
    {
        /// <summary>
        /// 公共首页
        /// </summary>
        /// <returns></returns>
        public string Index()
        {
            return "";
        }


        /// <summary>
        /// 建立微信小程序登录，并获取 openid,unionid,session_key
        /// </summary>
        /// <returns></returns>
        public string WxLoginGetMsg()
        {
            //获取传递过来的code
            string _code = Request["code"].ToString().Trim();

            //构造URL
            string _httpURL = "https://api.weixin.qq.com/sns/jscode2session?appid=" + WebAppConfig.WxMiniAppID + "&secret=" + WebAppConfig.WxMiniAppSecret + "&js_code=" + _code + "&grant_type=authorization_code";

            //发送Http请求获取 openid,unionid,session_key
            string _httpBack = HttpService.Get(_httpURL);

            return _httpBack;
        }

        /// <summary>
        /// 创建H5网页跳转打开小程序 UrlScheme
        /// </summary>
        /// <returns>weixin://dl/business/?t=3uGqLFHHS3r</returns>
        public string MiniUrlSchemeGenerate()
        {
            if (WebAppConfig.MiniUrlSchemeIsGet != "true")
            {
                return "";
            }

            //获取传递的参数
            //小程序跳转的路径 /pages/webviewload/webview
            string WxPagePath = PublicClass.FilterRequestTrimNoConvert("WxPagePath");
            //参数值 如[ AID=54^UID=234 ]
            string QueryParam = PublicClass.FilterRequestTrimNoConvert("QueryParam");
            QueryParam = QueryParam.Replace("^", "&");

            //得到打开小程序的页面的 UrlSchem 协议 
            string _MiniUrlScheme = BusiWeiXinNS.BusiWeiXin.getMiniUrlScheme(WxPagePath, QueryParam);
            return _MiniUrlScheme;

            ////得到ACCESS_TOKEN
            //string _ACCESS_TOKEN = GetAccessTokenMsgNS.GetAccessTokenMsg.getAccessTokenFromWeiXin();
            ////生成UrlScheme 的请求URL
            //string _httpUrl = "https://api.weixin.qq.com/wxa/generatescheme?access_token=" + _ACCESS_TOKEN;

            ////构造Json字符串
            //string _jsonPOST = "";
            //_jsonPOST += "{";
            //_jsonPOST += "    \"jump_wxa\":";
            //_jsonPOST += "    {";
            //_jsonPOST += "        \"path\": \"/pages/webviewload/webview\",";
            //_jsonPOST += "        \"query\": \"AID=54\"";
            //_jsonPOST += "    },";
            //_jsonPOST += "    \"is_expire\":false,";
            //_jsonPOST += "    \"expire_time\":1606737600";
            //_jsonPOST += "}";

            ////正式发送请求
            //string _jsonBack = HttpService.SendJsonPostData(_httpUrl, _jsonPOST);
            //return _jsonBack;

            //{"errcode":0,"errmsg":"ok","openlink":"weixin:\/\/dl\/business\/?t=3uGqLFHHS3r"}
            //weixin://dl/business/?t=3uGqLFHHS3r


        }

        #region【得到微信小程序二维码,包括小程序所有路径的跳转】

        /// <summary>
        /// 直接输入小程序二维码，<img />直接调用这个网址URL即可 如：
        /// </summary>
        /// <returns></returns>
        public ActionResult MiniScanImgShow()
        {
            //http://192.168.3.10:2000/WxMiniApi/MiniScanImgShow?MiniPagePath=pages/tabbar/index/index&Scene=11023

            //---------获取传递的参数--------//
            //小程序的页面路径  必须是已经发布的小程序存在的页面（否则报错），例如 pages/index /index, 根路径前不要填加 /,不能携带参数（参数请放在scene字段里），如果不填写这个字段，默认跳主页面
            string MiniPagePath = PublicClass.FilterRequestTrimNoConvert("MiniPagePath");
            //小程序二维码的宽度 --可选
            string ImgWidth = PublicClass.FilterRequestTrim("ImgWidth");
            //场景值 --可选
            string Scene = PublicClass.FilterRequestTrimNoConvert("Scene");
            //格式化路径把 "^"转换成"?" "~"转换成"="  "|"转换成"&" 
            //Scene = PublicClass.formatBackURLParamChar(Scene);

            if (string.IsNullOrWhiteSpace(ImgWidth))
            {
                ImgWidth = "600";
            }
            if (string.IsNullOrWhiteSpace(Scene))
            {
                Scene = "a=1";
            }


            //得到ACCESS_TOKEN
            string _ACCESS_TOKEN = GetAccessTokenMsgNS.GetAccessTokenMsg.getAccessTokenFromWeiXin();
            //生成UrlScheme 的请求URL
            string _httpUrl = "https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=" + _ACCESS_TOKEN;

            //构造Json字符串
            string _jsonPOST = "";
            _jsonPOST += "{";
            _jsonPOST += "\"scene\":\"" + Scene + "\",";
            _jsonPOST += "\"page\":\"" + MiniPagePath + "\",";
            _jsonPOST += "\"width\":" + ImgWidth;
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

            //转换成Stream对象
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
            //string base64 = Convert.ToBase64String(result);//将byte[]转为base64

            //ViewBag.base64Img = base64;

            //直接输入图片显示,<img />标签直接引用网址即可
            Response.ContentType = "image/Png";
            Response.OutputStream.Write(result, 0, (int)result.Length);
            Response.End();
            return View();
        }

        /// <summary>
        /// 得到 小程序二维码图片的 Base64字符串内容，<img />直接显示这个内容即可
        /// </summary>
        /// <returns></returns>
        public string MiniScanImgBase64()
        {
            //---------获取传递的参数--------//
            //小程序的页面路径  必须是已经发布的小程序存在的页面（否则报错），例如 pages/index /index, 根路径前不要填加 /,不能携带参数（参数请放在scene字段里），如果不填写这个字段，默认跳主页面
            string MiniPagePath = PublicClass.FilterRequestTrimNoConvert("MiniPagePath");
            //小程序二维码的宽度 --可选
            string ImgWidth = PublicClass.FilterRequestTrim("ImgWidth");
            //场景值 --可选
            string Scene = PublicClass.FilterRequestTrimNoConvert("Scene");
            //格式化路径把 "^"转换成"?" "~"转换成"="  "|"转换成"&" 
            Scene = PublicClass.formatBackURLParamChar(Scene);


            if (string.IsNullOrWhiteSpace(ImgWidth))
            {
                ImgWidth = "600";
            }
            if (string.IsNullOrWhiteSpace(Scene))
            {
                Scene = "a=1";
            }

            string _base64Content = BusiWeiXinNS.BusiWeiXin.getMiniScanImgBase64(MiniPagePath, ImgWidth, Scene);
            return _base64Content;
        }

        #endregion




    }
}