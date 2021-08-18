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
///  【买家登录注册】相关Api控制器
/// </summary>
namespace OctMallMiniWeb.PageControllers.ApiPage
{
    public class LoginApiController : Controller
    {
        /// <summary>
        /// 登录注册首页
        /// </summary>
        /// <returns></returns>
        public string Index()
        {
            // 获取操作类型  Type = 1 AppID(小程序ID) 是否可以获取 用户手机号
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                string _jsonBack = "{\"WxMiniIsGetUserMobile\":\"" + WebAppConfig.WxMiniIsGetUserMobile + "\"}";
                return _jsonBack;
            }

            return "";
        }


        /// <summary>
        /// 买家登录
        /// </summary>
        /// <returns></returns>
        public string Buyer()
        {
            // 获取操作类型  Type = 1 买家手机号登录请求 Type=2 退出买家登录 Type=3 直接登录 OctBindMobileUserCookie Type=4 处理手机号被绑定并且存在第三方注册信息 - 【有微信小程序 OPENDID，没有微信公众号OPENDID 】
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string ToMobileNumber = PublicClass.FilterRequestTrim("ToMobileNumber");
                string SmsVerifyCode = PublicClass.FilterRequestTrim("SmsVerifyCode");

                //获取连接传递的推广者信息 二维码内容  BuyerUserID ^ LoginPwdNoSha1 ^ PromoteUser  RSA加密的
                string PQRCRSA = PublicClass.FilterRequestTrimNoConvert("PQRCRSA");
                PQRCRSA = PQRCRSA.Replace("+", "%2B");
                //RzjCe6X8sqet/CYVj4RJGJ9a40TYxt4gx%2BVCiXwqvJJc0cE02jeH5SuPWmOTc%2Bb%2BG3yenUcLWvruP106YqjOIsj5TAi1RaQqqYGzIYtNJD/6va%2BUgln17o6DNWZ6M2cqjqDFFXvjbUGJqkewYo0N4Ee1Bo0UV037nOlptbO6uko~


                if (PublicClass.isValidMobile(ToMobileNumber) == false)
                {
                    return "";
                }

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("ToMobileNumber", ToMobileNumber);
                _dicPost.Add("SmsVerifyCode", SmsVerifyCode);
                _dicPost.Add("PQRCRSA", PQRCRSA);

                //发送Http请求
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_RegUserAccount, "UGS_RegUserAccount", "3", _dicPost);
                //判断登录成功
                JObject _jObj = (JObject)JsonConvert.DeserializeObject(_jsonBack);
                if (string.IsNullOrWhiteSpace(_jObj["Msg"].ToString()) == false)
                {
                    if (_jObj["Msg"].ToString().IndexOf("成功") >= 0)
                    {
                        //登录成功，写入登录Cookie信息
                        //BusiLogin.setLoginCookie(_jObj["DataDic"]["RegUserID"].ToString().Trim(), _jObj["DataDic"]["LoginKey"].ToString().Trim());
                    }
                }
                return _jsonBack;

            }
            else if (_exeType == "2") //退出买家登录
            {
                //清除登录
                BusiLogin.clearLoginCookie();
                return "21";
            }
            else if (_exeType == "3") //直接登录 OctBindMobileUserCookie
            {
                //获取传递的参数  
                //登录的Cookie值，已经RSA加密，注意OctWapWeb和OctUserGoodsShopSystemWeb的公钥密钥必须保持一致
                string OctBindMobileUserCookie = PublicClass.FilterRequestTrimNoConvert("OctBindMobileUserCookie");

                //先清除登录Cookie
                BusiLogin.clearLoginCookie();

                //设置登录Cookie值
                PublicClass.setCookieValue("OctUserLoginCookie", OctBindMobileUserCookie, 1000);

                return "31"; //登录成功
            }
            else if (_exeType == "4") //处理手机号被绑定并且存在第三方注册信息 - 【有微信小程序 OPENDID，没有微信公众号OPENDID 】
            {
                //获取传递参数
                string LoginUserID = PublicClass.FilterRequestTrim("LoginUserID");
                string BindMobile = PublicClass.FilterRequestTrim("BindMobile");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("LoginUserID", LoginUserID);
                _dicPost.Add("BindMobile", BindMobile);

                //发送Http请求
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_RegUserAccount, "UGS_RegUserAccount", "10", _dicPost);
                return _jsonBack;
            }

            return "";
        }



        /// <summary>
        /// 小程序-用户注册登录
        /// </summary>
        /// <returns></returns>
        public string MiniLoginRegUserAccount()
        {
            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }

            //获取操作类型  Type=1 小程序注册或登录用户信息 Type=2 绑定与更新-小程序微信用户信息 Type=3 判断是否存在绑定的微信用户信息 Type=4 http 远程验证用户登录是否正确
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string BindMobile = PublicClass.FilterRequestTrim("BindMobile");

                //获取连接传递的推广者信息 二维码内容  BuyerUserID ^ LoginPwdNoSha1 ^ PromoteUser  RSA加密的
                string PQRCRSA = PublicClass.FilterRequestTrimNoConvert("PQRCRSA");
                PQRCRSA = PQRCRSA.Replace("+", "%2B");
                //RzjCe6X8sqet/CYVj4RJGJ9a40TYxt4gx%2BVCiXwqvJJc0cE02jeH5SuPWmOTc%2Bb%2BG3yenUcLWvruP106YqjOIsj5TAi1RaQqqYGzIYtNJD/6va%2BUgln17o6DNWZ6M2cqjqDFFXvjbUGJqkewYo0N4Ee1Bo0UV037nOlptbO6uko~

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BindMobile", BindMobile);
                _dicPost.Add("PQRCRSA", PQRCRSA);

                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_MiniLoginRegUserAccount, "UGS_MiniLoginRegUserAccount", "1", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //绑定与更新-小程序微信用户信息
            {
                //获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string MiniOpenID = PublicClass.FilterRequestTrimNoConvert("MiniOpenID");
                string NickName = PublicClass.FilterRequestTrim("NickName");
                string HeadImgUrl = PublicClass.FilterRequestTrimNoConvert("HeadImgUrl");
                string Sex = PublicClass.FilterRequestTrim("Sex");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("UserID", UserID);
                _dicPost.Add("MiniOpenID", MiniOpenID);
                _dicPost.Add("NickName", NickName);
                _dicPost.Add("HeadImgUrl", HeadImgUrl);
                _dicPost.Add("Sex", Sex);

                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_MiniLoginRegUserAccount, "UGS_MiniLoginRegUserAccount", "2", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "3") //判断是否存在绑定的微信用户信息
            {
                //获取传递的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", BuyerUserID);


                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_MiniLoginRegUserAccount, "UGS_MiniLoginRegUserAccount", "3", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "4") //http 远程验证用户登录是否正确
            {
                //获取传递的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string LoginPwdSha1 = PublicClass.FilterRequestTrim("LoginPwdSha1");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", BuyerUserID);
                _dicPost.Add("LoginPwdSha1", LoginPwdSha1);

                //发送验证买家登录UserID和登录密码是否正确 登录密码没有SHA1
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_CheckUserAccount, "CheckUserAccount", "1", _dicPost, true, BuyerUserID, LoginPwdSha1);
                return _jsonBack;
            }


            return "";
        }


    }
}