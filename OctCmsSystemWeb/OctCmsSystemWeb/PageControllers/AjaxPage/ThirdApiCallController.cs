using BusiApiHttpNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
///【第三方系统调用( OctThirdApiCallSystem )】Ajax请求控制器
/// </summary>
namespace OctCmsSystemWeb.PageControllers.AjaxPage
{
    public class ThirdApiCallController : Controller
    {

        /// <summary>
        /// 支付设置信息
        /// </summary>
        /// <returns></returns>
        public string PaySetting()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("ThirdApiCallPage/PaySetting");
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

            //获取操作类型  Type=1 搜索分页数据 Type=2 编辑/添加
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

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);

                _dic.Add("PaySettingID", PaySettingID);
                _dic.Add("UserKeyID", UserKeyID);
                _dic.Add("PayType", PayType);
                _dic.Add("NotifyUrl", NotifyUrl);
                _dic.Add("ReturnUrl", ReturnUrl);
                _dic.Add("QuitUrl", QuitUrl);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_TAC_PaySetting, "TAC_PaySetting", "1", _dic);

                return _json;
            }
            else if (_exeType == "2") //编辑/添加{
            {
                // 获取传递的参数
                string PaySettingID = PublicClass.FilterRequestTrim("PaySettingID");
                string NotifyUrl = PublicClass.FilterRequestTrim("NotifyUrl");
                string ReturnUrl = PublicClass.FilterRequestTrim("ReturnUrl");
                string QuitUrl = PublicClass.FilterRequestTrim("QuitUrl");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PaySettingID", PaySettingID);
                _dic.Add("NotifyUrl", NotifyUrl);
                _dic.Add("ReturnUrl", ReturnUrl);
                _dic.Add("QuitUrl", QuitUrl);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_TAC_PaySetting, "TAC_PaySetting", "2", _dic);
                return _json;
            }

            return "";
        }

        /// <summary>
        /// 预支付信息
        /// </summary>
        /// <returns></returns>
        public string PayPreMsg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("ThirdApiCallPage/PayPreMsg");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索分页数据 Type=2 删除几个月以前的预支付信息
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

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);

                _dic.Add("PayPreID", PayPreID);
                _dic.Add("UserKeyID", UserKeyID);
                _dic.Add("OrderID", OrderID);
                _dic.Add("BillNumber", BillNumber);
                _dic.Add("OrderPrice", OrderPrice);
                _dic.Add("PayType", PayType);
                _dic.Add("IsPaySuccess", IsPaySuccess);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_TAC_PayPreMsg, "TAC_PayPreMsg", "1", _dic);

                return _json;
            }
            else if (_exeType == "2") //删除几个月以前的预支付信息
            {
                // 获取传递的参数
                string MonthNumAgo = PublicClass.FilterRequestTrim("MonthNumAgo");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("MonthNumAgo", MonthNumAgo);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_TAC_PayPreMsg, "TAC_PayPreMsg", "2", _dic);
                return _json;
            }

            return "";
        }

        /// <summary>
        /// 短信发送信息
        /// </summary>
        /// <returns></returns>
        public string SmsSendMsg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("ThirdApiCallPage/SmsSendMsg");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索分页数据 Type=2 删除几个月以前的 发送短信信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string SmsSendID = PublicClass.FilterRequestTrim("SmsSendID");
                string ToMobileNumbers = PublicClass.FilterRequestTrim("ToMobileNumbers");
                string SmsType = PublicClass.FilterRequestTrim("SmsType");
                string SmsTemplateCode = PublicClass.FilterRequestTrim("SmsTemplateCode");
                string SmsTemplateParam = PublicClass.FilterRequestTrim("SmsTemplateParam");
                string VerifyCode = PublicClass.FilterRequestTrim("VerifyCode");
                string IsVerify = PublicClass.FilterRequestTrim("IsVerify");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);

                _dic.Add("SmsSendID", SmsSendID);
                _dic.Add("ToMobileNumbers", ToMobileNumbers);
                _dic.Add("SmsType", SmsType);
                _dic.Add("SmsTemplateCode", SmsTemplateCode);
                _dic.Add("SmsTemplateParam", SmsTemplateParam);
                _dic.Add("VerifyCode", VerifyCode);
                _dic.Add("IsVerify", IsVerify);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_TAC_SmsSendMsg, "TAC_SmsSendMsg", "1", _dic);

                return _json;
            }
            else if (_exeType == "2") //删除几个月以前的 发送短信信息
            {
                // 获取传递的参数
                string MonthNumAgo = PublicClass.FilterRequestTrim("MonthNumAgo");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("MonthNumAgo", MonthNumAgo);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_TAC_SmsSendMsg, "TAC_SmsSendMsg", "6", _dic);
                return _json;
            }


            return "";
        }



    }
}