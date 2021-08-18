using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【售后,投诉,客服反馈,消息系统 (OctAfterSaleAccCusSystem)】CMS页面相关页面控制器
/// </summary>
namespace OctCmsSystemWeb.PageControllers.WebPage
{
    public class AfterSaleAccCusPageController : Controller
    {
        // GET: AfterSaleAccCusPage
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 投诉信息处理
        /// </summary>
        /// <returns></returns>
        public ActionResult OrderComplainMsg()
        {

            return View();
        }

        #region【售后,退款退货】

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
        /// 退货退款申请
        /// </summary>
        /// <returns></returns>
        public ActionResult RefundApplyMsg()
        {
          
            return View();
        }

        #endregion

        #region【说明性文本】

        /// <summary>
        /// 说明文章信息
        /// </summary>
        /// <returns></returns>
        public ActionResult ExplainText()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("AfterSaleAccCusPage/ExplainText", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            return View();
        }

        [ValidateInput(false)]
        /// <summary>
        /// 说明文章添加编辑
        /// </summary>
        /// <returns></returns>
        public ActionResult ExplainTextAe()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("AfterSaleAccCusPage/ExplainTextAe", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            ViewBag.ExplainID = PublicClass.FilterRequestTrim("ETID");

            return View();
        }

        /// <summary>
        /// 说明文章图片
        /// </summary>
        /// <returns></returns>
        public ActionResult ExplainImg()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("AfterSaleAccCusPage/ExplainImg", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain.ToString().Trim();

            return View();
        }

        #endregion

        #region【系统通知信息】

        /// <summary>
        /// 买家通知信息
        /// </summary>
        /// <returns></returns>
        public ActionResult BuyerSysMsg()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("AfterSaleAccCusPage/BuyerSysMsg", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            return View();
        }

        /// <summary>
        /// 商家通知信息
        /// </summary>
        /// <returns></returns>
        public ActionResult ShopSysMsg()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("AfterSaleAccCusPage/ShopSysMsg", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            return View();
        }

        /// <summary>
        /// 平台通知信息
        /// </summary>
        /// <returns></returns>
        public ActionResult PlatformSysMsg()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("AfterSaleAccCusPage/PlatformSysMsg", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            return View();
        }


        #endregion


    }
}