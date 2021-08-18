using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


/// <summary>
/// 【优惠券】相关Page页面控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.WebPage
{
    public class CouponsPageController : Controller
    {
        // GET: CouponsPage
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 优惠券管理
        /// </summary>
        /// <returns></returns>
        public ActionResult CouponsMsg()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../CouponsPage/CouponsMsg")))
            {
                return Content("用户登录错误！");
            }


            return View();
        }

        /// <summary>
        /// 优惠券添加
        /// </summary>
        /// <returns></returns>
        public ActionResult CouponsMsgAdd()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../CouponsPage/CouponsMsgAdd")))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        /// <summary>
        /// 优惠券编辑
        /// </summary>
        /// <returns></returns>
        public ActionResult CouponsMsgEdit()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../CouponsPage/CouponsMsgEdit")))
            {
                return Content("用户登录错误！");
            }


            //获取传递的参数
            string _cid = PublicClassNS.PublicClass.FilterRequestTrim("CID");
            if (string.IsNullOrWhiteSpace(_cid))
            {
                return null;
            }
            ViewBag.CID = _cid;

            return View();
        }

        /// <summary>
        /// 优惠券发放使用信息
        /// </summary>
        /// <returns></returns>
        public ActionResult CouponsIssueMsg()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../CouponsPage/CouponsIssueMsg")))
            {
                return Content("用户登录错误！");
            }

            ViewBag.IsUsed = PublicClass.FilterRequestTrim("IsUsed");

            return View();
        }

        /// <summary>
        /// 优惠券线下使用验证
        /// </summary>
        /// <returns></returns>
        public ActionResult CouponsUseVerify()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../CouponsPage/CouponsUseVerify");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            //获取活动ID
            string IID = PublicClassNS.PublicClass.FilterRequestTrim("IID");
            ViewBag.IID = IID;

            return View();
        }


        /// <summary>
        /// 优惠券发放详情
        /// </summary>
        /// <returns></returns>
        public ActionResult CouponsIssueDetail()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../CouponsPage/CouponsIssueDetail")))
            {
                return Content("用户登录错误！");
            }

            //获取传递的参数
            ViewBag.IssueID = PublicClassNS.PublicClass.FilterRequestTrim("ISID");

            return View();
        }


    }
}