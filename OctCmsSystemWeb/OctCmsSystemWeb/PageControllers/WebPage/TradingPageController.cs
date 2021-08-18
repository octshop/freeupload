using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【交易系统订单与财务( OctTradingSystem )】Page页面控制器
/// </summary>
namespace OctCmsSystemWeb.PageControllers.WebPage
{
    public class TradingPageController : Controller
    {
        #region【商城订单】

        /// <summary>
        /// 订单信息管理
        /// </summary>
        /// <returns></returns>
        public ActionResult OrderMsg()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("TradingPage/OrderMsg", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain;

            //获取传递的参数
            ViewBag.OrderTime = PublicClass.FilterRequestTrimNoConvert("OrderTime");
            ViewBag.OrderStatus = PublicClass.FilterRequestTrim("OrderStatus");


            return View();
        }

        /// <summary>
        /// 订单详情
        /// </summary>
        /// <returns></returns>
        public ActionResult OrderDetail()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("TradingPage/OrderDetail", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain;

            //获取传递的参数
            ViewBag.OrderID = PublicClass.FilterRequestTrim("OID");

            return View();
        }

        #endregion

        #region【商家结算】

        /// <summary>
        /// 商家结算资料
        /// </summary>
        /// <returns></returns>
        public ActionResult SettleShopMsg()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("TradingPage/SettleShopMsg", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            //获取传递的参数
            ViewBag.IsCheck = PublicClass.FilterRequestTrim("IsCheck");

            return View();
        }

        /// <summary>
        /// 商家结算申请
        /// </summary>
        /// <returns></returns>
        public ActionResult SettleApply()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("TradingPage/SettleApply", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            //获取传递的参数
            ViewBag.SettleStatus = PublicClass.FilterRequestTrim("SettleStatus");

            return View();
        }

        /// <summary>
        /// 结算申请处理
        /// </summary>
        /// <returns></returns>
        public ActionResult SettleDispose()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("TradingPage/SettleDispose", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }



            ViewBag.SAID = PublicClassNS.PublicClass.FilterRequestTrim("SAID");
            if (string.IsNullOrWhiteSpace(ViewBag.SAID))
            {
                Response.Redirect("../TradingPage/SettleApply");
            }

            return View();
        }

        /// <summary>
        /// 结算申请详情
        /// </summary>
        /// <returns></returns>
        public ActionResult SettleDetail()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("TradingPage/SettleDetail", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            ViewBag.SAID = PublicClassNS.PublicClass.FilterRequestTrim("SAID");
            if (string.IsNullOrWhiteSpace(ViewBag.SAID))
            {
                Response.Redirect("../TradingPage/SettleApply");
            }

            return View();
        }

        /// <summary>
        /// 商城结算订单
        /// </summary>
        /// <returns></returns>
        public ActionResult SettleOrderMsg()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("TradingPage/SettleOrderMsg", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            return View();
        }

        /// <summary>
        /// 商城订单抽成与分红分润信息
        /// </summary>
        /// <returns></returns>
        public ActionResult OrderCommission()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("TradingPage/OrderCommission", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            return View();
        }

        /// <summary>
        /// 扫码支付结算订单
        /// </summary>
        /// <returns></returns>
        public ActionResult SettleAggregateOrderMsg()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("TradingPage/SettleAggregateOrderMsg", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            return View();
        }


        #endregion

        #region【聚合支付订单】

        /// <summary>
        /// 聚会扫码支付订单信息
        /// </summary>
        /// <returns></returns>
        public ActionResult AggregateOrderMsg()
        {
           

            return View();
        }

        /// <summary>
        /// 聚合支付订单抽成与分红分润信息
        /// </summary>
        /// <returns></returns>
        public ActionResult AggregateOrderCommission()
        {
           
            return View();
        }

        /// <summary>
        /// 扫码支付订单详情
        /// </summary>
        /// <returns></returns>
        public ActionResult AggreOrderDetail()
        {
          

            return View();
        }

        #endregion

        #region【买家余额提现】

        /// <summary>
        /// 买家余额提现
        /// </summary>
        /// <returns></returns>
        public ActionResult BuyerWithDraw()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("TradingPage/BuyerWithDraw", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            //获取传递的参数
            ViewBag.WithDrawStatus = PublicClass.FilterRequestTrim("WithDrawStatus");

            return View();
        }

        /// <summary>
        /// 买家余额提现处理
        /// </summary>
        /// <returns></returns>
        public ActionResult BuyerWithDrawDispose()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("TradingPage/BuyerWithDrawDispose", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }

            ViewBag.WDID = PublicClassNS.PublicClass.FilterRequestTrim("WDID");
            if (string.IsNullOrWhiteSpace(ViewBag.WDID))
            {
                Response.Redirect("../TradingPage/BuyerWithDraw");
            }

            return View();
        }

        #endregion

        #region【买家 -- 收支，积分】

        /// <summary>
        /// 买家余额充值
        /// </summary>
        /// <returns></returns>
        public ActionResult BuyerRecharge()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("TradingPage/BuyerRecharge", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            return View();
        }

        /// <summary>
        /// 会员(买家)账户余额管理
        /// </summary>
        /// <returns></returns>
        public ActionResult BuyerInExMan()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("TradingPage/BuyerInExMan", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }

            //------只有超级管理员(AdUserType=Admin)才能进入的页-------// 
            string _loginUserAdUserType = BusiLogin.getLoginUserAdUserType();
            if (_loginUserAdUserType != "Admin")
            {
                return Content(BusiLogin.xhtmlNoPowerVisitContent());
            }

            return View();
        }

        /// <summary>
        /// 买家账户余额收支信息
        /// </summary>
        /// <returns></returns>
        public ActionResult BuyerIncomeExpense()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("TradingPage/BuyerIncomeExpense", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }

            ViewBag.UserID = PublicClass.FilterRequestTrim("UID");

            return View();
        }

        /// <summary>
        /// 买家账户积分收支信息
        /// </summary>
        /// <returns></returns>
        public ActionResult BuyerIntegral()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("TradingPage/BuyerIntegral", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            return View();
        }

        /// <summary>
        /// 买家分润余额收支信息
        /// </summary>
        /// <returns></returns>
        public ActionResult BuyerIncomeExpenseDividend()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("TradingPage/BuyerIncomeExpenseDividend", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            return View();
        }

        /// <summary>
        /// 买家分润积分收支信息
        /// </summary>
        /// <returns></returns>
        public ActionResult BuyerIntegralDividend()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("TradingPage/BuyerIntegralDividend", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            return View();
        }

        #endregion

        #region【商家 -- 收支，积分】

        /// <summary>
        /// 商家余额收支信息
        /// </summary>
        /// <returns></returns>
        public ActionResult ShopIncomeExpense()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("TradingPage/ShopIncomeExpense", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            return View();
        }

        /// <summary>
        /// 商家积分收支信息
        /// </summary>
        /// <returns></returns>
        public ActionResult ShopIntegral()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("TradingPage/ShopIntegral", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            return View();
        }

        /// <summary>
        /// 商家积分充值
        /// </summary>
        /// <returns></returns>
        public ActionResult ShopIntegralRecharge()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("TradingPage/ShopIntegralRecharge", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }



            return View();
        }


        #endregion

        #region【支付系统】

        /// <summary>
        /// 转账汇款银行信息
        /// </summary>
        /// <returns></returns>
        public ActionResult PayTransBankMsg()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("TradingPage/PayTransBankMsg", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            return View();
        }

        /// <summary>
        /// 转账记录信息
        /// </summary>
        /// <returns></returns>
        public ActionResult PayTransRecord()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("TradingPage/PayTransRecord", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            return View();
        }


        #endregion

        #region【优惠券】

        /// <summary>
        /// 优惠券信息
        /// </summary>
        /// <returns></returns>
        public ActionResult CouponsMsg()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("TradingPage/CouponsMsg", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            return View();
        }

        /// <summary>
        /// 优惠券详情
        /// </summary>
        /// <returns></returns>
        public ActionResult CouponsDetail()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("TradingPage/CouponsDetail", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain;

            //获取传递的参数
            ViewBag.CID = PublicClass.FilterRequestTrim("CID");

            return View();
        }

        /// <summary>
        /// 优惠券发放
        /// </summary>
        /// <returns></returns>
        public ActionResult CouponsIssueMsg()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("TradingPage/CouponsIssueMsg", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            ViewBag.IsUsed = PublicClass.FilterRequestTrim("IsUsed");


            return View();
        }


        #endregion

        #region【礼品】

        /// <summary>
        /// 礼品订单
        /// </summary>
        /// <returns></returns>
        public ActionResult PresentOrderMsg()
        {
          

            return View();
        }

        /// <summary>
        /// 礼品订单详情
        /// </summary>
        /// <returns></returns>
        public ActionResult PresentOrderDetail()
        {
           

            return View();
        }


        #endregion


    }
}