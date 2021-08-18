using OctThirdApiCallSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WxPayAPIService;

/// <summary>
/// 【支付服务商模式】相关Api和Page控制器
/// </summary>
namespace OctThirdApiCallSystemWeb.PageControllers.WebPage
{
    public class PayServiceController : Controller
    {
        // GET: PayService
        public ActionResult Index()
        {
            return View();
        }

        #region【微信支付-服务商模式】

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

            //交易号,UserKeyID存入Cookie
            PublicClass.setCookieValue("BillNumber_CookiePay", BillNumber);
            PublicClass.setCookieValue("UserKeyID_CookiePay", UserKeyID);

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

            //查询同步通知和中途退出URL地址
            string[] _notifyArr = BusiPayNotify.getPaySettingNotify(Convert.ToInt64(_userKeyID));
            ViewBag.ReturnUrl = _notifyArr[1] + "?BillNumber=" + _billNumber;
            ViewBag.QuitUrl = _notifyArr[2] + "?BillNumber=" + _billNumber;

            //查询订单信息
            string[] _orderArr = BusiPayPublic.getOrderMsgArr(_billNumber);
            if (string.IsNullOrWhiteSpace(_orderArr[0]))
            {
                return Content("订单相关支付信息错误，不可支付！");
            }

            //------写入预支付信息----//
            string _submitBack = BusiPayPublic.submitPayPreMsg(0, Convert.ToInt64(_userKeyID), Convert.ToInt64(_orderArr[0]), _billNumber, Convert.ToDecimal(_orderArr[6]), "WxPay");
            if (_submitBack == "SPPM_02" || _submitBack == "SPPM_04")
            {
                return Content("订单预支付信息写入失败！");
            }

            //支付名称
            string _payNameMsg = WebAppConfig.MallName + "订单ID:" + _orderArr[0] + ",在线支付";

            WriteLogNs.LogClass.WriteLogFile("下单信息：_billNumber=" + _billNumber + "，_orderPrice=" + _orderArr[6] + "，_payNameMsg=" + _payNameMsg);

            //判断是否可以走支付服务商模式 如果是则返回相应的子商户信息
            string[] _isPayServiceBackSubAccMsgArr = BusiPayPublic.isPayServiceBackSubAccMsgArr(_billNumber);
            if (string.IsNullOrWhiteSpace(_isPayServiceBackSubAccMsgArr[0]))
            {
                return Content("微信支付,子商户信息错误！");
            }

            //初始化微信支付接口信息 然后调用  创建调用处理微信公众号支付信息
            //特别注意 微信支付不能重新提交同一个BillNumber 否则无法统一下单成功,所以每次都要传不同的BillNumber
            initWeiXinApiPayMsg(_billNumber, _orderArr[6], _isPayServiceBackSubAccMsgArr[0], _payNameMsg);

            return View();
        }

        /// <summary>
        /// 初始化微信支付接口信息 然后调用  创建调用处理微信公众号支付信息
        /// </summary>
        /// <param name="pBillNumber">交易号</param>
        /// <param name="pOrderPrice">订单金额（以“元”为单位）</param>
        /// <param name="pSubMchID">子商户ID</param>
        /// <param name="pPayNameMsg">支付的名称</param>
        public void initWeiXinApiPayMsg(string pBillNumber, string pOrderPrice, string pSubMchID, string pPayNameMsg = "订购商品")
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
                jsApiPay.GetOpenidAndAccessToken();

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
                    createWeiXinApiPayMsg(_wxOpenID, pBillNumber, pOrderPrice, pSubMchID, pPayNameMsg);
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
        ///  <param name="pSubMchID">子商户ID</param>
        /// <param name="pPayNameMsg">支付的名称</param>
        /// </summary>
        public void createWeiXinApiPayMsg(string pWxOpenID, string pBillNumber, string pOrderPrice, string pSubMchID, string pPayNameMsg = "订购商品")
        {
            //写入加载日志
            //WriteLogNs.LogClass.WriteLogFile("创建了调用处理微信公众号支付页");

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

                WxPayData unifiedOrderResult = jsApiPay.GetUnifiedOrderResult(pBillNumber, pSubMchID, pPayNameMsg);

                WriteLogNs.LogClass.WriteLogFile("执行了统一下单：" + unifiedOrderResult.ToPrintStr());

                wxJsApiParam = jsApiPay.GetJsApiParameters();//获取H5调起JS API参数                    
                //Log.Debug(this.GetType().ToString(), "wxJsApiParam : " + wxJsApiParam);

                //前台显示的支付Json
                ViewBag.WxJsApiParam = wxJsApiParam;

                //-----将订单支付更改为服务商模式
                BusiPayPublic.chgOrderPayService(pBillNumber, "true");

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

        #endregion

   


    }
}