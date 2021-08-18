using BusiApiHttpNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【交易】相关Ajax请求控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.AjaxPage
{
    public class TradingController : Controller
    {
        // GET: Trading
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 订单管理
        /// </summary>
        /// <returns></returns>
        public string OrderMan()
        {
            //判断商家登录是否正确，并获取登录的UserID
            string _loginUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return "";
            }
            //获取商家登录UserID
            string mShopUserID = _loginUserID;

            //获取操作类型  Type=1 数据分页  Type=2 确认货到付款订单 Type=3 批量确认货到付款订单 Type=4 确认买家已到店付款(商家操作) Type=5 商家处理退款申请 Type=6 初始化订单发货信息 Type=7 提交发货送货信息 Type=8 查询订单发货信息 Type=9 核销验证 [待消费/自取]验证 Type=10 商家拒收操作 Type=11 修改订单价格 Type=12 初始化分割订单商品信息 Type=13 自动确认收货-商家版
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");
                string GoodsIDArr = PublicClass.FilterRequestTrim("GoodsIDArr");
                string OrderStatus = PublicClass.FilterRequestTrim("OrderStatus");
                string OrderPrice = PublicClass.FilterRequestTrim("OrderPrice");
                string PayWay = PublicClass.FilterRequestTrim("PayWay");
                string ExpressType = PublicClass.FilterRequestTrim("ExpressType");
                string IsSettle = PublicClass.FilterRequestTrim("IsSettle");
                string IsRefund = PublicClass.FilterRequestTrim("IsRefund");
                string OrderTime = PublicClass.FilterRequestTrim("OrderTime");

                string IsSk = PublicClass.FilterRequestTrim("IsSk");
                string IsGroup = PublicClass.FilterRequestTrim("IsGroup");

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("OrderID", OrderID);
                _dic.Add("BillNumber", BillNumber);
                _dic.Add("GoodsIDArr", GoodsIDArr);
                _dic.Add("OrderStatus", OrderStatus);
                _dic.Add("OrderPrice", OrderPrice);
                _dic.Add("PayWay", PayWay);
                _dic.Add("ExpressType", ExpressType);
                _dic.Add("IsSettle", IsSettle);
                _dic.Add("IsRefund", IsRefund);
                _dic.Add("OrderTime", OrderTime);
                _dic.Add("ShopUserID", mShopUserID);

                _dic.Add("IsSk", IsSk);
                _dic.Add("IsGroup", IsGroup);


                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "1", _dic);
                return _json;
            }
            else if (_exeType == "2") //确认货到付款订单
            {
                // 获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("OrderID", OrderID);
                _dic.Add("BillNumber", BillNumber);
                _dic.Add("ShopUserID", mShopUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "8", _dic);
                return _json;
            }
            else if (_exeType == "3") //批量确认货到付款订单
            {
                // 获取传递的参数
                string OrderIDArr = PublicClass.FilterRequestTrim("OrderIDArr");
                string BillNumberArr = PublicClass.FilterRequestTrim("BillNumberArr");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("OrderIDArr", OrderIDArr);
                _dic.Add("BillNumberArr", BillNumberArr);
                _dic.Add("ShopUserID", mShopUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "9", _dic);
                return _json;
            }
            else if (_exeType == "4") //确认买家已到店付款(商家操作)
            {
                // 获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("OrderID", OrderID);
                _dic.Add("BillNumber", BillNumber);
                _dic.Add("ShopUserID", mShopUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "11", _dic);
                return _json;
            }
            else if (_exeType == "5") //商家处理退款申请
            {
                // 获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("OrderID", OrderID);
                _dic.Add("ShopUserID", mShopUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "13", _dic);
                return _json;
            }
            else if (_exeType == "6") //初始化订单发货信息
            {
                // 获取传递的参数
                string SendType = PublicClass.FilterRequestTrim("SendType");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("SendType", SendType);
                _dic.Add("ShopUserID", mShopUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderSendGoods, "T_OrderSendGoods", "4", _dic);
                return _json;
            }
            else if (_exeType == "7") //提交发货送货信息
            {
                // 获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string SendType = PublicClass.FilterRequestTrim("SendType");
                string ExpressName = PublicClass.FilterRequestTrim("ExpressName");
                string ExpressNumber = PublicClass.FilterRequestTrim("ExpressNumber");
                string SendTelNumber = PublicClass.FilterRequestTrim("SendTelNumber");
                string SendShopMan = PublicClass.FilterRequestTrim("SendShopMan");
                string SendGoodsMemo = PublicClass.FilterRequestTrim("SendGoodsMemo");
                //操作类型[Add/Edit]
                string ExeType = PublicClass.FilterRequestTrim("ExeType");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("OrderID", OrderID);
                _dic.Add("SendType", SendType);
                _dic.Add("ExpressName", ExpressName);
                _dic.Add("ExpressNumber", ExpressNumber);
                _dic.Add("SendTelNumber", SendTelNumber);
                _dic.Add("SendShopMan", SendShopMan);
                _dic.Add("SendGoodsMemo", SendGoodsMemo);
                _dic.Add("ShopUserID", mShopUserID);
                _dic.Add("ExeType", ExeType);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "14", _dic);
                return _json;
            }
            else if (_exeType == "8") //查询订单发货信息
            {
                // 获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("OrderID", OrderID);
                _dic.Add("ShopUserID", mShopUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderSendGoods, "T_OrderSendGoods", "5", _dic);
                return _json;
            }
            else if (_exeType == "9") //核销验证 [待消费/自取]验证
            {
                // 获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string CheckType = PublicClass.FilterRequestTrim("CheckType");
                string CheckCode = PublicClass.FilterRequestTrim("CheckCode");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", mShopUserID);
                _dic.Add("OrderID", OrderID);
                _dic.Add("CheckType", CheckType);
                _dic.Add("CheckCode", CheckCode);
                _dic.Add("BuyerUserID", BuyerUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderCheckCode, "T_OrderCheckCode", "2", _dic);
                return _json;
            }
            else if (_exeType == "10") //商家拒收操作
            {
                // 获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", mShopUserID);
                _dic.Add("OrderID", OrderID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "18", _dic);
                return _json;
            }
            else if (_exeType == "11") //修改订单价格
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string OrderPrice = PublicClass.FilterRequestTrim("OrderPrice");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", mShopUserID);
                _dic.Add("OrderID", OrderID);
                _dic.Add("OrderPrice", OrderPrice);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "22", _dic);
                return _json;

            }
            else if (_exeType == "12") // 初始化分割订单商品信息
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", mShopUserID);
                _dic.Add("OrderID", OrderID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "23", _dic);
                return _json;
            }
            else if (_exeType == "13") //自动确认收货-商家版
            {
                //获取传递的参数

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", mShopUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "29", _dic);
                return _json;
            }

            return "";
        }

        /// <summary>
        /// 订单核销验证
        /// </summary>
        /// <returns></returns>
        public string VerifyCheckCodeOrderStatus()
        {
            //判断用户登录是否正确，并获取登录的UserID
            string _loginUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return "";
            }
            //获取操作类型  Type=1 查询验证订单信息列表
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string CheckCode = PublicClass.FilterRequestTrim("CheckCode");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);
                _dic.Add("OrderID", OrderID);
                _dic.Add("CheckCode", CheckCode);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderCheckCode, "T_OrderCheckCode", "3", _dic);
                return _json;

            }
            return "";
        }

        /// <summary>
        /// 订单详情
        /// </summary>
        /// <returns></returns>
        public string OrderDetail()
        {
            //判断商家登录是否正确，并获取登录的UserID
            string _loginUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 初始化商家端订单详情
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string ShopUserID = _loginUserID;

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("OrderID", OrderID);
                _dic.Add("ShopUserID", ShopUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderDetailShop, "OrderDetailShop", "1", _dic);
                return _json;
            }
            return "";
        }

        /// <summary>
        /// 订单发票信息
        /// </summary>
        /// <returns></returns>
        public string OrderInvoice()
        {
            //判断商家登录是否正确，并获取登录的UserID
            string _loginUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 数据分页 Type=2 发票置于-已开票状态
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string InvoiceID = PublicClass.FilterRequestTrim("InvoiceID");
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string InvoiceType = PublicClass.FilterRequestTrim("InvoiceType");
                string InvoiceTitle = PublicClass.FilterRequestTrim("InvoiceTitle");
                string ReceiMobile = PublicClass.FilterRequestTrim("ReceiMobile");
                string CompanyName = PublicClass.FilterRequestTrim("CompanyName");
                string IsInvoiced = PublicClass.FilterRequestTrim("IsInvoiced");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("ShopUserID", _loginUserID);
                _dic.Add("InvoiceID", InvoiceID);
                _dic.Add("OrderID", OrderID);
                _dic.Add("InvoiceType", InvoiceType);
                _dic.Add("InvoiceTitle", InvoiceTitle);
                _dic.Add("ReceiMobile", ReceiMobile);
                _dic.Add("CompanyName", CompanyName);
                _dic.Add("IsInvoiced", IsInvoiced);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderInvoice, "T_OrderInvoice", "1", _dic);
                return _json;
            }
            else if (_exeType == "2") //发票置于-已开票状态
            {
                // 获取传递的参数
                string InvoiceIDArr = PublicClass.FilterRequestTrim("InvoiceIDArr");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("InvoiceIDArr", InvoiceIDArr);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderInvoice, "T_OrderInvoice", "7", _dic);
                return _json;
            }

            return "";
        }

    }
}