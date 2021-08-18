using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【礼品】相关页面控制器
/// </summary>
namespace OctWapWeb.PageControllers.WebPage
{
    public class PresentController : Controller
    {
        /// <summary>
        /// 礼品订购
        /// </summary>
        /// <returns></returns>
        public ActionResult PresentDetail()
        {
           
            return View();
        }

        /// <summary>
        /// 礼品内容详情
        /// </summary>
        /// <returns></returns>
        public ActionResult PresentDetailMsg()
        {
           


            return View();
        }

        /// <summary>
        /// 礼品详情页，手机Web端预览，用Iframe指定宽度加载
        /// </summary>
        /// <returns></returns>
        public ActionResult PresentDetailPreMobileIframe()
        {
          


            return View();
        }




    }
}