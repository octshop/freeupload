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
/// 【系统】相关Ajax请求控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.AjaxPage
{
    public class SysController : Controller
    {
        /// <summary>
        /// 系统首页
        /// </summary>
        /// <returns></returns>
        public string Index()
        {
            //判断登录是否正确，并获取登录的UserID
            string _loginUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 统计总数-各种数据 Type=2 得到平台与商家的通知信息，一般是审核中 Type=3 统计订单的相关数据 Type=4 统计售后和投诉信息 Type=5 统计各种消息通知 Type=6 重设与更改用户登录密码 
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_Index, "T_Index", "1", _dic);
                return _json;
            }
            else if (_exeType == "2") //得到平台与商家的通知信息，一般是审核中
            {
                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_Index, "T_Index", "3", _dic);
                return _json;
            }
            else if (_exeType == "3") //统计订单的相关数据
            {
                //获取传递的参数
                string IsTodayCount = PublicClass.FilterRequestTrim("IsTodayCount");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);
                _dic.Add("IsTodayCount", IsTodayCount);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_Index, "T_Index", "4", _dic);
                return _json;
            }
            else if (_exeType == "4") //统计售后和投诉信息
            {
                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_Index, "ASAC_Index", "1", _dic);
                return _json;
            }
            else if (_exeType == "5") //统计各种消息通知
            {
                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_Index, "ASAC_Index", "2", _dic);
                return _json;

            }
            else if (_exeType == "6") //重设与更改用户登录密码
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
                        BusiLogin.clearLoginCookie();
                    }
                }

                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 数据统计
        /// </summary>
        /// <returns></returns>
        public string DataCount()
        {
            //判断登录是否正确，并获取登录的UserID
            string _loginUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 统计优惠券各种总数
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_Index, "T_Index", "5", _dic);
                return _json;
            }

            return "";
        }


    }
}