using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【登录】相关Ajax控制器
/// </summary>
namespace OctWapWeb.PageControllers.AjaxPage
{
    public class LoginAjaxController : Controller
    {
        // GET: LoginAjax
        public ActionResult Index()
        {
            return View();
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

                if (PublicClass.isValidMobile(ToMobileNumber) == false)
                {
                    return "";
                }

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("ToMobileNumber", ToMobileNumber);
                _dicPost.Add("SmsVerifyCode", SmsVerifyCode);

                //发送Http请求
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_RegUserAccount, "UGS_RegUserAccount", "3", _dicPost);
                //判断登录成功
                JObject _jObj = (JObject)JsonConvert.DeserializeObject(_jsonBack);
                if (string.IsNullOrWhiteSpace(_jObj["Msg"].ToString()) == false)
                {
                    if (_jObj["Msg"].ToString().IndexOf("成功") >= 0)
                    {
                        //登录成功，写入登录Cookie信息
                        BusiLogin.setLoginCookie(_jObj["DataDic"]["RegUserID"].ToString().Trim(), _jObj["DataDic"]["LoginKey"].ToString().Trim());
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

    }
}