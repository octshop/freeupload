using BusiApiKeyVerifyNS;
using OctFileUploadSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【售后】相关文件上传的API接口控制器
/// </summary>
namespace OctFileUploadSystemWeb.PageControllers.ApiPage
{
    public class AfterSaleController : Controller
    {
        // GET: AfterSale
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 【售后问题图片】相关操作
        /// </summary>
        /// <returns></returns>
        public string AfterSaleProblemImgs()
        {
            return "";
        }


    }
}