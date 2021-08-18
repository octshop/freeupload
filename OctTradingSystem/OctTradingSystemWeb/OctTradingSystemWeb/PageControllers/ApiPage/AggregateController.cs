using BusiApiKeyVerifyNS;
using OctTradingSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【聚合支付】相关的API接口控制器
/// </summary>
namespace OctTradingSystemWeb.PageControllers.ApiPage
{
    public class AggregateController : Controller
    {
        #region【----公共变量(锁死线程)----】

        //是否执行 防止重复提交
        public static bool mIsNoRepeatExe = true;
        //锁对象,锁死线程
        private static object mLockImport = new object();

        #endregion

        /// <summary>
        /// 聚合支付订单信息
        /// </summary>
        /// <returns></returns>
        public string AggregateOrderMsg()
        {
          

            return "";
        }

    }
}