using CoordTransformNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【店铺】相关页面控制器
/// </summary>
namespace OctWapWeb.PageControllers.WebPage
{
    public class ShopController : Controller
    {
        /// <summary>
        /// 店铺首页
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            //商家管理平台域名
            ViewBag.OctShopSystemWeb_AddrDomain = WebAppConfig.OctShopSystemWeb_AddrDomain;

            //获取传递的参数
            ViewBag.ShopID = PublicClass.isReqAndBackReqVal("SID", "../Mall/Index");

            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];


            return View();
        }

        /// <summary>
        /// 店铺首页，手机Web端预览，用Iframe指定宽度加载
        /// </summary>
        /// <returns></returns>
        public ActionResult IndexPreMobileIframe()
        {
            //获取传递的参数
            string SID = PublicClass.FilterRequestTrim("SID");
            if (string.IsNullOrWhiteSpace(SID))
            {
                return null;
            }

            ViewBag.SID = SID; //店铺ID


            return View();
        }

        /// <summary>
        /// 店铺礼品
        /// </summary>
        /// <returns></returns>
        public ActionResult Present()
        {
            //获取传递的参数
            ViewBag.ShopID = PublicClass.isReqAndBackReqVal("SID", "../Mall/Index");

            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];


            return View();
        }

        /// <summary>
        /// 全部商品
        /// </summary>
        /// <returns></returns>
        public ActionResult GoodsAll()
        {
            //获取传递的参数
            ViewBag.ShopID = PublicClass.isReqAndBackReqVal("SID", "../Mall/Index");

            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            ViewBag.TabNum = PublicClass.FilterRequestTrim("TBN");

            return View();
        }

        /// <summary>
        /// 热门分类
        /// </summary>
        /// <returns></returns>
        public ActionResult GoodsType()
        {
            //获取传递的参数
            ViewBag.ShopID = PublicClass.isReqAndBackReqVal("SID", "../Mall/Index");

            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];


            return View();
        }

        /// <summary>
        /// 店铺分类下的商品列表
        /// </summary>
        /// <returns></returns>
        public ActionResult GoodsTypeDetail()
        {
            //获取传递的参数
            ViewBag.ShopID = PublicClass.isReqAndBackReqVal("SID", "../Mall/Index");

            ViewBag.ShopGoodsTypeID = PublicClass.isReqAndBackReqVal("SGTID", "../Mall/Index");

            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            return View();
        }

        /// <summary>
        /// 活动优惠
        /// </summary>
        /// <returns></returns>
        public ActionResult Activity()
        {
            //获取传递的参数
            ViewBag.ShopID = PublicClass.isReqAndBackReqVal("SID", "../Mall/Index");

            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            return View();
        }

        /// <summary>
        /// 活动详情
        /// </summary>
        /// <returns></returns>
        public ActionResult ActivityDetail()
        {
            string _AID = PublicClassNS.PublicClass.FilterRequestTrim("AID");
            if (string.IsNullOrWhiteSpace(_AID))
            {
                return Content("活动参数传递错误");
            }
            ViewBag.ActivityID = _AID;

            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            //获取当前的连接URL
            ViewBag.CurrentALink = Request.Url;

            return View();
        }

        /// <summary>
        /// 活动详情页，手机Web端预览，用Iframe指定宽度加载
        /// </summary>
        /// <returns></returns>
        public ActionResult ActivityDetailPreMobileIframe()
        {
            //获取传递的参数
            string AID = PublicClass.FilterRequestTrim("AID");
            if (string.IsNullOrWhiteSpace(AID))
            {
                return null;
            }

            ViewBag.AID = AID; //活动ID


            return View();
        }

        /// <summary>
        /// 商家信息详情
        /// </summary>
        /// <returns></returns>
        public ActionResult ShopMsgDetail()
        {
            //商家管理平台域名
            ViewBag.OctShopSystemWeb_AddrDomain = WebAppConfig.OctShopSystemWeb_AddrDomain;


            //获取传递的参数
            ViewBag.ShopID = PublicClass.isReqAndBackReqVal("SID", "../Mall/Index");

            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            return View();
        }

        /// <summary>
        /// 店铺搜索
        /// </summary>
        /// <returns></returns>
        public ActionResult ShopSearch()
        {
            //获取传递的参数
            ViewBag.ShopID = PublicClass.isReqAndBackReqVal("SID", "../Mall/Index");
            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            return View();
        }

        /// <summary>
        /// 店铺搜索结果
        /// </summary>
        /// <returns></returns>
        public ActionResult ShopSearchResult()
        {
            //获取传递的参数
            ViewBag.ShopID = PublicClass.isReqAndBackReqVal("SID", "../Mall/Index");
            //获取登录的买家UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

            //获取搜索的内容
            ViewBag.SearchContent = Server.UrlDecode(PublicClass.isReqAndBackReqVal("SC", "../Shop/ShopSearch?SID=" + ViewBag.ShopID));

            return View();
        }

        /// <summary>
        /// 店铺地图导航URL链接中转页
        /// </summary>
        /// <returns></returns>
        public ActionResult MapUrlRedirect()
        {
            string _urlMap = "";

            //地图的类型
            string MapType = Request["MapType"].Trim();

            if (MapType == "bdmap")
            {
                //获取传递的参数
                string Longitude = Request["Longitude"].Trim();
                string Latitude = Request["Latitude"].Trim();
                string AddrName = Request["AddrName"].Trim();
                string AddrDetail = Request["AddrDetail"].Trim();

                //腾讯高德坐标转换成百度坐标
                Gps _gps = CoordTransform.Gcj02_To_Bd09(Convert.ToDouble(Longitude), Convert.ToDouble(Latitude));
                Longitude = _gps.lon.ToString();
                Latitude = _gps.lat.ToString();

                //http://api.map.baidu.com/marker?location=40.047669,116.313082&title=我的位置&content=百度奎科大厦&output=html&src=webapp.baidu.openAPIdemo

                _urlMap = "http://api.map.baidu.com/marker?location=" + Latitude + "," + Longitude + "&title=" + AddrName + "&content=" + AddrDetail + "&output=html&src=webapp.baidu.openAPIdemo&zoom=13";

                //直接跳转
                Response.Redirect(_urlMap);

            }
            //-----高德地图------//
            else if (MapType == "amap")
            {
                //判断是否在微信中访问
                bool _isWeiXin = PublicClassNS.PublicClass.isInWeiXinBrowse();
                if (_isWeiXin)
                {
                    return View();
                }
                else
                {
                    //获取传递的参数
                    string Longitude = Request["Longitude"].Trim();
                    string Latitude = Request["Latitude"].Trim();
                    string AddrName = Request["AddrName"].Trim();
                    string AddrDetail = Request["AddrDetail"].Trim();

                    _urlMap = "https://uri.amap.com/marker?position=" + Longitude + "," + Latitude + "&name=" + AddrName + "&src=mypage&coordinate=gaode&callnative=1";

                    //return Content(_urlMap);
                    //直接跳转
                    Response.Redirect(_urlMap);
                }
            }


            return null;
        }



    }
}