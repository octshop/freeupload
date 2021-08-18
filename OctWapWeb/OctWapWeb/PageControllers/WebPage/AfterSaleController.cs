using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【售后】相关页面Controller
/// </summary>
namespace OctWapWeb.PageControllers.WebPage
{
    public class AfterSaleController : Controller
    {

        #region 【买家售后】相关页面

        /// <summary>
        /// 买家售后主页
        /// </summary>
        /// <returns></returns>
        public ActionResult BuyerAsIndex()
        {
           
            return View();
        }

        /// <summary>
        /// 多商品售后选择页
        /// </summary>
        /// <returns></returns>
        public ActionResult AsMulSel()
        {
           

            return View();
        }

        /// <summary>
        /// 选择售后类型
        /// </summary>
        /// <returns></returns>
        public ActionResult AsSelType()
        {
          

            return View();
        }

        /// <summary>
        /// 提交维修申请
        /// </summary>
        /// <returns></returns>
        public ActionResult AsSubmit()
        {

            return View();
        }

        /// <summary>
        /// 提交换货申请
        /// </summary>
        /// <returns></returns>
        public ActionResult AsSubmitChg()
        {

            return View();
        }

        /// <summary>
        /// 提交退货退款申请
        /// </summary>
        /// <returns></returns>
        public ActionResult AsSubmitRefund()
        {

            return View();
        }

        /// <summary>
        /// 售后详情
        /// </summary>
        /// <returns></returns>
        public ActionResult AsDetail()
        {

            return View();
        }

        /// <summary>
        /// 售后动态信息
        /// </summary>
        /// <returns></returns>
        public ActionResult AsDynamic()
        {
           

            return View();
        }

        #endregion
    }
}