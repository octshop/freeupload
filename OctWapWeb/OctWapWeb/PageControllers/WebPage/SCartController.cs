using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


/// <summary>
/// 【购物车】相关页面控制器
/// </summary>
namespace OctWapWeb.PageControllers.WebPage
{
    public class SCartController : Controller
    {
        /// <summary>
        /// 购物车首页
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            //---判断用户是否登录---//
            string _loginBuyerUserID = BusiLogin.isLoginPageRetrunUserID("../SCart/Index");
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return Content("用户登录错误！");
            }
            ViewBag.BuyerUserID = _loginBuyerUserID;


            return View();
        }
    }
}