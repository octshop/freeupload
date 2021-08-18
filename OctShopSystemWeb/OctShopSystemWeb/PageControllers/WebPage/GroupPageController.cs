using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【拼团】相关Page页面控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.WebPage
{
    public class GroupPageController : Controller
    {
        /// <summary>
        /// 拼团商品设置信息
        /// </summary>
        /// <returns></returns>
        public ActionResult GroupGoodsSetting()
        {

            return View();
        }

        /// <summary>
        /// 发起拼团管理,开团信息
        /// </summary>
        /// <returns></returns>
        public ActionResult GroupCreateMsg()
        {

            return View();
        }

        /// <summary>
        /// 加入拼团信息,拼团参与信息
        /// </summary>
        /// <returns></returns>
        public ActionResult GroupJoinMsg()
        {
            return View();
        }


    }
}