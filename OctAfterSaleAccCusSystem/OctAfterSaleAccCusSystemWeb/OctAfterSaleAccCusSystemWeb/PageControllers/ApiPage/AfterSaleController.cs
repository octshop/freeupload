using BusiApiKeyVerifyNS;
using OctAfterSaleAccCusNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【售后】API接口控制器
/// </summary>
namespace OctAfterSaleAccCusSystemWeb.PageControllers.ApiPage
{
    public class AfterSaleController : Controller
    {
        // GET: AfterSale
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 售后申请信息
        /// </summary>
        /// <returns></returns>
        public string AfterSaleApplyMsg()
        {
            return "";
        }

        /// <summary>
        /// 售后收货信息
        /// </summary>
        /// <returns></returns>
        public string AfterSaleDelivery()
        {
            return "";
        }

        /// <summary>
        /// 售后发货信息
        /// </summary>
        /// <returns></returns>
        public string AfterSaleSendGoods()
        {

            return "";
        }

        /// <summary>
        /// 售后问题图片信息
        /// </summary>
        /// <returns></returns>
        public string AfterSaleProblemImgs()
        {
            return "";
        }


    }
}