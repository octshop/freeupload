using BusiApiHttpNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【交易系统订单与财务( OctTradingSystem )】Ajax请求控制器
/// </summary>
namespace OctCmsSystemWeb.PageControllers.AjaxPage
{
    public class TradingController : Controller
    {
        #region【商城订单】

        /// <summary>
        /// 订单信息
        /// </summary>
        /// <returns></returns>
        public string OrderMsg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("TradingPage/OrderMsg^TradingPage/OrderDetail");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索分页数据 Type=2 批量锁定/解锁订单信息 Type=3 确认买家的转账汇款(平台操作) Type=4 确认收货
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
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


                //----获取当前页----//
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("OrderID", OrderID);
                _dic.Add("BillNumber", BillNumber);
                _dic.Add("GoodsIDArr", GoodsIDArr);
                _dic.Add("ShopUserID", ShopUserID);
                _dic.Add("BuyerUserID", BuyerUserID);
                _dic.Add("GiftIDArr", GiftIDArr);
                _dic.Add("OrderStatus", OrderStatus);
                _dic.Add("PayWay", PayWay);
                _dic.Add("IsPaySuccess", IsPaySuccess);
                _dic.Add("ExpressType", ExpressType);
                _dic.Add("IssueIDArr", IssueIDArr);
                _dic.Add("GroupID", GroupID);
                _dic.Add("SkGoodsID", SkGoodsID);
                _dic.Add("IsSettle", IsSettle);
                _dic.Add("IsRefund", IsRefund);
                _dic.Add("IsPayService", IsPayService);
                _dic.Add("IsLock", IsLock);
                _dic.Add("PayTime", PayTime);
                _dic.Add("FinishTime", FinishTime);
                _dic.Add("OrderTime", OrderTime);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "24", _dic);

                return _json;
            }
            else if (_exeType == "2") //批量锁定/解锁订单信息
            {
                //获取传递的参数
                string OrderIDArr = PublicClass.FilterRequestTrim("OrderIDArr");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("OrderIDArr", OrderIDArr);
                _dic.Add("IsLock", IsLock);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "25", _dic);
                return _json;
            }
            else if (_exeType == "3") //确认买家的转账汇款(平台操作)
            {
                // 获取传递的参数
                string OrderIDArr = PublicClass.FilterRequestTrim("OrderIDArr");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("OrderIDArr", OrderIDArr);
                _dic.Add("ShopUserID", ShopUserID);
                _dic.Add("BillNumber", BillNumber);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "10", _dic);
                return _json;
            }
            else if (_exeType == "4") //确认收货
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("OrderID", OrderID);
                _dic.Add("BuyerUserID", BuyerUserID);
                _dic.Add("ShopUserID", ShopUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "15", _dic);
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
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("TradingPage/OrderMsg^TradingPage/OrderDetail");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 初始化订单详情 Type=2 (后台CMS)在线支付退款处理 --带订单逻辑处理 - WeiXinPay [微信支付], Alipay[支付宝] , Balance[余额支付]  Type=3 已退款给买家商城数据逻辑处理 
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("OrderID", OrderID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "4", _dic);
                return _json;
            }
            else if (_exeType == "2") //(后台CMS)在线支付退款处理 --带订单逻辑处理 - WeiXinPay [微信支付], Alipay[支付宝] , Balance[余额支付] 
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string PayWay = PublicClass.FilterRequestTrim("PayWay");
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");
                string RefundAmount = PublicClass.FilterRequestTrim("RefundAmount");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("OrderID", OrderID);
                _dic.Add("PayWay", PayWay);
                _dic.Add("BillNumber", BillNumber);
                _dic.Add("RefundAmount", RefundAmount);
                _dic.Add("BuyerUserID", BuyerUserID);
                _dic.Add("ShopUserID", ShopUserID);
                _dic.Add("IsCmsRefund", "true");

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "27", _dic);
                return _json;
            }
            else if (_exeType == "3") //已退款给买家商城数据逻辑处理
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("OrderID", OrderID);
                _dic.Add("BuyerUserID", BuyerUserID);
                _dic.Add("ShopUserID", ShopUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "28", _dic);
                return _json;
            }

            return "";
        }

        #endregion

        #region【商家结算】

        /// <summary>
        /// 商家结算资料
        /// </summary>
        /// <returns></returns>
        public string SettleShopMsg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("TradingPage/SettleShopMsg^TradingPage/SettleApply^TradingPage/SettleDispose^TradingPage/SettleDetail^TradingPage/SettleOrderMsg^TradingPage/OrderCommission^TradingPage/SettleAggregateOrderMsg");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索分页数据 Type=2 初始化商家结算资料 Type=3 审核商家结算资料
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string CompanyName = PublicClass.FilterRequestTrim("CompanyName");
                string CompanyTel = PublicClass.FilterRequestTrim("CompanyTel");
                string CertificateID = PublicClass.FilterRequestTrim("CertificateID");
                string LegalPerson = PublicClass.FilterRequestTrim("LegalPerson");
                string LinkMan = PublicClass.FilterRequestTrim("LinkMan");
                string MobileNumber = PublicClass.FilterRequestTrim("MobileNumber");
                string BankAccount = PublicClass.FilterRequestTrim("BankAccount");
                string IsCheck = PublicClass.FilterRequestTrim("IsCheck");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //----获取当前页----//
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("ShopUserID", ShopUserID);
                _dic.Add("CompanyName", CompanyName);
                _dic.Add("CompanyTel", CompanyTel);
                _dic.Add("CertificateID", CertificateID);
                _dic.Add("LegalPerson", LegalPerson);
                _dic.Add("LinkMan", LinkMan);
                _dic.Add("MobileNumber", MobileNumber);
                _dic.Add("BankAccount", BankAccount);
                _dic.Add("IsCheck", IsCheck);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_SettleShopMsg, "T_SettleShopMsg", "3", _dic);

                return _json;
            }
            else if (_exeType == "2") //初始化商家结算资料
            {
                //获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                //资料是否审核 ( false 待审核 true 不通过 pass 通过 )
                string IsCheck = PublicClass.FilterRequestTrim("IsCheck");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", ShopUserID);
                _dic.Add("IsCheck", IsCheck);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_SettleShopMsg, "T_SettleShopMsg", "2", _dic);
                return _json;
            }
            else if (_exeType == "3") //审核商家结算资料
            {
                // 获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsCheck = PublicClass.FilterRequestTrim("IsCheck");
                string CheckReason = PublicClass.FilterRequestTrim("CheckReason");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", ShopUserID);
                _dic.Add("IsCheck", IsCheck);
                _dic.Add("CheckReason", CheckReason);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_SettleShopMsg, "T_SettleShopMsg", "4", _dic);
                return _json;
            }

            return "";
        }

        /// <summary>
        /// 商家结算申请
        /// </summary>
        /// <returns></returns>
        public string SettleApply()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("TradingPage/SettleShopMsg^TradingPage/SettleApply^TradingPage/SettleDispose^TradingPage/SettleDetail^TradingPage/SettleOrderMsg^TradingPage/OrderCommission^TradingPage/SettleAggregateOrderMsg");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索分页数据
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string SettleID = PublicClass.FilterRequestTrim("SettleID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string RealTransSum = PublicClass.FilterRequestTrim("RealTransSum");
                string ApplyName = PublicClass.FilterRequestTrim("ApplyName");
                string ApplyTel = PublicClass.FilterRequestTrim("ApplyTel");
                string SettleStatus = PublicClass.FilterRequestTrim("SettleStatus");
                string DisposeMan = PublicClass.FilterRequestTrim("DisposeMan");
                string SettleMemo = PublicClass.FilterRequestTrim("SettleMemo");
                string DisposeDate = PublicClass.FilterRequestTrim("DisposeDate");
                string ApplyDate = PublicClass.FilterRequestTrim("ApplyDate");

                //----获取当前页----//
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("ShopUserID", ShopUserID);
                _dic.Add("RealTransSum", RealTransSum);
                _dic.Add("ApplyName", ApplyName);
                _dic.Add("ApplyTel", ApplyTel);
                _dic.Add("SettleStatus", SettleStatus);
                _dic.Add("DisposeMan", DisposeMan);
                _dic.Add("SettleMemo", SettleMemo);
                _dic.Add("DisposeDate", DisposeDate);
                _dic.Add("ApplyDate", ApplyDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_SettleApply, "T_SettleApply", "1", _dic);

                return _json;
            }


            return "";
        }

        /// <summary>
        /// 结算申请处理
        /// </summary>
        /// <returns></returns>
        public string SettleDispose()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("TradingPage/SettleShopMsg^TradingPage/SettleApply^TradingPage/SettleDispose^TradingPage/SettleDetail^TradingPage/SettleOrderMsg^TradingPage/OrderCommission^TradingPage/SettleAggregateOrderMsg");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 商城结算订单-搜索分页数据 Type=2 聚合支付结算订单信息-搜索分页数据 Type=3 初始化商家结算申请信息 Type=4 提交结算处理完成
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string SettleID = PublicClass.FilterRequestTrim("SettleID");

                //---当前页----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("SettleID", SettleID);
                _dic.Add("PageCurrent", PageCurrent);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_SettleOrderMsg, "T_SettleOrderMsg", "1", _dic);
                return _json;
            }
            else if (_exeType == "2") //聚合支付结算订单信息-搜索分页数据
            {
                // 获取传递的参数
                string SettleID = PublicClass.FilterRequestTrim("SettleID");

                //---当前页----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("SettleID", SettleID);
                _dic.Add("PageCurrent", PageCurrent);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_SettleAggregateOrderMsg, "T_SettleAggregateOrderMsg", "1", _dic);
                return _json;
            }
            else if (_exeType == "3") //初始化商家结算申请信息
            {
                //获取传递的参数
                string SettleID = PublicClass.FilterRequestTrim("SettleID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("SettleID", SettleID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_SettleApply, "T_SettleApply", "6", _dic);
                return _json;
            }
            else if (_exeType == "4") //提交结算处理完成
            {
                // 获取传递的参数
                string SettleID = PublicClass.FilterRequestTrim("SettleID");
                //string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string DisposeMan = PublicClass.FilterRequestTrim("DisposeMan");
                string RealTransSum = PublicClass.FilterRequestTrim("RealTransSum");
                string TransferVoucherImg = PublicClass.FilterRequestTrimNoConvert("TransferVoucherImg");
                string SettleMemo = PublicClass.FilterRequestTrim("SettleMemo");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("SettleID", SettleID);
                //_dic.Add("ShopUserID", ShopUserID);
                _dic.Add("DisposeMan", DisposeMan);
                _dic.Add("RealTransSum", RealTransSum);
                _dic.Add("TransferVoucherImg", TransferVoucherImg);
                _dic.Add("SettleMemo", SettleMemo);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_SettleApply, "T_SettleApply", "7", _dic);
                return _json;
            }


            return "";
        }

        /// <summary>
        /// 商城结算订单
        /// </summary>
        /// <returns></returns>
        public string SettleOrderMsg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("TradingPage/SettleShopMsg^TradingPage/SettleApply^TradingPage/SettleDispose^TradingPage/SettleDetail^TradingPage/SettleOrderMsg^TradingPage/OrderCommission^TradingPage/SettleAggregateOrderMsg");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 商城结算订单-搜索分页数据
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string SettleID = PublicClass.FilterRequestTrim("SettleID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");
                string OrderStatus = PublicClass.FilterRequestTrim("OrderStatus");
                string PayWay = PublicClass.FilterRequestTrim("PayWay");
                string PayTime = PublicClass.FilterRequestTrim("PayTime");
                string FinishTime = PublicClass.FilterRequestTrim("FinishTime");

                //---当前页----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", PageCurrent);
                _dic.Add("SettleID", SettleID);
                _dic.Add("ShopUserID", ShopUserID);
                _dic.Add("OrderID", OrderID);
                _dic.Add("BillNumber", BillNumber);
                _dic.Add("OrderStatus", OrderStatus);
                _dic.Add("PayWay", PayWay);
                _dic.Add("PayTime", PayTime);
                _dic.Add("FinishTime", FinishTime);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_SettleOrderMsg, "T_SettleOrderMsg", "1", _dic);
                return _json;
            }


            return "";
        }

        /// <summary>
        /// 商城-订单抽成与分红分润信息 
        /// </summary>
        /// <returns></returns>
        public string OrderCommission()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("TradingPage/SettleShopMsg^TradingPage/SettleApply^TradingPage/SettleDispose^TradingPage/SettleDetail^TradingPage/SettleOrderMsg^TradingPage/OrderCommission^TradingPage/SettleAggregateOrderMsg");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索分页数据
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string OrderCommissionID = PublicClass.FilterRequestTrim("OrderCommissionID");
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string OrderPrice = PublicClass.FilterRequestTrim("OrderPrice");
                string CommissionPersent = PublicClass.FilterRequestTrim("CommissionPersent");
                string CommissionMoney = PublicClass.FilterRequestTrim("CommissionMoney");
                string IsDividend = PublicClass.FilterRequestTrim("IsDividend");
                string DividendPersent = PublicClass.FilterRequestTrim("DividendPersent");
                string DividendSumMoney = PublicClass.FilterRequestTrim("DividendSumMoney");
                string IsPromemDividend = PublicClass.FilterRequestTrim("IsPromemDividend");
                string PromemDividendPersent = PublicClass.FilterRequestTrim("PromemDividendPersent");
                string PromemDividendMoney = PublicClass.FilterRequestTrim("PromemDividendMoney");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                string IsShareGoodsMoney = PublicClass.FilterRequestTrim("IsShareGoodsMoney");
                string ShareGoodsPersent = PublicClass.FilterRequestTrim("ShareGoodsPersent");
                string ShareGoodsMoney = PublicClass.FilterRequestTrim("ShareGoodsMoney");

                string IsExpandShopMoney = PublicClass.FilterRequestTrim("IsExpandShopMoney");
                string ExpandShopPersent = PublicClass.FilterRequestTrim("ExpandShopPersent");
                string ExpandShopMoney = PublicClass.FilterRequestTrim("ExpandShopMoney");


                //---当前页----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", PageCurrent);
                _dic.Add("OrderCommissionID", OrderCommissionID);
                _dic.Add("OrderID", OrderID);
                _dic.Add("OrderPrice", OrderPrice);
                _dic.Add("CommissionPersent", CommissionPersent);
                _dic.Add("CommissionMoney", CommissionMoney);
                _dic.Add("IsDividend", IsDividend);
                _dic.Add("DividendPersent", DividendPersent);
                _dic.Add("DividendSumMoney", DividendSumMoney);
                _dic.Add("IsPromemDividend", IsPromemDividend);
                _dic.Add("PromemDividendPersent", PromemDividendPersent);
                _dic.Add("PromemDividendMoney", PromemDividendMoney);
                _dic.Add("WriteDate", WriteDate);

                _dic.Add("IsShareGoodsMoney", IsShareGoodsMoney);
                _dic.Add("ShareGoodsPersent", ShareGoodsPersent);
                _dic.Add("ShareGoodsMoney", ShareGoodsMoney);

                _dic.Add("IsExpandShopMoney", IsExpandShopMoney);
                _dic.Add("ExpandShopPersent", ExpandShopPersent);
                _dic.Add("ExpandShopMoney", ExpandShopMoney);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderCommission, "T_OrderCommission", "1", _dic);
                return _json;
            }

            return "";
        }

        /// <summary>
        /// 商城结算订单
        /// </summary>
        /// <returns></returns>
        public string SettleAggregateOrderMsg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("TradingPage/SettleShopMsg^TradingPage/SettleApply^TradingPage/SettleDispose^TradingPage/SettleDetail^TradingPage/SettleOrderMsg^TradingPage/OrderCommission^TradingPage/SettleAggregateOrderMsg");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }

            //获取操作类型  Type=1 聚合支付结算订单信息-搜索分页数据
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string SettleID = PublicClass.FilterRequestTrim("SettleID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string AggregateOrderID = PublicClass.FilterRequestTrim("AggregateOrderID");
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");
                string OrderStatus = PublicClass.FilterRequestTrim("OrderStatus");
                string PayWay = PublicClass.FilterRequestTrim("PayWay");
                string PayTime = PublicClass.FilterRequestTrim("PayTime");


                //---当前页----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", PageCurrent);
                _dic.Add("SettleID", SettleID);
                _dic.Add("ShopUserID", ShopUserID);
                _dic.Add("AggregateOrderID", AggregateOrderID);
                _dic.Add("BillNumber", BillNumber);
                _dic.Add("OrderStatus", OrderStatus);
                _dic.Add("PayWay", PayWay);
                _dic.Add("PayTime", PayTime);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_SettleAggregateOrderMsg, "T_SettleAggregateOrderMsg", "1", _dic);
                return _json;
            }


            return "";
        }

        #endregion

        #region【聚合支付】

        /// <summary>
        /// 扫码支付订单
        /// </summary>
        /// <returns></returns>
        public string AggregateOrderMsg()
        {

            return "";
        }

        /// <summary>
        /// 聚合支付-订单抽成与分红分润信息 
        /// </summary>
        /// <returns></returns>
        public string AggregateOrderCommission()
        {

            return "";
        }


        #endregion

        #region【买家余额提现】

        /// <summary>
        /// 买家余额提现
        /// </summary>
        /// <returns></returns>
        public string BuyerWithDraw()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("TradingPage/BuyerWithDraw^TradingPage/BuyerWithDrawDispose");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }

            //获取操作类型  Type=1 搜索数据分页  Type=2 初始化买家提现详细CMS版 Type=3 完成买家提现处理 Type=4 微信企业付款到个人，完成买家提现处理  Type=5 转账到支付宝账户，完成买家提现处理
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string WithDrawID = PublicClass.FilterRequestTrim("WithDrawID");
                string SerialNumber = PublicClass.FilterRequestTrim("SerialNumber");
                string ToType = PublicClass.FilterRequestTrim("ToType");
                string WithDrawAmt = PublicClass.FilterRequestTrim("WithDrawAmt");
                string WithDrawStatus = PublicClass.FilterRequestTrim("WithDrawStatus");
                string TrueName = PublicClass.FilterRequestTrim("TrueName");
                string LinkMobile = PublicClass.FilterRequestTrim("LinkMobile");
                string WeChatAccount = PublicClass.FilterRequestTrim("WeChatAccount");
                string AlipayAccount = PublicClass.FilterRequestTrim("AlipayAccount");
                string BankCardNumber = PublicClass.FilterRequestTrim("BankCardNumber");
                string BankAccName = PublicClass.FilterRequestTrim("BankAccName");
                string OpeningBank = PublicClass.FilterRequestTrim("OpeningBank");
                string WithDrawMemo = PublicClass.FilterRequestTrim("WithDrawMemo");
                string WxOpenID = PublicClass.FilterRequestTrim("WxOpenID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string FinishDate = PublicClass.FilterRequestTrim("FinishDate");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("WithDrawID", WithDrawID);
                _dic.Add("SerialNumber", SerialNumber);
                _dic.Add("ToType", ToType);
                _dic.Add("WithDrawAmt", WithDrawAmt);
                _dic.Add("WithDrawStatus", WithDrawStatus);
                _dic.Add("TrueName", TrueName);
                _dic.Add("LinkMobile", LinkMobile);
                _dic.Add("WeChatAccount", WeChatAccount);
                _dic.Add("AlipayAccount", AlipayAccount);
                _dic.Add("BankCardNumber", BankCardNumber);
                _dic.Add("BankAccName", BankAccName);
                _dic.Add("OpeningBank", OpeningBank);
                _dic.Add("WithDrawMemo", WithDrawMemo);
                _dic.Add("WxOpenID", WxOpenID);
                _dic.Add("BuyerUserID", BuyerUserID);
                _dic.Add("FinishDate", FinishDate);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_BuyerWithDraw, "T_BuyerWithDraw", "1", _dic);
                return _json;
            }
            else if (_exeType == "2") //初始化买家提现详细CMS版
            {
                // 获取传递的参数
                string WithDrawID = PublicClass.FilterRequestTrim("WithDrawID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("WithDrawID", WithDrawID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_BuyerWithDraw, "T_BuyerWithDraw", "5", _dic);
                return _json;
            }
            else if (_exeType == "3") //完成买家提现处理
            {
                // 获取传递的参数
                string WithDrawID = PublicClass.FilterRequestTrim("WithDrawID");
                string WithDrawMemo = PublicClass.FilterRequestTrim("WithDrawMemo");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("WithDrawID", WithDrawID);
                _dic.Add("BuyerUserID", BuyerUserID);
                _dic.Add("WithDrawMemo", WithDrawMemo);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_BuyerWithDraw, "T_BuyerWithDraw", "7", _dic);
                return _json;
            }
            else if (_exeType == "4") //微信企业付款到个人，完成买家提现处理 
            {
                // 获取传递的参数
                string WithDrawID = PublicClass.FilterRequestTrim("WithDrawID");
                string WithDrawMemo = PublicClass.FilterRequestTrim("WithDrawMemo");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("WithDrawID", WithDrawID);
                _dic.Add("BuyerUserID", BuyerUserID);
                _dic.Add("WithDrawMemo", WithDrawMemo);

                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_BuyerWithDraw, "T_BuyerWithDraw", "8", _dic);
                return _jsonBack;
            }
            else if (_exeType == "5") //转账到支付宝账户，完成买家提现处理
            {
                // 获取传递的参数
                string WithDrawID = PublicClass.FilterRequestTrim("WithDrawID");
                string WithDrawMemo = PublicClass.FilterRequestTrim("WithDrawMemo");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("WithDrawID", WithDrawID);
                _dic.Add("BuyerUserID", BuyerUserID);
                _dic.Add("WithDrawMemo", WithDrawMemo);

                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_BuyerWithDraw, "T_BuyerWithDraw", "9", _dic);
                return _jsonBack;
            }

            return "";
        }

        #endregion

        #region【买家 -- 收支，积分】

        /// <summary>
        /// 买家余额充值
        /// </summary>
        /// <returns></returns>
        public string BuyerRecharge()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("TradingPage/BuyerRecharge");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索分页数据 Type=2 删除一天之后,没有充值成功的信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string RechargeID = PublicClass.FilterRequestTrim("RechargeID");
                string SerialNumber = PublicClass.FilterRequestTrim("SerialNumber");
                string RechargeAmt = PublicClass.FilterRequestTrim("RechargeAmt");
                string FromType = PublicClass.FilterRequestTrim("FromType");
                string RechargeStatus = PublicClass.FilterRequestTrim("RechargeStatus");
                string RechargeMemo = PublicClass.FilterRequestTrim("RechargeMemo");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //---当前页----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", PageCurrent);
                _dic.Add("RechargeID", RechargeID);
                _dic.Add("SerialNumber", SerialNumber);
                _dic.Add("RechargeAmt", RechargeAmt);
                _dic.Add("FromType", FromType);
                _dic.Add("RechargeStatus", RechargeStatus);
                _dic.Add("RechargeMemo", RechargeMemo);
                _dic.Add("BuyerUserID", BuyerUserID);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_BuyerRecharge, "T_BuyerRecharge", "1", _dic);
                return _json;
            }
            else if (_exeType == "2") //删除一天之后,没有充值成功的信息
            {
                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", "");

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_BuyerRecharge, "T_BuyerRecharge", "3", _dic);
                return _json;
            }


            return "";
        }


        /// <summary>
        /// 会员(买家)账户余额管理
        /// </summary>
        /// <returns></returns>
        public string BuyerInExMan()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("TradingPage/BuyerInExMan");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }

            //------只有超级管理员(AdUserType=Admin)才能进入的页-------// 
            string _loginUserAdUserType = BusiLogin.getLoginUserAdUserType();
            if (_loginUserAdUserType != "Admin")
            {
                return "无权限访问";
            }

            //获取操作类型  Type=1 平台管理增减买家用户的余额收支
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string BindMobile = PublicClass.FilterRequestTrim("BindMobile");
                string AddReduceSum = PublicClass.FilterRequestTrim("AddReduceSum");
                string InExType = PublicClass.FilterRequestTrim("InExType");
                string InExMemo = PublicClass.FilterRequestTrim("InExMemo");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("BindMobile", BindMobile);
                _dic.Add("AddReduceSum", AddReduceSum);
                _dic.Add("InExType", InExType);
                _dic.Add("InExMemo", InExMemo);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_BuyerIncomeExpense, "T_BuyerIncomeExpense", "6", _dic);
                return _json;

            }

            return "";
        }


        /// <summary>
        /// 买家账户余额收支信息
        /// </summary>
        /// <returns></returns>
        public string BuyerIncomeExpense()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("TradingPage/BuyerIncomeExpense");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索分页数据
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string InExMsgID = PublicClass.FilterRequestTrim("InExMsgID");
                string IncomeSum = PublicClass.FilterRequestTrim("IncomeSum");
                string ExpenseSum = PublicClass.FilterRequestTrim("ExpenseSum");
                string CurrentBalance = PublicClass.FilterRequestTrim("CurrentBalance");
                string InExType = PublicClass.FilterRequestTrim("InExType");
                string InExMemo = PublicClass.FilterRequestTrim("InExMemo");
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");


                //---当前页----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", PageCurrent);
                _dic.Add("InExMsgID", InExMsgID);
                _dic.Add("IncomeSum", IncomeSum);
                _dic.Add("ExpenseSum", ExpenseSum);
                _dic.Add("CurrentBalance", CurrentBalance);
                _dic.Add("InExType", InExType);
                _dic.Add("InExMemo", InExMemo);
                _dic.Add("ExtraData", ExtraData);
                _dic.Add("BuyerUserID", BuyerUserID);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_BuyerIncomeExpense, "T_BuyerIncomeExpense", "1", _dic);
                return _json;
            }

            return "";
        }

        /// <summary>
        /// 买家分润余额收支信息
        /// </summary>
        /// <returns></returns>
        public string BuyerIncomeExpenseDividend()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("TradingPage/BuyerIncomeExpenseDividend");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索分页数据 
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string InExMsgID = PublicClass.FilterRequestTrim("InExMsgID");
                string IncomeSum = PublicClass.FilterRequestTrim("IncomeSum");
                string ExpenseSum = PublicClass.FilterRequestTrim("ExpenseSum");
                string CurrentBalance = PublicClass.FilterRequestTrim("CurrentBalance");
                string InExType = PublicClass.FilterRequestTrim("InExType");
                string InExMemo = PublicClass.FilterRequestTrim("InExMemo");
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");


                //---当前页----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", PageCurrent);
                _dic.Add("InExMsgID", InExMsgID);
                _dic.Add("IncomeSum", IncomeSum);
                _dic.Add("ExpenseSum", ExpenseSum);
                _dic.Add("CurrentBalance", CurrentBalance);
                _dic.Add("InExType", InExType);
                _dic.Add("InExMemo", InExMemo);
                _dic.Add("ExtraData", ExtraData);
                _dic.Add("BuyerUserID", BuyerUserID);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_BuyerIncomeExpenseDividend, "T_BuyerIncomeExpenseDividend", "1", _dic);
                return _json;
            }


            return "";
        }

        /// <summary>
        /// 买家账户积分收支信息
        /// </summary>
        /// <returns></returns>
        public string BuyerIntegral()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("TradingPage/BuyerIntegral");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索分页数据 
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string IntegralID = PublicClass.FilterRequestTrim("IntegralID");
                string IncomeSum = PublicClass.FilterRequestTrim("IncomeSum");
                string ExpenseSum = PublicClass.FilterRequestTrim("ExpenseSum");
                string CurrentBalance = PublicClass.FilterRequestTrim("CurrentBalance");
                string InExType = PublicClass.FilterRequestTrim("InExType");
                string InExMemo = PublicClass.FilterRequestTrim("InExMemo");
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");


                //---当前页----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", PageCurrent);
                _dic.Add("IntegralID", IntegralID);
                _dic.Add("IncomeSum", IncomeSum);
                _dic.Add("ExpenseSum", ExpenseSum);
                _dic.Add("CurrentBalance", CurrentBalance);
                _dic.Add("InExType", InExType);
                _dic.Add("InExMemo", InExMemo);
                _dic.Add("ExtraData", ExtraData);
                _dic.Add("BuyerUserID", BuyerUserID);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_BuyerIntegral, "T_BuyerIntegral", "1", _dic);
                return _json;
            }

            return "";
        }

        /// <summary>
        /// 买家分润积分收支信息
        /// </summary>
        /// <returns></returns>
        public string BuyerIntegralDividend()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("TradingPage/BuyerIntegralDividend");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索分页数据 
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string IntegralID = PublicClass.FilterRequestTrim("IntegralID");
                string IncomeSum = PublicClass.FilterRequestTrim("IncomeSum");
                string ExpenseSum = PublicClass.FilterRequestTrim("ExpenseSum");
                string CurrentBalance = PublicClass.FilterRequestTrim("CurrentBalance");
                string InExType = PublicClass.FilterRequestTrim("InExType");
                string InExMemo = PublicClass.FilterRequestTrim("InExMemo");
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");


                //---当前页----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", PageCurrent);
                _dic.Add("IntegralID", IntegralID);
                _dic.Add("IncomeSum", IncomeSum);
                _dic.Add("ExpenseSum", ExpenseSum);
                _dic.Add("CurrentBalance", CurrentBalance);
                _dic.Add("InExType", InExType);
                _dic.Add("InExMemo", InExMemo);
                _dic.Add("ExtraData", ExtraData);
                _dic.Add("BuyerUserID", BuyerUserID);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_BuyerIntegralDividend, "T_BuyerIntegralDividend", "1", _dic);
                return _json;
            }

            return "";
        }


        #endregion

        #region【商家 -- 收支，积分】

        /// <summary>
        /// 商家积分充值
        /// </summary>
        /// <returns></returns>
        public string ShopIntegralRecharge()
        {

            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("TradingPage/ShopIntegralRecharge");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string RechargeID = PublicClass.FilterRequestTrim("RechargeID");
                string BillNumberRhg = PublicClass.FilterRequestTrim("BillNumberRhg");
                string RechargePrice = PublicClass.FilterRequestTrim("RechargePrice");
                string RechargeMemo = PublicClass.FilterRequestTrim("RechargeMemo");
                string IsPaySuccess = PublicClass.FilterRequestTrim("IsPaySuccess");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string PayDate = PublicClass.FilterRequestTrim("PayDate");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");


                //---当前页----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", PageCurrent);
                _dic.Add("RechargeID", RechargeID);
                _dic.Add("BillNumberRhg", BillNumberRhg);
                _dic.Add("RechargePrice", RechargePrice);
                _dic.Add("RechargeMemo", RechargeMemo);
                _dic.Add("IsPaySuccess", IsPaySuccess);
                _dic.Add("PayDate", PayDate);
                _dic.Add("ShopUserID", ShopUserID);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_ShopIntegralRecharge, "T_ShopIntegralRecharge", "1", _dic);
                return _json;
            }

            return "";
        }


        /// <summary>
        /// 商家余额收支信息
        /// </summary>
        /// <returns></returns>
        public string ShopIncomeExpense()
        {

            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("TradingPage/ShopIncomeExpense");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索分页数据 
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string InExMsgID = PublicClass.FilterRequestTrim("InExMsgID");
                string IncomeSum = PublicClass.FilterRequestTrim("IncomeSum");
                string ExpenseSum = PublicClass.FilterRequestTrim("ExpenseSum");
                string CurrentBalance = PublicClass.FilterRequestTrim("CurrentBalance");
                string InExType = PublicClass.FilterRequestTrim("InExType");
                string InExMemo = PublicClass.FilterRequestTrim("InExMemo");
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");


                //---当前页----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", PageCurrent);
                _dic.Add("InExMsgID", InExMsgID);
                _dic.Add("IncomeSum", IncomeSum);
                _dic.Add("ExpenseSum", ExpenseSum);
                _dic.Add("CurrentBalance", CurrentBalance);
                _dic.Add("InExType", InExType);
                _dic.Add("InExMemo", InExMemo);
                _dic.Add("ExtraData", ExtraData);
                _dic.Add("ShopUserID", ShopUserID);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_ShopIncomeExpense, "T_ShopIncomeExpense", "1", _dic);
                return _json;
            }



            return "";
        }

        /// <summary>
        /// 商家积分收支信息
        /// </summary>
        /// <returns></returns>
        public string ShopIntegral()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("TradingPage/ShopIntegral");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索分页数据 
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string IntegralID = PublicClass.FilterRequestTrim("IntegralID");
                string IncomeSum = PublicClass.FilterRequestTrim("IncomeSum");
                string ExpenseSum = PublicClass.FilterRequestTrim("ExpenseSum");
                string CurrentBalance = PublicClass.FilterRequestTrim("CurrentBalance");
                string InExType = PublicClass.FilterRequestTrim("InExType");
                string InExMemo = PublicClass.FilterRequestTrim("InExMemo");
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");


                //---当前页----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", PageCurrent);
                _dic.Add("IntegralID", IntegralID);
                _dic.Add("IncomeSum", IncomeSum);
                _dic.Add("ExpenseSum", ExpenseSum);
                _dic.Add("CurrentBalance", CurrentBalance);
                _dic.Add("InExType", InExType);
                _dic.Add("InExMemo", InExMemo);
                _dic.Add("ExtraData", ExtraData);
                _dic.Add("ShopUserID", ShopUserID);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_ShopIntegral, "T_ShopIntegral", "1", _dic);
                return _json;
            }

            return "";
        }

        #endregion

        #region【支付系统】

        /// <summary>
        /// 转账汇款银行信息
        /// </summary>
        /// <returns></returns>
        public string PayTransBankMsg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("TradingPage/PayTransBankMsg");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索分页数据 Type=2 添加/编辑信息 Type=3 锁定/解锁信息 Type=4 批量删除信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string TransBankID = PublicClass.FilterRequestTrim("TransBankID");
                string TransType = PublicClass.FilterRequestTrim("TransType");
                string BankName = PublicClass.FilterRequestTrim("BankName");
                string BankAccName = PublicClass.FilterRequestTrim("BankAccName");
                string OpenAccBank = PublicClass.FilterRequestTrim("OpenAccBank");
                string BankAccount = PublicClass.FilterRequestTrim("BankAccount");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");


                //---当前页----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", PageCurrent);
                _dic.Add("TransBankID", TransBankID);
                _dic.Add("TransType", TransType);
                _dic.Add("BankName", BankName);
                _dic.Add("BankAccName", BankAccName);
                _dic.Add("OpenAccBank", OpenAccBank);
                _dic.Add("BankAccount", BankAccount);
                _dic.Add("ShopUserID", ShopUserID);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_PayTransBankMsg, "T_PayTransBankMsg", "1", _dic);
                return _json;
            }
            else if (_exeType == "2") //添加/编辑信息
            {
                // 获取传递的参数
                string TransBankID = PublicClass.FilterRequestTrim("TransBankID");
                string TransType = PublicClass.FilterRequestTrim("TransType");
                string BankName = PublicClass.FilterRequestTrim("BankName");
                string BankAccName = PublicClass.FilterRequestTrim("BankAccName");
                string OpenAccBank = PublicClass.FilterRequestTrim("OpenAccBank");
                string BankAccount = PublicClass.FilterRequestTrim("BankAccount");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("TransBankID", TransBankID);
                _dic.Add("TransType", TransType);
                _dic.Add("BankName", BankName);
                _dic.Add("BankAccName", BankAccName);
                _dic.Add("OpenAccBank", OpenAccBank);
                _dic.Add("BankAccount", BankAccount);
                _dic.Add("ShopUserID", ShopUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_PayTransBankMsg, "T_PayTransBankMsg", "2", _dic);
                return _json;
            }
            else if (_exeType == "3") //锁定/解锁信息{
            {
                // 获取传递的参数
                string TransBankID = PublicClass.FilterRequestTrim("TransBankID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("TransBankID", TransBankID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_PayTransBankMsg, "T_PayTransBankMsg", "3", _dic);
                return _json;
            }
            else if (_exeType == "4") //批量删除信息
            {
                // 获取传递的参数
                string TransBankIDArr = PublicClass.FilterRequestTrim("TransBankIDArr");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("TransBankIDArr", TransBankIDArr);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_PayTransBankMsg, "T_PayTransBankMsg", "4", _dic);
                return _json;
            }

            return "";
        }

        /// <summary>
        /// 转账记录信息
        /// </summary>
        /// <returns></returns>
        public string PayTransRecord()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("TradingPage/PayTransRecord");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索分页数据 Type=2 批量删除买家转账汇款记录
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string TransRecordID = PublicClass.FilterRequestTrim("TransRecordID");
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");
                string BankName = PublicClass.FilterRequestTrim("BankName");
                string BuyerBankName = PublicClass.FilterRequestTrim("BuyerBankName");
                string BuyerBankAcc = PublicClass.FilterRequestTrim("BuyerBankAcc");
                string TransMoney = PublicClass.FilterRequestTrim("TransMoney");
                string TransMemo = PublicClass.FilterRequestTrim("TransMemo");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");


                //---当前页----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", PageCurrent);
                _dic.Add("TransRecordID", TransRecordID);
                _dic.Add("OrderID", OrderID);
                _dic.Add("BillNumber", BillNumber);
                _dic.Add("BankName", BankName);
                _dic.Add("BuyerBankName", BuyerBankName);
                _dic.Add("BuyerBankAcc", BuyerBankAcc);
                _dic.Add("TransMoney", TransMoney);
                _dic.Add("TransMemo", TransMemo);
                _dic.Add("BuyerUserID", BuyerUserID);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_PayTransRecord, "T_PayTransRecord", "1", _dic);
                return _json;
            }
            else if (_exeType == "2") //批量删除买家转账汇款记录
            {
                //获取传递的参数
                string TransRecordIDArr = PublicClass.FilterRequestTrim("TransRecordIDArr");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("TransRecordIDArr", TransRecordIDArr);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_PayTransRecord, "T_PayTransRecord", "2", _dic);
                return _json;
            }

            return "";
        }


        #endregion

        #region【优惠券】

        /// <summary>
        /// 优惠券信息
        /// </summary>
        /// <returns></returns>
        public string CouponsMsg()
        {

            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("TradingPage/CouponsMsg^TradingPage/CouponsDetail^TradingPage/CouponsIssueMsg");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }



            //获取操作类型  Type=1 搜索分页数据 Type=2 锁定解锁优惠券信息 Type=3 初始化优惠券详情(CMS版)
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");
                string CouponsTitle = PublicClass.FilterRequestTrim("CouponsTitle");
                string CouponsDesc = PublicClass.FilterRequestTrim("CouponsDesc");
                string UseMoney = PublicClass.FilterRequestTrim("UseMoney");
                string UseDiscount = PublicClass.FilterRequestTrim("UseDiscount");
                string NumTotal = PublicClass.FilterRequestTrim("NumTotal");
                string UseShopIDArr = PublicClass.FilterRequestTrim("UseShopIDArr");
                string UseGoodsIDArr = PublicClass.FilterRequestTrim("UseGoodsIDArr");
                string UseTimeRange = PublicClass.FilterRequestTrimNoConvert("UseTimeRange");
                string ExpenseReachSum = PublicClass.FilterRequestTrim("ExpenseReachSum");
                string IssueType = PublicClass.FilterRequestTrim("IssueType");
                string IssuePause = PublicClass.FilterRequestTrim("IssuePause");
                string IssueExpenseSum = PublicClass.FilterRequestTrim("IssueExpenseSum");
                string IsMallCoupons = PublicClass.FilterRequestTrim("IsMallCoupons");
                string IsRepeatGet = PublicClass.FilterRequestTrim("IsRepeatGet");
                string IsOfflineUse = PublicClass.FilterRequestTrim("IsOfflineUse");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");


                //---当前页----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", PageCurrent);
                _dic.Add("CouponsID", CouponsID);
                _dic.Add("CouponsTitle", CouponsTitle);
                _dic.Add("CouponsDesc", CouponsDesc);
                _dic.Add("UseMoney", UseMoney);
                _dic.Add("UseDiscount", UseDiscount);
                _dic.Add("NumTotal", NumTotal);
                _dic.Add("UseShopIDArr", UseShopIDArr);
                _dic.Add("UseGoodsIDArr", UseGoodsIDArr);
                _dic.Add("UseTimeRange", UseTimeRange);
                _dic.Add("ExpenseReachSum", ExpenseReachSum);
                _dic.Add("IssueType", IssueType);
                _dic.Add("IssuePause", IssuePause);
                _dic.Add("IssueExpenseSum", IssueExpenseSum);
                _dic.Add("IsMallCoupons", IsMallCoupons);
                _dic.Add("IsRepeatGet", IsRepeatGet);
                _dic.Add("IsOfflineUse", IsOfflineUse);
                _dic.Add("ShopUserID", ShopUserID);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_CouponsMsg, "T_CouponsMsg", "1", _dic);
                return _json;
            }
            else if (_exeType == "2") //锁定解锁优惠券信息
            {
                // 获取传递的参数
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("CouponsID", CouponsID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_CouponsMsg, "T_CouponsMsg", "3", _dic);
                return _json;
            }
            else if (_exeType == "3") //初始化优惠券详情(CMS版)
            {
                // 获取传递的参数
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("CouponsID", CouponsID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_CouponsMsg, "T_CouponsMsg", "16", _dic);
                return _json;
            }

            return "";
        }

        /// <summary>
        /// 优惠券发放
        /// </summary>
        /// <returns></returns>
        public string CouponsIssueMsg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("TradingPage/CouponsMsg^TradingPage/CouponsDetail^TradingPage/CouponsIssueMsg");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索分页数据 
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");
                string CouponsTitle = PublicClass.FilterRequestTrim("CouponsTitle");
                string UseMoney = PublicClass.FilterRequestTrim("UseMoney");
                string UseDiscount = PublicClass.FilterRequestTrim("UseDiscount");
                string IssueID = PublicClass.FilterRequestTrim("IssueID");
                string IsUsed = PublicClass.FilterRequestTrim("IsUsed");
                string IsOverTime = PublicClass.FilterRequestTrim("IsOverTime");
                string IsMallCoupons = PublicClass.FilterRequestTrimNoConvert("IsMallCoupons");
                string UsedTime = PublicClass.FilterRequestTrimNoConvert("UsedTime");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //当前页
                string pageCurrent = PublicClass.FilterRequestTrim("pageCurrent");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("pageCurrent", pageCurrent);
                _dicPost.Add("ShopUserID", ShopUserID);
                _dicPost.Add("BuyerUserID", BuyerUserID);
                _dicPost.Add("CouponsID", CouponsID);
                _dicPost.Add("CouponsTitle", CouponsTitle);
                _dicPost.Add("UseMoney", UseMoney);
                _dicPost.Add("UseDiscount", UseDiscount);
                _dicPost.Add("IssueID", IssueID);
                _dicPost.Add("IsUsed", IsUsed);
                _dicPost.Add("IsOverTime", IsOverTime);
                _dicPost.Add("IsMallCoupons", IsMallCoupons);
                _dicPost.Add("UsedTime", UsedTime);
                _dicPost.Add("WriteDate", WriteDate);

                //优惠券数据分页
                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_CouponsIssueMsg, "T_CouponsIssueMsg", "6", _dicPost);
                return _jsonBack;
            }


            return "";
        }


        #endregion

        #region【礼品】

        /// <summary>
        /// 礼品订单
        /// </summary>
        /// <returns></returns>
        public string PresentOrderMsg()
        {

            return "";
        }

        #endregion



    }
}