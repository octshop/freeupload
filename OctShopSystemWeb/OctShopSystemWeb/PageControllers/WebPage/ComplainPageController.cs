using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【投诉】相关Page页面控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.WebPage
{
    public class ComplainPageController : Controller
    {
        /// <summary>
        /// 投诉信息
        /// </summary>
        /// <returns></returns>
        public ActionResult ComplainMsg()
        {
           

            return View();
        }


        /// <summary>
        /// 投诉详情
        /// </summary>
        /// <returns></returns>
        public ActionResult ComplainDetail()
        {
           
            return View();

        }

    }
}