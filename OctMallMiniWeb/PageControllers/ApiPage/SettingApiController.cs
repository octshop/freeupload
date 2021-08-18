using BusiApiHttpNS;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
///  【系统设置】相关Api控制器
/// </summary>
namespace OctMallMiniWeb.PageControllers.ApiPage
{
    public class SettingApiController : Controller
    {

        /// <summary>
        /// 公共首页Api
        /// </summary>
        /// <returns></returns>
        public string Index()
        {
            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }

            //获取操作类型  Type=1 绑定手机号到用户账号,存在账号信息的情况 Type=2 判断用户是否绑定了手机 Type=3 初始化用户账号信息(简单版) Type=4 重设登录密码 Type=5 重设支付密码
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1")
            {
                //获取传递的参数
                string ToMobileNumber = PublicClass.FilterRequestTrim("ToMobileNumber");
                string SmsVerifyCode = PublicClass.FilterRequestTrim("SmsVerifyCode");

                bool _isVali = PublicClass.isValidMobile(ToMobileNumber);
                //WriteLogNs.LogClass.WriteLogFile("_isVali=" + _isVali.ToString());
                if (_isVali == false)
                {
                    return "";
                }

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("UserID", _loginUserID);
                _dicPost.Add("ToMobileNumber", ToMobileNumber);
                _dicPost.Add("SmsVerifyCode", SmsVerifyCode);

                //发送Http请求
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_RegUserAccount, "UGS_RegUserAccount", "4", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //判断用户是否绑定了手机
            {
                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("UserID", _loginUserID);

                //发送Http请求
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_RegUserAccount, "UGS_RegUserAccount", "7", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "3") //初始化用户账号信息(简单版)
            {
                //获取传递的参数值
                string IsMaskMobile = PublicClass.FilterRequestTrim("IsMaskMobile");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("UserID", _loginUserID);
                _dicPost.Add("IsMaskMobile", IsMaskMobile);

                //发送Http请求
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_RegUserAccount, "UGS_RegUserAccount", "8", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "4") //重设登录密码
            {
                //获取传递的参数
                string BindMobile = PublicClass.FilterRequestTrim("BindMobile");
                string LoginPwdNew = PublicClass.FilterRequestTrim("LoginPwdNew");
                string SmsVerifyCode = PublicClass.FilterRequestTrim("SmsVerifyCode");

                if (LoginPwdNew.Length < 6)
                {
                    return "";
                }

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("LoginPwdSha1New", EncryptionClassNS.EncryptionClass.GetSHA1(LoginPwdNew));
                _dic.Add("BindMobile", BindMobile);
                _dic.Add("SmsVerifyCode", SmsVerifyCode);

                //正式发送Http请求
                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_UserLoginVerify, "UGS_UserLoginVerify", "2", _dic);

                //判断是否重设成功
                JObject _jObj = (JObject)JsonConvert.DeserializeObject(_jsonBack);
                if (string.IsNullOrWhiteSpace(_jObj["Msg"].ToString()) == false)
                {
                    if (_jObj["Msg"].ToString().IndexOf("成功") >= 0)
                    {
                        //清除登录Cookie
                        //BusiLogin.clearLoginCookie();
                    }
                }

                return _jsonBack;
            }
            else if (_exeType == "5") //重设支付密码
            {
                //获取传递的参数
                string BindMobile = PublicClass.FilterRequestTrim("BindMobile");
                string PayPwdNew = PublicClass.FilterRequestTrim("PayPwdNew");
                string SmsVerifyCode = PublicClass.FilterRequestTrim("SmsVerifyCode");

                if (PayPwdNew.Length < 6)
                {
                    return "";
                }

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PayPwdSha1New", EncryptionClassNS.EncryptionClass.GetSHA1(PayPwdNew));
                _dic.Add("BindMobile", BindMobile);
                _dic.Add("SmsVerifyCode", SmsVerifyCode);

                //正式发送Http请求
                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_UserLoginVerify, "UGS_UserLoginVerify", "3", _dic);

                //判断是否重设成功
                JObject _jObj = (JObject)JsonConvert.DeserializeObject(_jsonBack);
                if (string.IsNullOrWhiteSpace(_jObj["Msg"].ToString()) == false)
                {
                    if (_jObj["Msg"].ToString().IndexOf("成功") >= 0)
                    {
                        //清除登录Cookie
                        //BusiLogin.clearLoginCookie();
                    }
                }

                return _jsonBack;
            }

            return "";
        }

    }
}