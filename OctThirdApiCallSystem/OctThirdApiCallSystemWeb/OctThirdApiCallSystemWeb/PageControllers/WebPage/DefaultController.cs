using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【默认公共页面-处理公共业务逻辑】页面Page控制器
/// </summary>
namespace OctThirdApiCallSystemWeb.PageControllers.WebPage
{
    public class DefaultController : Controller
    {
        // GET: Default
        public ActionResult Index()
        {
            return View();
        }

    }
}