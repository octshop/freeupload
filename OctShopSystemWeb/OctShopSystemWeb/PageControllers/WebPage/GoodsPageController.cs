using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【商品】相关Page页面控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.WebPage
{
    public class GoodsPageController : Controller
    {
        // GET: GoodsPage
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 发布商品,添加商品
        /// </summary>
        /// <returns></returns>
        public ActionResult GoodsAdd()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../GoodsPage/GoodsAdd");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            //生成商品信息GUID
            ViewBag.GoodsMsgGuid = PublicClassNS.PublicClass.CreateNewGuid();
            //登录后的商家UserID
            ViewBag.ShopUserID = _shopUserID; //"1";

            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain;

            return View();
        }

        /// <summary>
        /// 编辑商品
        /// </summary>
        /// <returns></returns>
        public ActionResult GoodsEdit()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../GoodsPage/GoodsEdit");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain;

            //得到传递过来的参数
            string GoodsID = PublicClass.FilterRequestTrim("GID");
            if (string.IsNullOrWhiteSpace(GoodsID))
            {
                return Content("<div style=\"text-align:center; font-size: 14px;\"><b>商品信息错误或不存在！</b><a href=\"javascript:window.history.back(-1); \"> 返回 </a></div>");
            }
            ViewBag.GoodsID = GoodsID;

            //生成商品信息GUID
            ViewBag.GoodsMsgGuid = PublicClassNS.PublicClass.CreateNewGuid();

            //登录后的商家UserID
            ViewBag.ShopUserID = _shopUserID; //"1";

            return View();
        }

        /// <summary>
        /// 商品信息
        /// </summary>
        /// <returns></returns>
        public ActionResult GoodsMsg()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../GoodsPage/GoodsMsg");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            //商家UserID
            ViewBag.ShopUserID = _shopUserID;
            //生成商品信息GUID
            ViewBag.GoodsMsgGuid = PublicClassNS.PublicClass.CreateNewGuid();

            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain.ToString().Trim();


            return View();
        }

        /// <summary>
        /// 相册管理
        /// </summary>
        /// <returns></returns>
        public ActionResult Album()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../GoodsPage/Album");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        /// <summary>
        /// 相册图片管理
        /// </summary>
        /// <returns></returns>
        public ActionResult AlbumImg()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../GoodsPage/AlbumImg");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }


            //获取传递的参数
            string AID = PublicClass.FilterRequestTrim("AID");
            if (string.IsNullOrWhiteSpace(AID))
            {
                Response.Redirect("../GoodsPage/Album");
                return null;
            }
            ViewBag.AlbumID = AID;



            return View();
        }

        /// <summary>
        /// 相册图片批量上传
        /// </summary>
        /// <returns></returns>
        public ActionResult AlbumMulUploadImg()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../GoodsPage/AlbumMulUploadImg");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        /// <summary>
        /// 商品照片
        /// </summary>
        /// <returns></returns>
        public ActionResult GooGoodsImg()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../GoodsPage/GooGoodsImg");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain.ToString().Trim();

            return View();
        }

        /// <summary>
        /// 赠品管理
        /// </summary>
        /// <returns></returns>
        public ActionResult GooGiftMsg()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../GoodsPage/GooGiftMsg");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain;

            return View();
        }

        /// <summary>
        /// 赠品图片
        /// </summary>
        /// <returns></returns>
        public ActionResult GooGiftImg()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../GoodsPage/GooGiftImg");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        [ValidateInput(false)]
        /// <summary>
        /// 赠品添加
        /// </summary>
        /// <returns></returns>
        public ActionResult GooGiftMsgAdd()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../GoodsPage/GooGiftMsgAdd");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        [ValidateInput(false)]
        /// <summary>
        /// 赠品编辑
        /// </summary>
        /// <returns></returns>
        public ActionResult GooGiftMsgEdit()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../GoodsPage/GooGiftMsgEdit");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }


            ViewBag.GiftID = PublicClassNS.PublicClass.FilterRequestTrim("GiftID");
            if (string.IsNullOrWhiteSpace(ViewBag.GiftID))
            {
                Response.Redirect("../GoodsPage/GooGiftMsg");
            }

            return View();
        }

        #region【商品店铺评价】

        /// <summary>
        /// 商品评价
        /// </summary>
        /// <returns></returns>
        public ActionResult GooAppraise()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../GoodsPage/GooAppraise");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain.ToString().Trim();

            ViewBag.AppScore = PublicClass.FilterRequestTrim("AppScore");
            ViewBag.CountAppraiseImg = PublicClass.FilterRequestTrim("CountAppraiseImg");


            return View();
        }

        /// <summary>
        /// 店铺评价
        /// </summary>
        /// <returns></returns>
        public ActionResult ShopAppraise()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../GoodsPage/ShopAppraise");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        #endregion
    }
}