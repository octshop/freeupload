using BusiApiKeyVerifyNS;
using OctTradingSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【支付】相关的API接口控制器
/// </summary>
namespace OctTradingSystemWeb.PageControllers.ApiPage
{
    public class PayController : Controller
    {
        /// <summary>
        /// 支付公共首页
        /// </summary>
        /// <returns></returns>
        public string Index()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 初始化支付成功的订单信息通过BillNumber
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递过来的参数
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");

                //初始化支付成功的订单信息 通过BillNumber
                string _jsonBack = BusiOrder.initOrderMsgPaySuByBillNumber(BillNumber);
                return _jsonBack;
            }
            return "";
        }

        /// <summary>
        /// 订单支付 主要是： 余额支付，货到付款，到店付，银行转账  
        /// </summary>
        /// <returns></returns>
        public string PayOrder()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 处理订单选择的不同方式支付 -- 支持多订单 Type=2 提交保存支付订单信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //支付方式 （Transfer[转账汇款] , Offline[线下付款(到店付)], PayDelivery [货到付款]  Balance[余额支付] Integral[积分支付]）
                string PayWay = PublicClass.FilterRequestTrim("PayWay");
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                //防止数字为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //提交订单的各种支付，- 余额支付,积分支付，货到付款，到店付，银行转账  -- 支持多订单
                string _jsonBack = BusiPay.submitPayOrderApi(Convert.ToInt64(BuyerUserID), BillNumber, PayWay);
                return _jsonBack;
            }
            else if (_exeType == "2") //提交保存支付订单信息
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string OrderMemo = PublicClass.FilterRequestTrim("OrderMemo");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字为空
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //保存 支付订单信息 [从订单详情页进入] --API调用方法
                string _jsonBack = BusiOrder.savePayOrderMsgApi(Convert.ToInt64(OrderID), Convert.ToInt64(BuyerUserID), OrderMemo);
                return _jsonBack;

            }
            return "";
        }

        /// <summary>
        /// 转账汇款银行信息
        /// </summary>
        /// <returns></returns>
        public string PayTransBankMsg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 添加/编辑信息 Type=3 锁定/解锁信息
            //Type=4 批量删除信息 Type=5 初始化银行转账平台和买家之前转账信息，订单信息 Type=6 提交买家转账凭证照片信息 Type=7 提交买家汇款确认信息
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

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                TransBankID = PublicClass.preventNumberDataIsNull(TransBankID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelPayTransBankMsg _modelPayTransBankMsg = new ModelPayTransBankMsg();
                _modelPayTransBankMsg.TransBankID = Convert.ToInt64(TransBankID);
                _modelPayTransBankMsg.TransType = TransType;
                _modelPayTransBankMsg.BankName = BankName;
                _modelPayTransBankMsg.BankAccName = BankAccName;
                _modelPayTransBankMsg.OpenAccBank = OpenAccBank;
                _modelPayTransBankMsg.BankAccount = BankAccount;
                _modelPayTransBankMsg.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelPayTransBankMsg.IsLock = IsLock;
                _modelPayTransBankMsg.WriteDate = WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONPayTransBankMsg(_modelPayTransBankMsg, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
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
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //防止数字类型为空
                TransBankID = PublicClass.preventNumberDataIsNull(TransBankID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //提交 转账汇款银行信息 --API调用方法
                return BusiPay.submitPayTransBankMsgApi(Convert.ToInt64(TransBankID), TransType, BankName, BankAccName, OpenAccBank, BankAccount, Convert.ToInt64(ShopUserID), IsLock);
            }
            else if (_exeType == "3") //锁定/解锁信息
            {
                // 获取传递的参数
                string TransBankID = PublicClass.FilterRequestTrim("TransBankID");

                //锁定/解锁 转账汇款银行信息  --API调用方法
                return BusiPay.lockPayTransBankMsgApi(Convert.ToInt64(TransBankID));
            }
            else if (_exeType == "4") //批量删除信息
            {
                // 获取传递的参数
                string TransBankIDArr = PublicClass.FilterRequestTrim("TransBankIDArr");

                // 删除 单个或批量 转账汇款银行信息 --API调用方法
                return BusiPay.delPayTransBankMsgArrApi(TransBankIDArr);
            }
            else if (_exeType == "5") //初始化银行转账平台和买家之前转账信息，订单信息
            {
                // 获取传递的参数
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");

                //初始化转账付款支付信息 [订单信息,平台转账银行信息,买家之前的转账汇款信息,]
                string _jsonBack = BusiPay.initPayTransBankMsgShopBuyerApi(BillNumber);
                return _jsonBack;
            }
            else if (_exeType == "6") //提交买家转账凭证照片信息
            {
                // 获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");
                string ImgPath = PublicClass.FilterRequestTrim("ImgPath");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                // 提交 买家转账汇款记录  -- API调用方法
                string _jsonBack = BusiPay.submitPayTransRecordApi(BillNumber, "", "", 0, UploadGuid, ImgPath, "", Convert.ToInt64(UserID), "");
                return _jsonBack;
            }
            else if (_exeType == "7") //提交买家汇款确认信息
            {
                // 获取传递的参数
                string UserID = PublicClass.FilterRequestTrimNoConvert("UserID");
                string BuyerBankName = PublicClass.FilterRequestTrimNoConvert("BuyerBankName");
                string BuyerBankAcc = PublicClass.FilterRequestTrimNoConvert("BuyerBankAcc");
                string BankName = PublicClass.FilterRequestTrimNoConvert("BankName");
                string TotalOrderPrice = PublicClass.FilterRequestTrimNoConvert("TotalOrderPrice");
                string UploadGuid = PublicClass.FilterRequestTrimNoConvert("UploadGuid");
                string BillNumber = PublicClass.FilterRequestTrimNoConvert("BillNumber");

                // 提交 买家转账汇款记录  -- API调用方法
                string _jsonBack = BusiPay.submitPayTransRecordApi(BillNumber, BuyerBankName, BuyerBankAcc, Convert.ToDecimal(TotalOrderPrice), UploadGuid, "", "", Convert.ToInt64(UserID), "", BankName);
                return _jsonBack;
            }


            return "";
        }

        /// <summary>
        /// 转账记录信息
        /// </summary>
        /// <returns></returns>
        public string PayTransRecord()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 删除批量买家转账汇款记录
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
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                TransRecordID = PublicClass.preventNumberDataIsNull(TransRecordID);
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                TransMoney = PublicClass.preventDecimalDataIsNull(TransMoney);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);


                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelPayTransRecord _modelPayTransRecord = new ModelPayTransRecord();
                _modelPayTransRecord.TransRecordID = Convert.ToInt64(TransRecordID);
                _modelPayTransRecord.OrderID = Convert.ToInt64(OrderID);
                _modelPayTransRecord.BillNumber = BillNumber;
                _modelPayTransRecord.BankName = BankName;
                _modelPayTransRecord.BuyerBankName = BuyerBankName;
                _modelPayTransRecord.BuyerBankAcc = BuyerBankAcc;
                _modelPayTransRecord.TransMoney = Convert.ToDecimal(TransMoney);
                _modelPayTransRecord.TransMemo = TransMemo;
                _modelPayTransRecord.BuyerUserID = Convert.ToInt64(BuyerUserID);
                _modelPayTransRecord.IsLock = IsLock;
                _modelPayTransRecord.WriteDate = WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONPayTransRecord(_modelPayTransRecord, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //删除批量买家转账汇款记录
            {
                //获取传递的参数
                string TransRecordIDArr = PublicClass.FilterRequestTrim("TransRecordIDArr");

                string _jsonBack = BusiPay.delPayTransRecordArrApi(TransRecordIDArr);
                return _jsonBack;
            }


            return "";
        }

        /// <summary>
        /// 线下付款地址信息
        /// </summary>
        /// <returns></returns>
        public string PayOfflineAddress()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 添加/编辑信息 Type=3 锁定/解锁信息
            //Type=4 删除信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string PayAddrID = PublicClass.FilterRequestTrim("PayAddrID");
                string AddrType = PublicClass.FilterRequestTrim("AddrType");
                string ShopName = PublicClass.FilterRequestTrim("ShopName");
                string PayAddress = PublicClass.FilterRequestTrim("PayAddress");
                string Mobile = PublicClass.FilterRequestTrim("Mobile");
                string FixTel = PublicClass.FilterRequestTrim("FixTel");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                PayAddrID = PublicClass.preventNumberDataIsNull(PayAddrID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelPayOfflineAddress _modelPayOfflineAddress = new ModelPayOfflineAddress();
                _modelPayOfflineAddress.PayAddrID = Convert.ToInt64(PayAddrID);
                _modelPayOfflineAddress.AddrType = AddrType;
                _modelPayOfflineAddress.ShopName = ShopName;
                _modelPayOfflineAddress.PayAddress = PayAddress;
                _modelPayOfflineAddress.Mobile = Mobile;
                _modelPayOfflineAddress.FixTel = FixTel;
                _modelPayOfflineAddress.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelPayOfflineAddress.IsLock = IsLock;
                _modelPayOfflineAddress.WriteDate = WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONPayOfflineAddress(_modelPayOfflineAddress, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加/编辑信息
            {
                // 获取传递的参数
                string PayAddrID = PublicClass.FilterRequestTrim("PayAddrID");
                string AddrType = PublicClass.FilterRequestTrim("AddrType");
                string ShopName = PublicClass.FilterRequestTrim("ShopName");
                string PayAddress = PublicClass.FilterRequestTrim("PayAddress");
                string Mobile = PublicClass.FilterRequestTrim("Mobile");
                string FixTel = PublicClass.FilterRequestTrim("FixTel");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //防止数字类型为空
                PayAddrID = PublicClass.preventNumberDataIsNull(PayAddrID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //提交 线下付款地址信息 --API调用方法
                return BusiPay.submitPayOfflineAddressApi(Convert.ToInt64(PayAddrID), AddrType, ShopName, PayAddress, Mobile, FixTel, Convert.ToInt64(ShopUserID), IsLock);
            }
            else if (_exeType == "3") //锁定/解锁信息
            {
                // 获取传递的参数
                string PayAddrID = PublicClass.FilterRequestTrim("PayAddrID");

                //锁定/解锁 线下付款地址信息 --API调用方法
                return BusiPay.lockPayOfflineAddressApi(Convert.ToInt64(PayAddrID));
            }
            else if (_exeType == "4") //删除信息
            {
                // 获取传递的参数
                string PayAddrIDArr = PublicClass.FilterRequestTrim("PayAddrIDArr");
                //删除 单个或批量 线下付款地址信息 --API调用方法
                return BusiPay.delPayOfflineAddressArrApi(PayAddrIDArr);
            }

            return "";
        }

        /// <summary>
        /// 商家充积分支付
        /// </summary>
        /// <returns></returns>
        public string PayShopIntegralRecharge()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 商家充积分支付 Type=2 判断是否有未支付的充积分订单记录 Type=3 统计当前商家积分,总收入减去总支出
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递过来的参数
                string RechargePrice = PublicClass.FilterRequestTrim("RechargePrice");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字为空
                RechargePrice = PublicClass.preventNumberDataIsNull(RechargePrice);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //保留两们小数
                RechargePrice = PublicClass.formatNumberDotDigit(RechargePrice);

                //提交商家充积分订单,并生成微信和支付宝的支付信息 --API调用方法 
                string _jsonBack = BusiPay.submitShopIntegralRechargePayMsgApi(Convert.ToDecimal(RechargePrice), Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "2") //判断是否有未支付的充积分订单记录
            {
                //获取传递过来的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //判断是否存在未支付的充积分订单记录 --API调用方法 
                string _jsonBack = BusiPay.existNoPayIntegralRechargeOrderApi(Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "3") //统计当前商家积分,总收入减去总支出
            {
                //获取传递过来的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //统计当前商家积分 -- API调用方法
                string _jsonBack = BusiIntegral.sumCurrentIntegralShopApi(Convert.ToInt64(ShopUserID));
                return _jsonBack;

            }
            return "";
        }


    }
}