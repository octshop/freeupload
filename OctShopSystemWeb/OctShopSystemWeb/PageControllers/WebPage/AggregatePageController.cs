using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【聚合支付】相关Page页面控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.WebPage
{
    public class AggregatePageController : Controller
    {
        // GET: Aggregate
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 今日扫码支付
        /// </summary>
        /// <returns></returns>
        public ActionResult AggregateOrderToday()
        {
           

            return View();
        }


        /// <summary>
        /// 扫码支付订单
        /// </summary>
        /// <returns></returns>
        public ActionResult AggregateOrderMsg()
        {
         


            return View();
        }


        /// <summary>
        /// 扫码支付订单详情
        /// </summary>
        /// <returns></returns>
        public ActionResult AggreOrderDetail()
        {
           


            return View();
        }

        /// <summary>
        /// 生成收款二维码
        /// </summary>
        /// <returns></returns>
        public ActionResult CreateReceiPayQRCode()
        {

            return View();
        }
    }
}