using BusiApiKeyVerifyNS;
using OctUserGoodsShopSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【分销店铺】相关的API接口控制器
/// </summary>
namespace OctUserGoodsShopSystemWeb.PageControllers.ApiPage
{
    public class DistriController : Controller
    {
        // GET: Distri
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 分销店铺信息
        /// </summary>
        /// <returns></returns>
        public string DistriShopMsg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 添加或编辑信息 Type=3 锁定/解锁信息 Type=4 显示/隐藏信息 Type=5 审核信息 
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string DistriShopID = PublicClass.FilterRequestTrim("DistriShopID");
                string DistriBuyerUserID = PublicClass.FilterRequestTrim("DistriBuyerUserID");
                string ShopTypeID = PublicClass.FilterRequestTrim("ShopTypeID");
                string DistriShopName = PublicClass.FilterRequestTrim("DistriShopName");
                string DistriShopDesc = PublicClass.FilterRequestTrim("DistriShopDesc");
                string DistriShopLogoImg = PublicClass.FilterRequestTrim("DistriShopLogoImg");
                string DistriShopHeaderImg = PublicClass.FilterRequestTrim("DistriShopHeaderImg");
                string OwnerTrueName = PublicClass.FilterRequestTrim("OwnerTrueName");
                string DistriShopMobile = PublicClass.FilterRequestTrim("DistriShopMobile");
                string IDCardNumber = PublicClass.FilterRequestTrim("IDCardNumber");
                string IDCardImg = PublicClass.FilterRequestTrim("IDCardImg");
                string OwnerSelfieImg = PublicClass.FilterRequestTrim("OwnerSelfieImg");
                string RegionCode = PublicClass.FilterRequestTrim("RegionCode");
                string RegionName = PublicClass.FilterRequestTrim("RegionName");
                string AddrDetail = PublicClass.FilterRequestTrim("AddrDetail");
                string IsCheck = PublicClass.FilterRequestTrim("IsCheck");
                string IsShow = PublicClass.FilterRequestTrim("IsShow");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                DistriShopID = PublicClass.preventNumberDataIsNull(DistriShopID);
                DistriBuyerUserID = PublicClass.preventDecimalDataIsNull(DistriBuyerUserID);
                ShopTypeID = PublicClass.preventNumberDataIsNull(ShopTypeID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelDistriShopMsg _modelDistriShopMsg = new ModelDistriShopMsg();
                _modelDistriShopMsg.DistriShopID = Convert.ToInt64(DistriShopID);
                _modelDistriShopMsg.DistriBuyerUserID = Convert.ToInt64(DistriBuyerUserID);
                _modelDistriShopMsg.ShopTypeID = Convert.ToInt64(ShopTypeID);
                _modelDistriShopMsg.DistriShopName = DistriShopName;
                _modelDistriShopMsg.DistriShopDesc = DistriShopDesc;
                _modelDistriShopMsg.DistriShopLogoImg = DistriShopLogoImg;
                _modelDistriShopMsg.DistriShopHeaderImg = DistriShopHeaderImg;
                _modelDistriShopMsg.OwnerTrueName = OwnerTrueName;
                _modelDistriShopMsg.DistriShopMobile = DistriShopMobile;
                _modelDistriShopMsg.IDCardNumber = IDCardNumber;
                _modelDistriShopMsg.IDCardImg = IDCardImg;
                _modelDistriShopMsg.OwnerSelfieImg = OwnerSelfieImg;
                _modelDistriShopMsg.RegionCode = RegionCode;
                _modelDistriShopMsg.RegionName = RegionName;
                _modelDistriShopMsg.AddrDetail = AddrDetail;
                _modelDistriShopMsg.IsCheck = IsCheck;
                _modelDistriShopMsg.IsShow = IsShow;
                _modelDistriShopMsg.IsLock = IsLock;
                _modelDistriShopMsg.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONDistriShopMsg(_modelDistriShopMsg, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加或编辑信息
            {
                // 获取传递的参数
                string DistriShopID = PublicClass.FilterRequestTrim("DistriShopID");
                string DistriBuyerUserID = PublicClass.FilterRequestTrim("DistriBuyerUserID");
                string ShopTypeID = PublicClass.FilterRequestTrim("ShopTypeID");
                string DistriShopName = PublicClass.FilterRequestTrim("DistriShopName");
                string DistriShopDesc = PublicClass.FilterRequestTrim("DistriShopDesc");
                string DistriShopLogoImg = PublicClass.FilterRequestTrim("DistriShopLogoImg");
                string DistriShopHeaderImg = PublicClass.FilterRequestTrim("DistriShopHeaderImg");
                string OwnerTrueName = PublicClass.FilterRequestTrim("OwnerTrueName");
                string DistriShopMobile = PublicClass.FilterRequestTrim("DistriShopMobile");
                string IDCardNumber = PublicClass.FilterRequestTrim("IDCardNumber");
                string IDCardImg = PublicClass.FilterRequestTrim("IDCardImg");
                string OwnerSelfieImg = PublicClass.FilterRequestTrim("OwnerSelfieImg");
                string RegionCode = PublicClass.FilterRequestTrim("RegionCode");
                string RegionName = PublicClass.FilterRequestTrim("RegionName");
                string AddrDetail = PublicClass.FilterRequestTrim("AddrDetail");
                string IsCheck = PublicClass.FilterRequestTrim("IsCheck");
                string IsShow = PublicClass.FilterRequestTrim("IsShow");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //防止数字类型为空
                DistriShopID = PublicClass.preventNumberDataIsNull(DistriShopID);
                DistriBuyerUserID = PublicClass.preventDecimalDataIsNull(DistriBuyerUserID);
                ShopTypeID = PublicClass.preventNumberDataIsNull(ShopTypeID);

                //提交 分销店铺信息 -- API调用方法
                return BusiDistri.submitDistriShopMsgApi(Convert.ToInt64(DistriShopID), Convert.ToInt64(DistriBuyerUserID), Convert.ToInt64(ShopTypeID), DistriShopName, DistriShopDesc, DistriShopLogoImg, DistriShopHeaderImg, OwnerTrueName, DistriShopMobile, IDCardNumber, IDCardImg, OwnerSelfieImg, RegionCode, RegionName, AddrDetail, IsCheck, "", IsShow, IsLock);
            }
            else if (_exeType == "3") //锁定/解锁信息  
            {
                // 获取传递的参数
                string DistriShopID = PublicClass.FilterRequestTrim("DistriShopID");

                //锁定/解锁 分销店铺信息 --API调用方法
                return BusiDistri.lockDistriShopMsgApi(Convert.ToInt64(DistriShopID));
            }
            else if (_exeType == "4") //显示/隐藏信息
            {
                // 获取传递的参数
                string DistriShopID = PublicClass.FilterRequestTrim("DistriShopID");

                //显示/隐藏  分销店铺信息  --API调用方法
                return BusiDistri.showDistriShopMsgApi(Convert.ToInt64(DistriShopID));
            }
            else if (_exeType == "5") //审核信息 
            {
                // 获取传递的参数
                string DistriShopID = PublicClass.FilterRequestTrim("DistriShopID");
                string IsCheck = PublicClass.FilterRequestTrim("IsCheck");
                string CheckReason = PublicClass.FilterRequestTrim("CheckReason");

                //审核 分销店铺信息 --API调用方法
                return BusiDistri.checkDistriShopMsgApi(Convert.ToInt64(DistriShopID), IsCheck, CheckReason);
            }


            return "";
        }

        /// <summary>
        /// 分销商品信息
        /// </summary>
        /// <returns></returns>
        public string DistriGoodsMsg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 添加或编辑信息 Type=3 锁定/解锁信息 Type=4 上架/下架 信息 Type=5 审核信息 Type=6 推荐信息 Type=7 删除 单个或批量 信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string DistriGoodsID = PublicClass.FilterRequestTrim("DistriGoodsID");
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string DistriShopGoodsTypeID = PublicClass.FilterRequestTrim("DistriShopGoodsTypeID");
                string DistriBuyerUserID = PublicClass.FilterRequestTrim("DistriBuyerUserID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsCheck = PublicClass.FilterRequestTrim("IsCheck");
                string CheckReason = PublicClass.FilterRequestTrim("CheckReason");
                string IsUnSale = PublicClass.FilterRequestTrim("IsUnSale");
                string IsRecommend = PublicClass.FilterRequestTrim("IsRecommend");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                DistriGoodsID = PublicClass.preventNumberDataIsNull(DistriGoodsID);
                GoodsID = PublicClass.preventDecimalDataIsNull(GoodsID);
                DistriShopGoodsTypeID = PublicClass.preventNumberDataIsNull(DistriShopGoodsTypeID);
                DistriBuyerUserID = PublicClass.preventNumberDataIsNull(DistriBuyerUserID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelDistriGoodsMsg _modelDistriGoodsMsg = new ModelDistriGoodsMsg();
                _modelDistriGoodsMsg.DistriGoodsID = Convert.ToInt64(DistriGoodsID);
                _modelDistriGoodsMsg.GoodsID = Convert.ToInt64(GoodsID);
                _modelDistriGoodsMsg.DistriShopGoodsTypeID = Convert.ToInt64(DistriShopGoodsTypeID);
                _modelDistriGoodsMsg.DistriBuyerUserID = Convert.ToInt64(DistriBuyerUserID);
                _modelDistriGoodsMsg.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelDistriGoodsMsg.IsCheck = IsCheck;
                _modelDistriGoodsMsg.CheckReason = CheckReason;
                _modelDistriGoodsMsg.IsUnSale = IsUnSale;
                _modelDistriGoodsMsg.IsRecommend = IsRecommend;
                _modelDistriGoodsMsg.IsLock = IsLock;
                _modelDistriGoodsMsg.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONDistriGoodsMsg(_modelDistriGoodsMsg, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加或编辑信息
            {
                // 获取传递的参数
                string DistriGoodsID = PublicClass.FilterRequestTrim("DistriGoodsID");
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string DistriShopGoodsTypeID = PublicClass.FilterRequestTrim("DistriShopGoodsTypeID");
                string DistriBuyerUserID = PublicClass.FilterRequestTrim("DistriBuyerUserID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsCheck = PublicClass.FilterRequestTrim("IsCheck");
                string CheckReason = PublicClass.FilterRequestTrim("CheckReason");
                string IsUnSale = PublicClass.FilterRequestTrim("IsUnSale");
                string IsRecommend = PublicClass.FilterRequestTrim("IsRecommend");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //防止数字类型为空
                DistriGoodsID = PublicClass.preventNumberDataIsNull(DistriGoodsID);
                GoodsID = PublicClass.preventDecimalDataIsNull(GoodsID);
                DistriShopGoodsTypeID = PublicClass.preventNumberDataIsNull(DistriShopGoodsTypeID);
                DistriBuyerUserID = PublicClass.preventNumberDataIsNull(DistriBuyerUserID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //提交 分销商品信息 --API调用方法
                return BusiDistri.submitDistriGoodsMsgApi(Convert.ToInt64(DistriGoodsID), Convert.ToInt64(GoodsID), Convert.ToInt64(DistriShopGoodsTypeID), Convert.ToInt64(DistriBuyerUserID), Convert.ToInt64(ShopUserID), IsCheck, CheckReason, IsUnSale, IsLock);
            }
            else if (_exeType == "3") //锁定/解锁信息
            {
                // 获取传递的参数
                string DistriGoodsID = PublicClass.FilterRequestTrim("DistriGoodsID");
                //锁定/解锁 分销商品信息 --API调用方法
                return BusiDistri.lockDistriGoodsMsgApi(Convert.ToInt64(DistriGoodsID));
            }
            else if (_exeType == "4") //上架/下架 信息
            {
                // 获取传递的参数
                string DistriGoodsIDArr = PublicClass.FilterRequestTrim("DistriGoodsIDArr");
                string IsUnSale = PublicClass.FilterRequestTrim("IsUnSale");

                //上架/下架 分销商品信息 --API调用方法
                return BusiDistri.unSaleDistriGoodsMsgApi(DistriGoodsIDArr, IsUnSale);
            }
            else if (_exeType == "5") //审核信息 
            {
                // 获取传递的参数
                string DistriGoodsID = PublicClass.FilterRequestTrim("DistriGoodsID");
                string IsCheck = PublicClass.FilterRequestTrim("IsCheck");
                string CheckReason = PublicClass.FilterRequestTrim("CheckReason");
                //审核 分销商品信息
                return BusiDistri.checkDistriGoodsMsgApi(Convert.ToInt64(DistriGoodsID), IsCheck, CheckReason);
            }
            else if (_exeType == "6") //推荐信息
            {
                // 获取传递的参数
                string DistriGoodsID = PublicClass.FilterRequestTrim("DistriGoodsID");
                string IsRecommend = PublicClass.FilterRequestTrim("IsRecommend");
                //推荐 分销商品信息 --API调用方法
                return BusiDistri.recommendDistriGoodsMsgApi(Convert.ToInt64(DistriGoodsID), IsRecommend);
            }
            else if (_exeType == "7") //删除 单个或批量 信息
            {
                // 获取传递的参数
                string DistriGoodsIDArr = PublicClass.FilterRequestTrim("DistriGoodsIDArr");
                //删除 单个或批量 分销商品信息 --API调用方法
                return BusiDistri.delDistriGoodsMsgArrApi(DistriGoodsIDArr);
            }

            return "";
        }

        /// <summary>
        /// 分销店铺的商品类别
        /// </summary>
        /// <returns></returns>
        public string DistriShopGoodsType()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 添加或编辑信息 Type=3 删除信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string DistriShopGoodsTypeID = PublicClass.FilterRequestTrim("DistriShopGoodsTypeID");
                string GoodsTypeName = PublicClass.FilterRequestTrim("GoodsTypeName");
                string DistriBuyerUserID = PublicClass.FilterRequestTrim("DistriBuyerUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                DistriShopGoodsTypeID = PublicClass.preventNumberDataIsNull(DistriShopGoodsTypeID);
                DistriBuyerUserID = PublicClass.preventDecimalDataIsNull(DistriBuyerUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelDistriShopGoodsType _modelDistriShopGoodsType = new ModelDistriShopGoodsType();
                _modelDistriShopGoodsType.DistriShopGoodsTypeID = Convert.ToInt64(DistriShopGoodsTypeID);
                _modelDistriShopGoodsType.GoodsTypeName = GoodsTypeName;
                _modelDistriShopGoodsType.DistriBuyerUserID = Convert.ToInt64(DistriBuyerUserID);
                _modelDistriShopGoodsType.IsLock = IsLock;
                _modelDistriShopGoodsType.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONDistriShopGoodsType(_modelDistriShopGoodsType, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加或编辑信息
            {
                // 获取传递的参数
                string DistriShopGoodsTypeID = PublicClass.FilterRequestTrim("DistriShopGoodsTypeID");
                string GoodsTypeName = PublicClass.FilterRequestTrim("GoodsTypeName");
                string DistriBuyerUserID = PublicClass.FilterRequestTrim("DistriBuyerUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //防止数字类型为空
                DistriShopGoodsTypeID = PublicClass.preventNumberDataIsNull(DistriShopGoodsTypeID);
                DistriBuyerUserID = PublicClass.preventDecimalDataIsNull(DistriBuyerUserID);

                //提交 分销店铺的商品类别 --API调用方法
                return BusiDistri.submitDistriShopGoodsTypeApi(Convert.ToInt64(DistriShopGoodsTypeID), GoodsTypeName, Convert.ToInt64(DistriBuyerUserID), IsLock);
            }
            else if (_exeType == "3") //删除信息
            {
                // 获取传递的参数
                string DistriShopGoodsTypeIDArr = PublicClass.FilterRequestTrim("DistriShopGoodsTypeIDArr");

                //删除 单个或批量 分销店铺的商品类别 --API调用方法
                return BusiDistri.delDistriShopGoodsTypeArrApi(DistriShopGoodsTypeIDArr);
            }


                return "";
        }



    }
}