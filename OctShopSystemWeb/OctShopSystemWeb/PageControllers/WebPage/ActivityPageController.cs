using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【活动】相关Page页面控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.WebPage
{
    public class ActivityPageController : Controller
    {
       /// <summary>
       /// 活动发布
       /// </summary>
       /// <returns></returns>
        public ActionResult ActivityAdd()
        {

            return View();
        }

        /// <summary>
        /// 活动编辑
        /// </summary>
        /// <returns></returns>
        public ActionResult ActivityEdit()
        {
           

            return View();
        }

        /// <summary>
        /// 活动信息
        /// </summary>
        /// <returns></returns>
        public ActionResult ActivityMsg()
        {
          

            return View();
        }

        /// <summary>
        /// 活动详情
        /// </summary>
        /// <returns></returns>
        public ActionResult ActivityDetail()
        {


            return View();
        }

        /// <summary>
        /// 活动参与信息
        /// </summary>
        /// <returns></returns>
        public ActionResult ActivityJoin()
        {
          
            return View();
        }

        /// <summary>
        /// 活动参与验证
        /// </summary>
        /// <returns></returns>
        public ActionResult ActivityJoinVerify()
        {

            return View();
        }


    }
}