using BusiApiHttpNS;
using BusiRndKeyNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【OctUserGoodsShopSystem (会员店铺产品系统)】Ajax请求控制器
/// </summary>
namespace OctCmsSystemWeb.PageControllers.AjaxPage
{
    public class UserGoodsShopController : Controller
    {
        // GET: UserGoodsShop
        public ActionResult Index()
        {
            return View();
        }


        #region【商品】

        /// <summary>
        /// 商品类目
        /// </summary>
        /// <returns></returns>
        public string GooGoodsType()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("UserGoodsShopPage/GooGoodsType^UserGoodsShopPage/GooGoodsTypeNeedProp^UserGoodsShopPage/GooGoodsMsg^UserGoodsShopPage/GooGoodsDetail");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }

            //------只有超级管理员(AdUserType=Admin)才能进入的页-------// 
            string _loginUserAdUserType = BusiLogin.getLoginUserAdUserType();
            if (_loginUserAdUserType != "Admin")
            {
                return "无权限访问";
            }


            //获取操作类型  Type=1 搜索分页数据  Type=2 加载父级类目列表 Type=3 添加或编辑商品类目信息 Type=4 初始化类目信息 Type=5 开关锁定 Type=6 单个或批量删除类目 Type=7 保存上传类目图片信息 Type=8 加载子级类目信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");
                string GoodsTypeName = PublicClass.FilterRequestTrim("GoodsTypeName");
                string FatherTypeID = PublicClass.FilterRequestTrim("FatherTypeID");
                string TypeLevel = PublicClass.FilterRequestTrim("TypeLevel");
                string GoodsTypeMemo = PublicClass.FilterRequestTrim("GoodsTypeMemo");
                string LinkURL = PublicClass.FilterRequestTrimNoConvert("LinkURL");
                string IsEntity = PublicClass.FilterRequestTrimNoConvert("IsEntity");
                string IsShow = PublicClass.FilterRequestTrim("IsShow");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrimNoConvert("WriteDate");

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("GoodsTypeID", GoodsTypeID);
                _dic.Add("GoodsTypeName", GoodsTypeName);
                _dic.Add("FatherTypeID", FatherTypeID);
                _dic.Add("TypeLevel", TypeLevel);
                _dic.Add("GoodsTypeMemo", GoodsTypeMemo);
                _dic.Add("LinkURL", LinkURL);
                _dic.Add("IsEntity", IsEntity);
                _dic.Add("IsShow", IsShow);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_GooGoodsType, "UGS_GooGoodsType", "1", _dic);

                return _json;
            }
            //加载父级类目列表
            else if (_exeType == "2")
            {
                //获取传递的参数
                string TypeLevel = PublicClass.FilterRequestTrim("TypeLevel");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "6");
                _dicPost.Add("TypeLevel", TypeLevel);

                //调用加载父级类目列表函数
                return BusiRndKey.httpNoLoginRndKeyRsa(WebAppConfig.ApiUrl_GooGoodsType, "UGS_GooGoodsType", _dicPost);
            }
            //添加或编辑商品类目信息
            else if (_exeType == "3")
            {
                //获取传递的参数
                string ExeType = PublicClass.FilterRequestTrim("ExeType");

                string MsgID = PublicClass.FilterRequestTrim("MsgID");
                string TypeLevel = PublicClass.FilterRequestTrim("TypeLevel");
                string FatherTypeID = PublicClass.FilterRequestTrim("FatherTypeID");
                string GoodsTypeName = PublicClass.FilterRequestTrim("GoodsTypeName");
                string GoodsTypeMemo = PublicClass.FilterRequestTrim("GoodsTypeMemo");
                string LinkURL = PublicClass.FilterRequestTrimNoConvert("LinkURL");
                string SortNum = PublicClass.FilterRequestTrim("SortNum");
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string IsShow = PublicClass.FilterRequestTrim("IsShow");
                string ImgKeyGuid = PublicClass.FilterRequestTrim("ImgKeyGuid");
                string ImgPathDomain = PublicClass.FilterRequestTrim("ImgPathDomain");

                //防止数字为空
                FatherTypeID = PublicClass.preventNumberDataIsNull(FatherTypeID);
                SortNum = PublicClass.preventNumberDataIsNull(SortNum);

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();

                if (ExeType == "add")
                {
                    _dicPost.Add("Type", "2");
                }
                else if (ExeType == "edit")
                {
                    _dicPost.Add("Type", "3");
                    _dicPost.Add("GoodsTypeID", MsgID);
                }

                _dicPost.Add("GoodsTypeName", GoodsTypeName);
                _dicPost.Add("FatherTypeID", FatherTypeID);
                _dicPost.Add("TypeIcon", ImgPathDomain);
                _dicPost.Add("ImgKeyGuid", ImgKeyGuid);
                _dicPost.Add("TypeLevel", TypeLevel);
                _dicPost.Add("GoodsTypeMemo", GoodsTypeMemo);
                _dicPost.Add("LinkURL", LinkURL);
                _dicPost.Add("SortNum", SortNum);
                _dicPost.Add("IsEntity", IsEntity);
                _dicPost.Add("IsLock", IsLock);
                _dicPost.Add("IsShow", IsShow);

                //调用加载父级类目列表函数
                return BusiRndKey.httpNoLoginRndKeyRsa(WebAppConfig.ApiUrl_GooGoodsType, "UGS_GooGoodsType", _dicPost);

            }
            //初始化类目信息
            else if (_exeType == "4")
            {
                //获取传递的参数
                string MsgID = PublicClass.FilterRequestTrim("MsgID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "7");
                _dicPost.Add("GoodsTypeID", MsgID);

                //发送Http请求
                return BusiRndKey.httpNoLoginRndKeyRsa(WebAppConfig.ApiUrl_GooGoodsType, "UGS_GooGoodsType", _dicPost);
            }
            //开关锁定
            else if (_exeType == "5")
            {
                //获取传递的参数
                string MsgID = PublicClass.FilterRequestTrim("MsgID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "8");
                _dicPost.Add("GoodsTypeID", MsgID);

                //发送Http请求
                return BusiRndKey.httpNoLoginRndKeyRsa(WebAppConfig.ApiUrl_GooGoodsType, "UGS_GooGoodsType", _dicPost);
            }
            //单个或批量删除类目
            else if (_exeType == "6")
            {
                //获取传递的参数
                string MsgIDArr = PublicClass.FilterRequestTrim("MsgIDArr");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "9");
                _dicPost.Add("GoodsTypeIDArr", MsgIDArr);

                //发送Http请求
                return BusiRndKey.httpNoLoginRndKeyRsa(WebAppConfig.ApiUrl_GooGoodsType, "UGS_GooGoodsType", _dicPost);
            }
            //保存上传类目图片信息
            else if (_exeType == "7")
            {
                //获取传递的参数
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");
                string ImgPathDomain = PublicClass.FilterRequestTrimNoConvert("ImgPathDomain");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "10");
                _dicPost.Add("GoodsTypeID", GoodsTypeID);
                _dicPost.Add("ImgPathDomain", ImgPathDomain);

                //发送Http请求
                return BusiRndKey.httpNoLoginRndKeyRsa(WebAppConfig.ApiUrl_GooGoodsType, "UGS_GooGoodsType", _dicPost);
            }
            //加载子级类目信息
            else if (_exeType == "8")
            {
                //获取传递的参数
                string FatherTypeID = PublicClass.FilterRequestTrim("FatherTypeID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "11");
                _dicPost.Add("FatherTypeID", FatherTypeID);

                //发送Http请求
                return BusiRndKey.httpNoLoginRndKeyRsa(WebAppConfig.ApiUrl_GooGoodsType, "UGS_GooGoodsType", _dicPost);
            }
            return "";
        }

        /// <summary>
        /// 商品类目必填属性
        /// </summary>
        /// <returns></returns>
        public string GooGoodsTypeNeedProp()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("UserGoodsShopPage/GooGoodsType^UserGoodsShopPage/GooGoodsTypeNeedProp^UserGoodsShopPage/GooGoodsMsg^UserGoodsShopPage/GooGoodsDetail");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }

            //------只有超级管理员(AdUserType=Admin)才能进入的页-------// 
            string _loginUserAdUserType = BusiLogin.getLoginUserAdUserType();
            if (_loginUserAdUserType != "Admin")
            {
                return "无权限访问";
            }


            //获取操作类型  Type=1 搜索分页数据 Type=2 添加或保存商品类目必填属性 Type=3 加载指定类目ID的必填类目属性 Type=4 删除类目必填属性
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string GtPropID = PublicClass.FilterRequestTrim("GtPropID");
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");
                string PropName = PublicClass.FilterRequestTrim("PropName");
                string PropValue = PublicClass.FilterRequestTrim("PropValue");
                string InputType = PublicClass.FilterRequestTrim("InputType");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("GtPropID", GtPropID);
                _dic.Add("GoodsTypeID", GoodsTypeID);
                _dic.Add("PropName", PropName);
                _dic.Add("PropValue", PropValue);
                _dic.Add("InputType", InputType);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGoodsTypeNeedProp, "UGS_GooGoodsTypeNeedProp", "1", _dic);
                return _json;
            }
            //添加或保存商品类目必填属性
            else if (_exeType == "2")
            {
                //获取传递参数
                string GtPropID = PublicClass.FilterRequestTrim("GtPropID"); //属性ID
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");
                string PropName = PublicClass.FilterRequestTrim("PropName");
                string PropValue = PublicClass.FilterRequestTrim("PropValue");
                string InputType = PublicClass.FilterRequestTrim("InputType");
                string IsLock = "false";//PublicClass.FilterRequestTrim("IsLock");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("GoodsTypeID", GoodsTypeID);
                _dic.Add("PropName", PropName);
                _dic.Add("PropValue", PropValue);
                _dic.Add("InputType", InputType);
                _dic.Add("IsLock", IsLock);

                //操作类型
                string _type = "2"; //添加
                if (string.IsNullOrWhiteSpace(GtPropID) == false && GtPropID != "0")
                {
                    _type = "3";//编辑
                    _dic.Add("GtPropID", GtPropID);
                }

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGoodsTypeNeedProp, "UGS_GooGoodsTypeNeedProp", _type, _dic);
                return _json;
            }
            //加载指定类目ID的必须类目属性
            else if (_exeType == "3")
            {
                // 获取传递的参数
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("GoodsTypeID", GoodsTypeID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGoodsTypeNeedProp, "UGS_GooGoodsTypeNeedProp", "5", _dic);
                return _json;
            }
            //删除类目必填属性
            else if (_exeType == "4")
            {
                // 获取传递的参数
                string GtPropIDArr = PublicClass.FilterRequestTrim("GtPropIDArr");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("GtPropIDArr", GtPropIDArr);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGoodsTypeNeedProp, "UGS_GooGoodsTypeNeedProp", "4", _dic);
                return _json;
            }



            return "";
        }

        /// <summary>
        /// 商品信息管理
        /// </summary>
        /// <returns></returns>
        public string GooGoodsMsg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("UserGoodsShopPage/GooGoodsType^UserGoodsShopPage/GooGoodsTypeNeedProp^UserGoodsShopPage/GooGoodsMsg^UserGoodsShopPage/GooGoodsDetail");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索分页数据视图-商品信息-店铺信息 Type=2 审核商品信息 Type=3 锁定与解锁商品信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID");
                string GoodsTitle = PublicClass.FilterRequestTrim("GoodsTitle");
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string GoodsPrice = PublicClass.FilterRequestTrim("GoodsPrice");
                string StockNum = PublicClass.FilterRequestTrim("StockNum");
                string GoodsStatus = PublicClass.FilterRequestTrim("GoodsStatus");
                string IsSpecParam = PublicClass.FilterRequestTrim("IsSpecParam");
                string IsUnSale = PublicClass.FilterRequestTrim("IsUnSale");
                string IsPayDelivery = PublicClass.FilterRequestTrim("IsPayDelivery");
                string IsShopExpense = PublicClass.FilterRequestTrim("IsShopExpense");
                string IsOfflinePay = PublicClass.FilterRequestTrim("IsOfflinePay");
                string GoodsCheckReason = PublicClass.FilterRequestTrim("GoodsCheckReason");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                string ShopName = PublicClass.FilterRequestTrim("ShopName");


                //获取当前页
                string PageCurrent = PublicClass.FilterRequestTrimNoConvert("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", PageCurrent);
                _dic.Add("GoodsID", GoodsID);
                _dic.Add("GoodsTypeID", GoodsTypeID);
                _dic.Add("GoodsTitle", GoodsTitle);
                _dic.Add("ShopID", ShopID);
                _dic.Add("ShopUserID", ShopUserID);
                _dic.Add("GoodsPrice", GoodsPrice);
                _dic.Add("StockNum", StockNum);
                _dic.Add("GoodsStatus", GoodsStatus);
                _dic.Add("IsSpecParam", IsSpecParam);
                _dic.Add("IsUnSale", IsUnSale);
                _dic.Add("IsPayDelivery", IsPayDelivery);
                _dic.Add("IsShopExpense", IsShopExpense);
                _dic.Add("IsOfflinePay", IsOfflinePay);
                _dic.Add("GoodsCheckReason", GoodsCheckReason);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                _dic.Add("ShopName", ShopName);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGoodsMsg, "UGS_GooGoodsMsg", "18", _dic);
                return _json;
            }
            else if (_exeType == "2") //审核商品信息
            {
                //获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string GoodsStatus = PublicClass.FilterRequestTrim("GoodsStatus");
                string GoodsCheckReason = PublicClass.FilterRequestTrim("GoodsCheckReason");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("GoodsID", GoodsID);
                _dic.Add("GoodsStatus", GoodsStatus);
                _dic.Add("GoodsCheckReason", GoodsCheckReason);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGoodsMsg, "UGS_GooGoodsMsg", "19", _dic);
                return _json;
            }
            else if (_exeType == "3") //锁定与解锁商品信息
            {
                //获取传递的参数
                string GoodsIDArr = PublicClass.FilterRequestTrim("GoodsIDArr");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("GoodsIDArr", GoodsIDArr);
                _dic.Add("IsLock", IsLock);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGoodsMsg, "UGS_GooGoodsMsg", "20", _dic);
                return _json;
            }

            return "";
        }

        /// <summary>
        /// 商品信息详情
        /// </summary>
        /// <returns></returns>
        public string GooGoodsDetail()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("UserGoodsShopPage/GooGoodsType^UserGoodsShopPage/GooGoodsTypeNeedProp^UserGoodsShopPage/GooGoodsMsg^UserGoodsShopPage/GooGoodsDetail");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 初始化商品详情信息(后台)
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("GoodsID", GoodsID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGoodsMsg, "UGS_GooGoodsMsg", "21", _dic);
                return _json;
            }

            return "";
        }

        #endregion

        #region【商品店铺评价】

        /// <summary>
        /// 商品评价
        /// </summary>
        /// <returns></returns>
        public string GooAppraise()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("UserGoodsShopPage/GooAppraise^UserGoodsShopPage/ShopAppraise");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 数据分页  Type=2 批量-锁定/解锁 商品评价 Type=3 删除评价信息 Type=4 统计平台所有商品的评价信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string AppScore = PublicClass.FilterRequestTrim("AppScore");
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string AppContent = PublicClass.FilterRequestTrim("AppContent");
                string IsAnonymity = PublicClass.FilterRequestTrim("IsAnonymity");
                string CountAppraiseImg = PublicClass.FilterRequestTrim("CountAppraiseImg");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UserID", UserID);
                _dic.Add("ShopUserID", ShopUserID);
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("AppScore", AppScore);
                _dic.Add("OrderID", OrderID);
                _dic.Add("GoodsID", GoodsID);
                _dic.Add("AppContent", AppContent);
                _dic.Add("IsAnonymity", IsAnonymity);
                _dic.Add("IsLock", "");
                _dic.Add("CountAppraiseImg", CountAppraiseImg);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooAppraise, "UGS_GooAppraise", "5", _dic);
                return _json;
            }
            else if (_exeType == "2") //批量-锁定/解锁 商品评价
            {
                // 获取传递的参数
                string AppIDArr = PublicClass.FilterRequestTrim("AppIDArr");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("AppIDArr", AppIDArr);
                _dic.Add("IsLock", IsLock);

                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooAppraise, "UGS_GooAppraise", "9", _dic);
                return _json;
            }
            else if (_exeType == "3") //删除评价信息
            {
                // 获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("OrderID", OrderID);
                _dic.Add("GoodsID", GoodsID);

                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooAppraise, "UGS_GooAppraise", "10", _dic);
                return _json;
            }
            else if (_exeType == "4")  //统计平台所有商品的评价信息
            {
                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", "0");

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooAppraise, "UGS_GooAppraise", "7", _dic);
                return _json;
            }

            return "";
        }

        /// <summary>
        /// 店铺评价
        /// </summary>
        /// <returns></returns>
        public string ShopAppraise()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("UserGoodsShopPage/GooAppraise^UserGoodsShopPage/ShopAppraise");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 数据分页 Type=2 锁定/解锁 店铺评价 Type=3 批量删除店铺评价
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string ConformityScore = PublicClass.FilterRequestTrim("ConformityScore");
                string AttitudeScore = PublicClass.FilterRequestTrim("AttitudeScore");
                string ExpressScore = PublicClass.FilterRequestTrim("ExpressScore");
                string DeliverymanScore = PublicClass.FilterRequestTrim("DeliverymanScore");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("OrderID", OrderID);
                _dic.Add("ShopID", ShopID);
                _dic.Add("UserID", UserID);
                _dic.Add("ConformityScore", ConformityScore);
                _dic.Add("AttitudeScore", AttitudeScore);
                _dic.Add("ExpressScore", ExpressScore);
                _dic.Add("DeliverymanScore", DeliverymanScore);
                _dic.Add("IsLock", "");
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopAppraise, "UGS_ShopAppraise", "1", _dic);
                return _json;
            }
            else if (_exeType == "2") //锁定/解锁 店铺评价
            {
                //获取传递的参数
                string ShopAppID = PublicClass.FilterRequestTrim("ShopAppID");

                //防止数字类型为空
                ShopAppID = PublicClass.preventNumberDataIsNull(ShopAppID);

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopAppID", ShopAppID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopAppraise, "UGS_ShopAppraise", "4", _dic);
                return _json;
            }
            else if (_exeType == "3") //批量删除店铺评价
            {
                //获取传递的参数
                string ShopAppIDArr = PublicClass.FilterRequestTrim("ShopAppIDArr");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopAppIDArr", ShopAppIDArr);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopAppraise, "UGS_ShopAppraise", "3", _dic);
                return _json;
            }


            return "";
        }

        #endregion

        #region【赠品】

        /// <summary>
        /// 商品赠品管理
        /// </summary>
        /// <returns></returns>
        public string GooGiftMsg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("UserGoodsShopPage/GooGiftMsg");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }



            //获取操作类型  Type=1 推广会员与被推广会员关系信息-搜索数据分页 Type=2 切换锁定推广会员信息 Type=3 批量删除 推广会员信息 Type=4 添加推广会员信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string GiftID = PublicClass.FilterRequestTrim("GiftID");
                string GiftName = PublicClass.FilterRequestTrim("GiftName");
                string GiftDesc = PublicClass.FilterRequestTrim("GiftDesc");
                string GiftPrice = PublicClass.FilterRequestTrim("GiftPrice");
                string StockNum = PublicClass.FilterRequestTrim("StockNum");
                string GiftImgUrl = "";
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsUnSale = PublicClass.FilterRequestTrim("IsUnSale");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页
                string PageCurrent = PublicClass.FilterRequestTrimNoConvert("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", PageCurrent);
                _dic.Add("GiftID", GiftID);
                _dic.Add("GiftName", GiftName);
                _dic.Add("GiftDesc", GiftDesc);
                _dic.Add("GiftPrice", GiftPrice);
                _dic.Add("StockNum", StockNum);
                _dic.Add("GiftImgUrl", GiftImgUrl);
                _dic.Add("ShopUserID", ShopUserID);
                _dic.Add("IsUnSale", IsUnSale);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_GooGiftMsg, "UGS_GooGiftMsg", "1", _dic);
                return _json;
            }




            return "";
        }

        #endregion

        #region【礼品】

        /// <summary>
        /// 礼品信息
        /// </summary>
        /// <returns></returns>
        public string PresentMsg()
        {

            return "";
        }

        /// <summary>
        /// 礼品详情
        /// </summary>
        /// <returns></returns>
        public string PresentDetail()
        {

            return "";
        }


        /// <summary>
        /// 礼品分类
        /// </summary>
        /// <returns></returns>
        public string PresentGoodsType()
        {

            return "";
        }

        #endregion

        #region【商家店铺】

        /// <summary>
        /// 店铺类别
        /// </summary>
        /// <returns></returns>
        public string ShopType()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("UserGoodsShopPage/ShopType^UserGoodsShopPage/ShopAdd^UserGoodsShopPage/ShopEdit^UserGoodsShopPage/ShopMsg^UserGoodsShopPage/ShopMsgDetail^UserGoodsShopPage/ShopCommission");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }

            ////------只有超级管理员(AdUserType=Admin)才能进入的页-------// 
            //string _loginUserAdUserType = BusiLogin.getLoginUserAdUserType();
            //if (_loginUserAdUserType != "Admin")
            //{
            //    return "无权限访问";
            //}

            //获取操作类型  Type=1 搜索分页数据 Type=2 添加或编辑店铺类别 Type=3 删除 单个或批量 店铺类别 Type=4 加载父级店铺类别 Type=5 初始化店铺类别信息 Type=6 批量删除店铺类别信息 Type=7 锁定店铺类别 Type=8 保存上传店铺类目图片信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string ShopTypeID = PublicClass.FilterRequestTrim("ShopTypeID");
                string ShopTypeName = PublicClass.FilterRequestTrim("ShopTypeName");
                string FatherTypeID = PublicClass.FilterRequestTrim("FatherTypeID");
                string ShopTypeMemo = PublicClass.FilterRequestTrim("ShopTypeMemo");
                string SortNum = PublicClass.FilterRequestTrim("SortNum");
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //解决不能搜索父级类别ID为 0 的信息
                if (FatherTypeID == "0")
                {
                    FatherTypeID = "8899889988998899";
                }

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("ShopTypeID", ShopTypeID);
                _dic.Add("ShopTypeName", ShopTypeName);
                _dic.Add("FatherTypeID", FatherTypeID);
                _dic.Add("ShopTypeMemo", ShopTypeMemo);
                _dic.Add("SortNum", SortNum);
                _dic.Add("IsEntity", IsEntity);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopType, "UGS_ShopType", "1", _dic);
                return _json;
            }
            else if (_exeType == "2") //添加或编辑店铺类别
            {
                // 获取传递的参数
                string ShopTypeID = PublicClass.FilterRequestTrim("MsgID");

                string ShopTypeName = PublicClass.FilterRequestTrim("ShopTypeName");
                string FatherTypeID = PublicClass.FilterRequestTrim("FatherTypeID");
                string ShopTypeMemo = PublicClass.FilterRequestTrim("ShopTypeMemo");
                string SortNum = PublicClass.FilterRequestTrim("SortNum");
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                string ImgKeyGuid = PublicClass.FilterRequestTrim("ImgKeyGuid");
                string ImgPathDomain = PublicClass.FilterRequestTrim("ImgPathDomain");


                //防止数字类型为空
                ShopTypeID = PublicClass.preventNumberDataIsNull(ShopTypeID);
                SortNum = PublicClass.preventNumberDataIsNull(SortNum);

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopTypeName", ShopTypeName);
                _dic.Add("FatherTypeID", FatherTypeID);
                _dic.Add("ShopTypeMemo", ShopTypeMemo);
                _dic.Add("TypeIcon", ImgPathDomain);
                _dic.Add("ImgKeyGuid", ImgKeyGuid);
                _dic.Add("SortNum", SortNum);
                _dic.Add("IsEntity", IsEntity);
                _dic.Add("IsLock", IsLock);

                //操作类型
                string _type = "2"; //添加
                if (string.IsNullOrWhiteSpace(ShopTypeID) == false && ShopTypeID != "0")
                {
                    _type = "3";//编辑
                    _dic.Add("ShopTypeID", ShopTypeID);
                }

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopType, "UGS_ShopType", _type, _dic);
                return _json;
            }
            else if (_exeType == "3") //删除 单个或批量 店铺类别
            {
                //店铺类别ID拼接字符串 用“^”隔开
                string ShopTypeIDArr = PublicClass.FilterRequestTrim("ShopTypeIDArr");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopTypeIDArr", ShopTypeIDArr);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopType, "UGS_ShopType", "4", _dic);
                return _json;
            }
            else if (_exeType == "4") //加载父级店铺类别
            {
                string FatherShopTypeID = PublicClass.FilterRequestTrim("FatherShopTypeID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("FatherShopTypeID", FatherShopTypeID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopType, "UGS_ShopType", "5", _dic);
                return _json;
            }
            else if (_exeType == "5") //初始化店铺类别信息
            {
                //获取传递的参数
                string ShopTypeID = PublicClass.FilterRequestTrim("ShopTypeID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopTypeID", ShopTypeID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopType, "UGS_ShopType", "6", _dic);
                return _json;
            }
            else if (_exeType == "6") //批量删除店铺类别信息
            {
                //获取传递的参数
                string MsgIDArr = PublicClass.FilterRequestTrim("MsgIDArr");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopTypeIDArr", MsgIDArr);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopType, "UGS_ShopType", "4", _dic);
                return _json;
            }
            else if (_exeType == "7") //锁定店铺类别 没有实现
            {
                ////获取传递的参数
                //string ShopTypeID = PublicClass.FilterRequestTrim("ShopTypeID");

                ////添加POST参数
                //IDictionary<string, string> _dic = new Dictionary<string, string>();
                //_dic.Add("ShopTypeID", ShopTypeID);

                ////正式发送Http请求
                //string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopType, "UGS_ShopType", "7", _dic);
                //return _json;
            }
            else if (_exeType == "8") // Type=8 保存上传店铺类目图片信息
            {
                //获取传递的参数
                string ShopTypeID = PublicClass.FilterRequestTrim("ShopTypeID");
                string ImgPathDomain = PublicClass.FilterRequestTrimNoConvert("ImgPathDomain");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "7");
                _dicPost.Add("ShopTypeID", ShopTypeID);
                _dicPost.Add("ImgPathDomain", ImgPathDomain);

                //发送Http请求
                return BusiRndKey.httpNoLoginRndKeyRsa(WebAppConfig.ApiUrl_UGS_ShopType, "UGS_ShopType", _dicPost);
            }

            return "";
        }

        /// <summary>
        /// 添加店铺
        /// </summary>
        /// <returns></returns>
        public string ShopAdd()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("UserGoodsShopPage/ShopType^UserGoodsShopPage/ShopAdd^UserGoodsShopPage/ShopEdit^UserGoodsShopPage/ShopMsg^UserGoodsShopPage/ShopMsgDetail^UserGoodsShopPage/ShopCommission");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1  初始化账号信息 Type=2 初始化公司信息 Type=3 添加店铺 Type=4 保存店铺头像信息 Type=5 保存店铺门头Logo信息 Type=6 删除店铺门头照片
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string UserAccount = PublicClass.FilterRequestTrim("UserAccount");
                string IsAdd = PublicClass.FilterRequestTrim("IsAdd");


                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UserAccount", UserAccount);
                _dic.Add("IsAdd", IsAdd);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopMsg, "UGS_ShopMsg", "5", _dic);
                return _json;
            }
            else if (_exeType == "2") //初始化公司信息
            {
                // 获取传递的参数
                string CompanyID = PublicClass.FilterRequestTrim("CompanyID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("CompanyID", CompanyID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopMsg, "UGS_ShopMsg", "6", _dic);
                return _json;
            }
            else if (_exeType == "3") //添加店铺
            {
                // 获取传递的参数
                string UserAccount = PublicClass.FilterRequestTrim("UserAccount");
                string ShopTypeID = PublicClass.FilterRequestTrim("ShopTypeID");
                string ShopName = PublicClass.FilterRequestTrim("ShopName");
                string CompanyID = PublicClass.FilterRequestTrim("CompanyID");
                //string ShopLogoImg = PublicClass.FilterRequestTrim("ShopLogoImg");
                //string ShopHeaderImg = PublicClass.FilterRequestTrim("ShopHeaderImg");
                string ShopFixTel = PublicClass.FilterRequestTrim("ShopFixTel");
                string ShopMobile = PublicClass.FilterRequestTrim("ShopMobile");
                string SendMobile = PublicClass.FilterRequestTrim("SendMobile");
                string LinkMan = PublicClass.FilterRequestTrim("LinkMan");
                string LinkManMobile = PublicClass.FilterRequestTrim("LinkManMobile");
                string LinkEmail = PublicClass.FilterRequestTrimNoConvert("LinkEmail");

                string region_province = PublicClass.FilterRequestTrim("region_province");
                string region_city = PublicClass.FilterRequestTrim("region_city");
                string region_county = PublicClass.FilterRequestTrim("region_county");
                string RegionCodeArr = region_province + "_" + region_city + "_" + region_county;
                string DetailAddr = PublicClass.FilterRequestTrim("DetailAddr");

                string SearchKey = PublicClass.FilterRequestTrim("SearchKey");
                string MajorGoods = PublicClass.FilterRequestTrim("MajorGoods");
                string ShopDesc = PublicClass.FilterRequestTrim("ShopDesc");

                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");
                string Latitude = PublicClass.FilterRequestTrim("Latitude");
                string Longitude = PublicClass.FilterRequestTrim("Longitude");

                string IsSelfShop = PublicClass.FilterRequestTrim("IsSelfShop");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UserAccount", UserAccount);
                _dic.Add("ShopTypeID", ShopTypeID);
                _dic.Add("ShopName", ShopName);
                _dic.Add("CompanyID", CompanyID);
                //_dic.Add("ShopLogoImg", ShopLogoImg);
                //_dic.Add("ShopHeaderImg", ShopHeaderImg);
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

                _dic.Add("IsSelfShop", IsSelfShop);


                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopMsg, "UGS_ShopMsg", "2", _dic);
                return _json;
            }
            else if (_exeType == "4") //保存店铺头像信息
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
            else if (_exeType == "5") //提交店铺门头Logo信息
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
            else if (_exeType == "6") //删除店铺门头照片
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


            return "";
        }

        /// <summary>
        /// 店铺信息
        /// </summary>
        /// <returns></returns>
        public string ShopMsg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("UserGoodsShopPage/ShopType^UserGoodsShopPage/ShopAdd^UserGoodsShopPage/ShopEdit^UserGoodsShopPage/ShopMsg^UserGoodsShopPage/ShopMsgDetail^UserGoodsShopPage/ShopCommission");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索分页数据 Type=2 添加或编辑店铺信息 Type=3 开关审核 店铺信息 Type=4 初始化店铺信息 Type=5 审核店铺信息 Type=6 显示/隐藏 店铺信息 Type=7 锁定/解锁 店铺信息 Type=8 加载店铺简单信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string ShopTypeID = PublicClass.FilterRequestTrim("ShopTypeID");
                string ShopName = PublicClass.FilterRequestTrim("ShopName");
                string CompanyName = PublicClass.FilterRequestTrim("CompanyName");
                string ShopLogoImg = PublicClass.FilterRequestTrimNoConvert("ShopLogoImg");
                string ShopHeaderImg = PublicClass.FilterRequestTrimNoConvert("ShopHeaderImg");
                string ShopFixTel = PublicClass.FilterRequestTrim("ShopFixTel");
                string ShopMobile = PublicClass.FilterRequestTrim("ShopMobile");
                string SendMobile = PublicClass.FilterRequestTrim("SendMobile");
                string LinkMan = PublicClass.FilterRequestTrim("LinkMan");
                string LinkManMobile = PublicClass.FilterRequestTrim("LinkManMobile");
                string LinkEmail = PublicClass.FilterRequestTrimNoConvert("LinkEmail");
                string RegionCodeArr = PublicClass.FilterRequestTrim("RegionCodeArr");
                string RegionNameArr = PublicClass.FilterRequestTrim("RegionNameArr");
                string DetailAddr = PublicClass.FilterRequestTrim("DetailAddr");
                string SearchKey = PublicClass.FilterRequestTrim("SearchKey");
                string MajorGoods = PublicClass.FilterRequestTrim("MajorGoods");
                string ShopDesc = PublicClass.FilterRequestTrim("ShopDesc");
                string IsShow = PublicClass.FilterRequestTrim("IsShow");
                string IsCheck = PublicClass.FilterRequestTrim("IsCheck");
                string CheckReason = PublicClass.FilterRequestTrim("CheckReason");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string RegDate = PublicClass.FilterRequestTrim("RegDate");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", PageCurrent);
                _dic.Add("ShopID", ShopID);
                _dic.Add("UserID", UserID);
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
                _dic.Add("RegionNameArr", RegionNameArr);
                _dic.Add("DetailAddr", DetailAddr);
                _dic.Add("SearchKey", SearchKey);
                _dic.Add("MajorGoods", MajorGoods);
                _dic.Add("ShopDesc", ShopDesc);
                _dic.Add("IsShow", IsShow);
                _dic.Add("IsCheck", IsCheck);
                _dic.Add("CheckReason", CheckReason);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopMsg, "UGS_ShopMsg", "1", _dic);
                return _json;
            }
            else if (_exeType == "2") //添加或编辑店铺信息
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                string UserAccount = PublicClass.FilterRequestTrim("UserAccount");
                string CompanyID = PublicClass.FilterRequestTrim("CompanyID");
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

                string ShopLabelArr = PublicClass.FilterRequestTrimNoConvert("ShopLabelArr");
                
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");
                string Latitude = PublicClass.FilterRequestTrim("Latitude");
                string Longitude = PublicClass.FilterRequestTrim("Longitude");

                string region_province = PublicClass.FilterRequestTrim("region_province");
                string region_city = PublicClass.FilterRequestTrim("region_city");
                string region_county = PublicClass.FilterRequestTrim("region_county");
                //地区范围代码 用"_"连接
                string RegionCodeArr = region_province + "_" + region_city + "_" + region_county;

                string DetailAddr = PublicClass.FilterRequestTrim("DetailAddr");
                string SearchKey = PublicClass.FilterRequestTrim("SearchKey");
                string MajorGoods = PublicClass.FilterRequestTrim("MajorGoods");
                string ShopDesc = PublicClass.FilterRequestTrim("ShopDesc");

                string IsSelfShop = PublicClass.FilterRequestTrim("IsSelfShop");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UserAccount", UserAccount);
                _dic.Add("CompanyID", CompanyID);
                _dic.Add("ShopTypeID", ShopTypeID);
                _dic.Add("ShopName", ShopName);
                _dic.Add("ShopLabelArr", ShopLabelArr);
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

                _dic.Add("IsSelfShop", IsSelfShop);


                //操作类型
                string _type = "2";
                if (string.IsNullOrWhiteSpace(ShopID) == false && ShopID != "0")
                {
                    _type = "3";
                    _dic.Add("ShopID", ShopID); //更新
                }
                else
                {
                    _type = "2";
                }


                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopMsg, "UGS_ShopMsg", _type, _dic);
                return _json;
            }
            else if (_exeType == "3") //开关审核 店铺信息
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                string IsCheck = PublicClass.FilterRequestTrim("IsCheck");
                string CheckReason = PublicClass.FilterRequestTrim("CheckReason");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopID", ShopID);
                _dic.Add("IsCheck", IsCheck);
                _dic.Add("CheckReason", CheckReason);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopMsg, "UGS_ShopMsg", "4", _dic);
                return _json;
            }
            else if (_exeType == "4") //初始化店铺信息
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopID", ShopID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopMsg, "UGS_ShopMsg", "9", _dic);
                return _json;
            }
            else if (_exeType == "5") //审核店铺信息
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                string IsCheck = PublicClass.FilterRequestTrim("IsCheck");
                string CheckReason = PublicClass.FilterRequestTrim("CheckReason");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopID", ShopID);
                _dic.Add("IsCheck", IsCheck);
                _dic.Add("CheckReason", CheckReason);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopMsg, "UGS_ShopMsg", "4", _dic);
                return _json;
            }
            else if (_exeType == "6") //显示/隐藏 店铺信息
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopID", ShopID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopMsg, "UGS_ShopMsg", "10", _dic);
                return _json;
            }
            else if (_exeType == "7") //锁定/解锁 店铺信息
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopID", ShopID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopMsg, "UGS_ShopMsg", "11", _dic);
                return _json;
            }
            else if (_exeType == "8") //加载店铺简单信息
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopID", ShopID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopMsg, "UGS_ShopMsg", "19", _dic);
                return _json;
            }

            return "";
        }

        /// <summary>
        /// 店铺抽成比例
        /// </summary>
        /// <returns></returns>
        public string ShopCommission()
        {
           
            return "";
        }


        #endregion

        #region【公司信息】

        /// <summary>
        /// 公司信息
        /// </summary>
        /// <returns></returns>
        public string CompanyMsg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("UserGoodsShopPage/CompanyMsg^UserGoodsShopPage/CompanyMsgAdd^UserGoodsShopPage/CompanyMsgEdit^UserGoodsShopPage/CompanyMsgDetail^UserGoodsShopPage/CompanyCertificate");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索分页数据 Type=2 添加或编辑公司信息 Type=3 初始化公司信息 Type=4 审核操作 Type=5 锁定/解锁 公司信息 
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string CompanyID = PublicClass.FilterRequestTrim("CompanyID");
                string CreditCode = PublicClass.FilterRequestTrim("CreditCode");
                string CompanyName = PublicClass.FilterRequestTrim("CompanyName");
                string RegAddress = PublicClass.FilterRequestTrim("RegAddress");
                string LegalPerson = PublicClass.FilterRequestTrim("LegalPerson");
                string BusiScope = PublicClass.FilterRequestTrim("BusiScope");
                string SetUpDate = PublicClass.FilterRequestTrim("SetUpDate");
                string RegMoney = PublicClass.FilterRequestTrim("RegMoney");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsCheck = PublicClass.FilterRequestTrim("IsCheck");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", PageCurrent);
                _dic.Add("CompanyID", CompanyID);
                _dic.Add("CreditCode", CreditCode);
                _dic.Add("CompanyName", CompanyName);
                _dic.Add("RegAddress", RegAddress);
                _dic.Add("LegalPerson", LegalPerson);
                _dic.Add("BusiScope", BusiScope);
                _dic.Add("SetUpDate", SetUpDate);
                _dic.Add("RegMoney", RegMoney);
                _dic.Add("ShopUserID", ShopUserID);
                _dic.Add("IsCheck", IsCheck);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_CompanyMsg, "UGS_CompanyMsg", "1", _dic);
                return _json;
            }
            else if (_exeType == "2") //添加或编辑公司信息
            {
                // 获取传递的参数
                string CompanyID = PublicClass.FilterRequestTrim("CompanyID");
                string CreditCode = PublicClass.FilterRequestTrim("CreditCode");
                string CompanyName = PublicClass.FilterRequestTrim("CompanyName");
                string RegAddress = PublicClass.FilterRequestTrim("RegAddress");
                string LegalPerson = PublicClass.FilterRequestTrim("LegalPerson");
                string BusiScope = PublicClass.FilterRequestTrim("BusiScope");
                string SetUpDate = PublicClass.FilterRequestTrim("SetUpDate");
                string RegMoney = PublicClass.FilterRequestTrim("RegMoney");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("CompanyID", CompanyID);
                _dic.Add("CreditCode", CreditCode);
                _dic.Add("CompanyName", CompanyName);
                _dic.Add("RegAddress", RegAddress);
                _dic.Add("LegalPerson", LegalPerson);
                _dic.Add("BusiScope", BusiScope);
                _dic.Add("SetUpDate", SetUpDate);
                _dic.Add("RegMoney", RegMoney);
                _dic.Add("ShopUserID", ShopUserID);
                _dic.Add("IsLock", IsLock);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_CompanyMsg, "UGS_CompanyMsg", "2", _dic);
                return _json;
            }
            else if (_exeType == "3") //初始化公司信息
            {
                // 获取传递的参数
                string CompanyID = PublicClass.FilterRequestTrim("CompanyID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("CompanyID", CompanyID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_CompanyMsg, "UGS_CompanyMsg", "6", _dic);
                return _json;
            }
            else if (_exeType == "4") //审核操作
            {
                //获取传递的参数
                string CompanyID = PublicClass.FilterRequestTrim("CompanyID");
                string IsCheck = PublicClass.FilterRequestTrim("IsCheck");
                string CheckReason = PublicClass.FilterRequestTrim("CheckReason");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("CompanyID", CompanyID);
                _dic.Add("IsCheck", IsCheck);
                _dic.Add("CheckReason", CheckReason);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_CompanyMsg, "UGS_CompanyMsg", "5", _dic);
                return _json;
            }
            else if (_exeType == "5") //锁定/解锁 公司信息 
            {
                //获取传递的参数
                string CompanyID = PublicClass.FilterRequestTrim("CompanyID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("CompanyID", CompanyID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_CompanyMsg, "UGS_CompanyMsg", "4", _dic);
                return _json;
            }


            return "";
        }

        /// <summary>
        /// 添加公司信息
        /// </summary>
        /// <returns></returns>
        public string CompanyMsgAdd()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("UserGoodsShopPage/CompanyMsg^UserGoodsShopPage/CompanyMsgAdd^UserGoodsShopPage/CompanyMsgEdit^UserGoodsShopPage/CompanyMsgDetail^UserGoodsShopPage/CompanyCertificate");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 初始化账号信息 Type=2 添加公司信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string UserAccount = PublicClass.FilterRequestTrim("UserAccount");
                string IsAdd = PublicClass.FilterRequestTrim("IsAdd");


                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UserAccount", UserAccount);
                _dic.Add("IsAdd", IsAdd);
                _dic.Add("IsAddCompany", "true");

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ShopMsg, "UGS_ShopMsg", "5", _dic);
                return _json;
            }
            else if (_exeType == "2") //添加公司信息
            {
                // 获取传递的参数
                string UserAccount = PublicClass.FilterRequestTrim("UserAccount");
                string CompanyName = PublicClass.FilterRequestTrim("CompanyName");
                string RegAddress = PublicClass.FilterRequestTrim("RegAddress");
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
                _dic.Add("CompanyName", CompanyName);
                _dic.Add("RegAddress", RegAddress);
                _dic.Add("CreditCode", CreditCode);
                _dic.Add("LegalPerson", LegalPerson);
                _dic.Add("RegMoney", RegMoney);
                _dic.Add("SetUpDate", SetUpDate);
                _dic.Add("BusiScope", BusiScope);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_CompanyMsg, "UGS_CompanyMsg", "2", _dic);
                return _json;
            }


            return "";
        }

        /// <summary>
        /// 编辑公司信息
        /// </summary>
        /// <returns></returns>
        public string CompanyMsgEdit()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("UserGoodsShopPage/CompanyMsg^UserGoodsShopPage/CompanyMsgAdd^UserGoodsShopPage/CompanyMsgEdit^UserGoodsShopPage/CompanyMsgDetail^UserGoodsShopPage/CompanyCertificate");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            return "";
        }

        /// <summary>
        /// 公司证件信息
        /// </summary>
        /// <returns></returns>
        public string CompanyCertificate()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("UserGoodsShopPage/CompanyMsg^UserGoodsShopPage/CompanyMsgAdd^UserGoodsShopPage/CompanyMsgEdit^UserGoodsShopPage/CompanyMsgDetail^UserGoodsShopPage/CompanyCertificate");
            if (_backLoginCode != "CPAUL_01")
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

        #endregion

        #region【会员账号】

        /// <summary>
        /// 会员账号 管理
        /// </summary>
        /// <returns></returns>
        public string UserAccount()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("UserGoodsShopPage/UserAccount^UserGoodsShopPage/UserAccountDetail^UserGoodsShopPage/UserSettingMsg");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据-视图 Type=2 批量-锁定/解锁会员账号 Type=3 编辑会员账号信息 Type=4 初始化会员账号信息-带-买家信息-店铺信息 Type=5 得到用户的当前等级和信用分 还有会员账号信息,如：昵称  pBuyerUserID , pBindMobile必须有一个不为空
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string UserAccount = PublicClass.FilterRequestTrim("UserAccount");
                string BindMobile = PublicClass.FilterRequestTrim("BindMobile");
                string VipLevel = PublicClass.FilterRequestTrim("VipLevel");
                string WxOpenID = PublicClass.FilterRequestTrim("WxOpenID");
                string MiniOpenID = PublicClass.FilterRequestTrim("MiniOpenID");
                string WxUnionID = PublicClass.FilterRequestTrim("WxUnionID");
                string CurrentRegionCodeArr = PublicClass.FilterRequestTrim("CurrentRegionCodeArr");
                string ShopName = PublicClass.FilterRequestTrim("ShopName");
                string AccountMemo = PublicClass.FilterRequestTrim("AccountMemo");
                string IsOpenShop = PublicClass.FilterRequestTrim("IsOpenShop");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string IsTransDividend = PublicClass.FilterRequestTrim("IsTransDividend");
                string RegDate = PublicClass.FilterRequestTrim("RegDate");


                //获取当前页
                string PageCurrent = PublicClass.FilterRequestTrimNoConvert("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", PageCurrent);
                _dic.Add("UserID", UserID);
                _dic.Add("UserAccount", UserAccount);
                _dic.Add("BindMobile", BindMobile);
                _dic.Add("VipLevel", VipLevel);
                _dic.Add("WxOpenID", WxOpenID);
                _dic.Add("MiniOpenID", MiniOpenID);
                _dic.Add("WxUnionID", WxUnionID);
                _dic.Add("AccountMemo", AccountMemo);
                _dic.Add("IsOpenShop", IsOpenShop);
                _dic.Add("CurrentRegionCodeArr", CurrentRegionCodeArr);
                _dic.Add("ShopName", ShopName);
                _dic.Add("IsTransDividend", IsTransDividend);
                _dic.Add("IsLock", IsLock);
                _dic.Add("RegDate", RegDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_UserAccount, "UGS_UserAccount", "6", _dic);
                return _json;
            }
            else if (_exeType == "2") //批量-锁定/解锁会员账号
            {
                // 获取传递的参数
                string UserIDArr = PublicClass.FilterRequestTrim("UserIDArr");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UserIDArr", UserIDArr);
                _dic.Add("IsLock", IsLock);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_UserAccount, "UGS_UserAccount", "7", _dic);
                return _json;
            }
            else if (_exeType == "3") //编辑会员账号信息
            {
                // 获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string IsTransDividend = PublicClass.FilterRequestTrim("IsTransDividend");
                string IsOpenShop = PublicClass.FilterRequestTrim("IsOpenShop");
                string AccountMemo = PublicClass.FilterRequestTrim("AccountMemo");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UserID", UserID);
                _dic.Add("IsTransDividend", IsTransDividend);
                _dic.Add("IsOpenShop", IsOpenShop);
                _dic.Add("AccountMemo", AccountMemo);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_UserAccount, "UGS_UserAccount", "8", _dic);
                return _json;
            }
            else if (_exeType == "4") //初始化会员账号信息-带-买家信息-店铺信息
            {
                // 获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UserID", UserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_UserAccount, "UGS_UserAccount", "9", _dic);
                return _json;
            }
            else if (_exeType == "5") //得到用户的当前等级和信用分 还有会员账号信息,如：昵称  pBuyerUserID , pBindMobile必须有一个不为空
            {
                // 获取传递的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string BindMobile = PublicClass.FilterRequestTrim("BindMobile");
                string IsMaskMobile = PublicClass.FilterRequestTrim("IsMaskMobile");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", BuyerUserID);
                _dicPost.Add("BindMobile", BindMobile);
                _dicPost.Add("IsMaskMobile", IsMaskMobile);

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_VipCreditIndex, "UGS_VipCreditIndex", "2", _dicPost);
                return _jsonBack;
            }

            return "";

        }

        /// <summary>
        /// 会员配置参数
        /// </summary>
        /// <returns></returns>
        public string UserSettingMsg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("UserGoodsShopPage/UserAccount^UserGoodsShopPage/UserAccountDetail^UserGoodsShopPage/UserSettingMsg");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }

            //------只有超级管理员(AdUserType=Admin)才能进入的页-------// 
            string _loginUserAdUserType = BusiLogin.getLoginUserAdUserType();
            if (_loginUserAdUserType != "Admin")
            {
                return "无权限访问";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 切换锁定/解锁用户设置信息 Type=3 提交用户设置信息 Type=4 批量删除 用户设置信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string UserSettingID = PublicClass.FilterRequestTrim("UserSettingID");
                string SettingType = PublicClass.FilterRequestTrim("SettingType");
                string SettingMainValue = PublicClass.FilterRequestTrim("SettingMainValue");
                string SettingSubValue = PublicClass.FilterRequestTrim("SettingSubValue");
                string SettingDesc = PublicClass.FilterRequestTrim("SettingDesc");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页
                string PageCurrent = PublicClass.FilterRequestTrimNoConvert("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", PageCurrent);
                _dic.Add("UserSettingID", UserSettingID);
                _dic.Add("SettingType", SettingType);
                _dic.Add("SettingMainValue", SettingMainValue);
                _dic.Add("SettingSubValue", SettingSubValue);
                _dic.Add("SettingDesc", SettingDesc);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_UserSettingMsg, "UGS_UserSettingMsg", "1", _dic);
                return _json;
            }
            else if (_exeType == "2") //切换锁定/解锁用户设置信息
            {
                // 获取传递的参数
                string UserSettingID = PublicClass.FilterRequestTrim("UserSettingID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UserSettingID", UserSettingID);
                _dic.Add("IsLock", IsLock);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_UserSettingMsg, "UGS_UserSettingMsg", "2", _dic);
                return _json;
            }
            else if (_exeType == "3") //提交用户设置信息
            {
                //获取传递的参数
                string UserSettingID = PublicClass.FilterRequestTrim("UserSettingID");
                string SettingType = PublicClass.FilterRequestTrim("SettingType");
                string SettingMainValue = PublicClass.FilterRequestTrim("SettingMainValue");
                string SettingSubValue = PublicClass.FilterRequestTrim("SettingSubValue");
                string SettingDesc = PublicClass.FilterRequestTrim("SettingDesc");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UserSettingID", UserSettingID);
                _dic.Add("SettingType", SettingType);
                _dic.Add("SettingMainValue", SettingMainValue);
                _dic.Add("SettingSubValue", SettingSubValue);
                _dic.Add("SettingDesc", SettingDesc);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_UserSettingMsg, "UGS_UserSettingMsg", "3", _dic);
                return _json;
            }
            else if (_exeType == "4") //批量删除 用户设置信息
            {
                //获取传递的参数
                string UserSettingIDArr = PublicClass.FilterRequestTrim("UserSettingIDArr");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UserSettingIDArr", UserSettingIDArr);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_UserSettingMsg, "UGS_UserSettingMsg", "4", _dic);
                return _json;
            }
            return "";
        }

        #endregion

        #region【推广会员信息】

        /// <summary>
        /// 推广会员信息
        /// </summary>
        /// <returns></returns>
        public string BuyerPromoteUser()
        {

            return "";
        }

        #endregion

        #region【会员发展店铺信息】

        /// <summary>
        /// 会员发展店铺信息
        /// </summary>
        /// <returns></returns>
        public string BuyerExpandShop()
        {
           

            return "";
        }

        #endregion

        #region【秒杀商品】

        /// <summary>
        /// 秒杀商品设置
        /// </summary>
        /// <returns></returns>
        public string SecKillGoodsMsg()
        {
            return "";
        }

        /// <summary>
        /// 秒杀商品分类
        /// </summary>
        /// <returns></returns>
        public string SecKillGoodsType()
        {

            return "";
        }

        #endregion

        #region【拼团管理】

        /// <summary>
        /// 拼团商品设置
        /// </summary>
        /// <returns></returns>
        public string GroupGoodsSetting()
        {
           

            return "";
        }

        /// <summary>
        /// 发起拼团管理,开团信息
        /// </summary>
        /// <returns></returns>
        public string GroupCreateMsg()
        {
           

            return "";
        }

        /// <summary>
        /// 加入拼团信息,拼团参与信息
        /// </summary>
        /// <returns></returns>
        public string GroupJoinMsg()
        {
           

            return "";
        }

        /// <summary>
        /// 拼团商品分类
        /// </summary>
        /// <returns></returns>
        public string GroupGoodsType()
        {
            

            return "";
        }

        #endregion

        #region【活动管理】

        /// <summary>
        /// 活动信息
        /// </summary>
        /// <returns></returns>
        public string ActivityMsg()
        {


            return "";
        }

        /// <summary>
        /// 活动详情
        /// </summary>
        /// <returns></returns>
        public string ActivityDetail()
        {

            return "";
        }

        /// <summary>
        /// 活动参与信息
        /// </summary>
        /// <returns></returns>
        public string ActivityJoin()
        {

            return "";
        }

        #endregion

        #region【抽奖管理】

        /// <summary>
        /// 抽奖信息管理
        /// </summary>
        /// <returns></returns>
        public string LuckyDrawMsg()
        {
         

            return "";
        }

        /// <summary>
        /// 抽奖信息详情
        /// </summary>
        /// <returns></returns>
        public string LuckyDrawMsgDetail()
        {
           
            return "";
        }

        /// <summary>
        /// 抽奖参与信息
        /// </summary>
        /// <returns></returns>
        public string LuckyDrawJoinMsg()
        {

            return "";
        }

        /// <summary>
        /// 抽奖开奖结果
        /// </summary>
        /// <returns></returns>
        public string LuckyDrawResult()
        {

            return "";
        }



        #endregion


    }

}