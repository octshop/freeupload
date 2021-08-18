using BusiApiHttpNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【短信与验证】相关Ajax请求控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.AjaxPage
{
    public class SmsController : Controller
    {
        /// <summary>
        /// 公共首页Ajax
        /// </summary>
        /// <returns></returns>
        public string Index()
        {
            // 获取操作类型  Type = 1 获取短信验证码
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string ToMobileNumbers = PublicClass.FilterRequestTrim("ToMobileNumbers");
                string SmsType = PublicClass.FilterRequestTrim("SmsType");

                //验证手机号是否正确
                if (PublicClass.isValidMobile(ToMobileNumbers) == false)
                {
                    return "12"; //手机号码错误
                }

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ToMobileNumbers", ToMobileNumbers);
                _dic.Add("SmsType", SmsType);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_TAC_SmsSendMsg, "TAC_SmsSendMsg", "5", _dic);
                return _json;
            }

            return "";
        }
    }
}