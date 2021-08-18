using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【支付】相关页面Controller
/// </summary>
namespace OctWapWeb.PageControllers.WebPage
{
    public class PayController : Controller
    {
        // GET: Pay
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 订单支付 [从订单详情进入]
        /// </summary>
        /// <returns></returns>
        public ActionResult OrderPay()
        {

            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Pay/OrderPay")))
            {
                return Content("用户登录错误！");
            }

            //获取传递过来的参数
            string _orderID = PublicClass.FilterRequestTrim("OID");
            if (string.IsNullOrWhiteSpace(_orderID))
            {
                return Content("订单信息错误！");
            }
            ViewBag.OrderID = _orderID;


            //是否选择修改收货 地址
            ViewBag.BReceiAddrID = "";
            string _BReceiAddrID = PublicClass.FilterRequestTrim("BID");
            if (string.IsNullOrWhiteSpace(_BReceiAddrID) == false)
            {
                ViewBag.BReceiAddrID = _BReceiAddrID;
            }

            return View();
        }

        #region 【支付同步跳转页】

        /// <summary>
        /// 支付成功的跳转页
        /// </summary>
        /// <returns></returns>
        public ActionResult PaySuRedirect()
        {
            //获取传递的参数
            ViewBag.BillNumber = PublicClass.isReqAndBackReqVal("BillNumber", "", false);

            if (string.IsNullOrWhiteSpace(ViewBag.BillNumber))
            {
                return null;
            }

            return View();
        }

        /// <summary>
        /// 支付成功的跳转页 -- 非商城订单模式
        /// </summary>
        /// <returns></returns>
        public ActionResult PaySuRedirectNoOrder()
        {
            //获取传递的参数
            ViewBag.BillNumber = PublicClass.isReqAndBackReqVal("BillNumber", "", false);

            if (string.IsNullOrWhiteSpace(ViewBag.BillNumber))
            {
                return null;
            }

            return View();
        }


        #endregion



    }
}