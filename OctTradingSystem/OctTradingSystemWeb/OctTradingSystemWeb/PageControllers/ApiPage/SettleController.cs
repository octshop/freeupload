using BusiApiKeyVerifyNS;
using OctTradingSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【结算】相关的API接口控制器
/// </summary>
namespace OctTradingSystemWeb.PageControllers.ApiPage
{
    public class SettleController : Controller
    {
        /// <summary>
        /// 商家结算申请
        /// </summary>
        /// <returns></returns>
        public string SettleApply()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2  统计商家各种结算余额和金额 Type=3 数据搜索分页-可结算商城订单 Type=4 数据搜索分页-可结算聚合支付订单 Type=5 商家提交结算申请 Type=6 初始化商家结算申请信息 Type=7 提交结算处理完成
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string SettleID = PublicClass.FilterRequestTrim("SettleID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string AvailBalance = PublicClass.FilterRequestTrim("AvailBalance");
                string LockBalance = PublicClass.FilterRequestTrim("LockBalance");
                string SumBalance = PublicClass.FilterRequestTrim("SumBalance");
                string ApplySettleMoney = PublicClass.FilterRequestTrim("ApplySettleMoney");
                string ApplyName = PublicClass.FilterRequestTrim("ApplyName");
                string ApplyTel = PublicClass.FilterRequestTrim("ApplyTel");
                string SettleStatus = PublicClass.FilterRequestTrim("SettleStatus");
                string TransferVoucherImg = PublicClass.FilterRequestTrim("TransferVoucherImg");
                string DisposeMan = PublicClass.FilterRequestTrim("DisposeMan");
                string SettleMemo = PublicClass.FilterRequestTrim("SettleMemo");
                string DisposeDate = PublicClass.FilterRequestTrim("DisposeDate");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string ApplyDate = PublicClass.FilterRequestTrim("ApplyDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                SettleID = PublicClass.preventNumberDataIsNull(SettleID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                AvailBalance = PublicClass.preventDecimalDataIsNull(AvailBalance);
                LockBalance = PublicClass.preventDecimalDataIsNull(LockBalance);
                SumBalance = PublicClass.preventDecimalDataIsNull(SumBalance);
                ApplySettleMoney = PublicClass.preventDecimalDataIsNull(ApplySettleMoney);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelSettleApply _modelSettleApply = new ModelSettleApply();
                _modelSettleApply.SettleID = Convert.ToInt64(SettleID);
                _modelSettleApply.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelSettleApply.AvailBalance = Convert.ToDecimal(AvailBalance);
                _modelSettleApply.LockBalance = Convert.ToDecimal(LockBalance);
                _modelSettleApply.SumBalance = Convert.ToDecimal(SumBalance);
                _modelSettleApply.ApplySettleMoney = Convert.ToDecimal(ApplySettleMoney);
                _modelSettleApply.ApplyName = ApplyName;
                _modelSettleApply.ApplyTel = ApplyTel;
                _modelSettleApply.SettleStatus = SettleStatus;
                _modelSettleApply.TransferVoucherImg = TransferVoucherImg;
                _modelSettleApply.DisposeMan = DisposeMan;
                _modelSettleApply.SettleMemo = SettleMemo;
                _modelSettleApply.DisposeDate = DisposeDate;
                _modelSettleApply.ApplyDate = ApplyDate;
                _modelSettleApply.IsLock = IsLock;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONSettleApply(_modelSettleApply, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //统计商家各种结算余额和金额
            {
                // 获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字类型为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiSettle.countSettleAllBalanceMsgApi(Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "3") //数据搜索分页 - 可结算商城订单
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string OrderStatus = PublicClass.FilterRequestTrim("OrderStatus");
                string OrderPrice = PublicClass.FilterRequestTrim("OrderPrice");
                string PayWay = PublicClass.FilterRequestTrim("PayWay");
                string IsPaySuccess = PublicClass.FilterRequestTrim("IsPaySuccess");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //当前页
                string pageCurrent = PublicClass.FilterRequestTrim("pageCurrent");

                //防止数字类型为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelV_OrderMsg_OrderCommission _modelV = ModelV_OrderMsg_OrderCommission.initModelView();
                _modelV.ModelOrderMsg.OrderID = Convert.ToInt64(OrderID);
                _modelV.ModelOrderMsg.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelV.ModelOrderMsg.BuyerUserID = Convert.ToInt64(BuyerUserID);


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //---------可结算-商城订单限制性条件-----//
                _initSQLCharWhere += "IsLock='false' AND IsPaySuccess='true' AND IsRefund='false' AND IsSettle='false' AND IsPayService='false'  AND (PayWay<>'Offline' AND PayWay<>'PayDelivery') AND (OrderStatus='完成' OR OrderStatus='待评价') AND FinishTime<='" + DateTime.Now.AddDays(-Convert.ToDouble(OctTradingSystemNS.WebAppConfig.OrderFinishSettleAfterDay)).ToString("yyyy-MM-dd HH:mm:ss") + "'";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "OrderID", "BillNumber", "OrderStatus", "OrderPrice", "PayWay", "BuyerUserID", "ShopUserID", "FinishTime", "OrderTime", "CommissionPersent", "CommissionMoney", "CommissionMoney", "CommissionMoney", "IsDividend", "DividendPersent", "DividendSumMoney", "IsPromemDividend", "PromemDividendPersent", "PromemDividendMoney" };
                string _strJson = BusiJsonPageStr.morePageJSONV_OrderMsg_OrderCommission(_modelV, pageCurrent, _initSQLCharWhere, _showFieldArr, false, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "4") //数据搜索分页-可结算聚合支付订单
            {
                //获取传递的参数
                string AggregateOrderID = PublicClass.FilterRequestTrim("AggregateOrderID");
                string OrderStatus = PublicClass.FilterRequestTrim("OrderStatus");
                string OrderPrice = PublicClass.FilterRequestTrim("OrderPrice");
                string PayWay = PublicClass.FilterRequestTrim("PayWay");
                string IsPaySuccess = PublicClass.FilterRequestTrim("IsPaySuccess");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //当前页
                string pageCurrent = PublicClass.FilterRequestTrim("pageCurrent");

                //防止数字类型为空
                AggregateOrderID = PublicClass.preventNumberDataIsNull(AggregateOrderID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelV_AggregateOrderMsg_AggregateOrderCommission _modelV = ModelV_AggregateOrderMsg_AggregateOrderCommission.initModelView();
                _modelV.ModelAggregateOrderMsg.AggregateOrderID = Convert.ToInt64(AggregateOrderID);
                _modelV.ModelAggregateOrderMsg.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelV.ModelAggregateOrderMsg.BuyerUserID = Convert.ToInt64(BuyerUserID);


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //---------可结算-聚合支付订单 条件-----//
                _initSQLCharWhere = "IsLock='false' AND IsSettle='false' AND IsPaySuccess='true' AND IsRefund='false' AND PayTime IS NOT NULL AND OrderStatus='支付成功'";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "AggregateOrderID", "BillNumber", "OrderStatus", "OrderPrice", "PayWay", "BuyerUserID", "ShopUserID", "PayTime", "OrderTime", "CommissionPersent", "CommissionMoney", "CommissionMoney", "CommissionMoney", "IsDividend", "DividendPersent", "DividendSumMoney", "IsPromemDividend", "PromemDividendPersent", "PromemDividendMoney" };
                string _strJson = BusiJsonPageStr.morePageJSONV_AggregateOrderMsg_AggregateOrderCommission(_modelV, pageCurrent, _initSQLCharWhere, _showFieldArr, false, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "5") //商家提交结算申请
            {
                //获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字类型为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiSettle.submitSettleApplyShopApi(Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "6") //初始化商家结算申请信息
            {
                // 获取传递的参数
                string SettleID = PublicClass.FilterRequestTrim("SettleID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字类型为空
                SettleID = PublicClass.preventNumberDataIsNull(SettleID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiSettle.initSettleApplyDetailApi(Convert.ToInt64(SettleID), Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "7") //提交结算处理完成
            {
                // 获取传递的参数
                string SettleID = PublicClass.FilterRequestTrim("SettleID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string DisposeMan = PublicClass.FilterRequestTrim("DisposeMan");
                string RealTransSum = PublicClass.FilterRequestTrim("RealTransSum");
                string TransferVoucherImg = PublicClass.FilterRequestTrimNoConvert("TransferVoucherImg");
                string SettleMemo = PublicClass.FilterRequestTrim("SettleMemo");

                //防止数字类型为空
                SettleID = PublicClass.preventNumberDataIsNull(SettleID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                RealTransSum = PublicClass.preventDecimalDataIsNull(RealTransSum);

                //提交结算处理完成
                string _jsonBack = BusiSettle.submitSettleFinishPlatformApi(Convert.ToInt64(SettleID), DisposeMan, Convert.ToDecimal(RealTransSum), TransferVoucherImg, SettleMemo, Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 商家结算资料
        /// </summary>
        /// <returns></returns>
        public string SettleShopMsg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 提交商家结算资料 Type=2 初始化商家结算资料 Type=3 搜索数据分页 Type=4 审核商家结算资料
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string SettleShopMsgID = PublicClass.FilterRequestTrim("SettleShopMsgID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string CompanyName = PublicClass.FilterRequestTrim("CompanyName");
                string CompanyAddr = PublicClass.FilterRequestTrim("CompanyAddr");
                string CompanyTel = PublicClass.FilterRequestTrim("CompanyTel");
                string CertificateID = PublicClass.FilterRequestTrim("CertificateID");
                string CertificateImg = PublicClass.FilterRequestTrimNoConvert("CertificateImg");
                string LegalPerson = PublicClass.FilterRequestTrim("LegalPerson");
                string LinkMan = PublicClass.FilterRequestTrim("LinkMan");
                string MobileNumber = PublicClass.FilterRequestTrim("MobileNumber");
                string Email = PublicClass.FilterRequestTrim("Email");
                string Department = PublicClass.FilterRequestTrim("Department");
                string BankAccount = PublicClass.FilterRequestTrim("BankAccount");
                string BankAccName = PublicClass.FilterRequestTrim("BankAccName");
                string OpeningBank = PublicClass.FilterRequestTrim("OpeningBank");
                string RegionCodeArr = PublicClass.FilterRequestTrim("RegionCodeArr");

                //防止数字为空
                SettleShopMsgID = PublicClass.preventNumberDataIsNull(SettleShopMsgID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiSettle.submitSettleShopMsgApi(Convert.ToInt64(SettleShopMsgID), Convert.ToInt64(ShopUserID), CompanyName, CompanyAddr, CompanyTel, CertificateID, CertificateImg, LegalPerson, LinkMan, MobileNumber, Email, Department, BankAccount, BankAccName, OpeningBank, RegionCodeArr);
                return _jsonBack;
            }
            else if (_exeType == "2") //初始化商家结算资料
            {
                // 获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                //资料是否审核 ( false 待审核 true 不通过 pass 通过 )
                string IsCheck = PublicClass.FilterRequestTrim("IsCheck");

                //防止数字为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiSettle.initSettleShopMsgApi(Convert.ToInt64(ShopUserID), IsCheck);
                return _jsonBack;

            }
            else if (_exeType == "3") //搜索数据分页
            {
                // 获取传递的参数
                string SettleShopMsgID = PublicClass.FilterRequestTrim("SettleShopMsgID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string RegionCodeArr = PublicClass.FilterRequestTrim("RegionCodeArr");
                string CompanyName = PublicClass.FilterRequestTrim("CompanyName");
                string CompanyAddr = PublicClass.FilterRequestTrim("CompanyAddr");
                string CompanyTel = PublicClass.FilterRequestTrim("CompanyTel");
                string CertificateID = PublicClass.FilterRequestTrim("CertificateID");
                string CertificateImg = PublicClass.FilterRequestTrim("CertificateImg");
                string LegalPerson = PublicClass.FilterRequestTrim("LegalPerson");
                string LinkMan = PublicClass.FilterRequestTrim("LinkMan");
                string MobileNumber = PublicClass.FilterRequestTrim("MobileNumber");
                string Email = PublicClass.FilterRequestTrim("Email");
                string Department = PublicClass.FilterRequestTrim("Department");
                string BankAccount = PublicClass.FilterRequestTrim("BankAccount");
                string BankAccName = PublicClass.FilterRequestTrim("BankAccName");
                string OpeningBank = PublicClass.FilterRequestTrim("OpeningBank");
                string IsCheck = PublicClass.FilterRequestTrim("IsCheck");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                SettleShopMsgID = PublicClass.preventNumberDataIsNull(SettleShopMsgID);
                ShopUserID = PublicClass.preventDecimalDataIsNull(ShopUserID);


                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelSettleShopMsg _modelSettleShopMsg = new ModelSettleShopMsg();
                _modelSettleShopMsg.SettleShopMsgID = Convert.ToInt64(SettleShopMsgID);
                _modelSettleShopMsg.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelSettleShopMsg.RegionCodeArr = RegionCodeArr;
                _modelSettleShopMsg.CompanyName = CompanyName;
                _modelSettleShopMsg.CompanyAddr = CompanyAddr;
                _modelSettleShopMsg.CompanyTel = CompanyTel;
                _modelSettleShopMsg.CertificateID = CertificateID;
                _modelSettleShopMsg.CertificateImg = CertificateImg;
                _modelSettleShopMsg.LegalPerson = LegalPerson;
                _modelSettleShopMsg.LinkMan = LinkMan;
                _modelSettleShopMsg.MobileNumber = MobileNumber;
                _modelSettleShopMsg.Email = Email;
                _modelSettleShopMsg.Department = Department;
                _modelSettleShopMsg.BankAccount = BankAccount;
                _modelSettleShopMsg.BankAccName = BankAccName;
                _modelSettleShopMsg.OpeningBank = OpeningBank;
                _modelSettleShopMsg.IsCheck = IsCheck;
                _modelSettleShopMsg.IsLock = IsLock;
                _modelSettleShopMsg.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONSettleShopMsg(_modelSettleShopMsg, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "4") //审核商家结算资料
            {
                // 获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsCheck = PublicClass.FilterRequestTrim("IsCheck");
                string CheckReason = PublicClass.FilterRequestTrim("CheckReason");

                if (string.IsNullOrWhiteSpace(CheckReason))
                {
                    CheckReason = "...";
                }

                //防止数字为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiSettle.checkSettleShopMsgApi(Convert.ToInt64(ShopUserID), IsCheck, CheckReason);
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 商城结算订单信息
        /// </summary>
        /// <returns></returns>
        public string SettleOrderMsg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 
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
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                SettleID = PublicClass.preventNumberDataIsNull(SettleID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                OrderID = PublicClass.preventDecimalDataIsNull(OrderID);


                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelSettleOrderMsg _modelSettleOrderMsg = new ModelSettleOrderMsg();
                _modelSettleOrderMsg.SettleID = Convert.ToInt64(SettleID);
                _modelSettleOrderMsg.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelSettleOrderMsg.OrderID = Convert.ToInt64(OrderID);
                _modelSettleOrderMsg.BillNumber = BillNumber;
                _modelSettleOrderMsg.OrderStatus = OrderStatus;
                _modelSettleOrderMsg.PayWay = PayWay;
                _modelSettleOrderMsg.PayTime = PayTime;
                _modelSettleOrderMsg.FinishTime = FinishTime;
                _modelSettleOrderMsg.IsLock = IsLock;
                _modelSettleOrderMsg.WriteDate = WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONSettleOrderMsg(_modelSettleOrderMsg, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            return "";
        }

        /// <summary>
        /// 聚合支付结算订单信息
        /// </summary>
        /// <returns></returns>
        public string SettleAggregateOrderMsg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 
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
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                SettleID = PublicClass.preventNumberDataIsNull(SettleID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                AggregateOrderID = PublicClass.preventDecimalDataIsNull(AggregateOrderID);


                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelSettleAggregateOrderMsg _modelSettleAggregateOrderMsg = new ModelSettleAggregateOrderMsg();
                _modelSettleAggregateOrderMsg.SettleID = Convert.ToInt64(SettleID);
                _modelSettleAggregateOrderMsg.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelSettleAggregateOrderMsg.AggregateOrderID = Convert.ToInt64(AggregateOrderID);
                _modelSettleAggregateOrderMsg.BillNumber = BillNumber;
                _modelSettleAggregateOrderMsg.OrderStatus = OrderStatus;
                _modelSettleAggregateOrderMsg.PayWay = PayWay;
                _modelSettleAggregateOrderMsg.PayTime = PayTime;
                _modelSettleAggregateOrderMsg.IsLock = IsLock;
                _modelSettleAggregateOrderMsg.WriteDate = WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONSettleAggregateOrderMsg(_modelSettleAggregateOrderMsg, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            return "";
        }



    }
}