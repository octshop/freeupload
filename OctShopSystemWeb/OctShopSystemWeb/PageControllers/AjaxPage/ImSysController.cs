using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【IM在线客服系统】相关Ajax请求控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.AjaxPage
{
    public class ImSysController : Controller
    {
        /// <summary>
        /// Ajax公共首页
        /// </summary>
        /// <returns></returns>
        public string Index()
        {
            //------判断登录是否正确，并获取登录的UserID------
            string _loginUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 得到商家跳转进入Key参数信息 【KeyEnterMsgRSA】 Type=2 统计商家小红圆点的提示数字 
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //得到登录ShopUserID和登录密码SHA1加密
                string[] _UserIDLoginPwdArr = BusiLogin.getLoginCookieUserIDAndLoginPwdSha1();

                //得到商家跳转进入IM客服系统的URL和Key参数信息 Http传递的参数名【KeyEnterMsgRSA】
                string _jsonBack = BusiIMNS.BusiIM.buildKeyEnterMsgRSAApi(Convert.ToInt64(_UserIDLoginPwdArr[0]), _UserIDLoginPwdArr[1]);
                return _jsonBack;
            }
            else if (_exeType == "2") //统计商家小红圆点的提示数字 
            {
                //构造POST参数
                Dictionary<string, string> _dicPOST = new Dictionary<string, string>();
                _dicPOST.Add("ShopUserID", _loginUserID);

                //正式发送Http请求
                string _jsonBack = BusiIMNS.BusiIM.httpApiImSysPage(WebAppConfig.ApiUrl_IM_DataCount, "1", _dicPOST);
                return _jsonBack;
            }

            return "";

        }
    }
}