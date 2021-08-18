using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WeChatJsSdk.SdkCore;

/// <summary>
/// 【各种验证码信息-验证】相关Page页面控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.WebPage
{
    public class VerifyCodePageController : Controller
    {
        /// <summary>
        /// 各种验证码信息-验证
        /// </summary>
        /// <returns></returns>
        public ActionResult VerifyCodeAll()
        {
            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain.ToString().Trim();

            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../LoginPage/LoginedScanPrompt");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("商家登录错误，请重新登录！<a href=\"../LoginPage/Index\">立即登录</a>");
            }

            //获取传递的扫码参数
            bool _isScanData = PublicClass.IsRequestParaBool("ScanData");
            if (_isScanData == false)
            {
                return Content("<script>alert(\"扫码数据错误！\")</script>");
            }

            string _ScanData = Request["ScanData"].ToString().Trim();
            ViewBag.ScanData = _ScanData;

            return View();
        }

        /// <summary>
        /// 弹出验证微信扫码窗口
        /// </summary>
        /// <returns></returns>
        public ActionResult PopVerifyScanWin()
        {
            //获取返回地址
            ViewBag.BackUrl = PublicClass.FilterRequestTrim("BackUrl");

            #region【初始化 微信JS-SDK】

            ViewBag.IsInWeiXinBrowse = "false"; //是否在微信中

            //判断是否为微信扫码进入 --微信中
            if (PublicClass.isInWeiXinBrowse() == true)
            {
                ViewBag.IsInWeiXinBrowse = "true"; //是否在微信中

                //微信公众号的appID
                //string appId = System.Configuration.ConfigurationManager.AppSettings["WeChatAppId"];

                //Http请求 得到微信的 APPID 和 APPSECRET
                Dictionary<string, object> _dicWx = BusiShop.httpWxAppIDAppScecret();
                string appId = _dicWx["APPID"].ToString().Trim();
                string appSecret = _dicWx["APPSECRET"].ToString().Trim();


                bool debug = false;

                JSSDK sdk = new JSSDK(appId, appSecret, debug);
                SignPackage config = sdk.GetSignPackage(JsApiEnum.getLocation | JsApiEnum.openLocation | JsApiEnum.scanQRCode | JsApiEnum.onMenuShareQQ);

                System.Web.Script.Serialization.JavaScriptSerializer serializer = new System.Web.Script.Serialization.JavaScriptSerializer();

                string strXhtmlConfig = serializer.Serialize(config);
                //JsSkdConfigB.InnerHtml = strXhtmlConfig;

                ViewBag.mJsSkdConfig = strXhtmlConfig;
            }

            #endregion

            return View();
        }

    }
}