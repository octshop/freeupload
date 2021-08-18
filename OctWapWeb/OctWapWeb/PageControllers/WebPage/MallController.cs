using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【商城】相关页面控制器
/// </summary>
namespace OctWapWeb.PageControllers.WebPage
{
    public class MallController : Controller
    {
        /// <summary>
        /// 商城首页 B2c
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {

            ViewBag.TechSupport = BusiCode.getTechSupportXhtml();

            return View();
        }

        #region【搜索商品店铺】

        /// <summary>
        /// 搜索商品
        /// </summary>
        /// <returns></returns>
        public ActionResult SearchGoods()
        {
            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            //搜索的类型，实体店 Entity
            ViewBag.SearchType = PublicClass.FilterRequestTrim("ST");

            if (string.IsNullOrWhiteSpace(ViewBag.SearchType) == false)
            {
                ViewBag.SearchTypeParam = "ST=Entity";
            }

            return View();
        }

        /// <summary>
        /// 搜索商品结果
        /// </summary>
        /// <returns></returns>
        public ActionResult SearchGoodsResult()
        {
            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            //获取搜索的内容
            ViewBag.SearchContent = Server.UrlDecode(PublicClass.isReqAndBackReqVal("SC", "../Shop/ShopSearch?SID=" + ViewBag.ShopID));


            return View();
        }

        /// <summary>
        /// 搜索商品结果 O2o实体店商品结果
        /// </summary>
        /// <returns></returns>
        public ActionResult SearchGoodsResultO2o()
        {
            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            //获取搜索的内容
            ViewBag.SearchContent = Server.UrlDecode(PublicClass.isReqAndBackReqVal("SC", "../Shop/ShopSearch?SID=" + ViewBag.ShopID));


            return View();
        }

        /// <summary>
        /// 搜索店铺
        /// </summary>
        /// <returns></returns>
        public ActionResult SearchShop()
        {
            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            //搜索的类型，实体店 Entity
            ViewBag.SearchType = PublicClass.FilterRequestTrim("ST");

            if (string.IsNullOrWhiteSpace(ViewBag.SearchType) == false)
            {
                ViewBag.SearchTypeParam = "ST=Entity";
            }

            return View();
        }

        /// <summary>
        /// 搜索店铺结果
        /// </summary>
        /// <returns></returns>
        public ActionResult SearchShopResult()
        {
            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            //获取搜索的内容
            ViewBag.SearchContent = Server.UrlDecode(PublicClass.isReqAndBackReqVal("SC", "../Shop/ShopSearch?SID=" + ViewBag.ShopID));


            return View();
        }

        /// <summary>
        /// 搜索店铺结果 --实体店
        /// </summary>
        /// <returns></returns>
        public ActionResult SearchShopResultO2o()
        {
            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            //获取搜索的内容
            ViewBag.SearchContent = Server.UrlDecode(PublicClass.isReqAndBackReqVal("SC", "../Shop/ShopSearch?SID=" + ViewBag.ShopID));


            return View();
        }

        #endregion

        #region【商品分类】

        /// <summary>
        /// 商品分类
        /// </summary>
        /// <returns></returns>
        public ActionResult GoodsType()
        {
            return View();
        }

        /// <summary>
        /// 商品分类列表显示
        /// </summary>
        /// <returns></returns>
        public ActionResult GoodsTypeList()
        {
            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            //第二级商品类目ID
            ViewBag.GoodsTypeIDSec = PublicClass.FilterRequestTrim("GTID");

            return View();
        }

        /// <summary>
        /// 商品分类列表 详细
        /// </summary>
        /// <returns></returns>
        public ActionResult GoodsTypeListDetail()
        {
            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            //第三级商品类目ID
            ViewBag.GoodsTypeIDThird = PublicClass.FilterRequestTrim("GTID");
            //是否加载全部
            ViewBag.LoadAll = PublicClass.FilterRequestTrim("LoadAll");

            return View();
        }

        #endregion

        #region【团购优惠】

        /// <summary>
        /// 团购优惠
        /// </summary>
        /// <returns></returns>
        public ActionResult GroupBuy()
        {
           

            return View();
        }

        #endregion

        #region【抢购秒杀】

        /// <summary>
        /// 抢购秒杀
        /// </summary>
        /// <returns></returns>
        public ActionResult SecondsKill()
        {
           

            return View();
        }

        #endregion

        #region【礼品兑换】

        /// <summary>
        /// 礼品兑换
        /// </summary>
        /// <returns></returns>
        public ActionResult PresentExchange()
        {
           

            return View();
        }

        #endregion

        #region【折扣商品】

        /// <summary>
        /// 折扣商品
        /// </summary>
        /// <returns></returns>
        public ActionResult DiscountGoods()
        {
            return View();
        }

        #endregion

        #region【领券中心】

        /// <summary>
        /// 领券中心
        /// </summary>
        /// <returns></returns>
        public ActionResult Coupons()
        {
            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            return View();
        }

        #endregion

        #region【幸运抽奖】

        /// <summary>
        /// 幸运抽奖
        /// </summary>
        /// <returns></returns>
        public ActionResult LuckyDraw()
        {

            return View();
        }

        /// <summary>
        /// 抽奖详情
        /// </summary>
        /// <returns></returns>
        public ActionResult LuckyDrawDetail()
        {
           

            return View();
        }

        /// <summary>
        /// 抽奖详情页，手机Web端预览，用Iframe指定宽度加载
        /// </summary>
        /// <returns></returns>
        public ActionResult LuckyDrawDetailPreMobileIframe()
        {
          

            return View();
        }


        #endregion

        #region【活动优惠】

        /// <summary>
        /// 活动优惠
        /// </summary>
        /// <returns></returns>
        public ActionResult Activity()
        {
          

            return View();
        }

        #endregion

        #region【预览加载页】

        /// <summary>
        /// 预览加载页 - 页面预览
        /// </summary>
        /// <returns></returns>
        public ActionResult PagePreMobileIframe()
        {
            string _loadPreURL = Request.QueryString["LoadPreURL"].ToString().Trim();
            ViewBag.LoadPreURL = _loadPreURL;

            return View();
        }

        #endregion

    }
}