using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【秒杀抢购】相关Page页面控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.WebPage
{
    public class SecKillPageController : Controller
    {
        // GET: SecKillPage
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 秒杀商品设置
        /// </summary>
        /// <returns></returns>
        public ActionResult SecKillGoodsMsg()
        {
           


            return View();
        }


    }
}