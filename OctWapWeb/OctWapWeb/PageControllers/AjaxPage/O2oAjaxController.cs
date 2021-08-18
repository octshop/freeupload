using HttpServiceNS;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【O2O】相关Ajax控制器
/// </summary>
namespace OctWapWeb.PageControllers.AjaxPage
{
    public class O2oAjaxController : Controller
    {

        /// <summary>
        /// 商城首页 O2o
        /// </summary>
        /// <returns></returns>
        public string Index()
        {
            //获取操作类型 Type=1 【得到用户当前选择的城市区域信息，pBuyerUserID 可以为0，没有登录】 Type=2 【保存设置用户当前选择的城市区域信息 pBuyerUserID 可以为0，没有登录】 Type=3 加载推荐商家与商品信息 (首页显示)
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1")
            {

                string _jsonBackRegion = "{";

                //得到当前选择城市Cookie中的 “ 430000_430100 ^ 湖南省_长沙市 ”
                string SelCityRegionArrCookie = BusiWebCookie.getSelCityRegionArrCookie();

                //获取登录买家UserID
                string BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

                if (string.IsNullOrWhiteSpace(SelCityRegionArrCookie))
                {
                    //POST参数
                    Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                    _dicPost.Add("Type", "2");
                    _dicPost.Add("BuyerUserID", BuyerUserID);
                    _dicPost.Add("SelCityRegionCodeArr", "");

                    string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_PubIndex, _dicPost);
                    if (string.IsNullOrWhiteSpace(_jsonBack) == false)
                    {
                        JObject _jObj = (JObject)JsonConvert.DeserializeObject(_jsonBack);
                        if (_jObj["UserID"].ToString().Trim() != "")
                        {
                            _jsonBackRegion += "\"UserID\":\"" + BuyerUserID + "\",";
                            _jsonBackRegion += "\"SelCityRegionCodeArr\":\"" + _jObj["SelCityRegionCodeArr"].ToString().Trim() + "\",";
                            _jsonBackRegion += "\"SelCityRegionNameArr\":\"" + _jObj["SelCityRegionNameArr"].ToString().Trim() + "\"";
                        }
                        else
                        {
                            _jsonBackRegion += "\"UserID\":\"0\",";
                            _jsonBackRegion += "\"SelCityRegionCodeArr\":\"\",";
                            _jsonBackRegion += "\"SelCityRegionNameArr\":\"\"";
                        }
                    }
                }
                else
                {
                    string[] _SelCityRegionArr = PublicClass.splitStringJoinChar(SelCityRegionArrCookie);

                    _jsonBackRegion += "\"UserID\":\"" + BuyerUserID + "\",";
                    _jsonBackRegion += "\"SelCityRegionCodeArr\":\"" + _SelCityRegionArr[0] + "\",";
                    _jsonBackRegion += "\"SelCityRegionNameArr\":\"" + _SelCityRegionArr[1] + "\"";
                }

                _jsonBackRegion += "}";

                //设置Cookie 当前选择的城市信息
                JObject _jObjSel = (JObject)JsonConvert.DeserializeObject(_jsonBackRegion);
                BusiWebCookie.setSelCityRegionArrCookie(_jObjSel["SelCityRegionCodeArr"].ToString().Trim() + "^" + _jObjSel["SelCityRegionNameArr"].ToString().Trim());

                return _jsonBackRegion;
            }
            else if (_exeType == "2") //保存设置用户当前选择的城市区域信息 pBuyerUserID 可以为0，没有登录
            {
                //获取传递的参数 
                //选择的 省_城市 代号
                string SelCityRegionCodeArr = PublicClass.FilterRequestTrim("SelCityRegionCodeArr");


                //获取登录买家UserID
                string BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

                if (string.IsNullOrWhiteSpace(BuyerUserID) == false && BuyerUserID != "0")
                {
                    //POST参数
                    Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                    _dicPost.Add("BuyerUserID", BuyerUserID);
                    _dicPost.Add("SelCityRegionCodeArr", SelCityRegionCodeArr);

                    string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_PubIndex, "UGS_PubIndex", "3", _dicPost);

                    if (_jsonBack.IndexOf("保存成功") >= 0)
                    {

                        //设置Cookie 当前选择的城市信息
                        string SelCityRegionNameArr = RegionCodeNameNS.RegionCodeName.joinProvinceCityNameArr(SelCityRegionCodeArr, '_');
                        BusiWebCookie.setSelCityRegionArrCookie(SelCityRegionCodeArr + "^" + SelCityRegionNameArr);


                        return "21"; //保存成功
                    }
                }
                else
                {
                    //设置Cookie 当前选择的城市信息
                    string SelCityRegionNameArr = RegionCodeNameNS.RegionCodeName.joinProvinceCityNameArr(SelCityRegionCodeArr, '_');
                    BusiWebCookie.setSelCityRegionArrCookie(SelCityRegionCodeArr + "^" + SelCityRegionNameArr);

                    return "21"; //保存成功
                }
                return "22"; //保存失败

            }
            else if (_exeType == "3") //加载推荐商家与商品信息 (首页显示)
            {
                //获取传递的参数
                string RcdType = PublicClass.FilterRequestTrim("RcdType");
                string AdvType = PublicClass.FilterRequestTrim("AdvType");
                string LoadNum = PublicClass.FilterRequestTrim("LoadNum");

                //获取登录买家UserID
                string BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

                //选填
                string SelCityRegionCodeArr = "";
                if (AdvType == "AdvO2o") //O2o页面
                {
                    SelCityRegionCodeArr = BusiWebCookie.getSelCityRegionCodeArrCookie();
                }

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


                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "6");
                _dicPost.Add("AdvType", AdvType);
                _dicPost.Add("RcdType", RcdType);
                _dicPost.Add("LoadNum", LoadNum);
                _dicPost.Add("SelCityRegionCodeArr", SelCityRegionCodeArr);
                _dicPost.Add("BuyerUserID", BuyerUserID);
                _dicPost.Add("CookieLng", _cookieLng);
                _dicPost.Add("CookieLat", _cookieLat);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_ADV_RcdGoodsShop, _dicPost);
                return _jsonBack;


            }


            return "";
        }

        #region【商品相关】

        /// <summary>
        /// O2o商品首页
        /// </summary>
        /// <returns></returns>
        public string GoodsIndex()
        {
            return "";
        }

        /// <summary>
        /// O2o商品类别
        /// </summary>
        /// <returns></returns>
        public string GoodsType()
        {
            //获取操作类型 Type=1 O2O商品分类显示搜索商品分页-手机端  Type=2  加载商品搜索条件选项卡信息O2O-手机端
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1")
            {
                //获取传递参数
                //搜索条件拼接字符串  RegionCodeArr + "^" + pPageOrderName
                string SearchWhereArr = PublicClass.FilterRequestTrim("SearchWhereArr");

                //第三级商品类目ID
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");
                //第二级类目ID
                string GoodsTypeIDSec = PublicClass.FilterRequestTrim("GoodsTypeIDSec");


                //分解拼接字符串
                string[] _SearchWhereArr = PublicClass.splitStringJoinChar(SearchWhereArr);

                //区域范围 区县代号 430121
                string RegionCountyCode = _SearchWhereArr[0];
                //区域范围 城市代号 430100
                string RegionCityCode = "";
                if (string.IsNullOrWhiteSpace(RegionCountyCode))
                {
                    //得到当前城市的代号 --Cookie中  -- 得到 用户选择的城市区域代号  - [ 430100 ]
                    RegionCityCode = BusiWebCookie.getSelCityRegionCodeCookie();
                }

                //排序方式 综合 Distance ，销量 SaleCount ，价格 GoodsPriceAsc,GoodsPriceDesc
                string PageOrderName = _SearchWhereArr[1];

                //获取登录的买家UserID
                string BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

                //----获取当前页数----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");


                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "1");
                _dicPost.Add("PageCurrent", PageCurrent);
                _dicPost.Add("BuyerUserID", BuyerUserID);

                _dicPost.Add("GoodsTypeIDThird", GoodsTypeID);
                _dicPost.Add("GoodsTypeIDSec", GoodsTypeIDSec);
                _dicPost.Add("PageOrderName", PageOrderName);
                _dicPost.Add("RegionCountyCode", RegionCountyCode);
                _dicPost.Add("RegionCityCode", RegionCityCode);


                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_GoodsTypeO2o, _dicPost);
                return _jsonBack;

            }
            else if (_exeType == "2") //加载商品搜索条件选项卡信息O2O-手机端
            {
                //获取传递的参数
                string GoodsTypeIDThird = PublicClass.FilterRequestTrim("GoodsTypeIDThird");

                //设置成株洲这个城市 
                //BusiWebCookie.setSelCityRegionArrCookie("430000_430200^湖南省_株洲市");

                //当前选择城市代号拼接 [湖南省_长沙市 , 430000_430100] 从Cookie中得到相关值 430000_430100
                string SelCityRegionCodeArr = BusiWebCookie.getSelCityRegionCodeArrCookie();

                //获取登录的买家UserID
                string BuyerUserID = BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "2");
                _dicPost.Add("GoodsTypeIDThird", GoodsTypeIDThird);
                _dicPost.Add("BuyerUserID", BuyerUserID);
                _dicPost.Add("SelCityRegionCodeArr", SelCityRegionCodeArr);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_GoodsTypeO2o, _dicPost);
                return _jsonBack;
            }


            return "";
        }

        #endregion

        #region【商家相关】

        /// <summary>
        /// 附近商家
        /// </summary>
        /// <returns></returns>
        public string ShopNear()
        {
            //获取操作类型 Type=1 加载O2o店铺类目 (两级分类)
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1")
            {
                //获取传递的参数
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");
                string FatherTypeID = PublicClass.FilterRequestTrim("FatherTypeID"); ;

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "1");
                _dicPost.Add("IsEntity", IsEntity);
                _dicPost.Add("FatherTypeID", FatherTypeID);

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_ShopTypeO2o, _dicPost);
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 附近商家-分类
        /// </summary>
        /// <returns></returns>
        public string ShopNearType()
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


    }
}