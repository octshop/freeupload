using HttpServiceNS;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【聚合支付】相关Ajax控制器
/// </summary>
namespace OctWapWeb.PageControllers.AjaxPage
{
    public class AggregateAjaxController : Controller
    {

        /// <summary>
        /// 聚合扫码支付-首页
        /// </summary>
        /// <returns></returns>
        public string Index()
        {
            return "";
        }

        /// <summary>
        /// 直接支付
        /// </summary>
        /// <returns></returns>
        public string PayDirect()
        {

            return "";
        }

        /// <summary>
        /// 余额支付
        /// </summary>
        /// <returns></returns>
        public string PayBalance()
        {

            return "";
        }


    }
}