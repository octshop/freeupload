using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// 【登录】相关业务逻辑
/// </summary>
namespace OctMallMiniWeb
{
    public class BusiLogin
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        public BusiLogin()
        {

        }

        /// <summary>
        /// 设置用户登录Cookie 
        /// </summary>
        /// <param name="pUserID">用户UserID</param>
        /// <param name="pLoginPwdNoSha1">登录密码 SHA1加密</param>
        /// <returns></returns>
        public static bool setLoginCookie(string pUserID, string pLoginPwdSha1)
        {
            string _loginCookieMsg = pUserID + "^" + pLoginPwdSha1;
            //加密存储
            PublicClass.setCookieValueRSAEncrypt("OctUserLoginCookie", _loginCookieMsg,1000);

            return true;
        }

        /// <summary>
        /// 清除用户登录Cookie
        /// </summary>
        /// <returns></returns>
        public static bool clearLoginCookie() {

            PublicClass.clearCookieValue("OctUserLoginCookie");
            return true;
        }

        /// <summary>
        /// 得到登录用户的 [0] UserID 和 [1] SHA1的登录密码
        /// </summary>
        /// <returns></returns>
        public static string[] getLoginCookieUserIDAndLoginPwdNoSha1()
        {
            string[] _loginCookieArr = new string[5];

            //得到登录Cookie并解密
            string _loginCookie = PublicClass.getCookieValueRSADecrypt("OctUserLoginCookie");
            if (string.IsNullOrWhiteSpace(_loginCookie))
            {
                _loginCookieArr[0] = "";
                _loginCookieArr[1] = "";
                _loginCookieArr[2] = "";
                _loginCookieArr[3] = "";
                _loginCookieArr[4] = "";
            }
            else
            {
                _loginCookieArr = _loginCookie.Split('^');
            }
            return _loginCookieArr;
        }

        /// <summary>
        /// 得到用户登录的UserID
        /// </summary>
        /// <returns></returns>
        public static string getLoginUserID()
        {
            //获取买家登录BuyerUserID和LoginPwd
            string[] _userLoginCookieArr = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1();
            if (string.IsNullOrWhiteSpace(_userLoginCookieArr[0]))
            {
                return "";
            }
            return _userLoginCookieArr[0];
        }

        /// <summary>
        /// 判断用户登录是否正确
        /// </summary>
        /// <returns></returns>
        public static string isLoginRetrunUserID()
        {
            // 获取买家登录BuyerUserID和LoginPwd
            string[] _userLoginCookieArr = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1();

            if (string.IsNullOrWhiteSpace(_userLoginCookieArr[0]))
            {
                return ""; //没有登录
            }

            //调用接口 判断用户名和登录密码是否正确
            //POST参数
            Dictionary<string, string> _dicPost = new Dictionary<string, string>();
            _dicPost.Add("BuyerUserID", _userLoginCookieArr[0]);

            //发送验证买家登录UserID和登录密码是否正确 登录密码没有SHA1
            string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_CheckUserAccount, "CheckUserAccount", "1", _dicPost, true, _userLoginCookieArr[0], _userLoginCookieArr[1]);
            if (_jsonBack.IndexOf("用户ID登录密码正确") >= 0)
            {
                return _userLoginCookieArr[0];
            }
            return "";
        }

        /// <summary>
        /// 页面判断用户登录是否正确 不正确可以跳转 两参数为空则不跳转
        /// </summary>
        /// <param name="pBackUrl">返回URL</param>
        /// <param name="pNoLoginRedirectURL">跳转URL</param>
        /// <returns></returns>
        public static string isLoginPageRetrunUserID(string pBackUrl = "",string pNoLoginRedirectURL = "../Login/Buyer")
        {
            //判断用户登录是否正确
            string _userID = isLoginRetrunUserID();

            //登录错误
            if (string.IsNullOrWhiteSpace(_userID))
            {
                if (string.IsNullOrWhiteSpace(pNoLoginRedirectURL) && string.IsNullOrWhiteSpace(pBackUrl))
                {
                    return "";
                }
                else
                {
                    //构造跳转URL
                    string _url = pNoLoginRedirectURL;
                    if (string.IsNullOrWhiteSpace(pBackUrl) == false)
                    {
                        _url += "?BackUrl=" + pBackUrl;
                    }
                    //正式跳转
                    System.Web.HttpContext.Current.Response.Redirect(_url);
                }
            }
            else
            {
                return _userID;
            }
            //返回空字符串
            return "";
        }


    }
}