using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【功能导航列表】相关Page页面控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.WebPage
{
    public class NavPageController : Controller
    {
        /// <summary>
        /// 功能导航首页
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            ViewBag.IsShowMobileDisplay = "none";
            if (PublicClassNS.PublicClass.isMobileOS())
            {
                ViewBag.IsShowMobileDisplay = "normal";
            }

            //获取传递的参数
            ViewBag.ShopID = PublicClassNS.PublicClass.FilterRequestTrim("SID");

            return View();
        }

        /// <summary>
        /// 功能子列表导航
        /// </summary>
        /// <returns></returns>
        public ActionResult NavSubList()
        {
            //获取传递的参数
            string _navName = PublicClassNS.PublicClass.FilterRequestTrim("NavName");
            if (string.IsNullOrWhiteSpace(_navName))
            {
                Response.Redirect("../NavPage/Index");
                return null;
            }

            //获取传递的参数
            ViewBag.ShopID = PublicClassNS.PublicClass.FilterRequestTrim("SID");


            //----判断进入的是什么频道-----//
            ViewBag.MainTitle = _navName; //标题名称


            string _subItemNavList = "";
            if (_navName == "移动端首页")
            {
                Response.Redirect("../WapPage/Index");
                return null;
            }
            else if (_navName == "系统信息")
            {
                ViewBag.IconName = "am-icon-home"; //图片名称

                //构造子导航列表
                _subItemNavList = "<div class=\"nav-item\"><a href=\"../SysPage/Index\">系统首页</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../SysPage/DataCount\">数据统计</a></div>";
            }
            else if (_navName == "交易管理")
            {
                ViewBag.IconName = "am-icon-truck"; //图片名称

                //构造子导航列表
                _subItemNavList = "<div class=\"nav-item\"><a href=\"../TradingPage/OrderMan\">订单管理</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../TradingPage/VerifyCheckCodeOrderStatus\">订单核销验证</a></div>";
            }
          
            else if (_navName == "商品管理")
            {
                ViewBag.IconName = "am-icon-cubes"; //图片名称

                //构造子导航列表
                _subItemNavList = "<div class=\"nav-item\"><a href=\"../GoodsPage/GoodsAdd\">发布商品</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../GoodsPage/GoodsMsg\">我的商品</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../GoodsPage/GooGiftMsg\">赠品管理</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../GoodsPage/Album\">相册管理</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../GoodsPage/GooGoodsImg\">商品照片</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../GoodsPage/GooGiftImg\">赠品照片</a></div>";

            }
            else if (_navName == "店铺管理")
            {
                ViewBag.IconName = "am-icon-institution"; //图片名称

                //构造子导航列表
                _subItemNavList = "<div class=\"nav-item\"><a href=\"../ShopPage/CreateShopQRCode?SID=" + ViewBag.ShopID + "\">店铺二维码</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../ShopPage/ShopGoodsType\">店铺商品分类</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../ShopPage/FreightTemplate\">运费模板管理</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../ShopPage/ShopMsg\">店铺信息</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../ShopPage/CompanyMsg\">公司资质</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../ShopPage/ShopHomeCarousel?SID=" + ViewBag.ShopID + "\">店铺首页轮播</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../ShopPage/ShopHomeSection\">店铺首页栏目</a></div>";

            }
    
            else if (_navName == "积分管理")
            {
                ViewBag.IconName = "am-icon-life-ring"; //图片名称

                //构造子导航列表
                _subItemNavList = "<div class=\"nav-item\"><a href=\"../IntegralPage/IntegralMy\">我的积分</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../IntegralPage/IntegralSetting\">积分设置</a></div>";
            }
            else if (_navName == "优惠券")
            {
                ViewBag.IconName = "am-icon-money"; //图片名称

                //构造子导航列表
                _subItemNavList = "<div class=\"nav-item\"><a href=\"../CouponsPage/CouponsMsgAdd\">添加优惠券</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../CouponsPage/CouponsMsg\">优惠券管理</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../CouponsPage/CouponsIssueMsg\">发放使用信息</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../CouponsPage/CouponsUseVerify\">线下使用验证</a></div>";
            }
          
            else if (_navName == "评价管理")
            {
                ViewBag.IconName = "am-icon-comment"; //图片名称

                //构造子导航列表
                _subItemNavList = "<div class=\"nav-item\"><a href=\"../GoodsPage/GooAppraise\">商品评价</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../GoodsPage/ShopAppraise\">店铺评价</a></div>";
            }
      
            else if (_navName == "投诉管理")
            {
                ViewBag.IconName = "am-icon-thumbs-down"; //图片名称

                //构造子导航列表
                _subItemNavList = "<div class=\"nav-item\"><a href=\"../ComplainPage/ComplainMsg\">投诉信息</a></div>";

            }
            else if (_navName == "财务结算")
            {
                ViewBag.IconName = "am-icon-calculator"; //图片名称

                //构造子导航列表
                _subItemNavList = "<div class=\"nav-item\"><a href=\"../SettlePage/SettleApply\">商家结算申请</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../SettlePage/SettleShopMsg\">商家结算资料</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../SettlePage/ShopIncomeExpense\">余额收支记录</a></div>";

            }
            else if (_navName == "消息通知")
            {
                ViewBag.IconName = "am-icon-volume-up"; //图片名称

                //构造子导航列表
                _subItemNavList = "<div class=\"nav-item\"><a href=\"../AfterSalePage/ShopSysMsg\">商家消息通知</a></div>";
            }
            else if (_navName == "系统管理")
            {
                ViewBag.IconName = "am-icon-cloud"; //图片名称

                //构造子导航列表
                _subItemNavList = "<div class=\"nav-item\"><a href=\"../LoginPage/LoginPwdSetting\">修改登录密码</a></div>";
            }


            ViewBag.SubItemNavList = _subItemNavList;

            return View();
        }
    }
}