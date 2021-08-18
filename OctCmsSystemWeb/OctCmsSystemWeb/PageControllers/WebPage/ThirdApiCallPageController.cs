using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【第三方系统调用( OctThirdApiCallSystem )】Page页面控制器
/// </summary>
namespace OctCmsSystemWeb.PageControllers.WebPage
{
    public class ThirdApiCallPageController : Controller
    {
        /// <summary>
        /// 支付设置信息
        /// </summary>
        /// <returns></returns>
        public ActionResult PaySetting()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("ThirdApiCallPage/PaySetting", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }

            //------只有超级管理员(AdUserType=Admin)才能进入的页-------// 
            string _loginUserAdUserType = BusiLogin.getLoginUserAdUserType();
            if (_loginUserAdUserType != "Admin")
            {
                return Content(BusiLogin.xhtmlNoPowerVisitContent());
            }

            return View();
        }

        /// <summary>
        /// 预支付信息
        /// </summary>
        /// <returns></returns>
        public ActionResult PayPreMsg()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("ThirdApiCallPage/PayPreMsg", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            return View();
        }

        /// <summary>
        /// 短信发送信息
        /// </summary>
        /// <returns></returns>
        public ActionResult SmsSendMsg()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("ThirdApiCallPage/SmsSendMsg", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            return View();
        }




    }
}