using BusiApiHttpNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【积分】相关Ajax请求控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.AjaxPage
{
    public class IntegralController : Controller
    {
        // GET: Integral
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 我的积分
        /// </summary>
        /// <returns></returns>
        public string IntegralMy()
        {
          

            return "";
        }

        /// <summary>
        /// 积分设置
        /// </summary>
        /// <returns></returns>
        public string IntegralSetting()
        {
           

            return "";
        }

        /// <summary>
        /// 商家充积分
        /// </summary>
        /// <returns></returns>
        public string IntegralRecharge()
        {
          

            return "";
        }

    }
}