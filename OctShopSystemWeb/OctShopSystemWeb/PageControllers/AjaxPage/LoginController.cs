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
/// 【登录】相关Ajax请求控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.AjaxPage
{
    public class LoginController : Controller
    {

        /// <summary>
        /// 登录公共首页
        /// </summary>
        /// <returns></returns>
        public string Index()
        {
            //获取操作类型  Type=1 用户登录验证 (Acc 账号登录，手机短信登录) Type=2 退出登录
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string UserAccount = PublicClass.FilterRequestTrim("UserAccount");
                //没有SHA1加密的登录密码
                string LoginPwd = PublicClass.FilterRequestTrim("LoginPwd");

                string BindMobile = PublicClass.FilterRequestTrim("BindMobile");
                string SmsVerifyCode = PublicClass.FilterRequestTrim("SmsVerifyCode");

                //登录验证类型 "Acc 账号登录 或 Mobile 手机短信登录"
                string LoginVerifyType = PublicClass.FilterRequestTrim("LoginVerifyType");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UserAccount", UserAccount);
                _dic.Add("LoginPwdSha1", EncryptionClassNS.EncryptionClass.GetSHA1(LoginPwd));
                _dic.Add("BindMobile", BindMobile);
                _dic.Add("SmsVerifyCode", SmsVerifyCode);
                _dic.Add("IsOpenShop", "true");
                _dic.Add("LoginVerifyType", LoginVerifyType);

                //正式发送Http请求
                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_UserLoginVerify, "UGS_UserLoginVerify", "1", _dic);

                //判断是否登录成功
                JObject _jObj = (JObject)JsonConvert.DeserializeObject(_jsonBack);
                if (string.IsNullOrWhiteSpace(_jObj["Msg"].ToString()) == false)
                {
                    if (_jObj["Msg"].ToString().IndexOf("成功") >= 0)
                    {
                        //设置登录用户的Cookie信息
                        BusiLogin.setLoginCookieLoginPwdSha1(_jObj["DataDic"]["UserID"].ToString().Trim(), _jObj["DataDic"]["LoginKey"].ToString().Trim());
                    }
                }

                return _jsonBack;
            }
            else if (_exeType == "2") //退出登录
            {
                BusiLogin.clearLoginCookie();

                return "21";
            }
            


            return "";
        }
    }
}