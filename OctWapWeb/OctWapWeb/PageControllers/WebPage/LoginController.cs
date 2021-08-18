using EncryptionClassNS;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【会员登录】相关页面Controller
/// </summary>
namespace OctWapWeb.PageControllers.WebPage
{
    public class LoginController : Controller
    {
        // GET: Login
        public ActionResult Index()
        {
            BusiLogin.clearLoginCookie();

            return View();
        }

        /// <summary>
        /// 买家登录
        /// </summary>
        /// <returns></returns>
        public ActionResult Buyer()
        {


            //=======测试用的=====//
            //return View();

            ////设置登录用户的Cookie信息-- - 用于测试
            //BusiLogin.setLoginCookie("10002", "111111");

            //获取返回的URL
            ViewBag.BackUrl = PublicClassNS.PublicClass.FilterRequestTrim("BackUrl");
            if (string.IsNullOrWhiteSpace(ViewBag.BackUrl) == false)
            {
                PublicClass.setCookieValue("BackUrlLoginCookie", ViewBag.BackUrl);
            }

            //买家分享商品返佣KeyEn
            ViewBag.KeyEn = PublicClassNS.PublicClass.FilterRequestTrim("KeyEn");


            //---判断用户是否已经登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.getLoginUserID()) == false)
            {
                if (string.IsNullOrWhiteSpace(ViewBag.BackUrl) == false)
                {
                    //返回的URL
                    Response.Redirect(ViewBag.BackUrl);
                }
                else
                {
                    Response.Redirect("~/Buyer/Index");
                }
                return null;
            }

            //-----判断是否为退出登录------//
            ViewBag.ExitLogin = PublicClass.FilterRequestTrim("ExitLogin");
            if (ViewBag.ExitLogin == "true")
            {
                //如果为退出登录，则不进行微信自动登录
                return View();
            }

            //当前域名地址 http://192.168.3.10:1000
            string _HostAddrUri = Request.Url.AbsoluteUri.ToString().Trim().Substring(0, Request.Url.AbsoluteUri.ToString().Trim().IndexOf("/Login/Buyer"));

            #region【处理微信自动注册 登录，在微信浏览器内访问时】

            //判断是否为微信扫码进入 --微信中
            if (PublicClass.isInWeiXinBrowse() == true && WebAppConfig.Wx_OfficialAccType == "fw")
            {
                try
                {

                    //1)-----获取微信用户信息 跳转到获取页
                    string WxUserInfoJson = ""; //微信用户信息Json字符串

                    //获取返回的用户信息
                    string WxUserInfoBase64 = PublicClass.FilterRequestTrimNoConvert("WxUserInfoBase64").Replace(" ", "+").Replace("2%B", "+");
                    if (string.IsNullOrWhiteSpace(WxUserInfoBase64) == false)
                    {
                        WxUserInfoJson = EncryptionClass.DecodeBase64("UTF-8", WxUserInfoBase64);
                        //{
                        //  "OpenID": "o9rMh6IJIU_hRBCvLgrdDHYn6k5w",
                        // "UnionID": "",
                        // "AccessToken": "38_7KOHJ5NusbWR2MyHCxFUp1d-rxiMVYBr__3IjN8tmX9avFsfksumnhEqMTsOHlXw45IsOuLxMfoOXX4OdzgtTw",
                        // "NickName": "IT独孤键客😇",
                        // "HeadImgUrl": "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIJ0LzanNRXez3hSyu9xPVyjBhy4AodBPnsBTqat1TacnsOkLVoDibKMfaic9vECJd5GqO8Ox8X2Cpw/132",
                        // "Sex": "1",
                        // "Province": "Hunan",
                        // "City": "Changsha",
                        // "Country": "CN",
                        // "RedirectCodeUrl": null
                        //}
                        //return Content(WxUserInfoJson);
                    }
                    else //如果为空，则重新跳转到微信地址获取
                    {
                        //1)-----获取微信用户信息 跳转到获取页
                        string _WxGoToURL = WebAppConfig.OctThirdApiCallSystemWeb_ApiDomain + "/WeiXin/GetWeiXinUserInfoMsg?BackGoURL=" + _HostAddrUri + "/Login/Buyer";
                        Response.Redirect(_WxGoToURL);
                        return Content(_WxGoToURL);
                    }

                    //2）------验证微信用户信息,不为空则自动登录-------
                    if (string.IsNullOrWhiteSpace(WxUserInfoJson) == false)
                    {
                        JObject _jObjWx = (JObject)JsonConvert.DeserializeObject(WxUserInfoJson);

                        //-------得到店铺主推荐新注册用户的Cookie值中 ShopUserID,没有则不写入--------//
                        long _buyerUserIDPromoteFather = BusiWebCookie.getShopUserIDFromPromoteBuyerCookie();

                        //----处理微信自动注册并登录----//
                        string _jsonBack = BusiBuyer.httpWxAutoLoginAndRegUserAccount(_jObjWx["OpenID"].ToString().Trim(), _jObjWx["NickName"].ToString().Trim(), _jObjWx["HeadImgUrl"].ToString().Trim(), _jObjWx["Sex"].ToString().Trim(), _jObjWx["UnionID"].ToString().Trim(), _buyerUserIDPromoteFather);
                        //解析返回的Json字符串
                        JObject _jObjBack = (JObject)JsonConvert.DeserializeObject(_jsonBack);
                        if (_jObjBack["Code"].ToString().Trim() == "AWAUA_01" || _jObjBack["ErrCode"].ToString().Trim() == "WALARUA_04")
                        {
                            //先清除登录Cookie信息
                            BusiLogin.clearLoginCookie();

                            //设置新注册用户登录Cookie
                            BusiLogin.setLoginCookie(_jObjBack["DataDic"]["RegUserID"].ToString(), _jObjBack["DataDic"]["LPSha1"].ToString());
                        }
                        //返回跳转地址的URL
                        string BackUrlLoginCookie = PublicClass.getCookieValue("BackUrlLoginCookie");
                        if (string.IsNullOrWhiteSpace(BackUrlLoginCookie) == false)
                        {
                            Response.Redirect(BackUrlLoginCookie);
                        }
                        else
                        {
                            Response.Redirect("~/Buyer/Index");
                        }

                        return null;
                    }
                }
                catch (Exception e)
                {
                    return View();
                }

            }

            #endregion




            return View();
        }

        /// <summary>
        /// 绑定手机
        /// </summary>
        /// <returns></returns>
        public ActionResult BindMobile()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Login/BindMobile")))
            {
                return Content("用户登录错误！");
            }

            return View();
        }


    }
}