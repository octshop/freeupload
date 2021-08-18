using BusiApiKeyVerifyNS;
using OctThirdApiCallSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【支付管理】相关Api接口控制器
/// </summary>
namespace OctThirdApiCallSystemWeb.PageControllers.ApiPage
{
    public class PayAdminController : Controller
    {
        // GET: PayAdmin
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 支付宝服务商子商户信息
        /// </summary>
        /// <returns></returns>
        public string PayAlipaySubAcc()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 数据分页 Type=2 编辑/添加 Type=3 锁定/解锁 Type=4 删除(可批量删除) 
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string SubAccID = PublicClass.FilterRequestTrim("SubAccID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string CompanyName = PublicClass.FilterRequestTrim("CompanyName");
                string AlipayAppID = PublicClass.FilterRequestTrim("AlipayAppID");
                string Merchant_Public_key = PublicClass.FilterRequestTrimNoConvert("Merchant_Public_key");
                string Merchant_Private_Key = PublicClass.FilterRequestTrimNoConvert("Merchant_Private_Key");
                string Alipay_Public_Key = PublicClass.FilterRequestTrimNoConvert("Alipay_Public_Key");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                SubAccID = PublicClass.preventNumberDataIsNull(SubAccID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelPayAlipaySubAcc _modelPayAlipaySubAcc = new ModelPayAlipaySubAcc();
                _modelPayAlipaySubAcc.SubAccID = Convert.ToInt64(SubAccID);
                _modelPayAlipaySubAcc.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelPayAlipaySubAcc.CompanyName = CompanyName;
                _modelPayAlipaySubAcc.AlipayAppID = AlipayAppID;
                _modelPayAlipaySubAcc.Merchant_Public_key = Merchant_Public_key;
                _modelPayAlipaySubAcc.Merchant_Private_Key = Merchant_Private_Key;
                _modelPayAlipaySubAcc.Alipay_Public_Key = Alipay_Public_Key;
                _modelPayAlipaySubAcc.IsLock = IsLock;
                _modelPayAlipaySubAcc.WriteDate = WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONPayAlipaySubAcc(_modelPayAlipaySubAcc, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //编辑/添加支付宝服务商子商户信息
            {
                // 获取传递的参数
                string SubAccID = PublicClass.FilterRequestTrim("SubAccID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string CompanyName = PublicClass.FilterRequestTrim("CompanyName");
                string AlipayAppID = PublicClass.FilterRequestTrim("AlipayAppID");
                string Merchant_Public_key = PublicClass.FilterRequestTrimNoConvert("Merchant_Public_key");
                string Merchant_Private_Key = PublicClass.FilterRequestTrimNoConvert("Merchant_Private_Key");
                string Alipay_Public_Key = PublicClass.FilterRequestTrimNoConvert("Alipay_Public_Key");

                //提交 支付宝服务商子商户信息 --API调用方法
                return BusiPayAdmin.submitPayAlipaySubAccApi(Convert.ToInt64(SubAccID), Convert.ToInt64(ShopUserID), CompanyName, AlipayAppID, Merchant_Public_key, Merchant_Private_Key, Alipay_Public_Key);
            }
            else if (_exeType == "3") //锁定/解锁
            {
                // 获取传递的参数
                string SubAccID = PublicClass.FilterRequestTrim("SubAccID");

                //锁定/解锁 支付宝服务商子商户信息 --API调用方法
                return BusiPayAdmin.lockPayAlipaySubAccApi(Convert.ToInt64(SubAccID));
            }
            else if (_exeType == "4") //删除(可批量删除)
            {
                // 获取传递的参数
                string SubAccIDArr = PublicClass.FilterRequestTrim("SubAccIDArr");

                //删除支付宝服务商子商户信息
                return BusiPayAdmin.delPayAlipaySubAccArrApi(SubAccIDArr);
            }
            return "";
        }

        /// <summary>
        /// 微信支付服务商子商户信息
        /// </summary>
        /// <returns></returns>
        public string PayWxPaySubAcc()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 数据分页 Type=2 编辑/添加 Type=3 锁定/解锁 Type=4 删除(可批量删除) 
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string SubAccID = PublicClass.FilterRequestTrim("SubAccID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string SubMchID = PublicClass.FilterRequestTrim("SubMchID");
                string SubAppID = PublicClass.FilterRequestTrim("SubAppID");
                string CompanyName = PublicClass.FilterRequestTrim("CompanyName");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                SubAccID = PublicClass.preventNumberDataIsNull(SubAccID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelPayWxPaySubAcc _modelPayWxPaySubAcc = new ModelPayWxPaySubAcc();
                _modelPayWxPaySubAcc.SubAccID = Convert.ToInt64(SubAccID);
                _modelPayWxPaySubAcc.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelPayWxPaySubAcc.SubMchID = SubMchID;
                _modelPayWxPaySubAcc.SubAppID = SubAppID;
                _modelPayWxPaySubAcc.CompanyName = CompanyName;
                _modelPayWxPaySubAcc.IsLock = IsLock;
                _modelPayWxPaySubAcc.WriteDate = WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONPayWxPaySubAcc(_modelPayWxPaySubAcc, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //编辑/添加
            {
                // 获取传递的参数
                string SubAccID = PublicClass.FilterRequestTrim("SubAccID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string SubMchID = PublicClass.FilterRequestTrim("SubMchID");
                string SubAppID = PublicClass.FilterRequestTrim("SubAppID");
                string CompanyName = PublicClass.FilterRequestTrim("CompanyName");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //提交 微信支付服务商子商户信息 --API调用方法
                string _backStr = BusiPayAdmin.submitPayWxPaySubAccApi(Convert.ToInt64(SubAccID), Convert.ToInt64(ShopUserID), SubMchID, SubAppID, CompanyName, IsLock);
                return _backStr;
            }
            else if (_exeType == "3") //锁定/解锁
            {
                // 获取传递的参数
                string SubAccID = PublicClass.FilterRequestTrim("SubAccID");

                //锁定/解锁 微信支付服务商子商户信息 --API调用方法
                string _lockSu = BusiPayAdmin.lockPayWxPaySubAccApi(Convert.ToInt64(SubAccID));
                return _lockSu;
            }
            else if (_exeType == "4") //删除(可批量删除) 
            {
                // 获取传递的参数
                string SubAccIDArr = PublicClass.FilterRequestTrim("SubAccIDArr");

                //删除 微信支付服务商子商户信息 --API调用方法
                string _delBack = BusiPayAdmin.delPayWxPaySubAccApi(SubAccIDArr);
                return _delBack;
            }

            return "";
        }

        /// <summary>
        /// 支付设置信息
        /// </summary>
        /// <returns></returns>
        public string PaySetting()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 数据分页 Type=2 编辑/添加 Type=3 锁定/解锁 Type=4 删除(可批量删除) 
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string PaySettingID = PublicClass.FilterRequestTrim("PaySettingID");
                string UserKeyID = PublicClass.FilterRequestTrim("UserKeyID");
                string PayType = PublicClass.FilterRequestTrim("PayType");
                string NotifyUrl = PublicClass.FilterRequestTrim("NotifyUrl");
                string ReturnUrl = PublicClass.FilterRequestTrim("ReturnUrl");
                string QuitUrl = PublicClass.FilterRequestTrim("QuitUrl");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                PaySettingID = PublicClass.preventNumberDataIsNull(PaySettingID);
                UserKeyID = PublicClass.preventNumberDataIsNull(UserKeyID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelPaySetting _modelPaySetting = new ModelPaySetting();
                _modelPaySetting.PaySettingID = Convert.ToInt64(PaySettingID);
                _modelPaySetting.UserKeyID = Convert.ToInt64(UserKeyID);
                _modelPaySetting.PayType = PayType;
                _modelPaySetting.NotifyUrl = NotifyUrl;
                _modelPaySetting.ReturnUrl = ReturnUrl;
                _modelPaySetting.QuitUrl = QuitUrl;
                _modelPaySetting.IsLock = IsLock;
                _modelPaySetting.WriteDate = WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONPaySetting(_modelPaySetting, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //编辑/添加
            {
                // 获取传递的参数
                string PaySettingID = PublicClass.FilterRequestTrim("PaySettingID");
                string UserKeyID = PublicClass.FilterRequestTrim("UserKeyID");
                string PayType = PublicClass.FilterRequestTrim("PayType");
                string NotifyUrl = PublicClass.FilterRequestTrim("NotifyUrl");
                string ReturnUrl = PublicClass.FilterRequestTrim("ReturnUrl");
                string QuitUrl = PublicClass.FilterRequestTrim("QuitUrl");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //防止数字类型为空
                PaySettingID = PublicClass.preventNumberDataIsNull(PaySettingID);
                UserKeyID = PublicClass.preventNumberDataIsNull(UserKeyID);

                //提交 支付设置信息 --API调用方法
                return BusiPayAdmin.submitPaySettingApi(Convert.ToInt64(PaySettingID), Convert.ToInt64(UserKeyID), PayType, NotifyUrl, ReturnUrl, QuitUrl, IsLock);
            }
            else if (_exeType == "3") //锁定/解锁
            {
                // 获取传递的参数
                string PaySettingID = PublicClass.FilterRequestTrim("PaySettingID");

                //锁定/解锁 支付设置信息 --API调用方法
                return BusiPayAdmin.lockPaySettingApi(Convert.ToInt64(PaySettingID));
            }
            else if (_exeType == "4") //删除(可批量删除) 
            {
                string PaySettingIDArr = PublicClass.FilterRequestTrim("PaySettingIDArr");

                //删除 支付设置信息 --API调用方法
                return BusiPayAdmin.delPaySettingIDArrApi(PaySettingIDArr);
            }

            return "";
        }

        /// <summary>
        /// 预支付信息
        /// </summary>
        /// <returns></returns>
        public string PayPreMsg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 数据分页 Type=2  删除几个月以前的预支付信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string PayPreID = PublicClass.FilterRequestTrim("PayPreID");
                string UserKeyID = PublicClass.FilterRequestTrim("UserKeyID");
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");
                string OrderPrice = PublicClass.FilterRequestTrim("OrderPrice");
                string PayType = PublicClass.FilterRequestTrim("PayType");
                string IsPaySuccess = PublicClass.FilterRequestTrim("IsPaySuccess");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                PayPreID = PublicClass.preventNumberDataIsNull(PayPreID);
                UserKeyID = PublicClass.preventNumberDataIsNull(UserKeyID);
                OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                OrderPrice = PublicClass.preventDecimalDataIsNull(OrderPrice);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelPayPreMsg _modelPayPreMsg = new ModelPayPreMsg();
                _modelPayPreMsg.PayPreID = Convert.ToInt64(PayPreID);
                _modelPayPreMsg.UserKeyID = Convert.ToInt64(UserKeyID);
                _modelPayPreMsg.OrderID = Convert.ToInt64(OrderID);
                _modelPayPreMsg.BillNumber = BillNumber;
                _modelPayPreMsg.OrderPrice = Convert.ToInt64(OrderPrice);
                _modelPayPreMsg.PayType = PayType;
                _modelPayPreMsg.IsPaySuccess = IsPaySuccess;
                _modelPayPreMsg.IsLock = IsLock;
                _modelPayPreMsg.WriteDate = WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONPayPreMsg(_modelPayPreMsg, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //删除几个月以前的预支付信息
            {
                // 获取传递的参数
                string MonthNumAgo = PublicClass.FilterRequestTrim("MonthNumAgo");

                //防止数字类型为空
                MonthNumAgo = PublicClass.preventNumberDataIsNull(MonthNumAgo);

                string _jsonBack = BusiPayAdmin.delPayPreMsgMonthAgoApi(Convert.ToInt32(MonthNumAgo));
                return _jsonBack;
            }

            return "";
        }

    }
}