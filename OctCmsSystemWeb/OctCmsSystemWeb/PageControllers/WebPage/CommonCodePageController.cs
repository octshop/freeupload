using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


/// <summary>
/// 【OctCommonCodeSystem(各项目通用代码项目)】CMS页面控制器
/// </summary>
namespace OctCmsSystemWeb.PageControllers.WebPage
{
    public class CommonCodePageController : Controller
    {
        // GET: CommonCodePage
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Api请求用户信息管理
        /// </summary>
        /// <returns></returns>
        public ActionResult UserKeyMsg()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("CommonCodePage/UserKeyMsg", true);
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


            //生成UserKey值
            //ViewBag.UserKey = PublicClassNS.PublicClass.CreateNewGuid();

            return View();
        }

        /// <summary>
        /// Api请求Key验证记录
        /// </summary>
        /// <returns></returns>
        public ActionResult KeyVerifyRecord()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("CommonCodePage/KeyVerifyRecord", true);
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
        /// Api调用记录
        /// </summary>
        /// <returns></returns>
        public ActionResult ApiReqRecord()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("CommonCodePage/ApiReqRecord", true);
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
        /// 系统配置参数
        /// </summary>
        /// <returns></returns>
        public ActionResult SystemConfigParam()
        {

            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("CommonCodePage/SystemConfigParam", true);
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
        /// 系统信息(系统级异常错误)
        /// </summary>
        /// <returns></returns>
        public ActionResult SystemMsg()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("CommonCodePage/SystemMsg", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            return View();
        }

    }
}