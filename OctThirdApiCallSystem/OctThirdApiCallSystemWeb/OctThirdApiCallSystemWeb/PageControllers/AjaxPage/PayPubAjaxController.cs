using OctThirdApiCallSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【页面相关】Ajax请求控制器
/// </summary>
namespace OctThirdApiCallSystemWeb.PageControllers.AjaxPage
{
    public class PayPubAjaxController : Controller
    {
        // GET: PayPubAjax
        public ActionResult Index()
        {
            return View();
        }


        #region【模拟支付】

        /// <summary>
        /// 模拟支付
        /// </summary>
        /// <returns></returns>
        public string SimulatePay()
        {
            //获取传递的参数
            string PayWay = PublicClass.FilterRequestTrim("PayWay");
            string BillNumber = PublicClass.FilterRequestTrim("BillNumber");
            string UserKeyID = PublicClass.FilterRequestTrim("UserKeyID");

            //防止数字为空
            UserKeyID = PublicClass.preventNumberDataIsNull(UserKeyID);

            //模拟支付
            string _jsonBack = BusiPayPublic.simulatePayApi(PayWay, BillNumber, Convert.ToInt64(UserKeyID));

            return _jsonBack;

        }

        #endregion

    }
}