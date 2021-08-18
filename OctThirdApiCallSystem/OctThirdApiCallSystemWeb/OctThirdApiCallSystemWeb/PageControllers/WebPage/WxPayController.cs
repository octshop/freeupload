using OctThirdApiCallSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using ThoughtWorks.QRCode.Codec;
using WxPayAPI;

/// <summary>
/// 【微信支付】相关Api和Page控制器
/// </summary>
namespace OctThirdApiCallSystemWeb.PageControllers.WebPage
{
    public class WxPayController : Controller
    {
        // GET: WxPay
        public ActionResult Index()
        {
            return View();
        }

        #region【公众号支付】
        /// <summary>
        /// 调用js获取收货地址时需要传入的参数
        /// 格式：json串
        /// 包含以下字段：
        ///     appid：公众号id
        ///     scope: 填写“jsapi_address”，获得编辑地址权限
        ///     signType:签名方式，目前仅支持SHA1
        ///     addrSign: 签名，由appid、url、timestamp、noncestr、accesstoken参与签名
        ///     timeStamp：时间戳
        ///     nonceStr: 随机字符串
        /// </summary>
        public static string wxEditAddrParam { get; set; }

        //H5调起JS API参数
        public static string wxJsApiParam { get; set; }

        /// <summary>
        /// 【第一步】微信支付跳转处理页 获取OPENID和AccessToken
        /// </summary>
        /// <returns></returns>
        [ValidateInput(false)] //必须停用 从客户端(")中检测到有潜在危险的Request.Form 值。
        public ActionResult WxApiPayRedirectRe()
        {
            //----检测用户登录是否正确---//
            //BusiLogin.chkUserLogin(true, true);

            //获取传递的参数  交易号
            string BillNumber = PublicClass.FilterRequestTrim("BillNumber");
            string UserKeyID = PublicClass.FilterRequestTrim("UserKeyID");

            WriteLogNs.LogClass.WriteLogFile("下单支付传递的：BillNumber=" + BillNumber + " | UserKeyID=" + UserKeyID);

            //交易号,UserKeyID存入Cookie
            PublicClass.setCookieValue("BillNumber_CookiePay", BillNumber);
            PublicClass.setCookieValue("UserKeyID_CookiePay", UserKeyID);

            //判断是否可以走支付服务商模式
            long _outShopUserID = 0;
            bool _isPayService = BusiPayPublic.isPayService(BillNumber, out _outShopUserID);
            if (_isPayService)
            {
                Response.Redirect("../PayService/WxApiPayRedirectRe");
                return null;
            }


            JsApiPay jsApiPay = new JsApiPay();
            try
            {
                //调用【网页授权获取用户信息】接口获取用户的openid和access_token
                jsApiPay.GetOpenidAndAccessToken();
            }
            catch (Exception ex)
            {
                Response.Write("<span style='color:#FF0000;font-size:20px'>" + "页面加载出错，请重试" + "</span>");
                WriteLogNs.LogClass.WriteLogFile("生成获取OPENID跳转页Exception=" + ex.Message.ToString().Trim());
            }


            return null;
        }

        /// <summary>
        /// 【第二步,关键弹出支付页】微信支付跳转处理页
        /// </summary>
        /// <returns></returns>
        public ActionResult WxApiPayRedirect()
        {
            //----检测用户登录是否正确---//
            //BusiLogin.chkUserLogin(true, true);

            //根据Cookie 得到订单信息
            string _billNumber = PublicClass.getCookieValue("BillNumber_CookiePay");
            string _userKeyID = PublicClass.getCookieValue("UserKeyID_CookiePay");

            WriteLogNs.LogClass.WriteLogFile("_billNumber=" + _billNumber + " | _userKeyID=" + _userKeyID);


            //查询同步通知和中途退出URL地址
            string[] _notifyArr = BusiPayNotify.getPaySettingNotify(Convert.ToInt64(_userKeyID));
            ViewBag.ReturnUrl = _notifyArr[1] + "?BillNumber=" + _billNumber;
            ViewBag.QuitUrl = _notifyArr[2] + "?BillNumber=" + _billNumber;

            ////查询订单信息
            //string[] _orderArr = BusiPayPublic.getOrderMsgArr(_billNumber);
            //if (string.IsNullOrWhiteSpace(_orderArr[0]))
            //{
            //    return Content("订单相关支付信息错误，不可支付！");
            //}

            ////------写入预支付信息----//
            //string _submitBack = BusiPayPublic.submitPayPreMsg(0, Convert.ToInt64(_userKeyID), Convert.ToInt64(_orderArr[0]), _billNumber, Convert.ToDecimal(_orderArr[6]), "WxPay");
            //if (_submitBack == "SPPM_02" || _submitBack == "SPPM_04")
            //{
            //    return Content("订单预支付信息写入失败！");
            //}
            decimal _outTotalOrderPrice = 0;
            string _outOrderIDArr = "";
            long _outShopUserID = 0;
            string _backMsg = BusiPayPublic.writePayPreMsgOrderMul(_billNumber, Convert.ToInt64(_userKeyID), "WeiXinPay", out _outTotalOrderPrice, out _outOrderIDArr, out _outShopUserID);
            if (_backMsg == "WPPM_02")
            {
                return Content("订单相关支付信息错误，不可支付！");
            }
            else if (_backMsg == "SPPM_02" || _backMsg == "SPPM_04")
            {
                return Content("订单预支付信息写入失败！");
            }


            //支付名称
            string _payNameMsg = WebAppConfig.MallName + "订单ID:" + _outOrderIDArr + ",在线支付";

            WriteLogNs.LogClass.WriteLogFile("下单信息：_billNumber=" + _billNumber + "，_outTotalOrderPrice=" + _outTotalOrderPrice + "，_payNameMsg=" + _payNameMsg);

            //初始化微信支付接口信息 然后调用  创建调用处理微信公众号支付信息
            //特别注意 微信支付不能重新提交同一个BillNumber 否则无法统一下单成功,所以每次都要传不同的BillNumber
            initWeiXinApiPayMsg(_billNumber, _outTotalOrderPrice.ToString().Trim(), _payNameMsg);

            return View();
        }

        /// <summary>
        /// 初始化微信支付接口信息 然后调用  创建调用处理微信公众号支付信息
        /// </summary>
        /// <param name="pBillNumber">交易号</param>
        /// <param name="pOrderPrice">订单金额（以“元”为单位）</param>
        /// <param name="pPayNameMsg">支付的名称</param>
        public void initWeiXinApiPayMsg(string pBillNumber, string pOrderPrice, string pPayNameMsg = "订购商品", string pPathRedirect = "/WxPay/WxApiPayRedirect")
        {

            /******下面的代码一定要放在判断是否是回发事件中，否则仍得不到效果******/
            //if (System.Web.HttpContext.Current.Request.UrlReferrer != null)
            //{
            //    var _backUrl = System.Web.HttpContext.Current.Request.UrlReferrer.ToString();
            //    System.Web.HttpContext.Current.Response.Redirect(_backUrl);
            //    return;
            //}

            JsApiPay jsApiPay = new JsApiPay();
            try
            {
                //WriteLogNs.LogClass.WriteLogFile("执行了JsApiPay");

                //调用【网页授权获取用户信息】接口获取用户的openid和access_token
                jsApiPay.GetOpenidAndAccessToken(pPathRedirect);

                //另一种获取OPENID和AccessToken的方法  不需要受限于【网页授权获取用户信息】
                //string[] _backWxArr = BusiWeiXin.getWeixinUserOpenId();
                //jsApiPay.openid = _backWxArr[0];
                //jsApiPay.access_token = _backWxArr[1];


                //获取收货地址js函数入口参数
                //wxEditAddrParam = jsApiPay.GetEditAddressParameters();
                string _wxOpenID = jsApiPay.openid; //得到微信OPENID
                //string _wxOpenID = _backWxArr[0]; //得到微信OPENID

                WriteLogNs.LogClass.WriteLogFile("支付初始化成功：_wxOpenID=" + _wxOpenID);

                if (string.IsNullOrWhiteSpace(_wxOpenID) == false)
                {
                    //--------创建调用处理微信公众号支付信息-------//
                    createWeiXinApiPayMsg(_wxOpenID, pBillNumber, pOrderPrice, pPayNameMsg);
                }
            }
            catch (Exception ex)
            {
                //Response.Write("<span style='color:#FF0000;font-size:20px'>" + "页面加载出错，请重试" + "</span>");
                //WriteLogNs.LogClass.WriteLogFile("支付页面加载出错，请重试 Exception=" + ex.Message.ToString().Trim());

            }

        }

        /// <summary>
        /// 创建调用处理微信公众号支付信息
        /// <param name="pBillNumber">交易号</param>
        /// <param name="pWxOpenID">微信OPENID</param>
        /// <param name="pOrderPrice">订单金额（以“元”为单位）</param>
        /// <param name="pPayNameMsg">支付的名称</param>
        /// </summary>
        public void createWeiXinApiPayMsg(string pWxOpenID, string pBillNumber, string pOrderPrice, string pPayNameMsg = "订购商品")
        {
            //写入加载日志
            WriteLogNs.LogClass.WriteLogFile("创建了调用处理微信公众号支付页");

            string openid = pWxOpenID;//Request.QueryString["openid"];
            //支付金额进行单位转换 //这里是以“分”单位
            string total_fee = Math.Ceiling(Convert.ToDecimal(pOrderPrice) * 100).ToString();//Request.QueryString["total_fee"];

            WriteLogNs.LogClass.WriteLogFile("统一下单提交参数前openid=" + openid + " | total_fee=" + total_fee);

            //检测是否给当前页面传递了相关参数
            if (string.IsNullOrEmpty(openid) || string.IsNullOrEmpty(total_fee))
            {
                //Response.Write("<span style='color:#FF0000;font-size:20px'>" + "页面传参出错,请返回重试" + "</span>");
                WriteLogNs.LogClass.WriteLogFile("页面传参出错,请返回重试");

                return;
            }



            //若传递了相关参数，则调统一下单接口，获得后续相关接口的入口参数
            JsApiPay jsApiPay = new JsApiPay();
            jsApiPay.openid = openid;
            jsApiPay.total_fee = int.Parse(total_fee); //int.Parse((Math.Round(Convert.ToDouble(total_fee))).ToString().Trim()); //以分为单位

            WriteLogNs.LogClass.WriteLogFile("最终下单信息jsApiPay.total_fee=" + jsApiPay.total_fee + ",jsApiPay.openid=" + jsApiPay.openid);


            //JSAPI支付预处理
            try
            {

                //----------这里可以传递一些交易的信息,修改jsApiPay.GetUnifiedOrderResult()这个方法即可。------------//
                string outTradeNo = "";

                WxPayData unifiedOrderResult = jsApiPay.GetUnifiedOrderResult(pBillNumber, pPayNameMsg);

                WriteLogNs.LogClass.WriteLogFile("执行了统一下单：" + unifiedOrderResult.ToPrintStr());

                wxJsApiParam = jsApiPay.GetJsApiParameters();//获取H5调起JS API参数                    
                //Log.Debug(this.GetType().ToString(), "wxJsApiParam : " + wxJsApiParam);

                //前台显示的支付Json
                ViewBag.WxJsApiParam = wxJsApiParam;

                //------将订单支付更改为非服务商模式
                BusiPayPublic.chgOrderPayService(pBillNumber, "false");

                WriteLogNs.LogClass.WriteLogFile("wxJsApiParam=" + wxJsApiParam);


                //-------初始化保单信息,并更新相应信息-------//
                //WriteLogNs.LogClass.WriteLogFile("返回的交易号=" + pBillNumber);
                //initOrderMsg(mOpenID, outTradeNo, mOrderPrice);

                //在页面上显示订单信息
                //Response.Write("<span style='color:#00CD00;font-size:20px'>订单详情：</span><br/>");
                //Response.Write("<span style='color:#00CD00;font-size:20px'>" + unifiedOrderResult.ToPrintStr() + "</span>");
            }
            catch (Exception ex)
            {
                //WriteLogNs.LogClass.WriteLogFile("下单失败，请返回重试");
                //Response.Write("<span style='color:#FF0000;font-size:20px'>" + "下单失败，请返回重试" + "</span>");
            }
        }

        #endregion

        #region【非商城订单- 公众号支付】

        /// <summary>
        /// 【第一步】微信支付跳转处理页 获取OPENID和AccessToken
        /// </summary>
        /// <returns></returns>
        [ValidateInput(false)] //必须停用 从客户端(")中检测到有潜在危险的Request.Form 值。
        public ActionResult WxApiPayRedirectReNoOrder()
        {
            //----检测用户登录是否正确---//
            //BusiLogin.chkUserLogin(true, true);

            //获取传递的参数  交易号
            string BillNumber = PublicClass.FilterRequestTrim("BillNumber");
            string UserKeyID = PublicClass.FilterRequestTrim("UserKeyID");

            WriteLogNs.LogClass.WriteLogFile("支付传递的：BillNumber=" + BillNumber + " | UserKeyID=" + UserKeyID);

            //交易号,UserKeyID存入Cookie
            PublicClass.setCookieValue("BillNumber_CookiePay", BillNumber);
            PublicClass.setCookieValue("UserKeyID_CookiePay", UserKeyID);

            //判断是否可以走支付服务商模式
            //long _outShopUserID = 0;
            //bool _isPayService = BusiPayPublic.isPayService(BillNumber, out _outShopUserID);
            //if (_isPayService)
            //{
            //    Response.Redirect("../PayService/WxApiPayRedirectRe");
            //    return null;
            //}


            JsApiPay jsApiPay = new JsApiPay();
            try
            {
                //调用【网页授权获取用户信息】接口获取用户的openid和access_token
                jsApiPay.GetOpenidAndAccessToken("/WxPay/WxApiPayRedirectNoOrder");
            }
            catch (Exception ex)
            {
                Response.Write("<span style='color:#FF0000;font-size:20px'>" + "页面加载出错，请重试" + "</span>");
                WriteLogNs.LogClass.WriteLogFile("生成获取OPENID跳转页Exception=" + ex.Message.ToString().Trim());
            }


            return null;
        }

        /// <summary>
        /// 【第二步,关键弹出支付页】微信支付跳转处理页
        /// </summary>
        /// <returns></returns>
        public ActionResult WxApiPayRedirectNoOrder()
        {
            //----检测用户登录是否正确---//
            //BusiLogin.chkUserLogin(true, true);

            //根据Cookie 得到订单信息
            string _billNumber = PublicClass.getCookieValue("BillNumber_CookiePay");
            string _userKeyID = PublicClass.getCookieValue("UserKeyID_CookiePay");

            WriteLogNs.LogClass.WriteLogFile("_billNumber=" + _billNumber + " | _userKeyID=" + _userKeyID);


            //查询同步通知和中途退出URL地址
            string[] _notifyArr = BusiPayNotify.getPaySettingNotify(Convert.ToInt64(_userKeyID), "AllPayOrWeiXinPayNoOrder");
            ViewBag.ReturnUrl = _notifyArr[1] + "?BillNumber=" + _billNumber;
            ViewBag.QuitUrl = _notifyArr[2]; // + "?BillNumber=" + _billNumber; 不能带参数否则JSSDKWeiXin接口错误

            #region【----------各类支付的业务逻辑---------------】

            //支付总额，以“元”为单位
            decimal payTotalPrice = 0;

            //支付名称
            string _payNameMsg = WebAppConfig.MallName;

            //--------买家充值 772020102310241087187175222--------//
            if (_billNumber.Length == 27 && _billNumber.IndexOf("77") == 0)
            {

                // 得到 买家充值未支付的 充值信息Model
                ModelBuyerRecharge _modelBuyerRecharge = OctTradingSystemNS.BusiRecharge.getModelBuyerRechargeWaitPay(_billNumber, "WeChat");
                if (_modelBuyerRecharge.RechargeID <= 0)
                {
                    return Content("买家充值信息错误，充值BillNumber=" + _billNumber);
                }
                payTotalPrice = _modelBuyerRecharge.RechargeAmt;
                _payNameMsg += "，买家充值，充值ID：" + _modelBuyerRecharge.RechargeID;
            }
            //--------聚合扫码支付 662020102310241087187175222--------//
            else if (_billNumber.Length == 27 && _billNumber.IndexOf("66") == 0)
            {
                //得到 正在支付的 聚合扫码支付 订单
                ModelAggregateOrderMsg _modelAggregateOrderMsg = OctTradingSystemNS.BusiAggregatePay.getModelAggregateOrderMsgPaying(_billNumber, "WeiXinPay");
                if (_modelAggregateOrderMsg.AggregateOrderID <= 0)
                {
                    return Content("聚合扫码支付订单信息错误，交易号BillNumber=" + _billNumber);
                }
                payTotalPrice = _modelAggregateOrderMsg.OrderPrice;
                _payNameMsg += "，聚合扫码支付，订单ID：" + _modelAggregateOrderMsg.AggregateOrderID;
            }

            #endregion


            WriteLogNs.LogClass.WriteLogFile("非商城订单支付信息：_billNumber=" + _billNumber + "，payTotalPrice=" + payTotalPrice + "，_payNameMsg=" + _payNameMsg);

            //初始化微信支付接口信息 然后调用  创建调用处理微信公众号支付信息
            //特别注意 微信支付不能重新提交同一个BillNumber 否则无法统一下单成功,所以每次都要传不同的BillNumber
            initWeiXinApiPayMsg(_billNumber, payTotalPrice.ToString().Trim(), _payNameMsg, "/WxPay/WxApiPayRedirectNoOrder");

            return View();
        }


        #endregion

        #region【小程序支付】

        /// <summary>
        /// 得到微信小程序 支付统一下单的结果信息 【API接口】
        /// </summary>
        /// <returns>
        /// WPUOR_02" 统一下单信息不完整 "WPUOR_04" 支付订单信息错误  "WPUOR_06" 微信支付统一下单出错
        /// </returns>
        public string GetWxMiniUnifiedOrderResult()
        {
            //获取传递过来的参数
            string UserKeyID = PublicClass.FilterRequestTrim("UserKeyID");
            string WxOpenID = PublicClass.FilterRequestTrim("WxOpenID");
            string BillNumber = PublicClass.FilterRequestTrim("BillNumber");

            WriteLogNs.LogClass.WriteLogFile("【小程序支付】UserKeyID=" + UserKeyID + " | WxOpenID=" + WxOpenID + " | BillNumber=" + BillNumber);

            //判断是否可以走支付服务商模式 如果是则返回相应的子商户信息
            string[] _isPayServiceBackSubAccMsgArr = BusiPayPublic.isPayServiceBackSubAccMsgArr(BillNumber);

            //非服务商模式
            if (string.IsNullOrWhiteSpace(_isPayServiceBackSubAccMsgArr[0]))
            {
                WriteLogNs.LogClass.WriteLogFile("【小程序支付】非服务商模式");

                //得到微信小程序统一下单结果信息
                //"WPUOR_02" 统一下单信息不完整 "WPUOR_04" 支付订单信息错误  "WPUOR_06" 微信支付统一下单出错, "WPUOR_08" 订单预支付信息写入失败！"
                return BusiWxPay.getWxMiniPayUnifiedOrderResult(UserKeyID, WxOpenID, BillNumber);
            }
            else //走服务商模式
            {
                WriteLogNs.LogClass.WriteLogFile("【小程序支付】服务商模式");

                //得微信小程序统一下单，并返回结果信息
                //"WMPUORS_02" 统一下单信息不完整 "WMPUORS_04" 支付订单信息错误  "WPUOR_06" 微信支付统一下单出错  "WMPUORS_08" 订单预支付信息写入失败！"
                return BusiPayService.getWxMiniPayUnifiedOrderResultService(UserKeyID, WxOpenID, BillNumber, _isPayServiceBackSubAccMsgArr[0]);
            }


            /**
             * 
            * {
            *   "appId" : "wx2421b1c4370ec43b",     //公众号名称，由商户传入     
            *   "timeStamp":" 1395712654",         //时间戳，自1970年以来的秒数     
            *   "nonceStr" : "e61463f8efa94090b1f366cccfbbb444", //随机串     
            *   "package" : "prepay_id=u802345jgfjsdfgsdg888",     
            *   "signType" : "MD5",         //微信签名方式:    
            *   "paySign" : "70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名 
            * }
             */

        }

        /// <summary>
        /// 小程序得到用户的登录信息 openid, unionid, session_key
        /// </summary>
        /// <returns></returns>
        public string MiniGetLoginMsg()
        {
            //获取传递过来的code
            string _code = Request["code"].ToString().Trim();

            //构造URL
            string _httpURL = "https://api.weixin.qq.com/sns/jscode2session?appid=" + WxPayConfig.WxMiniAPPID + "&secret=" + WxPayConfig.WxMiniAPPSECRET + "&js_code=" + _code + "&grant_type=authorization_code";

            //发送Http请求获取 openid,unionid,session_key
            string _httpBack = HttpService.Get(_httpURL);

            return _httpBack;

        }

        #endregion

        #region【非商城订单- 小程序支付】

        /// <summary>
        /// 得到微信小程序 支付统一下单的结果信息 【API接口】
        /// </summary>
        /// <returns>
        /// WPUOR_02" 统一下单信息不完整 "WPUOR_04" 支付订单信息错误  "WPUOR_06" 微信支付统一下单出错
        /// </returns>
        public string GetWxMiniUnifiedNoOrderResult()
        {
            //获取传递过来的参数
            string UserKeyID = PublicClass.FilterRequestTrim("UserKeyID");
            string WxOpenID = PublicClass.FilterRequestTrim("WxOpenID");
            string BillNumber = PublicClass.FilterRequestTrim("BillNumber");
            //支付类型 BuyerRecharge 买家充值 
            string PayType = PublicClass.FilterRequestTrim("PayType");

            WriteLogNs.LogClass.WriteLogFile("【小程序支付】UserKeyID=" + UserKeyID + " | WxOpenID=" + WxOpenID + " | BillNumber=" + BillNumber);

            //判断是否可以走支付服务商模式 如果是则返回相应的子商户信息
            string[] _isPayServiceBackSubAccMsgArr = new string[2]; //BusiPayPublic.isPayServiceBackSubAccMsgArr(BillNumber);

            //非服务商模式
            if (string.IsNullOrWhiteSpace(_isPayServiceBackSubAccMsgArr[0]))
            {
                WriteLogNs.LogClass.WriteLogFile("【小程序支付】非服务商模式");

                //得到微信小程序统一下单结果信息
                //"WPUOR_02" 统一下单信息不完整 "WPUOR_04" 支付订单信息错误  "WPUOR_06" 微信支付统一下单出错, "WPUOR_08" 订单预支付信息写入失败！"

                if (string.IsNullOrWhiteSpace(WxOpenID) || string.IsNullOrWhiteSpace(BillNumber) || string.IsNullOrWhiteSpace(UserKeyID) || string.IsNullOrWhiteSpace(PayType))
                {
                    return "WPUOR_02"; //统一下单信息不完整
                }

                //支付类型 BuyerRecharge 买家充值  AggregateOrderPay 聚合扫码，买单支付
                decimal _payMoney = 0; //以元为单位
                long _buyerUserID = 0; //充值的用户UserID
                string _payNameMsg = ""; //支付备注
                if (PayType == "BuyerRecharge") //买家充值
                {
                    //得到用户的充值信息
                    ModelBuyerRecharge _modelBuyerRecharge = OctTradingSystemNS.BusiRecharge.getModelBuyerRechargeWaitPay(BillNumber, "WeChat");

                    if (_modelBuyerRecharge.RechargeID <= 0)
                    {
                        return "WPUOR_04";
                    }
                    _payMoney = _modelBuyerRecharge.RechargeAmt;
                    _buyerUserID = _modelBuyerRecharge.BuyerUserID;

                    _payNameMsg = "用户在线充值:";
                }
                else if (PayType == "AggregateOrderPay") //聚合扫码，买单支付
                {
                    //得到买单支付订单信息
                    ModelAggregateOrderMsg _modelAggregateOrderMsg = OctTradingSystemNS.BusiAggregatePay.getModelAggregateOrderMsgPaying(BillNumber, "WeiXinPay");
                    if (_modelAggregateOrderMsg.AggregateOrderID <= 0)
                    {
                        return "WPUOR_04";
                    }
                    _payMoney = _modelAggregateOrderMsg.OrderPrice;
                    _buyerUserID = _modelAggregateOrderMsg.BuyerUserID;

                    _payNameMsg = "买单支付:";
                }


                //调用创建统一下单函数
                string _createBack = BusiWxPay.createWxMiniPayUnifiedOrder(WxOpenID, BillNumber, (Convert.ToDecimal(_payMoney) * 100).ToString().Trim(), WebAppConfig.MallName + _payNameMsg + _payMoney + ",UserID：" + _buyerUserID);
                if (string.IsNullOrWhiteSpace(_createBack))
                {
                    return "WPUOR_06"; //微信支付统一下单出错
                }
                else
                {
                    //重新生成签名 paySign 的小程序支付统一下单Json字符串
                    //_createBack = reBuildWxMiniPaySignUnifiedOrderJson(_createBack);


                    if (string.IsNullOrWhiteSpace(_createBack) == false)
                    {

                    }

                    return _createBack; //返回统一下单信息
                }


                //return BusiWxPay.getWxMiniPayUnifiedOrderResult(UserKeyID, WxOpenID, BillNumber);
            }
            else //走服务商模式
            {
                WriteLogNs.LogClass.WriteLogFile("【小程序支付】服务商模式");

                //得微信小程序统一下单，并返回结果信息
                //"WMPUORS_02" 统一下单信息不完整 "WMPUORS_04" 支付订单信息错误  "WPUOR_06" 微信支付统一下单出错  "WMPUORS_08" 订单预支付信息写入失败！"
                //return BusiPayService.getWxMiniPayUnifiedOrderResultService(UserKeyID, WxOpenID, BillNumber, _isPayServiceBackSubAccMsgArr[0]);

                return "";
            }


            /**
             * 
            * {
            *   "appId" : "wx2421b1c4370ec43b",     //公众号名称，由商户传入     
            *   "timeStamp":" 1395712654",         //时间戳，自1970年以来的秒数     
            *   "nonceStr" : "e61463f8efa94090b1f366cccfbbb444", //随机串     
            *   "package" : "prepay_id=u802345jgfjsdfgsdg888",     
            *   "signType" : "MD5",         //微信签名方式:    
            *   "paySign" : "70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名 
            * }
             */

        }

        #endregion

        #region【扫码支付】

        /// <summary>
        /// 生成扫码支付的URL数据 这个可以直接生成二维码【API接口】
        /// 引用方法（<img src="http://localhost:1600/WxPay/MakeQRCode?data=WeiXinScanPayURL"></img>)
        /// </summary>
        /// <returns></returns>
        public string CreateWeiXinScanPayURL()
        {
            //获取传递的参数
            string UserKeyID = PublicClass.FilterRequestTrim("UserKeyID");
            string BillNumber = PublicClass.FilterRequestTrim("BillNumber");

            //得到扫码支付的URL数据 这个可以直接生成二维码
            string _weiXinScanPayUrl = BusiWxPay.getWeiXinScanPayURL(UserKeyID, BillNumber);

            return _weiXinScanPayUrl;
        }

        /// <summary>
        /// 生成扫码支付的URL数据 这个可以直接生成二维码 -- 非购物订单支付(如充值,充积分)【API接口】
        /// 引用方法（<img src="http://localhost:1600/WxPay/MakeQRCode?data=WeiXinScanPayURL"></img>)
        /// </summary>
        /// <returns></returns>
        public string CreateWeiXinScanPayURLNoOrder()
        {
            //获取传递的参数
            string BillNumber = PublicClass.FilterRequestTrim("BillNumber"); //交易号
            string PayPrice = PublicClass.FilterRequestTrim("PayPrice"); //支付金额 以 元 为单位
            string GoodsID = PublicClass.FilterRequestTrim("GoodsID"); //商品ID
            string GoodsDesc = PublicClass.FilterRequestTrim("GoodsDesc"); //商品描述

            //得到扫码支付的URL数据 这个可以直接生成二维码 //构建扫码支付 URL 数据 
            string _weiXinScanPayUrl =
                 BusiWxPay.buildWeiXinScanPayURL(BillNumber, PayPrice, GoodsID, GoodsDesc);

            return _weiXinScanPayUrl;
        }


        /// <summary>
        /// 生成扫码的二维码图片,缓存输出页
        /// </summary>
        /// <returns></returns>
        public ActionResult MakeQRCode()
        {
            if (!string.IsNullOrEmpty(Request.QueryString["data"]))
            {
                string str = Request.QueryString["data"];

                //初始化二维码生成工具
                QRCodeEncoder qrCodeEncoder = new QRCodeEncoder();
                qrCodeEncoder.QRCodeEncodeMode = QRCodeEncoder.ENCODE_MODE.BYTE;
                qrCodeEncoder.QRCodeErrorCorrect = QRCodeEncoder.ERROR_CORRECTION.M;
                qrCodeEncoder.QRCodeVersion = 0;
                qrCodeEncoder.QRCodeScale = 4;

                //将字符串生成二维码图片
                Bitmap image = qrCodeEncoder.Encode(str, Encoding.Default);


                //----------将带Logo图片的二维码写入内存流中------------//
                MemoryStream _memoryStream = new MemoryStream();
                image.Save(_memoryStream, ImageFormat.Png);


                //输出图片流
                Response.ContentType = "image/Png";
                Response.OutputStream.Write(_memoryStream.GetBuffer(), 0, (int)_memoryStream.Length);

                Response.End();
            }

            return null;
        }

        #endregion

        #region【H5跳转支付】

        /// <summary>
        /// 得到微信H5支付跳转URL，直接跳转到这个URL就可以拉起支付 【API接口】
        /// </summary>
        /// <returns></returns>
        public string GetWxH5PayUrl()
        {
            //获取传递的参数
            string UserKeyID = PublicClass.FilterRequestTrim("UserKeyID");
            string BillNumber = PublicClass.FilterRequestTrim("BillNumber");
            string ClientTrueIpAddress = PublicClass.FilterRequestTrimNoConvert("ClientTrueIpAddress");

            // 得到微信H5支付跳转URL，直接跳转到这个URL就可以拉起支付
            string _wxH5PayUrl = BusiWxPay.getWxH5PayUrl(UserKeyID, BillNumber, ClientTrueIpAddress);
            return _wxH5PayUrl;
        }

        #endregion

        #region【企业付款到个人】

        /// <summary>
        /// 企业付款到个人 API接口
        /// </summary>
        /// <returns></returns>
        public string WxCompanyPay()
        {
            //获取传递的参数
            string UserKeyID = PublicClass.FilterRequestTrim("UserKeyID");
            string BillNumber = PublicClass.FilterRequestTrim("BillNumber");
            string WxOpenID = PublicClass.FilterRequestTrim("WxOpenID");
            //付款的金额 (以“元”为单位)
            string ChargeAmt = PublicClass.FilterRequestTrim("ChargeAmt");
            //收款用户真实姓名(可选)
            string UserTrueName = PublicClass.FilterRequestTrim("UserTrueName");
            //付款的描述(可选)
            string Title = PublicClass.FilterRequestTrim("Title");

            //返回Json字符串  { "return_code":"SUCCESS","return_msg":"","partner_trade_no":"10013574201505191526582441","payment_no":"1000018301201505190181489473","payment_time":"2015-05-19 15：26：59"}

            //企业付款给个人
            string _jsonBack = BusiWxPay.SendWxCompanyPayApi(BillNumber, WxOpenID, UserKeyID, ChargeAmt, UserTrueName, Title);
            return _jsonBack;
        }

        #endregion

        /// <summary>
        /// 微信支付_支付结果通知回调url，用于商户接收支付结果
        /// </summary>
        /// <returns></returns>
        public ActionResult WxResultNotifyPage()
        {

            //WriteLogNs.LogClass.WriteLogFile("微信支付_支付结果通知回调url，用于商户接收支付结果 ");

            //------------调用接收通知的方法函数-------------//
            ResultNotify resultNotify = new ResultNotify();
            resultNotify.ProcessNotify();

            return View();
        }




    }
}