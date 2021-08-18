using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OctThirdApiCallSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【支付公共】相关Api和Page控制器
/// </summary>
namespace OctThirdApiCallSystemWeb.PageControllers.WebPage
{
    public class PayPubController : Controller
    {

        #region【----公共变量(锁死线程)----】

        //是否执行 防止重复提交
        public static bool mIsNoRepeatExe = true;
        //锁对象,锁死线程
        private static object mLockImport = new object();

        #endregion


        // GET: PayPub
        public ActionResult Index()
        {
            return View();
        }

        #region【模拟支付】

        /// <summary>
        /// 模拟支付
        /// </summary>
        /// <returns></returns>
        public ActionResult SimulatePay()
        {
            //获取OctWapWeb的域名
            ViewBag.OctWapWeb_WebDomain = WebAppConfig.OctWapWeb_WebDomain;

            //获取传递的参数
            string PayWay = PublicClass.FilterRequestTrim("PayWay");

            ViewBag.BillNumber = PublicClass.FilterRequestTrim("BillNumber");
            ViewBag.UserKeyID = PublicClass.FilterRequestTrim("UserKeyID");

            ViewBag.PayWay = PayWay;


            //获取OctWapWeb 手机Web网站(公众号)项目
            //string _webOctWapWebDomain =  WebAppConfig.OctWapWeb_WebDomain;
            //Logo图片URL
            //string _logoImgUrl = "";

            //判断支付类型
            if (PayWay == "WeiXinPay")
            {
                ViewBag.LogoImgUrl = "wxpaylogo.png";
                ViewBag.PayName = "微信支付";
            }
            else if (PayWay == "Alipay")
            {
                ViewBag.LogoImgUrl = "alipaylogo.png";
                ViewBag.PayName = "支付宝";
            }



            return View();
        }


        #endregion

        #region【支付结果异步通知---处理页，不是支付配置的路径】

        /// <summary>
        /// 支付结果异步通知
        /// </summary>
        /// <returns></returns>
        public string PayNotifyUrl()
        {

            //-------------锁死线程只能单线程执行-------//
            lock (mLockImport)
            {
                //----------------防止重复提交-----------------//
                if (mIsNoRepeatExe == false)
                {
                    return "NOREPEAT_02"; //可以重复次执行逻辑
                }
                mIsNoRepeatExe = false;

                //var myJsVal = "";
                //myJsVal += "{";
                //myJsVal += "	\"UserKeyID\": \"8866\",";
                //myJsVal += "	\"PayType\": \"WxPay\",";
                //myJsVal += "	\"PayResult\": {";
                //myJsVal += "		\"out_trade_no\": \"662021010707342953432230072\",";
                //myJsVal += "		\"transaction_id\": \"4200000803202101075684114301\",";
                //myJsVal += "		\"total_fee\": \"1\",";
                //myJsVal += "		\"sub_mch_id\": \"\",";
                //myJsVal += "		\"result_code\": \"SUCCESS\"";
                //myJsVal += "	}";
                //myJsVal += "}";

                //myJsVal = EncryptionClassNS.EncryptionClass.EncodeBase64("UTF-8", myJsVal);

                string _reqNotifyData = Request["NotifyData"].ToString().Trim();
                //获取异步通知结果
                string _notifyData = EncryptionClassNS.EncryptionClass.DecodeBase64("UTF-8", _reqNotifyData);

                WriteLogNs.LogClass.WriteLogFile("支付结果异步通知notifyData=" + _notifyData);

                //var myJsVal = "";
                //myJsVal += "{\"UserKeyID\": \"8866\",\"PayType\": \"WxPay\",\"PayResult\": {\"out_trade_no\": \"772021010208514115558451350\",\"transaction_id\": \"4200000786202101029333078004\",\"total_fee\": \"1\",\"sub_mch_id\": \"\",\"result_code\": \"SUCCESS\"}}";

                //string _notifyData = myJsVal;


                //解析Json字符串
                JObject _jObj = (JObject)JsonConvert.DeserializeObject(_notifyData);

                //交易号
                string out_trade_no = _jObj["PayResult"]["out_trade_no"].ToString().Trim();

                string _payBack = "";

                if (out_trade_no.Length == 25)
                {
                    //处理在线支付 ，支付成功后 异步通知 处理函数  --- 微信支付,支付宝
                    _payBack = OctTradingSystemNS.BusiPay.paySuccess(_notifyData);
                }
                else
                {
                    //处理在线支付 ，支付成功后 异步通知 处理函数 【非订单支付模式】  --- 微信支付,支付宝
                    _payBack = OctTradingSystemNS.BusiPay.paySuccessNoOrder(_notifyData);
                }


                //-----------可以再次执行逻辑--------------//
                mIsNoRepeatExe = true;

                return _payBack;


            }

            //------微信支付-----//
            //var myJsVal = "{";
            //myJsVal += "\"UserKeyID\": \"" + pUserKeyID + "\",";
            //myJsVal += "\"PayType\": \"WxPay\",";

            //myJsVal += "\"PayResult\": {";
            //myJsVal += "\"out_trade_no\": \"" + pout_trade_no + "\"";
            //myJsVal += ",\"transaction_id\": \"" + ptransaction_id + "\",";
            //myJsVal += "\"total_fee\": \"" + ptotal_fee + "\",";
            //myJsVal += "\"result_code\": \"" + presult_code + "\"";

            //myJsVal += "}";
            //myJsVal += "}";

            //-----支付宝支付-----//
            //var myJsVal = "{";
            //myJsVal += "\"UserKeyID\": \"" + pUserKeyID + "\",";
            //myJsVal += "\"PayType\": \"Alipay\",";

            //myJsVal += "\"PayResult\": {";
            //myJsVal += "\"out_trade_no\": \"" + pout_trade_no + "\"";

            //myJsVal += ",\"buyer_logon_id\": \"" + pbuyer_logon_id + "\",";
            //myJsVal += "\"total_amount\": \"" + ptotal_amount + "\",";
            //myJsVal += "\"receipt_amount\": \"" + preceipt_amount + "\",";
            //myJsVal += "\"buyer_pay_amount\": \"" + pbuyer_pay_amount + "\",";
            //myJsVal += "\"gmt_payment\": \"" + pgmt_payment + "\",";
            //myJsVal += "\"trade_status\": \"" + ptrade_status + "\"";

            //myJsVal += "}";
            //myJsVal += "}";


        }

        #endregion

    }
}