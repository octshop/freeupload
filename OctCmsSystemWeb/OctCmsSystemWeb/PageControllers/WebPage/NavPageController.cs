using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【功能导航列表】相关Page页面控制器
/// </summary>
namespace OctCmsSystemWeb.PageControllers.WebPage
{
    public class NavPageController : Controller
    {
        /// <summary>
        /// 功能导航首页
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
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

            //----判断进入的是什么频道-----//
            ViewBag.MainTitle = _navName; //标题名称

            string _subItemNavList = "";
            if (_navName == "系统信息")
            {
                ViewBag.IconName = "am-icon-home"; //图片名称

                //构造子导航列表
                _subItemNavList = "<div class=\"nav-item\"><a href=\"../SysPage/Index\">系统首页</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../SysPage/DataCount\">数据统计</a></div>";
            }
            else if (_navName == "商品管理")
            {
                ViewBag.IconName = "am-icon-cubes"; //图片名称

                //构造子导航列表
                _subItemNavList = "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/GooGoodsType\">类目管理</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/GooGoodsTypeNeedProp\">类目参数</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/GooGoodsMsg\">商品管理</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/GooGiftMsg\">赠品管理</a></div>";
            }
            else if (_navName == "店铺管理")
            {
                ViewBag.IconName = "am-icon-university"; //图片名称

                //构造子导航列表
                _subItemNavList = "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/ShopType\">店铺类别</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/ShopAdd\">添加店铺</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/ShopMsg\">店铺管理</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/ShopCommission\">店铺抽成比例</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/CompanyMsgAdd\">添加公司</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/CompanyMsg\">公司信息</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/CompanyCertificate\">证件资质</a></div>";
            }
            else if (_navName == "交易管理")
            {
                ViewBag.IconName = "am-icon-cart-plus"; //图片名称

                //构造子导航列表
                _subItemNavList = "<div class=\"nav-item\"><a href=\"../TradingPage/OrderMsg\">订单管理</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../TradingPage/AggregateOrderMsg\">扫码支付订单</a></div>";
            }
            //else if (_navName == "礼品管理")
            //{
            //    ViewBag.IconName = "am-icon-gift"; //图片名称

            //    //构造子导航列表
            //    _subItemNavList = "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/PresentMsg\">礼品信息</a></div>";
            //    _subItemNavList += "<div class=\"nav-item\"><a href=\"../TradingPage/PresentOrderMsg\">礼品订单</a></div>";
            //    _subItemNavList += "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/PresentGoodsType\">礼品分类</a></div>";
            //}
            else if (_navName == "优惠券管理")
            {
                ViewBag.IconName = "am-icon-money"; //图片名称

                //构造子导航列表
                _subItemNavList = "<div class=\"nav-item\"><a href=\"../TradingPage/CouponsMsg\">优惠券信息</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../TradingPage/CouponsIssueMsg\">优惠券发放</a></div>";
            }
            else if (_navName == "会员管理")
            {
                ViewBag.IconName = "am-icon-user"; //图片名称

                //构造子导航列表
                _subItemNavList = "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/UserAccount\">会员账号管理</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/BuyerPromoteUser\">推广会员信息</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/BuyerExpandShop\">会员发展店铺</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/UserSettingMsg\">会员配置参数</a></div>";
            }
            else if (_navName == "财务结算")
            {
                ViewBag.IconName = "am-icon-calculator"; //图片名称

                //构造子导航列表
                _subItemNavList = "<div class=\"nav-item\"><a href=\"../TradingPage/SettleApply\">商家结算申请</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../TradingPage/SettleShopMsg\">商家结算资料</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../TradingPage/SettleOrderMsg\">商城结算订单</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../TradingPage/OrderCommission\">商城订单抽成</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../TradingPage/SettleAggregateOrderMsg\">扫码支付订单</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../TradingPage/AggregateOrderCommission\">扫码支付抽成</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../TradingPage/BuyerInExMan\">账户余额管理</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../TradingPage/BuyerWithDraw\">买家余额提现</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../TradingPage/BuyerRecharge\">买家余额充值</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../TradingPage/BuyerIncomeExpense\">账户余额收支</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../TradingPage/BuyerIncomeExpenseDividend\">分润余额收支</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../TradingPage/BuyerIntegral\">账户积分收支</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../TradingPage/BuyerIntegralDividend\">分润积分收支</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../TradingPage/ShopIncomeExpense\">商家余额收支</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../TradingPage/ShopIntegral\">商家积分收支</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../TradingPage/ShopIntegralRecharge\">商家积分充值</a></div>";
            }
            else if (_navName == "评价管理")
            {
                ViewBag.IconName = "am-icon-comment"; //图片名称

                //构造子导航列表
                _subItemNavList = "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/GooAppraise\">商品评价</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/ShopAppraise\">店铺评价</a></div>";
            }
            else if (_navName == "售后管理")
            {
                ViewBag.IconName = "am-icon-ambulance"; //图片名称

                //构造子导航列表
                _subItemNavList = "<div class=\"nav-item\"><a href=\"../AfterSaleAccCusPage/AfterSaleApplyMsg\">售后申请信息</a></div>";
            }
            //else if (_navName == "投诉管理")
            //{
            //    ViewBag.IconName = "am-icon-thumbs-down"; //图片名称

            //    //构造子导航列表
            //    _subItemNavList = "<div class=\"nav-item\"><a href=\"../AfterSaleAccCusPage/OrderComplainMsg\">投诉信息处理</a></div>";
            //}
            //else if (_navName == "秒杀抢购")
            //{
            //    ViewBag.IconName = "am-icon-clock-o"; //图片名称

            //    //构造子导航列表
            //    _subItemNavList = "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/SecKillGoodsMsg\">秒杀商品设置</a></div>";
            //    _subItemNavList += "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/SecKillGoodsType\">秒杀商品分类</a></div>";
            //}
            //else if (_navName == "拼团管理")
            //{
            //    ViewBag.IconName = "am-icon-users"; //图片名称

            //    //构造子导航列表
            //    _subItemNavList = "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/GroupGoodsSetting\">拼团商品设置</a></div>";
            //    _subItemNavList += "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/GroupCreateMsg\">发起拼团管理</a></div>";
            //    _subItemNavList += "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/GroupJoinMsg\">参与拼团信息</a></div>";
            //    _subItemNavList += "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/GroupGoodsType\">拼团商品分类</a></div>";
            //}
            //else if (_navName == "活动管理")
            //{
            //    ViewBag.IconName = "am-icon-star-half-o"; //图片名称

            //    //构造子导航列表
            //    _subItemNavList = "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/ActivityMsg\">活动信息管理</a></div>";
            //    _subItemNavList += "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/ActivityJoin\">活动参与信息</a></div>";
            //}
            //else if (_navName == "抽奖管理")
            //{
            //    ViewBag.IconName = "am-icon-trophy"; //图片名称

            //    //构造子导航列表
            //    _subItemNavList = "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/LuckyDrawMsg\">抽奖信息管理</a></div>";
            //    _subItemNavList += "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/LuckyDrawJoinMsg\">抽奖参与信息</a></div>";
            //    _subItemNavList += "<div class=\"nav-item\"><a href=\"../UserGoodsShopPage/LuckyDrawResult\">中奖结果信息</a></div>";

            //}
            else if (_navName == "支付系统")
            {
                ViewBag.IconName = "am-icon-paypal"; //图片名称

                //构造子导航列表
                _subItemNavList = "<div class=\"nav-item\"><a href=\"../TradingPage/PayTransBankMsg\">转账银行信息</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../TradingPage/PayTransRecord\">转账记录信息</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../ThirdApiCallPage/PaySetting\">支付设置信息</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../ThirdApiCallPage/PayPreMsg\">预支付信息</a></div>";
            }
            else if (_navName == "广告系统")
            {
                ViewBag.IconName = "am-icon-buysellads"; //图片名称

                //构造子导航列表
                _subItemNavList = "<div class=\"nav-item\"><a href=\"../AdvertiserPage/AdvCarousel\">轮播图片广告</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../AdvertiserPage/AdvBanner\">横幅通栏广告</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../AdvertiserPage/AdvImgList\">图片列表栏目</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../AdvertiserPage/NavIconMsg\">栏目图标导航</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../AdvertiserPage/RcdGoodsShop\">推荐商品商家</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../AdvertiserPage/SearchFindMsg\">搜索发现展示</a></div>";
            }
            else if (_navName == "信息通知")
            {
                ViewBag.IconName = "am-icon-volume-up"; //图片名称

                //构造子导航列表
                _subItemNavList = "<div class=\"nav-item\"><a href=\"../AfterSaleAccCusPage/BuyerSysMsg\">买家通知信息</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../AfterSaleAccCusPage/ShopSysMsg\">商家通知信息</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../AfterSaleAccCusPage/PlatformSysMsg\">平台通知信息</a></div>";
            }
            else if (_navName == "系统管理")
            {
                ViewBag.IconName = "am-icon-cloud"; //图片名称

                //构造子导航列表
                _subItemNavList = "<div class=\"nav-item\"><a href=\"../CommonCodePage/UserKeyMsg\">API用户管理</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../CommonCodePage/KeyVerifyRecord\">Key验证记录</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../CommonCodePage/ApiReqRecord\">API调用记录</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../CommonCodePage/UserKeyMsg\">API用户管理</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../CommonCodePage/SystemConfigParam\">系统配置参数</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../CommonCodePage/SystemMsg\">系统异常信息</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../ThirdApiCallPage/SmsSendMsg\">短信发送信息</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../AfterSaleAccCusPage/ExplainText\">说明文章信息</a></div>";
                _subItemNavList += "<div class=\"nav-item\"><a href=\"../AfterSaleAccCusPage/ExplainImg\">说明图片管理</a></div>";
            }




            ViewBag.SubItemNavList = _subItemNavList;

            return View();
        }




    }
}