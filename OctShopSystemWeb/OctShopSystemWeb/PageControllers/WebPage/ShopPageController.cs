using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【店铺】相关Page页面控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.WebPage
{
    public class ShopPageController : Controller
    {
        // GET: ShopPage
        public ActionResult Index()
        {
            return View();
        }


        /// <summary>
        /// 店铺商品分类
        /// </summary>
        /// <returns></returns>
        public ActionResult ShopGoodsType()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../ShopPage/ShopGoodsType");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        /// <summary>
        /// 运费模板管理
        /// </summary>
        /// <returns></returns>
        public ActionResult FreightTemplate()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../ShopPage/FreightTemplate");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            return View();
        }

        /// <summary>
        /// 运费模板参数列表设置
        /// </summary>
        /// <returns></returns>
        public ActionResult FreightTemplateParamList()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../ShopPage/FreightTemplateParamList");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            //判断是否传递了参数
            string FtID = PublicClass.isReqAndBackReqVal("FtID");
            if (string.IsNullOrWhiteSpace(FtID))
            {
                return null;
            }
            ViewBag.FtID = FtID;

            return View();
        }

        /// <summary>
        /// 店铺信息
        /// </summary>
        /// <returns></returns>
        public ActionResult ShopMsg()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../ShopPage/ShopMsg");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            //店铺userID
            long mUserID = Convert.ToInt64(_shopUserID);


            //定义POST参数
            Dictionary<string, string> _dic = new Dictionary<string, string>();
            _dic.Add("UserID", mUserID.ToString());

            //发送异步请求
            string _json = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopMsg, "UGS_ShopMsg", "9", _dic);

            //转换Json对象
            JObject _jsonObjTop = (JObject)JsonConvert.DeserializeObject(_json);

            JObject _jsonObj = (JObject)_jsonObjTop["ShopMsg"];

            ViewBag.ShopID = _jsonObj["ShopID"].ToString().Trim();
            ViewBag.CompanyID = _jsonObj["CompanyID"].ToString().Trim();
            ViewBag.ShopTypeID = _jsonObj["ShopTypeID"].ToString().Trim();
            ViewBag.ShopName = _jsonObj["ShopName"].ToString().Trim();
            ViewBag.ShopHeaderImg = _jsonObj["ShopHeaderImg"].ToString().Trim();
            if (string.IsNullOrWhiteSpace(ViewBag.ShopHeaderImg))
            {
                ViewBag.ShopHeaderImg = "../Assets/Imgs/Icon/shop_header.png";
            }
            else
            {
                ViewBag.ShopHeaderImg = "//" + ViewBag.ShopHeaderImg;
            }

            ViewBag.ShopFixTel = _jsonObj["ShopFixTel"].ToString().Trim();
            ViewBag.ShopMobile = _jsonObj["ShopMobile"].ToString().Trim();
            ViewBag.SendMobile = _jsonObj["SendMobile"].ToString().Trim();
            ViewBag.LinkMan = _jsonObj["LinkMan"].ToString().Trim();
            ViewBag.LinkManMobile = _jsonObj["LinkManMobile"].ToString().Trim();
            ViewBag.LinkEmail = _jsonObj["LinkEmail"].ToString().Trim();
            ViewBag.RegionCodeArr = _jsonObj["RegionCodeArr"].ToString().Trim();
            ViewBag.RegionNameArr = _jsonObj["RegionNameArr"].ToString().Trim();
            ViewBag.DetailAddr = _jsonObj["DetailAddr"].ToString().Trim();
            ViewBag.SearchKey = _jsonObj["SearchKey"].ToString().Trim();
            ViewBag.MajorGoods = _jsonObj["MajorGoods"].ToString().Trim();
            ViewBag.ShopDesc = _jsonObj["ShopDesc"].ToString().Trim();

            ViewBag.IsEntity = "";
            if (_jsonObj["IsEntity"].ToString().Trim() == "true")
            {
                ViewBag.IsEntity = "checked";
            }

            ViewBag.IsSelfShop = "否";
            if (_jsonObj["IsSelfShop"].ToString().Trim() == "true")
            {
                ViewBag.IsSelfShop = "是";
            }


            ViewBag.Longitude = _jsonObj["Longitude"].ToString().Trim();
            ViewBag.Latitude = _jsonObj["Latitude"].ToString().Trim();


            //店铺状态提示
            string[] _shopStatusArr = BusiShop.showShopStatusTxt(_jsonObj["IsCheck"].ToString().Trim(), _jsonObj["IsLock"].ToString().Trim(), _jsonObj["CheckReason"].ToString().Trim());
            ViewBag.ShopStatusTxt = _shopStatusArr[0];
            ViewBag.ShopStatusDesc = _shopStatusArr[1];
            ViewBag.ShopStatusBg = _shopStatusArr[2];

            //店铺分类 
            JObject _jsonShopType = (JObject)_jsonObjTop["ShopType"];
            ViewBag.ShopType = _jsonShopType["ShopTypeNameFather"].ToString().Trim() + " -> " + _jsonShopType["ShopTypeName"].ToString().Trim();
            ViewBag.ShopTypeIDArr = _jsonShopType["FatherTypeID"].ToString() + "|" + _jsonShopType["ShopTypeID"].ToString();

            //买家信息
            JObject _jsonBuyerMsg = (JObject)_jsonObjTop["BuyerMsg"];
            ViewBag.UserID = _jsonBuyerMsg["UserID"].ToString().Trim();
            ViewBag.UserNick = _jsonBuyerMsg["UserNick"].ToString().Trim();
            ViewBag.HeaderImg = _jsonBuyerMsg["HeaderImg"].ToString().Trim();
            ViewBag.UserAccount = _jsonObjTop["UserAccount"].ToString().Trim();

            //公司信息
            JObject _jsonCompanyMsg = (JObject)_jsonObjTop["CompanyMsg"];
            ViewBag.CompanyID = _jsonCompanyMsg["CompanyID"].ToString().Trim();
            ViewBag.CompanyName = _jsonCompanyMsg["CompanyName"].ToString().Trim();
            ViewBag.RegAddress = _jsonCompanyMsg["RegAddress"].ToString().Trim();

            //店铺门头照
            JArray _jsonShopLogoImgArr = (JArray)_jsonObjTop["ListShopLogoImg"];
            //构造前台显示代码
            string _xhtml = "";
            if (_jsonShopLogoImgArr != null)
            {
                for (int i = 0; i < _jsonShopLogoImgArr.Count; i++)
                {
                    JObject _jsonObjShopLogoImg = (JObject)_jsonShopLogoImgArr[i];

                    //获取图片域名 //localhost:1400/Upload/ShopHeaderImg/SHI_1_201906160949557860.jpg
                    var _domain = _jsonObjShopLogoImg["ImgURL"].ToString().Trim().Substring(0, _jsonObjShopLogoImg["ImgURL"].ToString().Trim().IndexOf("/Upload"));
                    //获取图片相对路径 
                    var _imgPath = _jsonObjShopLogoImg["ImgURL"].ToString().Trim().Replace(_domain + "/", "");

                    _xhtml += "<div id=\"DivImg_" + _jsonObjShopLogoImg["UploadGuid"].ToString().Trim() + "\">";
                    _xhtml += " <img class=\"img-del\" onclick=\"delShopLogoImg('" + _jsonObjShopLogoImg["UploadGuid"].ToString().Trim() + "')\" src=\"../Assets/Imgs/Icon/icon-del.png\" />";
                    _xhtml += " <a href=\"javascript:void(0)\"><img id=\"Img_" + _jsonObjShopLogoImg["UploadGuid"].ToString().Trim() + "\" src=\"//" + _jsonObjShopLogoImg["ImgURL"].ToString().Trim() + "\" /></a>";
                    _xhtml += " <div class=\"crop-img-btn\">";
                    _xhtml += "     <div><a href=\"//" + _domain + "/ToolWeb/CropZoom/CropZoom.aspx?CropImgWidth=800&CropImgHeight=380&CropTitle=店铺门头照裁剪&ImgSourceURL=" + _imgPath + "&RedirectURL=#\" target=\"_blank\">裁剪照片</a></div>";
                    _xhtml += "     <div style=\"border-left: 1px solid #5A5A5A;\" onclick=\"refreshImgSrcRnd('Img_" + _jsonObjShopLogoImg["UploadGuid"].ToString().Trim() + "')\">刷新照片</div>";
                    _xhtml += " </div>";
                    _xhtml += "</div>";


                }
                ViewBag.Xhtml = _xhtml;
            }


            return View();
        }

        /// <summary>
        /// 公司信息
        /// </summary>
        /// <returns></returns>
        public ActionResult CompanyMsg()
        {
            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../ShopPage/CompanyMsg");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            //string CompanyID = PublicClass.FilterRequestTrim("CompanyID");
            //登录后的商家UserID
            string ShopUserID = _shopUserID;//"1";  //PublicClass.FilterRequestTrim("ShopUserID");

            //定义POST参数
            Dictionary<string, string> _dic = new Dictionary<string, string>();
            //_dic.Add("CompanyID", CompanyID);
            _dic.Add("ShopUserID", ShopUserID);

            //发送异步请求
            string _json = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_CompanyMsg, "UGS_CompanyMsg", "3", _dic);
            if (string.IsNullOrWhiteSpace(_json))
            {
                //没有查询到公司信息
                return null;
            }

            //转换Json对象
            JObject _jsonObjTop = (JObject)JsonConvert.DeserializeObject(_json);

            ViewBag.ShopUserID = ShopUserID;

            //公司信息
            JObject _jsonCompanyMsg = (JObject)_jsonObjTop["CompanyMsg"];
            ViewBag.CompanyID = _jsonCompanyMsg["CompanyID"].ToString().Trim();
            ViewBag.CreditCode = _jsonCompanyMsg["CreditCode"].ToString().Trim();
            ViewBag.CompanyName = _jsonCompanyMsg["CompanyName"].ToString().Trim();
            ViewBag.RegAddress = _jsonCompanyMsg["RegAddress"].ToString().Trim();
            ViewBag.LegalPerson = _jsonCompanyMsg["LegalPerson"].ToString().Trim();
            ViewBag.BusiScope = _jsonCompanyMsg["BusiScope"].ToString().Trim();

            var _SetUpDate = _jsonCompanyMsg["SetUpDate"].ToString();
            if (string.IsNullOrWhiteSpace(_SetUpDate) == false)
            {
                ViewBag.SetUpDate = Convert.ToDateTime(_jsonCompanyMsg["SetUpDate"].ToString().Trim()).ToShortDateString().Replace("/", "-");
            }

            ViewBag.RegMoney = _jsonCompanyMsg["RegMoney"].ToString().Trim();

            //买家信息
            JObject _jsonBuyerMsg = (JObject)_jsonObjTop["BuyerMsg"];
            ViewBag.UserID = _jsonBuyerMsg["UserID"].ToString().Trim();
            ViewBag.UserNick = _jsonBuyerMsg["UserNick"].ToString().Trim();
            ViewBag.HeaderImg = _jsonBuyerMsg["HeaderImg"].ToString().Trim();

            //用户账号
            ViewBag.UserAccount = _jsonObjTop["UserAccount"].ToString().Trim();

            //公司状态提示
            string[] _shopStatusArr = BusiCompany.showCompanyStatusTxt(_jsonCompanyMsg["IsCheck"].ToString().Trim(), _jsonCompanyMsg["IsLock"].ToString().Trim(), _jsonCompanyMsg["CheckReason"].ToString().Trim());
            ViewBag.ShopStatusTxt = _shopStatusArr[0];
            ViewBag.ShopStatusDesc = _shopStatusArr[1];
            ViewBag.ShopStatusBg = _shopStatusArr[2];


            //加载公司资质信息
            JArray _jsonCompanyCertificateList = (JArray)_jsonObjTop["CompanyCertificateList"];
            //构造前台显示代码
            string _xhtmlAImg1 = "", _xhtmlAImg2 = "", _xhtmlAImg3 = "", _xhtmlAImg4 = "", _xhtmlAImg5 = "", _xhtmlAImg6 = "", _xhtmlAImg7 = "", _xhtmlAImg8 = "", _xhtmlAImg9 = "";
            string _uploadGuid1 = "", _uploadGuid2 = "", _uploadGuid3 = "", _uploadGuid4 = "", _uploadGuid5 = "", _uploadGuid6 = "", _uploadGuid7 = "", _uploadGuid8 = "", _uploadGuid9 = "";
            if (_jsonCompanyCertificateList != null)
            {


                for (int i = 0; i < _jsonCompanyCertificateList.Count; i++)
                {
                    //证件类别 (营业执照 [ 1 ],法人身份证 [ 2 ],银行开户许可 [ 3 ],特许经营许可 [ 4 ],商标证 [ 5 ] , 商品代理授权 [ 6 ] 其他资质许可1 [ 7 ] 其他资质许可2 [ 8 ] 其他资质许可3 [ 9 ])
                    JObject _jObj = (JObject)_jsonCompanyCertificateList[i];

                    //营业执照 [ 1 ]
                    if (_jObj["CertType"].ToString().Trim() == "1")
                    {
                        _xhtmlAImg1 += "<a href=\"//" + _jObj["CertImg"].ToString().Trim() + "\" target=\"_blank\">";
                        _xhtmlAImg1 += "<img src=\"//" + _jObj["CertImg"].ToString().Trim() + "\" />";
                        _xhtmlAImg1 += " </a>";

                        _uploadGuid1 = _jObj["UploadGuid"].ToString().Trim();
                    }

                    //法人身份证 [ 2 ]
                    if (_jObj["CertType"].ToString().Trim() == "2")
                    {
                        _xhtmlAImg2 += "<a href=\"//" + _jObj["CertImg"].ToString().Trim() + "\" target=\"_blank\">";
                        _xhtmlAImg2 += "<img src=\"//" + _jObj["CertImg"].ToString().Trim() + "\" />";
                        _xhtmlAImg2 += " </a>";

                        _uploadGuid2 = _jObj["UploadGuid"].ToString().Trim();
                    }

                    //银行开户许可 [ 3 ]
                    if (_jObj["CertType"].ToString().Trim() == "3")
                    {
                        _xhtmlAImg3 += "<a href=\"//" + _jObj["CertImg"].ToString().Trim() + "\" target=\"_blank\">";
                        _xhtmlAImg3 += "<img src=\"//" + _jObj["CertImg"].ToString().Trim() + "\" />";
                        _xhtmlAImg3 += " </a>";

                        _uploadGuid3 = _jObj["UploadGuid"].ToString().Trim();
                    }

                    //特许经营许可 [ 4 ]
                    if (_jObj["CertType"].ToString().Trim() == "4")
                    {
                        _xhtmlAImg4 += "<a href=\"//" + _jObj["CertImg"].ToString().Trim() + "\" target=\"_blank\">";
                        _xhtmlAImg4 += "<img src=\"//" + _jObj["CertImg"].ToString().Trim() + "\" />";
                        _xhtmlAImg4 += " </a>";

                        _uploadGuid4 = _jObj["UploadGuid"].ToString().Trim();
                    }

                    //商标证 [ 5 ]
                    if (_jObj["CertType"].ToString().Trim() == "5")
                    {
                        _xhtmlAImg5 += "<a href=\"//" + _jObj["CertImg"].ToString().Trim() + "\" target=\"_blank\">";
                        _xhtmlAImg5 += "<img src=\"//" + _jObj["CertImg"].ToString().Trim() + "\" />";
                        _xhtmlAImg5 += " </a>";

                        _uploadGuid5 = _jObj["UploadGuid"].ToString().Trim();
                    }

                    //商品代理授权 [ 6 ]
                    if (_jObj["CertType"].ToString().Trim() == "6")
                    {
                        _xhtmlAImg6 += "<a href=\"//" + _jObj["CertImg"].ToString().Trim() + "\" target=\"_blank\">";
                        _xhtmlAImg6 += "<img src=\"//" + _jObj["CertImg"].ToString().Trim() + "\" />";
                        _xhtmlAImg6 += " </a>";

                        _uploadGuid6 = _jObj["UploadGuid"].ToString().Trim();
                    }

                    //其他资质许可1 [ 7 ]
                    if (_jObj["CertType"].ToString().Trim() == "7")
                    {
                        _xhtmlAImg7 += "<a href=\"//" + _jObj["CertImg"].ToString().Trim() + "\" target=\"_blank\">";
                        _xhtmlAImg7 += "<img src=\"//" + _jObj["CertImg"].ToString().Trim() + "\" />";
                        _xhtmlAImg7 += " </a>";

                        _uploadGuid7 = _jObj["UploadGuid"].ToString().Trim();
                    }

                    //其他资质许可2 [ 8 ]
                    if (_jObj["CertType"].ToString().Trim() == "8")
                    {
                        _xhtmlAImg8 += "<a href=\"//" + _jObj["CertImg"].ToString().Trim() + "\" target=\"_blank\">";
                        _xhtmlAImg8 += "<img src=\"//" + _jObj["CertImg"].ToString().Trim() + "\" />";
                        _xhtmlAImg8 += " </a>";

                        _uploadGuid8 = _jObj["UploadGuid"].ToString().Trim();
                    }

                    //其他资质许可3 [ 9 ]
                    if (_jObj["CertType"].ToString().Trim() == "9")
                    {
                        _xhtmlAImg9 += "<a href=\"//" + _jObj["CertImg"].ToString().Trim() + "\" target=\"_blank\">";
                        _xhtmlAImg9 += "<img src=\"//" + _jObj["CertImg"].ToString().Trim() + "\" />";
                        _xhtmlAImg9 += " </a>";

                        _uploadGuid9 = _jObj["UploadGuid"].ToString().Trim();
                    }
                }
            }

            ViewBag._xhtmlAImg1 = _xhtmlAImg1;
            ViewBag._xhtmlAImg2 = _xhtmlAImg2;
            ViewBag._xhtmlAImg3 = _xhtmlAImg3;
            ViewBag._xhtmlAImg4 = _xhtmlAImg4;
            ViewBag._xhtmlAImg5 = _xhtmlAImg5;
            ViewBag._xhtmlAImg6 = _xhtmlAImg6;
            ViewBag._xhtmlAImg7 = _xhtmlAImg7;
            ViewBag._xhtmlAImg8 = _xhtmlAImg8;
            ViewBag._xhtmlAImg9 = _xhtmlAImg9;

            ViewBag._uploadGuid1 = _uploadGuid1;
            ViewBag._uploadGuid2 = _uploadGuid2;
            ViewBag._uploadGuid3 = _uploadGuid3;
            ViewBag._uploadGuid4 = _uploadGuid4;
            ViewBag._uploadGuid5 = _uploadGuid5;
            ViewBag._uploadGuid6 = _uploadGuid6;
            ViewBag._uploadGuid7 = _uploadGuid7;
            ViewBag._uploadGuid8 = _uploadGuid8;
            ViewBag._uploadGuid9 = _uploadGuid9;

            //判断公司信息是否可以编辑 是属于当前用户的公司信息就可以
            if (_shopUserID != _jsonBuyerMsg["UserID"].ToString().Trim())
            {
                ViewBag.IsEditDisplay = "none";
            }


            return View();
        }

        /// <summary>
        /// 生成店铺首页二维码
        /// </summary>
        /// <returns></returns>
        public ActionResult CreateShopQRCode()
        {
            string _loginShopUserID = BusiLogin.isLoginPageRetrunUserID("../AggregatePage/CreateReceiPayQRCode");

            ViewBag.ShopID = PublicClass.FilterRequestTrim("SID");

            if (string.IsNullOrWhiteSpace(ViewBag.ShopID))
            {
                ViewBag.StyleDisplay = "none";
            }

            ViewBag.OctUserGoodsShopSystemWeb_ApiDomain = WebAppConfig.OctUserGoodsShopSystemWeb_ApiDomain;

            ViewBag.QRCodeURL = ViewBag.OctUserGoodsShopSystemWeb_ApiDomain + "/ToolWeb/QrCodeImg?QrCodeContent=" + WebAppConfig.OctWapWeb_AddrDomain + "/Shop/Index?SID=" + ViewBag.ShopID;

            //---------生成小程序的店铺二维码--------------//
            if (WebAppConfig.IsOpenWxMiniClient == "true")
            {
                ViewBag.MiniShopDisplay = "normal";

                //测试用的
                //ViewBag.WxMiniShopQRCodeURL = WebAppConfig.OctMallMiniWeb_AddrDomain + "/WxMiniApi/MiniScanImgShow?MiniPagePath=pages/tabbar/search/search&Scene=11023";

                //正式的
                ViewBag.WxMiniShopQRCodeURL = WebAppConfig.OctMallMiniWeb_AddrDomain + "/WxMiniApi/MiniScanImgShow?MiniPagePath=pages/shop/index/index&Scene=" + ViewBag.ShopID;

            }
            else
            {
                ViewBag.MiniShopDisplay = "none";
                ViewBag.WxMiniShopQRCodeURL = "";
            }



            return View();
        }

        #region【店铺相关页管理】

        /// <summary>
        /// 店铺首页轮播 - 管理
        /// </summary>
        /// <returns></returns>
        public ActionResult ShopHomeCarousel()
        {
            //---判断用户是否登录---//
            string _loginUserID = BusiLogin.isLoginPageRetrunUserID("../ShopPage/ShopHomeCarousel");
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return Content("用户登录错误！");
            }

            ViewBag.UserID = _loginUserID;

            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain.ToString().Trim();

            ViewBag.ShopID = PublicClass.FilterRequestTrim("SID");

            return View();
        }

        /// <summary>
        /// 店铺首页栏目 - 管理
        /// </summary>
        /// <returns></returns>
        public ActionResult ShopHomeSection()
        {
            //---判断用户是否登录---//
            string _loginUserID = BusiLogin.isLoginPageRetrunUserID("../ShopPage/ShopHomeSection");
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return Content("用户登录错误！");
            }

            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain.ToString().Trim();


            return View();
        }

        #endregion



    }



}