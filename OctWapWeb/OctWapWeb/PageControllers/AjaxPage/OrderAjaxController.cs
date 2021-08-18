using BusiApiHttpNS;
using BusiRndKeyUploadNS;
using HttpServiceNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【订单】相关Ajax控制器
/// </summary>
namespace OctWapWeb.PageControllers.AjaxPage
{
    public class OrderAjaxController : Controller
    {
        // GET: OrderAjax
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 确认下单
        /// </summary>
        /// <returns></returns>
        public string PlaceOrder()
        {

            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 初始化收货地址 Type=2 初始化订购商品信息 Type=3 得到单个商品买家可使用的优惠券列表 Type=4 初始化默认使用的优惠券 Type=5 提交订单信息 Type=6 处理订单选择的不同方式支付
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //得到买家当前选择的收货地址  如果没有选择则加载默认收货地址,如果为空则无收货地址，需要新建
                string _jsonBack = BusiBuyer.getBuyerReceiAddrSelJson(Convert.ToInt64(_loginBuyerUserID));
                return _jsonBack;
            }
            else if (_exeType == "2") //初始化订购商品信息
            {
                //得到订购的 商品Cookie拼接数组 _单个商品订购通道  用“^”拼接【GoodsID ^ OrderNum ^ SpecID】 
                string[] _orderGoodsMsgCookieArrSingle = BusiOrder.getOrderGoodsMsgCookieArrSingle();
                if (_orderGoodsMsgCookieArrSingle == null)
                {
                    return "";
                }

                //调用初始化订购下单信息[商家，商品，运费,默认优惠券，配送方式]
                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("GoodsID", _orderGoodsMsgCookieArrSingle[0]);
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                _dicPost.Add("OrderNum", _orderGoodsMsgCookieArrSingle[1]);
                _dicPost.Add("SpecID", _orderGoodsMsgCookieArrSingle[2]);

                //得到当前选择的收货地址省份Code
                string _regionProCodeCookie = BusiBuyer.getReceiAddrRegionProCodeCookie();
                _dicPost.Add("RegionProCode", _regionProCodeCookie);

                //初始化订购商品信息
                return BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGoodsMsg, "UGS_GooGoodsMsg", "12", _dicPost);
            }
            else if (_exeType == "3") //得到单个商品买家可使用的优惠券列表
            {
                // 获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string ExpenseReachSum = PublicClass.FilterRequestTrim("ExpenseReachSum");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("GoodsID", GoodsID);
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                _dicPost.Add("ExpenseReachSum", ExpenseReachSum);

                //得到单个商品买家可使用的优惠券列表
                return BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_CouponsIssueMsg, "T_CouponsIssueMsg", "4", _dicPost);
            }
            else if (_exeType == "4") //初始化默认使用的优惠券 单个
            {
                // 获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string SpecPropID = PublicClass.FilterRequestTrim("SpecPropID");
                string ExpenseReachSum = PublicClass.FilterRequestTrim("ExpenseReachSum");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("GoodsID", GoodsID);
                _dicPost.Add("SpecPropID", SpecPropID);
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                _dicPost.Add("ExpenseReachSum", ExpenseReachSum);

                //得到单个商品买家可使用的优惠券列表
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_CouponsIssueMsg, "T_CouponsIssueMsg", "5", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "5") //提交订单信息
            {
                // 获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string SpecID = PublicClass.FilterRequestTrim("SpecID");
                string OrderNum = PublicClass.FilterRequestTrim("OrderNum");
                //shop , express
                string ExpressType = PublicClass.FilterRequestTrim("ExpressType");

                string IssueID = PublicClass.FilterRequestTrim("IssueID");
                string InvoiceGuid = PublicClass.FilterRequestTrim("InvoiceGuid");
                string OrderMemo = PublicClass.FilterRequestTrim("OrderMemo");
                string OrderGuid = PublicClass.FilterRequestTrim("OrderGuid");

                //拼团
                string GroupSettingID = PublicClass.FilterRequestTrim("GroupSettingID");
                string GroupID = PublicClass.FilterRequestTrim("GroupID");


                //获取选择的收货地址ID
                string BReceiAddrID = "";
                if (ExpressType == "express")
                {
                    BReceiAddrID = BusiBuyer.getBReceiAddrIDSelCookie();

                    if (BReceiAddrID == "0" || string.IsNullOrWhiteSpace(BReceiAddrID))
                    {
                        return "12";
                    }
                }

                //---买家分享商品返佣 买家UserID----//
                string BuyerUserIDShare = "";
                //得到 买家分享商品返佣  Cookie信息数组
                string[] _buyerShareGoodsArr = BusiWebCookie.getBuyerShareGoodsCookieArr();
                if (_buyerShareGoodsArr != null)
                {
                    //自定分享的连接不能得到返佣
                    if (_buyerShareGoodsArr[0] == GoodsID && _loginBuyerUserID != _buyerShareGoodsArr[1])
                    {
                        BuyerUserIDShare = _buyerShareGoodsArr[1];
                    }
                }


                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("GoodsID", GoodsID);
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                _dicPost.Add("SpecID", SpecID);
                _dicPost.Add("OrderGuid", OrderGuid);
                _dicPost.Add("OrderNum", OrderNum);
                _dicPost.Add("ExpressType", ExpressType);
                _dicPost.Add("IssueID", IssueID);
                _dicPost.Add("InvoiceGuid", InvoiceGuid);
                _dicPost.Add("OrderMemo", OrderMemo);
                _dicPost.Add("BReceiAddrID", BReceiAddrID);
                //拼团
                _dicPost.Add("GroupSettingID", GroupSettingID);
                _dicPost.Add("GroupID", GroupID);
                //买家分享商品返佣 买家UserID
                _dicPost.Add("BuyerUserIDShare", BuyerUserIDShare);

                //提交订单信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_PlaceOrder, "T_PlaceOrder", "1", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "6") //处理订单选择的不同方式支付
            {
                string PayWay = PublicClass.FilterRequestTrim("PayWay");
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("PayWay", PayWay);
                _dicPost.Add("BillNumber", BillNumber);
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);

                //提交订单信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_PayOrder, "T_PayOrder", "1", _dicPost);
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 确认下单 -- 多商家多商品
        /// </summary>
        /// <returns></returns>
        public string PlaceOrderMul()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 初始化商家商品列表信息 Type=2 加载多个商品买家可使用的优惠券列表 (商家多个商品的订单) Type=3 判断订购商品库存是否足够 Type=4 初始化默认使用的优惠券 多个商品订单 Type=5 正式提交下单请求
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取去结算的Cookie  得到购物车信息ID 与之对应的  订购数量 拼接字符串 [ SCartID _ OrderNum ^ SCartID _ OrderNum]
                string ScartIDOrderNumArr = PublicClass.getCookieValue("ScartIDOrderNumArrCookie");

                //调用初始化订购下单信息[商家，商品，运费,默认优惠券，配送方式]
                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("ScartIDOrderNumArr", ScartIDOrderNumArr);
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);

                //得到当前选择的收货地址省份Code
                string _regionProCodeCookie = BusiBuyer.getReceiAddrRegionProCodeCookie();
                _dicPost.Add("RegionProCode", _regionProCodeCookie);

                //初始化订购商品信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGoodsMsg, "UGS_GooGoodsMsg", "13", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //加载多个商品买家可使用的优惠券列表 (商家多个商品的订单)
            {
                // 获取传递的参数
                string GoodsIDArr = PublicClass.FilterRequestTrim("GoodsIDArr");
                string GoodsUnitPriceArr = PublicClass.FilterRequestTrim("GoodsUnitPriceArr");
                string OrderExpenseReachSum = PublicClass.FilterRequestTrim("OrderExpenseReachSum");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("GoodsIDArr", GoodsIDArr);
                _dicPost.Add("GoodsUnitPriceArr", GoodsUnitPriceArr);
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                _dicPost.Add("OrderExpenseReachSum", OrderExpenseReachSum);

                //得到单个商品买家可使用的优惠券列表
                return BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_CouponsIssueMsg, "T_CouponsIssueMsg", "7", _dicPost);
            }
            else if (_exeType == "3") //判断订购商品库存是否足够
            {
                // 获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string SpecPropID = PublicClass.FilterRequestTrim("SpecPropID");
                string OrderNum = PublicClass.FilterRequestTrim("OrderNum");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "14");
                _dicPost.Add("GoodsID", GoodsID);
                _dicPost.Add("SpecPropIDArr", SpecPropID);
                _dicPost.Add("OrderNum", OrderNum);

                //调用加载父级类目列表函数
                return HttpService.Post(WebAppConfig.ApiUrl_UGS_GooGoodsMsg, _dicPost);
            }
            else if (_exeType == "4") //初始化默认使用的优惠券 多个商品订单
            {
                // 获取传递的参数
                string GoodsIDArr = PublicClass.FilterRequestTrim("GoodsIDArr");
                string SpecPropIDArr = PublicClass.FilterRequestTrim("SpecPropIDArr");
                string GoodsUnitPriceArr = PublicClass.FilterRequestTrim("GoodsUnitPriceArr");
                string ExpenseReachSum = PublicClass.FilterRequestTrim("ExpenseReachSum");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("GoodsIDArr", GoodsIDArr);
                _dicPost.Add("GoodsUnitPriceArr", GoodsUnitPriceArr);
                _dicPost.Add("SpecPropIDArr", SpecPropIDArr);
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                _dicPost.Add("ExpenseReachSum", ExpenseReachSum);

                //发送Http请求
                return BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_CouponsIssueMsg, "T_CouponsIssueMsg", "8", _dicPost);
            }
            else if (_exeType == "5") //正式提交下单请求
            {
                //获取传递的参数
                string JsonOrder = PublicClass.FilterRequestTrimNoConvert("JsonOrder");
                //JsonOrder = HttpContext.Server.UrlDecode(JsonOrder);

                //获取选择的收货地址ID
                string BReceiAddrID = BusiBuyer.getBReceiAddrIDSelCookie();

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                _dicPost.Add("BReceiAddrID", BReceiAddrID);
                _dicPost.Add("JsonOrder", JsonOrder);

                //发送Http请求
                return BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_PlaceOrderMul, "T_PlaceOrderMul", "1", _dicPost);
            }

            return "";
        }

        /// <summary>
        /// 订单发票信息
        /// </summary>
        /// <returns></returns>
        public string OrderInvoice()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 提交订单发票信息 Type=2 预加载订单发票信息 Type=3 预加载订单发票信息 多商品多商家
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string InvoiceGuid = PublicClass.FilterRequestTrim("InvoiceGuid");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string InvoiceType = PublicClass.FilterRequestTrim("InvoiceType");
                string InvoiceTitle = PublicClass.FilterRequestTrim("InvoiceTitle");
                string InvoiceContent = PublicClass.FilterRequestTrim("InvoiceContent");
                string CompanyName = PublicClass.FilterRequestTrim("CompanyName");
                string TaxNumber = PublicClass.FilterRequestTrim("TaxNumber");
                string CompanyRegAddr = PublicClass.FilterRequestTrim("CompanyRegAddr");
                string CompanyTel = PublicClass.FilterRequestTrim("CompanyTel");
                string BankAcc = PublicClass.FilterRequestTrim("BankAcc");
                string OpeningBank = PublicClass.FilterRequestTrim("OpeningBank");
                string ReceiMobile = PublicClass.FilterRequestTrim("ReceiMobile");
                string ReceiEmail = PublicClass.FilterRequestTrimNoConvert("ReceiEmail");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                _dicPost.Add("InvoiceGuid", InvoiceGuid);
                _dicPost.Add("ShopUserID", ShopUserID);
                _dicPost.Add("InvoiceType", InvoiceType);
                _dicPost.Add("InvoiceTitle", InvoiceTitle);
                _dicPost.Add("InvoiceContent", InvoiceContent);
                _dicPost.Add("CompanyName", CompanyName);
                _dicPost.Add("TaxNumber", TaxNumber);
                _dicPost.Add("CompanyRegAddr", CompanyRegAddr);
                _dicPost.Add("CompanyTel", CompanyTel);
                _dicPost.Add("BankAcc", BankAcc);
                _dicPost.Add("OpeningBank", OpeningBank);
                _dicPost.Add("ReceiMobile", ReceiMobile);
                _dicPost.Add("ReceiEmail", ReceiEmail);

                //提交订单发票信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderInvoice, "T_OrderInvoice", "4", _dicPost);
                return _jsonBack;

            }
            else if (_exeType == "2") //预加载订单发票信息
            {
                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);

                //预加载订单发票信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderInvoice, "T_OrderInvoice", "5", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "3") //预加载订单发票信息 多商品多商家
            {

                // 获取传递的参数
                string InvoiceGuid = PublicClass.FilterRequestTrim("InvoiceGuid");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                _dicPost.Add("InvoiceGuid", InvoiceGuid);

                //预加载订单发票信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderInvoice, "T_OrderInvoice", "6", _dicPost);
                return _jsonBack;
            }



            return "";
        }

        /// <summary>
        /// 银行转账支付
        /// </summary>
        /// <returns></returns>
        public string BankTransfer()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 初始化转账付款支付信息 [订单信息,平台转账银行信息,买家之前的转账汇款信息,] Type=2 上传买家转账凭证照片 Type=3 提交买家转账凭证照片信息 Type=4 提交买家汇款信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BillNumber", BillNumber);

                //提交订单发票信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_PayTransBankMsg, "T_PayTransBankMsg", "5", _dicPost);
                return _jsonBack;


            }
            else if (_exeType == "2") //上传买家转账凭证照片
            {
                // 获取传递的参数
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("Type", "1"); //操作类型 Type=1 上传
                _dic.Add("UserID", _loginBuyerUserID); //店铺ID
                _dic.Add("UploadGuid", UploadGuid);

                //调用上传函数
                string _backJson = BusiRndKeyUpload.httpNoLoginRndKeyRsaUpload(WebAppConfig.ApiUrl_FU_PayTransCertImg, "FU_PayTransCertImg", _dic);
                return _backJson;
            }
            else if (_exeType == "3") //提交买家转账凭证照片信息
            {
                // 获取传递的参数
                string ImgPath = PublicClass.FilterRequestTrimNoConvert("ImgPath");
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UserID", _loginBuyerUserID);
                _dic.Add("ImgPath", ImgPath);
                _dic.Add("BillNumber", BillNumber);
                _dic.Add("UploadGuid", UploadGuid);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_PayTransBankMsg, "T_PayTransBankMsg", "6", _dic);
                return _json;
            }
            else if (_exeType == "4") //提交买家汇款信息
            {
                // 获取传递的参数
                string BuyerBankName = PublicClass.FilterRequestTrimNoConvert("BuyerBankName");
                string BuyerBankAcc = PublicClass.FilterRequestTrimNoConvert("BuyerBankAcc");
                string BankName = PublicClass.FilterRequestTrimNoConvert("BankName");
                string TotalOrderPrice = PublicClass.FilterRequestTrimNoConvert("TotalOrderPrice");
                string UploadGuid = PublicClass.FilterRequestTrimNoConvert("UploadGuid");
                string BillNumber = PublicClass.FilterRequestTrimNoConvert("BillNumber");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UserID", _loginBuyerUserID);
                _dic.Add("BuyerBankName", BuyerBankName);
                _dic.Add("BuyerBankAcc", BuyerBankAcc);
                _dic.Add("BankName", BankName);
                _dic.Add("TotalOrderPrice", TotalOrderPrice);
                _dic.Add("BillNumber", BillNumber);
                _dic.Add("UploadGuid", UploadGuid);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_PayTransBankMsg, "T_PayTransBankMsg", "7", _dic);
                return _json;
            }

            return "";
        }

        #region【订单详情】

        /// <summary>
        /// 订单详情
        /// </summary>
        /// <returns></returns>
        public string OrderDetail()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 初始化订单详情信息 Type=2 更新订单的收货地址信息 Type=3 取消订单,关闭交易 Type=4 向商家发送-发货提醒信息 Type=5 申请退款(未发货) Type=6 向商家或平台发送提醒退款 Type=7 初始化 订单 [待消费/自取] 验证码 Type=8 确认收货 Type=9 延长自动确认收货时间 Type=10 加载订单第一个商品的简单信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                string OrderID = PublicClass.FilterRequestTrim("OrderID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("OrderID", OrderID);
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);

                //提交订单信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "4", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //更新订单的收货地址信息
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BReceiAddrID = PublicClass.FilterRequestTrim("BReceiAddrID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("OrderID", OrderID);
                _dicPost.Add("BReceiAddrID", BReceiAddrID);
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);

                //更新订单的收货地址信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderDelivery, "T_OrderDelivery", "3", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "3") //取消订单,关闭交易
            {
                string OrderID = PublicClass.FilterRequestTrim("OrderID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("OrderID", OrderID);
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);

                //取消订单,关闭交易
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "7", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "4") //向商家发送-发货提醒信息
            {
                // 获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string OrderID = PublicClass.FilterRequestTrim("OrderID");

                //----构造参数---//
                string MsgTitle = "提醒发货";//PublicClass.FilterRequestTrim("MsgTitle");
                string MsgContent = "买家提醒发货，订单ID：" + OrderID;//PublicClass.FilterRequestTrimNoConvert("MsgContent");
                string SysMsgType = "ORemind"; //PublicClass.FilterRequestTrim("SysMsgType");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("OrderID", OrderID);
                _dicPost.Add("ExtraData", OrderID);
                _dicPost.Add("MsgTitle", MsgTitle);
                _dicPost.Add("MsgContent", MsgContent);
                _dicPost.Add("SysMsgType", SysMsgType);
                _dicPost.Add("ShopUserID", ShopUserID);
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);

                //向商家发送-发货提醒信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_ShopSysMsg, "ASAC_ShopSysMsg", "2", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "5") //申请退款(未发货)
            {
                // 获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("OrderID", OrderID);
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);

                // 申请退款(未发货)
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "12", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "6") //向商家或平台发送提醒退款
            {
                // 获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string PayWayName = PublicClass.FilterRequestTrim("PayWayName");

                //----构造参数---// -- 向商家发送
                string MsgTitle = "提醒退款";//PublicClass.FilterRequestTrim("MsgTitle");
                string MsgContent = "【到店付】提醒退款，订单ID：" + OrderID;//PublicClass.FilterRequestTrimNoConvert("MsgContent");
                string SysMsgType = "ReRemind"; //PublicClass.FilterRequestTrim("SysMsgType");

                if (PayWayName.IndexOf("到店付") < 0)
                {
                    MsgContent = "提醒退款，订单ID：" + OrderID;
                }

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("OrderID", OrderID);
                _dicPost.Add("ExtraData", OrderID);
                _dicPost.Add("MsgTitle", MsgTitle);
                _dicPost.Add("MsgContent", MsgContent);
                _dicPost.Add("SysMsgType", SysMsgType);
                _dicPost.Add("ShopUserID", ShopUserID);
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);

                string _jsonBack = "";

                if (PayWayName.IndexOf("到店付") < 0)
                {
                    //向【平台】发送提醒退款
                    _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_PlatformSysMsg, "ASAC_PlatformSysMsg", "2", _dicPost);
                }
                else
                {
                    //向【商家】发送提醒退款
                    _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_ShopSysMsg, "ASAC_ShopSysMsg", "2", _dicPost);
                }
                return _jsonBack;
            }
            else if (_exeType == "7") //初始化 订单 [待消费/自取] 验证码
            {
                // 获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string IsReSet = PublicClass.FilterRequestTrim("IsReSet");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("OrderID", OrderID);
                _dicPost.Add("IsReSet", IsReSet); //false 不需要重新生成 true 重新生成
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);


                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderCheckCode, "T_OrderCheckCode", "1", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "8") //确认收货
            {
                // 获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("OrderID", OrderID);
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);

                //发送http请求 
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "15", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "9") //延长自动确认收货时间
            {
                // 获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("OrderID", OrderID);
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);

                //发送http请求 
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "16", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "10") //加载订单第一个商品的简单信息
            {
                // 获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("OrderID", OrderID);
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);

                //发送http请求 
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "26", _dicPost);
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 订单动态
        /// </summary>
        /// <returns></returns>
        public string OrderDynamic()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 初始化订单动态信息 
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                string OrderID = PublicClass.FilterRequestTrim("OrderID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("OrderID", OrderID);
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);

                //提交订单信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "6", _dicPost);
                return _jsonBack;

            }

            return "";
        }

        /// <summary>
        /// 订单快递 详情页
        /// </summary>
        /// <returns></returns>
        public string ExpressDetail()
        {

            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 查询快递跟踪信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                string OrderID = PublicClass.FilterRequestTrim("OrderID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("OrderID", OrderID);
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);

                //提交订单信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_ExpressDetail, "T_ExpressDetail", "1", _dicPost);
                return _jsonBack;

            }

            return "";
        }

        #endregion

    }
}