using HttpServiceNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【店铺】相关Api控制器
/// </summary>
namespace OctMallMiniWeb.PageControllers.ApiPage
{
    public class ShopApiController : Controller
    {


        /// <summary>
        /// 店铺首页
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

            //获取操作类型  Type=1 加载店铺首页信息 Type=2 加载店铺轮播图片信息列表 Type=3 加载店铺中指定记录条数的可领取的优惠券列表 Type=4 买家获取优惠券 单个获取 Type=5 初始化店铺首页顶部条信息 Type=6 店铺猜你喜欢
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "3");
                _dicPost.Add("ShopID", ShopID);
                _dicPost.Add("BuyerUserID", BuyerUserID);
                _dicPost.Add("ShopUserID", "0");

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_ShopHomeData, _dicPost);
                return _jsonBack;

            }
            else if (_exeType == "2") //加载店铺轮播图片信息列表
            {
                //获取传递参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "7");
                _dicPost.Add("CarouselType", "ShopHome");
                _dicPost.Add("ShopID", ShopID);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_ShopCarousel, _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "3") //加载店铺中指定记录条数的可领取的优惠券列表
            {
                //获取传递参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                string LoadNum = PublicClass.FilterRequestTrim("LoadNum");
                if (string.IsNullOrWhiteSpace(LoadNum))
                {
                    LoadNum = "4";
                }

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "13");
                _dicPost.Add("LoadNum", LoadNum);
                _dicPost.Add("ShopID", ShopID);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_T_CouponsMsg, _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "4") //买家获取优惠券 单个获取
            {
                // 获取传递的参数
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("CouponsID", CouponsID);
                _dicPost.Add("BuyerUserID", BuyerUserID);

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_CouponsMsg, "T_CouponsMsg", "8", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "5") //初始化店铺首页顶部条信息
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "17");
                _dicPost.Add("ShopID", ShopID);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_ShopMsg, _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "6") //店铺猜你喜欢
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //获取登录的买家UserID
                string BuyerUserID = _loginUserID; //PublicClass.FilterRequestTrim("BuyerUserID"); //BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");


                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "1");
                _dicPost.Add("PageCurrent", PageCurrent);
                _dicPost.Add("ShopID", ShopID);
                _dicPost.Add("ShopUserID", ShopUserID);
                _dicPost.Add("BuyerUserID", BuyerUserID);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_ShopGuessYouLike, _dicPost);
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 店铺信息
        /// </summary>
        /// <returns></returns>
        public string ShopMsg()
        {

            //获取操作类型  Type=1 初始化店铺地址坐标相关信息 Type=2  加载店铺条相关信息(前端)如:商品详情页的店铺信息 Type=3 设置店铺主推荐新注册用户的Cookie
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "2")  // 加载店铺条相关信息(前端)如:商品详情页的店铺信息
            {
                // 获取传递的参数
                //ShopID 和 ShopUserID 必须有一个不为空
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //是否加载店铺商品的预览列表 [ true / false ]
                string IsLoadGoods = PublicClass.FilterRequestTrim("IsLoadGoods"); //可选

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "14");
                _dicPost.Add("ShopID", ShopID);
                _dicPost.Add("ShopUserID", ShopUserID);
                _dicPost.Add("IsLoadGoods", IsLoadGoods);

                //调用加载父级类目列表函数
                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_ShopMsg, _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "3") //设置店铺主推荐新注册用户的Cookie
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string BindMobile = PublicClass.FilterRequestTrim("BindMobile");

                ////-----如果买家已登录则不设置店铺主推荐新注册用户的Cookie-----//
                //if (string.IsNullOrWhiteSpace(BusiLogin.getLoginUserID()))
                //{
                //    //设置 店铺主推荐新注册用户 的Cookie 拼接值 【ShopUserIDPromoteBuyerCookie】
                //    //Cookie 拼接值 “ ShopUserID ^ ShopID ^ BindMobile”
                //    string _cookieValArr = ShopUserID + "^" + ShopID + "^" + BindMobile;
                //    BusiWebCookie.setShopUserIDPromoteBuyerCookie(_cookieValArr);
                //}
                //else
                //{
                //    BusiWebCookie.clearShopUserIDPromoteBuyerCookie();
                //}

                return "31";
            }

            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }

            if (_exeType == "1")
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "13");
                _dicPost.Add("ShopID", ShopID);
                _dicPost.Add("BuyerUserID", _loginUserID);

                //调用加载父级类目列表函数
                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_ShopMsg, _dicPost);
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 商家信息详情
        /// </summary>
        /// <returns></returns>
        public string ShopMsgDetail()
        {
            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }


            //获取操作类型  Type=1  加载店铺详细信息 ,店铺信息详细页 Type=2 加载店铺Logo门头照片
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "18");
                _dicPost.Add("ShopID", ShopID);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_ShopMsg, _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //加载店铺Logo门头照片
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "3");
                _dicPost.Add("ShopID", ShopID);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_ShopLogoImg, _dicPost);
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 全部商品
        /// </summary>
        /// <returns></returns>
        public string GoodsAll()
        {
            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }

            //获取操作类型  Type=1 搜索数据分页  Type=2 快捷加入购物车，不需要带规格属性ID
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递参数
                //搜索条件拼接字符串 "^"
                string SearchWhereArr = PublicClass.FilterRequestTrim("SearchWhereArr");
                //分解拼接字符串
                string[] _SearchWhereArr = PublicClass.splitStringJoinChar(SearchWhereArr);


                string ShopID = _SearchWhereArr[0];
                //Commend 推荐 SaleCount 销量 GoodsPriceAsc 价格升序 GoodsPriceDesc 价格降序 WriteDate 新品 Discount 打折  GroupMsgCount 团购  SecKill  秒杀
                string PageOrderName = _SearchWhereArr[1];
                //是否只加载打折的商品 ( true / false )
                string IsOnlyDiscount = _SearchWhereArr[2];

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "1");
                _dicPost.Add("PageCurrent", PageCurrent);

                _dicPost.Add("ShopID", ShopID);
                _dicPost.Add("PageOrderName", PageOrderName);
                _dicPost.Add("IsOnlyDiscount", IsOnlyDiscount);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_ShopHomeData, _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //快捷加入购物车，不需要带规格属性ID
            {
                //判断买家登录是否正确，并获取登录的UserID
                // string _loginUserID = BusiLogin.isLoginRetrunUserID();
                if (string.IsNullOrWhiteSpace(_loginUserID))
                {
                    return "";
                }

                //获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string OrderNum = "1";

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("GoodsID", GoodsID);
                _dicPost.Add("BuyerUserID", _loginUserID);
                _dicPost.Add("OrderNum", OrderNum);

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_SCart, "UGS_SCart", "5", _dicPost);
                return _jsonBack;

            }

            return "";
        }

        /// <summary>
        /// 店铺活动
        /// </summary>
        /// <returns></returns>
        public string Activity()
        {
            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }


            //获取操作类型  Type=1 加载店铺活动信息,活动，抽奖
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "4");
                _dicPost.Add("ShopID", ShopID);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_ShopHomeData, _dicPost);
                return _jsonBack;

            }

            return "";
        }

        /// <summary>
        /// 店铺热门分类
        /// </summary>
        /// <returns></returns>
        public string GoodsType()
        {
            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }

            //获取操作类型  Type=1 加载店铺商品分类
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "6");
                _dicPost.Add("ShopID", ShopID);
                _dicPost.Add("IsLock", "false");

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_ShopGoodsType, _dicPost);
                return _jsonBack;

            }
            return "";
        }

        /// <summary>
        /// 店分类 显示商品
        /// </summary>
        /// <returns></returns>
        public string GoodsTypeDetail()
        {
            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }

            //获取操作类型  Type=1 数据搜索分页 Type=2 初始化店铺商品分类信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递参数
                //搜索条件拼接字符串 "^"   mShopID + "^" + pPageOrderName + "^" + pIsOnlyDiscount + "^" + mShopGoodsTypeID;
                string SearchWhereArr = PublicClass.FilterRequestTrim("SearchWhereArr");
                //分解拼接字符串
                string[] _SearchWhereArr = PublicClass.splitStringJoinChar(SearchWhereArr);


                string ShopID = _SearchWhereArr[0];
                string ShopGoodsTypeID = _SearchWhereArr[3];

                //Commend 推荐 SaleCount 销量 GoodsPriceAsc 价格升序 GoodsPriceDesc 价格降序 WriteDate 新品 Discount 打折  GroupMsgCount 团购  SecKill  秒杀
                string PageOrderName = _SearchWhereArr[1];
                //是否只加载打折的商品 ( true / false )
                string IsOnlyDiscount = _SearchWhereArr[2];

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "1");
                _dicPost.Add("PageCurrent", PageCurrent);

                _dicPost.Add("ShopID", ShopID);
                _dicPost.Add("PageOrderName", PageOrderName);
                _dicPost.Add("IsOnlyDiscount", IsOnlyDiscount);
                _dicPost.Add("ShopGoodsTypeID", ShopGoodsTypeID);


                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_ShopHomeData, _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //初始化店铺商品分类信息
            {
                //获取传递的参数
                string ShopGoodsTypeID = PublicClass.FilterRequestTrim("ShopGoodsTypeID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "7");
                _dicPost.Add("ShopGoodsTypeID", ShopGoodsTypeID);
                _dicPost.Add("IsLock", "false");

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_ShopGoodsType, _dicPost);
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 店铺礼品
        /// </summary>
        /// <returns></returns>
        public string Present()
        {
            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }

            //获取操作类型  Type=1 搜索数据分页
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递参数
                //搜索条件拼接字符串 "^"
                string SearchWhereArr = PublicClass.FilterRequestTrim("SearchWhereArr");
                //分解拼接字符串
                string[] _SearchWhereArr = PublicClass.splitStringJoinChar(SearchWhereArr);

                string ShopID = _SearchWhereArr[0];


                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "7");
                _dicPost.Add("PageCurrent", PageCurrent);
                _dicPost.Add("ShopID", ShopID);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_PresentMsg, _dicPost);
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 店铺搜索
        /// </summary>
        /// <returns></returns>
        public string ShopSearch()
        {
            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }

            //获取操作类型  Type=1 加载买家商品店铺搜索历史 Type=2 删除商品搜索历史
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1")
            {
                //获取登录的买家UserID
                string BuyerUserID = _loginUserID;
                //未登录
                if (string.IsNullOrWhiteSpace(BuyerUserID))
                {
                    return "";
                }


                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", BuyerUserID);
                _dicPost.Add("TopNum", "16");
                _dicPost.Add("SearchType", "Goods");

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_SearchHistoryGoodsShop, "ADV_SearchHistoryGoodsShop", "2", _dicPost);
                return _jsonBack;

            }
            else if (_exeType == "2") //删除商品搜索历史
            {
                //获取登录的买家UserID
                string BuyerUserID = _loginUserID;
                //未登录
                if (string.IsNullOrWhiteSpace(BuyerUserID))
                {
                    return "";
                }


                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", BuyerUserID);
                _dicPost.Add("SearchType", "Goods");

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_SearchHistoryGoodsShop, "ADV_SearchHistoryGoodsShop", "3", _dicPost);
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 店铺搜索结果
        /// </summary>
        /// <returns></returns>
        public string ShopSearchResult()
        {
            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }

            //获取操作类型  Type=1 数据搜索分页 Type=2 添加买家商品搜索历史记录
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1")
            {
                //获取传递参数
                //搜索条件拼接字符串  mShopID + "^" + pPageOrderName + "^" + pIsOnlyDiscount + "^" + pSearchGoodsKey;
                string SearchWhereArr = PublicClass.FilterRequestTrim("SearchWhereArr");
                //分解拼接字符串
                string[] _SearchWhereArr = PublicClass.splitStringJoinChar(SearchWhereArr);


                string ShopID = _SearchWhereArr[0];
                //string ShopGoodsTypeID = _SearchWhereArr[3];

                //Commend 推荐 SaleCount 销量 GoodsPriceAsc 价格升序 GoodsPriceDesc 价格降序 WriteDate 新品 Discount 打折  GroupMsgCount 团购  SecKill  秒杀
                string PageOrderName = _SearchWhereArr[1];
                //是否只加载打折的商品 ( true / false )
                string IsOnlyDiscount = _SearchWhereArr[2];

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "1");
                _dicPost.Add("PageCurrent", PageCurrent);

                _dicPost.Add("ShopID", ShopID);
                _dicPost.Add("PageOrderName", PageOrderName);
                _dicPost.Add("IsOnlyDiscount", IsOnlyDiscount);
                _dicPost.Add("SearchGoodsKey", _SearchWhereArr[3]);


                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_ShopHomeData, _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //添加买家商品搜索历史记录
            {

                //获取登录的买家UserID
                string BuyerUserID = _loginUserID; // BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];
                //未登录
                if (string.IsNullOrWhiteSpace(BuyerUserID))
                {
                    return "";
                }

                //获取传递的参数
                string SearchContent = PublicClass.FilterRequestTrim("SearchContent");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", BuyerUserID);
                _dicPost.Add("SearchHistoryID", "0");
                _dicPost.Add("SearchContent", SearchContent);
                _dicPost.Add("SearchType", "Goods");

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_SearchHistoryGoodsShop, "ADV_SearchHistoryGoodsShop", "4", _dicPost);
                return _jsonBack;

            }

            return "";
        }


    }
}