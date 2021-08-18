using HttpServiceNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【搜索】相关Api控制器
/// </summary>
namespace OctMallMiniWeb.PageControllers.ApiPage
{
    public class SearchApiController : Controller
    {

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
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID"); //BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];
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
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID"); //BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];
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
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID"); //BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];
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
                string _cookieLngLat = PublicClass.FilterRequestTrimNoConvert("LngLatCookie"); //PublicClass.getCookieValue("LngLatCookie");
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
                string RegionCityCode = PublicClass.FilterRequestTrim("RegionCityCode");
                if (string.IsNullOrWhiteSpace(RegionCountyCode))
                {
                    //得到当前城市的代号 --Cookie中  -- 得到 用户选择的城市区域代号  - [ 430100 ]
                    //RegionCityCode = BusiWebCookie.getSelCityRegionCodeCookie();
                }


                //排序方式 距离 Distance ，销量 SaleCount ，新品 WriteDate，价格 GoodsPriceAsc,GoodsPriceDesc，
                string PageOrderName = _SearchWhereArr[1];

                //搜索的关键字
                string SearchKeyword = _SearchWhereArr[2];

                //获取登录的买家UserID
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID"); //BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

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
                string SelCityRegionCodeArr = PublicClass.FilterRequestTrim("SelCityRegionCodeArr"); //BusiWebCookie.getSelCityRegionCodeArrCookie();

                //获取登录的买家UserID
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID"); //BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

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
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID"); //BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];
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
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");  //BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];
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
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID"); //BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];
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
                string _cookieLngLat = PublicClass.FilterRequestTrimNoConvert("LngLatCookie"); //PublicClass.getCookieValue("LngLatCookie");
                string _cookieLng = "";
                string _cookieLat = "";
                if (_cookieLngLat.IndexOf('^') > 0)
                {
                    string[] _lngLatArr = _cookieLngLat.Split('^');
                    _cookieLng = _lngLatArr[0];
                    _cookieLat = _lngLatArr[1];
                }

                //区域范围 区县代号 430121
                string RegionCountyCode = PublicClass.FilterRequestTrim("RegionCountyCode");

                //区域范围 城市代号 430100
                string RegionCityCode = PublicClass.FilterRequestTrim("RegionCityCode");
                if (string.IsNullOrWhiteSpace(RegionCountyCode))
                {
                    //得到当前城市的代号 --Cookie中  -- 得到 用户选择的城市区域代号  - [ 430100 ]
                    //RegionCityCode = BusiWebCookie.getSelCityRegionCodeCookie();
                }


                //获取登录的买家UserID
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID"); // BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

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


    }
}