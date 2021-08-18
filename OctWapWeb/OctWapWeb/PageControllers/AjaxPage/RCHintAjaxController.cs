using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


/// <summary>
/// 【各项小红点提示数】相关Ajax控制器
/// </summary>
namespace OctWapWeb.PageControllers.AjaxPage
{
    public class RCHintAjaxController : Controller
    {
        /// <summary>
        /// 各项小红点提示数
        /// </summary>
        /// <returns></returns>
        public string CountData()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 统计买家中心首页 各项小红点提示数
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                //_dicPost.Add("Type", "1");
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);

                //保存买家收货地址
                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_CountData, "ASAC_CountData", "1", _dicPost);
                return _backJson;
            }


            return "";
        }


    }
}