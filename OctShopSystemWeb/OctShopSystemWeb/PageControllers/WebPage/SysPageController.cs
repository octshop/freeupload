using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【系统】相关Page页面控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.WebPage
{
    public class SysPageController : Controller
    {
        /// <summary>
        /// 系统首页
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../SysPage/Index")))
            {
                return Content("用户登录错误！");
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
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../SysPage/DataCount")))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        /// <summary>
        /// 创建系统各种二维码内容
        /// </summary>
        /// <returns></returns>
        public ActionResult CreateSysQRCode()
        {
            //获取传递过来的参数
            ViewBag.QRCodeTitle = HttpUtility.UrlDecode(PublicClass.FilterRequestTrim("QRCodeTitle"));
            ViewBag.QRCodeTitleSub = HttpUtility.UrlDecode(PublicClass.FilterRequestTrim("QRCodeTitleSub"));
            ViewBag.QRCodeDesc = HttpUtility.UrlDecode(PublicClass.FilterRequestTrim("QRCodeDesc"));
            ViewBag.QRCodeURL = HttpUtility.UrlDecode(PublicClass.FilterRequestTrim("QRCodeURL"));

            //ViewBag.OctUserGoodsShopSystemWeb_ApiDomain = "http://192.168.3.10:1200";

            ViewBag.OctUserGoodsShopSystemWeb_ApiDomain = WebAppConfig.OctUserGoodsShopSystemWeb_ApiDomain;

            ViewBag.QRCodeURL = ViewBag.OctUserGoodsShopSystemWeb_ApiDomain + "/ToolWeb/QrCodeImg?QrCodeContent=" + ViewBag.QRCodeURL;


            return View();
        }



    }
}