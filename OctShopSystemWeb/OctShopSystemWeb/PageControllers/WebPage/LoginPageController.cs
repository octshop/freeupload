using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WeChatJsSdk.SdkCore;

/// <summary>
/// 【系统登录】相关Page页面控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.WebPage
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
            ViewBag.IsMobile = PublicClass.isMobileOS().ToString().ToLower();

            return View();
        }

        /// <summary>
        /// 登录成功- 请用微信扫码验证
        /// </summary>
        /// <returns></returns>
        public ActionResult LoginedScanPrompt()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../LoginPage/LoginedScanPrompt");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain.ToString().Trim();

            return View();
        }

        /// <summary>
        /// 登录密码设置
        /// </summary>
        /// <returns></returns>
        public ActionResult LoginPwdSetting()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../LoginPage/LoginPwdSetting");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            return View();
        }


    }
}