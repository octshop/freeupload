using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【聚合扫码支付】相关页面 Controller
/// </summary>
namespace OctWapWeb.PageControllers.WebPage
{
    public class AggregateController : Controller
    {
        /// <summary>
        /// 聚合扫码支付-首页
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            

            return View();
        }

        /// <summary>
        /// 直接支付
        /// </summary>
        /// <returns></returns>
        public ActionResult PayDirect()
        {
           

            return View();
        }

        /// <summary>
        /// 余额支付
        /// </summary>
        /// <returns></returns>
        public ActionResult PayBalance()
        {

            return View();
        }


    }
}