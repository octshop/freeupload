using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【订单】相关的页面控制器
/// </summary>
namespace OctTradingSystemWeb.PageControllers.WebPage
{
    public class OrderPageController : Controller
    {
        // GET: OrderPage
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 验证 订单验证码信息是否正确 [待消费/自取]验证
        /// </summary>
        /// <returns></returns>
        public ActionResult VerifyOrderCheckCode()
        {
            //获取传递的扫码参数
            bool _isScanData = PublicClass.IsRequestParaBool("ScanData");
            if (_isScanData == false)
            {
                return Content("扫码数据错误");
            }

            string _ScanData = Request["ScanData"].ToString().Trim();
            _ScanData = _ScanData.Replace("%2B", "+").Replace(" ", "+");

            //解密
            string _ScanDataDecrypt = EncryptionClassNS.EncryptionClass.RSADecryptSection("", _ScanData);
            return Content(_ScanDataDecrypt);


            return View();
        }
    }
}