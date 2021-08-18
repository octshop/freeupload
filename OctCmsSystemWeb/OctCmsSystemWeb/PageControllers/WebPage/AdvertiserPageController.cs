using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【广告系统 (OctAdvertiserSystem)】CMS页面相关页面控制器
/// </summary>
namespace OctCmsSystemWeb.PageControllers.WebPage
{
    public class AdvertiserPageController : Controller
    {
        /// <summary>
        /// 轮播广告
        /// </summary>
        /// <returns></returns>
        public ActionResult AdvCarousel()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("AdvertiserPage/AdvCarousel", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain.ToString().Trim();

            return View();
        }

        /// <summary>
        /// 横幅通栏广告
        /// </summary>
        /// <returns></returns>
        public ActionResult AdvBanner()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("AdvertiserPage/AdvBanner", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain.ToString().Trim();


            return View();
        }

        /// <summary>
        /// 图片列表栏目
        /// </summary>
        /// <returns></returns>
        public ActionResult AdvImgList()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("AdvertiserPage/AdvImgList", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain.ToString().Trim();

            return View();
        }

        /// <summary>
        /// 栏目图标导航
        /// </summary>
        /// <returns></returns>
        public ActionResult NavIconMsg()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("AdvertiserPage/NavIconMsg", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain.ToString().Trim();

            return View();
        }

        /// <summary>
        /// 推荐商品商家
        /// </summary>
        /// <returns></returns>
        public ActionResult RcdGoodsShop()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("AdvertiserPage/RcdGoodsShop", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain.ToString().Trim();

            return View();
        }

        /// <summary>
        /// 搜索发现
        /// </summary>
        /// <returns></returns>
        public ActionResult SearchFindMsg()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("AdvertiserPage/SearchFindMsg", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain.ToString().Trim();

            return View();
        }


    }
}