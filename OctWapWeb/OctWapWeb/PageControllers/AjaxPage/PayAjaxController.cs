using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【支付】相关Ajax控制器
/// </summary>
namespace OctWapWeb.PageControllers.AjaxPage
{
    public class PayAjaxController : Controller
    {
        // GET: PayAjax
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 订单支付 [从订单详情进入]
        /// </summary>
        /// <returns></returns>
        public string OrderPay()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 初始化订单支付信息 Type=2 保存更新订单的收货地址 Type=3 提交保存订单信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("OrderID", OrderID);
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);

                //提交订单信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "5", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //保存更新订单的收货地址
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string BReceiAddrID = PublicClass.FilterRequestTrim("BReceiAddrID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("OrderID", OrderID);
                _dicPost.Add("BReceiAddrID", BReceiAddrID);
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);

                //提交订单信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderDelivery, "T_OrderDelivery", "3", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "3") //提交保存支付订单信息
            {
                //获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string OrderMemo = PublicClass.FilterRequestTrim("OrderMemo");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("OrderID", OrderID);
                _dicPost.Add("OrderMemo", OrderMemo);
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);

                //提交订单信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_PayOrder, "T_PayOrder", "2", _dicPost);
                return _jsonBack;

            }

            return "";

        }

        /// <summary>
        /// 支付成功的跳转页
        /// </summary>
        /// <returns></returns>
        public string PaySuRedirect()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }


            //获取操作类型  Type=1 得到 BillNumber下的所有订单信息-支付成功后
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string BillNumber = PublicClass.FilterRequestTrim("BillNumber");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BillNumber", BillNumber);
                _dicPost.Add("BuyerUserID", _loginBuyerUserID);
                _dicPost.Add("IsPaySuccess", "true");

                //提交订单信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "19", _dicPost);
                return _jsonBack;
            }


            return "";
        }


    }
}