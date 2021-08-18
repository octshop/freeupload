using BusiApiHttpNS;
using HttpServiceNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【手机Web移动端】相关Ajax请求控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.AjaxPage
{
    public class WapController : Controller
    {


        /// <summary>
        /// 手机Web首页
        /// </summary>
        /// <returns></returns>
        public string Index()
        {
            //-------判断登录是否正确，并获取登录的UserID-------//
            string _loginUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 初始化店铺状态信息 Type=2 统计商家移动端各项数据-交易系统 Type=3 统计商家移动端 小红点数字-售后系统
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);

                //发送异步请求
                string _json = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopMsg, "UGS_ShopMsg", "20", _dic);
                return _json;
            }
            else if (_exeType == "2") //统计商家移动端各项数据
            {
                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_Index, "T_Index", "6", _dic);
                return _json;
            }
            else if (_exeType == "3") //统计商家移动端 小红点数字-售后系统
            {
                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_Index, "ASAC_Index", "3", _dic);
                return _json;
            }



            return "";
        }

        /// <summary>
        /// 店铺详情信息
        /// </summary>
        /// <returns></returns>
        public string ShopDetail()
        {

            //-------判断登录是否正确，并获取登录的UserID-------//
            string _loginUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return "";
            }


            //获取操作类型  Type=1  加载店铺详细信息 ,店铺信息详细页 Type=2 加载店铺Logo门头照片
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "18");
                _dicPost.Add("ShopID", ShopID);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_ShopMsg, _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //加载店铺Logo门头照片
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "3");
                _dicPost.Add("ShopID", ShopID);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_ShopLogoImg, _dicPost);
                return _jsonBack;
            }



            return "";
        }

        /// <summary>
        /// 订单管理 
        /// </summary>
        /// <returns></returns>
        public string MyOrder()
        {
            //-------判断登录是否正确，并获取登录的UserID-------//
            string _loginUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return "";
            }

            //获取操作类型  Type=1  全部订单数据分页
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string OrderStatus = PublicClass.FilterRequestTrim("OrderStatus");
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");
                //搜索关键字
                string SearchKey = PublicClass.FilterRequestTrim("SearchKey");

                //配送方式（送货上门 express  到店消费自取 shop） 
                string ExpressType = PublicClass.FilterRequestTrim("ExpressType");
                //支付方式 （WeiXinPay [微信支付], Alipay[支付宝] , Transfer[银行转账] , Offline[线下付款(到店付)], PayDelivery [货到付款]  Balance[余额支付]）
                string PayWay = PublicClass.FilterRequestTrim("PayWay");

                string IsLoadFieldName = PublicClass.FilterRequestTrim("IsLoadFieldName");

                //是否只加载拼团订单
                string GroupID = PublicClass.FilterRequestTrim("GroupID");


                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("ShopUserID", _loginUserID);
                _dicPost.Add("PageCurrent", PageCurrent);
                _dicPost.Add("OrderStatus", OrderStatus);
                _dicPost.Add("ExpressType", ExpressType);
                _dicPost.Add("PayWay", PayWay);
                _dicPost.Add("IsLoadFieldName", IsLoadFieldName);
                _dicPost.Add("GroupID", GroupID);


                //构造搜索字段
                if (string.IsNullOrWhiteSpace(SearchKey) == false)
                {
                    //判断是否为数字
                    if (PublicClass.IsNumber(SearchKey))
                    {
                        _dicPost.Add("OrderID", SearchKey);
                    }
                    else
                    {
                        _dicPost.Add("GoodsTitleArr", SearchKey);
                    }
                }


                //保存买家收货地址
                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "3", _dicPost);
                return _backJson;
            }

            return "";
        }

        /// <summary>
        /// 订单详情
        /// </summary>
        /// <returns></returns>
        public string OrderDetail()
        {
            //-------判断登录是否正确，并获取登录的UserID-------//
            string _loginUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 初始化订单详情信息 type=2 加载订单第一个商品的简单信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                string OrderID = PublicClass.FilterRequestTrim("OrderID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("OrderID", OrderID);
                _dicPost.Add("ShopUserID", _loginUserID);

                //提交订单信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "4", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //加载订单第一个商品的简单信息
            {
                // 获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("OrderID", OrderID);
                _dicPost.Add("ShopUserID", _loginUserID);

                //发送http请求 
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "26", _dicPost);
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 订单动态
        /// </summary>
        /// <returns></returns>
        public string OrderDynamic()
        {
            //-------判断登录是否正确，并获取登录的UserID-------//
            string _loginUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 初始化订单动态信息 
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                string OrderID = PublicClass.FilterRequestTrim("OrderID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("OrderID", OrderID);
                _dicPost.Add("ShopUserID", _loginUserID);

                //提交订单信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_OrderMsg, "T_OrderMsg", "6", _dicPost);
                return _jsonBack;

            }

            return "";
        }

        /// <summary>
        /// 订单快递 详情页
        /// </summary>
        /// <returns></returns>
        public string ExpressDetail()
        {

            //-------判断登录是否正确，并获取登录的UserID-------//
            string _loginUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 查询快递跟踪信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                string OrderID = PublicClass.FilterRequestTrim("OrderID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("OrderID", OrderID);
                _dicPost.Add("ShopUserID", _loginUserID);

                //提交订单信息
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_ExpressDetail, "T_ExpressDetail", "1", _dicPost);
                return _jsonBack;

            }

            return "";
        }

        /// <summary>
        /// 官方客服
        /// </summary>
        /// <returns></returns>
        public string OfficialService()
        {
            //获取操作类型  Type=1 加载指定类型和标题的说明性文本内容 Type=2 初始化说明性文本内容
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1")
            {
                // 获取传递的参数
                string ExplainType = PublicClass.FilterRequestTrim("ExplainType");
                string ExplainTitle = PublicClass.FilterRequestTrim("ExplainTitle");

                //----------选 填---------------//
                //是包含还是清除模式 (true / false )
                string Exclude = PublicClass.FilterRequestTrim("Exclude");
                //包含与清仓字段，用 “^”连接
                string ClearOrShowPropertyNameArr = PublicClass.FilterRequestTrim("ClearOrShowPropertyNameArr");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "7");
                _dicPost.Add("ExplainType", ExplainType);
                _dicPost.Add("ExplainTitle", ExplainTitle);
                _dicPost.Add("Exclude", Exclude);
                _dicPost.Add("ClearOrShowPropertyNameArr", ClearOrShowPropertyNameArr);


                return HttpService.Post(WebAppConfig.ApiUrl_ASAC_ExplainText, _dicPost);

                ////发送Http请求
                //string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_ExplainText, "ASAC_ExplainText", "7", _dicPost);
                //return _backJson;
            }
            else if (_exeType == "2") //初始化说明性文本内容
            {
                // 获取传递的参数
                string ExplainID = PublicClass.FilterRequestTrim("ExplainID");

                string ExplainType = PublicClass.FilterRequestTrim("ExplainType");
                string ExplainTitle = PublicClass.FilterRequestTrim("ExplainTitle");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "8");
                _dicPost.Add("ExplainID", ExplainID);
                _dicPost.Add("IsLock", "false");
                _dicPost.Add("ExplainType", ExplainType);
                _dicPost.Add("ExplainTitle", ExplainTitle);

                return HttpService.Post(WebAppConfig.ApiUrl_ASAC_ExplainText, _dicPost);
            }

            return "";
        }

        /// <summary>
        /// 买家设置
        /// </summary>
        /// <returns></returns>
        public string Setting()
        {
            //-------判断登录是否正确，并获取登录的UserID-------//
            string _loginUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 退出登录 Type=2 清除所有缓存
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1") //退出登录
            {
                //清除登录
                BusiLogin.clearLoginCookie();

                return "11"; //清除所有缓存成功
            }
            else if (_exeType == "2") //清除所有缓存
            {
                //BuyerReceiAddrSelCookieArr,AsSelApplyCookie,AsSelApplyCookieCopy,OrderGoodsCookie,OrderGoodsCookieArr,SelCityRegionArrCookie,ScartIDOrderNumArrCookie,BackUrlLoginCookie,
                //PublicClass.clearCookieValue("BuyerReceiAddrSelCookieArr");

                //清除登录
                BusiLogin.clearLoginCookie();

                return "21"; //清除所有缓存成功
            }

            return "";
        }


    }
}