using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【拼团】相关页面控制器
/// </summary>
namespace OctWapWeb.PageControllers.WebPage
{
    public class GroupController : Controller
    {
        // GET: Group
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 拼团商品详情
        /// </summary>
        /// <returns></returns>
        public ActionResult GroupDetail()
        {
    
            return View();

        }


    }
}