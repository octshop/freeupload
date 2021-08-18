using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【会员系统】相关页面Controller
/// </summary>
namespace OctWapWeb.PageControllers.WebPage
{
    public class VipController : Controller
    {
        /// <summary>
        /// 会员系统首页 余额，虎点
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Vip/Index")))
            {
                return Content("用户登录错误！");
            }

            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            return View();
        }

        /// <summary>
        /// 余额积分 账户和分润的
        /// </summary>
        /// <returns></returns>
        public ActionResult BalanceIntegral()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Vip/BalanceIntegral")))
            {
                return Content("用户登录错误！");
            }


            return View();
        }

        /// <summary>
        /// 会员等级
        /// </summary>
        /// <returns></returns>
        public ActionResult VipLevel()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Vip/VipLevel")))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        /// <summary>
        /// 账户余额明细
        /// </summary>
        /// <returns></returns>
        public ActionResult BalanceDetail()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Vip/BalanceDetail")))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        /// <summary>
        /// 分润-账户余额明细
        /// </summary>
        /// <returns></returns>
        public ActionResult DividendBalanceDetail()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Vip/DividendBalanceDetail")))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        /// <summary>
        /// 账户积分明细
        /// </summary>
        /// <returns></returns>
        public ActionResult IntegralDetail()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Vip/IntegralDetail")))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        /// <summary>
        /// 分润-账户积分明细
        /// </summary>
        /// <returns></returns>
        public ActionResult DividendIntegralDetail()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Vip/DividendIntegralDetail")))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        /// <summary>
        /// 收支详情 - 余额与积分
        /// </summary>
        /// <returns></returns>
        public ActionResult InExDetail()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Vip/InExDetail")))
            {
                return Content("用户登录错误！");
            }

            //获取传递的参数
            ViewBag.InExMsgID = PublicClass.FilterRequestTrim("IEID");
            ViewBag.IntegralID = PublicClass.FilterRequestTrim("INID");

            return View();
        }

        /// <summary>
        /// 分润收支详情 - 余额与积分
        /// </summary>
        /// <returns></returns>
        public ActionResult DividendInExDetail()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Vip/DividendInExDetail")))
            {
                return Content("用户登录错误！");
            }

            //获取传递的参数
            ViewBag.InExMsgID = PublicClass.FilterRequestTrim("IEID");
            ViewBag.IntegralID = PublicClass.FilterRequestTrim("INID");

            return View();
        }

        /// <summary>
        /// 在线充值 
        /// </summary>
        /// <returns></returns>
        public ActionResult OnLineTopUp()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Vip/OnLineTopUp")))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        #region【用户提现】

        /// <summary>
        /// 选择提现方式
        /// </summary>
        /// <returns></returns>
        public ActionResult WithdrawType()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Vip/WithdrawType")))
            {
                return Content("用户登录错误！");
            }


            //获取账户微信注册信息，如果没有则不能微信提现
            try
            {
                ViewBag.ToTypeWeChatStyleDisplay = "none";
                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("UserID", BusiLogin.getLoginUserID());
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_UserAccount, "ApiUrl_UGS_UserAccount", "10", _dicPost);
                JObject _jObj = (JObject)JsonConvert.DeserializeObject(_jsonBack);
                if (string.IsNullOrWhiteSpace(_jObj["WxOpenID"].ToString()))
                {
                    ViewBag.ToTypeWeChatStyleDisplay = "none";
                }
                else
                {
                    ViewBag.ToTypeWeChatStyleDisplay = "normal";
                }
            }
            catch
            {
                ViewBag.ToTypeWeChatStyleDisplay = "none";
            };



            return View();
        }

        /// <summary>
        /// 立即提现
        /// </summary>
        /// <returns></returns>
        public ActionResult WithdrawSubmit()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Vip/WithdrawSubmit")))
            {
                return Content("用户登录错误！");
            }

            //判断是否为微信扫码进入 --微信中
            ViewBag.IsInWeiXinBrowse = "false";
            if (PublicClass.isInWeiXinBrowse() == true)
            {
                ViewBag.IsInWeiXinBrowse = "true";
            }


            //获取传递的参数
            ViewBag.ToType = PublicClass.FilterRequestTrim("ToType");


            return View();
        }

        /// <summary>
        /// 提现详情
        /// </summary>
        /// <returns></returns>
        public ActionResult WithdrawDetail()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Vip/WithdrawDetail")))
            {
                return Content("用户登录错误！");
            }

            //获取传递的参数
            ViewBag.WDID = PublicClass.FilterRequestTrim("WDID");


            return View();
        }

        #endregion

        #region【扫码支付订单】

        /// <summary>
        /// 扫码支付订单
        /// </summary>
        /// <returns></returns>
        public ActionResult AggreOrder()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Vip/AggreOrder")))
            {
                return Content("用户登录错误！");
            }

            return View();
        }


        #endregion

    }

}