using BusiApiHttpNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【店铺】相关Ajax请求控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.AjaxPage
{
    public class SettleController : Controller
    {

        /// <summary>
        /// 商家结算资料
        /// </summary>
        /// <returns></returns>
        public string SettleShopMsg()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 提交商家结算资料 Type=2 初始化商家结算资料
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string SettleShopMsgID = PublicClass.FilterRequestTrim("SettleShopMsgID");
                string CompanyName = PublicClass.FilterRequestTrim("CompanyName");
                string CompanyAddr = PublicClass.FilterRequestTrim("CompanyAddr");
                string CompanyTel = PublicClass.FilterRequestTrim("CompanyTel");
                string CertificateID = PublicClass.FilterRequestTrim("CertificateID");
                string CertificateImg = PublicClass.FilterRequestTrimNoConvert("CertificateImg");
                string LegalPerson = PublicClass.FilterRequestTrim("LegalPerson");
                string LinkMan = PublicClass.FilterRequestTrim("LinkMan");
                string MobileNumber = PublicClass.FilterRequestTrim("MobileNumber");
                string Email = PublicClass.FilterRequestTrim("Email");
                string Department = PublicClass.FilterRequestTrim("Department");
                string BankAccount = PublicClass.FilterRequestTrim("BankAccount");
                string BankAccName = PublicClass.FilterRequestTrim("BankAccName");
                string OpeningBank = PublicClass.FilterRequestTrim("OpeningBank");
                string RegionCodeArr = PublicClass.FilterRequestTrim("RegionCodeArr");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);
                _dic.Add("SettleShopMsgID", SettleShopMsgID);
                _dic.Add("CompanyName", CompanyName);
                _dic.Add("CompanyAddr", CompanyAddr);
                _dic.Add("CompanyTel", CompanyTel);
                _dic.Add("CertificateID", CertificateID);
                _dic.Add("CertificateImg", CertificateImg);
                _dic.Add("LegalPerson", LegalPerson);
                _dic.Add("LinkMan", LinkMan);
                _dic.Add("MobileNumber", MobileNumber);
                _dic.Add("Email", Email);
                _dic.Add("Department", Department);
                _dic.Add("BankAccount", BankAccount);
                _dic.Add("BankAccName", BankAccName);
                _dic.Add("OpeningBank", OpeningBank);
                _dic.Add("RegionCodeArr", RegionCodeArr);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_SettleShopMsg, "T_SettleShopMsg", "1", _dic);
                return _json;
            }
            else if (_exeType == "2") //初始化商家结算资料
            {
                //获取传递的参数

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_SettleShopMsg, "T_SettleShopMsg", "2", _dic);
                return _json;
            }


            return "";
        }

        /// <summary>
        /// 商家申请结算
        /// </summary>
        /// <returns></returns>
        public string SettleApply()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return "";
            }

            //获取操作类型  Type=1  统计商家各种结算余额和金额 Type=2 商家提交结算申请 Type=3 申请结算信息-搜索分页数据 Type=4 数据搜索分页-可结算商城订单 Type=5 数据搜索分页-可结算聚合支付订单
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_SettleApply, "T_SettleApply", "2", _dic);
                return _json;
            }
            else if (_exeType == "2") //商家提交结算申请
            {
                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_SettleApply, "T_SettleApply", "5", _dic);
                return _json;
            }
            else if (_exeType == "3") //申请结算信息-搜索分页数据
            {
                // 获取传递的参数
                //string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //---当前页----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);
                _dic.Add("PageCurrent", PageCurrent);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_SettleApply, "T_SettleApply", "1", _dic);
                return _json;

            }
            else if (_exeType == "4") //数据搜索分页-可结算商城订单
            {
                //---当前页----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);
                _dic.Add("PageCurrent", PageCurrent);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_SettleApply, "T_SettleApply", "3", _dic);
                return _json;
            }
            else if (_exeType == "5") //数据搜索分页-可结算聚合支付订单
            {
                //---当前页----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);
                _dic.Add("PageCurrent", PageCurrent);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_SettleApply, "T_SettleApply", "4", _dic);
                return _json;
            }

            return "";
        }

        /// <summary>
        /// 商家余额收支记录
        /// </summary>
        /// <returns></returns>
        public string ShopIncomeExpense()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 搜索数据分页
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string InExType = PublicClass.FilterRequestTrim("InExType");
                string WriteDateStart = PublicClass.FilterRequestTrim("WriteDateStart");
                string WriteDateEnd = PublicClass.FilterRequestTrim("WriteDateEnd");

                string WriteDateEndWap = PublicClass.FilterRequestTrim("WriteDateEndWap");

                if (string.IsNullOrWhiteSpace(WriteDateEndWap) == false)
                {
                    WriteDateEnd = Convert.ToDateTime(WriteDateEndWap).AddDays(1).ToShortDateString();
                }


                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("InExType", InExType);
                _dic.Add("WriteDateStart", WriteDateStart);
                _dic.Add("WriteDateEnd", WriteDateEnd);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_ShopIncomeExpense, "T_ShopIncomeExpense", "1", _dic);
                return _json;
            }

            return "";
        }

        /// <summary>
        /// 结算单详情
        /// </summary>
        /// <returns></returns>
        public string SettleDetail()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 商城结算订单-搜索分页数据 Type=2 聚合支付结算订单信息-搜索分页数据 Type=3 初始化商家结算申请信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string SettleID = PublicClass.FilterRequestTrim("SettleID");

                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string FinishTime = PublicClass.FilterRequestTrim("FinishTime");

                //---当前页----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);
                _dic.Add("PageCurrent", PageCurrent);
                _dic.Add("SettleID", SettleID);
                _dic.Add("OrderID", OrderID);
                _dic.Add("FinishTime", FinishTime);



                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_SettleOrderMsg, "T_SettleOrderMsg", "1", _dic);
                return _json;
            }
            else if (_exeType == "2") //聚合支付结算订单信息-搜索分页数据
            {
                // 获取传递的参数
                string SettleID = PublicClass.FilterRequestTrim("SettleID");

                string AggregateOrderID = PublicClass.FilterRequestTrim("AggregateOrderID");
                string PayTime = PublicClass.FilterRequestTrim("PayTime");


                //---当前页----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);
                _dic.Add("PageCurrent", PageCurrent);
                _dic.Add("SettleID", SettleID);
                _dic.Add("AggregateOrderID", AggregateOrderID);
                _dic.Add("PayTime", PayTime);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_SettleAggregateOrderMsg, "T_SettleAggregateOrderMsg", "1", _dic);
                return _json;
            }
            else if (_exeType == "3") //初始化商家结算申请信息
            {
                //获取传递的参数
                string SettleID = PublicClass.FilterRequestTrim("SettleID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);
                _dic.Add("SettleID", SettleID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_SettleApply, "T_SettleApply", "6", _dic);
                return _json;
            }
            return "";
        }

    }
}