using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【会员店铺产品系统 (OctUserGoodsShopSystem )】CMS页面控制器
/// </summary>
namespace OctCmsSystemWeb.PageControllers.WebPage
{
    public class UserGoodsShopPageController : Controller
    {
        // GET: UserGoodsShopPage
        public ActionResult Index()
        {
            return View();
        }

        #region【商品】

        /// <summary>
        /// 商品类目
        /// </summary>
        /// <returns></returns>
        public ActionResult GooGoodsType()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("UserGoodsShopPage/GooGoodsType", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }

            //------只有超级管理员(AdUserType=Admin)才能进入的页-------// 
            string _loginUserAdUserType = BusiLogin.getLoginUserAdUserType();
            if (_loginUserAdUserType != "Admin")
            {
                return Content(BusiLogin.xhtmlNoPowerVisitContent());
            }

            return View();
        }

        /// <summary>
        /// 商品类目必填属性
        /// </summary>
        /// <returns></returns>
        public ActionResult GooGoodsTypeNeedProp()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("UserGoodsShopPage/GooGoodsTypeNeedProp", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            //------只有超级管理员(AdUserType=Admin)才能进入的页-------// 
            string _loginUserAdUserType = BusiLogin.getLoginUserAdUserType();
            if (_loginUserAdUserType != "Admin")
            {
                return Content(BusiLogin.xhtmlNoPowerVisitContent());
            }


            return View();
        }

        /// <summary>
        /// 商品信息管理
        /// </summary>
        /// <returns></returns>
        public ActionResult GooGoodsMsg()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("UserGoodsShopPage/GooGoodsMsg", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            ViewBag.OctWapWebAddrDomain = WebAppConfig.OctWapWeb_AddrDomain;

            //获取传递的参数
            ViewBag.GoodsStatus = PublicClass.FilterRequestTrim("GoodsStatus");

            return View();
        }

        /// <summary>
        /// 商品信息详情
        /// </summary>
        /// <returns></returns>
        public ActionResult GooGoodsDetail()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("UserGoodsShopPage/GooGoodsDetail", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            ViewBag.OctWapWebAddrDomain = WebAppConfig.OctWapWeb_AddrDomain;

            //获取传递的参数
            ViewBag.GoodsID = PublicClass.FilterRequestTrim("GID");

            return View();
        }

        #endregion

        #region【商品店铺评价】

        /// <summary>
        /// 商品评价
        /// </summary>
        /// <returns></returns>
        public ActionResult GooAppraise()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("UserGoodsShopPage/GooAppraise", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain.ToString().Trim();

            ViewBag.AppScore = PublicClass.FilterRequestTrim("AppScore");
            ViewBag.CountAppraiseImg = PublicClass.FilterRequestTrim("CountAppraiseImg");


            return View();
        }

        /// <summary>
        /// 店铺评价
        /// </summary>
        /// <returns></returns>
        public ActionResult ShopAppraise()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("UserGoodsShopPage/ShopAppraise", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain.ToString().Trim();

            return View();
        }

        #endregion

        #region【赠品】

        /// <summary>
        /// 商品赠品管理
        /// </summary>
        /// <returns></returns>
        public ActionResult GooGiftMsg()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("UserGoodsShopPage/GooGiftMsg", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }



            ViewBag.OctWapWebAddrDomain = WebAppConfig.OctWapWeb_AddrDomain;

            return View();
        }

        #endregion

        #region【礼品】

        /// <summary>
        /// 礼品信息
        /// </summary>
        /// <returns></returns>
        public ActionResult PresentMsg()
        {
           

            return View();
        }

        /// <summary>
        /// 礼品详情
        /// </summary>
        /// <returns></returns>
        public ActionResult PresentDetail()
        {
            
            return View();
        }

        /// <summary>
        /// 礼品分类
        /// </summary>
        /// <returns></returns>
        public ActionResult PresentGoodsType()
        {
           


            return View();
        }

        #endregion

        #region【商家店铺】

        /// <summary>
        /// 店铺类别 
        /// </summary>
        /// <returns></returns>
        public ActionResult ShopType()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("UserGoodsShopPage/ShopType", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }

            //------只有超级管理员(AdUserType=Admin)才能进入的页-------// 
            string _loginUserAdUserType = BusiLogin.getLoginUserAdUserType();
            if (_loginUserAdUserType != "Admin")
            {
                return Content(BusiLogin.xhtmlNoPowerVisitContent());
            }

            return View();
        }

        /// <summary>
        /// 添加店铺
        /// </summary>
        /// <returns></returns>
        public ActionResult ShopAdd()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("UserGoodsShopPage/ShopAdd", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            return View();
        }

        /// <summary>
        /// 编辑店铺
        /// </summary>
        /// <returns></returns>
        public ActionResult ShopEdit()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("UserGoodsShopPage/ShopEdit", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            string ShopID = PublicClass.FilterRequestTrim("ShopID");
            string UserID = PublicClass.FilterRequestTrim("UserID");

            //定义POST参数
            Dictionary<string, string> _dic = new Dictionary<string, string>();
            _dic.Add("ShopID", ShopID);
            _dic.Add("UserID", UserID);

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
            ViewBag.ShopLabelArr = _jsonObj["ShopLabelArr"].ToString().Trim();

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
            ViewBag.Longitude = _jsonObj["Longitude"].ToString().Trim();
            ViewBag.Latitude = _jsonObj["Latitude"].ToString().Trim();

            ViewBag.IsSelfShopCb = "";
            if (_jsonObj["IsSelfShop"].ToString().Trim() == "true")
            {
                ViewBag.IsSelfShopCb = "checked=\"checked\"";
            }

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
                    _xhtml += " <a href=\"//" + _jsonObjShopLogoImg["ImgURL"].ToString().Trim() + "\"><img id=\"Img_" + _jsonObjShopLogoImg["UploadGuid"].ToString().Trim() + "\" src=\"//" + _jsonObjShopLogoImg["ImgURL"].ToString().Trim() + "\" /></a>";
                    _xhtml += " <div class=\"crop-img-btn\">";
                    _xhtml += "     <div><a href=\"//" + _domain + "/ToolWeb/CropZoom/CropZoom.aspx?CropImgWidth=800&CropImgHeight=500&CropTitle=店铺门头照裁剪&ImgSourceURL=" + _imgPath + "&RedirectURL=#\" target=\"_blank\">裁剪照片</a></div>";
                    _xhtml += "     <div style=\"border-left: 1px solid #5A5A5A;\" onclick=\"refreshImgSrcRnd('Img_" + _jsonObjShopLogoImg["UploadGuid"].ToString().Trim() + "')\">刷新照片</div>";
                    _xhtml += " </div>";
                    _xhtml += "</div>";


                }
                ViewBag.Xhtml = _xhtml;
            }

            return View();
        }

        /// <summary>
        /// 店铺信息
        /// </summary>
        /// <returns></returns>
        public ActionResult ShopMsg()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("UserGoodsShopPage/ShopMsg", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            //获取传递的参数
            ViewBag.IsCheck = PublicClass.FilterRequestTrim("IsCheck");


            return View();
        }

        /// <summary>
        /// 店铺详细信息
        /// </summary>
        /// <returns></returns>
        public ActionResult ShopMsgDetail()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("UserGoodsShopPage/ShopMsgDetail", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            string ShopID = PublicClass.FilterRequestTrim("ShopID");
            string UserID = PublicClass.FilterRequestTrim("UserID");

            //定义POST参数
            Dictionary<string, string> _dic = new Dictionary<string, string>();
            _dic.Add("ShopID", ShopID);
            _dic.Add("UserID", UserID);

            //发送异步请求
            string _json = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopMsg, "UGS_ShopMsg", "9", _dic);
            if (string.IsNullOrWhiteSpace(_json))
            {
                return null;
            }

            //转换Json对象
            JObject _jsonObjTop = (JObject)JsonConvert.DeserializeObject(_json);

            JObject _jsonObj = (JObject)_jsonObjTop["ShopMsg"];

            ViewBag.ShopID = _jsonObj["ShopID"].ToString().Trim();
            ViewBag.CompanyID = _jsonObj["CompanyID"].ToString().Trim();
            ViewBag.ShopTypeID = _jsonObj["ShopTypeID"].ToString().Trim();
            ViewBag.ShopName = _jsonObj["ShopName"].ToString().Trim();
            ViewBag.ShopHeaderImg = _jsonObj["ShopHeaderImg"].ToString().Trim();
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

            ViewBag.IsEntity = "否";
            if (_jsonObj["IsEntity"].ToString().Trim() == "true")
            {
                ViewBag.IsEntity = "是";
            }
            ViewBag.Longitude = _jsonObj["Longitude"].ToString().Trim();
            ViewBag.Latitude = _jsonObj["Latitude"].ToString().Trim();

            ViewBag.IsSelfShop = "否";
            if (_jsonObj["IsSelfShop"].ToString().Trim() == "true")
            {
                ViewBag.IsSelfShop = "是";
            }

            //店铺状态提示
            string[] _shopStatusArr = BusiShop.showShopStatusTxt(_jsonObj["IsCheck"].ToString().Trim(), _jsonObj["IsLock"].ToString().Trim(), _jsonObj["CheckReason"].ToString().Trim());
            ViewBag.ShopStatusTxt = _shopStatusArr[0];
            ViewBag.ShopStatusDesc = _shopStatusArr[1];
            ViewBag.ShopStatusBg = _shopStatusArr[2];

            //店铺分类 
            JObject _jsonShopType = (JObject)_jsonObjTop["ShopType"];
            ViewBag.ShopType = _jsonShopType["ShopTypeNameFather"].ToString().Trim() + " -> " + _jsonShopType["ShopTypeName"].ToString().Trim();

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

                    _xhtml += "<a href=\"//" + _jsonObjShopLogoImg["ImgURL"].ToString().Trim() + "\" target=\"_bank\"><img src=\"//" + _jsonObjShopLogoImg["ImgURL"].ToString().Trim() + "\" /></a>";

                }

                ViewBag.Xhtml = _xhtml;
            }

            return View();
        }

        /// <summary>
        /// 店铺抽成比例
        /// </summary>
        /// <returns></returns>
        public ActionResult ShopCommission()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("UserGoodsShopPage/ShopCommission", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            ViewBag.OctWapWebAddrDomain = WebAppConfig.OctWapWeb_AddrDomain;

            return View();
        }

        #endregion

        #region【公司信息】

        /// <summary>
        /// 公司信息
        /// </summary>
        /// <returns></returns>
        public ActionResult CompanyMsg()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("UserGoodsShopPage/CompanyMsg", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            //获取传递的参数
            ViewBag.IsCheck = PublicClass.FilterRequestTrim("IsCheck");

            return View();
        }

        /// <summary>
        /// 添加公司信息
        /// </summary>
        /// <returns></returns>
        public ActionResult CompanyMsgAdd()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("UserGoodsShopPage/CompanyMsgAdd", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            return View();
        }

        /// <summary>
        /// 编辑公司信息
        /// </summary>
        /// <returns></returns>
        public ActionResult CompanyMsgEdit()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("UserGoodsShopPage/CompanyMsgEdit", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            string CompanyID = PublicClass.FilterRequestTrim("CompanyID");
            string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

            //定义POST参数
            Dictionary<string, string> _dic = new Dictionary<string, string>();
            _dic.Add("CompanyID", CompanyID);
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

            //公司信息
            JObject _jsonCompanyMsg = (JObject)_jsonObjTop["CompanyMsg"];
            ViewBag.CompanyID = _jsonCompanyMsg["CompanyID"].ToString().Trim();
            ViewBag.CreditCode = _jsonCompanyMsg["CreditCode"].ToString().Trim();
            ViewBag.CompanyName = _jsonCompanyMsg["CompanyName"].ToString().Trim();
            ViewBag.RegAddress = _jsonCompanyMsg["RegAddress"].ToString().Trim();
            ViewBag.LegalPerson = _jsonCompanyMsg["LegalPerson"].ToString().Trim();
            ViewBag.BusiScope = _jsonCompanyMsg["BusiScope"].ToString().Trim();
            ViewBag.SetUpDate = Convert.ToDateTime(_jsonCompanyMsg["SetUpDate"].ToString().Trim()).ToShortDateString().Replace("/", "-");
            ViewBag.RegMoney = _jsonCompanyMsg["RegMoney"].ToString().Trim();

            //买家信息
            JObject _jsonBuyerMsg = (JObject)_jsonObjTop["BuyerMsg"];
            ViewBag.UserID = _jsonBuyerMsg["UserID"].ToString().Trim();
            ViewBag.UserNick = _jsonBuyerMsg["UserNick"].ToString().Trim();
            ViewBag.HeaderImg = _jsonBuyerMsg["HeaderImg"].ToString().Trim();

            //用户账号
            ViewBag.UserAccount = _jsonObjTop["UserAccount"].ToString().Trim();


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

            return View();
        }

        /// <summary>
        /// 公司信息详细
        /// </summary>
        /// <returns></returns>
        public ActionResult CompanyMsgDetail()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("UserGoodsShopPage/CompanyMsgDetail", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }


            string CompanyID = PublicClass.FilterRequestTrim("CompanyID");
            string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

            //定义POST参数
            Dictionary<string, string> _dic = new Dictionary<string, string>();
            _dic.Add("CompanyID", CompanyID);
            _dic.Add("ShopUserID", ShopUserID);

            //发送异步请求
            string _json = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_CompanyMsg, "UGS_CompanyMsg", "3", _dic);

            if (string.IsNullOrWhiteSpace(_json))
            {
                return null;
            }

            //转换Json对象
            JObject _jsonObjTop = (JObject)JsonConvert.DeserializeObject(_json);

            //公司信息
            JObject _jsonCompanyMsg = (JObject)_jsonObjTop["CompanyMsg"];
            ViewBag.CompanyID = _jsonCompanyMsg["CompanyID"].ToString().Trim();
            ViewBag.CreditCode = _jsonCompanyMsg["CreditCode"].ToString().Trim();
            ViewBag.CompanyName = _jsonCompanyMsg["CompanyName"].ToString().Trim();
            ViewBag.RegAddress = _jsonCompanyMsg["RegAddress"].ToString().Trim();
            ViewBag.LegalPerson = _jsonCompanyMsg["LegalPerson"].ToString().Trim();
            ViewBag.BusiScope = _jsonCompanyMsg["BusiScope"].ToString().Trim();
            ViewBag.SetUpDate = _jsonCompanyMsg["SetUpDate"].ToString().Trim();
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
            string _xhtml = "";
            for (int i = 0; i < _jsonCompanyCertificateList.Count; i++)
            {
                JObject _jObj = (JObject)_jsonCompanyCertificateList[i];

                _xhtml += "<li class=\"compay-cert-li\">";
                _xhtml += "  <div>";
                _xhtml += "      <a href=\"" + _jObj["CertImg"].ToString().Trim() + "\" target=\"_blank\"><img src=\"//" + _jObj["CertImg"].ToString().Trim() + "\" /></a>";
                _xhtml += "  </div>";
                _xhtml += "   <div class=\"cert-name\">";
                _xhtml += "" + BusiCompany.getCertTypeName(_jObj["CertType"].ToString().Trim()) + "";
                _xhtml += "   </div>";
                _xhtml += "</li>";
            }
            ViewBag.Xhtml = _xhtml;

            return View();
        }

        /// <summary>
        /// 公司证件信息
        /// </summary>
        /// <returns></returns>
        public ActionResult CompanyCertificate()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("UserGoodsShopPage/CompanyCertificate", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }



            return View();
        }


        #endregion

        #region【会员账号】

        /// <summary>
        /// 会员账号信息
        /// </summary>
        /// <returns></returns>
        public ActionResult UserAccount()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("UserGoodsShopPage/UserAccount", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }



            ViewBag.OctWapWebAddrDomain = WebAppConfig.OctWapWeb_AddrDomain;

            return View();
        }

        /// <summary>
        /// 会员账号详情
        /// </summary>
        /// <returns></returns>
        public ActionResult UserAccountDetail()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("UserGoodsShopPage/UserAccountDetail", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }



            ViewBag.OctWapWebAddrDomain = WebAppConfig.OctWapWeb_AddrDomain;

            //获取传递的参数
            ViewBag.UserID = PublicClass.FilterRequestTrim("UID");

            return View();
        }

        /// <summary>
        /// 会员配置参数
        /// </summary>
        /// <returns></returns>
        public ActionResult UserSettingMsg()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("UserGoodsShopPage/UserSettingMsg", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }

            //------只有超级管理员(AdUserType=Admin)才能进入的页-------// 
            string _loginUserAdUserType = BusiLogin.getLoginUserAdUserType();
            if (_loginUserAdUserType != "Admin")
            {
                return Content(BusiLogin.xhtmlNoPowerVisitContent());
            }



            return View();
        }

        #endregion

        #region【推广会员信息】

        /// <summary>
        /// 推广会员信息
        /// </summary>
        /// <returns></returns>
        public ActionResult BuyerPromoteUser()
        {
           

            return View();
        }

        #endregion

        #region【会员发展店铺信息】

        /// <summary>
        /// 会员发展店铺信息
        /// </summary>
        /// <returns></returns>
        public ActionResult BuyerExpandShop()
        {
            //------检测【进入页面】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkPageAdminUserLogin("UserGoodsShopPage/BuyerExpandShop", true);
            if (_backLoginCode != "CPAUL_01")
            {
                return Content(_backLoginCode);
            }



            ViewBag.OctWapWebAddrDomain = WebAppConfig.OctWapWeb_AddrDomain;

            return View();
        }

        #endregion

        #region【秒杀商品管理】

        /// <summary>
        /// 秒杀商品设置
        /// </summary>
        /// <returns></returns>
        public ActionResult SecKillGoodsMsg()
        {
            

            return View();
        }

        /// <summary>
        /// 秒杀商品分类
        /// </summary>
        /// <returns></returns>
        public ActionResult SecKillGoodsType()
        {
           

            return View();
        }



        #endregion

        #region【拼团管理】

        /// <summary>
        /// 拼团商品设置
        /// </summary>
        /// <returns></returns>
        public ActionResult GroupGoodsSetting()
        {
           
            return View();
        }

        /// <summary>
        /// 发起拼团管理,开团信息
        /// </summary>
        /// <returns></returns>
        public ActionResult GroupCreateMsg()
        {
           

            return View();
        }

        /// <summary>
        /// 加入拼团信息,拼团参与信息
        /// </summary>
        /// <returns></returns>
        public ActionResult GroupJoinMsg()
        {
           

            return View();
        }

        /// <summary>
        /// 拼团商品分类
        /// </summary>
        /// <returns></returns>
        public ActionResult GroupGoodsType()
        {
           

            return View();
        }

        #endregion

        #region【活动管理】

        /// <summary>
        /// 活动信息
        /// </summary>
        /// <returns></returns>
        public ActionResult ActivityMsg()
        {
           
            return View();
        }

        /// <summary>
        /// 活动详情
        /// </summary>
        /// <returns></returns>
        public ActionResult ActivityDetail()
        {



            return View();
        }

        /// <summary>
        /// 活动参与信息
        /// </summary>
        /// <returns></returns>
        public ActionResult ActivityJoin()
        {
           

            return View();
        }



        #endregion

        #region【抽奖管理】

        /// <summary>
        /// 抽奖信息管理
        /// </summary>
        /// <returns></returns>
        public ActionResult LuckyDrawMsg()
        {
            

            return View();
        }

        /// <summary>
        /// 抽奖信息详情
        /// </summary>
        /// <returns></returns>
        public ActionResult LuckyDrawMsgDetail()
        {

          


            return View();
        }


        /// <summary>
        /// 抽奖参与信息
        /// </summary>
        /// <returns></returns>
        public ActionResult LuckyDrawJoinMsg()
        {
           
            return View();
        }

        /// <summary>
        /// 抽奖开奖结果
        /// </summary>
        /// <returns></returns>
        public ActionResult LuckyDrawResult()
        {
           


            return View();
        }



        #endregion

    }
}