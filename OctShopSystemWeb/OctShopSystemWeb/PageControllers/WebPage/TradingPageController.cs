using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【交易】相关Page页面控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.WebPage
{
    public class TradingPageController : Controller
    {
        // GET: TradingPage
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 订单管理
        /// </summary>
        /// <returns></returns>
        public ActionResult OrderMan()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../TradingPage/OrderMan");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain;

            //获取传递的参数
            ViewBag.OrderTime = PublicClass.FilterRequestTrimNoConvert("OrderTime");
            ViewBag.OrderStatus = PublicClass.FilterRequestTrim("OrderStatus");

            return View();
        }

        /// <summary>
        /// 订单详情
        /// </summary>
        /// <returns></returns>
        public ActionResult OrderDetail()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../TradingPage/OrderDetail");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }


            //获取传递的参数
            string _orderID = PublicClass.isReqAndBackReqVal("OID", "", false);
            if (string.IsNullOrWhiteSpace(_orderID))
            {
                return Content("参数传递错误");
            }

            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain;

            ViewBag.OrderID = _orderID;

            return View();
        }

        /// <summary>
        /// 订单核销验证
        /// </summary>
        /// <returns></returns>
        public ActionResult VerifyCheckCodeOrderStatus()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../TradingPage/VerifyCheckCodeOrderStatus");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain.ToString().Trim();

            return View();
        }

        /// <summary>
        /// 订单发票管理
        /// </summary>
        /// <returns></returns>
        public ActionResult OrderInvoice()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../TradingPage/OrderInvoice");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain;

            return View();
        }
    }
}