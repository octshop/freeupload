using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【商家结算】相关Page页面控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.WebPage
{
    public class SettlePageController : Controller
    {
        /// <summary>
        /// 商家结算资料
        /// </summary>
        /// <returns></returns>
        public ActionResult SettleShopMsg()
        {
            ViewBag.RegionCodeArr = "430000_430100_430104";

            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../SettlePage/SettleShopMsg");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            ViewBag.UserID = _shopUserID;

            return View();
        }

        /// <summary>
        /// 商家结算申请
        /// </summary>
        /// <returns></returns>
        public ActionResult SettleApply()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../SettlePage/SettleApply");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        /// <summary>
        /// 结算单详情
        /// </summary>
        /// <returns></returns>
        public ActionResult SettleDetail()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../SettlePage/SettleDetail");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            //获取传递的参数
            ViewBag.SAID = PublicClassNS.PublicClass.FilterRequestTrim("SAID");
            if (string.IsNullOrWhiteSpace(ViewBag.SAID))
            {
                return null;
            }

            return View();
        }

        /// <summary>
        /// 商家余额收支记录
        /// </summary>
        /// <returns></returns>
        public ActionResult ShopIncomeExpense()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../SettlePage/ShopIncomeExpense");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            return View();
        }


    }
}