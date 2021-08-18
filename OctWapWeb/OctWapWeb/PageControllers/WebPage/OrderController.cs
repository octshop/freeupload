using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【订单】相关页面Controller
/// </summary>
namespace OctWapWeb.PageControllers.WebPage
{
    public class OrderController : Controller
    {
        // GET: Order
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 确认下单 -- 单个商品
        /// </summary>
        /// <returns></returns>
        public ActionResult PlaceOrder()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Order/PlaceOrder", "")))
            {
                return Content("用户登录错误！");
            }

            //标记发票的唯一性 GUID
            ViewBag.InvoiceGuid = PublicClass.CreateNewGuid();
            //订单的GUID （标记一次性提交的订单信息）
            ViewBag.OrderGuid = PublicClass.CreateNewGuid();

            ViewBag.GroupSettingID = "0";

            //得到订购的 商品Cookie拼接数组 _单个商品订购通道  用“^”拼接【GoodsID ^ OrderNum ^ SpecID ^ GroupSettingID】 
            string[] _orderGoodsMsgCookieArrSingle = BusiOrder.getOrderGoodsMsgCookieArrSingle();

            if (_orderGoodsMsgCookieArrSingle != null)
            {
                ViewBag.GoodsID = _orderGoodsMsgCookieArrSingle[0];
                ViewBag.OrderNum = _orderGoodsMsgCookieArrSingle[1];
                ViewBag.SpecID = _orderGoodsMsgCookieArrSingle[2];
                ViewBag.GroupSettingID = _orderGoodsMsgCookieArrSingle[3];
            }
            else
            {
                return Content("订购下单信息错误(用户登录出错)！！");
            }

            //获取传递的参数 -- 拼团相关
            ViewBag.IsGroup = PublicClass.FilterRequestTrim("IsGroup");
            ViewBag.GroupID = PublicClass.FilterRequestTrim("GroupID");


            //构造选择收货地址连接
            ViewBag.SelAddrBackHref = Server.UrlEncode(Request.Url.AbsoluteUri);




            return View();
        }

        /// <summary>
        /// 确认下单 -- 多商品多商家
        /// </summary>
        /// <returns></returns>
        public ActionResult PlaceOrderMul()
        {
            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Order/PlaceOrderMul")))
            {
                return Content("用户登录错误！");
            }


            return View();
        }

        /// <summary>
        /// 银行转账支付
        /// </summary>
        /// <returns></returns>
        public ActionResult BankTransfer()
        {
            //获取传递的参数
            string BillNum = PublicClass.FilterRequestTrim("BillNum");
            if (string.IsNullOrWhiteSpace(BillNum))
            {
                return Content("BillNum-交易号不能为空!");
            }

            //得到买家登录UserID
            ViewBag.BuyerUserID = BusiLogin.getLoginUserID();

            //生成上传GUID
            ViewBag.ImgKeyGuid = PublicClass.CreateNewGuid();

            ViewBag.BillNum = BillNum;

            return View();
        }

        #region 【订单详情相关页】

        /// <summary>
        /// 订单详情
        /// </summary>
        /// <returns></returns>
        public ActionResult OrderDetail()
        {
            //获取传递的参数
            string _hidOrderID = PublicClass.FilterRequestTrim("OID");
            if (string.IsNullOrWhiteSpace(_hidOrderID))
            {
                return Content("订单ID错误！");
            }

            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Order/OrderDetail")))
            {
                return Content("用户登录错误！");
            }

            ViewBag.OrderID = _hidOrderID;

            //是否修改更新收货地址
            string _hidBID = PublicClass.FilterRequestTrim("BID");
            if (string.IsNullOrWhiteSpace(_hidBID) == false)
            {
                ViewBag.BReceiAddrID = _hidBID;
            }


            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain;


            return View();
        }

        /// <summary>
        /// 订单快递 详情页
        /// </summary>
        /// <returns></returns>
        public ActionResult ExpressDetail()
        {
            //获取传递的参数
            string _hidOrderID = PublicClass.FilterRequestTrim("OID");
            if (string.IsNullOrWhiteSpace(_hidOrderID))
            {
                return Content("订单ID错误！");
            }

            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Order/ExpressDetail")))
            {
                return Content("用户登录错误！");
            }

            ViewBag.OrderID = _hidOrderID;


            return View();
        }

        /// <summary>
        /// 订单动态
        /// </summary>
        /// <returns></returns>
        public ActionResult OrderDynamic()
        {
            //获取传递的参数
            string _hidOrderID = PublicClass.FilterRequestTrim("OID");
            if (string.IsNullOrWhiteSpace(_hidOrderID))
            {
                return Content("订单ID错误！");
            }

            //---判断用户是否登录---//
            if (string.IsNullOrWhiteSpace(BusiLogin.isLoginPageRetrunUserID("../Order/OrderDetail")))
            {
                return Content("用户登录错误！");
            }

            ViewBag.OrderID = _hidOrderID;


            return View();
        }

        #endregion

    }
}