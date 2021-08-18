using BusiApiKeyVerifyNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【支付退款(微信支付/支付宝)】相关Api和Page控制器
/// </summary>
namespace OctThirdApiCallSystemWeb.PageControllers.WebPage
{
    public class RefundController : Controller
    {
        // GET: Refund
        public ActionResult Index()
        {
            return View();
        }

        #region【微信支付退款】

        /// <summary>
        /// 微信支付 支付的订单退款
        /// </summary>
        /// <returns>
        /// "PWXR_01" 退款成功 "PWXR_02" 微信支付订单号和商户订单号不能同时为空
        /// "PWXR_04" 订单总金额 和 退款金额不能为空 "PWXR_06" 退款失败
        /// </returns>
        public string WxPayRefund()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取传递的参数
            //商户订单号(交易号BillNumber) 
            string OutTradeNo = PublicClass.FilterRequestTrim("OutTradeNo");
            //订单总金额(以元为单位)
            string TotalFee = PublicClass.FilterRequestTrim("TotalFee");
            //退款金额(以元为单位)
            string RefundFee = PublicClass.FilterRequestTrim("RefundFee");
            //微信订单号（优先使用）微信支付自己生成的支付ID
            string TransactionID = PublicClass.FilterRequestTrim("TransactionID");

            //处理【微信支付 支付的订单退款】
            string _backMsg = OctThirdApiCallSystemNS.BusiWxPay.proWeiXinRefund(OutTradeNo, TotalFee, RefundFee, TransactionID);
            return _backMsg;
        }

        #endregion

        #region【支付宝退款】

        /// <summary>
        /// 支付宝 支付的订单退款
        /// </summary>
        /// <returns></returns>
        public string AlipayRefund()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取传递的参数

            //商户订单号(交易号BillNumber) 
            string OutTradeNo = PublicClass.FilterRequestTrim("OutTradeNo");
            //退款金额，不能大于订单总金额(以元为单位)
            string RefundAmount = PublicClass.FilterRequestTrim("RefundAmount");
            //支付宝交易号(支付宝生成的标记ID)，和商户订单号不能同时为空
            string TradeNo = PublicClass.FilterRequestTrim("TradeNo");
            //退款原因
            string RefundReason = PublicClass.FilterRequestTrim("RefundReason");
            //退款单号，同一笔多次退款需要保证唯一，部分退款该参数必填。
            string OutRequestNo = PublicClass.FilterRequestTrim("OutRequestNo");

            //处理【支付宝支付的订单退款】
            string _backMsg = OctThirdApiCallSystemNS.BusiAlipay.proAlipayRefund(OutTradeNo, RefundAmount, TradeNo, RefundReason, OutRequestNo);

            return _backMsg;
        }

        #endregion


    }
}