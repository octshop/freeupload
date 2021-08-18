using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【售后】相关Page页面控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.WebPage
{
    public class AfterSalePageController : Controller
    {
        // GET: AfterSalePage
        public ActionResult Index()
        {
            return View();
        }

        #region【售后信息】

        /// <summary>
        /// 售后申请信息
        /// </summary>
        /// <returns></returns>
        public ActionResult AfterSaleApplyMsg()
        {
          

            return View();
        }

        /// <summary>
        /// 售后详情
        /// </summary>
        /// <returns></returns>
        public ActionResult AfterSaleDetail()
        {

          

            return View();
        }

        /// <summary>
        /// 上门与发回信息
        /// </summary>
        /// <returns></returns>
        public ActionResult AfterSaleVisitSend()
        {
          

            return View();
        }

        #endregion

        #region【消息通知】

        /// <summary>
        /// 商家消息通知
        /// </summary>
        /// <returns></returns>
        public ActionResult ShopSysMsg()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../AfterSalePage/ShopSysMsg");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            //获取传递的参数
            ViewBag.SysMsgType = PublicClass.FilterRequestTrim("SysMsgType");
            ViewBag.IsRead = PublicClass.FilterRequestTrim("IsRead");


            return View();
        }

        #endregion



    }


}