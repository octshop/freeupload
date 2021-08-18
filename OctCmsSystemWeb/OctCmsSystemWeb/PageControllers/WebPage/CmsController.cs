using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


/// <summary>
/// 【CMS系统管理功能】相关页面控制器
/// </summary>
namespace OctCmsSystemWeb.PageControllers.WebPage
{
    public class CmsController : Controller
    {
        // GET: Cms
        public ActionResult Index()
        {
            return View();
        }
    }
}