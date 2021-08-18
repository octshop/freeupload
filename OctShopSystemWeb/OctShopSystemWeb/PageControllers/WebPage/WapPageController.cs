using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【手机Web移动端】相关Page页面控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.WebPage
{
    public class WapPageController : Controller
    {
        /// <summary>
        /// 手机Web首页
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../WapPage/Index");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("商家登录错误，请重新登录！<a href=\"../LoginPage/Index\">立即登录</a>");
            }

            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain;
            //IM在线客服系统域名地址URL
            ViewBag.ImSystemWebDomainURL = WebAppConfig.ImSystemWebDomainURL;

            return View();
        }

        #region【大图标导航列表】

        /// <summary>
        /// 店铺详情信息
        /// </summary>
        /// <returns></returns>
        public ActionResult ShopDetail()
        {
            //获取传递的参数
            ViewBag.ShopID = PublicClass.isReqAndBackReqVal("SID", "../WapPage/ShopDetail");

            return View();
        }

        /// <summary>
        /// 核销验证 - 所有需要验证码的
        /// </summary>
        /// <returns></returns>
        public ActionResult VerifyCode()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../WapPage/VerifyCode");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("商家登录错误，请重新登录！<a href=\"../LoginPage/Index\">立即登录</a>");
            }

            //获取传递的参数
            ViewBag.VerifyType = PublicClass.FilterRequestTrim("VerifyType");
            ViewBag.ExtraDataID = PublicClass.FilterRequestTrim("EDID");
            if (string.IsNullOrWhiteSpace(ViewBag.ExtraDataID))
            {
                ViewBag.ExtraDataID = "选填";
            }

            return View();
        }

        /// <summary>
        /// 二维码生成
        /// </summary>
        /// <returns></returns>
        public ActionResult CreateQRScan()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../WapPage/VerifyCode");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("商家登录错误，请重新登录！<a href=\"../LoginPage/Index\">立即登录</a>");
            }

            //获取店铺ID
            ViewBag.ShopID = PublicClass.FilterRequestTrim("SID");

            ViewBag.OctUserGoodsShopSystemWeb_ApiDomain = WebAppConfig.OctUserGoodsShopSystemWeb_ApiDomain;

            ViewBag.QRCodeURL = ViewBag.OctUserGoodsShopSystemWeb_ApiDomain + "/ToolWeb/QrCodeImg?QrCodeContent=" + WebAppConfig.OctWapWeb_AddrDomain + "/Shop/Index?SID=" + ViewBag.ShopID;


            ViewBag.OctUserGoodsShopSystemWeb_ApiDomain = WebAppConfig.OctUserGoodsShopSystemWeb_ApiDomain;

            ViewBag.QRCodeURLAggregate = ViewBag.OctUserGoodsShopSystemWeb_ApiDomain + "/ToolWeb/QrCodeImg?QrCodeContent=" + WebAppConfig.OctWapWeb_AddrDomain + "/Aggregate/Index?SID=" + ViewBag.ShopID;



            //---------生成小程序的收款二维码--------------//
            if (WebAppConfig.IsOpenWxMiniClient == "true")
            {
                ViewBag.MiniAggreDisplay = "normal";

                //测试用的
                //ViewBag.WxMiniAggreQRCodeURL = WebAppConfig.OctMallMiniWeb_AddrDomain + "/WxMiniApi/MiniScanImgShow?MiniPagePath=pages/tabbar/search/search&Scene=11023";

                //正式的
                ViewBag.WxMiniAggreQRCodeURL = WebAppConfig.OctMallMiniWeb_AddrDomain + "/WxMiniApi/MiniScanImgShow?MiniPagePath=pages/shop/aggregate/index/index&Scene=" + ViewBag.ShopID;

            }
            else
            {
                ViewBag.MiniAggreDisplay = "none";
                ViewBag.WxMiniAggreQRCodeURL = "";
            }


            //---------生成小程序的店铺二维码--------------//
            if (WebAppConfig.IsOpenWxMiniClient == "true")
            {
                ViewBag.MiniShopDisplay = "normal";

                //测试用的
                //ViewBag.WxMiniShopQRCodeURL = WebAppConfig.OctMallMiniWeb_AddrDomain + "/WxMiniApi/MiniScanImgShow?MiniPagePath=pages/tabbar/search/search&Scene=11023";

                //正式的
                ViewBag.WxMiniShopQRCodeURL = WebAppConfig.OctMallMiniWeb_AddrDomain + "/WxMiniApi/MiniScanImgShow?MiniPagePath=pages/shop/index/index&Scene=" + ViewBag.ShopID;

            }
            else
            {
                ViewBag.MiniShopDisplay = "none";
                ViewBag.WxMiniShopQRCodeURL = "";
            }



            return View();
        }

        /// <summary>
        /// 今日扫码支付
        /// </summary>
        /// <returns></returns>
        public ActionResult AggregateOrderToday()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../WapPage/AggregateOrderToday")))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        /// <summary>
        /// 扫码收单
        /// </summary>
        /// <returns></returns>
        public ActionResult AggregateOrderMsg()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../WapPage/AggregateOrderMsg")))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        /// <summary>
        /// 交易流水
        /// </summary>
        /// <returns></returns>
        public ActionResult BalanceDetail()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../WapPage/BalanceDetail")))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        #region【订单相关】

        /// <summary>
        /// 订单管理 
        /// </summary>
        /// <returns></returns>
        public ActionResult MyOrder()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../WapPage/MyOrder");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("商家登录错误，请重新登录！<a href=\"../LoginPage/Index\">立即登录</a>");
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
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../WapPage/MyOrderQuery");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("商家登录错误，请重新登录！<a href=\"../LoginPage/Index\">立即登录</a>");
            }

            return View();
        }

        /// <summary>
        /// 订单详情
        /// </summary>
        /// <returns></returns>
        public ActionResult OrderDetail()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../WapPage/OrderDetail");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("商家登录错误，请重新登录！<a href=\"../LoginPage/Index\">立即登录</a>");
            }

            //获取传递的参数
            ViewBag.OrderID = PublicClass.FilterRequestTrim("OID");

            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain;

            return View();
        }

        /// <summary>
        /// 扫码支付订单详情
        /// </summary>
        /// <returns></returns>
        public ActionResult OrderAggreDetail()
        {
            //获取传递的参数
            ViewBag.AggreOrderID = PublicClass.FilterRequestTrim("AOID");

            return View();
        }

        /// <summary>
        /// 订单动态
        /// </summary>
        /// <returns></returns>
        public ActionResult OrderDynamic()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../WapPage/OrderDynamic");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("商家登录错误，请重新登录！<a href=\"../LoginPage/Index\">立即登录</a>");
            }

            //获取传递的参数
            string _hidOrderID = PublicClass.FilterRequestTrim("OID");
            if (string.IsNullOrWhiteSpace(_hidOrderID))
            {
                return Content("订单ID错误！");
            }

            ViewBag.OrderID = _hidOrderID;


            return View();
        }

        /// <summary>
        /// 订单快递 详情页
        /// </summary>
        /// <returns></returns>
        public ActionResult ExpressDetail()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../WapPage/ExpressDetail");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("商家登录错误，请重新登录！<a href=\"../LoginPage/Index\">立即登录</a>");
            }

            //获取传递的参数
            string _hidOrderID = PublicClass.FilterRequestTrim("OID");
            if (string.IsNullOrWhiteSpace(_hidOrderID))
            {
                return Content("订单ID错误！");
            }

            ViewBag.OrderID = _hidOrderID;


            return View();
        }

        #endregion

        #region【商家结算】

        /// <summary>
        /// 商家结算申请
        /// </summary>
        /// <returns></returns>
        public ActionResult SettleApply()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../WapPage/SettleApply");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("商家登录错误，请重新登录！<a href=\"../LoginPage/Index\">立即登录</a>");
            }


            return View();
        }

        /// <summary>
        /// 结算详情
        /// </summary>
        /// <returns></returns>
        public ActionResult SettleDetail()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../WapPage/SettleDetail");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("商家登录错误，请重新登录！<a href=\"../LoginPage/Index\">立即登录</a>");
            }


            ViewBag.SettleID = PublicClass.FilterRequestTrim("SeID");

            return View();
        }

        /// <summary>
        /// 可结算订单列表
        /// </summary>
        /// <returns></returns>
        public ActionResult SettleOrder()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../WapPage/SettleOrder");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("商家登录错误，请重新登录！<a href=\"../LoginPage/Index\">立即登录</a>");
            }


            return View();
        }

        /// <summary>
        /// 结算商城订单列表
        /// </summary>
        /// <returns></returns>
        public ActionResult SettleOrderMall()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../WapPage/SettleOrderMall");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("商家登录错误，请重新登录！<a href=\"../LoginPage/Index\">立即登录</a>");
            }



            ViewBag.SettleID = PublicClass.FilterRequestTrim("SeID");

            return View();
        }

        /// <summary>
        /// 结算扫码订单列表
        /// </summary>
        /// <returns></returns>
        public ActionResult SettleOrderScan()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../WapPage/SettleOrderScan");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("商家登录错误，请重新登录！<a href=\"../LoginPage/Index\">立即登录</a>");
            }


            ViewBag.SettleID = PublicClass.FilterRequestTrim("SeID");

            return View();
        }

        /// <summary>
        /// 结算资料
        /// </summary>
        /// <returns></returns>
        public ActionResult SettleShopMsg()
        {
            string _loginUserID = BusiLogin.isLoginPageRetrunUserID("../WapPage/SettleShopMsg");
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return Content("用户登录错误！");
            }
            ViewBag.UserID = _loginUserID;

            ViewBag.RegionCodeArr = "430000_430100_430104";


            return View();
        }

        #endregion

        #endregion

        #region【横条小图标导航列表】

        /// <summary>
        /// 商家消息通知
        /// </summary>
        /// <returns></returns>
        public ActionResult ShopSysMsg()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../WapPage/ShopSysMsg")))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        #region【官方客服】

        /// <summary>
        /// 官方客服
        /// </summary>
        /// <returns></returns>
        public ActionResult OfficialService()
        {

            ViewBag.ImSystemWebDomainURL = WebAppConfig.ImSystemWebDomainURL;

            ViewBag.ImSystemShopUserAccount = WebAppConfig.ImSystemShopUserAccount;

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

            return View();
        }

        #endregion

        /// <summary>
        /// 系统设置
        /// </summary>
        /// <returns></returns>
        public ActionResult Setting()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../WapPage/Setting")))
            {
                return Content("用户登录错误！");
            }


            return View();
        }


        #endregion


    }
}