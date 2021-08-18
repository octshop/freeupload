using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【积分】相关Page页面控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.WebPage
{
    public class IntegralPageController : Controller
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
        public ActionResult IntegralMy()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../IntegralPage/IntegralMy");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        /// <summary>
        /// 积分设置
        /// </summary>
        /// <returns></returns>
        public ActionResult IntegralSetting()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../IntegralPage/IntegralSetting");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain;

            return View();
        }

        /// <summary>
        /// 商家充积分
        /// </summary>
        /// <returns></returns>
        public ActionResult IntegralRecharge()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../IntegralPage/IntegralRecharge");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            return View();
        }


    }
}