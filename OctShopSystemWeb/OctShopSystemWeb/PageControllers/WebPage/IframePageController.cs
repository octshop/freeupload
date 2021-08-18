using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【Iframe加载的相关页控制器-开发推荐使用】
/// </summary>
namespace OctShopSystemWeb.PageControllers.WebPage 
{
    public class IframePageController : Controller
    {
        /// <summary>
        /// 首页
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 信息统计
        /// </summary>
        /// <returns></returns>
        public ActionResult MsgCount()
        {
            return View();
        }

        /// <summary>
        /// 商品列表及操作
        /// </summary>
        /// <returns></returns>
        public ActionResult GoodsList()
        {
            return View();
        }

    }
}