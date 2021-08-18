using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WeChatJsSdk.SdkCore;

/// <summary>
/// 【商城O2o】相关页面控制器
/// </summary>
namespace OctWapWeb.PageControllers.WebPage
{
    public class O2oController : Controller
    {
        /// <summary>
        /// 商城首页 O2o -- 附近首页
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {

            ViewBag.TechSupport = BusiCode.getTechSupportXhtml();
            //PublicClass.clearCookieValue("LngLatCookie");

            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            //if (string.IsNullOrWhiteSpace(ViewBag.BuyerUserID))
            //{
            //    //判断是否为微信扫码进入 --微信中
            //    if (PublicClass.isInWeiXinBrowse() == true)
            //    {
            //        //到买家登录页
            //        Response.Redirect("../Login/Buyer?BackUrl=../O2o/Index");
            //        return null;
            //    }
            //}

            //得到当前选择城市Cookie中的
            ViewBag.SelCityRegionArrCookie = BusiWebCookie.getSelCityRegionArrCookie();


            //再次---获取登录的买家UserID-----
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            #region【初始化 微信JS-SDK】

            ViewBag.IsInWeiXinBrowse = "false"; //是否在微信中

            //判断是否为微信扫码进入 --微信中
            if (PublicClass.isInWeiXinBrowse() == true)
            {
                ViewBag.IsInWeiXinBrowse = "true"; //是否在微信中


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

                //Http请求 得到微信的 APPID 和 APPSECRET
                Dictionary<string, object> _dicWx = BusiBuyer.httpWxAppIDAppScecret();
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

        #region【商家相关】

        /// <summary>
        /// 附近商家
        /// </summary>
        /// <returns></returns>
        public ActionResult ShopNear()
        {
            //PublicClass.clearCookieValue("LngLatCookie");

            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            //if (string.IsNullOrWhiteSpace(ViewBag.BuyerUserID))
            //{
            //    //判断是否为微信扫码进入 --微信中
            //    if (PublicClass.isInWeiXinBrowse() == true)
            //    {
            //        //到买家登录页
            //        Response.Redirect("../Login/Buyer?BackUrl=../O2o/Index");
            //        return null;
            //    }
            //}

            //得到当前选择城市Cookie中的
            ViewBag.SelCityRegionArrCookie = BusiWebCookie.getSelCityRegionArrCookie();


            //再次---获取登录的买家UserID-----
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];


            #region【初始化 微信JS-SDK】

            ViewBag.IsInWeiXinBrowse = "false"; //是否在微信中

            //判断是否为微信扫码进入 --微信中
            if (PublicClass.isInWeiXinBrowse() == true)
            {
                ViewBag.IsInWeiXinBrowse = "true"; //是否在微信中

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
                //Http请求 得到微信的 APPID 和 APPSECRET
                Dictionary<string, object> _dicWx = BusiBuyer.httpWxAppIDAppScecret();
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

        /// <summary>
        /// 附近商家-分类
        /// </summary>
        /// <returns></returns>
        public ActionResult ShopNearType()
        {
            ViewBag.FatherTypeID = PublicClass.FilterRequestTrim("STID");
            if (string.IsNullOrWhiteSpace(ViewBag.FatherTypeID))
            {
                Response.Redirect("../O2O/ShopNear");
            }

            ViewBag.ShopTypeName = PublicClass.FilterRequestTrim("STIDN");

            return View();
        }

        #endregion

        #region【商品相关】

        /// <summary>
        /// O2o商品首页 - 同城优选
        /// </summary>
        /// <returns></returns>
        public ActionResult GoodsIndex()
        {
            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            return View();
        }

        /// <summary>
        /// O2o商品类别
        /// </summary>
        /// <returns></returns>
        public ActionResult GoodsType()
        {
            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            //第三级商品类目ID
            ViewBag.GoodsTypeIDThird = PublicClass.FilterRequestTrim("GTID");
            if (string.IsNullOrWhiteSpace(ViewBag.GoodsTypeIDThird))
            {
                return null;
            }


            return View();
        }

        /// <summary>
        /// O2O商品类别列表展示
        /// </summary>
        /// <returns></returns>
        public ActionResult GoodsTypeO2o()
        {
            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            //第二级商品类目ID
            ViewBag.GoodsTypeIDSec = PublicClass.FilterRequestTrim("GTIDSe");
            if (string.IsNullOrWhiteSpace(ViewBag.GoodsTypeIDSec))
            {
                return null;
            }
            //第二级商品类目名称
            ViewBag.GoodsTypeNameSec = PublicClass.FilterRequestTrim("GTNaSe");


            return View();
        }



        #endregion

        #region【团购优惠】

        /// <summary>
        /// 团购优惠
        /// </summary>
        /// <returns></returns>
        public ActionResult GroupBuyO2o()
        {
          

            return View();
        }

        #endregion

        #region【抢购秒杀】

        /// <summary>
        /// 抢购秒杀
        /// </summary>
        /// <returns></returns>
        public ActionResult SecondsKillO2o()
        {
           

            return View();
        }

        #endregion

        #region【折扣商品】

        /// <summary>
        /// 折扣商品
        /// </summary>
        /// <returns></returns>
        public ActionResult DiscountGoodsO2o()
        {
            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            return View();
        }

        #endregion

        #region【礼品兑换】

        /// <summary>
        /// 礼品兑换
        /// </summary>
        /// <returns></returns>
        public ActionResult PresentExchangeO2o()
        {
           

            return View();
        }

        #endregion

        #region【领券中心】

        /// <summary>
        /// 领券中心 - 实体店
        /// </summary>
        /// <returns></returns>
        public ActionResult CouponsO2o()
        {
            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            return View();
        }

        #endregion

        #region【幸运抽奖】

        /// <summary>
        /// 幸运抽奖
        /// </summary>
        /// <returns></returns>
        public ActionResult LuckyDrawO2o()
        {
           

            return View();
        }

        #endregion

        #region【活动优惠】

        /// <summary>
        /// 活动优惠
        /// </summary>
        /// <returns></returns>
        public ActionResult ActivityO2o()
        {
            return View();
        }

        #endregion


    }
}