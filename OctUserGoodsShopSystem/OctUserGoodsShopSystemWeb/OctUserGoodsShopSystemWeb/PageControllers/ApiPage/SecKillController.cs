using BusiApiKeyVerifyNS;
using OctUserGoodsShopSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【秒杀抢购】相关的API接口控制器
/// </summary>
namespace OctUserGoodsShopSystemWeb.PageControllers.ApiPage
{
    public class SecKillController : Controller
    {
        // GET: SecKill
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 秒杀商品信息
        /// </summary>
        /// <returns></returns>
        public string SecKillGoodsMsg()
        {

            return "";
        }

        /// <summary>
        /// 秒杀商品分类
        /// </summary>
        /// <returns></returns>
        public string SecKillGoodsType()
        {
           

            return "";
        }


    }
}