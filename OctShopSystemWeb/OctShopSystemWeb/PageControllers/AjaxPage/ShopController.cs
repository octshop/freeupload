using BusiApiHttpNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【店铺】相关Ajax请求控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.AjaxPage
{
    public class ShopController : Controller
    {
        // GET: Shop
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 店铺商品类别
        /// </summary>
        /// <returns></returns>
        public string ShopGoodsType()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }
            //获取商家登录UserID
            string mShopUserID = _loginBuyerUserID;

            //获取操作类型  Type=1 加载店铺商品类别父级和子级列表 Type=2 添加或保存店铺商品类别 Type=3 初始化店铺商品类别信息 Type=4 锁定/解锁 Type=5 删除店铺商品类别
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("ShopUserID", mShopUserID);
                _dicPost.Add("IsLock", IsLock);

                //发送Http请求
                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopGoodsType, "UGS_ShopGoodsType", "6", _dicPost);

                return _jsonBack;
            }
            else if (_exeType == "2") //添加或保存店铺商品类别
            {
                //获取传递的参数
                string ShopGoodsTypeID = PublicClass.FilterRequestTrim("ShopGoodsTypeID");
                string FatherTypeID = PublicClass.FilterRequestTrim("FatherTypeID");
                string ShopGoodsTypeName = PublicClass.FilterRequestTrim("ShopGoodsTypeName");
                string TypeMemo = PublicClass.FilterRequestTrim("TypeMemo");
                string SortNum = PublicClass.FilterRequestTrim("SortNum");
                //string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("ShopUserID", mShopUserID);
                _dicPost.Add("ShopGoodsTypeID", ShopGoodsTypeID);
                _dicPost.Add("FatherTypeID", FatherTypeID);
                _dicPost.Add("ShopGoodsTypeName", ShopGoodsTypeName);
                _dicPost.Add("TypeMemo", TypeMemo);
                _dicPost.Add("SortNum", SortNum);

                string _typeNum = "2";
                if (string.IsNullOrWhiteSpace(ShopGoodsTypeID) == false)
                {
                    if (ShopGoodsTypeID != "0")
                    {
                        _typeNum = "3";
                    }
                }

                //发送Http请求
                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopGoodsType, "UGS_ShopGoodsType", _typeNum, _dicPost);

                return _jsonBack;
            }
            else if (_exeType == "3") //初始化店铺商品类别信息
            {
                //获取传递的参数
                string ShopGoodsTypeID = PublicClass.FilterRequestTrim("ShopGoodsTypeID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("ShopGoodsTypeID", ShopGoodsTypeID);

                //发送Http请求
                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopGoodsType, "UGS_ShopGoodsType", "7", _dicPost);

                return _jsonBack;
            }
            else if (_exeType == "4") //锁定/解锁
            {
                //获取传递的参数
                string ShopGoodsTypeID = PublicClass.FilterRequestTrim("ShopGoodsTypeID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("ShopGoodsTypeID", ShopGoodsTypeID);

                //发送Http请求
                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopGoodsType, "UGS_ShopGoodsType", "8", _dicPost);

                return _jsonBack;
            }
            else if (_exeType == "5") //删除店铺商品类别
            {
                //获取传递的参数
                string ShopGoodsTypeID = PublicClass.FilterRequestTrim("ShopGoodsTypeID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("ShopGoodsTypeID", ShopGoodsTypeID);

                //发送Http请求
                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopGoodsType, "UGS_ShopGoodsType", "4", _dicPost);

                return _jsonBack;
            }


            return "";
        }

        /// <summary>
        /// 运费模板管理
        /// </summary>
        /// <returns></returns>
        public string FreightTemplate()
        {
          

            return "";
        }

        /// <summary>
        /// 运费模板参数列表设置
        /// </summary>
        /// <returns></returns>
        public string FreightTemplateParamList()
        {
          

            return "";
        }

        /// <summary>
        /// 店铺信息
        /// </summary>
        /// <returns></returns>
        public string ShopMsg()
        {
            //判断登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }
            //获取商家登录UserID
            string mShopUserID = _loginBuyerUserID;

            //获取操作类型  Type=1 加载父级店铺类别 Type=2 保存店铺头像信息 Type=3 提交店铺门头Logo信息 Type=4 删除店铺门头照片 Type=5 保存店铺信息 Type=6 保存公司信息 Type=7 判断是否为 线下实体店 Type=8 加载店铺简单信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                string FatherShopTypeID = PublicClass.FilterRequestTrim("FatherShopTypeID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("FatherShopTypeID", FatherShopTypeID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopType, "UGS_ShopType", "5", _dic);
                return _json;
            }
            else if (_exeType == "2") //保存店铺头像信息
            {
                // 获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string ShopHeaderImg = PublicClass.FilterRequestTrimNoConvert("ShopHeaderImg");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UserID", UserID);
                _dic.Add("ShopHeaderImg", ShopHeaderImg);
                _dic.Add("UploadGuid", UploadGuid);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopMsg, "UGS_ShopMsg", "7", _dic);
                return _json;
            }
            else if (_exeType == "3") //提交店铺门头Logo信息
            {
                // 获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string ShopLogoImg = PublicClass.FilterRequestTrimNoConvert("ShopLogoImg");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UserID", UserID);
                _dic.Add("ShopLogoImg", ShopLogoImg);
                _dic.Add("UploadGuid", UploadGuid);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopMsg, "UGS_ShopMsg", "8", _dic);
                return _json;
            }
            else if (_exeType == "4") //删除店铺门头照片
            {
                // 获取传递的参数
                string UploadGuidArr = PublicClass.FilterRequestTrim("UploadGuidArr");

                //添加POST参数
                IDictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("UploadGuidArr", UploadGuidArr);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopLogoImg, "UGS_ShopLogoImg", "2", _dicPost);
                return _json;
            }
            else if (_exeType == "5") //保存店铺信息
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                //string UserAccount = PublicClass.FilterRequestTrim("UserAccount");
                //string CompanyID = PublicClass.FilterRequestTrim("CompanyID");
                string ShopTypeID = PublicClass.FilterRequestTrim("ShopTypeID");
                string ShopName = PublicClass.FilterRequestTrim("ShopName");
                string CompanyName = PublicClass.FilterRequestTrim("CompanyName");
                string ShopLogoImg = PublicClass.FilterRequestTrim("ShopLogoImg");
                string ShopHeaderImg = PublicClass.FilterRequestTrim("ShopHeaderImg");
                string ShopFixTel = PublicClass.FilterRequestTrim("ShopFixTel");
                string ShopMobile = PublicClass.FilterRequestTrim("ShopMobile");
                string SendMobile = PublicClass.FilterRequestTrim("SendMobile");
                string LinkMan = PublicClass.FilterRequestTrim("LinkMan");
                string LinkManMobile = PublicClass.FilterRequestTrim("LinkManMobile");
                string LinkEmail = PublicClass.FilterRequestTrimNoConvert("LinkEmail");

                string region_province = PublicClass.FilterRequestTrim("region_province");
                string region_city = PublicClass.FilterRequestTrim("region_city");
                string region_county = PublicClass.FilterRequestTrim("region_county");
                //地区范围代码 用"_"连接
                string RegionCodeArr = region_province + "_" + region_city + "_" + region_county;

                string DetailAddr = PublicClass.FilterRequestTrim("DetailAddr");
                string SearchKey = PublicClass.FilterRequestTrim("SearchKey");
                string MajorGoods = PublicClass.FilterRequestTrim("MajorGoods");
                string ShopDesc = PublicClass.FilterRequestTrim("ShopDesc");

                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");
                string Latitude = PublicClass.FilterRequestTrim("Latitude");
                string Longitude = PublicClass.FilterRequestTrim("Longitude");


                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopID", ShopID);
                _dic.Add("UserID", mShopUserID);
                //_dic.Add("CompanyID", CompanyID);
                _dic.Add("ShopTypeID", ShopTypeID);
                _dic.Add("ShopName", ShopName);
                _dic.Add("CompanyName", CompanyName);
                _dic.Add("ShopLogoImg", ShopLogoImg);
                _dic.Add("ShopHeaderImg", ShopHeaderImg);
                _dic.Add("ShopFixTel", ShopFixTel);
                _dic.Add("ShopMobile", ShopMobile);
                _dic.Add("SendMobile", SendMobile);
                _dic.Add("LinkMan", LinkMan);
                _dic.Add("LinkManMobile", LinkManMobile);
                _dic.Add("LinkEmail", LinkEmail);
                _dic.Add("RegionCodeArr", RegionCodeArr);
                _dic.Add("DetailAddr", DetailAddr);
                _dic.Add("SearchKey", SearchKey);
                _dic.Add("MajorGoods", MajorGoods);
                _dic.Add("ShopDesc", ShopDesc);
                _dic.Add("IsEntity", IsEntity);
                _dic.Add("Latitude", Latitude);
                _dic.Add("Longitude", Longitude);


                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopMsg, "UGS_ShopMsg", "12", _dic);
                return _json;
            }
            else if (_exeType == "6") //保存公司信息
            {
                // 获取传递的参数
                string UserAccount = mShopUserID; //登录的UserAccount

                //string CompanyName = PublicClass.FilterRequestTrim("CompanyName");
                //string RegAddress = PublicClass.FilterRequestTrim("RegAddress");
                string CreditCode = PublicClass.FilterRequestTrim("CreditCode");
                string LegalPerson = PublicClass.FilterRequestTrim("LegalPerson");
                string RegMoney = PublicClass.FilterRequestTrim("RegMoney");
                string SetUpDate = PublicClass.FilterRequestTrim("SetUpDate");
                string BusiScope = PublicClass.FilterRequestTrim("BusiScope");

                //获取公司ID
                string CompanyID = PublicClass.FilterRequestTrim("CompanyID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("CompanyID", CompanyID);
                _dic.Add("UserAccount", UserAccount);
                //_dic.Add("CompanyName", CompanyName);
                //_dic.Add("RegAddress", RegAddress);
                _dic.Add("CreditCode", CreditCode);
                _dic.Add("LegalPerson", LegalPerson);
                _dic.Add("RegMoney", RegMoney);
                _dic.Add("SetUpDate", SetUpDate);
                _dic.Add("BusiScope", BusiScope);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_CompanyMsg, "UGS_CompanyMsg", "2", _dic);
                return _json;
            }
            else if (_exeType == "7") //判断是否为 线下实体店
            {
                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", mShopUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopMsg, "UGS_ShopMsg", "16", _dic);
                return _json;
            }
            else if (_exeType == "8") //加载店铺简单信息
            {
                //获取传递的参数
                string IsMaskMobile = PublicClass.FilterRequestTrim("IsMaskMobile");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", mShopUserID);
                _dic.Add("IsMaskMobile", IsMaskMobile);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopMsg, "UGS_ShopMsg", "19", _dic);
                return _json;

            }

            return "";
        }

        /// <summary>
        /// 公司证件信息
        /// </summary>
        /// <returns></returns>
        public string CompanyCertificate()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }


            //获取操作类型  Type=1 搜索分页数据 Type=2 添加或编辑公司证件信息 Type=3 删除单个或批量公司证件信息 Type=4 删除单个公司证件信息UploadGuid
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string CertID = PublicClass.FilterRequestTrim("CertID");
                string CompanyID = PublicClass.FilterRequestTrim("CompanyID");
                string CertType = PublicClass.FilterRequestTrim("CertType");
                string CertImg = PublicClass.FilterRequestTrimNoConvert("CertImg");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", PageCurrent);
                _dic.Add("CertID", CertID);
                _dic.Add("CompanyID", CompanyID);
                _dic.Add("CertType", CertType);
                _dic.Add("CertImg", CertImg);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_CompanyCertificate, "UGS_CompanyCertificate", "1", _dic);
                return _json;
            }
            else if (_exeType == "2") //添加或编辑公司证件信息
            {
                // 获取传递的参数
                string CompanyID = PublicClass.FilterRequestTrim("CompanyID");
                string CertType = PublicClass.FilterRequestTrim("CertType");
                string CertImg = PublicClass.FilterRequestTrim("CertImg");
                string ImgKeyGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("CompanyID", CompanyID);
                _dic.Add("CertType", CertType);
                _dic.Add("CertImg", CertImg);
                _dic.Add("ImgKeyGuid", ImgKeyGuid);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_CompanyCertificate, "UGS_CompanyCertificate", "2", _dic);
                return _json;
            }
            else if (_exeType == "3") //删除单个或批量公司证件信息
            {
                //获取传递过来的参数
                string CertIDArr = PublicClass.FilterRequestTrim("CertIDArr");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("CertIDArr", CertIDArr);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_CompanyCertificate, "UGS_CompanyCertificate", "3", _dic);
                return _json;
            }
            else if (_exeType == "4") //删除单个公司证件信息UploadGuid
            {
                //获取传递过来的参数
                string CertType = PublicClass.FilterRequestTrim("CertType");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("CertType", CertType);
                _dic.Add("UploadGuid", UploadGuid);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_CompanyCertificate, "UGS_CompanyCertificate", "5", _dic);
                return _json;
            }
            return "";
        }

        #region【店铺相关页管理】

        /// <summary>
        /// 店铺首页轮播 - 管理
        /// </summary>
        /// <returns></returns>
        public string ShopHomeCarousel()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 查询商品，礼品，优惠券，活动，抽奖标题等信息 Type=2 提交店铺轮播信息 Type=3 数据搜索分页 Type=4 切换-隐藏与显示轮播信息 Type=5 置顶-店铺轮播信息 Type=6 初始化店铺轮播图片信息详细 Type=7 批量-删除店铺轮播信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递参数
                string SearchType = PublicClass.FilterRequestTrim("SearchType");
                string DataID = PublicClass.FilterRequestTrim("DataID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);
                _dic.Add("SearchType", SearchType);
                _dic.Add("DataID", DataID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopHomeData, "UGS_ShopHomeData", "2", _dic);
                return _json;
            }
            else if (_exeType == "2") //提交店铺轮播信息
            {
                //获取传递参数
                string CarouselID = PublicClass.FilterRequestTrim("CarouselID");
                string CarouselTitle = PublicClass.FilterRequestTrim("CarouselTitle");
                string ImgURL = PublicClass.FilterRequestTrimNoConvert("ImgURL");
                string AdvLinkType = PublicClass.FilterRequestTrimNoConvert("AdvLinkType");
                string AdvLinkA = PublicClass.FilterRequestTrimNoConvert("AdvLinkA");
                string CMemo = PublicClass.FilterRequestTrimNoConvert("CMemo");
                string UploadGuid = PublicClass.FilterRequestTrimNoConvert("UploadGuid");
                string CarouselType = PublicClass.FilterRequestTrimNoConvert("CarouselType");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);
                _dic.Add("CarouselID", CarouselID);
                _dic.Add("CarouselTitle", CarouselTitle);
                _dic.Add("ImgURL", ImgURL);
                _dic.Add("AdvLinkType", AdvLinkType);
                _dic.Add("AdvLinkA", AdvLinkA);
                _dic.Add("CMemo", CMemo);
                _dic.Add("UploadGuid", UploadGuid);
                _dic.Add("CarouselType", CarouselType);
                _dic.Add("OsType", "All");

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopCarousel, "UGS_ShopCarousel", "2", _dic);
                return _json;
            }
            else if (_exeType == "3") //数据搜索分页
            {
                // 获取传递的参数
                string CarouselID = PublicClass.FilterRequestTrim("CarouselID");
                string CarouselTitle = PublicClass.FilterRequestTrim("CarouselTitle");
                string AdvLinkType = PublicClass.FilterRequestTrimNoConvert("AdvLinkType");
                string CMemo = PublicClass.FilterRequestTrimNoConvert("CMemo");
                string WriteDate = PublicClass.FilterRequestTrimNoConvert("WriteDate");

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("ShopUserID", _loginUserID);
                _dicPost.Add("PageCurrent", pageCurrent);
                _dicPost.Add("CarouselID", CarouselID);
                _dicPost.Add("CarouselTitle", CarouselTitle);
                _dicPost.Add("AdvLinkType", AdvLinkType);
                _dicPost.Add("CMemo", CMemo);
                _dicPost.Add("WriteDate", WriteDate);

                //发送Http请求
                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopCarousel, "UGS_ShopCarousel", "1", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "4") //切换-隐藏与显示轮播信息
            {
                //获取传递参数
                string CarouselID = PublicClass.FilterRequestTrim("CarouselID");
                string IsShow = PublicClass.FilterRequestTrim("IsShow");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("ShopUserID", _loginUserID);
                _dicPost.Add("IsShow", IsShow);
                _dicPost.Add("CarouselID", CarouselID);

                //发送Http请求
                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopCarousel, "UGS_ShopCarousel", "4", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "5") //置顶-店铺轮播信息
            {
                //获取传递参数
                string CarouselID = PublicClass.FilterRequestTrim("CarouselID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("ShopUserID", _loginUserID);
                _dicPost.Add("CarouselID", CarouselID);

                //发送Http请求
                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopCarousel, "UGS_ShopCarousel", "5", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "6") //初始化店铺轮播图片信息详细
            {
                //获取传递参数
                string CarouselID = PublicClass.FilterRequestTrim("CarouselID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("ShopUserID", _loginUserID);
                _dicPost.Add("CarouselID", CarouselID);

                //发送Http请求
                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopCarousel, "UGS_ShopCarousel", "6", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "7") //批量-删除店铺轮播信息
            {
                //获取传递参数
                string CarouselIDArr = PublicClass.FilterRequestTrim("CarouselIDArr");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("ShopUserID", _loginUserID);
                _dicPost.Add("CarouselIDArr", CarouselIDArr);

                //发送Http请求
                string _jsonBack = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopCarousel, "UGS_ShopCarousel", "3", _dicPost);
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 店铺首页栏目 - 管理
        /// </summary>
        /// <returns></returns>
        public string ShopHomeSection()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 搜索店铺首页栏目商品 Type=2 批量 - 添加店铺展示信息 Type=3 加载店铺首页 各栏目展示信息 Type=4 修改店铺展示信息的 排序数值 Type=5 切换店铺展示信息是否显示 Type=6 批量 - 删除店铺展示信息 Type=7 切换全部 - 店铺展示信息是否显示 Type=8 置顶栏目，修改排序数值
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                string SectionName = PublicClass.FilterRequestTrim("SectionName");
                string SearchGoodsKey = PublicClass.FilterRequestTrim("SearchGoodsKey");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                string PageOrderName = "";
                string IsOnlyDiscount = "";

                //加载不同类型的数据
                if (SectionName == "Discount") //打折商品
                {
                    PageOrderName = "Discount";
                    IsOnlyDiscount = "true";
                }
                else if (SectionName == "Group") //团购商品
                {
                    PageOrderName = "GroupMsgCount";
                }
                else if (SectionName == "Commend") //商家推荐
                {
                    PageOrderName = "Commend";
                }
                else if (SectionName == "SecKill") //秒杀商品
                {
                    PageOrderName = "SecKill";
                }
                else if (SectionName == "Present") //礼品
                {

                }

                //加载礼品信息搜索分页
                if (SectionName == "Present")
                {
                    //添加POST参数
                    IDictionary<string, string> _dic = new Dictionary<string, string>();
                    _dic.Add("PageCurrent", _pageCurrent);
                    _dic.Add("ShopUserID", _loginUserID);
                    _dic.Add("PresentTitle", SearchGoodsKey);
                    _dic.Add("IsLock", "false");
                    _dic.Add("IsUnSale", "false");
                    _dic.Add("PresentStatus", "售");



                    //正式发送Http请求
                    string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_PresentMsg, "UGS_PresentMsg", "5", _dic);
                    return _json;
                }
                else
                {
                    //添加POST参数
                    IDictionary<string, string> _dic = new Dictionary<string, string>();
                    _dic.Add("PageCurrent", _pageCurrent);
                    _dic.Add("PageType", "cms");
                    _dic.Add("ShopUserID", _loginUserID);
                    _dic.Add("SearchGoodsKey", SearchGoodsKey);
                    _dic.Add("PageOrderName", PageOrderName);
                    _dic.Add("IsOnlyDiscount", IsOnlyDiscount);

                    //正式发送Http请求
                    string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopHomeData, "UGS_ShopHomeData", "1", _dic);
                    return _json;
                }
            }
            else if (_exeType == "2") //批量 - 添加店铺展示信息
            {
                // 获取传递的参数
                string ExtraDataIDArr = PublicClass.FilterRequestTrim("ExtraDataIDArr");
                string SectionName = PublicClass.FilterRequestTrim("SectionName");

                string ShowType = "";
                //加载不同类型的数据 展示的类型 (Home_Discount 店铺首页打折显示，Home_Group 店铺首页团购，Home_Commend 店铺首页商家推荐，Home_Present 店铺首页礼品领取，Home_SecKill 店铺首页秒杀商品)
                if (SectionName == "Discount") //打折商品
                {
                    ShowType = "Home_Discount";
                }
                else if (SectionName == "Group") //团购商品
                {
                    ShowType = "Home_Group";
                }
                else if (SectionName == "Commend") //商家推荐
                {
                    ShowType = "Home_Commend";
                }
                else if (SectionName == "Present") //礼品
                {
                    ShowType = "Home_Present";
                }
                else if (SectionName == "SecKill") //店铺首页秒杀商品
                {
                    ShowType = "Home_SecKill";
                }

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);
                _dic.Add("ExtraDataIDArr", ExtraDataIDArr);
                _dic.Add("ShowType", ShowType);


                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopShowMsg, "UGS_ShopShowMsg", "6", _dic);
                return _json;
            }
            else if (_exeType == "3") // 加载店铺首页 各栏目展示信息
            {
                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);
                _dic.Add("LoadTopNum", "1000");

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopShowMsg, "UGS_ShopShowMsg", "5", _dic);
                return _json;
            }
            else if (_exeType == "4") //修改店铺展示信息的 排序数值
            {
                // 获取传递的参数
                string ShopShowID = PublicClass.FilterRequestTrim("ShopShowID");
                string SortNum = PublicClass.FilterRequestTrim("SortNum");


                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);
                _dic.Add("ShopShowID", ShopShowID);
                _dic.Add("SortNum", SortNum);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopShowMsg, "UGS_ShopShowMsg", "2", _dic);
                return _json;
            }
            else if (_exeType == "5") //切换店铺展示信息是否显示
            {
                // 获取传递的参数
                string ShopShowID = PublicClass.FilterRequestTrim("ShopShowID");
                string IsShow = PublicClass.FilterRequestTrim("IsShow");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);
                _dic.Add("ShopShowID", ShopShowID);
                _dic.Add("IsShow", IsShow);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopShowMsg, "UGS_ShopShowMsg", "3", _dic);
                return _json;
            }
            else if (_exeType == "6") //批量 - 删除店铺展示信息
            {
                // 获取传递的参数
                string ShopShowIDArr = PublicClass.FilterRequestTrim("ShopShowIDArr");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);
                _dic.Add("ShopShowIDArr", ShopShowIDArr);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopShowMsg, "UGS_ShopShowMsg", "4", _dic);
                return _json;

            }
            else if (_exeType == "7") //切换全部 - 店铺展示信息是否显示
            {
                // 获取传递的参数
                string IsShow = PublicClass.FilterRequestTrim("IsShow");
                string ShowType = PublicClass.FilterRequestTrim("ShowType");

                //加载不同类型的数据 展示的类型 (Home_Discount 店铺首页打折显示，Home_Group 店铺首页团购，Home_Commend 店铺首页商家推荐，Home_Present 店铺首页礼品领取，Home_SecKill 店铺首页秒杀商品)
                if (ShowType == "Discount") //打折商品
                {
                    ShowType = "Home_Discount";
                }
                else if (ShowType == "Group") //团购商品
                {
                    ShowType = "Home_Group";
                }
                else if (ShowType == "Commend") //商家推荐
                {
                    ShowType = "Home_Commend";
                }
                else if (ShowType == "Present") //礼品
                {
                    ShowType = "Home_Present";
                }
                else if (ShowType == "SecKill") //秒杀
                {
                    ShowType = "Home_SecKill";
                }

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);
                _dic.Add("IsShow", IsShow);
                _dic.Add("ShowType", ShowType);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopShowMsg, "UGS_ShopShowMsg", "7", _dic);
                return _json;
            }
            else if (_exeType == "8") //置顶栏目，修改排序数值
            {
                // 获取传递的参数
                string ShowType = PublicClass.FilterRequestTrim("ShowType");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);
                _dic.Add("ShowType", ShowType);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopShowMsg, "UGS_ShopShowMsg", "9", _dic);
                return _json;

            }

            return "";
        }

        #endregion


    }
}