using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WeChatJsSdk.SdkCore;

/// <summary>
/// 【商品】相关页面控制器
/// </summary>
namespace OctWapWeb.PageControllers.WebPage
{
    public class GoodsController : Controller
    {
        // GET: Goods
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 商品详情
        /// </summary>
        /// <returns></returns>
        public ActionResult GoodsDetail()
        {

            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            //获取传递的参数
            string GID = PublicClass.FilterRequestTrim("GID");
            if (string.IsNullOrWhiteSpace(GID))
            {
                return null;
            }

            ViewBag.GID = GID; //商品ID

            //获取选择的买家收货地址  选择收货地址Cookie =  BReceiAddrID ^ 430000_430100_430121 ^ 湖南省_长沙市_长沙县
            ViewBag.BuyerReceiAddrSelCookieArr = PublicClass.getCookieValue("BuyerReceiAddrSelCookieArr");

            //---------获取买家分享商品的KeyEn参数---------//
            string _keyEn = PublicClass.FilterRequestTrimNoConvert("KeyEn");
            if (string.IsNullOrWhiteSpace(_keyEn) == false)
            {
                BusiWebCookie.setBuyerShareGoodsCookie(_keyEn);
            }
            else
            {
                PublicClass.clearCookieValue("BuyerShareGoodsCookie");
            }


            #region【判断是否可以打开小程序版】

            try
            {
                //KeyEn=xvLJ0tq65CQoRXxX+3UzkOfQVhTWCvhiNZDTeoTVynNHDX5YhTHH6WmycxUUlhLd/om1hWvJFOsCk7mwSvqBbE5akSk1oig92WWVuJAlw6xzciGXLs9hcqcEWaoLc1GjrWzyGWa3daLjSK7q+miOh9mUp5yWeZNWQiXXwKRdZOc=
                //小程序中会省略“=”所有需要转成“~”然后在小程序端后台转换过来,发送参数中不能有“%”否则不能别.跳转的小程序页面路径也必须正确，否则返回错误
                _keyEn = _keyEn.Replace("=", "~");
                //xvLJ0tq65CQoRXxX+3UzkOfQVhTWCvhiNZDTeoTVynNHDX5YhTHH6WmycxUUlhLd/om1hWvJFOsCk7mwSvqBbE5akSk1oig92WWVuJAlw6xzciGXLs9hcqcEWaoLc1GjrWzyGWa3daLjSK7q+miOh9mUp5yWeZNWQiXXwKRdZOc~

                //----测试的----//
                //string _wxUrlScheme = BusiCode.getMiniUrlScheme("/pages/tabbar/search/search", "GID=" + ViewBag.GID + "^KeyEn=" + _keyEn);

                //------正式的-----//
                string _wxUrlScheme = BusiCode.getMiniUrlScheme("/pages/goods/goodsdetail/goodsdetail", "GID=" + ViewBag.GID + "^KeyEn=" + _keyEn);

                ViewBag.WxUrlScheme = _wxUrlScheme;
            }
            catch { };


            #endregion


            return View();
        }

        /// <summary>
        /// 商品详情页，手机Web端预览，用Iframe指定宽度加载
        /// </summary>
        /// <returns></returns>
        public ActionResult GoodsDetailPreMobileIframe()
        {
            //获取传递的参数
            string GID = PublicClass.FilterRequestTrim("GID");
            if (string.IsNullOrWhiteSpace(GID))
            {
                return null;
            }

            ViewBag.GID = GID; //商品ID


            return View();
        }

        /// <summary>
        /// 拼团详情页，手机Web端预览，用Iframe指定宽度加载
        /// </summary>
        /// <returns></returns>
        public ActionResult GroupDetailPreMobileIframe()
        {
            //获取传递的参数
            string GID = PublicClass.FilterRequestTrim("GID");
            if (string.IsNullOrWhiteSpace(GID))
            {
                return null;
            }

            ViewBag.GID = GID; //商品ID


            return View();
        }

        /// <summary>
        /// 商品描述
        /// </summary>
        /// <returns></returns>
        public ActionResult GoodsDetailMsg()
        {
            //获取传递的参数
            string GID = PublicClass.FilterRequestTrim("GID");
            if (string.IsNullOrWhiteSpace(GID))
            {
                return null;
            }
            ViewBag.GID = GID; //商品ID

            //获取跳转返回的类型
            string Bt = PublicClass.FilterRequestTrim("Bt");
            if (Bt == "Group")
            {
                ViewBag.MainHref = "../Group/GroupDetail?GID=" + GID;
                ViewBag.MainName = "拼团";

                ViewBag.BtGroup = "Bt=Group";
            }
            else
            {
                ViewBag.MainHref = "../Goods/GoodsDetail?GID=" + GID;
                ViewBag.MainName = "商品";

                ViewBag.BtGroup = "";
            }

            return View();
        }

        /// <summary>
        /// 商品评价
        /// </summary>
        /// <returns></returns>
        public ActionResult GoodsAppraise()
        {
            //获取传递的参数
            string GID = PublicClass.FilterRequestTrim("GID");
            if (string.IsNullOrWhiteSpace(GID))
            {
                return null;
            }
            ViewBag.GID = GID; //商品ID

            //获取跳转返回的类型
            string Bt = PublicClass.FilterRequestTrim("Bt");
            if (Bt == "Group")
            {
                ViewBag.MainHref = "../Group/GroupDetail?GID=" + GID;
                ViewBag.MainName = "拼团";

                ViewBag.BtGroup = "Bt=Group";
            }
            else
            {
                ViewBag.MainHref = "../Goods/GoodsDetail?GID=" + GID;
                ViewBag.MainName = "商品";

                ViewBag.BtGroup = "";
            }

            return View();
        }

        #region【赠品相关】

        /// <summary>
        /// 赠品详情
        /// </summary>
        /// <returns></returns>
        public ActionResult GiftDetail()
        {
            //获取传递的参数
            ViewBag.GIID = PublicClass.FilterRequestTrim("GIID");

            ViewBag.BuyerUserID = BusiLogin.getLoginUserID();

            return View();
        }

        /// <summary>
        /// 赠品描述
        /// </summary>
        /// <returns></returns>
        public ActionResult GiftDetailMsg()
        {
            //获取传递的参数
            ViewBag.GIID = PublicClass.FilterRequestTrim("GIID");


            return View();
        }


        #endregion



    }
}