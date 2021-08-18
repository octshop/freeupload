using BusiApiKeyVerifyNS;
using BusiDbSysConfigNS;
using BusiWxTemplateMessageNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WeChatJsSdk.SdkCore;
using WxPayAPI;

/// <summary>
/// 【微信各种操作】相关Api和Page控制器
/// </summary>
namespace OctThirdApiCallSystemWeb.PageControllers.WebPage
{
    public class WeiXinController : Controller
    {
        // GET: WeiXin
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 得到微信用户信息的跳转页 - 第三方按照这个方式跳转到此页
        /// </summary>
        /// <returns></returns>
        public ActionResult GetWeiXinUserInfoMsg()
        {
            //需要跳回的页面，这个第三方跳转时传递
            string BackGoURL = PublicClass.FilterRequestTrimNoConvert("BackGoURL");

            //当前域名地址 http://192.168.3.10:1000
            string _HostAddrUri = Request.Url.AbsoluteUri.ToString().Trim().Substring(0, Request.Url.AbsoluteUri.ToString().Trim().IndexOf("/WeiXin/GetWeiXinUserInfoMsg"));

            //这个重新跳转页，处理获取微信基本资料后的逻辑
            //string _reGoRedirectURL = "https://third.opencodetiger.com/WeiXin/WeiXinUserInfoMsg?BackGoURL=https://third.opencodetiger.com/Test/TestShowGetWeiXinUserInfoMsg";
            string _reGoRedirectURL = "" + _HostAddrUri + "/WeiXin/WeiXinUserInfoMsg?BackGoURL=" + BackGoURL;


            //这个是拉取微信用户的基本资料 要用这个
            //用封装好的构造方法生成跳转URL 个是拉取微信用户的基本资料 要用这个
            string _redirectUrl = BusiWeiXinNS.BusiWeiXin.buildRedirectCodeUrl(_reGoRedirectURL);
            //直接跳转
            Response.Redirect(_redirectUrl);

            return Content("拉取微信用户信息");
        }

        /// <summary>
        /// 得到微信用户的资料 返回Json数据
        /// </summary>
        /// <returns></returns>
        public ActionResult WeiXinUserInfoMsg()
        {
            //获取传递的参数
            //获取微信用户资料返回后，跳转的URL参数带有微信用户资料JSON字符串
            string BackGoURL = PublicClass.FilterRequestTrimNoConvert("BackGoURL");

            //直接获取微信用户的资料
            string _wxUserInfoJson = BusiWeiXinNS.BusiWeiXin.getWeiXinMsgJson();

            //跳回第三方地址
            string _backURLThird = BackGoURL + "?WxUserInfoBase64=" + EncryptionClassNS.EncryptionClass.EncodeBase64("UTF-8", _wxUserInfoJson).Replace("+", "%2B");
            Response.Redirect(_backURLThird);

            //这里必须是这样返回 return Content("") 否则无法跳转
            return Content("得到微信用户的资料 返回Json数据");

            // {
            // "openid":" OPENID",
            //" nickname": NICKNAME,
            //"sex":"1",
            //"province":"PROVINCE"
            // "city":"CITY",
            //"country":"COUNTRY",
            //"headimgurl":    "http://thirdwx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46",
            //"privilege":[ "PRIVILEGE1" "PRIVILEGE2"     ],
            //"unionid": "o6_bmasdasdsad6_2sgVt7hMZOPfL"
            //}
        }

        #region【微信公众号获取用户地理坐标】

        /// <summary>
        /// 微信Js-SDK的应用 可以获取用户地理位置
        /// </summary>
        /// <returns></returns>
        public ActionResult WxJsSdk()
        {

            /*
           wx.config({
              debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: '', // 必填，公众号的唯一标识
              timestamp: , // 必填，生成签名的时间戳
              nonceStr: '', // 必填，生成签名的随机串
              signature: '',// 必填，签名，见附录1
              jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
           });
           */
            /* web.config 设置appid,appsecret,dubug
               <appSettings>
                <add key="WeChatAppId" value="your appid here"/>
                <add key="WeChatAppSecret" value="your appsecret here"/>
                <add key="WeChatJsDebug" value="true"/>
              </appSettings> 
            */
            //微信公众号的appID
            //string appId = System.Configuration.ConfigurationManager.AppSettings["WeChatAppId"];
            string appId = WxPayConfig.APPID; //"wxeb4f0fe63cb42fe8";
                                              //微信公众号的appSecret
                                              //string appSecret = System.Configuration.ConfigurationManager.AppSettings["WeChatAppSecret"];
            string appSecret = WxPayConfig.APPSECRET; //"ce7d18c31d39f4dbcaadbf594fc477ac"; //OHOConfig.strAppSecret; //"ce7d18c31d39f4dbcaadbf594fc477ac";
                                                      //bool debug = System.Configuration.ConfigurationManager.AppSettings["WeChatAppSecret"].ToLower() == "true";
            bool debug = false;

            JSSDK sdk = new JSSDK(appId, appSecret, debug);
            SignPackage config = sdk.GetSignPackage(JsApiEnum.getLocation | JsApiEnum.openLocation | JsApiEnum.scanQRCode | JsApiEnum.onMenuShareQQ);

            System.Web.Script.Serialization.JavaScriptSerializer serializer = new System.Web.Script.Serialization.JavaScriptSerializer();

            string strXhtmlConfig = serializer.Serialize(config);
            //JsSkdConfigB.InnerHtml = strXhtmlConfig;

            ViewBag.mJsSkdConfig = strXhtmlConfig;



            return View();
        }

        #endregion


        #region【API接口】

        /// <summary>
        /// 发送微信模板消息的【API接口】
        /// </summary>
        /// <returns></returns>
        public string SendWxTemplateMsg()
        {
            //----获取传递的参数
            //关注用户的OpenID 
            string WxOpenID = PublicClass.FilterRequestTrimNoConvert("WxOpenID");
            //模板ID  [EtKJ1flnGABM8zPcXQDP4iVmYx_023y8x_bCdv81sI4]
            string TempalteID = PublicClass.FilterRequestTrimNoConvert("TempalteID");
            //模板内容Json字符串
            string TemplateJsonData = PublicClass.FilterRequestTrimNoConvert("TemplateJsonData");

            //----可选参数
            //单击微信里的通知内容面板 跳转的类型[Web, WxMini]
            string ClickGoType = PublicClass.FilterRequestTrimNoConvert("ClickGoType");
            //当pClickGoType=Web时，跳转的URL [https://www.baidu.com]
            string ClickGoUrl = PublicClass.FilterRequestTrimNoConvert("ClickGoUrl");
            //当pClickGoType = WxMini时，跳转到小程序的URL[index?foo=bar]
            string WxMiniPagePath = PublicClass.FilterRequestTrimNoConvert("WxMiniPagePath");
            //小程序的AppID
            string WxMiniAppID = PublicClass.FilterRequestTrimNoConvert("WxMiniAppID");

            //调用发送微信消息的函数
            string _sendBackMsg = BusiWxTemplateMessage.sendWxTemplateMsg(WxOpenID, TempalteID, TemplateJsonData, "", ClickGoType, ClickGoUrl, WxMiniPagePath, WxMiniAppID);
            return _sendBackMsg; //CWTM_01 模板消息发送成功 其他的为Http返回的原数据


            /// 模板消息内容的Json字符串
            // myJsVal += "              \"first\": {";
            // myJsVal += "                       \"value\":\"恭喜你购买成功！\",";
            // myJsVal += "                       \"color\":\"#173177\"";
            // myJsVal += "                   },";
            // myJsVal += "                   \"keyword1\":{";
            // myJsVal += "                       \"value\":\"巧克力\",";
            // myJsVal += "                       \"color\":\"#173177\"";
            // myJsVal += "                   },";
            // myJsVal += "                   \"keyword2\": {";
            // myJsVal += "                       \"value\":\"39.8元\",";
            // myJsVal += "                       \"color\":\"#173177\"";
            // myJsVal += "                   },";
            // myJsVal += "                   \"keyword3\": {";
            // myJsVal += "                       \"value\":\"2014年9月22日\",";
            // myJsVal += "                       \"color\":\"#173177\"";
            // myJsVal += "                   },";
            // myJsVal += "                   \"remark\":{";
            // myJsVal += "                       \"value\":\"欢迎再次购买！\",";
            // myJsVal += "                       \"color\":\"#173177\"";
            // myJsVal += "                   }";
        }

        /// <summary>
        /// 发送 微信普通红包 , "SRPC_01" 放发成功
        /// </summary>
        /// <returns></returns>
        public string SendWxRedPacketCommon()
        {
            //----获取传递的参数
            //关注用户的OpenID 
            string ReceiOpenID = PublicClass.FilterRequestTrimNoConvert("ReceiOpenID");
            //商户订单号 [52869656555555545] 一天内不能重复的数字
            string BillNumber = PublicClass.FilterRequestTrimNoConvert("BillNumber");
            //发送红包的活动名称,可自定义 [发红包的活动名称]
            string ActName = PublicClass.FilterRequestTrimNoConvert("ActName");
            //红包备注信息 [猜越多得越多，快来抢！]
            string Remark = PublicClass.FilterRequestTrimNoConvert("Remark");
            //红包发送者名称 [天虹百货]
            string SendName = PublicClass.FilterRequestTrimNoConvert("SendName");
            //付款金额，单位分  单个红包的金额 [1000]
            string TotalAmount = PublicClass.FilterRequestTrimNoConvert("TotalAmount");
            //红包祝福语 [恭喜发财]
            string Wishing = PublicClass.FilterRequestTrimNoConvert("Wishing");
            //发放红包使用场景，红包金额大于200或者小于1元时必传
            //PRODUCT_1:商品促销 ,PRODUCT_2:抽奖 ,PRODUCT_3:虚拟物品兑奖  ,PRODUCT_4:企业内部福利 
            //PRODUCT_5:渠道分润 ,PRODUCT_6:保险回馈 ,PRODUCT_7:彩票派奖 ,PRODUCT_8:税务刮奖
            string SceneID = PublicClass.FilterRequestTrimNoConvert("SceneID");

            //调用 发送 微信普通红包 , "SRPC_01" 放发成功
            return BusiWxRedPacketNS.BusiWxRedPacket.sendWxRedPacketCommon(ReceiOpenID, BillNumber, ActName, Remark, SendName, TotalAmount, Wishing, SceneID);
        }

        /// <summary>
        /// 获取微信的 APPID 和 APPSECRET
        /// </summary>
        /// <returns></returns>
        public string GetWxAppIDAppScecret()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 获取微信的 APPID 和 APPSECRET
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {

                string _json = "{";
                _json += "\"APPID\":\"" + BusiDbSysConfig.getSystemConfigParam("WxPay_APPID", "OctThirdApiCallSystem") + "\",";
                _json += "\"APPSECRET\":\"" + BusiDbSysConfig.getSystemConfigParam("WxPay_APPSECRET", "OctThirdApiCallSystem") + "\"";
                _json += "}";
                return _json;
            }

            return "";
        }

        #endregion




    }
}