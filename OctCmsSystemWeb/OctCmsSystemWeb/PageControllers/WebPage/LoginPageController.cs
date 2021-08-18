using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【系统登录】相关Page页面控制器
/// </summary>
namespace OctCmsSystemWeb.PageControllers.WebPage
{
    public class LoginPageController : Controller
    {
        /// <summary>
        /// 系统登录-首页
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            //获取返回的URL
            ViewBag.BackUrl = PublicClassNS.PublicClass.FilterRequestTrim("BackUrl");
            //判断当前浏览器是否为 移动端
            ViewBag.IsMobileOS = PublicClassNS.PublicClass.isMobileOS().ToString().ToLower();

            return View();
        }

        /// <summary>
        /// 登录密码设置
        /// </summary>
        /// <returns></returns>
        public ActionResult LoginPwdSetting()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("LoginPage/LoginPwdSetting", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            return View();
        }



    }
}