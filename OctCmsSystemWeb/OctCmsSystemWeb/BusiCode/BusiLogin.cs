using BusiApiHttpNS;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// 【登录】相关逻辑
/// </summary>
namespace OctCmsSystemWeb
{
    public class BusiLogin
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        public BusiLogin()
        {

        }

        #region【用户登录】

        /// <summary>
        /// 检测【Ajax请求】用户登录是否正确
        /// </summary>
        /// <param name="pEnterPagePathCurrent">当前进入的页面路径,如果是多个页，可以用^连接 [ TradingPage/OrderMsg^TradingPage/OrderMsg ]</param>
        /// <returns>"CPAUL_01" 登录正常成功 "CPAUL_02" 用户名或登录密码错误  "CPAUL_04" 用户名已被锁定 "CPAUL_06" 你无权限进入，请联系超级管理员</returns>
        public static string chkAjaxAdminUserLogin(string pEnterPagePathCurrent = "")
        {
            //检测【进入页面】用户登录是否正确
            string _backCode = chkPageAdminUserLogin(pEnterPagePathCurrent, false);
            return _backCode;
        }

        /// <summary>
        /// 检测【进入页面】用户登录是否正确
        /// </summary>
        /// <param name="pEnterPagePathCurrent">当前进入的页面路径,如果是多个页，可以用^连接 [ TradingPage/OrderMsg^TradingPage/OrderMsg ]</param>
        /// <param name="pIsRedirect">是否跳转到登录页</param>
        /// <param name="pBackUrl">登录后的回跳URL</param>
        /// <returns>"CPAUL_01" 登录正常成功 "CPAUL_02" 用户名或登录密码错误  "CPAUL_04" 用户名已被锁定 "CPAUL_06" 你无权限进入，请联系超级管理员</returns>
        public static string chkPageAdminUserLogin(string pEnterPagePathCurrent = "", bool pIsRedirect = false, string pBackUrl = "")
        {
            //得到 登录Cookie信息
            Dictionary<string, object> _userLoginDic = getLoginCookieDic();
            if (_userLoginDic == null)
            {
                //是否跳转到登录页
                if (pIsRedirect == true)
                {
                    HttpContext.Current.Response.Redirect("~/LoginPage/Index?BackUrl=" + pBackUrl);
                    return "";
                }

                return "CPAUL_02";  //用户名或登录密码错误
            }

            //Http请求 检测 管理用户登录是否正确
            string _jsonBack = httpChkAdminUserLogin(Convert.ToInt64(_userLoginDic["AdUserID"].ToString()), _userLoginDic["AdUserPwdSHA1"].ToString(), pEnterPagePathCurrent);

            //解析Json字符串
            JObject _jObj = (JObject)JsonConvert.DeserializeObject(_jsonBack);
            //登录成功 
            if (_jObj["Code"].ToString().Trim() == "CAUL_01")
            {
                return "CPAUL_01";  //登录正常成功
            }
            else
            {
                //是否跳转到登录页
                if (pIsRedirect == true)
                {
                    //你无权限进入，请联系超级管理员
                    if (_jObj["ErrCode"].ToString().Trim() == "CAUL_06")
                    {
                        //显示无权进入的HTML代码
                        return xhtmlNoPowerVisitContent();
                    }
                    else
                    {
                        HttpContext.Current.Response.Redirect("~/LoginPage/Index?BackUrl=" + pBackUrl);
                    }
                    return "";
                }

                if (_jObj["ErrCode"].ToString().Trim() == "CAUL_04")
                {
                    return "CPAUL_02";  //用户名或登录密码错误
                }
                if (_jObj["ErrCode"].ToString().Trim() == "CAUL_04")
                {
                    return "CPAUL_04"; //用户名已被锁定
                }
                if (_jObj["ErrCode"].ToString().Trim() == "CAUL_06")
                {
                    return "CPAUL_06";  //你无权限进入，请联系超级管理员
                }

                //错误则清除登录Cookide
                clearLoginCookie();
            }
            return "";
        }

        /// <summary>
        /// Http请求 检测 管理用户登录是否正确
        /// </summary>
        /// <param name="pAdUserID">管理用户ID</param>
        /// <param name="pAdUserPwdSHA1">登录密码(SHA1 加密)</param>
        /// <param name="pEnterPagePathCurrent">当前进入的页面路径,如果是多个页，可以用^连接 [ TradingPage/OrderMsg^TradingPage/OrderMsg ]</param>
        /// <returns></returns>
        public static string httpChkAdminUserLogin(long pAdUserID, string pAdUserPwdSHA1, string pEnterPagePathCurrent = "")
        {
            if (pAdUserID <= 0 || string.IsNullOrWhiteSpace(pAdUserPwdSHA1))
            {
                return "";
            }

            //构造POST参数
            IDictionary<string, string> _dic = new Dictionary<string, string>();
            _dic.Add("AdUserID", pAdUserID.ToString());
            _dic.Add("AdUserName", "");
            _dic.Add("AdUserPwdSHA1", pAdUserPwdSHA1);
            _dic.Add("EnterPagePathCurrent", pEnterPagePathCurrent);

            //正式发送Http请求
            string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_AdminUserMsg, "ASAC_AdminUserMsg", "5", _dic);
            return _jsonBack;

            ////解析Json字符串
            //JObject _jObj = (JObject)JsonConvert.DeserializeObject(_jsonBack);
            ////登录成功 
            //if (_jObj["Code"].ToString().Trim() == "CAUL_01")
            //{

            //}
            //else
            //{

            //    if (_jObj["ErrCode"].ToString().Trim() == "CAUL_04")
            //    {
            //        return "HCAUL_02";  //用户名或登录密码错误
            //    }
            //    if (_jObj["ErrCode"].ToString().Trim() == "CAUL_04")
            //    {
            //        return "HCAUL_04"; //用户名已被锁定
            //    }

            //    if (_jObj["ErrCode"].ToString().Trim() == "CAUL_06")
            //    {
            //        return "HCAUL_06";  //你无权限进入，请联系超级管理员
            //    }
            //}
            //return "";

        }

        /// <summary>
        /// 设置管理用户登录Cookie信息 
        /// </summary>
        /// <param name="pAdUserID">管理用户UserID</param>
        /// <param name="pAdUserPwdSHA1">用户登录密码 SHA1加密的</param>
        /// <param name="pAdUserType">管理用户类别 ( Admin 超级管理员，System 系统管理员，User 普通管理员 )</param>
        /// <returns></returns>
        public static bool setLoginCookie(long pAdUserID, string pAdUserPwdSHA1, string pAdUserType)
        {
            //管理用户UserID ^ 用户登录密码 SHA1加密的 ^ 管理用户类别
            string _loginCookieMsg = pAdUserID + "^" + pAdUserPwdSHA1 + "^" + pAdUserType;
            //加密存储
            PublicClass.setCookieValueRSAEncrypt("OctUserLoginCookie", _loginCookieMsg);

            return true;
        }

        /// <summary>
        /// 得到管理用户登录Cookie信息
        /// </summary>
        /// <returns></returns>
        public static string getLoginCookie()
        {
            //管理用户UserID ^ 用户登录密码 SHA1加密的 ^ 管理用户类别
            string _loginCookie = PublicClass.getCookieValueRSADecrypt("OctUserLoginCookie");
            return _loginCookie;
        }

        /// <summary>
        /// 得到 登录后的管理用户信息 返回 Dictionary
        /// </summary>
        /// <returns></returns>
        public static Dictionary<string, object> getLoginCookieDic()
        {
            Dictionary<string, object> _dic = new Dictionary<string, object>();

            //得到管理用户登录Cookie信息
            string _loginCookie = getLoginCookie();
            if (string.IsNullOrWhiteSpace(_loginCookie))
            {
                return null;
            }

            string[] _loginCookieArr = PublicClass.splitStringJoinChar(_loginCookie);

            try
            {
                _dic["AdUserID"] = _loginCookieArr[0];
                _dic["AdUserPwdSHA1"] = _loginCookieArr[1];
                _dic["AdUserType"] = _loginCookieArr[2];
            }
            catch
            {
                return null;
            }


            return _dic;
        }

        /// <summary>
        /// 从LoginCookie中得到登录用户的 AdUserID
        /// </summary>
        /// <returns></returns>
        public static string getAdUserIDLoginCookie()
        {
            string _adUserIDCookie = PublicClass.getCookieValueRSADecrypt("OctUserLoginCookie");
            if (string.IsNullOrWhiteSpace(_adUserIDCookie))
            {
                return "";
            }

            //分解登录Cookie信息 管理用户UserID ^ 用户登录密码 SHA1加密的 ^ 管理用户类别
            string[] _loginCookieArr = PublicClass.splitStringJoinChar(_adUserIDCookie);
            return _loginCookieArr[0];

        }

        /// <summary>
        /// 清除用户登录Cookie
        /// </summary>
        /// <returns></returns>
        public static bool clearLoginCookie()
        {

            PublicClass.clearCookieValue("OctUserLoginCookie");
            return true;
        }

        #endregion

        #region【用户权限】

        /// <summary>
        /// 得到登录用户-管理用户类别 ( Admin 超级管理员，System 系统管理员，User 普通管理员 )
        /// </summary>
        /// <returns>Admin 超级管理员，System 系统管理员，User 普通管理员</returns>
        public static string getLoginUserAdUserType()
        {
            string _adUserIDCookie = PublicClass.getCookieValueRSADecrypt("OctUserLoginCookie");
            if (string.IsNullOrWhiteSpace(_adUserIDCookie))
            {
                return "";
            }

            //分解登录Cookie信息 管理用户UserID ^ 用户登录密码 SHA1加密的 ^ 管理用户类别
            string[] _loginCookieArr = PublicClass.splitStringJoinChar(_adUserIDCookie);
            return _loginCookieArr[2];
        }

        /// <summary>
        /// 无权限访问的显示 提示XHTML内容 
        /// </summary>
        /// <returns></returns>
        public static string xhtmlNoPowerVisitContent()
        {
            string _contentXhtml = "<div style=\"text-align:center;margin: 0 auto;margin-top: 230px;font-size: 22px;font-weight:bold;border-radius: 10px;width: 500px;\"><img src=\"../Assets/Imgs/Icon/wraning.png\" style=\"width:150px; height:150px; margin-bottom: 20px;\" /><br>你无权限访问,请联系超级管理员！</div>";

            return _contentXhtml;
        }

        #endregion



    }
}