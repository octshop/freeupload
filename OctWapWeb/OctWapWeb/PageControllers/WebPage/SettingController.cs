using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【系统设置】相关页面 Controller
/// </summary>
namespace OctWapWeb.PageControllers.WebPage
{
    public class SettingController : Controller
    {
        // GET: Setting
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 更改绑定手机
        /// </summary>
        /// <returns></returns>
        public ActionResult BindMobileChg()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Setting/BindMobileChg")))
            {
                return Content("用户登录错误！");
            }

            ViewBag.BackUrl = PublicClassNS.PublicClass.FilterRequestTrim("BackUrl");

            return View();
        }

        /// <summary>
        /// 登录密码设置
        /// </summary>
        /// <returns></returns>
        public ActionResult LoginPwdSetting()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Setting/LoginPwdSetting")))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        /// <summary>
        /// 支付密码设置
        /// </summary>
        /// <returns></returns>
        public ActionResult PayPwdSetting()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Setting/PayPwdSetting")))
            {
                return Content("用户登录错误！");
            }

            return View();
        }



    }
}