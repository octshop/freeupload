using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【系统】相关Page页面控制器
/// </summary>
namespace OctCmsSystemWeb.PageControllers.WebPage
{
    public class SysPageController : Controller
    {
        /// <summary>
        /// 系统首页
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("SysPage/Index", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            //获取当前系统日期
            ViewBag.CurDate = DateTime.Now.ToShortDateString();

            return View();
        }


        /// <summary>
        /// 数据统计
        /// </summary>
        /// <returns></returns>
        public ActionResult DataCount()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("SysPage/DataCount", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }

            return View();
        }



    }
}