using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WeChatJsSdk.SdkCore;

/// <summary>
/// 【订单】相关Page页面控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.WebPage
{
    public class OrderPageController : Controller
    {
        // GET: OrderPage
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 验证 订单验证码信息是否正确 - [待消费/自取]验证  --【扫码结果处理页】  
        /// </summary>
        /// <returns></returns>
        public ActionResult VerifyOrderCheckCode()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../LoginPage/LoginedScanPrompt");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("商家登录错误，请重新登录！<a href=\"../LoginPage/Index\">立即登录</a>");
            }

            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain.ToString().Trim();


            #region【验证核销】

            //获取传递的扫码参数
            bool _isScanData = PublicClass.IsRequestParaBool("ScanData");
            if (_isScanData == false)
            {
                return Content("扫码数据错误");
            }

            string _ScanData = Request["ScanData"].ToString().Trim();
            ViewBag.ScanData = _ScanData;
            // _ScanData = _ScanData.Replace("%2B", "+").Replace(" ", "+");

            #endregion

           



            return View();
        }



    }
}