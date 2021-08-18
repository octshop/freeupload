using BusiApiKeyVerifyNS;
using OctAdvertiserSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【广告】相关的API接口控制器
/// </summary>
namespace OctAdvertiserSystemWeb.PageControllers.ApiPage
{
    public class AdvController : Controller
    {
        /// <summary>
        /// 横幅通栏广告
        /// </summary>
        /// <returns></returns>
        public string AdvBanner()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 加载指定类型的 横幅通栏广告  Type=3 提交 横幅通栏广告 Type=4 批量删除 横幅通栏广告 Type=5  锁定/解锁  横幅通栏广告  Type=6 初始化横幅广告信息 Type=7 置顶横幅广告
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string BannerID = PublicClass.FilterRequestTrim("BannerID");
                string AdvType = PublicClass.FilterRequestTrim("AdvType");
                string SelCityRegionCodeArr = PublicClass.FilterRequestTrim("SelCityRegionCodeArr");
                string AdvTitleType = PublicClass.FilterRequestTrim("AdvTitleType");
                string AdvOsType = PublicClass.FilterRequestTrim("AdvOsType");
                string AdvLinkA = PublicClass.FilterRequestTrim("AdvLinkA");
                string ImgURL = PublicClass.FilterRequestTrim("ImgURL");
                string AdvMemo = PublicClass.FilterRequestTrim("AdvMemo");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string OverTime = PublicClass.FilterRequestTrim("OverTime");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                BannerID = PublicClass.preventNumberDataIsNull(BannerID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelAdvBanner _modelAdvBanner = new ModelAdvBanner();
                _modelAdvBanner.BannerID = Convert.ToInt64(BannerID);
                _modelAdvBanner.AdvType = AdvType;
                _modelAdvBanner.AdvTitleType = AdvTitleType;
                _modelAdvBanner.AdvOsType = AdvOsType;
                _modelAdvBanner.AdvLinkA = AdvLinkA;
                _modelAdvBanner.ImgURL = ImgURL;
                _modelAdvBanner.AdvMemo = AdvMemo;
                _modelAdvBanner.SelCityRegionCodeArr = SelCityRegionCodeArr;
                _modelAdvBanner.IsLock = IsLock;
                _modelAdvBanner.OverTime = OverTime;
                _modelAdvBanner.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONAdvBanner(_modelAdvBanner, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //加载指定类型的 横幅通栏广告  
            {
                // 获取传递的参数
                string AdvType = PublicClass.FilterRequestTrim("AdvType");
                string AdvTitleType = PublicClass.FilterRequestTrim("AdvTitleType");

                //选填
                string AdvOsTypeFix = PublicClass.FilterRequestTrim("AdvOsTypeFix");
                string TopNum = PublicClass.FilterRequestTrim("TopNum");
                string BannerID = PublicClass.FilterRequestTrim("BannerID");

                //防止数字类型为空
                TopNum = PublicClass.preventNumberDataIsNull(TopNum);
                BannerID = PublicClass.preventNumberDataIsNull(BannerID);

                string _jsonBack = BusiAdv.loadAdvBannerApi(AdvType, AdvTitleType, AdvOsTypeFix, Convert.ToInt32(TopNum), Convert.ToInt32(BannerID));
                return _jsonBack;
            }
            else if (_exeType == "3") //提交 横幅通栏广告
            {
                // 获取传递的参数
                string BannerID = PublicClass.FilterRequestTrim("BannerID");
                string SelCityRegionCodeArr = PublicClass.FilterRequestTrim("SelCityRegionCodeArr");
                string AdvType = PublicClass.FilterRequestTrim("AdvType");
                string AdvTitleType = PublicClass.FilterRequestTrim("AdvTitleType");
                string AdvOsType = PublicClass.FilterRequestTrim("AdvOsType");
                string AdvLinkType = PublicClass.FilterRequestTrim("AdvLinkType");
                string AdvLinkA = PublicClass.FilterRequestTrim("AdvLinkA");
                string ImgURL = PublicClass.FilterRequestTrim("ImgURL");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //选填
                string OverTime = PublicClass.FilterRequestTrim("OverTime");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string AdvMemo = PublicClass.FilterRequestTrim("AdvMemo");

                if (string.IsNullOrWhiteSpace(SelCityRegionCodeArr))
                {
                    SelCityRegionCodeArr = "-";
                }

                //防止数字类型为空
                BannerID = PublicClass.preventNumberDataIsNull(BannerID);

                string _jsonBack = BusiAdv.submitAdvBannerApi(Convert.ToInt64(BannerID), AdvType, AdvTitleType, AdvOsType, AdvLinkType, AdvLinkA, ImgURL, UploadGuid, SelCityRegionCodeArr, OverTime, IsLock, AdvMemo);
                return _jsonBack;
            }
            else if (_exeType == "4") //批量删除 横幅通栏广告
            {
                // 获取传递的参数
                string UploadGuidArr = PublicClass.FilterRequestTrim("UploadGuidArr");

                string _jsonBack = BusiAdv.delAdvBannerArrApi(UploadGuidArr);
                return _jsonBack;
            }
            else if (_exeType == "5") //锁定/解锁  横幅通栏广告 
            {
                // 获取传递的参数
                string BannerID = PublicClass.FilterRequestTrim("BannerID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //防止数字类型为空
                BannerID = PublicClass.preventNumberDataIsNull(BannerID);

                string _jsonBack = BusiAdv.lockAdvBannerApi(Convert.ToInt64(BannerID), IsLock);
                return _jsonBack;
            }
            else if (_exeType == "6") //初始化横幅广告信息
            {
                // 获取传递的参数
                string BannerID = PublicClass.FilterRequestTrim("BannerID");

                //防止数字类型为空
                BannerID = PublicClass.preventNumberDataIsNull(BannerID);

                string _jsonBack = BusiAdv.initAdvBannerDetailApi(Convert.ToInt64(BannerID));
                return _jsonBack;
            }
            else if (_exeType == "7") //置顶横幅广告
            {
                // 获取传递的参数
                string BannerID = PublicClass.FilterRequestTrim("BannerID");

                //防止数字类型为空
                BannerID = PublicClass.preventNumberDataIsNull(BannerID);

                string _jsonBack = BusiAdv.goTopAdvBannerApi(Convert.ToInt64(BannerID));
                return _jsonBack;
            }


            return "";
        }

        /// <summary>
        /// 轮播广告
        /// </summary>
        /// <returns></returns>
        public string AdvCarousel()
        {
            //获取操作类型  Type=1 搜索分页数据  Type=2 加载指定类型的 轮播广告 Type=3 提交 轮播广告 Type=4 批量删除 轮播广告 Type=5  锁定/解锁  轮播广告 Type=6 初始化轮播广告信息 Type=7 置顶轮播广告
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "2") //加载指定类型的 轮播广告
            {
                // 获取传递的参数
                string AdvType = PublicClass.FilterRequestTrim("AdvType");
                string AdvTitleType = PublicClass.FilterRequestTrim("AdvTitleType");
                string AdvOsTypeFix = PublicClass.FilterRequestTrim("AdvOsTypeFix");

                //选填
                string TopNum = PublicClass.FilterRequestTrim("TopNum");
                string CarouselID = PublicClass.FilterRequestTrim("CarouselID");
                string SelCityRegionCodeArr = PublicClass.FilterRequestTrim("SelCityRegionCodeArr");

                //防止数字类型为空
                CarouselID = PublicClass.preventNumberDataIsNull(CarouselID);
                TopNum = PublicClass.preventNumberDataIsNull(TopNum);


                string _jsonBack = BusiAdv.loadAdvCarouselApi(AdvType, AdvTitleType, AdvOsTypeFix, Convert.ToInt32(TopNum), SelCityRegionCodeArr, Convert.ToInt64(CarouselID));

                return _jsonBack;
            }


            //-------验证RndKeyRsa是否正确-------//
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            if (_exeType == "1") //搜索分页数据
            {
                // 获取传递的参数
                string CarouselID = PublicClass.FilterRequestTrim("CarouselID");
                string AdvType = PublicClass.FilterRequestTrim("AdvType");
                string AdvTitleType = PublicClass.FilterRequestTrim("AdvTitleType");
                string AdvOsType = PublicClass.FilterRequestTrim("AdvOsType");
                string AdvLinkA = PublicClass.FilterRequestTrim("AdvLinkA");
                string ImgURL = PublicClass.FilterRequestTrim("ImgURL");
                string AdvMemo = PublicClass.FilterRequestTrim("AdvMemo");
                //买家选择的当前城市 代号拼接 [ 430000_430100 ]
                string SelCityRegionCodeArr = PublicClass.FilterRequestTrim("SelCityRegionCodeArr");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                string OverTime = PublicClass.FilterRequestTrim("OverTime");

                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                CarouselID = PublicClass.preventNumberDataIsNull(CarouselID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelAdvCarousel _modelAdvCarousel = new ModelAdvCarousel();
                _modelAdvCarousel.CarouselID = Convert.ToInt64(CarouselID);
                _modelAdvCarousel.AdvType = AdvType;
                _modelAdvCarousel.AdvTitleType = AdvTitleType;
                _modelAdvCarousel.AdvOsType = AdvOsType;
                _modelAdvCarousel.AdvLinkA = AdvLinkA;
                _modelAdvCarousel.ImgURL = ImgURL;
                _modelAdvCarousel.AdvMemo = AdvMemo;
                _modelAdvCarousel.SelCityRegionCodeArr = SelCityRegionCodeArr;
                _modelAdvCarousel.IsLock = IsLock;
                _modelAdvCarousel.OverTime = OverTime;
                _modelAdvCarousel.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONAdvCarousel(_modelAdvCarousel, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "3") //提交 轮播广告
            {
                // 获取传递的参数
                string CarouselID = PublicClass.FilterRequestTrim("CarouselID");
                string SelCityRegionCodeArr = PublicClass.FilterRequestTrim("SelCityRegionCodeArr");
                string AdvType = PublicClass.FilterRequestTrim("AdvType");
                string AdvTitleType = PublicClass.FilterRequestTrim("AdvTitleType");
                string AdvOsType = PublicClass.FilterRequestTrim("AdvOsType");
                string AdvLinkType = PublicClass.FilterRequestTrim("AdvLinkType");
                string AdvLinkA = PublicClass.FilterRequestTrim("AdvLinkA");
                string ImgURL = PublicClass.FilterRequestTrim("ImgURL");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //选填
                string OverTime = PublicClass.FilterRequestTrim("OverTime");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string AdvMemo = PublicClass.FilterRequestTrim("AdvMemo");

                if (string.IsNullOrWhiteSpace(SelCityRegionCodeArr))
                {
                    SelCityRegionCodeArr = "-";
                }


                //防止数字类型为空
                CarouselID = PublicClass.preventNumberDataIsNull(CarouselID);

                string _jsonBack = BusiAdv.submitAdvCarouselApi(Convert.ToInt64(CarouselID), SelCityRegionCodeArr, AdvType, AdvTitleType, AdvOsType, AdvLinkType, AdvLinkA, ImgURL, UploadGuid, OverTime, AdvMemo, IsLock);
                return _jsonBack;
            }
            else if (_exeType == "4") //批量删除 轮播广告
            {
                // 获取传递的参数
                string UploadGuidArr = PublicClass.FilterRequestTrim("UploadGuidArr");

                string _jsonBack = BusiAdv.delAdvCarouselArrApi(UploadGuidArr);
                return _jsonBack;
            }
            else if (_exeType == "5") // 锁定/解锁  轮播广告 
            {
                // 获取传递的参数
                string CarouselID = PublicClass.FilterRequestTrim("CarouselID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //防止数字类型为空
                CarouselID = PublicClass.preventNumberDataIsNull(CarouselID);

                string _jsonBack = BusiAdv.lockAdvCarouselApi(Convert.ToInt64(CarouselID), IsLock);
                return _jsonBack;
            }
            else if (_exeType == "6") //初始化轮播广告信息
            {
                // 获取传递的参数
                string CarouselID = PublicClass.FilterRequestTrim("CarouselID");

                //防止数字类型为空
                CarouselID = PublicClass.preventNumberDataIsNull(CarouselID);

                string _jsonBack = BusiAdv.initAdvCarouselDetailApi(Convert.ToInt64(CarouselID));
                return _jsonBack;
            }
            else if (_exeType == "7") //置顶轮播广告
            {
                // 获取传递的参数
                string CarouselID = PublicClass.FilterRequestTrim("CarouselID");

                //防止数字类型为空
                CarouselID = PublicClass.preventNumberDataIsNull(CarouselID);

                string _jsonBack = BusiAdv.goTopAdvCarouselApi(Convert.ToInt64(CarouselID));
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 图片列表广告
        /// </summary>
        /// <returns></returns>
        public string AdvImgList()
        {
            //获取操作类型  Type=1 搜索分页数据  Type=2 加载指定类型的 图片列表广告 Type=3 提交 图片列表广告 Type=4 批量删除 图片列表广告 Type=5  锁定/解锁  图片列表广告 Type=6 初始化图片列表广告信息 Type=7 置顶横幅广告
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "2") //加载指定类型的 图片列表广告
            {
                // 获取传递的参数
                string AdvType = PublicClass.FilterRequestTrim("AdvType");
                string AdvTitleType = PublicClass.FilterRequestTrim("AdvTitleType");
                string AdvOsType = PublicClass.FilterRequestTrim("AdvOsType");
                string SelCityRegionCodeArr = PublicClass.FilterRequestTrim("SelCityRegionCodeArr");

                if (string.IsNullOrWhiteSpace(SelCityRegionCodeArr))
                {
                    //SelCityRegionCodeArr = OctAdvertiserSystemNS.WebAppConfig.SelCityRegionCodeArrDefault;
                }

                //加载 图片列表广告 页面显示Json字符串 --API方法
                string _jsonBack = BusiAdv.loadAdvImgListApi(AdvType, AdvTitleType, AdvOsType, SelCityRegionCodeArr);
                return _jsonBack;
            }


            //----------验证RndKeyRsa是否正确----------//
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            if (_exeType == "1") //搜索分页数据
            {
                // 获取传递的参数
                string ImgListAdvID = PublicClass.FilterRequestTrim("ImgListAdvID");
                string AdvType = PublicClass.FilterRequestTrim("AdvType");
                string AdvTitleType = PublicClass.FilterRequestTrim("AdvTitleType");
                string AdvTitleName = PublicClass.FilterRequestTrim("AdvTitleName");
                string AdvOsType = PublicClass.FilterRequestTrim("AdvOsType");
                string AdvLinkA = PublicClass.FilterRequestTrim("AdvLinkA");
                string ImgURL = PublicClass.FilterRequestTrim("ImgURL");
                string AdvMemo = PublicClass.FilterRequestTrim("AdvMemo");
                string SelCityRegionCodeArr = PublicClass.FilterRequestTrim("SelCityRegionCodeArr");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string OverTime = PublicClass.FilterRequestTrim("OverTime");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                ImgListAdvID = PublicClass.preventNumberDataIsNull(ImgListAdvID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelAdvImgList _modelAdvImgList = new ModelAdvImgList();
                _modelAdvImgList.ImgListAdvID = Convert.ToInt64(ImgListAdvID);
                _modelAdvImgList.AdvType = AdvType;
                _modelAdvImgList.AdvTitleType = AdvTitleType;
                _modelAdvImgList.AdvTitleName = AdvTitleName;
                _modelAdvImgList.AdvOsType = AdvOsType;
                _modelAdvImgList.AdvLinkA = AdvLinkA;
                _modelAdvImgList.ImgURL = ImgURL;
                _modelAdvImgList.AdvMemo = AdvMemo;
                _modelAdvImgList.SelCityRegionCodeArr = SelCityRegionCodeArr;
                _modelAdvImgList.IsLock = IsLock;
                _modelAdvImgList.OverTime = OverTime;
                _modelAdvImgList.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONAdvImgList(_modelAdvImgList, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "3") //提交 图片列表广告
            {
                // 获取传递的参数
                string ImgListAdvID = PublicClass.FilterRequestTrim("ImgListAdvID");
                string SelCityRegionCodeArr = PublicClass.FilterRequestTrim("SelCityRegionCodeArr");
                string AdvType = PublicClass.FilterRequestTrim("AdvType");
                string AdvTitleType = PublicClass.FilterRequestTrim("AdvTitleType");
                string AdvTitleName = PublicClass.FilterRequestTrim("AdvTitleName");
                string AdvTitleNameIsShow = PublicClass.FilterRequestTrim("AdvTitleNameIsShow");
                string AdvTitleNameSub = PublicClass.FilterRequestTrim("AdvTitleNameSub");
                string AdvOsType = PublicClass.FilterRequestTrim("AdvOsType");
                string AdvLinkType = PublicClass.FilterRequestTrim("AdvLinkType");
                string AdvLinkA = PublicClass.FilterRequestTrim("AdvLinkA");
                string ImgURL = PublicClass.FilterRequestTrim("ImgURL");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                if (string.IsNullOrWhiteSpace(SelCityRegionCodeArr))
                {
                    SelCityRegionCodeArr = "-";
                }

                if (string.IsNullOrWhiteSpace(AdvTitleNameSub))
                {
                    AdvTitleNameSub = "-";
                }

                //选填
                string OverTime = PublicClass.FilterRequestTrim("OverTime");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string AdvMemo = PublicClass.FilterRequestTrim("AdvMemo");

                //防止数字类型为空
                ImgListAdvID = PublicClass.preventNumberDataIsNull(ImgListAdvID);

                string _jsonBack = BusiAdv.submitAdvImgListApi(Convert.ToInt64(ImgListAdvID), AdvType, AdvTitleType, AdvTitleName, AdvTitleNameIsShow, AdvTitleNameSub, AdvOsType, AdvLinkType, AdvLinkA, ImgURL, UploadGuid, SelCityRegionCodeArr, OverTime, IsLock, AdvMemo);

                return _jsonBack;
            }
            else if (_exeType == "4") //批量删除 图片列表广告
            {
                // 获取传递的参数
                string UploadGuidArr = PublicClass.FilterRequestTrim("UploadGuidArr");

                string _jsonBack = BusiAdv.delAdvImgListArrApi(UploadGuidArr);
                return _jsonBack;
            }
            else if (_exeType == "5") //锁定/解锁  图片列表广告 
            {
                // 获取传递的参数
                string ImgListAdvID = PublicClass.FilterRequestTrim("ImgListAdvID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //防止数字类型为空
                ImgListAdvID = PublicClass.preventNumberDataIsNull(ImgListAdvID);

                string _jsonBack = BusiAdv.lockAdvImgListApi(Convert.ToInt64(ImgListAdvID), IsLock);
                return _jsonBack;
            }
            else if (_exeType == "6") //初始化图片列表广告信息
            {
                // 获取传递的参数
                string ImgListAdvID = PublicClass.FilterRequestTrim("ImgListAdvID");

                //防止数字类型为空
                ImgListAdvID = PublicClass.preventNumberDataIsNull(ImgListAdvID);

                string _jsonBack = BusiAdv.initAdvImgListApi(Convert.ToInt64(ImgListAdvID));
                return _jsonBack;
            }
            else if (_exeType == "7") //置顶横幅广告
            {
                // 获取传递的参数
                string ImgListAdvID = PublicClass.FilterRequestTrim("ImgListAdvID");

                //防止数字类型为空
                ImgListAdvID = PublicClass.preventNumberDataIsNull(ImgListAdvID);

                string _jsonBack = BusiAdv.goTopAdvImgListApi(Convert.ToInt64(ImgListAdvID));
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 推荐商品商家信息
        /// </summary>
        /// <returns></returns>
        public string RcdGoodsShop()
        {

            //获取操作类型  Type=1 搜索分页数据  Type=2 提交 推荐商家与商品 一般是附近首页 Type=3 批量 锁定/解锁 推荐商家与商品 Type=4 批量删除推荐商家与商品 Type=5 置顶推荐商家与商品 Type=6 加载推荐商家与商品信息(首页显示) Type=7 初始化推荐商家与商品信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "6")//加载推荐商家与商品信息 (首页显示)
            {
                //获取传递的参数
                string RcdType = PublicClass.FilterRequestTrim("RcdType");
                string AdvType = PublicClass.FilterRequestTrim("AdvType");

                //可选
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                //Cookie中的经纬度
                string CookieLng = PublicClass.FilterRequestTrim("CookieLng");
                string CookieLat = PublicClass.FilterRequestTrim("CookieLat");

                //选择地区
                string SelCityRegionCodeArr = PublicClass.FilterRequestTrim("SelCityRegionCodeArr");

                if (string.IsNullOrWhiteSpace(SelCityRegionCodeArr))
                {
                    SelCityRegionCodeArr = OctAdvertiserSystemNS.WebAppConfig.SelCityRegionCodeArrDefault;
                }


                string LoadNum = PublicClass.FilterRequestTrim("LoadNum");
                if (string.IsNullOrWhiteSpace(LoadNum))
                {
                    LoadNum = "1000";
                }


                //防止数字为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _json = BusiAdv.loadRcdGoodsShopApi(RcdType, AdvType, Convert.ToInt32(LoadNum), SelCityRegionCodeArr, Convert.ToInt64(BuyerUserID), CookieLng, CookieLat);
                return _json;

            }

            //----------------验证RndKeyRsa是否正确----------------//
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }


            if (_exeType == "1")
            {
                // 获取传递的参数
                string RcdGoodsShopID = PublicClass.FilterRequestTrim("RcdGoodsShopID");
                string SelCityRegionCodeArr = PublicClass.FilterRequestTrim("SelCityRegionCodeArr");
                string RcdType = PublicClass.FilterRequestTrim("RcdType");
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                string AdvType = PublicClass.FilterRequestTrim("AdvType");
                string RcdMemo = PublicClass.FilterRequestTrim("RcdMemo");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                RcdGoodsShopID = PublicClass.preventNumberDataIsNull(RcdGoodsShopID);
                GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);
                ShopID = PublicClass.preventNumberDataIsNull(ShopID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelRcdGoodsShop _modelRcdGoodsShop = new ModelRcdGoodsShop();
                _modelRcdGoodsShop.RcdGoodsShopID = Convert.ToInt64(RcdGoodsShopID);
                _modelRcdGoodsShop.SelCityRegionCodeArr = SelCityRegionCodeArr;
                _modelRcdGoodsShop.RcdType = RcdType;
                _modelRcdGoodsShop.GoodsID = Convert.ToInt64(GoodsID);
                _modelRcdGoodsShop.ShopID = Convert.ToInt64(ShopID);
                _modelRcdGoodsShop.AdvType = AdvType;
                _modelRcdGoodsShop.RcdMemo = RcdMemo;
                _modelRcdGoodsShop.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelRcdGoodsShop.IsLock = IsLock;
                _modelRcdGoodsShop.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONRcdGoodsShop(_modelRcdGoodsShop, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //提交 推荐商家与商品
            {
                //获取传递的参数
                string RcdGoodsShopID = PublicClass.FilterRequestTrim("RcdGoodsShopID");
                string RcdType = PublicClass.FilterRequestTrim("RcdType");
                string SelCityRegionCodeArr = PublicClass.FilterRequestTrim("SelCityRegionCodeArr");
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                string AdvType = PublicClass.FilterRequestTrim("AdvType");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string RcdMemo = PublicClass.FilterRequestTrim("RcdMemo");

                if (string.IsNullOrWhiteSpace(SelCityRegionCodeArr))
                {
                    SelCityRegionCodeArr = "-";
                }

                //防止数字为空
                RcdGoodsShopID = PublicClass.preventNumberDataIsNull(RcdGoodsShopID);
                GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);
                ShopID = PublicClass.preventNumberDataIsNull(ShopID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiAdv.submitRcdGoodsShopApi(Convert.ToInt64(RcdGoodsShopID), RcdType, SelCityRegionCodeArr, Convert.ToInt64(GoodsID), Convert.ToInt64(ShopID), AdvType, Convert.ToInt64(ShopUserID), RcdMemo);
                return _jsonBack;
            }
            else if (_exeType == "3") //批量 锁定/解锁 推荐商家与商品
            {
                //获取传递的参数
                string RcdGoodsShopIDArr = PublicClass.FilterRequestTrim("RcdGoodsShopIDArr");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                string _jsonBack = BusiAdv.lockRcdGoodsShopArrApi(RcdGoodsShopIDArr, IsLock);
                return _jsonBack;
            }
            else if (_exeType == "4") //批量删除推荐商家与商品
            {
                //获取传递的参数
                string RcdGoodsShopIDArr = PublicClass.FilterRequestTrim("RcdGoodsShopIDArr");

                string _jsonBack = BusiAdv.delRcdGoodsShopArrApi(RcdGoodsShopIDArr);
                return _jsonBack;
            }
            else if (_exeType == "5") //置顶推荐商家与商品
            {
                //获取传递的参数
                string RcdGoodsShopID = PublicClass.FilterRequestTrim("RcdGoodsShopID");

                //防止数字为空
                RcdGoodsShopID = PublicClass.preventNumberDataIsNull(RcdGoodsShopID);

                //置顶 推荐商家与商品
                string _jsonBack = BusiAdv.goTopRcdGoodsShopApi(Convert.ToInt64(RcdGoodsShopID));
                return _jsonBack;
            }
            else if (_exeType == "7") //初始化推荐商家与商品信息 
            {
                //获取传递的参数
                string RcdGoodsShopID = PublicClass.FilterRequestTrim("RcdGoodsShopID");

                //防止数字为空
                RcdGoodsShopID = PublicClass.preventNumberDataIsNull(RcdGoodsShopID);

                //置顶 推荐商家与商品
                string _jsonBack = BusiAdv.initRcdGoodsShopApi(Convert.ToInt64(RcdGoodsShopID));
                return _jsonBack;
            }
            return "";
        }

        /// <summary>
        /// 商品店铺搜索历史
        /// </summary>
        /// <returns></returns>
        public string SearchHistoryGoodsShop()
        {
            //获取操作类型  Type=1 搜索分页数据  Type=2 加载买家商品店铺搜索历史 Type=3 删除商品店铺搜索历史 Type=4 提交商品店铺搜索历史
            string _exeType = PublicClass.FilterRequestTrim("Type");


            //------验证RndKeyRsa是否正确-------//
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }


            if (_exeType == "1")
            {
                // 获取传递的参数
                string SearchHistoryID = PublicClass.FilterRequestTrim("SearchHistoryID");
                string SearchType = PublicClass.FilterRequestTrim("SearchType");
                string SearchContent = PublicClass.FilterRequestTrim("SearchContent");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                SearchHistoryID = PublicClass.preventNumberDataIsNull(SearchHistoryID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelSearchHistoryGoodsShop _modelSearchHistoryGoodsShop = new ModelSearchHistoryGoodsShop();
                _modelSearchHistoryGoodsShop.SearchHistoryID = Convert.ToInt64(SearchHistoryID);
                _modelSearchHistoryGoodsShop.SearchType = SearchType;
                _modelSearchHistoryGoodsShop.SearchContent = SearchContent;
                _modelSearchHistoryGoodsShop.BuyerUserID = Convert.ToInt64(BuyerUserID);
                _modelSearchHistoryGoodsShop.IsLock = IsLock;
                _modelSearchHistoryGoodsShop.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONSearchHistoryGoodsShop(_modelSearchHistoryGoodsShop, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //加载买家商品店铺搜索历史
            {
                //获取传递的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string TopNum = PublicClass.FilterRequestTrim("TopNum");
                string SearchType = PublicClass.FilterRequestTrim("SearchType");
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");

                //防止数字类型为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                TopNum = PublicClass.preventNumberDataIsNull(TopNum);

                string _jsonBack = BusiSearch.loadSearchHistoryGoodsShopApi(Convert.ToInt64(BuyerUserID), Convert.ToInt32(TopNum), SearchType, IsEntity);
                return _jsonBack;
            }
            else if (_exeType == "3") //删除商品店铺搜索历史
            {
                //获取传递的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string SearchType = PublicClass.FilterRequestTrim("SearchType");

                //防止数字类型为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiSearch.delSearchHistoryGoodsShopApi(Convert.ToInt64(BuyerUserID), SearchType);
                return _jsonBack;
            }
            else if (_exeType == "4") //提交商品店铺搜索历史
            {
                //获取传递的参数
                string SearchHistoryID = PublicClass.FilterRequestTrim("SearchHistoryID");
                string SearchType = PublicClass.FilterRequestTrim("SearchType");
                string SearchContent = PublicClass.FilterRequestTrim("SearchContent");
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字类型为空
                SearchHistoryID = PublicClass.preventNumberDataIsNull(SearchHistoryID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiSearch.submitSearchHistoryGoodsShopApi(Convert.ToInt64(SearchHistoryID), SearchType, SearchContent, Convert.ToInt64(BuyerUserID), IsEntity);
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 搜索发现展示
        /// </summary>
        /// <returns></returns>
        public string SearchFindMsg()
        {
            //获取操作类型  Type=1 搜索分页数据  Type=2 加载搜索发现内容 Type=3 提交搜索发现 Type=4 锁定/解锁搜索发现 Type=5 批量 删除 搜索发现 Type=6  置顶 搜索发现 
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "2") //加载搜索发现内容
            {
                //获取传递的参数
                string FindType = PublicClass.FilterRequestTrim("FindType");
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");
                string LoadNum = PublicClass.FilterRequestTrim("LoadNum");

                //防止数字类型为空
                LoadNum = PublicClass.preventNumberDataIsNull(LoadNum);

                string _jsonBack = BusiSearch.loadTopSearchFindMsgApi(FindType, IsEntity, Convert.ToInt32(LoadNum));
                return _jsonBack;
            }

            //----------验证RndKeyRsa是否正确-----------//
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }


            if (_exeType == "1") //搜索分页数据
            {
                // 获取传递的参数
                string SearchFindID = PublicClass.FilterRequestTrim("SearchFindID");
                string FindType = PublicClass.FilterRequestTrim("FindType");
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");
                string SearchContent = PublicClass.FilterRequestTrim("SearchContent");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                SearchFindID = PublicClass.preventNumberDataIsNull(SearchFindID);


                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelSearchFindMsg _modelSearchFindMsg = new ModelSearchFindMsg();
                _modelSearchFindMsg.SearchFindID = Convert.ToInt64(SearchFindID);
                _modelSearchFindMsg.FindType = FindType;
                _modelSearchFindMsg.IsEntity = IsEntity;
                _modelSearchFindMsg.SearchContent = SearchContent;
                _modelSearchFindMsg.IsLock = IsLock;
                _modelSearchFindMsg.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONSearchFindMsg(_modelSearchFindMsg, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "3") //提交搜索发现
            {
                // 获取传递的参数
                string SearchFindID = PublicClass.FilterRequestTrim("SearchFindID");
                string FindType = PublicClass.FilterRequestTrim("FindType");
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");
                string SearchContent = PublicClass.FilterRequestTrim("SearchContent");


                //防止数字类型为空
                SearchFindID = PublicClass.preventNumberDataIsNull(SearchFindID);

                //提交搜索发现 
                string _jsonBack = BusiSearch.submitSearchFindMsgApi(Convert.ToInt64(SearchFindID), FindType, IsEntity, SearchContent);
                return _jsonBack;
            }
            else if (_exeType == "4") //锁定/解锁搜索发现
            {
                // 获取传递的参数
                string SearchFindID = PublicClass.FilterRequestTrim("SearchFindID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //防止数字类型为空
                SearchFindID = PublicClass.preventNumberDataIsNull(SearchFindID);

                string _jsonBack = BusiSearch.tglLockSearchFindMsgApi(Convert.ToInt64(SearchFindID), IsLock);
                return _jsonBack;
            }
            else if (_exeType == "5") //批量 删除 搜索发现
            {
                // 获取传递的参数
                string SearchFindIDArr = PublicClass.FilterRequestTrim("SearchFindIDArr");

                string _jsonBack = BusiSearch.delSearchFindMsgApi(SearchFindIDArr);
                return _jsonBack;
            }
            else if (_exeType == "6") //置顶 搜索发现 
            {
                // 获取传递的参数
                string SearchFindID = PublicClass.FilterRequestTrim("SearchFindID");

                //防止数字类型为空
                SearchFindID = PublicClass.preventNumberDataIsNull(SearchFindID);

                string _jsonBack = BusiSearch.goTopSearchFindMsgApi(Convert.ToInt64(SearchFindID));
                return _jsonBack;
            }


            return "";
        }



    }
}