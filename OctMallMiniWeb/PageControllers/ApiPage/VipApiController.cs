using HttpServiceNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【会员系统】相关Api控制器
/// </summary>
namespace OctMallMiniWeb.PageControllers.ApiPage
{
    public class VipApiController : Controller
    {

        /// <summary>
        /// 会员系统首页 余额，积分
        /// </summary>
        /// <returns></returns>
        public string Index()
        {
            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }

            //获取操作类型  Type=1 得到用户当前的可用余额 Type=2 得到用户的当前等级和信用分 Type=3 得到买家所有的余额和积分信息包括账号和分润的 Type=4 得到用户当前的可用积分
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                //string ShopID = PublicClass.FilterRequestTrim("ShopID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginUserID);

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_BuyerIncomeExpense, "T_BuyerIncomeExpense", "4", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //得到用户的当前等级和信用分
            {
                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginUserID);

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_VipCreditIndex, "UGS_VipCreditIndex", "1", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "3") //得到买家 所有的 余额 和 积分 信息  包括 账号和分润的
            {
                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginUserID);

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_FinanceIndex, "T_FinanceIndex", "1", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "4") //得到用户当前的可用积分
            {
                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginUserID);

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_BuyerIntegral, "T_BuyerIntegral", "2", _dicPost);
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 余额积分 账户和分润的
        /// </summary>
        /// <returns></returns>
        public string BalanceIntegral()
        {
            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }


            //获取操作类型  Type=1 将买家当前所有的【分润余额】转入【账户余额】 Type=2 将买家当前所有的【分润积分】转入【账户积分】
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginUserID);

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_DividendBalanceIntegral, "T_DividendBalanceIntegral", "1", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //将买家当前所有的【分润积分】转入【账户积分】
            {
                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginUserID);

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_DividendBalanceIntegral, "T_DividendBalanceIntegral", "2", _dicPost);
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 账户余额明细
        /// </summary>
        /// <returns></returns>
        public string BalanceDetail()
        {
            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }

            //获取操作类型 Type=1 搜索分页数据
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数

                //-----获取当前页数-----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("PageCurrent", PageCurrent);
                _dicPost.Add("BuyerUserID", _loginUserID);
                _dicPost.Add("IsLock", "false");

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_BuyerIncomeExpense, "T_BuyerIncomeExpense", "1", _dicPost);
                return _jsonBack;

            }

            return "";
        }

        /// <summary>
        /// 分润-账户余额明细
        /// </summary>
        /// <returns></returns>
        public string DividendBalanceDetail()
        {
            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }

            //获取操作类型 Type=1 搜索分页数据
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数

                //-----获取当前页数-----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("PageCurrent", PageCurrent);
                _dicPost.Add("BuyerUserID", _loginUserID);
                _dicPost.Add("IsLock", "false");

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_DividendBalanceIntegral, "T_DividendBalanceIntegral", "3", _dicPost);
                return _jsonBack;

            }

            return "";
        }

        /// <summary>
        /// 账户积分明细
        /// </summary>
        /// <returns></returns>
        public string IntegralDetail()
        {
            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }

            //获取操作类型 Type=1 搜索分页数据
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数

                //-----获取当前页数-----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("PageCurrent", PageCurrent);
                _dicPost.Add("BuyerUserID", _loginUserID);
                _dicPost.Add("IsLock", "false");

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_BuyerIntegral, "T_BuyerIntegral", "1", _dicPost);
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 分润-账户积分明细
        /// </summary>
        /// <returns></returns>
        public string DividendIntegralDetail()
        {
            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }

            //获取操作类型 Type=1 搜索分页数据
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数

                //-----获取当前页数-----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("PageCurrent", PageCurrent);
                _dicPost.Add("BuyerUserID", _loginUserID);
                _dicPost.Add("IsLock", "false");

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_DividendBalanceIntegral, "T_DividendBalanceIntegral", "4", _dicPost);
                return _jsonBack;
            }


            return "";
        }

        /// <summary>
        /// 收支详情 - 余额与积分
        /// </summary>
        /// <returns></returns>
        public string InExDetail()
        {
            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }

            //获取操作类型 Type=1 初始化买家余额详细 Type=2 初始化买家积分详细
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string InExMsgID = PublicClass.FilterRequestTrim("InExMsgID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginUserID);
                _dicPost.Add("InExMsgID", InExMsgID);

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_BuyerIncomeExpense, "ApiUrl_T_BuyerIncomeExpense", "5", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //初始化买家积分详细
            {
                // 获取传递的参数
                string IntegralID = PublicClass.FilterRequestTrim("IntegralID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginUserID);
                _dicPost.Add("IntegralID", IntegralID);

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_BuyerIntegral, "ApiUrl_T_BuyerIntegral", "3", _dicPost);
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 分润收支详情 - 余额与积分
        /// </summary>
        /// <returns></returns>
        public string DividendInExDetail()
        {
            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }

            //获取操作类型 Type=1 初始化买家分润余额详细 Type=2 初始化买家分润积分详细
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string InExMsgID = PublicClass.FilterRequestTrim("InExMsgID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginUserID);
                _dicPost.Add("InExMsgID", InExMsgID);

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_DividendBalanceIntegral, "ApiUrl_T_DividendBalanceIntegral", "5", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //初始化买家积分详细
            {
                // 获取传递的参数
                string IntegralID = PublicClass.FilterRequestTrim("IntegralID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginUserID);
                _dicPost.Add("IntegralID", IntegralID);

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_DividendBalanceIntegral, "ApiUrl_T_DividendBalanceIntegral", "6", _dicPost);
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 会员等级
        /// </summary>
        /// <returns></returns>
        public string VipLevel()
        {
            //获取操作类型 Type=1 加载指定类型的说明性文本
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string ExplainType = PublicClass.FilterRequestTrim("ExplainType");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "1");
                _dicPost.Add("ExplainType", ExplainType);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_ASAC_ExplainText, _dicPost);
                return _jsonBack;
            }

            return "";
        }

        #region【买家用户提现】

        /// <summary>
        /// 立即提现
        /// </summary>
        /// <returns></returns>
        public string WithdrawSubmit()
        {
            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }

            //获取操作类型 Type=1 获取账户微信注册信息 Type=2 得到用户当前的可用余额 Type=3 添加买家提现信息,提交提现请求 Type=4 得到最新没有完成的提现信息ID (如果为0则不存在没有处理完成的提现) Type=5 初始化买家提现详细 Type=6 预加载买家以前最近的提现信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("UserID", _loginUserID);

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_UserAccount, "UGS_UserAccount", "10", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //得到用户当前的可用余额
            {
                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginUserID);

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_BuyerIncomeExpense, "T_BuyerIncomeExpense", "4", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "3") //添加买家提现信息,提交提现请求
            {
                // 获取传递的参数
                string ToType = PublicClass.FilterRequestTrim("ToType");
                string WithDrawAmt = PublicClass.FilterRequestTrim("WithDrawAmt");
                string TrueName = PublicClass.FilterRequestTrim("TrueName");
                string LinkMobile = PublicClass.FilterRequestTrim("LinkMobile");
                string WeChatAccount = PublicClass.FilterRequestTrim("WeChatAccount");
                string AlipayAccount = PublicClass.FilterRequestTrim("AlipayAccount");
                string BankCardNumber = PublicClass.FilterRequestTrim("BankCardNumber");
                string BankAccName = PublicClass.FilterRequestTrim("BankAccName");
                string OpeningBank = PublicClass.FilterRequestTrim("OpeningBank");
                string WithDrawMemo = PublicClass.FilterRequestTrim("WithDrawMemo");

                string SmsVerifyCode = PublicClass.FilterRequestTrim("SmsVerifyCode");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginUserID);
                _dicPost.Add("ToType", ToType);
                _dicPost.Add("WithDrawAmt", WithDrawAmt);
                _dicPost.Add("TrueName", TrueName);
                _dicPost.Add("LinkMobile", LinkMobile);
                _dicPost.Add("WeChatAccount", WeChatAccount);
                _dicPost.Add("AlipayAccount", AlipayAccount);
                _dicPost.Add("BankCardNumber", BankCardNumber);
                _dicPost.Add("BankAccName", BankAccName);
                _dicPost.Add("OpeningBank", OpeningBank);
                _dicPost.Add("WithDrawMemo", WithDrawMemo);

                _dicPost.Add("SmsVerifyCode", SmsVerifyCode);

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_BuyerWithDraw, "T_BuyerWithDraw", "2", _dicPost);
                return _jsonBack;

            }
            else if (_exeType == "4") //得到最新没有完成的提现信息ID (如果为0则不存在没有处理完成的提现)
            {
                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginUserID);

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_BuyerWithDraw, "T_BuyerWithDraw", "3", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "5") //初始化买家提现详细
            {
                // 获取传递的参数
                string WithDrawID = PublicClass.FilterRequestTrim("WithDrawID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("WithDrawID", WithDrawID);

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_BuyerWithDraw, "T_BuyerWithDraw", "4", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "6") //预加载买家以前最近的提现信息
            {
                // 获取传递的参数
                //string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginUserID);

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_BuyerWithDraw, "T_BuyerWithDraw", "6", _dicPost);
                return _jsonBack;
            }

            return "";
        }

        #endregion

        #region【买家在线充值 】

        /// <summary>
        /// 在线充值 
        /// </summary>
        /// <returns></returns>
        public string OnLineTopUp()
        {
            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }

            //获取操作类型 Type=1 添加买家充值信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                string RechargeAmt = PublicClass.FilterRequestTrim("RechargeAmt");
                string FromType = PublicClass.FilterRequestTrim("FromType");
                string RechargeMemo = "";

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginUserID);
                _dicPost.Add("RechargeAmt", RechargeAmt);
                _dicPost.Add("FromType", FromType);
                _dicPost.Add("RechargeMemo", RechargeMemo);

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_BuyerRecharge, "T_BuyerRecharge", "2", _dicPost);
                return _jsonBack;
            }


            return "";
        }

        #endregion




    }
}