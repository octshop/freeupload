using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【CMS系统前端架构】相关页面控制器
/// </summary>
namespace OctCmsSystemWeb.PageControllers.WebPage
{
    public class CmsFrameController : Controller
    {
        /// <summary>
        /// 后台框架主体页面
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }

            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain.ToString().Trim();

            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.ImSystemWebDomainURL = WebAppConfig.ImSystemWebDomainURL;

            return View();
        }

    }
}