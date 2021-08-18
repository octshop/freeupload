using BusiApiKeyVerifyNS;
using OctUserGoodsShopSystemNS;
using PublicClassNS;
using RegionCodeNameNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【O2O展示页面】相关的API接口控制器
/// </summary>
namespace OctUserGoodsShopSystemWeb.PageControllers.ApiPage
{
    public class O2oController : Controller
    {
        /// <summary>
        /// 公共首页API
        /// </summary>
        /// <returns></returns>
        public string PubIndex()
        {
            //获取操作类型  Type=1  加载当前用户所在城市 的区县列表，没有登录则加载默认或已选择的 Type=2 【得到用户当前选择的城市区域信息，pBuyerUserID 可以为0，没有登录】 Type=3  【保存更新 用户选择的当前城市信息  430000_430100】
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1")
            {
                //-获取传递的参数
                //买家UserID,用于获取当前用坐标
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                //当前选择城市代号拼接 [湖南省_长沙市 , 430000_430100]
                string SelCityRegionCodeArr = PublicClass.FilterRequestTrim("SelCityRegionCodeArr");

                //防止数字类型为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiO2o.loadCurUserCountyListApi(Convert.ToInt64(BuyerUserID), SelCityRegionCodeArr);
                return _jsonBack;
            }
            else if (_exeType == "2") //得到用户当前选择的城市区域信息，pBuyerUserID 可以为0，没有登录
            {
                //买家UserID,用于获取当前用坐标
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                //当前选择城市代号拼接 [湖南省_长沙市 , 430000_430100]
                string SelCityRegionCodeArr = PublicClass.FilterRequestTrim("SelCityRegionCodeArr");

                //防止数字类型为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiO2o.getCurrentUserLocationRegionApi(Convert.ToInt64(BuyerUserID), SelCityRegionCodeArr);
                return _jsonBack;
            }


            //------------验证RndKeyRsa是否正确--------------//
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }


            if (_exeType == "3") //保存更新 用户选择的当前城市信息  430000_430100
            {
                //获取传递的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string SelCityRegionCodeArr = PublicClass.FilterRequestTrim("SelCityRegionCodeArr");

                //防止数字类型为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiO2o.saveSelCityRegionCodeArrApi(Convert.ToInt64(BuyerUserID), SelCityRegionCodeArr);
                return _jsonBack;
            }


            return "";
        }

        /// <summary>
        /// O2o商品类目
        /// </summary>
        /// <returns></returns>
        public string GoodsTypeO2o()
        {
            //获取操作类型  Type=1  O2O商品分类显示搜索商品分页-手机端  Type=2  加载商品搜索条件选项卡信息O2O-手机端
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1")
            {

                // 获取传递的参数 ，必须有一种级别的类目ID，不能两个都为空

                //二级类目ID
                string GoodsTypeIDSec = PublicClass.FilterRequestTrim("GoodsTypeIDSec");
                //三级类目ID
                 string GoodsTypeIDThird = PublicClass.FilterRequestTrim("GoodsTypeIDThird");

                //买家UserID,用于获取当前用坐标
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //区县的代号 430121
                string RegionCountyCode = PublicClass.FilterRequestTrimNoConvert("RegionCountyCode");
                //城市的代号 430100
                string RegionCityCode = PublicClass.FilterRequestTrimNoConvert("RegionCityCode");

                //排序方式 综合 Distance ，销量 SaleCount ，价格 GoodsPriceAsc,GoodsPriceDesc
                string PageOrderName = PublicClass.FilterRequestTrim("PageOrderName");


                //---获取当前页数----//
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                GoodsTypeIDSec = PublicClass.preventNumberDataIsNull(GoodsTypeIDSec);
                GoodsTypeIDThird = PublicClass.preventNumberDataIsNull(GoodsTypeIDThird);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelVC_GoodsMsg_Search _modelVC_GoodsMsg_Search = new ModelVC_GoodsMsg_Search();
                _modelVC_GoodsMsg_Search.GoodsStatus = "售";
                _modelVC_GoodsMsg_Search.IsLock = "false";
                _modelVC_GoodsMsg_Search.IsUnSale = "false";
                _modelVC_GoodsMsg_Search.IsEntity = "true";
                if (string.IsNullOrWhiteSpace(RegionCountyCode) == false)
                {
                    //得到省，市，县区号
                    List<Dictionary<string, string>> _listDicRegion = RegionCodeName.getProvinceCityCountryByCountyRegionCode(RegionCountyCode);
                    _modelVC_GoodsMsg_Search.RegionCodeArr = _listDicRegion[2]["REGIONCODE"].ToString().Trim() + "_" + _listDicRegion[1]["REGIONCODE"].ToString().Trim() + "_" + _listDicRegion[0]["REGIONCODE"].ToString().Trim();
                }


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //-----构造查询关键字 条件------//
                if (string.IsNullOrWhiteSpace(GoodsTypeIDThird) == false && GoodsTypeIDThird != "0")
                {
                    _initSQLCharWhere = "GoodsTypeID=" + GoodsTypeIDThird;
                }
                else if (string.IsNullOrWhiteSpace(GoodsTypeIDSec) == false && GoodsTypeIDSec != "0")
                {
                    _initSQLCharWhere = BusiMall.splitWhereGoodsTypeThirdBySec(Convert.ToInt64(GoodsTypeIDSec));
                }
                else
                {
                    _initSQLCharWhere = "GoodsTypeID=" + GoodsTypeIDThird;
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
                if (string.IsNullOrWhiteSpace(RegionCountyCode))
                {
                    _initSQLCharWhere = "(" + _initSQLCharWhere + ") AND RegionCodeArr LIKE '" + _retgionProvCityCodeArr + "_%'";
                }

                //-----排序方式------//
                string _orderBy = "";
                if (PageOrderName == "SaleCount") //销量
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
                else if (PageOrderName == "Distance" && BuyerUserID == "0")
                {
                    _orderBy = "PaidCount DESC,SaleCount DESC,PageOrder DESC";
                }



                //-------获取分页JSON数据字符串----------//
                string _strJson = "";
                //显示的字段值
                string[] _showFieldArr = { "PageOrder", "IsLock", "WriteDate", "Longitude", "Latitude" };

                if (BuyerUserID != "0" && PageOrderName == "Distance")
                {
                    //得到当前用户的坐标位置
                    string CurrentLat = "";
                    string CurrentLng = "";
                    ModelValUserLocationRegion _modelValUserLocationRegion = BusiO2o.getCurrentUserLocationRegion(Convert.ToInt64(BuyerUserID));
                    if (_modelValUserLocationRegion.UserID != 0)
                    {
                        CurrentLat = _modelValUserLocationRegion.Latitude;
                        CurrentLng = _modelValUserLocationRegion.Longitude;
                    }

                    //获取分页JSON数据字符串
                    _strJson = BusiJsonPageStr.morePageDistanceJSONVC_GoodsMsg_Search(_modelVC_GoodsMsg_Search, _pageCurrent, CurrentLat, CurrentLng, _initSQLCharWhere, _showFieldArr, true, "wap", _orderBy);
                }
                else
                {
                    //获取分页JSON数据字符串
                    _strJson = BusiJsonPageStr.morePageJSONVC_GoodsMsg_Search(_modelVC_GoodsMsg_Search, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "wap", _orderBy);
                }


                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") // 加载商品搜索条件选项卡信息O2O-手机端
            {

                //获取传递的参数
                string GoodsTypeIDThird = PublicClass.FilterRequestTrim("GoodsTypeIDThird");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                //当前选择城市代号拼接 [湖南省_长沙市 , 430000_430100]
                string SelCityRegionCodeArr = PublicClass.FilterRequestTrim("SelCityRegionCodeArr");


                //防止数字类型为空
                GoodsTypeIDThird = PublicClass.preventNumberDataIsNull(GoodsTypeIDThird);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiO2o.loadGoodsSearchWhereTabMsgApi(Convert.ToInt64(GoodsTypeIDThird), Convert.ToInt64(BuyerUserID), SelCityRegionCodeArr);
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// O2o店铺类目 (两级分类)
        /// </summary>
        /// <returns></returns>
        public string ShopTypeO2o()
        {
            //获取操作类型  Type=1  加载O2O店铺顶级分类--手机端
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1")
            {
                //获取传递的参数
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");
                string FatherTypeID = PublicClass.FilterRequestTrim("FatherTypeID");

                if (string.IsNullOrWhiteSpace(IsEntity))
                {
                    IsEntity = "false";
                }

                //防止数字类型为空
                FatherTypeID = PublicClass.preventNumberDataIsNull(FatherTypeID);

                string _jsonBack = BusiShop.loadShopTypeListApi(IsEntity, Convert.ToInt64(FatherTypeID));
                return _jsonBack;
            }

            return "";
        }



    }
}