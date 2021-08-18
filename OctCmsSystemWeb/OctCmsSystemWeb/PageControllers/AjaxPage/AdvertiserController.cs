using BusiApiHttpNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【广告系统( OctAdvertiserSystem )】Ajax请求控制器
/// </summary>
namespace OctCmsSystemWeb.PageControllers.AjaxPage
{
    public class AdvertiserController : Controller
    {


        /// <summary>
        /// 轮播广告
        /// </summary>
        /// <returns></returns>
        public string AdvCarousel()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("AdvertiserPage/AdvCarousel");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索分页数据  Type=2 提交轮播广告 Type=3 初始化轮播广告信息 Type=4 锁定/解锁  轮播广告 Type=5 置顶轮播广告 Type=6 批量删除轮播广告
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string CarouselID = PublicClass.FilterRequestTrim("CarouselID");
                string AdvType = PublicClass.FilterRequestTrim("AdvType");
                string AdvTitleType = PublicClass.FilterRequestTrim("AdvTitleType");
                string AdvOsType = PublicClass.FilterRequestTrim("AdvOsType");
                string OverTime = PublicClass.FilterRequestTrim("OverTime");
                string ImgURL = PublicClass.FilterRequestTrimNoConvert("ImgURL");
                string AdvMemo = PublicClass.FilterRequestTrimNoConvert("AdvMemo");
                string RegionCodeArr = PublicClass.FilterRequestTrim("RegionCodeArr");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("CarouselID", CarouselID);
                _dic.Add("AdvType", AdvType);
                _dic.Add("AdvTitleType", AdvTitleType);
                _dic.Add("AdvOsType", AdvOsType);
                _dic.Add("OverTime", OverTime);
                _dic.Add("ImgURL", ImgURL);
                _dic.Add("AdvMemo", AdvMemo);
                _dic.Add("SelCityRegionCodeArr", RegionCodeArr);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_AdvCarousel, "ADV_AdvCarousel", "1", _dic);

                return _json;
            }
            else if (_exeType == "2") //提交轮播广告
            {
                // 获取传递的参数
                string CarouselID = PublicClass.FilterRequestTrim("CarouselID");
                string SelCityRegionCodeArr = PublicClass.FilterRequestTrim("SelCityRegionCodeArr");
                string AdvType = PublicClass.FilterRequestTrim("AdvType");
                string AdvTitleType = PublicClass.FilterRequestTrim("AdvTitleType");
                string AdvOsType = PublicClass.FilterRequestTrim("AdvOsType");
                string AdvLinkType = PublicClass.FilterRequestTrimNoConvert("AdvLinkType");
                string AdvLinkA = PublicClass.FilterRequestTrimNoConvert("AdvLinkA");
                string ImgURL = PublicClass.FilterRequestTrim("ImgURL");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //选填
                string OverTime = PublicClass.FilterRequestTrim("OverTime");
                string AdvMemo = PublicClass.FilterRequestTrim("AdvMemo");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("CarouselID", CarouselID);
                _dic.Add("SelCityRegionCodeArr", SelCityRegionCodeArr);
                _dic.Add("AdvType", AdvType);
                _dic.Add("AdvTitleType", AdvTitleType);
                _dic.Add("AdvOsType", AdvOsType);
                _dic.Add("AdvLinkType", AdvLinkType);
                _dic.Add("AdvLinkA", AdvLinkA);
                _dic.Add("ImgURL", ImgURL);
                _dic.Add("UploadGuid", UploadGuid);
                _dic.Add("OverTime", OverTime);
                _dic.Add("AdvMemo", AdvMemo);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_AdvCarousel, "ADV_AdvCarousel", "3", _dic);
                return _json;
            }
            else if (_exeType == "3") //初始化轮播广告信息
            {
                // 获取传递的参数
                string CarouselID = PublicClass.FilterRequestTrim("CarouselID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("CarouselID", CarouselID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_AdvCarousel, "ADV_AdvCarousel", "6", _dic);
                return _json;

            }
            else if (_exeType == "4") //锁定/解锁  轮播广告 
            {
                // 获取传递的参数
                string CarouselID = PublicClass.FilterRequestTrim("CarouselID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("CarouselID", CarouselID);
                _dic.Add("IsLock", IsLock);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_AdvCarousel, "ADV_AdvCarousel", "5", _dic);
                return _json;
            }
            else if (_exeType == "5") //置顶轮播广告
            {
                // 获取传递的参数
                string CarouselID = PublicClass.FilterRequestTrim("CarouselID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("CarouselID", CarouselID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_AdvCarousel, "ADV_AdvCarousel", "7", _dic);
                return _json;
            }
            else if (_exeType == "6") //批量删除轮播广告
            {
                // 获取传递的参数
                string UploadGuidArr = PublicClass.FilterRequestTrim("UploadGuidArr");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UploadGuidArr", UploadGuidArr);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_AdvCarousel, "ADV_AdvCarousel", "4", _dic);
                return _json;
            }


            return "";
        }

        /// <summary>
        /// 横幅通栏广告
        /// </summary>
        /// <returns></returns>
        public string AdvBanner()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("AdvertiserPage/AdvBanner");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索分页数据 Type=2 提交横幅通栏广告 Type=3 初始化横幅广告图片信息 Type=4 锁定/解锁 横幅通栏广告(隐藏显示) Type=5 置顶横幅广告
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string BannerID = PublicClass.FilterRequestTrim("BannerID");
                string AdvType = PublicClass.FilterRequestTrim("AdvType");
                string AdvTitleType = PublicClass.FilterRequestTrim("AdvTitleType");
                string AdvOsType = PublicClass.FilterRequestTrim("AdvOsType");
                string ImgURL = PublicClass.FilterRequestTrim("ImgURL");
                string AdvMemo = PublicClass.FilterRequestTrim("AdvMemo");
                string RegionCodeArr = PublicClass.FilterRequestTrim("RegionCodeArr");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string OverTime = PublicClass.FilterRequestTrim("OverTime");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("BannerID", BannerID);
                _dic.Add("AdvType", AdvType);
                _dic.Add("AdvTitleType", AdvTitleType);
                _dic.Add("AdvOsType", AdvOsType);
                _dic.Add("OverTime", OverTime);
                _dic.Add("ImgURL", ImgURL);
                _dic.Add("AdvMemo", AdvMemo);
                _dic.Add("SelCityRegionCodeArr", RegionCodeArr);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_AdvBanner, "ADV_AdvBanner", "1", _dic);

                return _json;
            }
            else if (_exeType == "2") //提交横幅通栏广告
            {
                // 获取传递的参数
                string BannerID = PublicClass.FilterRequestTrim("BannerID");
                string SelCityRegionCodeArr = PublicClass.FilterRequestTrim("SelCityRegionCodeArr");
                string AdvType = PublicClass.FilterRequestTrim("AdvType");
                string AdvTitleType = PublicClass.FilterRequestTrim("AdvTitleType");
                string AdvOsType = PublicClass.FilterRequestTrim("AdvOsType");
                string AdvLinkType = PublicClass.FilterRequestTrimNoConvert("AdvLinkType");
                string AdvLinkA = PublicClass.FilterRequestTrimNoConvert("AdvLinkA");
                string ImgURL = PublicClass.FilterRequestTrim("ImgURL");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //选填
                string OverTime = PublicClass.FilterRequestTrim("OverTime");
                string AdvMemo = PublicClass.FilterRequestTrim("AdvMemo");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("BannerID", BannerID);
                _dic.Add("SelCityRegionCodeArr", SelCityRegionCodeArr);
                _dic.Add("AdvType", AdvType);
                _dic.Add("AdvTitleType", AdvTitleType);
                _dic.Add("AdvOsType", AdvOsType);
                _dic.Add("AdvLinkType", AdvLinkType);
                _dic.Add("AdvLinkA", AdvLinkA);
                _dic.Add("ImgURL", ImgURL);
                _dic.Add("UploadGuid", UploadGuid);
                _dic.Add("OverTime", OverTime);
                _dic.Add("AdvMemo", AdvMemo);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_AdvBanner, "ADV_AdvBanner", "3", _dic);
                return _json;
            }
            else if (_exeType == "3") //初始化横幅广告图片信息
            {
                // 获取传递的参数
                string BannerID = PublicClass.FilterRequestTrim("BannerID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("BannerID", BannerID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_AdvBanner, "ADV_AdvBanner", "6", _dic);
                return _json;

            }
            else if (_exeType == "4") //锁定/解锁 横幅通栏广告(隐藏显示)
            {
                // 获取传递的参数
                string BannerID = PublicClass.FilterRequestTrim("BannerID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("BannerID", BannerID);
                _dic.Add("IsLock", IsLock);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_AdvBanner, "ADV_AdvBanner", "5", _dic);
                return _json;
            }
            else if (_exeType == "5") //置顶横幅广告
            {
                // 获取传递的参数
                string BannerID = PublicClass.FilterRequestTrim("BannerID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("BannerID", BannerID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_AdvBanner, "ADV_AdvBanner", "7", _dic);
                return _json;
            }
            else if (_exeType == "6") //批量删除广告
            {
                // 获取传递的参数
                string UploadGuidArr = PublicClass.FilterRequestTrim("UploadGuidArr");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UploadGuidArr", UploadGuidArr);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_AdvBanner, "ADV_AdvBanner", "4", _dic);
                return _json;
            }

            return "";
        }

        /// <summary>
        /// 图片列表栏目
        /// </summary>
        /// <returns></returns>
        public string AdvImgList()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("AdvertiserPage/AdvImgList");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索分页数据 Type=2 提交图片列表广告 Type=3 初始化广告图片信息 Type=4 锁定/解锁 广告(隐藏显示) Type=5 置顶广告图片 Type=6 批量删除广告
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string ImgListAdvID = PublicClass.FilterRequestTrim("ImgListAdvID");
                string AdvType = PublicClass.FilterRequestTrim("AdvType");
                string AdvTitleType = PublicClass.FilterRequestTrim("AdvTitleType");
                string AdvTitleName = PublicClass.FilterRequestTrim("AdvTitleName");
                string AdvOsType = PublicClass.FilterRequestTrim("AdvOsType");
                string ImgURL = PublicClass.FilterRequestTrim("ImgURL");
                string AdvMemo = PublicClass.FilterRequestTrim("AdvMemo");
                string RegionCodeArr = PublicClass.FilterRequestTrim("RegionCodeArr");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string OverTime = PublicClass.FilterRequestTrim("OverTime");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("ImgListAdvID", ImgListAdvID);
                _dic.Add("AdvType", AdvType);
                _dic.Add("AdvTitleType", AdvTitleType);
                _dic.Add("AdvTitleName", AdvTitleName);
                _dic.Add("AdvOsType", AdvOsType);
                _dic.Add("OverTime", OverTime);
                _dic.Add("ImgURL", ImgURL);
                _dic.Add("AdvMemo", AdvMemo);
                _dic.Add("SelCityRegionCodeArr", RegionCodeArr);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_AdvImgList, "ADV_AdvImgList", "1", _dic);

                return _json;
            }
            else if (_exeType == "2") //提交图片列表广告
            {
                //获取传递的参数
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

                //选填
                string OverTime = PublicClass.FilterRequestTrim("OverTime");
                string AdvMemo = PublicClass.FilterRequestTrim("AdvMemo");


                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ImgListAdvID", ImgListAdvID);
                _dic.Add("SelCityRegionCodeArr", SelCityRegionCodeArr);
                _dic.Add("AdvType", AdvType);
                _dic.Add("AdvTitleType", AdvTitleType);
                _dic.Add("AdvTitleName", AdvTitleName);
                _dic.Add("AdvTitleNameIsShow", AdvTitleNameIsShow);
                _dic.Add("AdvTitleNameSub", AdvTitleNameSub);
                _dic.Add("AdvOsType", AdvOsType);
                _dic.Add("AdvLinkType", AdvLinkType);
                _dic.Add("AdvLinkA", AdvLinkA);
                _dic.Add("ImgURL", ImgURL);
                _dic.Add("UploadGuid", UploadGuid);
                _dic.Add("OverTime", OverTime);
                _dic.Add("AdvMemo", AdvMemo);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_AdvImgList, "ADV_AdvImgList", "3", _dic);
                return _json;
            }
            else if (_exeType == "3") //初始化广告图片信息
            {
                // 获取传递的参数
                string ImgListAdvID = PublicClass.FilterRequestTrim("ImgListAdvID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ImgListAdvID", ImgListAdvID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_AdvImgList, "ADV_AdvImgList", "6", _dic);
                return _json;
            }
            else if (_exeType == "4") //锁定/解锁 广告(隐藏显示)
            {
                // 获取传递的参数
                string ImgListAdvID = PublicClass.FilterRequestTrim("ImgListAdvID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ImgListAdvID", ImgListAdvID);
                _dic.Add("IsLock", IsLock);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_AdvImgList, "ADV_AdvImgList", "5", _dic);
                return _json;
            }
            else if (_exeType == "5") //置顶广告图片
            {
                // 获取传递的参数
                string ImgListAdvID = PublicClass.FilterRequestTrim("ImgListAdvID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ImgListAdvID", ImgListAdvID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_AdvImgList, "ADV_AdvImgList", "7", _dic);
                return _json;
            }
            else if (_exeType == "6") //批量删除广告
            {
                // 获取传递的参数
                string UploadGuidArr = PublicClass.FilterRequestTrim("UploadGuidArr");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UploadGuidArr", UploadGuidArr);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_AdvImgList, "ADV_AdvImgList", "4", _dic);
                return _json;
            }


            return "";
        }

        /// <summary>
        /// 栏目图标导航
        /// </summary>
        /// <returns></returns>
        public string NavIconMsg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("AdvertiserPage/NavIconMsg");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索分页数据 Type=2 提交 栏目图标导航信息 Type=3 初始化栏目图标导航信息 Type=4 切换显隐栏目图标导航 Type=5 批量删除 栏目图标导航信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string NavIconID = PublicClass.FilterRequestTrim("NavIconID");
                string NavType = PublicClass.FilterRequestTrim("NavType");
                string OsType = PublicClass.FilterRequestTrim("OsType");
                string NavName = PublicClass.FilterRequestTrim("NavName");
                string SortNum = PublicClass.FilterRequestTrim("SortNum");
                string NavMemo = PublicClass.FilterRequestTrim("NavMemo");
                string IsShow = PublicClass.FilterRequestTrim("IsShow");

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("NavIconID", NavIconID);
                _dic.Add("NavType", NavType);
                _dic.Add("OsType", OsType);
                _dic.Add("NavName", NavName);
                _dic.Add("SortNum", SortNum);
                _dic.Add("NavMemo", NavMemo);
                _dic.Add("IsShow", IsShow);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_NavIconMsg, "ADV_NavIconMsg", "1", _dic);

                return _json;
            }
            else if (_exeType == "2") //提交 栏目图标导航信息
            {
                // 获取传递的参数
                string NavIconID = PublicClass.FilterRequestTrim("NavIconID");
                string NavType = PublicClass.FilterRequestTrim("NavType");
                string OsType = PublicClass.FilterRequestTrim("OsType");
                string NavName = PublicClass.FilterRequestTrim("NavName");
                string IconUrl = PublicClass.FilterRequestTrimNoConvert("IconUrl");
                string LinkType = PublicClass.FilterRequestTrim("LinkType");
                string LinkURL = PublicClass.FilterRequestTrimNoConvert("LinkURL");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");
                string SortNum = PublicClass.FilterRequestTrim("SortNum");
                string NavMemo = PublicClass.FilterRequestTrim("NavMemo");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("NavIconID", NavIconID);
                _dic.Add("NavType", NavType);
                _dic.Add("OsType", OsType);
                _dic.Add("NavName", NavName);
                _dic.Add("IconUrl", IconUrl);
                _dic.Add("LinkType", LinkType);
                _dic.Add("LinkURL", LinkURL);
                _dic.Add("UploadGuid", UploadGuid);
                _dic.Add("SortNum", SortNum);
                _dic.Add("NavMemo", NavMemo);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_NavIconMsg, "ADV_NavIconMsg", "3", _dic);

                return _json;
            }
            else if (_exeType == "3") //初始化栏目图标导航信息
            {
                // 获取传递的参数
                string NavIconID = PublicClass.FilterRequestTrim("NavIconID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("NavIconID", NavIconID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_NavIconMsg, "ADV_NavIconMsg", "7", _dic);

                return _json;
            }
            else if (_exeType == "4") //切换显隐栏目图标导航
            {
                // 获取传递的参数
                string NavIconIDArr = PublicClass.FilterRequestTrim("NavIconIDArr");
                string IsShow = PublicClass.FilterRequestTrim("IsShow");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("NavIconIDArr", NavIconIDArr);
                _dic.Add("IsShow", IsShow);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_NavIconMsg, "ADV_NavIconMsg", "4", _dic);

                return _json;
            }
            else if (_exeType == "5") //批量删除 栏目图标导航信息
            {
                // 获取传递的参数
                string UploadGuidArr = PublicClass.FilterRequestTrim("UploadGuidArr");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UploadGuidArr", UploadGuidArr);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_NavIconMsg, "ADV_NavIconMsg", "5", _dic);

                return _json;
            }

            return "";
        }

        /// <summary>
        /// 推荐商品商家
        /// </summary>
        /// <returns></returns>
        public string RcdGoodsShop()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("AdvertiserPage/RcdGoodsShop");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 提交推荐商家与商品 Type=3 初始化推荐商家与商品信息 Type=4 批量锁定/解锁推荐商家与商品 Type=5 置顶推荐商家与商品 Type=6 批量删除推荐商家与商品
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string RcdGoodsShopID = PublicClass.FilterRequestTrim("RcdGoodsShopID");
                string RegionCodeArr = PublicClass.FilterRequestTrim("RegionCodeArr");
                string RcdType = PublicClass.FilterRequestTrim("RcdType");
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                string AdvType = PublicClass.FilterRequestTrim("AdvType");
                string RcdMemo = PublicClass.FilterRequestTrim("RcdMemo");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("RcdGoodsShopID", RcdGoodsShopID);
                _dic.Add("SelCityRegionCodeArr", RegionCodeArr);
                _dic.Add("RcdType", RcdType);
                _dic.Add("GoodsID", GoodsID);
                _dic.Add("ShopID", ShopID);
                _dic.Add("AdvType", AdvType);
                _dic.Add("RcdMemo", RcdMemo);
                _dic.Add("ShopUserID", ShopUserID);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_RcdGoodsShop, "ADV_RcdGoodsShop", "1", _dic);

                return _json;
            }
            else if (_exeType == "2") //提交推荐商家与商品
            {
                //获取传递的参数
                string RcdGoodsShopID = PublicClass.FilterRequestTrim("RcdGoodsShopID");
                string RcdType = PublicClass.FilterRequestTrim("RcdType");
                string SelCityRegionCodeArr = PublicClass.FilterRequestTrim("SelCityRegionCodeArr");
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                string AdvType = PublicClass.FilterRequestTrim("AdvType");
                string RcdMemo = PublicClass.FilterRequestTrim("RcdMemo");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("RcdGoodsShopID", RcdGoodsShopID);
                _dic.Add("RcdType", RcdType);
                _dic.Add("SelCityRegionCodeArr", SelCityRegionCodeArr);
                _dic.Add("GoodsID", GoodsID);
                _dic.Add("ShopID", ShopID);
                _dic.Add("AdvType", AdvType);
                _dic.Add("RcdMemo", RcdMemo);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_RcdGoodsShop, "ADV_RcdGoodsShop", "2", _dic);

                return _json;
            }
            else if (_exeType == "3") //初始化推荐商家与商品信息
            {
                //获取传递的参数
                string RcdGoodsShopID = PublicClass.FilterRequestTrim("RcdGoodsShopID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("RcdGoodsShopID", RcdGoodsShopID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_RcdGoodsShop, "ADV_RcdGoodsShop", "7", _dic);

                return _json;
            }
            else if (_exeType == "4") //批量锁定/解锁推荐商家与商品
            {
                //获取传递的参数
                string RcdGoodsShopIDArr = PublicClass.FilterRequestTrim("RcdGoodsShopIDArr");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("RcdGoodsShopIDArr", RcdGoodsShopIDArr);
                _dic.Add("IsLock", IsLock);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_RcdGoodsShop, "ADV_RcdGoodsShop", "3", _dic);
                return _json;
            }
            else if (_exeType == "5") //置顶推荐商家与商品
            {
                //获取传递的参数
                string RcdGoodsShopID = PublicClass.FilterRequestTrim("RcdGoodsShopID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("RcdGoodsShopID", RcdGoodsShopID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_RcdGoodsShop, "ADV_RcdGoodsShop", "5", _dic);

                return _json;
            }
            else if (_exeType == "6") //批量删除推荐商家与商品
            {
                //获取传递的参数
                string RcdGoodsShopIDArr = PublicClass.FilterRequestTrim("RcdGoodsShopIDArr");

                // 添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("RcdGoodsShopIDArr", RcdGoodsShopIDArr);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_RcdGoodsShop, "ADV_RcdGoodsShop", "4", _dic);

                return _json;

            }

            return "";
        }

        /// <summary>
        /// 搜索发现
        /// </summary>
        /// <returns></returns>
        public string SearchFindMsg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("AdvertiserPage/SearchFindMsg");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索分页数据 Type=2 提交搜索发现 Type=3 锁定/解锁搜索发现 Type=4 置顶搜索发现 Type=5 批量删除搜索发现 Type=6 加载搜索发现内容
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string SearchFindID = PublicClass.FilterRequestTrim("SearchFindID");
                string FindType = PublicClass.FilterRequestTrim("FindType");
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");
                string SearchContent = PublicClass.FilterRequestTrim("SearchContent");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("SearchFindID", SearchFindID);
                _dic.Add("FindType", FindType);
                _dic.Add("IsEntity", IsEntity);
                _dic.Add("SearchContent", SearchContent);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_SearchFindMsg, "ADV_SearchFindMsg", "1", _dic);

                return _json;
            }
            else if (_exeType == "2") //提交搜索发现
            {
                //获取传递的参数
                //string SearchFindID = PublicClass.FilterRequestTrim("SearchFindID");
                string FindType = PublicClass.FilterRequestTrim("FindType");
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");
                string SearchContent = PublicClass.FilterRequestTrim("SearchContent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("FindType", FindType);
                _dic.Add("SearchContent", SearchContent);
                _dic.Add("IsEntity", IsEntity);


                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_SearchFindMsg, "ADV_SearchFindMsg", "3", _dic);

                return _json;
            }
            else if (_exeType == "3") //锁定/解锁搜索发现
            {
                // 获取传递的参数
                string SearchFindID = PublicClass.FilterRequestTrim("SearchFindID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("SearchFindID", SearchFindID);
                _dic.Add("IsLock", IsLock);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_SearchFindMsg, "ADV_SearchFindMsg", "4", _dic);
                return _json;
            }
            else if (_exeType == "4") //置顶搜索发现 
            {
                // 获取传递的参数
                string SearchFindID = PublicClass.FilterRequestTrim("SearchFindID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("SearchFindID", SearchFindID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_SearchFindMsg, "ADV_SearchFindMsg", "6", _dic);
                return _json;
            }
            else if (_exeType == "5") //批量删除搜索发现
            {
                // 获取传递的参数
                string SearchFindIDArr = PublicClass.FilterRequestTrim("SearchFindIDArr");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("SearchFindIDArr", SearchFindIDArr);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ADV_SearchFindMsg, "ADV_SearchFindMsg", "5", _dic);
                return _json;
            }


            return "";
        }



    }
}