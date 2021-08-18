using Aop.Api;
using Aop.Api.Domain;
using Aop.Api.Request;
using Aop.Api.Response;
using Aop.Api.Util;
using BusiApiKeyVerifyNS;
using OctThirdApiCallSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【支付宝支付】相关Api和Page控制器
/// </summary>
namespace OctThirdApiCallSystemWeb.PageControllers.WebPage
{
    public class AlipayController : Controller
    {
        // GET: Alipay
        public ActionResult Index()
        {


            return View();
        }

        /// <summary>
        /// 【手机跳转支付】支付宝，正式处理支付请求，并传递必须的参数 【这里是在浏览器中展示的】
        /// </summary>
        /// <returns></returns>
        public ActionResult AlipayWappay()
        {

            //OctWapWeb 手机Web网站(公众号)项目 地址域名
            ViewBag.OctWapWeb_WebDomain = WebAppConfig.OctWapWeb_WebDomain;


            //获取传递过来的参数
            //获取交易号
            string BillNumber = PublicClass.FilterRequestTrim("BillNumber");
            //获取UserKeyID
            long _userKeyID = Convert.ToInt64(PublicClass.FilterRequestTrim("UserKeyID"));

            //------写入预支付信息----//

            ////查询订单信息
            //string[] _orderArr = BusiPayPublic.getOrderMsgArr(BillNumber);
            //if (string.IsNullOrWhiteSpace(_orderArr[0]))
            //{
            //    return Content("订单相关支付信息错误，不可支付！");
            //}

            ////判断是否已存在预支付订单
            //int _existNum = BusiSqlData.countTableRecordProce("Pay_PreMsg", "BillNumber='" + BillNumber + "'", "PayPreID");
            //if (_existNum <= 0)
            //{
            //    //提交预支付信息
            //    string _submitBack = BusiPayPublic.submitPayPreMsg(0, _userKeyID, Convert.ToInt64(_orderArr[0]), BillNumber, Convert.ToDecimal(_orderArr[6]), "Alipay");
            //    if (_submitBack == "SPPM_02" || _submitBack == "SPPM_04")
            //    {
            //        return Content("订单预支付信息写入失败！");
            //    }
            //}


            decimal _outTotalOrderPrice = 0; //所有订单总金额
            string _outOrderIDArr = ""; //订单列表拼接字符串"^"
            long _outShopUserID = 0; //商家UserID
            string _backMsg = BusiPayPublic.writePayPreMsgOrderMul(BillNumber, Convert.ToInt64(_userKeyID), "Alipay", out _outTotalOrderPrice, out _outOrderIDArr, out _outShopUserID);
            if (_backMsg == "WPPM_02")
            {
                return Content("订单相关支付信息错误，不可支付！");
            }
            else if (_backMsg == "SPPM_02" || _backMsg == "SPPM_04")
            {
                // return Content("订单预支付信息写入失败！");
                //return View();
            }


            //判断是否在微信中支付
            if (PublicClass.isInWeiXinBrowse())
            {
                //构造导航显示代码
                // ViewBag.XhtmlNavLink = BusiWebFrontNS.BusiWebFront.xhtmlNavLink();
                //根据交易号得到订单ID
                //ViewBag.OrderID = _modelOrderMsg.OrderID;
                return View();
            }

            //下面是支付链接的生成
            DefaultAopClient client = new DefaultAopClient(config.gatewayUrl, config.app_id, config.private_key, "json", "1.0", config.sign_type, config.alipay_public_key, config.charset, false);

            //---判断是否可以走【支付宝】支付服务商模式 如果是则返回相应的子商户信息
            string[] _isAliayServiceBackSubAccMsgArr = BusiPayPublic.isAliayServiceBackSubAccMsgArr(_outShopUserID);
            //支付服务商模式
            if (string.IsNullOrWhiteSpace(_isAliayServiceBackSubAccMsgArr[0]) == false)
            {
                client = new DefaultAopClient(config.gatewayUrl, _isAliayServiceBackSubAccMsgArr[3], _isAliayServiceBackSubAccMsgArr[1], "json", "1.0", config.sign_type, _isAliayServiceBackSubAccMsgArr[2], config.charset, false);
            }
            else //非支付服务商模式
            {
                client = new DefaultAopClient(config.gatewayUrl, config.app_id, config.private_key, "json", "1.0", config.sign_type, config.alipay_public_key, config.charset, false);
            }

            // 外部订单号，商户网站订单系统中唯一的订单号
            string out_trade_no = BillNumber; //WIDout_trade_no.Text.Trim();

            // 订单名称
            string subject = WebAppConfig.MallName; //WIDsubject.Text.Trim();

            // 付款金额
            string total_amout = _outTotalOrderPrice.ToString(); // WIDtotal_amount.Text.Trim();

            // 商品描述
            string body = WebAppConfig.MallName + "商品购买"; //WIDbody.Text.Trim();

            // 支付中途退出返回商户网站地址
            string quit_url = config.quit_url + "?out_trade_no=" + out_trade_no; //WIDquit_url.Text.Trim();

            // 组装业务参数model
            AlipayTradeWapPayModel model = new AlipayTradeWapPayModel();
            model.Body = body;
            model.Subject = subject;
            model.TotalAmount = total_amout;
            model.OutTradeNo = out_trade_no;
            model.ProductCode = "QUICK_WAP_PAY";
            model.QuitUrl = quit_url;

            AlipayTradeWapPayRequest request = new AlipayTradeWapPayRequest();
            // 设置支付完成同步回调地址
            request.SetReturnUrl(config.return_url);
            // 设置支付完成异步通知接收地址
            request.SetNotifyUrl(config.notify_url);
            // 将业务model载入到request
            request.SetBizModel(model);

            AlipayTradeWapPayResponse response = null;
            try
            {
                //支付服务商模式
                if (string.IsNullOrWhiteSpace(_isAliayServiceBackSubAccMsgArr[0]) == false)
                {
                    //-----将订单支付更改为服务商模式
                    BusiPayPublic.chgOrderPayService(BillNumber, "true");
                }
                else //非支付服务商模式
                {
                    //-----将订单支付更改为非服务商模式
                    BusiPayPublic.chgOrderPayService(BillNumber, "false");
                }

                response = client.pageExecute(request, null, "post");
                //Response.Write(response.Body);
                return Content(response.Body);
            }
            catch (Exception exp)
            {
                throw exp;
            }
            //return Content("");
        }

        /// <summary>
        /// 【手机跳转支付--非商城订单支付】支付宝，正式处理支付请求，并传递必须的参数 【这里是在浏览器中展示的】
        /// </summary>
        /// <returns></returns>
        public ActionResult AlipayWappayNoOrder()
        {
            //OctWapWeb 手机Web网站(公众号)项目 地址域名
            ViewBag.OctWapWeb_WebDomain = WebAppConfig.OctWapWeb_WebDomain;

            //ViewBag.OctWapWeb_WebDomain = "http://192.168.3.10:1000";

            //获取传递过来的参数
            //获取交易号
            string BillNumber = PublicClass.FilterRequestTrim("BillNumber");
            //获取UserKeyID
            long _userKeyID = Convert.ToInt64(PublicClass.FilterRequestTrim("UserKeyID"));

            //decimal _outTotalOrderPrice = 0; //所有订单总金额
            //string _outOrderIDArr = ""; //订单列表拼接字符串"^"
            //long _outShopUserID = 0; //商家UserID
            //string _backMsg = BusiPayPublic.writePayPreMsgOrderMul(BillNumber, Convert.ToInt64(_userKeyID), "Alipay", out _outTotalOrderPrice, out _outOrderIDArr, out _outShopUserID);
            //if (_backMsg == "WPPM_02")
            //{
            //    return Content("订单相关支付信息错误，不可支付！");
            //}
            //else if (_backMsg == "SPPM_02" || _backMsg == "SPPM_04")
            //{
            //    // return Content("订单预支付信息写入失败！");
            //    //return View();
            //}

            #region【----------各类支付的业务逻辑---------------】

            decimal _outTotalOrderPrice = 0; //所有订单总金额
            string _bodySub = WebAppConfig.MallName; //支付描述

            //--------买家充值 772020102310241087187175222--------//
            if (BillNumber.Length == 27 && BillNumber.IndexOf("77") == 0)
            {
                // 得到 买家充值未支付的 充值信息Model
                ModelBuyerRecharge _modelBuyerRecharge = OctTradingSystemNS.BusiRecharge.getModelBuyerRechargeWaitPay(BillNumber, "Alipay");
                if (_modelBuyerRecharge.RechargeID <= 0)
                {
                    return Content("买家充值信息错误，充值BillNumber=" + BillNumber);
                }
                _outTotalOrderPrice = _modelBuyerRecharge.RechargeAmt;
                _bodySub = "，买家充值，充值ID：" + _modelBuyerRecharge.RechargeID;
            }
            //--------聚合扫码支付 662020102310241087187175222--------//
            else if (BillNumber.Length == 27 && BillNumber.IndexOf("66") == 0)
            {
                //得到 正在支付的 聚合扫码支付 订单
                ModelAggregateOrderMsg _modelAggregateOrderMsg = OctTradingSystemNS.BusiAggregatePay.getModelAggregateOrderMsgPaying(BillNumber, "Alipay");
                if (_modelAggregateOrderMsg.AggregateOrderID <= 0)
                {
                    return Content("聚合扫码支付订单信息错误，交易号BillNumber=" + BillNumber);
                }
                _outTotalOrderPrice = _modelAggregateOrderMsg.OrderPrice;
                _bodySub += "，聚合扫码支付，订单ID：" + _modelAggregateOrderMsg.AggregateOrderID;
            }


            #endregion


            //判断是否在微信中支付
            if (PublicClass.isInWeiXinBrowse())
            {
                //构造导航显示代码
                // ViewBag.XhtmlNavLink = BusiWebFrontNS.BusiWebFront.xhtmlNavLink();
                //根据交易号得到订单ID
                //ViewBag.OrderID = _modelOrderMsg.OrderID;
                return View();
            }

            //下面是支付链接的生成
            DefaultAopClient client = new DefaultAopClient(config.gatewayUrl, config.app_id, config.private_key, "json", "1.0", config.sign_type, config.alipay_public_key, config.charset, false);

            ////---判断是否可以走【支付宝】支付服务商模式 如果是则返回相应的子商户信息
            //string[] _isAliayServiceBackSubAccMsgArr = BusiPayPublic.isAliayServiceBackSubAccMsgArr(_outShopUserID);
            ////支付服务商模式
            //if (string.IsNullOrWhiteSpace(_isAliayServiceBackSubAccMsgArr[0]) == false)
            //{
            //    client = new DefaultAopClient(config.gatewayUrl, _isAliayServiceBackSubAccMsgArr[3], _isAliayServiceBackSubAccMsgArr[1], "json", "1.0", config.sign_type, _isAliayServiceBackSubAccMsgArr[2], config.charset, false);
            //}
            //else //非支付服务商模式
            //{
            client = new DefaultAopClient(config.gatewayUrl, config.app_id, config.private_key, "json", "1.0", config.sign_type, config.alipay_public_key, config.charset, false);
            //}

            // 外部订单号，商户网站订单系统中唯一的订单号
            string out_trade_no = BillNumber; //WIDout_trade_no.Text.Trim();

            // 订单名称
            string subject = WebAppConfig.MallName; //WIDsubject.Text.Trim();

            // 付款金额
            string total_amout = _outTotalOrderPrice.ToString(); // WIDtotal_amount.Text.Trim();

            // 商品描述
            string body = WebAppConfig.MallName + _bodySub; ; //WIDbody.Text.Trim();

            // 支付中途退出返回商户网站地址
            string quit_url = config.quit_url + "?out_trade_no=" + out_trade_no; //WIDquit_url.Text.Trim();

            // 组装业务参数model
            AlipayTradeWapPayModel model = new AlipayTradeWapPayModel();
            model.Body = body;
            model.Subject = subject;
            model.TotalAmount = total_amout;
            model.OutTradeNo = out_trade_no;
            model.ProductCode = "QUICK_WAP_PAY";
            //model.QuitUrl = quit_url;

            AlipayTradeWapPayRequest request = new AlipayTradeWapPayRequest();

            //查询同步通知和中途退出URL地址
            string[] _notifyArr = BusiPayNotify.getPaySettingNotify(Convert.ToInt64(_userKeyID), "AllPayOrWeiXinPayNoOrder");
            ViewBag.ReturnUrl = _notifyArr[1] + "?BillNumber=" + BillNumber;
            ViewBag.QuitUrl = _notifyArr[2] + "?BillNumber=" + BillNumber;

            // 设置支付完成同步回调地址
            request.SetReturnUrl(ViewBag.ReturnUrl);
            //设置拉起支付时，中途退出的跳转地址
            model.QuitUrl = ViewBag.QuitUrl;



            // 设置支付完成异步通知接收地址
            request.SetNotifyUrl(config.notify_url);
            // 将业务model载入到request
            request.SetBizModel(model);

            AlipayTradeWapPayResponse response = null;
            try
            {
                ////支付服务商模式
                //if (string.IsNullOrWhiteSpace(_isAliayServiceBackSubAccMsgArr[0]) == false)
                //{
                //    //-----将订单支付更改为服务商模式
                //    BusiPayPublic.chgOrderPayService(BillNumber, "true");
                //}
                //else //非支付服务商模式
                //{
                //    //-----将订单支付更改为非服务商模式
                //    BusiPayPublic.chgOrderPayService(BillNumber, "false");
                //}

                response = client.pageExecute(request, null, "post");
                //Response.Write(response.Body);
                return Content(response.Body);
            }
            catch (Exception exp)
            {
                throw exp;
            }
            //return Content("");
        }


        /// <summary>
        /// 【当面付二维码图片】支付宝 无子账号处理,只需传递BillNumber和UserKeyID参数即可生成二维码
        /// </summary>
        /// <returns></returns>
        public ActionResult AlipayF2FPayScanImg()
        {
            //获取传递过来的参数
            //获取交易号
            string BillNumber = PublicClass.FilterRequestTrim("BillNumber");

            //获取UserKeyID
            long _userKeyID = Convert.ToInt64(PublicClass.FilterRequestTrim("UserKeyID"));

            //创建支付宝，扫码图片
            string _backMsg = BusiAlipay.createScanImg(_userKeyID.ToString().Trim(), BillNumber);
            return Content(_backMsg);
        }

        /// <summary>
        /// 【当面付二维码图片 非订单支付模式，非支付服务商模式】 --直接显示二维码
        /// 调用方法： 构造 BillNumber ^ TotalFee ^ Subject 然后 Base64加密
        /// 
        /// </summary>
        /// <returns></returns>
        public ActionResult AlipayF2FPayScanImgNoOrder()
        {
            //获取传递过来的参数
            string ScanData = EncryptionClassNS.EncryptionClass.DecodeBase64("utf-8", PublicClass.FilterRequestTrimNoConvert("ScanData").Replace("%2B", "+"));

            //分割字符串数组  BillNumber ^ TotalFee ^ Subject
            string[] _ScanDataArr = PublicClass.splitStringJoinChar(ScanData);

            //创建支付宝，扫码图片
            string _backMsg = BusiAlipay.createScanImgNoService(_ScanDataArr[0], _ScanDataArr[1], _ScanDataArr[2]);
            return Content(_backMsg);
        }

        #region【转账到支付宝账户】

        /// <summary>
        /// 转账到支付宝账户
        /// </summary>
        /// <returns></returns>
        public string AlipayCompanyTransPerson()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1  转账到支付宝账户
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");
                string TransAmount = PublicClass.FilterRequestTrim("TransAmount");
                string IdentityAliUserAcc = PublicClass.FilterRequestTrim("IdentityAliUserAcc");
                string AliTrueName = PublicClass.FilterRequestTrim("AliTrueName");
                //可选参数
                string OrderTitle = PublicClass.FilterRequestTrim("OrderTitle");
                string Remark = PublicClass.FilterRequestTrim("Remark");
                string OriginalOrderId = PublicClass.FilterRequestTrim("OriginalOrderId");

                string _jsonBack = BusiAlipay.payAlipayCompanyTransPersonApi(BillNumber, TransAmount, IdentityAliUserAcc, AliTrueName, OrderTitle, Remark, OriginalOrderId);
                return _jsonBack;
            }


            return "";
        }

        #endregion

        #region【支付异步通知】

        /// <summary>
        /// 支付宝,支付结果异步通知
        /// </summary>
        /// <returns></returns>
        public string AlipayNotifyUrl()
        {
            WriteLogNs.LogClass.WriteLogFile("支付宝,支付结果异步通知,执行了AlipayNotifyUrl()");

            /* 实际验证过程建议商户添加以下校验。
            1、商户需要验证该通知数据中的out_trade_no是否为商户系统中创建的订单号，
            2、判断total_amount是否确实为该订单的实际金额（即商户订单创建时的金额），
            3、校验通知中的seller_id（或者seller_email) 是否为out_trade_no这笔单据的对应的操作方（有的时候，一个商户可能有多个seller_id/seller_email）
            4、验证app_id是否为该商户本身。
            */
            Dictionary<string, string> sArray = GetRequestPost();
            if (sArray.Count != 0)
            {
                //获取商户订单号，交易号
                string out_trade_no = Request.Form["out_trade_no"].Trim();

                //如果支付宝是支付服务商模式，那么必须查找到子商户的支付公钥，否则验证会失败
                string _alipayPublicKey = BusiPayService.getAlipayPublicKeyPayService(out_trade_no);
                if (string.IsNullOrWhiteSpace(_alipayPublicKey) == false)
                {
                    config.alipay_public_key = _alipayPublicKey;
                }

                bool flag = AlipaySignature.RSACheckV1(sArray, config.alipay_public_key, config.charset, config.sign_type, false);
                if (flag)
                {
                    //交易状态
                    //判断该笔订单是否在商户网站中已经做过处理
                    //如果没有做过处理，根据订单号（out_trade_no）在商户网站的订单系统中查到该笔订单的详细，并执行商户的业务程序
                    //请务必判断请求时的total_amount与通知时获取的total_fee为一致的
                    //如果有做过处理，不执行商户的业务程序

                    //注意：
                    //退款日期超过可退款期限后（如三个月可退款），支付宝系统发送该交易状态通知

                    string trade_no = Request.Form["trade_no"].Trim(); //支付宝交易号

                    string buyer_logon_id = Request.Form["buyer_logon_id"].Trim(); //买家支付宝账号
                    string total_amount = Request.Form["total_amount"].Trim(); //订单金额
                    string receipt_amount = Request.Form["receipt_amount"].Trim(); //实收金额
                    string buyer_pay_amount = Request.Form["buyer_pay_amount"].Trim(); //实收金额
                    string gmt_payment = Request.Form["gmt_payment"].Trim(); //交易付款时间

                    //交易状态 TRADE_FINISHED 交易完成 , TRADE_SUCCESS 支付成功 , WAIT_BUYER_PAY 交易创建 , TRADE_CLOSED 交易关闭
                    string trade_status = Request.Form["trade_status"].Trim();

                    //日志写入返回的支付信息
                    string _writeLog = "out_trade_no=" + out_trade_no;
                    _writeLog += "| trade_no= " + trade_no;
                    _writeLog += "| buyer_logon_id= " + buyer_logon_id;
                    _writeLog += "| total_amount= " + total_amount;
                    _writeLog += "| receipt_amount= " + receipt_amount;
                    _writeLog += "| buyer_pay_amount= " + buyer_pay_amount;
                    _writeLog += "| gmt_payment= " + gmt_payment;
                    _writeLog += "| trade_status=" + trade_status;
                    WriteLogNs.LogClass.WriteLogFile(_writeLog);

                    //TRADE_SUCCESS 支付成功 ---处理一系列的操作
                    if (trade_status == "TRADE_SUCCESS")
                    {
                        //处理，支付成功后一系列的操作
                        //BusiPaySuccess.proPaySuccessBack(out_trade_no, receipt_amount);
                    }
                    else
                    {

                    }

                    //处理支付宝 支付结果【异步通知】并转发到指定的URL地址
                    string _httpBack = BusiPayNotify.sendAlipayNotifyUrlAsyn(out_trade_no, buyer_logon_id, total_amount, receipt_amount, buyer_pay_amount, gmt_payment, trade_status, trade_no);
                    //写入日志转发异步通知返回信息
                    WriteLogNs.LogClass.WriteLogFile("支付宝，转发异步通知Http返回结果：" + _httpBack);


                    //Response.Write("success");
                    return "success";
                }
                else
                {
                    WriteLogNs.LogClass.WriteLogFile("支付宝,支付结果异步通知,失败了……");

                    return "fail";
                    //Response.Write("fail");
                }
            }

            return "fail";
        }

        /// <summary>
        /// 支付宝，支付结果同步验证
        /// </summary>
        /// <returns></returns>
        public ActionResult AlipayReturnUrl()
        {
            WriteLogNs.LogClass.WriteLogFile("支付宝，支付结果同步验证,执行了AlipayReturnUrl()");

            /* 实际验证过程建议商户添加以下校验。
           1、商户需要验证该通知数据中的out_trade_no是否为商户系统中创建的订单号，
           2、判断total_amount是否确实为该订单的实际金额（即商户订单创建时的金额），
           3、校验通知中的seller_id（或者seller_email) 是否为out_trade_no这笔单据的对应的操作方（有的时候，一个商户可能有多个seller_id/seller_email）
           4、验证app_id是否为该商户本身。
           */
            Dictionary<string, string> sArray = GetRequestGet();
            if (sArray.Count != 0)
            {

                //获取商户订单号，交易号
                string out_trade_no = sArray["out_trade_no"].ToString().Trim(); //Request.Form["out_trade_no"].Trim();

                //如果支付宝是支付服务商模式，那么必须查找到子商户的支付公钥，否则验证会失败
                string _alipayPublicKey = BusiPayService.getAlipayPublicKeyPayService(out_trade_no);
                if (string.IsNullOrWhiteSpace(_alipayPublicKey) == false)
                {
                    config.alipay_public_key = _alipayPublicKey;
                }


                bool flag = AlipaySignature.RSACheckV1(sArray, config.alipay_public_key, config.charset, config.sign_type, false);
                if (flag)
                {
                    //商户订单号，交易号
                    //string out_trade_no = Request["out_trade_no"].Trim();

                    //通过交易号得到订单ID
                    //string _orderID = BusiGetData.getOrderIDByBillNumber(out_trade_no).ToString();
                    //ViewBag.OrderID = _orderID;

                    WriteLogNs.LogClass.WriteLogFile("同步验证通过，out_trade_no=" + out_trade_no);

                    //处理支付宝 支付结果【同步通知】并跳转到指定的URL地址
                    BusiPayNotify.redirectAlipayNotifyUrlSyn(out_trade_no);

                    return View();

                    //Response.Write("同步验证通过");
                }
                else
                {
                    WriteLogNs.LogClass.WriteLogFile("支付宝，支付结果同步验证,失败了……");

                    Response.Write("同步验证失败");
                }
            }


            return Content("同步验证失败");
        }

        /// <summary>
        /// 支付中途退出返回商户网站URL地址 
        /// </summary>
        /// <returns></returns>
        public ActionResult AlipayQuitUrl()
        {
            //获取传递过来的参数
            string out_trade_no = PublicClass.FilterRequestTrim("out_trade_no");

            //根据预支付信息到UserKeyID
            long _userKeyID = BusiPayPublic.getUserKeyID(out_trade_no);
            //查询UserKeyID的异步通知地址
            string[] _notifyUrlArr = BusiPayNotify.getPaySettingNotify(_userKeyID);

            //跳转到同步通知页
            System.Web.HttpContext.Current.Response.Redirect(_notifyUrlArr[2] + "?BillNumber=" + out_trade_no);

            return null;
        }

        #endregion

        #region【公共调用函数】

        public Dictionary<string, string> GetRequestPost()
        {
            int i = 0;
            Dictionary<string, string> sArray = new Dictionary<string, string>();
            NameValueCollection coll;
            //coll = Request.Form;
            coll = Request.Form;
            String[] requestItem = coll.AllKeys;
            for (i = 0; i < requestItem.Length; i++)
            {
                sArray.Add(requestItem[i], Request.Form[requestItem[i]]);
            }
            return sArray;
        }

        public Dictionary<string, string> GetRequestGet()
        {
            int i = 0;
            Dictionary<string, string> sArray = new Dictionary<string, string>();
            NameValueCollection coll;
            //coll = Request.Form;
            coll = Request.QueryString;
            String[] requestItem = coll.AllKeys;
            for (i = 0; i < requestItem.Length; i++)
            {
                sArray.Add(requestItem[i], Request.QueryString[requestItem[i]]);
            }
            return sArray;

        }

        #endregion

    }
}