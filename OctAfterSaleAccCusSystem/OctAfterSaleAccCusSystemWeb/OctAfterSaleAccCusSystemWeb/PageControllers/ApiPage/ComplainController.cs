using BusiApiKeyVerifyNS;
using OctAfterSaleAccCusNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【投诉】API接口控制器
/// </summary>
namespace OctAfterSaleAccCusSystemWeb.PageControllers.ApiPage
{
    public class ComplainController : Controller
    {
        // GET: Complain
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 投诉信息
        /// </summary>
        /// <returns></returns>
        public string OrderComplainMsg()
        {
            return "";
        }


    }
}