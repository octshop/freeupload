using BusiApiHttpNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【优惠券】相关Ajax请求控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.AjaxPage
{
    public class CouponsController : Controller
    {
        // GET: Coupons
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 优惠券添加
        /// </summary>
        /// <returns></returns>
        public string CouponsMsgAdd()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }
            //获取商家登录UserID
            string mShopUserID = _loginBuyerUserID;


            //获取操作类型  Type=1 加载商家商品分页 Type=2 提交优惠券信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                string pageCurrent = PublicClass.FilterRequestTrim("pageCurrent");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("ShopUserID", mShopUserID);
                _dicPost.Add("PageCurrent", pageCurrent);
                _dicPost.Add("PageSize", "10");
                _dicPost.Add("IsLock", "false");

                //调用加载父级类目列表函数
                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGoodsMsg, "UGS_GooGoodsMsg", "1", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //提交优惠券信息
            {
                //获取传递的参数
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");
                string CouponsTitle = PublicClass.FilterRequestTrim("CouponsTitle");
                string UseMoney = PublicClass.FilterRequestTrim("UseMoney");
                string UseDiscount = PublicClass.FilterRequestTrim("UseDiscount");
                string NumTotal = PublicClass.FilterRequestTrim("NumTotal");
                string IssueType = PublicClass.FilterRequestTrim("IssueType");
                string IssueExpenseSum = PublicClass.FilterRequestTrim("IssueExpenseSum");
                string UseTimeRange = PublicClass.FilterRequestTrim("UseTimeRange");
                string ExpenseReachSum = PublicClass.FilterRequestTrim("ExpenseReachSum");
                string CouponsDesc = PublicClass.FilterRequestTrim("CouponsDesc");
                string SelGoodsIDArr = PublicClass.FilterRequestTrim("SelGoodsIDArr");
                string IsRepeatGet = PublicClass.FilterRequestTrim("IsRepeatGet");
                string IsOfflineUse = PublicClass.FilterRequestTrim("IsOfflineUse");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("ShopUserID", mShopUserID);
                _dicPost.Add("CouponsID", CouponsID);
                _dicPost.Add("CouponsTitle", CouponsTitle);
                _dicPost.Add("UseMoney", UseMoney);
                _dicPost.Add("UseDiscount", UseDiscount);
                _dicPost.Add("NumTotal", NumTotal);
                _dicPost.Add("IssueType", IssueType);
                _dicPost.Add("IssueExpenseSum", IssueExpenseSum);
                _dicPost.Add("UseTimeRange", UseTimeRange);
                _dicPost.Add("ExpenseReachSum", ExpenseReachSum);
                _dicPost.Add("CouponsDesc", CouponsDesc);
                _dicPost.Add("IsMallCoupons", "false");
                _dicPost.Add("UseGoodsIDArr", SelGoodsIDArr);
                _dicPost.Add("IsRepeatGet", IsRepeatGet);
                _dicPost.Add("IsOfflineUse", IsOfflineUse);

                //调用提交优惠券信息
                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_CouponsMsg, "T_CouponsMsg", "2", _dicPost);
                return _jsonBack;
            }

            return "";


        }

        /// <summary>
        /// 优惠券编辑
        /// </summary>
        /// <returns></returns>
        public string CouponsMsgEdit()
        {
            return "";
        }

        /// <summary>
        /// 优惠券管理
        /// </summary>
        /// <returns></returns>
        public string CouponsMsg()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }
            //获取商家登录UserID
            string mShopUserID = _loginBuyerUserID;


            //获取操作类型  Type=1 搜索分页数据 Type=2 删除 单个或批量 优惠券信息 Type=3 暂停与继续发放 优惠券 Type=4 初始化优惠券详情
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");
                string CouponsTitle = PublicClass.FilterRequestTrim("CouponsTitle");
                string UseMoney = PublicClass.FilterRequestTrim("UseMoney");
                string UseDiscount = PublicClass.FilterRequestTrim("UseDiscount");
                string NumTotal = PublicClass.FilterRequestTrim("NumTotal");
                string IssueType = PublicClass.FilterRequestTrim("IssueType");
                string IssuePause = PublicClass.FilterRequestTrim("IssuePause");
                string UseTimeRange = PublicClass.FilterRequestTrimNoConvert("UseTimeRange");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //当前页
                string pageCurrent = PublicClass.FilterRequestTrim("pageCurrent");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("ShopUserID", mShopUserID);
                _dicPost.Add("PageCurrent", pageCurrent);

                _dicPost.Add("CouponsID", CouponsID);
                _dicPost.Add("CouponsTitle", CouponsTitle);
                _dicPost.Add("UseMoney", UseMoney);
                _dicPost.Add("UseDiscount", UseDiscount);
                _dicPost.Add("NumTotal", NumTotal);
                _dicPost.Add("IssueType", IssueType);
                _dicPost.Add("IssuePause", IssuePause);
                _dicPost.Add("UseTimeRange", UseTimeRange);
                _dicPost.Add("IsLock", "false");
                _dicPost.Add("WriteDate", WriteDate);

                //优惠券数据分页
                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_CouponsMsg, "T_CouponsMsg", "1", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //删除 单个或批量 优惠券信息
            {
                //获取传递的参数
                string MsgIDArr = PublicClass.FilterRequestTrim("MsgIDArr");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("ShopUserID", mShopUserID);
                _dicPost.Add("CouponsIDArr", MsgIDArr);

                //删除 单个或批量 优惠券信息
                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_CouponsMsg, "T_CouponsMsg", "4", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "3") //暂停与继续发放 优惠券
            {
                //获取传递的参数
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");
                string IssuePause = PublicClass.FilterRequestTrim("IssuePause");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("ShopUserID", mShopUserID);
                _dicPost.Add("IssuePause", IssuePause);
                _dicPost.Add("CouponsID", CouponsID);

                //删除 单个或批量 优惠券信息
                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_CouponsMsg, "T_CouponsMsg", "5", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "4") //初始化优惠券详情
            {
                //获取传递的参数
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("CouponsID", CouponsID);

                //初始化优惠券详情 接口
                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_CouponsMsg, "T_CouponsMsg", "6", _dicPost);
                return _jsonBack;

            }


            return "";

        }

        /// <summary>
        /// 优惠券发放使用信息
        /// </summary>
        /// <returns></returns>
        public string CouponsIssueMsg()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }
            //获取商家登录UserID
            string mShopUserID = _loginBuyerUserID;


            //获取操作类型  Type=1 搜索分页数据 Type=2 初始化优惠券发放信息 -带优惠券详情，会员信息，订单信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");
                string CouponsTitle = PublicClass.FilterRequestTrim("CouponsTitle");
                string UseMoney = PublicClass.FilterRequestTrim("UseMoney");
                string UseDiscount = PublicClass.FilterRequestTrim("UseDiscount");
                string IssueID = PublicClass.FilterRequestTrim("IssueID");
                string IsUsed = PublicClass.FilterRequestTrim("IsUsed");
                string IsOverTime = PublicClass.FilterRequestTrim("IsOverTime");
                string IsMallCoupons = PublicClass.FilterRequestTrimNoConvert("IsMallCoupons");
                string UsedTime = PublicClass.FilterRequestTrimNoConvert("UsedTime");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //当前页
                string pageCurrent = PublicClass.FilterRequestTrim("pageCurrent");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("ShopUserID", mShopUserID);
                _dicPost.Add("pageCurrent", pageCurrent);
                _dicPost.Add("CouponsID", CouponsID);
                _dicPost.Add("CouponsTitle", CouponsTitle);
                _dicPost.Add("UseMoney", UseMoney);
                _dicPost.Add("UseDiscount", UseDiscount);
                _dicPost.Add("IssueID", IssueID);
                _dicPost.Add("IsUsed", IsUsed);
                _dicPost.Add("IsOverTime", IsOverTime);
                _dicPost.Add("IsMallCoupons", IsMallCoupons);
                _dicPost.Add("UsedTime", UsedTime);
                _dicPost.Add("WriteDate", WriteDate);

                //优惠券数据分页
                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_CouponsIssueMsg, "T_CouponsIssueMsg", "6", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //初始化优惠券发放信息 -带优惠券详情，会员信息，订单信息{
            {
                //获取传递的参数
                string IssueID = PublicClass.FilterRequestTrim("IssueID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("ShopUserID", mShopUserID);
                _dicPost.Add("IssueID", IssueID);

                //优惠券数据分页
                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_CouponsIssueMsg, "T_CouponsIssueMsg", "11", _dicPost);
                return _jsonBack;
            }


            return "";
        }

        /// <summary>
        /// 优惠券线下使用验证
        /// </summary>
        /// <returns></returns>
        public string CouponsUseVerify()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 查询验证优惠券信息列表
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string VerifyCode = PublicClass.FilterRequestTrim("VerifyCode");
                string IssueID = PublicClass.FilterRequestTrim("IssueID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("ShopUserID", _loginBuyerUserID);
                _dicPost.Add("VerifyCode", VerifyCode);
                _dicPost.Add("IssueID", IssueID);

                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_CouponsVerifyCode, "T_CouponsVerifyCode", "2", _dicPost);
                return _jsonBack;


            }

            return "";
        }

    }
}