using HttpServiceNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【商城】相关Api控制器
/// </summary>
namespace OctMallMiniWeb.PageControllers.ApiPage
{
    public class MallApiController : Controller
    {
        /// <summary>
        /// 商城首页 B2c
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

            //获取操作类型  Type=1 加载轮播广告(所有的) Type=2 加载横幅通栏广告 Type=3 加载图片列表栏目广告 Type=4 加载不同类型的栏目图标导航信息 Type=5 平台猜你喜欢商品数据搜索分页-手机端
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1")
            {
                //获取传递的参数
                string AdvType = PublicClass.FilterRequestTrim("AdvType"); //"Home";
                string AdvTitleType = PublicClass.FilterRequestTrim("AdvTitleType"); //"";
                string AdvOsTypeFix = PublicClass.FilterRequestTrim("AdvOsTypeFix"); //"H5";

                //选填
                string SelCityRegionCodeArr = PublicClass.FilterRequestTrimNoConvert("SelCityRegionCodeArr");
                if (AdvType == "AdvO2o") //O2o页面
                {
                    //SelCityRegionCodeArr = BusiWebCookie.getSelCityRegionCodeArrCookie();
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
                string SelCityRegionCodeArr = PublicClass.FilterRequestTrimNoConvert("SelCityRegionCodeArr");
                if (AdvType == "AdvO2o") //O2o页面
                {
                    //SelCityRegionCodeArr = BusiWebCookie.getSelCityRegionCodeArrCookie();
                }

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "2");
                _dicPost.Add("AdvType", AdvType);
                _dicPost.Add("AdvTitleType", AdvTitleType);
                _dicPost.Add("AdvOsType", "Mini");
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
                _dicPost.Add("OsType", "Mini");

                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_ADV_NavIconMsg, _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "5") //平台猜你喜欢商品数据搜索分页-手机端
            {
                //获取登录的买家UserID
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID"); //BusiLogin.getLoginCookieUserIDAndLoginPwdNoSha1()[0];


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
            //获取操作类型  Type=1 加载打折商品显示分类
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {

                // 获取传递的参数 
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "2");
                _dicPost.Add("IsEntity", IsEntity);

                //调用加载父级类目列表函数
                string _jsonBack = HttpService.Post(WebAppConfig.ApiUrl_UGS_DiscountGoods, _dicPost);
                return _jsonBack;
            }

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
                string RegionCityCode = PublicClass.FilterRequestTrim("RegionCityCode");
                if (string.IsNullOrWhiteSpace(RegionCountyCode) && IsEntity == "true")
                {
                    //得到当前城市的代号 --Cookie中  -- 得到 用户选择的城市区域代号  - [ 430100 ]
                    //RegionCityCode = BusiWebCookie.getSelCityRegionCodeCookie();
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