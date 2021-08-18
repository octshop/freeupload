using OctUserGoodsShopSystemNS;
using PublicClassNS;
using RegionCodeNameNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【搜索】相关的API接口控制器
/// </summary>
namespace OctUserGoodsShopSystemWeb.PageControllers.ApiPage
{
    public class SearchController : Controller
    {
        /// <summary>
        /// 商品的搜索 / 店铺的搜索
        /// </summary>
        /// <returns></returns>
        public string GoodsSearch()
        {

            //获取操作类型  Type=1  平台搜索商品分页-手机端 Type=2 平台店铺搜索分页-手机端 Type=3 得到商品类目必填属性集合 Type=4 平台搜索商品分页O2o实体店坐标-手机端 Type=5  平台店铺搜索分页O2o实体店坐标-手机端
            string _exeType = PublicClass.FilterRequestTrim("Type");

            //-------------无需要验证签名------------//

            if (_exeType == "1") //平台搜索商品分页-手机端
            {
                // 获取传递的参数
                string SearchKeyword = PublicClass.FilterRequestTrim("SearchKeyword");

                //商品必填属性（属性名_属性值^属性名_属性值） [ 袖长_无袖^腰型_高腰^廓形_A型^当季热销_121^裙长_超短裙 ]
                string GoodsTypeNeedProp = PublicClass.FilterRequestTrim("GoodsTypeNeedProp");

                //第三级商品类目ID
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");
                //第二级类目ID
                string GoodsTypeIDSec = PublicClass.FilterRequestTrim("GoodsTypeIDSec");

                //支持货到付款
                string IsPayDelivery = PublicClass.FilterRequestTrim("IsPayDelivery");
                //支持到店消费/自取
                string IsShopExpense = PublicClass.FilterRequestTrim("IsShopExpense");
                //支持到店付
                string IsOfflinePay = PublicClass.FilterRequestTrim("IsOfflinePay");
                //支持到店付
                string IsHasGift = PublicClass.FilterRequestTrim("IsHasGift");

                //是否为实体店商品 false / true
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");

                //Commend 推荐 SaleCount 销量 GoodsPriceAsc 价格升序 GoodsPriceDesc 价格降序 WriteDate 新品 Discount 打折  GroupMsgCount 团购  SecKill  秒杀
                string PageOrderName = PublicClass.FilterRequestTrim("PageOrderName");

                //是否只加载打折的商品 ( true / false )
                string IsOnlyDiscount = PublicClass.FilterRequestTrim("IsOnlyDiscount");
                //是否只加载团购商品
                string IsOnlyGroup = PublicClass.FilterRequestTrim("IsOnlyGroup");
                //是否只加载秒杀打折商品
                string IsOnlySecKill = PublicClass.FilterRequestTrim("IsOnlySecKill");

                string _orderBy = "";

                //排序方式
                if (PageOrderName == "Commend") //推荐
                {
                    _orderBy = "PaidCount DESC,SaleCount DESC,FavGoodsCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "SaleCount") //销量
                {
                    _orderBy = "SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "GoodsPriceAsc") //价格升序
                {
                    _orderBy = "GoodsPrice ASC,SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "GoodsPriceDesc") //价格降序
                {
                    _orderBy = "GoodsPrice DESC,SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "WriteDate") //新品
                {
                    _orderBy = "WriteDate DESC,SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "Discount") //打折
                {
                    _orderBy = "Discount ASC,SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "GroupMsgCount") //团购
                {
                    _orderBy = "SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "SecKill") //秒杀
                {
                    _orderBy = "CountSecKill ASC,SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }


                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                GoodsTypeID = PublicClass.preventNumberDataIsNull(GoodsTypeID);
                GoodsTypeIDSec = PublicClass.preventNumberDataIsNull(GoodsTypeIDSec);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelVC_GoodsMsg_Search _modelVC_GoodsMsg_Search = new ModelVC_GoodsMsg_Search();
                _modelVC_GoodsMsg_Search.GoodsStatus = "售";
                _modelVC_GoodsMsg_Search.IsLock = "false";
                _modelVC_GoodsMsg_Search.IsUnSale = "false";
                _modelVC_GoodsMsg_Search.IsPayDelivery = IsPayDelivery;
                _modelVC_GoodsMsg_Search.IsShopExpense = IsShopExpense;
                _modelVC_GoodsMsg_Search.IsOfflinePay = IsOfflinePay;
                _modelVC_GoodsMsg_Search.GoodsTypeID = Convert.ToInt64(GoodsTypeID);
                _modelVC_GoodsMsg_Search.GoodsTypeIDSec = Convert.ToInt64(GoodsTypeIDSec);
                if (IsEntity == "true") //实体店商品
                {
                    _modelVC_GoodsMsg_Search.IsEntity = "true";
                }
                else
                {
                    _modelVC_GoodsMsg_Search.IsEntity = "false";
                }

                //是否查询团购商品
                if (PageOrderName == "GroupMsgCount")
                {
                    _modelVC_GoodsMsg_Search.GroupMsgCount = 1;
                }
                //是否秒杀
                if (PageOrderName == "SecKill")
                {
                    _modelVC_GoodsMsg_Search.CountSecKill = 1;
                }


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";


                //-----构造查询关键字 条件------//
                if (string.IsNullOrWhiteSpace(SearchKeyword) == false)
                {
                    _initSQLCharWhere = BusiSearch.splitSearchWhereGoodsKeyword(SearchKeyword);
                }
                else
                {
                    _initSQLCharWhere = "1=1";
                }


                //加入商品必填属性 限制
                if (string.IsNullOrWhiteSpace(GoodsTypeNeedProp) == false)
                {
                    _initSQLCharWhere = "(" + _initSQLCharWhere + ") AND (" + BusiSearch.splitSearchWhereGoodsTypeNeedProp(GoodsTypeNeedProp) + ")";
                }

                //是否为实体店商品 false / true
                if (IsEntity == "true")
                {
                    //O2o商品查询必须是 支持到店消费/自取
                    _initSQLCharWhere = "(" + _initSQLCharWhere + ") AND (IsShopExpense='true' OR IsShopExpense='both')";
                }
                else
                { //线上商品查询必须是 支持到店消费/自取
                    _initSQLCharWhere = "(" + _initSQLCharWhere + ") AND (IsShopExpense='false' OR IsShopExpense='both')";

                }


                //只加载打折
                if (IsOnlyDiscount == "true")
                {
                    _initSQLCharWhere = "(" + _initSQLCharWhere + ") AND Discount>0 AND (GroupMsgCount<=0 OR GroupMsgCount IS NULL)";
                }
                //只加载秒杀商品
                if (IsOnlySecKill == "true")
                {
                    _initSQLCharWhere = "(" + _initSQLCharWhere + ") AND SkDiscount>0 AND (GroupMsgCount<=0 OR GroupMsgCount IS NULL)";
                }
                //只加载团购商品
                if (IsOnlyGroup == "true")
                {
                    _initSQLCharWhere = "(" + _initSQLCharWhere + ") AND GroupMsgCount>0";
                }


                //查询秒杀
                if (PageOrderName == "SecKill")
                {
                    _initSQLCharWhere = "(" + _initSQLCharWhere + ") AND GroupMsgCount<=0 AND CountSecKill>=1";
                }
                //是否有赠品
                if (IsHasGift == "true")
                {
                    _initSQLCharWhere = "(" + _initSQLCharWhere + ") AND GiftIDArr<>'' AND GiftIDArr IS NOT NULL";
                }

                //如果没有排序则默认 已支付 排序
                if (string.IsNullOrWhiteSpace(PageOrderName))
                {
                    _orderBy = "PaidCount DESC,SaleCount DESC,FavGoodsCunt DESC,PageOrder DESC";
                }


                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder", "IsLock", "WriteDate", "Longitude", "Latitude" };
                string _strJson = BusiJsonPageStr.morePageJSONVC_GoodsMsg_Search(_modelVC_GoodsMsg_Search, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "wap", _orderBy);

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //平台店铺搜索分页-手机端
            {
                // 获取传递的参数
                string SearchKeyword = PublicClass.FilterRequestTrim("SearchKeyword");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelVC_ShopMsg_Search _modelVC_ShopMsg_Search = new ModelVC_ShopMsg_Search();
                _modelVC_ShopMsg_Search.IsCheck = "false";
                _modelVC_ShopMsg_Search.IsShow = "true";
                _modelVC_ShopMsg_Search.IsLock = "false";


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //-----构造查询关键字 条件------//
                _initSQLCharWhere = BusiSearch.splitSearchWhereShopKeyword(SearchKeyword);


                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder", "IsLock", "WriteDate" };
                string _strJson = BusiJsonPageStr.morePageJSONVC_ShopMsg_Search(_modelVC_ShopMsg_Search, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "wap", "SumPaidCount DESC,CountDiscount DESC,PageOrder DESC");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "3") //得到商品类目必填属性集合
            {
                // 获取传递的参数
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");

                //防止数字为空
                GoodsTypeID = PublicClass.preventNumberDataIsNull(GoodsTypeID);

                string _jsonBack = BusiSearch.getGoodsTypeNeedPropApi(Convert.ToInt64(GoodsTypeID));
                return _jsonBack;
            }
            else if (_exeType == "4") //平台搜索商品分页O2o实体店-手机端
            {
                // 获取传递的参数
                string SearchKeyword = PublicClass.FilterRequestTrim("SearchKeyword");

                //买家UserID,用于获取当前用坐标
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //第三级商品类目ID
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");
                //第二级类目ID
                string GoodsTypeIDSec = PublicClass.FilterRequestTrim("GoodsTypeIDSec");

                //区县的代号 430121
                string RegionCountyCode = PublicClass.FilterRequestTrimNoConvert("RegionCountyCode");
                //城市的代号 430100
                string RegionCityCode = PublicClass.FilterRequestTrimNoConvert("RegionCityCode");

                //排序方式 距离 Distance ，销量 SaleCount ，新品 WriteDate，价格 GoodsPriceAsc,GoodsPriceDesc，
                string PageOrderName = PublicClass.FilterRequestTrim("PageOrderName");

                //是否只加载打折的商品 ( true / false )
                string IsOnlyDiscount = PublicClass.FilterRequestTrim("IsOnlyDiscount");
                //是否只加载团购商品
                string IsOnlyGroup = PublicClass.FilterRequestTrim("IsOnlyGroup");
                //是否只加载秒杀打折商品
                string IsOnlySecKill = PublicClass.FilterRequestTrim("IsOnlySecKill");


                //Cookie中用户的经纬度
                string CookieLng = PublicClass.FilterRequestTrim("CookieLng");
                string CookieLat = PublicClass.FilterRequestTrim("CookieLat");


                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                GoodsTypeID = PublicClass.preventNumberDataIsNull(GoodsTypeID);
                GoodsTypeIDSec = PublicClass.preventNumberDataIsNull(GoodsTypeIDSec);


                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelVC_GoodsMsg_Search _modelVC_GoodsMsg_Search = new ModelVC_GoodsMsg_Search();
                _modelVC_GoodsMsg_Search.GoodsStatus = "售";
                _modelVC_GoodsMsg_Search.IsLock = "false";
                _modelVC_GoodsMsg_Search.IsUnSale = "false";
                _modelVC_GoodsMsg_Search.IsEntity = "true";
                _modelVC_GoodsMsg_Search.GoodsTypeID = Convert.ToInt64(GoodsTypeID);
                _modelVC_GoodsMsg_Search.GoodsTypeIDSec = Convert.ToInt64(GoodsTypeIDSec);

                if (string.IsNullOrWhiteSpace(RegionCountyCode) == false)
                {
                    //得到省，市，县区号
                    List<Dictionary<string, string>> _listDicRegion = RegionCodeName.getProvinceCityCountryByCountyRegionCode(RegionCountyCode);
                    _modelVC_GoodsMsg_Search.RegionCodeArr = _listDicRegion[2]["REGIONCODE"].ToString().Trim() + "_" + _listDicRegion[1]["REGIONCODE"].ToString().Trim() + "_" + _listDicRegion[0]["REGIONCODE"].ToString().Trim();
                }


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //-----构造查询关键字 条件------//
                if (string.IsNullOrWhiteSpace(SearchKeyword) == false)
                {
                    _initSQLCharWhere = BusiSearch.splitSearchWhereGoodsKeyword(SearchKeyword);
                }

                //选择的城市区县值如果为空（全部地区） 则显示当前城市所有的记录 
                //得到省_城市的拼接 [ 430000_430100 ]
                string _retgionProvCityCodeArr = "";
                if (string.IsNullOrWhiteSpace(RegionCityCode) && string.IsNullOrWhiteSpace(RegionCountyCode))
                {
                    _retgionProvCityCodeArr = WebAppConfig.SelCityRegionCodeArrDefault;
                }
                else if (string.IsNullOrWhiteSpace(RegionCityCode) == false && string.IsNullOrWhiteSpace(RegionCountyCode))
                {
                    Dictionary<string, string> _dicProvCity = RegionCodeName.getProvinceCityCountryByRegionCode(RegionCityCode);
                    _retgionProvCityCodeArr = _dicProvCity["PCODE"].ToString().Trim() + "_" + _dicProvCity["REGIONCODE"].ToString().Trim();
                }


                //没有选择地区
                if (string.IsNullOrWhiteSpace(RegionCountyCode))
                {
                    if (string.IsNullOrWhiteSpace(_initSQLCharWhere) == false)
                    {
                        _initSQLCharWhere = "(" + _initSQLCharWhere + ") AND ";
                    }

                    _initSQLCharWhere += "RegionCodeArr LIKE '" + _retgionProvCityCodeArr + "_%'";
                }


                if (string.IsNullOrWhiteSpace(_initSQLCharWhere) == false)
                {
                    _initSQLCharWhere = "(" + _initSQLCharWhere + ") AND ";
                }
                //O2o商品查询必须是 支持到店消费/自取
                _initSQLCharWhere += "(IsShopExpense='true' OR IsShopExpense='both')";


                //只加载打折
                if (IsOnlyDiscount == "true")
                {
                    _initSQLCharWhere = "(" + _initSQLCharWhere + ") AND Discount>0 AND (GroupMsgCount<=0 OR GroupMsgCount IS NULL)";
                }
                //只加载秒杀商品
                if (IsOnlySecKill == "true")
                {
                    _initSQLCharWhere = "(" + _initSQLCharWhere + ") AND SkDiscount>0 AND (GroupMsgCount<=0 OR GroupMsgCount IS NULL)";
                }
                //只加载团购商品
                if (IsOnlyGroup == "true")
                {
                    _initSQLCharWhere = "(" + _initSQLCharWhere + ") AND GroupMsgCount>0";
                }


                //-----排序方式------//
                string _orderBy = "PaidCount DESC,SaleCount DESC,PageOrder DESC";
                if (PageOrderName == "SaleCount") //销量
                {
                    _orderBy = "SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "WriteDate") //新品
                {
                    _orderBy = "PageOrder DESC,SaleCount DESC,PaidCount DESC";
                }
                else if (PageOrderName == "GoodsPriceAsc") //价格升序
                {
                    _orderBy = "GoodsPrice ASC,SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "GoodsPriceDesc") //价格降序
                {
                    _orderBy = "GoodsPrice DESC,SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "Distance" && BuyerUserID == "0") //距离最近
                {
                    _orderBy = "PaidCount DESC,SaleCount DESC,PageOrder DESC";
                }


                //-------获取分页JSON数据字符串----------//
                string _strJson = "";
                //显示的字段值
                string[] _showFieldArr = { "PageOrder", "IsLock", "WriteDate", "Longitude", "Latitude" };
                //按距离最近搜索
                if (PageOrderName == "Distance")
                {
                    //得到当前用户的坐标位置
                    string CurrentLat = "";
                    string CurrentLng = "";
                    if (Convert.ToInt64(BuyerUserID) != 0)
                    {
                        ModelValUserLocationRegion _modelValUserLocationRegion = BusiO2o.getCurrentUserLocationRegion(Convert.ToInt64(BuyerUserID));
                        if (_modelValUserLocationRegion.UserID != 0)
                        {
                            CurrentLat = _modelValUserLocationRegion.Latitude;
                            CurrentLng = _modelValUserLocationRegion.Longitude;
                        }
                        else
                        {
                            if (string.IsNullOrWhiteSpace(CookieLng) == false && string.IsNullOrWhiteSpace(CookieLat) == false)
                            {
                                CurrentLat = CookieLat;
                                CurrentLng = CookieLng;
                            }
                        }
                    }
                    else
                    {
                        if (string.IsNullOrWhiteSpace(CookieLng) == false && string.IsNullOrWhiteSpace(CookieLat) == false)
                        {
                            CurrentLat = CookieLat;
                            CurrentLng = CookieLng;
                        }
                    }

                    if (string.IsNullOrWhiteSpace(CurrentLat) || string.IsNullOrWhiteSpace(CurrentLng))
                    {
                        //获取分页JSON数据字符串
                        _strJson = BusiJsonPageStr.morePageJSONVC_GoodsMsg_Search(_modelVC_GoodsMsg_Search, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "wap", _orderBy);
                    }
                    else
                    {
                        //获取分页JSON数据字符串
                        _strJson = BusiJsonPageStr.morePageDistanceJSONVC_GoodsMsg_Search(_modelVC_GoodsMsg_Search, _pageCurrent, CurrentLat, CurrentLng, _initSQLCharWhere, _showFieldArr, true, "wap", _orderBy);
                    }

                }
                else
                {
                    //获取分页JSON数据字符串
                    _strJson = BusiJsonPageStr.morePageJSONVC_GoodsMsg_Search(_modelVC_GoodsMsg_Search, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "wap", _orderBy);
                }
                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "5") //平台店铺搜索分页O2o实体店-手机端
            {
                // 获取传递的参数
                string SearchKeyword = PublicClass.FilterRequestTrim("SearchKeyword");

                //买家UserID,用于获取当前用坐标
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //区县的代号 430121
                string RegionCountyCode = PublicClass.FilterRequestTrimNoConvert("RegionCountyCode");
                //城市的代号 430100
                string RegionCityCode = PublicClass.FilterRequestTrimNoConvert("RegionCityCode");

                //店铺所属店铺分类
                string ShopTypeID = PublicClass.FilterRequestTrimNoConvert("ShopTypeID");
                string FatherTypeID = PublicClass.FilterRequestTrimNoConvert("FatherTypeID");


                //Cookie中用户的经纬度
                string CookieLng = PublicClass.FilterRequestTrim("CookieLng");
                string CookieLat = PublicClass.FilterRequestTrim("CookieLat");


                //排序方式  距离 Distance  销量 SaleCount ，价格 GoodsPriceAsc,GoodsPriceDesc，
                string OrderBy = PublicClass.FilterRequestTrimNoConvert("OrderBy");


                //是否加载额外数据类型 NoPreGoodsList
                string LoadTypeExtra = PublicClass.FilterRequestTrim("LoadTypeExtra");


                //-----获取当前页数-----//
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");


                //防止数字类型为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                ShopTypeID = PublicClass.preventNumberDataIsNull(ShopTypeID);
                FatherTypeID = PublicClass.preventNumberDataIsNull(FatherTypeID);


                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelVC_ShopMsg_Search _modelVC_ShopMsg_Search = new ModelVC_ShopMsg_Search();
                _modelVC_ShopMsg_Search.IsCheck = "false";
                _modelVC_ShopMsg_Search.IsShow = "true";
                _modelVC_ShopMsg_Search.IsLock = "false";
                _modelVC_ShopMsg_Search.IsEntity = "true";
                _modelVC_ShopMsg_Search.ShopTypeID = Convert.ToInt64(ShopTypeID);
                _modelVC_ShopMsg_Search.FatherTypeID = Convert.ToInt64(FatherTypeID);

                if (string.IsNullOrWhiteSpace(RegionCountyCode) == false)
                {
                    //得到省，市，县区号
                    List<Dictionary<string, string>> _listDicRegion = RegionCodeName.getProvinceCityCountryByCountyRegionCode(RegionCountyCode);
                    _modelVC_ShopMsg_Search.RegionCodeArr = _listDicRegion[2]["REGIONCODE"].ToString().Trim() + "_" + _listDicRegion[1]["REGIONCODE"].ToString().Trim() + "_" + _listDicRegion[0]["REGIONCODE"].ToString().Trim();
                }


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //-----构造查询关键字 条件------//
                _initSQLCharWhere = BusiSearch.splitSearchWhereShopKeyword(SearchKeyword);

                //选择的城市区县值如果为空（全部地区） 则显示当前城市所有的记录 
                //得到省_城市的拼接 [ 430000_430100 ]
                string _retgionProvCityCodeArr = "";
                if (string.IsNullOrWhiteSpace(RegionCityCode) && string.IsNullOrWhiteSpace(RegionCountyCode))
                {
                    _retgionProvCityCodeArr = WebAppConfig.SelCityRegionCodeArrDefault;
                }
                else if (string.IsNullOrWhiteSpace(RegionCityCode) == false && string.IsNullOrWhiteSpace(RegionCountyCode))
                {
                    Dictionary<string, string> _dicProvCity = RegionCodeName.getProvinceCityCountryByRegionCode(RegionCityCode);
                    _retgionProvCityCodeArr = _dicProvCity["PCODE"].ToString().Trim() + "_" + _dicProvCity["REGIONCODE"].ToString().Trim();
                }
                if (string.IsNullOrWhiteSpace(RegionCountyCode))
                {
                    if (string.IsNullOrWhiteSpace(_initSQLCharWhere) == false)
                    {
                        _initSQLCharWhere = "(" + _initSQLCharWhere + ") AND RegionCodeArr LIKE '" + _retgionProvCityCodeArr + "_%'";
                    }
                    else
                    {
                        _initSQLCharWhere = "RegionCodeArr LIKE '" + _retgionProvCityCodeArr + "_%'";
                    }

                }

                //-----排序方式  距离 Distance  销量 SaleCount ，价格 GoodsPriceAsc,GoodsPriceDesc，------//
                string _orderBy = "SumPaidCount DESC,CountDiscount DESC,PageOrder DESC";
                if (OrderBy == "SaleCount")
                {
                    _orderBy = "SumPaidCount DESC,CountDiscount DESC,PageOrder DESC";
                }
                else if (OrderBy == "GoodsPriceAsc")
                {
                    _orderBy = "ShopAllGoodsMinPrice ASC, SumPaidCount DESC,CountDiscount DESC,PageOrder DESC";
                }
                else if (OrderBy == "GoodsPriceDesc")
                {
                    _orderBy = "ShopAllGoodsMinPrice DESC, SumPaidCount DESC,CountDiscount DESC,PageOrder DESC";
                }
                else if (OrderBy == "Distance" && BuyerUserID != "0") //距离最近
                {
                    _orderBy = "SumPaidCount DESC,CountDiscount DESC,PageOrder DESC";
                }

                //-------获取分页JSON数据字符串----------//
                string _strJson = "";
                //显示的字段值
                string[] _showFieldArr = { "PageOrder", "IsLock", "WriteDate", "Longitude", "Latitude", "IsShow", "IsCheck", "MajorGoods", "SearchKey" };
                //按距离最近搜索
                if (OrderBy == "Distance")
                {
                    //得到当前用户的坐标位置
                    string CurrentLat = "";
                    string CurrentLng = "";

                    if (Convert.ToInt64(BuyerUserID) > 0)
                    {

                        ModelValUserLocationRegion _modelValUserLocationRegion = BusiO2o.getCurrentUserLocationRegion(Convert.ToInt64(BuyerUserID));
                        if (_modelValUserLocationRegion.UserID != 0)
                        {
                            CurrentLat = _modelValUserLocationRegion.Latitude;
                            CurrentLng = _modelValUserLocationRegion.Longitude;
                        }
                        else
                        {
                            if (string.IsNullOrWhiteSpace(CookieLng) == false && string.IsNullOrWhiteSpace(CookieLat) == false)
                            {
                                CurrentLat = CookieLat;
                                CurrentLng = CookieLng;
                            }
                        }
                    }
                    else
                    {
                        if (string.IsNullOrWhiteSpace(CookieLng) == false && string.IsNullOrWhiteSpace(CookieLat) == false)
                        {
                            CurrentLat = CookieLat;
                            CurrentLng = CookieLng;
                        }
                    }

                    if (string.IsNullOrWhiteSpace(CurrentLat) || string.IsNullOrWhiteSpace(CurrentLng))
                    {
                        //获取分页JSON数据字符串
                        _strJson = BusiJsonPageStr.morePageJSONVC_ShopMsg_Search(_modelVC_ShopMsg_Search, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "wap", _orderBy, LoadTypeExtra);
                    }
                    else
                    {
                        //获取分页JSON数据字符串
                        _strJson = BusiJsonPageStr.morePageDistanceJSONVC_ShopMsg_Search(_modelVC_ShopMsg_Search, _pageCurrent, CurrentLat, CurrentLng, _initSQLCharWhere, _showFieldArr, true, "wap", _orderBy, LoadTypeExtra);
                    }
                }
                else
                {
                    //获取分页JSON数据字符串
                    _strJson = BusiJsonPageStr.morePageJSONVC_ShopMsg_Search(_modelVC_ShopMsg_Search, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "wap", _orderBy, LoadTypeExtra);

                }
                //输出前台显示代码
                return _strJson;

            }

            return "";
        }



    }
}