using BusiApiHttpNS;
using EncryptionClassNS;
using HttpServiceNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【商品】相关Ajax请求控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.AjaxPage
{
    public class GoodsController : Controller
    {
        // GET: Goods
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 发布商品,添加商品
        /// </summary>
        /// <returns></returns>
        [ValidateInput(false)]
        public string GoodsAdd()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }

            //获取商家登录UserID
            string mShopUserID = _loginBuyerUserID;

            //获取操作类型  Type=1 加载顶级商品类目列表 Type=2 加载第二级商品类目列表 Type=3 加载类目必填属性 Type=4 保存预写入的规格价格库存信息 Type=5 初始化规格属性窗口信息 Type=6 删除所有的预写入规格属性信息 Type=7 提交发布商品信息 Type=8 加载指定记录条数的 商品简单信息列表，根据第三级商品类目
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("FatherTypeID", "0");
                _dicPost.Add("IsLock", "true");

                //调用加载父级类目列表函数
                return BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_GooGoodsType, "UGS_GooGoodsType", "11", _dicPost);
            }
            //加载第二级商品类目列表
            else if (_exeType == "2")
            {
                //获取传递的参数
                string FatherTypeID = PublicClass.FilterRequestTrim("FatherTypeID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("FatherTypeID", FatherTypeID);
                _dicPost.Add("IsLock", "false");

                //调用加载父级类目列表函数
                return BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_GooGoodsType, "UGS_GooGoodsType", "11", _dicPost);
            }
            //加载类目必填属性
            else if (_exeType == "3")
            {
                //获取传递的参数
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("GoodsTypeID", GoodsTypeID);
                _dicPost.Add("IsLock", "false");

                //发送Http请求
                return BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGoodsTypeNeedProp, "UGS_GooGoodsTypeNeedProp", "5", _dicPost);
            }
            else if (_exeType == "4") //保存预写入的规格价格库存信息
            {
                //获取传递参数
                string MsgGuid = PublicClass.FilterRequestTrim("MsgGuid");
                string GoodsSpecPriceStockArr = PublicClass.FilterRequestTrimNoConvert("GoodsSpecPriceStockArr");

                //商家的UserID
                string ShopUserID = mShopUserID;

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("MsgGuid", MsgGuid);
                _dicPost.Add("ShopUserID", ShopUserID);
                _dicPost.Add("GoodsSpecPriceStockArr", GoodsSpecPriceStockArr);

                //发送Http请求
                return BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooSpecParamPre, "UGS_GooSpecParamPre", "1", _dicPost);
            }
            else if (_exeType == "5") //初始化规格属性窗口信息
            {
                //获取传递参数
                //string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string MsgGuid = PublicClass.FilterRequestTrim("MsgGuid");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("MsgGuid", MsgGuid);
                _dicPost.Add("ShopUserID", mShopUserID);

                //发送Http请求
                return BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooSpecParamPre, "UGS_GooSpecParamPre", "2", _dicPost);
            }
            else if (_exeType == "6") //删除所有的预写入规格属性信息 
            {
                //获取传递参数
                string MsgGuid = PublicClass.FilterRequestTrim("MsgGuid");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("MsgGuid", MsgGuid);
                _dicPost.Add("ShopUserID", mShopUserID);

                //发送Http请求
                return BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooSpecParamPre, "UGS_GooSpecParamPre", "3", _dicPost);
            }
            else if (_exeType == "7") //提交发布商品信息
            {
                // 获取传递的参数
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");
                string GoodsMsgGuid = PublicClass.FilterRequestTrim("GoodsMsgGuid");
                string GoodsTypeNeedProp = PublicClass.FilterRequestTrimNoConvert("GoodsTypeNeedProp");
                string GoodsTypeCustomProp = PublicClass.FilterRequestTrimNoConvert("GoodsTypeCustomProp");
                string GoodsTitle = PublicClass.FilterRequestTrim("GoodsTitle");

                string GoodsDesc = Request["GoodsDesc"].ToString().Trim();
                //过滤掉 GiftDesc 中的<Script /> 等标签
                GoodsDesc = PublicClass.FilterFrameset(PublicClass.FilterHrefScript(PublicClass.FilterIframe(PublicClass.FilterScript(GoodsDesc))));

                string GoodsSpecTitle = PublicClass.FilterRequestTrim("GoodsSpecTitle");
                string GoodsPropTitle = PublicClass.FilterRequestTrim("GoodsPropTitle");

                string GoodsImgArr = PublicClass.FilterRequestTrimNoConvert("GoodsImgArr");
                string GiftIDArr = PublicClass.FilterRequestTrimNoConvert("GiftIDArr");
                string ShopGoodsTypeID = PublicClass.FilterRequestTrim("ShopGoodsTypeID");
                string GoodsPrice = PublicClass.FilterRequestTrim("GoodsPrice");
                string StockNum = PublicClass.FilterRequestTrim("StockNum");
                string PackAfterSaleDesc = PublicClass.FilterRequestTrim("PackAfterSaleDesc");
                string IsPayDelivery = PublicClass.FilterRequestTrim("IsPayDelivery");
                string IsShopExpense = PublicClass.FilterRequestTrim("IsShopExpense");
                string IsOfflinePay = PublicClass.FilterRequestTrim("IsOfflinePay");

                //分销设置
                string IsDistri = PublicClass.FilterRequestTrim("IsDistri");
                string DistriMoney = PublicClass.FilterRequestTrim("DistriMoney");

                string IsShareGoods = PublicClass.FilterRequestTrim("IsShareGoods");
                string IsShowShareMoney = PublicClass.FilterRequestTrim("IsShowShareMoney");

                string MarketPrice = PublicClass.FilterRequestTrim("MarketPrice");
                string Discount = PublicClass.FilterRequestTrim("Discount");
                string FtID = PublicClass.FilterRequestTrim("FtID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("GoodsMsgGuid", GoodsMsgGuid);
                _dicPost.Add("GoodsTypeID", GoodsTypeID);
                _dicPost.Add("GoodsTypeNeedProp", GoodsTypeNeedProp);
                _dicPost.Add("GoodsTypeCustomProp", GoodsTypeCustomProp);
                _dicPost.Add("GoodsSpecTitle", GoodsSpecTitle);
                _dicPost.Add("GoodsPropTitle", GoodsPropTitle);
                _dicPost.Add("GoodsTitle", GoodsTitle);
                _dicPost.Add("GoodsDesc", EncryptionClass.EncodeBase64("UTF-8", GoodsDesc));
                _dicPost.Add("GoodsImgArr", GoodsImgArr);
                _dicPost.Add("GiftIDArr", GiftIDArr);
                _dicPost.Add("ShopGoodsTypeID", ShopGoodsTypeID);
                _dicPost.Add("GoodsPrice", GoodsPrice);
                _dicPost.Add("StockNum", StockNum);
                _dicPost.Add("PackAfterSaleDesc", PackAfterSaleDesc);
                _dicPost.Add("IsPayDelivery", IsPayDelivery);
                _dicPost.Add("IsShopExpense", IsShopExpense);
                _dicPost.Add("IsOfflinePay", IsOfflinePay);
                _dicPost.Add("IsDistri", IsDistri);
                _dicPost.Add("DistriMoney", DistriMoney);
                _dicPost.Add("IsShareGoods", IsShareGoods);
                _dicPost.Add("IsShowShareMoney", IsShowShareMoney);
                _dicPost.Add("ShopUserID", mShopUserID);
                _dicPost.Add("MarketPrice", MarketPrice);
                _dicPost.Add("Discount", Discount);
                _dicPost.Add("FtID", FtID);

                //发送Http请求
                return BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGoodsMsg, "UGS_GooGoodsMsg", "2", _dicPost);
            }
            else if (_exeType == "8") //加载指定记录条数的 商品简单信息列表，根据第三级商品类目
            {
                //获取传递的参数
                string GoodsTypeIDThird = PublicClass.FilterRequestTrim("GoodsTypeIDThird");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "22");
                _dicPost.Add("GoodsTypeIDThird", GoodsTypeIDThird);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_GooGoodsMsg, _dicPost);
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 编辑商品
        /// </summary>
        /// <returns></returns>
        [ValidateInput(false)]
        public string GoodsEdit()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }
            //获取商家登录UserID
            string mShopUserID = _loginBuyerUserID;

            //获取操作类型  Type=1 初始化商品信息 Type=2 保存商品信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递过来的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("GoodsID", GoodsID);
                _dicPost.Add("ShopUserID", mShopUserID);
                //发送Http请求
                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGoodsMsg, "UGS_GooGoodsMsg", "3", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //保存商品信息
            {
                // 获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");
                string GoodsMsgGuid = PublicClass.FilterRequestTrim("GoodsMsgGuid");
                string GoodsTypeNeedProp = PublicClass.FilterRequestTrimNoConvert("GoodsTypeNeedProp");
                string GoodsTypeCustomProp = PublicClass.FilterRequestTrimNoConvert("GoodsTypeCustomProp");
                string GoodsTitle = PublicClass.FilterRequestTrim("GoodsTitle");

                string GoodsDesc = "";
                try
                {
                    GoodsDesc = Request["GoodsDesc"].ToString().Trim();
                }
                catch { };


                //过滤掉 GiftDesc 中的<Script /> 等标签
                GoodsDesc = PublicClass.FilterFrameset(PublicClass.FilterHrefScript(PublicClass.FilterIframe(PublicClass.FilterScript(GoodsDesc))));

                string GoodsSpecTitle = PublicClass.FilterRequestTrim("GoodsSpecTitle");
                string GoodsPropTitle = PublicClass.FilterRequestTrim("GoodsPropTitle");

                string GoodsImgArr = PublicClass.FilterRequestTrimNoConvert("GoodsImgArr");
                string GiftIDArr = PublicClass.FilterRequestTrimNoConvert("GiftIDArr");
                string ShopGoodsTypeID = PublicClass.FilterRequestTrim("ShopGoodsTypeID");
                string GoodsPrice = PublicClass.FilterRequestTrim("GoodsPrice");
                string StockNum = PublicClass.FilterRequestTrim("StockNum");
                string PackAfterSaleDesc = PublicClass.FilterRequestTrim("PackAfterSaleDesc");
                string IsPayDelivery = PublicClass.FilterRequestTrim("IsPayDelivery");
                string IsShopExpense = PublicClass.FilterRequestTrim("IsShopExpense");
                string IsOfflinePay = PublicClass.FilterRequestTrim("IsOfflinePay");

                //分销设置
                string IsDistri = PublicClass.FilterRequestTrim("IsDistri");
                string DistriMoney = PublicClass.FilterRequestTrim("DistriMoney");

                string IsShareGoods = PublicClass.FilterRequestTrim("IsShareGoods");
                string IsShowShareMoney = PublicClass.FilterRequestTrim("IsShowShareMoney");

                string MarketPrice = PublicClass.FilterRequestTrim("MarketPrice");
                string Discount = PublicClass.FilterRequestTrim("Discount");
                string FtID = PublicClass.FilterRequestTrim("FtID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("GoodsID", GoodsID);
                _dicPost.Add("FtID", FtID);
                _dicPost.Add("GoodsMsgGuid", GoodsMsgGuid);
                _dicPost.Add("GoodsTypeID", GoodsTypeID);
                _dicPost.Add("GoodsTypeNeedProp", GoodsTypeNeedProp);
                _dicPost.Add("GoodsTypeCustomProp", GoodsTypeCustomProp);
                _dicPost.Add("GoodsSpecTitle", GoodsSpecTitle);
                _dicPost.Add("GoodsPropTitle", GoodsPropTitle);
                _dicPost.Add("GoodsTitle", GoodsTitle);
                _dicPost.Add("GoodsDesc", EncryptionClass.EncodeBase64("UTF-8", GoodsDesc));
                _dicPost.Add("GoodsImgArr", GoodsImgArr);
                _dicPost.Add("GiftIDArr", GiftIDArr);
                _dicPost.Add("ShopGoodsTypeID", ShopGoodsTypeID);
                _dicPost.Add("GoodsPrice", GoodsPrice);
                _dicPost.Add("StockNum", StockNum);
                _dicPost.Add("PackAfterSaleDesc", PackAfterSaleDesc);
                _dicPost.Add("IsPayDelivery", IsPayDelivery);
                _dicPost.Add("IsShopExpense", IsShopExpense);
                _dicPost.Add("IsOfflinePay", IsOfflinePay);

                _dicPost.Add("IsDistri", IsDistri);
                _dicPost.Add("DistriMoney", DistriMoney);
                _dicPost.Add("IsShareGoods", IsShareGoods);
                _dicPost.Add("IsShowShareMoney", IsShowShareMoney);

                _dicPost.Add("ShopUserID", mShopUserID);
                _dicPost.Add("MarketPrice", MarketPrice);
                _dicPost.Add("Discount", Discount);

                //发送Http请求
                return BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGoodsMsg, "UGS_GooGoodsMsg", "4", _dicPost);
            }


            return "";
        }

        /// <summary>
        /// 商品信息
        /// </summary>
        /// <returns></returns>
        public string GoodsMsg()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }
            //获取商家登录UserID
            string mShopUserID = _loginBuyerUserID;


            //获取操作类型  Type=1 数据分页 Type=2 上架下架商品 Type=3 得到商品没有规格属性时的库存和价格 Type=4 保存商品价格与库存，没有规格的情况 Type=5 批量切换 - 商家是否推荐商品 Type=6 批量删除商品信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string GoodsTitle = PublicClass.FilterRequestTrim("GoodsTitle");
                string GoodsStatus = PublicClass.FilterRequestTrim("GoodsStatus");
                string IsSpecParam = PublicClass.FilterRequestTrim("IsSpecParam");
                string IsUnSale = PublicClass.FilterRequestTrim("IsUnSale");
                string IsPayDelivery = PublicClass.FilterRequestTrim("IsPayDelivery");
                string IsShopExpense = PublicClass.FilterRequestTrim("IsShopExpense");
                string IsDistri = PublicClass.FilterRequestTrim("IsDistri");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("GoodsID", GoodsID);
                _dic.Add("GoodsTitle", GoodsTitle);
                _dic.Add("GoodsStatus", GoodsStatus);
                _dic.Add("IsSpecParam", IsSpecParam);
                _dic.Add("IsUnSale", IsUnSale);
                _dic.Add("IsPayDelivery", IsPayDelivery);
                _dic.Add("IsShopExpense", IsShopExpense);
                _dic.Add("IsDistri", IsDistri);
                _dic.Add("ShopUserID", mShopUserID);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGoodsMsg, "UGS_GooGoodsMsg", "1", _dic);
                return _json;
            }
            else if (_exeType == "2") //上架下架商品
            {
                // 获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string IsUnSale = PublicClass.FilterRequestTrim("IsUnSale");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", mShopUserID);
                _dic.Add("GoodsID", GoodsID);
                _dic.Add("IsUnSale", IsUnSale);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGoodsMsg, "UGS_GooGoodsMsg", "5", _dic);
                return _json;
            }
            else if (_exeType == "3") //初始化指定字段的商品信息
            {
                // 获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("GoodsID", GoodsID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGoodsMsg, "UGS_GooGoodsMsg", "6", _dic);
                return _json;
            }
            else if (_exeType == "4") //保存商品价格与库存，没有规格的情况
            {
                // 获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string GoodsPrice = PublicClass.FilterRequestTrim("GoodsPrice");
                string StockNum = PublicClass.FilterRequestTrim("StockNum");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("GoodsID", GoodsID);
                _dic.Add("ShopUserID", mShopUserID);
                _dic.Add("GoodsPrice", GoodsPrice);
                _dic.Add("StockNum", StockNum);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGoodsMsg, "UGS_GooGoodsMsg", "15", _dic);
                return _json;
            }
            else if (_exeType == "5") //批量切换 - 商家是否推荐商品
            {
                // 获取传递的参数
                string GoodsIDArr = PublicClass.FilterRequestTrim("GoodsIDArr");
                string IsShopCommend = PublicClass.FilterRequestTrim("IsShopCommend");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", mShopUserID);
                _dic.Add("GoodsIDArr", GoodsIDArr);
                _dic.Add("IsShopCommend", IsShopCommend);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGoodsMsg, "UGS_GooGoodsMsg", "17", _dic);
                return _json;
            }
            else if (_exeType == "6") //批量删除商品信息
            {
                // 获取传递的参数
                string GoodsIDArr = PublicClass.FilterRequestTrim("GoodsIDArr");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", mShopUserID);
                _dic.Add("GoodsIDArr", GoodsIDArr);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGoodsMsg, "UGS_GooGoodsMsg", "23", _dic);
                return _json;
            }
            return "";
        }

        /// <summary>
        /// 相册管理
        /// </summary>
        /// <returns></returns>
        public string Album()
        {

            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }

            //获取商家登录UserID
            string mShopUserID = _loginBuyerUserID;


            //获取操作类型  Type=1 数据分页  Type=2 建新相册 Type=3 保存相册标题 Type=4初始化相册信息 Type=5 单个删除相册
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("ShopUserID", mShopUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_FU_ShopAlbum, "FU_ShopAlbum", "5", _dic);
                return _json;

            }
            else if (_exeType == "2") //建新相册
            {
                // 获取传递的参数
                string AlbumTitle = PublicClass.FilterRequestTrim("AlbumTitle");
                string AlbumDesc = PublicClass.FilterRequestTrim("AlbumDesc");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", mShopUserID);
                _dic.Add("AlbumTitle", AlbumTitle);
                _dic.Add("AlbumDesc", AlbumDesc);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_FU_ShopAlbum, "FU_ShopAlbum", "1", _dic);
                return _json;
            }
            else if (_exeType == "3") //保存相册标题
            {
                // 获取传递的参数
                string AlbumTitle = PublicClass.FilterRequestTrim("AlbumTitle");
                string AlbumID = PublicClass.FilterRequestTrim("AlbumID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", mShopUserID);
                _dic.Add("AlbumID", AlbumID);
                _dic.Add("AlbumTitle", AlbumTitle);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_FU_ShopAlbum, "FU_ShopAlbum", "2", _dic);
                return _json;

            }
            else if (_exeType == "4") //初始化相册信息
            {
                // 获取传递的参数
                string AlbumID = PublicClass.FilterRequestTrim("AlbumID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("AlbumID", AlbumID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_FU_ShopAlbum, "FU_ShopAlbum", "6", _dic);
                return _json;
            }
            else if (_exeType == "5") //单个删除相册
            {
                // 获取传递的参数
                string AlbumID = PublicClass.FilterRequestTrim("AlbumID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("AlbumID", AlbumID);
                _dic.Add("ShopUserID", mShopUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_FU_ShopAlbum, "FU_ShopAlbum", "3", _dic);
                return _json;
            }



            return "";
        }

        /// <summary>
        /// 相册图片管理
        /// </summary>
        /// <returns></returns>
        public string AlbumImg()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }
            //获取商家登录UserID
            string mShopUserID = _loginBuyerUserID;

            //获取操作类型  Type=1 数据分页 Type=2 批量删除相册图片
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string AlbumID = PublicClass.FilterRequestTrim("AlbumID");

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("ShopUserID", mShopUserID);
                _dic.Add("AlbumID", AlbumID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_FU_ShopAlbumImg, "FU_ShopAlbumImg", "4", _dic);
                return _json;
            }
            else if (_exeType == "2") //批量删除相册图片
            {
                // 获取传递的参数
                string AlbumImgIDArr = PublicClass.FilterRequestTrim("AlbumImgIDArr");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", mShopUserID);
                _dic.Add("AlbumImgIDArr", AlbumImgIDArr);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_FU_ShopAlbumImg, "FU_ShopAlbumImg", "5", _dic);
                return _json;
            }




            return "";
        }

        /// <summary>
        /// 商品图片信息
        /// </summary>
        /// <returns></returns>
        public string GooGoodsImg()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }
            //获取商家登录UserID
            string mShopUserID = _loginBuyerUserID;


            //获取操作类型  Type=1 删除UploadGuid的商品图片信息 Type=2 数据分页 Type=3 批量删除商品图片信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UploadGuid", UploadGuid);
                _dic.Add("ShopUserID", mShopUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGoodsImg, "UGS_GooGoodsImg", "3", _dic);
                return _json;
            }
            else if (_exeType == "2") //数据分页
            {
                // 获取传递的参数

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("GoodsID", "");
                _dic.Add("ShopUserID", mShopUserID);


                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGoodsImg, "UGS_GooGoodsImg", "1", _dic);
                return _json;
            }
            else if (_exeType == "3") //批量删除商品图片信息
            {
                // 获取传递的参数
                string GoodsImgIDArr = PublicClass.FilterRequestTrim("GoodsImgIDArr");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("GoodsImgIDArr", GoodsImgIDArr);
                _dic.Add("ShopUserID", mShopUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGoodsImg, "UGS_GooGoodsImg", "4", _dic);
                return _json;
            }

            return "";

        }

        /// <summary>
        /// 添加赠品信息
        /// </summary>
        /// <returns></returns>
        [ValidateInput(false)]
        public string GooGiftMsg()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }
            //获取商家登录UserID
            string mShopUserID = _loginBuyerUserID;


            //获取操作类型  Type=1 提交赠品信息 Type=2 数据分页 Type=3 删除 单个或批量 赠品信息 Type=4 上架下架赠品 Type=5 初始化赠品信息 Type=6 加载商家赠品信息列表
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string GiftID = PublicClass.FilterRequestTrim("GiftID");
                string GiftName = PublicClass.FilterRequestTrim("GiftName");
                string GiftDesc = Request["GiftDesc"].ToString().Trim();
                string GiftPrice = PublicClass.FilterRequestTrim("GiftPrice");
                string StockNum = PublicClass.FilterRequestTrim("StockNum");
                string GiftImgUrlArr = PublicClass.FilterRequestTrimNoConvert("GiftImgUrlArr");
                string ShopUserID = mShopUserID;

                //过滤掉 GiftDesc 中的<Script /> 等标签
                GiftDesc = PublicClass.FilterFrameset(PublicClass.FilterHrefScript(PublicClass.FilterIframe(PublicClass.FilterScript(GiftDesc))));

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("GiftID", GiftID);
                _dicPost.Add("GiftName", GiftName);
                _dicPost.Add("GiftDesc", EncryptionClassNS.EncryptionClass.EncodeBase64("UTF-8", GiftDesc));
                _dicPost.Add("GiftPrice", GiftPrice);
                _dicPost.Add("StockNum", StockNum);
                _dicPost.Add("GiftImgUrlArr", GiftImgUrlArr);
                _dicPost.Add("ShopUserID", ShopUserID);

                string _Type = "2";
                if (string.IsNullOrWhiteSpace(GiftID) == false && GiftID != "0")
                {
                    _Type = "3"; //编辑
                }

                //发送Http请求
                return BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGiftMsg, "UGS_GooGiftMsg", _Type, _dicPost);
            }
            else if (_exeType == "2") //数据分页
            {
                // 获取传递的参数
                string GiftID = PublicClass.FilterRequestTrim("GiftID");
                string GiftName = PublicClass.FilterRequestTrim("GiftName");
                string GiftDesc = PublicClass.FilterRequestTrim("GiftDesc");
                string GiftPrice = PublicClass.FilterRequestTrim("GiftPrice");
                string StockNum = PublicClass.FilterRequestTrim("StockNum");
                string ShopUserID = mShopUserID;//PublicClass.FilterRequestTrim("ShopUserID");
                string IsUnSale = PublicClass.FilterRequestTrim("IsUnSale");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("GiftID", GiftID);
                _dic.Add("GiftName", GiftName);
                _dic.Add("GiftDesc", GiftDesc);
                _dic.Add("GiftPrice", GiftPrice);
                _dic.Add("StockNum", StockNum);
                _dic.Add("ShopUserID", ShopUserID);
                _dic.Add("IsUnSale", IsUnSale);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGiftMsg, "UGS_GooGiftMsg", "1", _dic);
                return _json;
            }
            else if (_exeType == "3") //删除 单个或批量 赠品信息
            {
                // 获取传递的参数
                string GiftIDArr = PublicClass.FilterRequestTrim("GiftIDArr");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("GiftIDArr", GiftIDArr);
                _dic.Add("ShopUserID", mShopUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGiftMsg, "UGS_GooGiftMsg", "7", _dic);
                return _json;
            }
            else if (_exeType == "4") //上架下架赠品
            {
                // 获取传递的参数
                string GiftID = PublicClass.FilterRequestTrim("GiftID");
                string IsUnSale = PublicClass.FilterRequestTrim("IsUnSale");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("GiftID", GiftID);
                _dic.Add("IsUnSale", IsUnSale);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGiftMsg, "UGS_GooGiftMsg", "5", _dic);
                return _json;
            }
            else if (_exeType == "5") //初始化赠品信息
            {
                // 获取传递的参数
                string GiftID = PublicClass.FilterRequestTrim("GiftID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("GiftID", GiftID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGiftMsg, "UGS_GooGiftMsg", "8", _dic);
                return _json;

            }
            else if (_exeType == "6") //加载商家赠品信息列表
            {
                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", mShopUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGiftMsg, "UGS_GooGiftMsg", "9", _dic);
                return _json;
            }

            return "";
        }

        /// <summary>
        /// 赠品图片
        /// </summary>
        /// <returns></returns>
        public string GooGiftImg()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }
            //获取商家登录UserID
            string mShopUserID = _loginBuyerUserID;


            //获取操作类型  Type=1 数据分页 Type=2 批量删除赠品图片
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string GiftImgID = PublicClass.FilterRequestTrim("GiftImgID");
                string GiftID = PublicClass.FilterRequestTrim("GiftID");
                string ImgURL = PublicClass.FilterRequestTrim("ImgURL");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", mShopUserID);
                _dic.Add("PageCurrent", pageCurrent);

                _dic.Add("GiftImgID", GiftImgID);
                _dic.Add("GiftID", GiftID);
                _dic.Add("ImgURL", ImgURL);
                _dic.Add("UploadGuid", UploadGuid);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGiftImg, "UGS_GooGiftImg", "1", _dic);
                return _json;
            }
            else if (_exeType == "2") //批量删除赠品图片
            {
                // 获取传递的参数
                string GiftImgIDArr = PublicClass.FilterRequestTrim("GiftImgIDArr");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", mShopUserID);
                _dic.Add("GiftImgIDArr", GiftImgIDArr);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGiftImg, "UGS_GooGiftImg", "2", _dic);
                return _json;
            }
            return "";
        }

        /// <summary>
        /// 商品规格属性信息
        /// </summary>
        /// <returns></returns>
        public string GooSpecParam()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }
            //获取商家登录UserID
            string mShopUserID = _loginBuyerUserID;

            //获取操作类型  Type=1 初始化商品规格属性信息 Type=2 保存商品规格属性信息 Type=3 删除所有商品规格属性信息 Type=4 保存 规格，价格，库存窗口  --优化后，不会删除重新插入啦
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("GoodsID", GoodsID);

                //发送Http请求
                return BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooSpecParam, "UGS_GooSpecParam", "2", _dicPost);
            }
            else if (_exeType == "2") //保存商品规格属性信息
            {
                //获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string SpecTitle = PublicClass.FilterRequestTrim("SpecTitle");
                string SpecAttrName = PublicClass.FilterRequestTrim("SpecAttrName");
                string GoodsSpecPriceStockArr = PublicClass.FilterRequestTrimNoConvert("GoodsSpecPriceStockArr");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("GoodsID", GoodsID);
                _dicPost.Add("ShopUserID", mShopUserID);
                _dicPost.Add("SpecTitle", SpecTitle);
                _dicPost.Add("SpecAttrName", SpecAttrName);
                _dicPost.Add("GoodsSpecPriceStockArr", GoodsSpecPriceStockArr);

                //发送Http请求
                return BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooSpecParam, "UGS_GooSpecParam", "3", _dicPost);
            }
            else if (_exeType == "3") //删除所有商品规格属性信息
            {
                //获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("GoodsID", GoodsID);
                _dicPost.Add("ShopUserID", mShopUserID);

                //发送Http请求
                return BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooSpecParam, "UGS_GooSpecParam", "4", _dicPost);
            }
            else if (_exeType == "4") //保存 规格，价格，库存窗口  --优化后，不会删除重新插入啦
            {
                //获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string SpecTitle = PublicClass.FilterRequestTrim("SpecTitle");
                string SpecAttrName = PublicClass.FilterRequestTrim("SpecAttrName");
                string GooSpecParamJson = PublicClass.FilterRequestTrimNoConvert("GooSpecParamJson");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("GoodsID", GoodsID);
                _dicPost.Add("GooSpecParamJson", GooSpecParamJson);
                _dicPost.Add("SpecTitle", SpecTitle);
                _dicPost.Add("SpecAttrName", SpecAttrName);
                //_dicPost.Add("ShopUserID", mShopUserID);

                //发送Http请求
                return BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooSpecParam, "UGS_GooSpecParam", "5", _dicPost);
            }

            return "";
        }

        /// <summary>
        /// 商品规格标题,属性标题
        /// </summary>
        /// <returns></returns>
        public string GooSpecParamName()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }


            //获取操作类型  Type=1 初始化商品规格属性总标题信息 
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("GoodsID", GoodsID);

                //发送Http请求
                return BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooSpecParamName, "UGS_GooSpecParamName", "5", _dicPost);
            }

            return "";
        }

        #region【商品店铺评价】

        /// <summary>
        /// 商品评价
        /// </summary>
        /// <returns></returns>
        public string GooAppraise()
        {
            //判断商家登录是否正确，并获取登录的UserID
            string _loginUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 数据分页 Type=2 统计店铺所有商品的评价信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string AppScore = PublicClass.FilterRequestTrim("AppScore");
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string AppContent = PublicClass.FilterRequestTrim("AppContent");
                string IsAnonymity = PublicClass.FilterRequestTrim("IsAnonymity");
                string CountAppraiseImg = PublicClass.FilterRequestTrim("CountAppraiseImg");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");


                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("AppScore", AppScore);
                _dic.Add("OrderID", OrderID);
                _dic.Add("GoodsID", GoodsID);
                _dic.Add("AppContent", AppContent);
                _dic.Add("IsAnonymity", IsAnonymity);
                _dic.Add("IsLock", "false");
                _dic.Add("CountAppraiseImg", CountAppraiseImg);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooAppraise, "UGS_GooAppraise", "5", _dic);
                return _json;
            }
            else if (_exeType == "2")  //统计店铺所有商品的评价信息
            {
                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooAppraise, "UGS_GooAppraise", "7", _dic);
                return _json;
            }

            return "";
        }

        /// <summary>
        /// 店铺评价
        /// </summary>
        /// <returns></returns>
        public string ShopAppraise()
        {

            //判断商家登录是否正确，并获取登录的UserID
            string _loginUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 数据分页 Type=2 统计店铺各评价信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string ConformityScore = PublicClass.FilterRequestTrim("ConformityScore");
                string AttitudeScore = PublicClass.FilterRequestTrim("AttitudeScore");
                string ExpressScore = PublicClass.FilterRequestTrim("ExpressScore");
                string DeliverymanScore = PublicClass.FilterRequestTrim("DeliverymanScore");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("OrderID", OrderID);
                _dic.Add("ConformityScore", ConformityScore);
                _dic.Add("AttitudeScore", AttitudeScore);
                _dic.Add("ExpressScore", ExpressScore);
                _dic.Add("DeliverymanScore", DeliverymanScore);
                _dic.Add("IsLock", "false");
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopAppraise, "UGS_ShopAppraise", "1", _dic);
                return _json;

            }
            else if (_exeType == "2") //统计店铺各评价信息
            {
                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopAppraise, "UGS_ShopAppraise", "5", _dic);
                return _json;
            }


            return "";
        }

        #endregion


    }
}