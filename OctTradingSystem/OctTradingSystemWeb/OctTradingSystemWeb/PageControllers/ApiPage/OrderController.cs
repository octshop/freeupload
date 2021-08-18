using BusiApiKeyVerifyNS;
using OctTradingSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【订单】相关的API接口控制器
/// </summary>
namespace OctTradingSystemWeb.PageControllers.ApiPage
{
    public class OrderController : Controller
    {
        #region【----公共变量(锁死线程)----】

        //是否执行 防止重复提交
        public static bool mIsNoRepeatExe = true;
        //锁对象,锁死线程
        private static object mLockImport = new object();

        #endregion


        // GET: Order
        public ActionResult Index()
        {
            return View();
        }


        /// <summary>
        /// 确认下单 提交订单
        /// </summary>
        /// <returns></returns>
        public string PlaceOrder()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //-------------锁死线程只能单线程执行-------//
            lock (mLockImport)
            {
                //----------------防止重复提交-----------------//
                if (mIsNoRepeatExe == false)
                {
                    return "NOREPEAT_02"; //可以重复次执行逻辑
                }
                mIsNoRepeatExe = false;


                //获取操作类型  Type=1 提交订单信息
                string _exeType = PublicClass.FilterRequestTrim("Type");
                if (_exeType == "1")
                {
                    // 获取传递的参数
                    string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                    string SpecID = PublicClass.FilterRequestTrim("SpecID");
                    string OrderNum = PublicClass.FilterRequestTrim("OrderNum");
                    //配送方式值：shop , express
                    string ExpressType = PublicClass.FilterRequestTrim("ExpressType");
                    string BReceiAddrID = PublicClass.FilterRequestTrim("BReceiAddrID");
                    string IssueID = PublicClass.FilterRequestTrim("IssueID");
                    string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                    string InvoiceGuid = PublicClass.FilterRequestTrim("InvoiceGuid");
                    string OrderMemo = PublicClass.FilterRequestTrim("OrderMemo");
                    //订单的GUID （标记一次性提交的订单信息）
                    string OrderGuid = PublicClass.FilterRequestTrim("OrderGuid");

                    //----拼团-----//
                    string GroupSettingID = PublicClass.FilterRequestTrim("GroupSettingID");
                    string GroupID = PublicClass.FilterRequestTrim("GroupID");

                    //----买家分享商品返佣金额及相关逻辑 - 只能单个商品订购时才返佣，否则会出逻辑问题---//
                    //分享商品的买家UserID （分享商品返佣）
                    string BuyerUserIDShare = PublicClass.FilterRequestTrim("BuyerUserIDShare");


                    //防止数字为空
                    GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);
                    SpecID = PublicClass.preventNumberDataIsNull(SpecID);
                    OrderNum = PublicClass.preventNumberDataIsNull(OrderNum);
                    BReceiAddrID = PublicClass.preventNumberDataIsNull(BReceiAddrID);
                    IssueID = PublicClass.preventNumberDataIsNull(IssueID);
                    BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                    GroupSettingID = PublicClass.preventNumberDataIsNull(GroupSettingID);
                    GroupID = PublicClass.preventNumberDataIsNull(GroupID);
                    BuyerUserIDShare = PublicClass.preventNumberDataIsNull(BuyerUserIDShare);


                    //提交下单信息 (单个商品) ---API调用方法
                    string _jsonBack = BusiOrder.placeOrderMsgSingleGoodsApi(Convert.ToInt64(GoodsID), Convert.ToInt64(SpecID), Convert.ToInt32(OrderNum), ExpressType, Convert.ToInt64(BReceiAddrID), Convert.ToInt64(IssueID), Convert.ToInt64(BuyerUserID), InvoiceGuid, OrderGuid, OrderMemo, Convert.ToInt64(GroupSettingID), Convert.ToInt64(GroupID), Convert.ToInt64(BuyerUserIDShare));

                    //-------可以再次执行逻辑--------//
                    mIsNoRepeatExe = true;
                    return _jsonBack;
                }

            }

            return "";
        }

        /// <summary>
        /// 确认下单 提交订单  -- 多商家多商品
        /// </summary>
        /// <returns></returns>
        public string PlaceOrderMul()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //-------------锁死线程只能单线程执行-------//
            lock (mLockImport)
            {
                //----------------防止重复提交-----------------//
                if (mIsNoRepeatExe == false)
                {
                    return "NOREPEAT_02"; //可以重复次执行逻辑
                }
                mIsNoRepeatExe = false;


                //获取操作类型  Type=1 提交订单信息--多商家多商品
                string _exeType = PublicClass.FilterRequestTrim("Type");
                if (_exeType == "1")
                {
                    // 获取传递的参数
                    string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                    string JsonOrder = PublicClass.FilterRequestTrimNoConvert("JsonOrder");
                    JsonOrder = HttpContext.Server.UrlDecode(JsonOrder);

                    string BReceiAddrID = PublicClass.FilterRequestTrimNoConvert("BReceiAddrID");

                    //防止数字为空
                    BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                    BReceiAddrID = PublicClass.preventNumberDataIsNull(BReceiAddrID);

                    //Json字符串加入收货地址信息
                    string buyerReceiAddrJson = ",";
                    buyerReceiAddrJson += "    \"BuyerReceiAddr\": {";
                    buyerReceiAddrJson += "        \"BReceiAddrID\": \"" + BReceiAddrID + "\"";
                    buyerReceiAddrJson += "    }}";

                    JsonOrder = JsonOrder.Substring(0, JsonOrder.Length - 1) + buyerReceiAddrJson;

                    //正式提交多商品多商家下单信息, 每个商家将生成一个订单
                    string _backMsg = BusiOrder.submitOrderMsgMulApi(Convert.ToInt64(BuyerUserID), JsonOrder);

                    //-------可以再次执行逻辑--------//
                    mIsNoRepeatExe = true;
                    return _backMsg;

                }

            }
            return "";
        }

        /// <summary>
        /// 订单信息
        /// </summary>
        /// <returns></returns>
        public string OrderMsg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 开关锁定信息 Type=3 商家买家订单数据分页  -- 移动端 Type=4 初始化订单详情信息 Type=5 初始化订单支付信息 Type=6 初始化订单动态信息  Type=7 取消订单,关闭交易 Type=8 确认货到付款订单 Type=9 批量确认货到付款订单 (商家操作)Type=10 确认买家的转账汇款(平台操作) Type=11 确认买家到店付款(商家操作) Type=12 申请退款(未发货时 - 买家操作) Type=13 商家处理退款申请 Type=14  处理【商家发货或送货】操作 Type=15 确认收货 --买家操作 Type=16 延长自动确认收货时间 --买家操作 Type=17 加载订单的商品信息(评价等显示) Type=18 商家拒收操作 Type=19 得到 BillNumber下的所有订单信息 Type=20 加载可以申请售后的订单(维修，换货，退货) 数据分页 Type=21 初始化申请信息的订单商品信息 Type=22 修改订单价格 Type=23 初始化分割订单商品信息 Type=24 搜索分页数据(后台CMS) Type=25 批量锁定/解锁订单信息 Type= 26 加载订单第一个商品的简单信息 Type=27 (后台CMS)在线支付退款处理 --带订单逻辑处理 - WeiXinPay [微信支付], Alipay[支付宝] , Balance[余额支付]  Type=28 已退款给买家商城数据逻辑处理 Type=29 自动确认收货-商家版
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");
                string GoodsIDArr = PublicClass.FilterRequestTrim("GoodsIDArr");
                string GoodsTitleArr = PublicClass.FilterRequestTrim("GoodsTitleArr");
                string GoodsSpecIDOrderNumArr = PublicClass.FilterRequestTrim("GoodsSpecIDOrderNumArr");
                string GoodsUnitPriceArr = PublicClass.FilterRequestTrim("GoodsUnitPriceArr");
                string IsSpecParamArr = PublicClass.FilterRequestTrim("IsSpecParamArr");
                string OrderStatus = PublicClass.FilterRequestTrim("OrderStatus");
                string OrderPrice = PublicClass.FilterRequestTrim("OrderPrice");
                string PayWay = PublicClass.FilterRequestTrim("PayWay");
                string IsPaySuccess = PublicClass.FilterRequestTrim("IsPaySuccess");
                string ExpressType = PublicClass.FilterRequestTrim("ExpressType");
                string IsAppraise = PublicClass.FilterRequestTrim("IsAppraise");
                string PayMemo = PublicClass.FilterRequestTrim("PayMemo");
                string OrderMemo = PublicClass.FilterRequestTrim("OrderMemo");
                string FtPlID = PublicClass.FilterRequestTrim("FtPlID");
                string FreightMoney = PublicClass.FilterRequestTrim("FreightMoney");
                string IssueID = PublicClass.FilterRequestTrim("IssueID");
                string UseMoney = PublicClass.FilterRequestTrim("UseMoney");
                string GiftIDArr = PublicClass.FilterRequestTrim("GiftIDArr");
                string IsMulGoods = PublicClass.FilterRequestTrim("IsMulGoods");
                string IsSettle = PublicClass.FilterRequestTrim("IsSettle");
                string IsRefund = PublicClass.FilterRequestTrim("IsRefund");
                string OrderIP = PublicClass.FilterRequestTrim("OrderIP");
                string PayTime = PublicClass.FilterRequestTrim("PayTime");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string OrderTime = PublicClass.FilterRequestTrim("OrderTime");

                string IsSk = PublicClass.FilterRequestTrim("IsSk");
                string IsGroup = PublicClass.FilterRequestTrim("IsGroup");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                OrderPrice = PublicClass.preventDecimalDataIsNull(OrderPrice);
                //FtPlID = PublicClass.preventNumberDataIsNull(FtPlID);
                FreightMoney = PublicClass.preventDecimalDataIsNull(FreightMoney);
                //IssueID = PublicClass.preventNumberDataIsNull(IssueID);
                UseMoney = PublicClass.preventDecimalDataIsNull(UseMoney);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);


                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelOrderMsg _modelOrderMsg = new ModelOrderMsg();
                _modelOrderMsg.OrderID = Convert.ToInt64(OrderID);
                _modelOrderMsg.BillNumber = BillNumber;
                _modelOrderMsg.GoodsIDArr = GoodsIDArr;
                _modelOrderMsg.GoodsTitleArr = GoodsTitleArr;
                _modelOrderMsg.GoodsSpecIDOrderNumArr = GoodsSpecIDOrderNumArr;
                _modelOrderMsg.GoodsUnitPriceArr = GoodsUnitPriceArr;
                _modelOrderMsg.IsSpecParamArr = IsSpecParamArr;
                _modelOrderMsg.OrderStatus = OrderStatus;
                _modelOrderMsg.OrderPrice = Convert.ToDecimal(OrderPrice);
                _modelOrderMsg.PayWay = PayWay;
                _modelOrderMsg.IsPaySuccess = IsPaySuccess;
                _modelOrderMsg.ExpressType = ExpressType;
                _modelOrderMsg.IsAppraise = IsAppraise;
                _modelOrderMsg.PayMemo = PayMemo;
                _modelOrderMsg.OrderMemo = OrderMemo;
                _modelOrderMsg.FtPlIDArr = FtPlID;
                _modelOrderMsg.FreightMoney = Convert.ToDecimal(FreightMoney);
                _modelOrderMsg.IssueIDArr = IssueID;
                _modelOrderMsg.UseMoney = Convert.ToDecimal(UseMoney);
                _modelOrderMsg.GiftIDArr = GiftIDArr;
                _modelOrderMsg.IsMulGoods = IsMulGoods;
                _modelOrderMsg.IsRefund = IsRefund;
                _modelOrderMsg.IsSettle = IsSettle;
                _modelOrderMsg.OrderIP = OrderIP;
                _modelOrderMsg.PayTime = PayTime;
                _modelOrderMsg.BuyerUserID = Convert.ToInt64(BuyerUserID);
                _modelOrderMsg.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelOrderMsg.IsLock = IsLock;
                _modelOrderMsg.OrderTime = OrderTime;


                // 要独立出来的查询条件 用【...... AND (" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //秒杀订单
                if (IsSk == "true")
                {
                    _initSQLCharWhere += " SkGoodsID<>0 ";
                }
                else if (IsSk == "false")
                {
                    _initSQLCharWhere += " SkGoodsID=0 OR SkGoodsID IS NULL ";
                }

                //拼团订单
                if (IsGroup == "true")
                {
                    _initSQLCharWhere += " GroupID<>0 ";
                }
                else if (IsGroup == "false")
                {
                    _initSQLCharWhere += " GroupID=0 OR GroupID IS NULL ";
                }


                //获取分页JSON数据字符串
                //不显示的字段值
                string[] _showFieldArr = { "PageOrder", "IsLock", "OrderGuid", "OrderIP" };
                string _strJson = BusiJsonPageStr.morePageJSONOrderMsg(_modelOrderMsg, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //开关锁定信息
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");

                //锁定订单信息 --API调用方法
                string _jsonBack = BusiOrder.toggleLockOrderMsgApi(Convert.ToInt64(OrderID));
                return _jsonBack;
            }
            else if (_exeType == "3") //商家买家订单数据分页 -- 移动端
            {
                string OrderStatus = PublicClass.FilterRequestTrim("OrderStatus");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                //配送方式（送货上门 express  到店消费自取 shop） 
                string ExpressType = PublicClass.FilterRequestTrim("ExpressType");
                //支付方式 （WeiXinPay [微信支付], Alipay[支付宝] , Transfer[银行转账] , Offline[线下付款(到店付)], PayDelivery [货到付款]  Balance[余额支付]）
                string PayWay = PublicClass.FilterRequestTrim("PayWay");
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string GoodsTitleArr = PublicClass.FilterRequestTrim("GoodsTitleArr");

                string IsLoadFieldName = PublicClass.FilterRequestTrim("IsLoadFieldName");
                //是否只加载拼团订单
                string GroupID = PublicClass.FilterRequestTrim("GroupID");



                //防止数字类型为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                GroupID = PublicClass.preventNumberDataIsNull(GroupID);

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelOrderMsg _modelOrderMsg = new ModelOrderMsg();
                //_modelOrderMsg.OrderStatus = OrderStatus;
                _modelOrderMsg.BuyerUserID = Convert.ToInt64(BuyerUserID);
                _modelOrderMsg.ShopUserID = Convert.ToInt64(ShopUserID);
                if (OrderID != "0" && string.IsNullOrWhiteSpace(OrderID) == false)
                {
                    _modelOrderMsg.OrderID = Convert.ToInt64(OrderID);
                }
                if (string.IsNullOrWhiteSpace(GoodsTitleArr) == false)
                {
                    _modelOrderMsg.GoodsTitleArr = GoodsTitleArr;
                }
                _modelOrderMsg.ExpressType = ExpressType;
                _modelOrderMsg.PayWay = PayWay;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";
                if (string.IsNullOrWhiteSpace(OrderStatus) == false)
                {
                    if (OrderStatus == "待付款")
                    {
                        _initSQLCharWhere = "OrderStatus='待付款' OR OrderStatus='待确认' OR OrderStatus='到店付' OR OrderStatus='转账'"; //待付款的状态
                    }
                    else if (OrderStatus == "待发货")
                    {
                        //待发货的状态
                        _initSQLCharWhere = "OrderStatus='待发货'";
                    }
                    else
                    {
                        _initSQLCharWhere = "OrderStatus='" + OrderStatus + "'";
                    }

                    _initSQLCharWhere = "(" + _initSQLCharWhere + ")";
                }

                //是否只加载拼团订单
                if (GroupID != "0" && string.IsNullOrWhiteSpace(GroupID) == false)
                {
                    if (string.IsNullOrWhiteSpace(_initSQLCharWhere) == false)
                    {
                        _initSQLCharWhere += " AND ";
                    }
                    _initSQLCharWhere += "(GroupID<>0 AND GroupID IS NOT NULL)";
                }


                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "OrderID", "BillNumber", "GoodsIDArr", "GoodsTitleArr", "GoodsSpecIDOrderNumArr", "GoodsUnitPriceArr", "IsSpecParamArr", "OrderStatus", "OrderPrice", "ExpressType", "IsAppraise", "IsAppraise", "OrderTime", "PayWay", "IsDelayFinishTime", "ShopUserID", "SkGoodsID", "GroupID", "IsAgreeRefund" };
                string _strJson = BusiJsonPageStr.morePageJSONOrderMsg(_modelOrderMsg, PageCurrent, _initSQLCharWhere, _showFieldArr, false, "wap", "PageOrder DESC", IsLoadFieldName);

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "4") //初始化订单详情信息
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");


                //防止数字为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //初始化订单详情信息 --API调用方法
                string _jsonBack = BusiOrder.initOrderDetailApi(Convert.ToInt64(OrderID), Convert.ToInt64(BuyerUserID), Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "5") //初始化订单支付信息
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                // 初始化订单支付详细信息 --API调用方法
                string _jsonBack = BusiOrder.initOrderPayDetailApi(Convert.ToInt64(OrderID), Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }
            else if (_exeType == "6") //初始化订单动态信息 
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //得到 订单动态消息列表 包括 买家消息和商家消息 --API调用方法
                string _jsonBack = BusiOrder.getListModelOrderSysMsgApi(Convert.ToInt64(OrderID), Convert.ToInt64(BuyerUserID), Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "7") //取消订单,关闭交易
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //取消订单,关闭交易 --API调用方法
                string _jsonBack = BusiOrder.cancelOrderApi(Convert.ToInt64(OrderID), Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }
            else if (_exeType == "8") //确认货到付款订单
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //确认货到付款订单(商家操作)
                string _jsonBack = BusiOrder.confirmPayDeliveryApi(Convert.ToInt64(OrderID), BillNumber, Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "9") //批量确认货到付款订单
            {
                // 获取传递的参数
                string OrderIDArr = PublicClass.FilterRequestTrim("OrderIDArr");
                string BillNumberArr = PublicClass.FilterRequestTrim("BillNumberArr");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                //防止数字为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //批量 - 确认货到付款订单(商家操作)
                string _jsonBack = BusiOrder.confirmPayDeliveryMulApi(OrderIDArr, BillNumberArr, Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "10") //确认买家的转账汇款(平台操作)
            {
                // 获取传递的参数
                string OrderIDArr = PublicClass.FilterRequestTrim("OrderIDArr");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");
                //用BillNumber 确认买家的转账汇款
                if (string.IsNullOrWhiteSpace(OrderIDArr) && string.IsNullOrWhiteSpace(BillNumber) == false)
                {
                    OrderIDArr = BusiOrder.getOrderIDArrByBillNumberStr(BillNumber);
                }


                //防止数字为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //确认收到订单 银行转账金额 ---支持多订单 --API调用方法 
                string _jsonBack = BusiOrder.confirmTransferPayMulApi(OrderIDArr, Convert.ToInt64(ShopUserID));
                return _jsonBack;

            }
            else if (_exeType == "11") //Type=11 确认买家到店付款(商家操作)
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //确认买家到店付款(商家操作)
                string _jsonBack = BusiOrder.confirmOfflinePayApi(Convert.ToInt64(OrderID), BillNumber, Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "12") //申请退款(未发货时 - 买家操作)
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字为空 
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //买家申请退款（未发货时） --API调用方法
                string _jsonBack = BusiRefund.applyRefundNoSendGoodsApi(Convert.ToInt64(OrderID), Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }
            else if (_exeType == "13") //商家处理退款申请
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //商家--处理退款申请, 如果是【到店付】就直接进行退款操作 --API调用方法
                string _jsonBack = BusiRefund.dealRefundShopApi(Convert.ToInt64(OrderID), Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "14") // 处理【商家发货或送货】操作 
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string SendType = PublicClass.FilterRequestTrim("SendType");
                string ExpressName = PublicClass.FilterRequestTrim("ExpressName");
                string ExpressNumber = PublicClass.FilterRequestTrim("ExpressNumber");
                string SendTelNumber = PublicClass.FilterRequestTrim("SendTelNumber");
                string SendShopMan = PublicClass.FilterRequestTrim("SendShopMan");
                string SendGoodsMemo = PublicClass.FilterRequestTrim("SendGoodsMemo");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                //操作类型[Add/Edit]
                string ExeType = PublicClass.FilterRequestTrim("ExeType");

                string _jsonBack = BusiOrder.proSendGoodsOrderApi(Convert.ToInt64(OrderID), SendType, ExpressName, ExpressNumber, SendTelNumber, SendShopMan, SendGoodsMemo, Convert.ToInt64(ShopUserID), ExeType);
                return _jsonBack;
            }
            else if (_exeType == "15") //确认收货 --买家操作
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


                    //获取传递的参数
                    string OrderID = PublicClass.FilterRequestTrim("OrderID");
                    string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                    string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                    //防止数字为空
                    OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                    BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                    ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                    //确认收货 --买家操作
                    string _jsonBack = BusiOrder.confirmReceiOrderApi(Convert.ToInt64(OrderID), Convert.ToInt64(BuyerUserID), Convert.ToInt64(ShopUserID));

                    //-------可以再次执行逻辑--------//
                    mIsNoRepeatExe = true;
                    return _jsonBack;

                }


            }
            else if (_exeType == "16") //延长自动确认收货时间 --买家操作
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //确认收货 --买家操作
                string _jsonBack = BusiOrder.delayReceiOrderApi(Convert.ToInt64(OrderID), Convert.ToInt64(BuyerUserID), Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "17") //加载订单的商品信息(评价等显示)
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //加载订单的商品相关信息 
                string _jsonBack = BusiOrder.loadOrderGoodsMsgApi(Convert.ToInt64(OrderID), Convert.ToInt64(BuyerUserID), Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "18") //商家拒收操作
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //加载订单的商品相关信息 
                string _jsonBack = BusiOrder.rejectReceiOrderApi(Convert.ToInt64(OrderID), Convert.ToInt64(ShopUserID), Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }
            else if (_exeType == "19") //得到 BillNumber下的所有订单信息
            {
                //获取传递的参数
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string IsPaySuccess = PublicClass.FilterRequestTrim("IsPaySuccess");

                //防止数字为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //得到 BillNumber下的所有订单信息
                string _jsonBack = BusiOrder.getBillNumberOrderMsgArrApi(BillNumber, Convert.ToInt64(BuyerUserID), IsPaySuccess);
                return _jsonBack;
            }
            else if (_exeType == "20") //加载可以申请售后的订单(维修，换货，退货) 数据分页
            {

                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");


                //防止数字类型为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);


                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelOrderMsg _modelOrderMsg = new ModelOrderMsg();
                //_modelOrderMsg.OrderStatus = OrderStatus;
                _modelOrderMsg.BuyerUserID = Convert.ToInt64(BuyerUserID);
                _modelOrderMsg.IsLock = "false";
                _modelOrderMsg.IsSettle = "false";
                _modelOrderMsg.IsRefund = "false";

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";
                _initSQLCharWhere += "OrderStatus='完成' OR OrderStatus='待评价'";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "OrderID", "BillNumber", "GoodsIDArr", "GoodsTitleArr", "GoodsSpecIDOrderNumArr", "GoodsUnitPriceArr", "IsSpecParamArr", "OrderStatus", "OrderPrice", "ExpressType", "OrderTime", "PayWay", "ShopUserID", "FinishTime" };
                string _strJson = BusiJsonPageStr.morePageJSONOrderMsg(_modelOrderMsg, PageCurrent, _initSQLCharWhere, _showFieldArr, false, "wap", "PageOrder DESC", "");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "21") //初始化售后申请的订单商品信息 
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string SpecID = PublicClass.FilterRequestTrim("SpecID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字类型为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);
                SpecID = PublicClass.preventNumberDataIsNull(SpecID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //初始化售后申请的订单商品信息  --API调用方法
                string _jsonBack = BusiOrder.initAsOrderGoodsMsg(Convert.ToInt64(OrderID), Convert.ToInt64(GoodsID), Convert.ToInt64(SpecID), Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }
            else if (_exeType == "22") //修改订单价格
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string OrderPrice = PublicClass.FilterRequestTrim("OrderPrice");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字类型为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                OrderPrice = PublicClass.preventDecimalDataIsNull(OrderPrice);
                ShopUserID = PublicClass.preventDecimalDataIsNull(ShopUserID);

                //商家修改订单价格--API调用方法
                string _jsonBack = BusiOrder.modifyOrderPriceApi(Convert.ToInt64(OrderID), Convert.ToDecimal(OrderPrice), Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "23") //初始化分割订单商品信息
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");

                //防止数字类型为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);

                string _jsonBack = BusiOrder.initSplitOrderGoodsMsgApi(Convert.ToInt64(OrderID));
                return _jsonBack;
            }
            else if (_exeType == "24") //搜索分页数据(后台CMS)
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");
                string GoodsIDArr = PublicClass.FilterRequestTrim("GoodsIDArr");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string GiftIDArr = PublicClass.FilterRequestTrim("GiftIDArr");
                string OrderStatus = PublicClass.FilterRequestTrim("OrderStatus");
                string PayWay = PublicClass.FilterRequestTrim("PayWay");
                string IsPaySuccess = PublicClass.FilterRequestTrim("IsPaySuccess");
                string ExpressType = PublicClass.FilterRequestTrim("ExpressType");
                string IssueIDArr = PublicClass.FilterRequestTrim("IssueIDArr");
                string GroupID = PublicClass.FilterRequestTrim("GroupID");
                string SkGoodsID = PublicClass.FilterRequestTrim("SkGoodsID");
                string IsSettle = PublicClass.FilterRequestTrim("IsSettle");
                string IsRefund = PublicClass.FilterRequestTrim("IsRefund");
                string IsPayService = PublicClass.FilterRequestTrim("IsPayService");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string PayTime = PublicClass.FilterRequestTrim("PayTime");
                string FinishTime = PublicClass.FilterRequestTrim("FinishTime");
                string OrderTime = PublicClass.FilterRequestTrim("OrderTime");


                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                GroupID = PublicClass.preventNumberDataIsNull(GroupID);
                SkGoodsID = PublicClass.preventNumberDataIsNull(SkGoodsID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelOrderMsg _modelOrderMsg = new ModelOrderMsg();
                _modelOrderMsg.OrderID = Convert.ToInt64(OrderID);
                _modelOrderMsg.BillNumber = BillNumber;
                _modelOrderMsg.GoodsIDArr = GoodsIDArr;
                _modelOrderMsg.OrderStatus = OrderStatus;
                _modelOrderMsg.PayWay = PayWay;
                _modelOrderMsg.IssueIDArr = IssueIDArr;
                _modelOrderMsg.GroupID = Convert.ToInt64(GroupID);
                _modelOrderMsg.SkGoodsID = Convert.ToInt64(SkGoodsID);
                _modelOrderMsg.IsPayService = IsPayService;
                _modelOrderMsg.FinishTime = FinishTime;
                _modelOrderMsg.IsPaySuccess = IsPaySuccess;
                _modelOrderMsg.ExpressType = ExpressType;
                _modelOrderMsg.GiftIDArr = GiftIDArr;
                _modelOrderMsg.IsRefund = IsRefund;
                _modelOrderMsg.IsSettle = IsSettle;
                _modelOrderMsg.PayTime = PayTime;
                _modelOrderMsg.BuyerUserID = Convert.ToInt64(BuyerUserID);
                _modelOrderMsg.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelOrderMsg.IsLock = IsLock;
                _modelOrderMsg.OrderTime = OrderTime;


                // 要独立出来的查询条件 用【...... AND (" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";


                //获取分页JSON数据字符串
                //不显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONOrderMsg(_modelOrderMsg, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "25") //批量锁定/解锁订单信息
            {
                //获取传递的参数
                string OrderIDArr = PublicClass.FilterRequestTrim("OrderIDArr");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                string _jsonBack = BusiOrder.lockOrderMsgArrApi(OrderIDArr, IsLock);
                return _jsonBack;
            }
            else if (_exeType == "26") //加载订单第一个商品的简单信息
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");

                //防止数字类型为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);

                string _jsonBack = BusiOrder.loadOrderFirstGoodsMsgSimpleApi(Convert.ToInt64(OrderID));
                return _jsonBack;

            }
            else if (_exeType == "27") //(后台CMS)在线支付退款处理 --带订单逻辑处理 - WeiXinPay [微信支付], Alipay[支付宝] , Balance[余额支付] 
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string PayWay = PublicClass.FilterRequestTrim("PayWay");
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");
                string RefundAmount = PublicClass.FilterRequestTrim("RefundAmount");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                string IsCmsRefund = PublicClass.FilterRequestTrim("IsCmsRefund");


                //防止数字为空
                RefundAmount = PublicClass.preventDecimalDataIsNull(RefundAmount);
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiRefund.refundOnLinePayLogicOrderApi(Convert.ToInt64(OrderID), PayWay, BillNumber, RefundAmount, Convert.ToInt64(BuyerUserID), Convert.ToInt64(ShopUserID), IsCmsRefund);
                return _jsonBack;
            }
            else if (_exeType == "28") //已退款给买家商城数据逻辑处理
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiRefund.proRefundedToBuyerDataApi(Convert.ToInt64(OrderID), Convert.ToInt64(ShopUserID), Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }
            else if (_exeType == "29") //自动确认收货-商家版
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

                    //获取传递的参数
                    string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                    //防止数字为空
                    ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                    string _jsonBack = BusiOrder.autoConfirmReceiOrderShopApi(Convert.ToInt64(ShopUserID));

                    //-------可以再次执行逻辑--------//
                    mIsNoRepeatExe = true;
                    return _jsonBack;
                }
            }

            return "";
        }

        /// <summary>
        /// 处理商家 订单详情页 操作Ajax
        /// </summary>
        /// <returns></returns>
        public string OrderDetailShop()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 初始化商家端订单详情
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //初始化订单详情信息 --API调用方法
                string _jsonBack = BusiOrder.initOrderDetailShopApi(Convert.ToInt64(OrderID), Convert.ToInt64(ShopUserID), Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 订单收货信息
        /// </summary>
        /// <returns></returns>
        public string OrderDelivery()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 添加/编辑信息 Type=3 更新订单的收货地址 Type=4 初始化订单收货地址信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string DeliveryID = PublicClass.FilterRequestTrim("DeliveryID");
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string DeliName = PublicClass.FilterRequestTrim("DeliName");
                string Mobile = PublicClass.FilterRequestTrim("Mobile");
                string RegionCodeArr = PublicClass.FilterRequestTrim("RegionCodeArr");
                string RegionNameArr = PublicClass.FilterRequestTrim("RegionNameArr");
                string DetailAddr = PublicClass.FilterRequestTrim("DetailAddr");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                DeliveryID = PublicClass.preventNumberDataIsNull(DeliveryID);
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelOrderDelivery _modelOrderDelivery = new ModelOrderDelivery();
                _modelOrderDelivery.DeliveryID = Convert.ToInt64(_modelOrderDelivery.DeliveryID);
                _modelOrderDelivery.OrderID = Convert.ToInt64(_modelOrderDelivery.OrderID);
                _modelOrderDelivery.DeliName = DeliName;
                _modelOrderDelivery.Mobile = Mobile;
                _modelOrderDelivery.RegionCodeArr = RegionCodeArr;
                _modelOrderDelivery.RegionNameArr = RegionNameArr;
                _modelOrderDelivery.DetailAddr = DetailAddr;
                _modelOrderDelivery.BuyerUserID = Convert.ToInt64(BuyerUserID);
                _modelOrderDelivery.IsLock = IsLock;
                _modelOrderDelivery.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONOrderDelivery(_modelOrderDelivery, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加/编辑信息
            {
                // 获取传递的参数
                string DeliveryID = PublicClass.FilterRequestTrim("DeliveryID");
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string DeliName = PublicClass.FilterRequestTrim("DeliName");
                string Mobile = PublicClass.FilterRequestTrim("Mobile");
                string RegionCodeArr = PublicClass.FilterRequestTrim("RegionCodeArr");
                string RegionNameArr = PublicClass.FilterRequestTrim("RegionNameArr");
                string DetailAddr = PublicClass.FilterRequestTrim("DetailAddr");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //防止数字类型为空
                DeliveryID = PublicClass.preventNumberDataIsNull(DeliveryID);
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //提交 订单收货信息 --API调用方法
                string _jsonBack = BusiOrder.submitOrderDeliveryApi(Convert.ToInt64(DeliveryID), Convert.ToInt64(OrderID), DeliName, Mobile, RegionCodeArr, RegionNameArr, DetailAddr, Convert.ToInt64(BuyerUserID), IsLock);
                return _jsonBack;
            }
            else if (_exeType == "3") //更新订单的收货地址
            {
                // 获取传递的参数
                string BReceiAddrID = PublicClass.FilterRequestTrim("BReceiAddrID");
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字类型为空
                BReceiAddrID = PublicClass.preventNumberDataIsNull(BReceiAddrID);
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //保存与更新订单收货地址 --API调用方法
                string _jsonBack = BusiOrder.saveOrderDeliveryApi(Convert.ToInt64(BReceiAddrID), Convert.ToInt64(OrderID), Convert.ToInt64(BuyerUserID));

                return _jsonBack;
            }
            else if (_exeType == "4") //初始化订单收货地址信息
            {
                // 获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字类型为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //初始化订单的收货信息 --API调用方法
                string _jsonBack = BusiOrder.initOrderDeliveryApi(Convert.ToInt64(OrderID), Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }


            return "";
        }

        /// <summary>
        /// 订单发货信息
        /// </summary>
        /// <returns></returns>
        public string OrderSendGoods()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 添加/编辑信息 Type=3 锁定信息 Type=4 初始化订单发货信息 Type=5 查询订单发货信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string SendGoodsID = PublicClass.FilterRequestTrim("SendGoodsID");
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string SendType = PublicClass.FilterRequestTrim("SendType");
                string ExpressName = PublicClass.FilterRequestTrim("ExpressName");
                string ExpressNumber = PublicClass.FilterRequestTrim("ExpressNumber");
                string SendTelNumber = PublicClass.FilterRequestTrim("SendTelNumber");
                string SendShopMan = PublicClass.FilterRequestTrim("SendShopMan");
                string TakeShopAddress = PublicClass.FilterRequestTrim("TakeShopAddress");
                string SendGoodsMemo = PublicClass.FilterRequestTrim("SendGoodsMemo");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                SendGoodsID = PublicClass.preventNumberDataIsNull(SendGoodsID);
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelOrderSendGoods _modelOrderSendGoods = new ModelOrderSendGoods();
                _modelOrderSendGoods.SendGoodsID = Convert.ToInt64(_modelOrderSendGoods.SendGoodsID);
                _modelOrderSendGoods.OrderID = Convert.ToInt64(_modelOrderSendGoods.OrderID);
                _modelOrderSendGoods.SendType = SendType;
                _modelOrderSendGoods.ExpressName = ExpressName;
                _modelOrderSendGoods.ExpressNumber = ExpressNumber;
                _modelOrderSendGoods.SendTelNumber = SendTelNumber;
                _modelOrderSendGoods.SendShopMan = SendShopMan;
                _modelOrderSendGoods.TakeShopAddress = TakeShopAddress;
                _modelOrderSendGoods.SendGoodsMemo = SendGoodsMemo;
                _modelOrderSendGoods.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelOrderSendGoods.IsLock = IsLock;
                _modelOrderSendGoods.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONOrderSendGoods(_modelOrderSendGoods, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加/编辑信息
            {
                // 获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string SendType = PublicClass.FilterRequestTrim("SendType");
                string ExpressName = PublicClass.FilterRequestTrim("ExpressName");
                string ExpressNumber = PublicClass.FilterRequestTrim("ExpressNumber");
                string SendTelNumber = PublicClass.FilterRequestTrim("SendTelNumber");
                string SendShopMan = PublicClass.FilterRequestTrim("SendShopMan");
                string TakeShopAddress = PublicClass.FilterRequestTrim("TakeShopAddress");
                string SendGoodsMemo = PublicClass.FilterRequestTrim("SendGoodsMemo");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //防止数字类型为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //提交 订单收货信息 --API调用方法
                string _jsonBack = BusiOrder.submitOrderSendGoodsApi(Convert.ToInt64(OrderID), SendType, ExpressName, ExpressNumber, SendTelNumber, SendShopMan, TakeShopAddress, SendGoodsMemo, Convert.ToInt64(ShopUserID), IsLock);
                return _jsonBack;
            }
            else if (_exeType == "3") //锁定信息
            {
                // 获取传递的参数
                string SendGoodsID = PublicClass.FilterRequestTrim("SendGoodsID");

                //锁定 订单发货信息  --API调用方法
                string _jsonBack = BusiOrder.toggleLockOrderSendGoodsApi(Convert.ToInt64(SendGoodsID));
                return _jsonBack;
            }
            else if (_exeType == "4") //初始化订单发货信息
            {
                // 获取传递的参数
                string SendType = PublicClass.FilterRequestTrim("SendType");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字类型为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //初始化订单发货信息 --API调用方法
                string _jsonBack = BusiOrder.initOrderSendGoodsApi(Convert.ToInt64(ShopUserID), SendType);
                return _jsonBack;
            }
            else if (_exeType == "5") //查询订单发货信息
            {
                // 获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字类型为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //查询订单发货信息 --API调用方法
                string _jsonBack = BusiOrder.queryOrderSendGoodsApi(Convert.ToInt64(OrderID), Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            return "";
        }

        /// <summary>
        /// 订单发票管理
        /// </summary>
        /// <returns></returns>
        public string OrderInvoice()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 添加/编辑信息 Type=3 删除信息 Type=4 增加 订单发票信息 Type=5 预加载订单发票信息 Type=6 预加载订单发票信息 多商品多商家 Type=7 发票置于-已开票状态
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string InvoiceID = PublicClass.FilterRequestTrim("InvoiceID");
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string InvoiceType = PublicClass.FilterRequestTrim("InvoiceType");
                string InvoiceTitle = PublicClass.FilterRequestTrim("InvoiceTitle");
                string ReceiMobile = PublicClass.FilterRequestTrim("ReceiMobile");
                string ReceiEmail = PublicClass.FilterRequestTrim("ReceiEmail");
                string InvoiceContent = PublicClass.FilterRequestTrim("InvoiceContent");
                string CompanyName = PublicClass.FilterRequestTrim("CompanyName");
                string CompanyTel = PublicClass.FilterRequestTrim("CompanyTel");
                string OpeningBank = PublicClass.FilterRequestTrim("OpeningBank");
                string IsInvoiced = PublicClass.FilterRequestTrim("IsInvoiced");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");



                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                InvoiceID = PublicClass.preventNumberDataIsNull(InvoiceID);
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelOrderInvoice _modelOrderInvoice = new ModelOrderInvoice();
                _modelOrderInvoice.InvoiceID = Convert.ToInt64(InvoiceID);
                _modelOrderInvoice.OrderID = Convert.ToInt64(OrderID);
                _modelOrderInvoice.InvoiceType = InvoiceType;
                _modelOrderInvoice.InvoiceTitle = InvoiceTitle;
                _modelOrderInvoice.ReceiMobile = ReceiMobile;
                _modelOrderInvoice.ReceiEmail = ReceiEmail;
                _modelOrderInvoice.InvoiceContent = InvoiceContent;
                _modelOrderInvoice.CompanyName = CompanyName;
                _modelOrderInvoice.CompanyTel = CompanyTel;
                _modelOrderInvoice.OpeningBank = OpeningBank;
                _modelOrderInvoice.IsInvoiced = IsInvoiced;
                _modelOrderInvoice.IsLock = IsLock;
                _modelOrderInvoice.BuyerUserID = Convert.ToInt64(BuyerUserID);
                _modelOrderInvoice.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelOrderInvoice.WriteDate = WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONOrderInvoice(_modelOrderInvoice, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加/编辑信息
            {
                // 获取传递的参数
                string InvoiceID = PublicClass.FilterRequestTrim("InvoiceID");
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string InvoiceGuid = PublicClass.FilterRequestTrim("InvoiceGuid");
                string InvoiceType = PublicClass.FilterRequestTrim("InvoiceType");
                string InvoiceTitle = PublicClass.FilterRequestTrim("InvoiceTitle");
                string ReceiMobile = PublicClass.FilterRequestTrim("ReceiMobile");
                string ReceiEmail = PublicClass.FilterRequestTrim("ReceiEmail");
                string InvoiceContent = PublicClass.FilterRequestTrim("InvoiceContent");
                string CompanyName = PublicClass.FilterRequestTrim("CompanyName");
                string TaxNumber = PublicClass.FilterRequestTrim("TaxNumber");
                string CompanyRegAddr = PublicClass.FilterRequestTrim("CompanyRegAddr");
                string CompanyTel = PublicClass.FilterRequestTrim("CompanyTel");
                string BankAcc = PublicClass.FilterRequestTrim("BankAcc");
                string OpeningBank = PublicClass.FilterRequestTrim("OpeningBank");
                string BankCode = PublicClass.FilterRequestTrim("BankCode");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //调用提交函数
                string _jsonBack = BusiOrder.submitOrderInvoiceApi(Convert.ToInt64(InvoiceID), Convert.ToInt64(OrderID), InvoiceGuid, InvoiceType, InvoiceTitle, ReceiMobile, ReceiEmail, InvoiceContent, CompanyName, TaxNumber, CompanyRegAddr, CompanyTel, BankAcc, OpeningBank, BankCode, Convert.ToInt64(BuyerUserID), Convert.ToInt64(ShopUserID), IsLock);
                return _jsonBack;
            }
            else if (_exeType == "3") //删除信息
            {
                // 获取传递的参数
                string InvoiceID = PublicClass.FilterRequestTrim("InvoiceID");

                //调用删除函数
                return BusiOrder.delOrderInvoiceApi(Convert.ToInt64(InvoiceID));
            }
            else if (_exeType == "4") //增加 订单发票信息
            {
                // 获取传递的参数
                string InvoiceGuid = PublicClass.FilterRequestTrim("InvoiceGuid");
                string InvoiceType = PublicClass.FilterRequestTrim("InvoiceType");
                string InvoiceTitle = PublicClass.FilterRequestTrim("InvoiceTitle");
                string ReceiMobile = PublicClass.FilterRequestTrim("ReceiMobile");
                string ReceiEmail = PublicClass.FilterRequestTrimNoConvert("ReceiEmail");
                string InvoiceContent = PublicClass.FilterRequestTrim("InvoiceContent");
                string CompanyName = PublicClass.FilterRequestTrim("CompanyName");
                string TaxNumber = PublicClass.FilterRequestTrim("TaxNumber");
                string CompanyRegAddr = PublicClass.FilterRequestTrim("CompanyRegAddr");
                string CompanyTel = PublicClass.FilterRequestTrim("CompanyTel");
                string BankAcc = PublicClass.FilterRequestTrim("BankAcc");
                string OpeningBank = PublicClass.FilterRequestTrim("OpeningBank");
                string BankCode = PublicClass.FilterRequestTrim("BankCode");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                if (string.IsNullOrWhiteSpace(InvoiceTitle))
                {
                    return "";
                }

                //防止数字为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //增加 订单发票信息 ---API调用方法
                string _jsonBack = BusiOrder.addOrderInvoiceApi(InvoiceGuid, InvoiceType, InvoiceTitle, ReceiMobile, ReceiEmail, InvoiceContent, CompanyName, TaxNumber, CompanyRegAddr, CompanyTel, BankAcc, OpeningBank, BankCode, Convert.ToInt64(BuyerUserID), Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "5") //预加载订单发票信息
            {
                // 获取传递的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                //防止数字为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //预加载订单发票信息
                string _jsonBack = BusiOrder.preLoadOrderInvoiceMsgApi(Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }
            else if (_exeType == "6") //预加载订单发票信息 多商品多商家
            {
                // 获取传递的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string InvoiceGuid = PublicClass.FilterRequestTrim("InvoiceGuid");
                //防止数字为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //预加载 买家订单发票信息 多商品商家模式 --API调用方法 
                string _jsonBack = BusiOrder.preLoadOrderInvoiceMulApi(Convert.ToInt64(BuyerUserID), InvoiceGuid);
                return _jsonBack;
            }
            else if (_exeType == "7") //发票置于-已开票状态
            {
                // 获取传递的参数
                string InvoiceIDArr = PublicClass.FilterRequestTrim("InvoiceIDArr");

                string _jsonBack = BusiOrder.makedOrderInvoiceApi(InvoiceIDArr);
                return _jsonBack;
            }


            return "";
        }

        /// <summary>
        /// 订单验证码信息 -- 待消费/自取
        /// </summary>
        /// <returns></returns>
        public string OrderCheckCode()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 初始化订单验证码 Type=2 商家验证核销订单- 到店消费/自取 Type=3 查询核销验证订单信息列表
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string IsReSet = PublicClass.FilterRequestTrim("IsReSet");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //初始化 - 创建与更新 订单 [待消费/自取] 验证码 --API调用方法
                string _jsonBack = BusiOrder.initShopCheckOrderStatusApi(Convert.ToInt64(OrderID), IsReSet, Convert.ToInt64(ShopUserID), Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }
            else if (_exeType == "2") //商家验证核销 订单 - 到店消费/自取
            {
                // 获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string CheckType = PublicClass.FilterRequestTrim("CheckType");
                string CheckCode = PublicClass.FilterRequestTrim("CheckCode");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string OrderID = PublicClass.FilterRequestTrim("OrderID");

                //防止数字为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //商家验证核销 订单 - 到店消费/自取
                string _jsonBack = BusiOrder.verifyCheckCodeOrderStatusShopApi(Convert.ToInt64(ShopUserID), CheckType, CheckCode, Convert.ToInt64(BuyerUserID), Convert.ToInt64(OrderID));
                return _jsonBack;
            }
            else if (_exeType == "3") //查询核销验证订单信息列表
            {
                // 获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string CheckCode = PublicClass.FilterRequestTrim("CheckCode");
                string OrderID = PublicClass.FilterRequestTrim("OrderID");

                //防止数字为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //查询核销验证订单信息列表 -- API调用方法 
                string _jsonBack = BusiOrder.searchCheckOrderListApi(Convert.ToInt64(ShopUserID), CheckCode, Convert.ToInt64(OrderID));
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 确认收货，验证消费/自取 时,赠送相关信息
        /// </summary>
        /// <returns></returns>
        public string OrderGivingMsg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 获取确认收货，验证消费/自取 时,赠送信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //获取确认收货，验证消费/自取 时,赠送信息
                string _jsonBack = BusiOrder.getConfirmReceiOrderGivingMsgApi(Convert.ToInt64(OrderID), Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 查看快递物流信息
        /// </summary>
        /// <returns></returns>
        public string ExpressDetail()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 查询快递跟踪信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");

                //防止数字类型为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);

                string _jsonBack = BusiExpress.searchOrderExpressApi(Convert.ToInt64(OrderID));
                return _jsonBack;
            }


            return "";
        }


    }
}