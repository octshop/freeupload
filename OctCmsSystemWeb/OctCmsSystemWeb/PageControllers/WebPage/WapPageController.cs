using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【CMS后台-移动版h5】 -- Page控制器
/// </summary>
namespace OctCmsSystemWeb.PageControllers.WebPage
{
    public class WapPageController : Controller
    {
        /// <summary>
        /// CMS后台移动版h5 - 首页
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            Response.Redirect("../NavPage/Index");
            return null;
            //return View();
        }


    }
}