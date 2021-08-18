using HttpServiceNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【商城】相关Ajax控制器
/// </summary>
namespace OctWapWeb.PageControllers.AjaxPage
{
    public class MallAjaxController : Controller
    {
        /// <summary>
        /// 商城首页 B2c
        /// </summary>
        /// <returns></returns>
        public string Index()
        {
            //获取操作类型  Type=1 加载轮播广告(所有的) Type=2 加载横幅通栏广告 Type=3 加载图片列表栏目广告 Type=4 加载不同类型的栏目图标导航信息 Type=5 平台猜你喜欢商品数据搜索分页-手机端
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1")
            {
                //获取传递的参数
                string AdvType = PublicClass.FilterRequestTrim("AdvType"); //"Home";
                string AdvTitleType = PublicClass.FilterRequestTrim("AdvTitleType"); //"";
                string AdvOsTypeFix = PublicClass.FilterRequestTrim("AdvOsTypeFix"); //"H5";

                //选填
                string SelCityRegionCodeArr = "";
                if (AdvType == "AdvO2o") //O2o页面
                {
                    SelCityRegionCodeArr = BusiWebCookie.getSelCityRegionCodeArrCookie();
                }
                string TopNum = "10";

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "2");
                _dicPost.Add("AdvType", AdvType);
                _dicPost.Add("AdvTitleType", AdvTitleType);
                _dicPost.Add("AdvOsTypeFix", AdvOsTypeFix);
                _dicPost.Add("SelCityRegionCodeArr", SelCityRegionCodeArr);
                _dicPost.Add("TopNum", TopNum);


                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_ADV_AdvCarousel, _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //加载横幅通栏广告  
            {
                // 获取传递的参数
                string AdvType = PublicClass.FilterRequestTrim("AdvType");
                string AdvTitleType = PublicClass.FilterRequestTrim("AdvTitleType");
                string AdvOsTypeFix = PublicClass.FilterRequestTrim("AdvOsTypeFix");
                //加载的记录条数据
                string TopNum = PublicClass.FilterRequestTrim("TopNum");

                //选填
                string SelCityRegionCodeArr = "";
                if (AdvType == "AdvO2o") //O2o页面
                {
                    SelCityRegionCodeArr = BusiWebCookie.getSelCityRegionCodeArrCookie();
                }

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "2");
                _dicPost.Add("AdvType", AdvType);
                _dicPost.Add("AdvTitleType", AdvTitleType);
                _dicPost.Add("AdvOsTypeFix", AdvOsTypeFix);
                _dicPost.Add("SelCityRegionCodeArr", SelCityRegionCodeArr);
                _dicPost.Add("TopNum", TopNum);


                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_ADV_AdvBanner, _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "3") //加载图片列表栏目广告
            {
                // 获取传递的参数
                string AdvType = PublicClass.FilterRequestTrim("AdvType");
                string AdvTitleType = PublicClass.FilterRequestTrim("AdvTitleType");

                //选填
                string SelCityRegionCodeArr = "";
                if (AdvType == "AdvO2o") //O2o页面
                {
                    SelCityRegionCodeArr = BusiWebCookie.getSelCityRegionCodeArrCookie();
                }

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "2");
                _dicPost.Add("AdvType", AdvType);
                _dicPost.Add("AdvTitleType", AdvTitleType);
                _dicPost.Add("AdvOsType", "H5");
                _dicPost.Add("SelCityRegionCodeArr", SelCityRegionCodeArr);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_ADV_AdvImgList, _dicPost);
                return _jsonBack;


            }
            else if (_exeType == "4") //加载不同类型的栏目图标导航信息
            {
                // 获取传递的参数
                string NavType = PublicClass.FilterRequestTrim("NavType");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "2");
                _dicPost.Add("NavType", NavType);
                _dicPost.Add("OsType", "H5");

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_ADV_NavIconMsg, _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "5") //平台猜你喜欢商品数据搜索分页-手机端
            {
                //获取登录的买家UserID
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");
                string BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];


                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");


                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "1");
                _dicPost.Add("PageCurrent", PageCurrent);
                _dicPost.Add("IsEntity", IsEntity);
                _dicPost.Add("BuyerUserID", BuyerUserID);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_MallGuessYouLike, _dicPost);
                return _jsonBack;
            }

            return "";
        }

        #region【平台搜索商品店铺】

        /// <summary>
        /// 搜索商品
        /// </summary>
        /// <returns></returns>
        public string SearchGoods()
        {
            //获取操作类型  Type=1 加载买家商品搜索历史 Type=2 删除商品搜索历史 Type=3 加载搜索发现内容 
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1")
            {
                //获取传递的参数
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");

                //获取登录的买家UserID
                string BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];
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
                _dicPost.Add("IsEntity", IsEntity);

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_SearchHistoryGoodsShop, "ADV_SearchHistoryGoodsShop", "2", _dicPost);
                return _jsonBack;

            }
            else if (_exeType == "2") //删除商品搜索历史
            {
                //获取登录的买家UserID
                string BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];
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
            else if (_exeType == "3") //加载搜索发现内容 
            {
                //获取传递的参数
                string FindType = PublicClass.FilterRequestTrim("FindType");
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");
                //string LoadNum = PublicClass.FilterRequestTrim("LoadNum");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "2");
                _dicPost.Add("FindType", FindType);
                _dicPost.Add("IsEntity", IsEntity);
                _dicPost.Add("LoadNum", "30");


                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_ADV_SearchFindMsg, _dicPost);
                return _jsonBack;

            }

            return "";
        }

        /// <summary>
        /// 搜索商品结果
        /// </summary>
        /// <returns></returns>
        public string SearchGoodsResult()
        {
            //获取操作类型  Type=1 数据搜索分页 Type=2 添加买家商品搜索历史记录 Type=3 得到商品类目必填属性集合
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1")
            {
                //获取传递参数
                //搜索条件拼接字符串  SearchKeyword + "^" + pPageOrderName + "^" + pIsOnlyDiscount + "^" + pIsOnlyGroup+ "^" + IsOnlySecKill
                string SearchWhereArr = PublicClass.FilterRequestTrim("SearchWhereArr");
                //分解拼接字符串
                string[] _SearchWhereArr = PublicClass.splitStringJoinChar(SearchWhereArr);

                //商品必填属性（属性名_属性值^属性名_属性值） [ 袖长_无袖^腰型_高腰^廓形_A型^当季热销_121^裙长_超短裙 ]
                string GoodsTypeNeedProp = PublicClass.FilterRequestTrim("GoodsTypeNeedProp");

                //第三级商品类目ID
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");
                //第二级类目ID
                string GoodsTypeIDSec = PublicClass.FilterRequestTrim("GoodsTypeIDSec");

                string IsPayDelivery = PublicClass.FilterRequestTrim("IsPayDelivery");
                string IsShopExpense = PublicClass.FilterRequestTrim("IsShopExpense");
                string IsOfflinePay = PublicClass.FilterRequestTrim("IsOfflinePay");
                string IsHasGift = PublicClass.FilterRequestTrim("IsHasGift");
                //是否为实体店商品 false / true
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");

                //是否只加载秒杀打折商品
                //string IsOnlySecKill = PublicClass.FilterRequestTrim("IsOnlySecKill");

                //搜索关键字
                string SearchKeyword = "";
                try
                {
                    SearchKeyword = _SearchWhereArr[0];
                }
                catch { };

                //Commend 推荐 SaleCount 销量 GoodsPriceAsc 价格升序 GoodsPriceDesc 价格降序 WriteDate 新品 Discount 打折  GroupMsgCount 团购  SecKill  秒杀
                string PageOrderName = "";
                try
                {
                    PageOrderName = _SearchWhereArr[1];
                }
                catch { };

                //是否只加载打折的商品 ( true / false )
                string IsOnlyDiscount = "";
                try
                {
                    IsOnlyDiscount = _SearchWhereArr[2];
                }
                catch { };
                //是否只加载团购商品 ( true / false )
                string IsOnlyGroup = "";
                try
                {
                    IsOnlyGroup = _SearchWhereArr[3];
                }
                catch { }
                //是否只加载秒杀打折商品 ( true / false )
                string IsOnlySecKill = "";
                try
                {
                    IsOnlySecKill = _SearchWhereArr[4];
                }
                catch { }



                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "1");
                _dicPost.Add("PageCurrent", PageCurrent);

                _dicPost.Add("SearchKeyword", SearchKeyword);
                _dicPost.Add("PageOrderName", PageOrderName);

                _dicPost.Add("IsOnlyDiscount", IsOnlyDiscount);
                _dicPost.Add("IsOnlyGroup", IsOnlyGroup);

                _dicPost.Add("GoodsTypeNeedProp", GoodsTypeNeedProp);
                _dicPost.Add("IsPayDelivery", IsPayDelivery);
                _dicPost.Add("IsShopExpense", IsShopExpense);
                _dicPost.Add("IsOfflinePay", IsOfflinePay);
                _dicPost.Add("IsHasGift", IsHasGift);
                _dicPost.Add("IsEntity", IsEntity);

                _dicPost.Add("GoodsTypeID", GoodsTypeID);
                _dicPost.Add("GoodsTypeIDSec", GoodsTypeIDSec);
                _dicPost.Add("IsOnlySecKill", IsOnlySecKill);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_GoodsSearch, _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //添加买家商品搜索历史记录
            {

                //获取登录的买家UserID
                string BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];
                //未登录
                if (string.IsNullOrWhiteSpace(BuyerUserID))
                {
                    return "";
                }

                //是否为实体店
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");

                //获取传递的参数
                string SearchContent = PublicClass.FilterRequestTrim("SearchContent");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", BuyerUserID);
                _dicPost.Add("SearchHistoryID", "0");
                _dicPost.Add("SearchContent", SearchContent);
                _dicPost.Add("SearchType", "Goods");
                _dicPost.Add("IsEntity", IsEntity);

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_SearchHistoryGoodsShop, "ADV_SearchHistoryGoodsShop", "4", _dicPost);
                return _jsonBack;

            }
            else if (_exeType == "3") //得到商品类目必填属性集合
            {
                // 获取传递的参数
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("GoodsTypeID", GoodsTypeID);

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GoodsSearch, "UGS_GoodsSearch", "3", _dicPost);
                return _jsonBack;
            }


            return "";
        }

        /// <summary>
        /// 搜索商品结果 O2o实体店商品结果
        /// </summary>
        /// <returns></returns>
        public string SearchGoodsResultO2o()
        {
            //获取操作类型  Type=1 数据搜索分页 Type=2 加载当前用户所在城市 的区县列表，没有登录则加载默认或已选择的
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1")
            {
                //获取传递参数
                //搜索条件拼接字符串 RegionCodeArr + "^" + pPageOrderName + "^" + SearchKeyword
                string SearchWhereArr = PublicClass.FilterRequestTrim("SearchWhereArr");
                //分解拼接字符串
                string[] _SearchWhereArr = PublicClass.splitStringJoinChar(SearchWhereArr);

                //第三级商品类目ID
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");
                //第二级类目ID
                string GoodsTypeIDSec = PublicClass.FilterRequestTrim("GoodsTypeIDSec");

                string IsOnlyDiscount = PublicClass.FilterRequestTrim("IsOnlyDiscount");
                string IsOnlyGroup = PublicClass.FilterRequestTrim("IsOnlyGroup");
                //是否只加载秒杀打折商品
                string IsOnlySecKill = PublicClass.FilterRequestTrim("IsOnlySecKill");


                //获取保存在Cookie中的定位信息
                string _cookieLngLat = PublicClass.getCookieValue("LngLatCookie");
                string _cookieLng = "";
                string _cookieLat = "";
                if (_cookieLngLat.IndexOf('^') > 0)
                {
                    string[] _lngLatArr = _cookieLngLat.Split('^');
                    _cookieLng = _lngLatArr[0];
                    _cookieLat = _lngLatArr[1];
                }



                //区域范围 区县代号 430121
                string RegionCountyCode = _SearchWhereArr[0];
                //区域范围 城市代号 430100
                string RegionCityCode = "";
                if (string.IsNullOrWhiteSpace(RegionCountyCode))
                {
                    //得到当前城市的代号 --Cookie中  -- 得到 用户选择的城市区域代号  - [ 430100 ]
                    RegionCityCode = BusiWebCookie.getSelCityRegionCodeCookie();
                }


                //排序方式 距离 Distance ，销量 SaleCount ，新品 WriteDate，价格 GoodsPriceAsc,GoodsPriceDesc，
                string PageOrderName = _SearchWhereArr[1];

                //搜索的关键字
                string SearchKeyword = _SearchWhereArr[2];

                //获取登录的买家UserID
                string BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

                //----获取当前页数-----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "4");
                _dicPost.Add("PageCurrent", PageCurrent);

                _dicPost.Add("BuyerUserID", BuyerUserID);
                _dicPost.Add("SearchKeyword", SearchKeyword);
                _dicPost.Add("PageOrderName", PageOrderName);
                _dicPost.Add("RegionCountyCode", RegionCountyCode);
                _dicPost.Add("RegionCityCode", RegionCityCode);

                _dicPost.Add("GoodsTypeID", GoodsTypeID);
                _dicPost.Add("GoodsTypeIDSec", GoodsTypeIDSec);

                _dicPost.Add("IsOnlyDiscount", IsOnlyDiscount);
                _dicPost.Add("IsOnlyGroup", IsOnlyGroup);
                _dicPost.Add("IsOnlySecKill", IsOnlySecKill);

                _dicPost.Add("CookieLng", _cookieLng);
                _dicPost.Add("CookieLat", _cookieLat);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_GoodsSearch, _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //加载当前用户所在城市 的区县列表，没有登录则加载默认或已选择的
            {
                //当前选择城市代号拼接 [湖南省_长沙市 , 430000_430100] 从Cookie中得到相关值 430000_430100
                string SelCityRegionCodeArr = BusiWebCookie.getSelCityRegionCodeArrCookie();

                //获取登录的买家UserID
                string BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "1");
                _dicPost.Add("BuyerUserID", BuyerUserID);
                _dicPost.Add("SelCityRegionCodeArr", SelCityRegionCodeArr);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_PubIndex, _dicPost);
                return _jsonBack;


            }


            return "";
        }

        /// <summary>
        /// 搜索店铺
        /// </summary>
        /// <returns></returns>
        public string SearchShop()
        {
            //获取操作类型  Type=1 加载买家店铺搜索历史 Type=2 删除店铺搜索历史
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1")
            {
                //获取传递的参数
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");

                //获取登录的买家UserID
                string BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];
                //未登录
                if (string.IsNullOrWhiteSpace(BuyerUserID))
                {
                    return "";
                }


                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", BuyerUserID);
                _dicPost.Add("TopNum", "16");
                _dicPost.Add("SearchType", "Shop");
                _dicPost.Add("IsEntity", IsEntity);

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_SearchHistoryGoodsShop, "ADV_SearchHistoryGoodsShop", "2", _dicPost);
                return _jsonBack;

            }
            else if (_exeType == "2") //删除商品搜索历史
            {
                //获取登录的买家UserID
                string BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];
                //未登录
                if (string.IsNullOrWhiteSpace(BuyerUserID))
                {
                    return "";
                }


                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", BuyerUserID);
                _dicPost.Add("SearchType", "Shop");

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_SearchHistoryGoodsShop, "ADV_SearchHistoryGoodsShop", "3", _dicPost);
                return _jsonBack;
            }


            return "";
        }

        /// <summary>
        /// 搜索店铺结果
        /// </summary>
        /// <returns></returns>
        public string SearchShopResult()
        {
            //获取操作类型  Type=1 数据搜索分页 Type=2 添加买家店铺搜索历史记录 
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1")
            {
                // 获取传递的参数
                string SearchKeyword = PublicClass.FilterRequestTrim("SearchKeyword");


                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "2");
                _dicPost.Add("PageCurrent", PageCurrent);
                _dicPost.Add("SearchKeyword", SearchKeyword);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_GoodsSearch, _dicPost);
                return _jsonBack;

            }
            else if (_exeType == "2") //添加买家店铺搜索历史记录 
            {
                //获取登录的买家UserID
                string BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];
                //未登录
                if (string.IsNullOrWhiteSpace(BuyerUserID))
                {
                    return "";
                }

                //获取传递的参数
                string SearchContent = PublicClass.FilterRequestTrim("SearchContent");
                //是否为实体店
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", BuyerUserID);
                _dicPost.Add("SearchHistoryID", "0");
                _dicPost.Add("SearchContent", SearchContent);
                _dicPost.Add("SearchType", "Shop");
                _dicPost.Add("IsEntity", IsEntity);

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_SearchHistoryGoodsShop, "ADV_SearchHistoryGoodsShop", "4", _dicPost);
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 搜索店铺结果 O2o实体店结果
        /// </summary>
        /// <returns></returns>
        public string SearchShopResultO2o()
        {
            //获取操作类型  Type=1 数据搜索分页
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1")
            {
                // 获取传递的参数
                string SearchKeyword = PublicClass.FilterRequestTrim("SearchKeyword");

                //店铺所属店铺分类
                string ShopTypeID = PublicClass.FilterRequestTrim("ShopTypeID");
                string FatherTypeID = PublicClass.FilterRequestTrim("FatherTypeID");

                //排序方式  距离 Distance  销量 SaleCount ，价格 GoodsPriceAsc,GoodsPriceDesc，
                string OrderBy = PublicClass.FilterRequestTrim("OrderBy");

                //是否加载额外数据类型 NoPreGoodsList
                string LoadTypeExtra = PublicClass.FilterRequestTrim("LoadTypeExtra");

                //获取保存在Cookie中的定位信息
                string _cookieLngLat = PublicClass.getCookieValue("LngLatCookie");
                string _cookieLng = "";
                string _cookieLat = "";
                if (_cookieLngLat.IndexOf('^') > 0)
                {
                    string[] _lngLatArr = _cookieLngLat.Split('^');
                    _cookieLng = _lngLatArr[0];
                    _cookieLat = _lngLatArr[1];
                }

                //区域范围 区县代号 430121
                string RegionCountyCode = PublicClass.FilterRequestTrim("RegionCountyCode"); ;

                //区域范围 城市代号 430100
                string RegionCityCode = "";
                if (string.IsNullOrWhiteSpace(RegionCountyCode))
                {
                    //得到当前城市的代号 --Cookie中  -- 得到 用户选择的城市区域代号  - [ 430100 ]
                    RegionCityCode = BusiWebCookie.getSelCityRegionCodeCookie();
                }


                //获取登录的买家UserID
                string BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "5");
                _dicPost.Add("PageCurrent", PageCurrent);
                _dicPost.Add("SearchKeyword", SearchKeyword);
                _dicPost.Add("BuyerUserID", BuyerUserID);
                _dicPost.Add("RegionCountyCode", RegionCountyCode);
                _dicPost.Add("RegionCityCode", RegionCityCode);
                _dicPost.Add("LoadTypeExtra", LoadTypeExtra);
                _dicPost.Add("ShopTypeID", ShopTypeID);
                _dicPost.Add("FatherTypeID", FatherTypeID);
                _dicPost.Add("OrderBy", OrderBy);

                _dicPost.Add("CookieLng", _cookieLng);
                _dicPost.Add("CookieLat", _cookieLat);


                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_GoodsSearch, _dicPost);
                return _jsonBack;

            }


            return "";
        }


        #endregion

        #region【商品分类】

        /// <summary>
        /// 商品分类
        /// </summary>
        /// <returns></returns>
        public string GoodsType()
        {
            //获取操作类型  Type=1 加载第二级商品类目 Type=2 加载第三级商品类目,根据第二级类目ID Type=3 根据第三级商品类目ID,加载所有同级的商品类目信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                //是否实体店分类(false /true )
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "12");
                _dicPost.Add("IsEntity", IsEntity);

                //调用加载父级类目列表函数
                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_GooGoodsType, _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //加载第三级商品类目,根据第二级类目ID
            {
                // 获取传递的参数
                string GoodsTypeIDSec = PublicClass.FilterRequestTrim("GoodsTypeIDSec");
                //是否实体店分类(false /true )
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "13");
                _dicPost.Add("GoodsTypeIDSec", GoodsTypeIDSec);
                _dicPost.Add("IsEntity", IsEntity);

                //调用加载父级类目列表函数
                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_GooGoodsType, _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "3") //根据第三级商品类目ID,加载所有同级的商品类目信息
            {
                // 获取传递的参数
                string GoodsTypeIDThird = PublicClass.FilterRequestTrim("GoodsTypeIDThird");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "14");
                _dicPost.Add("GoodsTypeIDThird", GoodsTypeIDThird);
                _dicPost.Add("IsEntity", "false");

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_GooGoodsType, _dicPost);
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 商品分类列表显示
        /// </summary>
        /// <returns></returns>
        public string GoodsTypeList()
        {
            return "";
        }

        /// <summary>
        /// 商品分类列表 详细
        /// </summary>
        /// <returns></returns>
        public string GoodsTypeListDetail()
        {
            return "";
        }

        #endregion

        #region【团购优惠】

        /// <summary>
        /// 团购优惠
        /// </summary>
        /// <returns></returns>
        public string GroupBuy()
        {

            return "";
        }

        #endregion

        #region【抢购秒杀】

        /// <summary>
        /// 抢购秒杀
        /// </summary>
        /// <returns></returns>
        public string SecondsKill()
        {

            return "";
        }

        #endregion

        #region【折扣商品】

        /// <summary>
        /// 折扣商品
        /// </summary>
        /// <returns></returns>
        public string DiscountGoods()
        {


            return "";
        }

        #endregion

        #region【礼品兑换】

        /// <summary>
        /// 礼品兑换
        /// </summary>
        /// <returns></returns>
        public string PresentExchange()
        {


            return "";
        }

        #endregion

        #region【领券中心】

        /// <summary>
        /// 领券中心
        /// </summary>
        /// <returns></returns>
        public string Coupons()
        {
            //获取操作类型 Type=1 平台优惠券展示 搜索分页数据 Type=2 加载所有优惠券店铺分类信息
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1")
            {
                // 获取传递的参数
                string ExpenseReachSum = PublicClass.FilterRequestTrim("ExpenseReachSum");
                string IsOfflineUse = PublicClass.FilterRequestTrim("IsOfflineUse");
                string ShopTypeID = PublicClass.FilterRequestTrim("ShopTypeID");
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");

                //区域范围 区县代号 430121
                string RegionCountyCode = PublicClass.FilterRequestTrim("RegionCountyCode");
                //区域范围 城市代号 430100
                string RegionCityCode = "";
                if (string.IsNullOrWhiteSpace(RegionCountyCode) && IsEntity == "true")
                {
                    //得到当前城市的代号 --Cookie中  -- 得到 用户选择的城市区域代号  - [ 430100 ]
                    RegionCityCode = BusiWebCookie.getSelCityRegionCodeCookie();
                }


                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");


                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "14");
                _dicPost.Add("PageCurrent", PageCurrent);

                _dicPost.Add("ExpenseReachSum", ExpenseReachSum);
                _dicPost.Add("IsOfflineUse", IsOfflineUse);
                _dicPost.Add("ShopTypeID", ShopTypeID);
                _dicPost.Add("IsEntity", IsEntity);
                _dicPost.Add("RegionCountyCode", RegionCountyCode);
                _dicPost.Add("RegionCityCode", RegionCityCode);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_T_CouponsMsg, _dicPost);
                return _jsonBack;

            }
            else if (_exeType == "2") //加载所有优惠券店铺分类信息
            {
                // 获取传递的参数
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "15");
                _dicPost.Add("IsEntity", IsEntity);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_T_CouponsMsg, _dicPost);
                return _jsonBack;
            }

            return "";
        }

        #endregion

        #region【幸运抽奖】

        /// <summary>
        /// 幸运抽奖
        /// </summary>
        /// <returns></returns>
        public string LuckyDraw()
        {


            return "";
        }

        /// <summary>
        /// 抽奖详情
        /// </summary>
        /// <returns></returns>
        public string LuckyDrawDetail()
        {

            return "";
        }

        #endregion

        #region【活动优惠】

        /// <summary>
        /// 活动优惠
        /// </summary>
        /// <returns></returns>
        public string Activity()
        {
            return "";
        }

        #endregion


    }
}