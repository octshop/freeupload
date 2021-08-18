using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// 【公共】相关业务逻辑 
/// </summary>
namespace OctWapWeb
{
    public class BusiCode
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        public BusiCode()
        {

        }

        /// <summary>
        /// 得到技术支持内容
        /// </summary>
        /// <returns></returns>
        public static string getTechSupportXhtml()
        {
            var myJsVal = "";
            myJsVal += " <div style=\"text-align:center; width: 100%; overflow:hidden; font-size:12px; color:gray; padding-top: 20px;\">";
            myJsVal += "                <a href=\"https://m.opencodetiger.com\" style=\"color: #d0d0d0\">技术支持：m.opencodetiger.com</a>";
            myJsVal += "</div>";
            return myJsVal;
        }

        #region【微信小程序--相关逻辑】

        /// <summary>
        /// 得到打开小程序的页面的 UrlSchem 协议 
        /// </summary>
        /// <param name="pWxPagePath">小程序的页面路径 如：[ /pages/webviewload/webview ] </param>
        /// <param name="pQueryParam">参数值 如[ AID=54^UID=234 ]</param>
        /// <returns>weixin://dl/business/?t=3uGqLFHHS3r </returns>
        public static string getMiniUrlScheme(string pWxPagePath, string pQueryParam)
        {
            //判断是否在微信中访问页面
            bool _isInWeiXin = PublicClassNS.PublicClass.isInWeiXinBrowse();
            if (_isInWeiXin == false)
            {
                return "";
            }

            //请求URL
            string _httpURL = WebAppConfig.OctMallMiniWeb_AddrDomain + "/WxMiniApi/MiniUrlSchemeGenerate";

            //POST参数
            Dictionary<string, string> _dicPOST = new Dictionary<string, string>();
            _dicPOST.Add("WxPagePath", pWxPagePath);
            _dicPOST.Add("QueryParam", pQueryParam);
            //正式发送Http请求
            string _urlScheme = HttpServiceNS.HttpService.Post(_httpURL, _dicPOST);
            return _urlScheme;
        }

        #endregion


    }
}