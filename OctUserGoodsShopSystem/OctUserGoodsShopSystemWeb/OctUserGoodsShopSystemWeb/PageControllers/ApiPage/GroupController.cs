using BusiApiKeyVerifyNS;
using OctUserGoodsShopSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【拼团】相关的API接口控制器
/// </summary>
namespace OctUserGoodsShopSystemWeb.PageControllers.ApiPage
{
    public class GroupController : Controller
    {
        // GET: Group
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 拼团商品设置信息
        /// </summary>
        /// <returns></returns>
        public string GroupGoodsSetting()
        {
            return "";
        }

        /// <summary>
        /// 拼团发起信息
        /// </summary>
        /// <returns></returns>
        public string GroupCreateMsg()
        {
            return "";
        }

        /// <summary>
        /// 加入拼团信息
        /// </summary>
        /// <returns></returns>
        public string GroupJoinMsg()
        {
            return "";
        }


    }
}