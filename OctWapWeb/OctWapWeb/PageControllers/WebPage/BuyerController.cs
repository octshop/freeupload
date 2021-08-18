using EncryptionClassNS;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PublicClassNS;
using System.Collections.Generic;
using System.Web.Mvc;
using WeChatJsSdk.SdkCore;

/// <summary>
/// 【买家中心】相关页面Controller
/// </summary>
namespace OctWapWeb.PageControllers.WebPage
{
    public class BuyerController : Controller
    {
        /// <summary>
        /// 买家中心
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {

            ViewBag.TechSupport = BusiCode.getTechSupportXhtml();


            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Buyer/Index")))
            {
                return Content("用户登录错误！");
            }


            //再次---获取登录的买家UserID-----
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            //商家管理平台域名
            ViewBag.OctShopSystemWeb_AddrDomain = WebAppConfig.OctShopSystemWeb_AddrDomain;


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

        #region 【订单相关】

        /// <summary>
        /// 我的订单
        /// </summary>
        /// <returns></returns>
        public ActionResult MyOrder()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Buyer/MyOrder")))
            {
                return Content("用户登录错误！");
            }

            //获取传递的参数
            string OrderStatus = PublicClass.FilterRequestTrim("OS");
            ViewBag.OrderStatus = OrderStatus;

            return View();
        }

        /// <summary>
        /// 我的订单搜索
        /// </summary>
        /// <returns></returns>
        public ActionResult MyOrderQuery()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Buyer/MyOrderQuery")))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        #endregion

        #region【拼团订单】

        /// <summary>
        /// 我的订单
        /// </summary>
        /// <returns></returns>
        public ActionResult MyOrderGroup()
        {

            return View();
        }

        #endregion

        #region【礼品订单】

        /// <summary>
        /// 我的礼品订单列表
        /// </summary>
        /// <returns></returns>
        public ActionResult MyPresentOrder()
        {

            return View();
        }

        #endregion

        #region【到店消费/自取-订单】

        /// <summary>
        /// 到店消费/自取 - 订单
        /// </summary>
        /// <returns></returns>
        public ActionResult ShopExpenseTake()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Buyer/ShopExpenseTake")))
            {
                return Content("用户登录错误！");
            }

            //获取传递的参数
            string OrderStatus = PublicClass.FilterRequestTrim("OS"); //预加载的订单状态
            ViewBag.OrderStatus = OrderStatus;

            return View();
        }

        #endregion

        #region【货到付款订单】

        /// <summary>
        /// 货到付款订单
        /// </summary>
        /// <returns></returns>
        public ActionResult PayDeliveryOrder()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Buyer/PayDeliveryOrder")))
            {
                return Content("用户登录错误！");
            }

            //获取传递的参数
            string OrderStatus = PublicClass.FilterRequestTrim("OS"); //预加载的订单状态
            ViewBag.OrderStatus = OrderStatus;


            return View();
        }

        #endregion

        #region 【收货地址】

        /// <summary>
        /// 收货地址列表
        /// </summary>
        /// <returns></returns>
        public ActionResult ReceiAddrList()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Buyer/ReceiAddrList")))
            {
                return Content("用户登录错误！");
            }

            //设置登录用户的Cookie信息 ---用于测试
            //BusiLogin.setLoginCookie("10002", "111111");

            //获取买家登录的UserID
            //ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            return View();
        }

        /// <summary>
        /// 添加收货地址
        /// </summary>
        /// <returns></returns>
        public ActionResult ReceiAddrAdd()
        {
            //设置登录用户的Cookie信息 ---用于测试
            //BusiLogin.setLoginCookie("10002", "111111");

            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Buyer/ReceiAddrAdd")))
            {
                return Content("用户登录错误！");
            }


            //获取买家登录的UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            return View();
        }

        /// <summary>
        /// 编辑收货地址
        /// </summary>
        /// <returns></returns>
        public ActionResult ReceiAddrEdit()
        {
            //设置登录用户的Cookie信息 ---用于测试
            //BusiLogin.setLoginCookie("10002", "111111");
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Buyer/ReceiAddrEdit")))
            {
                return Content("用户登录错误！");
            }


            //判断是否传递了必须参数
            ViewBag.RAID = PublicClassNS.PublicClass.isReqAndBackReqVal("RAID", "../Buyer/ReceiAddrList");


            return View();
        }

        #endregion

        #region 【评价相关】

        /// <summary>
        /// 评价中心
        /// </summary>
        /// <returns></returns>
        public ActionResult AppraiseCenter()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Buyer/AppraiseCenter")))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        /// <summary>
        /// 评价晒单表单
        /// </summary>
        /// <returns></returns>
        public ActionResult AppraiseForm()
        {
            //---判断用户是否登录---//
            string _loginBuyerUserID = BusiLogin.isLoginPageRetrunUserID("../Buyer/AppraiseForm");
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return Content("用户登录错误！");
            }

            //获取传递的参数
            string _orderID = PublicClass.FilterRequestTrim("OID");
            if (string.IsNullOrWhiteSpace(_orderID))
            {
                return Content("参数传递错误！");
            }

            //获取登录买家UserID
            ViewBag.UserID = _loginBuyerUserID;

            ViewBag.OrderID = _orderID;

            return View();
        }

        /// <summary>
        /// 店铺评价
        /// </summary>
        /// <returns></returns>
        public ActionResult AppraiseShop()
        {
            //---判断用户是否登录---//
            string _loginBuyerUserID = BusiLogin.isLoginPageRetrunUserID("../Buyer/AppraiseShop");
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        /// <summary>
        /// 评价详情
        /// </summary>
        /// <returns></returns>
        public ActionResult AppraiseDetail()
        {
            //---判断用户是否登录---//
            string _loginBuyerUserID = BusiLogin.isLoginPageRetrunUserID("../Buyer/AppraiseDetail");
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return Content("用户登录错误！");
            }

            //获取传递的参数
            string _orderID = PublicClass.FilterRequestTrim("OID");
            if (string.IsNullOrWhiteSpace(_orderID))
            {
                return Content("参数传递错误！");
            }

            //获取登录买家UserID
            //ViewBag.UserID = _loginBuyerUserID;

            ViewBag.OrderID = _orderID;

            return View();
        }

        #endregion

        #region 【优惠券】

        /// <summary>
        /// 我的优惠券
        /// </summary>
        /// <returns></returns>
        public ActionResult CouponsMy()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Buyer/CouponsMy")))
            {
                return Content("用户登录错误！");
            }


            return View();
        }

        /// <summary>
        /// 优惠券详情
        /// </summary>
        /// <returns></returns>
        public ActionResult CouponsDetail()
        {
            //---判断用户是否登录---//
            ViewBag.BuyerUserID = BusiLogin.isLoginPageRetrunUserID("", "");

            ViewBag.CID = PublicClass.FilterRequestTrim("CID");
            ViewBag.IID = PublicClass.FilterRequestTrim("IID");

            return View();
        }

        #endregion

        #region 【我的投诉】

        /// <summary>
        /// 我的投诉 
        /// </summary>
        /// <returns></returns>
        public ActionResult ComplainMy()
        {
          
            return View();
        }

        /// <summary>
        /// 提交投诉 
        /// </summary>
        /// <returns></returns>
        public ActionResult ComplainSubmit()
        {
           



            return View();
        }

        /// <summary>
        /// 投诉详情 
        /// </summary>
        /// <returns></returns>
        public ActionResult ComplainDetail()
        {
          
            return View();
        }

        #endregion

        #region 【买家消息】

        /// <summary>
        /// 买家消息列表
        /// </summary>
        /// <returns></returns>
        public ActionResult BuyerMsg()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Buyer/BuyerMsg")))
            {
                return Content("用户登录错误！");
            }


            return View();
        }

        #endregion

        #region【抽奖信息】

        /// <summary>
        /// 抽奖信息
        /// </summary>
        /// <returns></returns>
        public ActionResult LuckyDrawMsg()
        {

            return View();
        }

        /// <summary>
        /// 中奖详情
        /// </summary>
        /// <returns></returns>
        public ActionResult LuckyDrawDetail()
        {
           
            return View();
        }

        #endregion

        #region【参与活动】

        /// <summary>
        /// 参与活动
        /// </summary>
        /// <returns></returns>
        public ActionResult ActivityList()
        {
         

            return View();
        }

        #endregion

        #region【我的推广会员】

        /// <summary>
        /// 我推广的人
        /// </summary>
        /// <returns></returns>
        public ActionResult MyPromoteUser()
        {
           

            return View();
        }

        /// <summary>
        /// 我的推广码
        /// </summary>
        /// <returns></returns>
        public ActionResult MyPromoteQRCode()
        {

          

            return View();
        }

        /// <summary>
        /// 被推广人-扫码 - 推广者的二维码 跳转处理页 -- 一般是进入了被推广者的手机
        /// </summary>
        /// <returns></returns>
        public ActionResult ScanQRCodeRedirect()
        {

            return View();
        }


        #endregion


        /// <summary>
        /// 关注收藏
        /// </summary>
        /// <returns></returns>
        public ActionResult AttenFav()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Buyer/AttenFav")))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        /// <summary>
        /// 浏览足迹
        /// </summary>
        /// <returns></returns>
        public ActionResult History()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Buyer/History")))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        /// <summary>
        /// 买家设置
        /// </summary>
        /// <returns></returns>
        public ActionResult Setting()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Buyer/Setting")))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        /// <summary>
        /// 官方客服
        /// </summary>
        /// <returns></returns>
        public ActionResult OfficialService()
        {
            ViewBag.BuyerUserID = BusiLogin.getLoginUserID();

            return View();
        }

        /// <summary>
        /// 说明事项-说明性文本列表
        /// </summary>
        /// <returns></returns>
        public ActionResult QuestionList()
        {

            return View();
        }

        /// <summary>
        /// 说明性文本，问题详情
        /// </summary>
        /// <returns></returns>
        public ActionResult QuestionDetail()
        {
            ViewBag.ExplainID = PublicClass.FilterRequestTrim("EID");
            ViewBag.ExplainType = PublicClass.FilterRequestTrim("EType");
            ViewBag.ExplainTitle = PublicClass.FilterRequestTrim("ETitle");

            ViewBag.TitleBarDisplay = PublicClass.FilterRequestTrim("TbDisplay");
            ViewBag.MarginTop = "0px";
            if (string.IsNullOrWhiteSpace(ViewBag.TitleBarDisplay))
            {
                ViewBag.TitleBarDisplay = "normal";
                ViewBag.MarginTop = "40px";
            }
            else
            {
                if (ViewBag.TitleBarDisplay != "none")
                {
                    ViewBag.MarginTop = "40px";
                }
            }


            return View();
        }

    }
}