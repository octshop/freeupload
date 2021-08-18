using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【在线客服】相关页面控制器
/// </summary>
namespace OctWapWeb.PageControllers.WebPage
{
    public class CusServiceController : Controller
    {
        // GET: CusService
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 聊天主页
        /// </summary>
        /// <returns></returns>
        public ActionResult ChatMain()
        {
            return View();
        }

    }
}