using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【订单】相关Ajax请求控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.AjaxPage
{
    public class OrderController : Controller
    {
        /// <summary>
        /// 验证 订单验证码信息是否正确 - [待消费/自取]验证  --【扫码结果处理页】  
        /// </summary>
        /// <returns></returns>
        public string VerifyOrderCheckCode()
        {
            //判断商家登录是否正确，并获取登录的UserID
            string _loginUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return "";
            }


            //获取操作类型  Type=1  验证 订单验证码信息是否正确 - [待消费/自取]验证  --【扫码结果处理页】  
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {

                //获取传递的扫码参数
                string _ScanData = HttpContext.Request["ScanData"].ToString().Trim();
                _ScanData = _ScanData.Replace("%2B", "+").Replace(" ", "+");

                //解密
                //string _ScanDataDecrypt = EncryptionClassNS.EncryptionClass.RSADecryptSection("", _ScanData);

                string _jsonBack = BusiOrder.httpVerifyScanCheckCodeOrderStatusShop(_ScanData, Convert.ToInt64(_loginUserID));
                return _jsonBack;

            }
            return "";
        }
    }

   


}