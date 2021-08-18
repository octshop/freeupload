using BusiApiKeyVerifyNS;
using OctTradingSystemNS;
using PublicClassNS;
using RegionCodeNameNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


/// <summary>
/// 【优惠券】相关的API接口控制器
/// </summary>
namespace OctTradingSystemWeb.PageControllers.ApiPage
{
    public class CouponsController : Controller
    {
        // GET: Coupons
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 优惠券信息
        /// </summary>
        /// <returns></returns>
        public string CouponsMsg()
        {
            //获取操作类型  Type=1 搜索分页数据 Type=2 添加/编辑优惠券信息 Type=3 开关锁定优惠券信息 Type=4 删除 单个或批量 优惠券信息 Type=5 暂停或继续发放 优惠券 Type=6 初始化优惠券详情 Type=7 得到 商品可以使用的优惠券列表  Type=8 买家获取优惠券 单个获取 Type=9 得到店铺可使用的优惠券列表 Type=10 得到优惠券可以使用的产品列表 Type=11 加载优惠券可以使用的店铺列表 Type=12 初始化优惠券横条的Bar信息 Type=13 加载店铺中指定记录条数的可领取的优惠券列表 Type=14 平台优惠券展示 搜索分页数据 Type=15 加载所有优惠券店铺分类信息 Type=16 初始化优惠券详情(CMS版)
            string _exeType = PublicClass.FilterRequestTrim("Type");

            //-------------无需要验证签名------------//
            if (_exeType == "7") //得到 商品可以使用的优惠券列表 
            {
                // 获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string LoadrecordNum = PublicClass.FilterRequestTrim("LoadrecordNum");

                //防止数字类型为空
                GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                LoadrecordNum = PublicClass.preventNumberDataIsNull(LoadrecordNum);

                //得到 商品可以使用的优惠券列表  可选买家UserID的判断   主要用于商品详情页领取 ---API调用方法
                string _jsonBack = BusiCoupons.goodsAbleUseCouponsListJsonApi(Convert.ToInt64(GoodsID), Convert.ToInt64(ShopUserID), Convert.ToInt64(BuyerUserID), Convert.ToInt32(LoadrecordNum));
                return _jsonBack;
            }
            else if (_exeType == "9") //得到店铺可使用的优惠券列表
            {
                //获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string LoadrecordNum = PublicClass.FilterRequestTrim("LoadrecordNum");

                //防止数字为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                LoadrecordNum = PublicClass.preventNumberDataIsNull(LoadrecordNum);

                //得到 店铺可以使用的优惠券列表  可选买家UserID的判断   主要用于购物车页领取 ---API调用方法
                string _jsonBack = BusiCoupons.shopAbleUseCouponsListJsonApi(Convert.ToInt64(ShopUserID), Convert.ToInt64(BuyerUserID), Convert.ToInt32(LoadrecordNum));
                return _jsonBack;

            }
            else if (_exeType == "10") //得到优惠券可以使用的产品列表
            {
                //获取传递的参数
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");

                //防止数字为空
                CouponsID = PublicClass.preventNumberDataIsNull(CouponsID);

                string _jsonBack = BusiCoupons.loadCouponsAbleUseGoodsListApi(Convert.ToInt64(CouponsID));
                return _jsonBack;

            }
            else if (_exeType == "11") //加载优惠券可以使用的店铺列表
            {
                //获取传递的参数
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");

                //防止数字为空
                CouponsID = PublicClass.preventNumberDataIsNull(CouponsID);

                string _jsonBack = BusiCoupons.loadCouponsAbleUseShopListApi(Convert.ToInt64(CouponsID));
                return _jsonBack;
            }
            else if (_exeType == "12") //初始化优惠券横条的Bar信息
            {
                //获取传递的参数
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");
                string IssueID = PublicClass.FilterRequestTrim("IssueID");

                //防止数字为空
                CouponsID = PublicClass.preventNumberDataIsNull(CouponsID);
                IssueID = PublicClass.preventNumberDataIsNull(IssueID);

                string _jsonBack = BusiCoupons.intCouponsMsgBarApi(Convert.ToInt64(CouponsID), Convert.ToInt64(IssueID));
                return _jsonBack;
            }
            else if (_exeType == "13") //加载店铺中指定记录条数的可领取的优惠券列表
            {
                //获取传递参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                string LoadNum = PublicClass.FilterRequestTrim("LoadNum");

                //防止数字类型为空
                ShopID = PublicClass.preventNumberDataIsNull(ShopID);
                LoadNum = PublicClass.preventNumberDataIsNull(LoadNum);

                string _jsonBack = BusiCoupons.loadShopCouponsTopListApi(Convert.ToInt64(ShopID), Convert.ToInt32(LoadNum));
                return _jsonBack;
            }
            else if (_exeType == "14") //平台优惠券展示 搜索分页数据
            {
                // 获取传递的参数
                string ExpenseReachSum = PublicClass.FilterRequestTrim("ExpenseReachSum");
                string IsOfflineUse = PublicClass.FilterRequestTrim("IsOfflineUse");
                string ShopTypeID = PublicClass.FilterRequestTrim("ShopTypeID");
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");

                //区县的代号 430121
                string RegionCountyCode = PublicClass.FilterRequestTrimNoConvert("RegionCountyCode");
                //城市的代号 430100
                string RegionCityCode = PublicClass.FilterRequestTrimNoConvert("RegionCityCode");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                ShopTypeID = PublicClass.preventNumberDataIsNull(ShopTypeID);
                ExpenseReachSum = PublicClass.preventDecimalDataIsNull(ExpenseReachSum);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelCouponsMsg _modelCouponsMsg = new ModelCouponsMsg();
                _modelCouponsMsg.ExpenseReachSum = Convert.ToDecimal(ExpenseReachSum);
                _modelCouponsMsg.IsOfflineUse = IsOfflineUse;
                _modelCouponsMsg.ShopTypeID = Convert.ToInt64(ShopTypeID);
                _modelCouponsMsg.IsEntity = IsEntity;

                _modelCouponsMsg.IsLock = "false";
                _modelCouponsMsg.IssuePause = "false";
                _modelCouponsMsg.NumTotal = 1; //优惠券总数必须大于1

                if (string.IsNullOrWhiteSpace(RegionCountyCode) == false && IsEntity == "true")
                {
                    //得到省，市，县区号
                    List<Dictionary<string, string>> _listDicRegion = RegionCodeName.getProvinceCityCountryByCountyRegionCode(RegionCountyCode);
                    _modelCouponsMsg.RegionCodeArr = _listDicRegion[2]["REGIONCODE"].ToString().Trim() + "_" + _listDicRegion[1]["REGIONCODE"].ToString().Trim() + "_" + _listDicRegion[0]["REGIONCODE"].ToString().Trim();
                }


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "(substring(UseTimeRange,charindex('^',UseTimeRange) +1,1000)>= getdate() OR UseTimeRange IS Null OR UseTimeRange='') AND (IssueType='ShopGet' OR IssueType='BuyOrShop')"; //优惠券在有效期内


                //-----构造查询关键字 条件------//

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
                //没有选择地区
                if (string.IsNullOrWhiteSpace(RegionCountyCode) && IsEntity == "true")
                {
                    if (string.IsNullOrWhiteSpace(_initSQLCharWhere) == false)
                    {
                        _initSQLCharWhere = "(" + _initSQLCharWhere + ") AND ";
                    }

                    _initSQLCharWhere += "RegionCodeArr LIKE '" + _retgionProvCityCodeArr + "_%'";
                }


                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder", "CouponsDesc", "UseShopIDArr", "UseGoodsIDArr", "UseGoodsIDArr", "IssueType", "IssueExpenseSum", "IsMallCoupons", "IssuePause", "IsRepeatGet", "IsLock", "WriteDate" };
                string _strJson = BusiJsonPageStr.morePageJSONCouponsMsg(_modelCouponsMsg, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "15") //加载所有优惠券店铺分类信息
            {
                // 获取传递的参数
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");

                //加载所有优惠券店铺分类信息
                string _jsonBack = BusiCoupons.loadCouponsShopTypeApi(IsEntity);
                return _jsonBack;
            }

            //-------------需要验证签名-----------------//

            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            if (_exeType == "1")  //搜索分页数据
            {
                // 获取传递的参数
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");
                string CouponsTitle = PublicClass.FilterRequestTrim("CouponsTitle");
                string CouponsDesc = PublicClass.FilterRequestTrim("CouponsDesc");
                string UseMoney = PublicClass.FilterRequestTrim("UseMoney");
                string UseDiscount = PublicClass.FilterRequestTrim("UseDiscount");
                string NumTotal = PublicClass.FilterRequestTrim("NumTotal");
                string UseShopIDArr = PublicClass.FilterRequestTrim("UseShopIDArr");
                string UseGoodsIDArr = PublicClass.FilterRequestTrim("UseGoodsIDArr");
                string UseTimeRange = PublicClass.FilterRequestTrimNoConvert("UseTimeRange");
                string ExpenseReachSum = PublicClass.FilterRequestTrim("ExpenseReachSum");
                string IssueType = PublicClass.FilterRequestTrim("IssueType");
                string IssuePause = PublicClass.FilterRequestTrim("IssuePause");
                string IssueExpenseSum = PublicClass.FilterRequestTrim("IssueExpenseSum");
                string IsMallCoupons = PublicClass.FilterRequestTrim("IsMallCoupons");
                string IsRepeatGet = PublicClass.FilterRequestTrim("IsRepeatGet");
                string IsOfflineUse = PublicClass.FilterRequestTrim("IsOfflineUse");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                CouponsID = PublicClass.preventNumberDataIsNull(CouponsID);
                UseMoney = PublicClass.preventDecimalDataIsNull(UseMoney);
                UseDiscount = PublicClass.preventDecimalDataIsNull(UseDiscount);
                NumTotal = PublicClass.preventNumberDataIsNull(NumTotal);
                ExpenseReachSum = PublicClass.preventDecimalDataIsNull(ExpenseReachSum);
                IssueExpenseSum = PublicClass.preventDecimalDataIsNull(IssueExpenseSum);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelCouponsMsg _modelCouponsMsg = new ModelCouponsMsg();
                _modelCouponsMsg.CouponsID = Convert.ToInt64(CouponsID);
                _modelCouponsMsg.CouponsTitle = CouponsTitle;
                _modelCouponsMsg.CouponsDesc = CouponsDesc;
                _modelCouponsMsg.UseMoney = Convert.ToDecimal(UseMoney);
                _modelCouponsMsg.UseDiscount = Convert.ToDecimal(UseDiscount);
                _modelCouponsMsg.NumTotal = Convert.ToInt32(NumTotal);
                _modelCouponsMsg.UseShopIDArr = UseShopIDArr;
                _modelCouponsMsg.UseGoodsIDArr = UseGoodsIDArr;
                _modelCouponsMsg.UseTimeRange = UseTimeRange;
                _modelCouponsMsg.ExpenseReachSum = Convert.ToDecimal(ExpenseReachSum);
                _modelCouponsMsg.IssueType = IssueType;
                _modelCouponsMsg.IssuePause = IssuePause;
                _modelCouponsMsg.IssueExpenseSum = Convert.ToDecimal(IssueExpenseSum);
                _modelCouponsMsg.IsMallCoupons = IsMallCoupons;
                _modelCouponsMsg.IsRepeatGet = IsRepeatGet;
                _modelCouponsMsg.IsOfflineUse = IsOfflineUse;
                _modelCouponsMsg.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelCouponsMsg.IsLock = IsLock;
                _modelCouponsMsg.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONCouponsMsg(_modelCouponsMsg, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加/编辑优惠券信息
            {
                // 获取传递的参数
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");

                string CouponsTitle = PublicClass.FilterRequestTrim("CouponsTitle");
                string CouponsDesc = PublicClass.FilterRequestTrim("CouponsDesc");
                string UseMoney = PublicClass.FilterRequestTrim("UseMoney");
                string UseDiscount = PublicClass.FilterRequestTrim("UseDiscount");
                string NumTotal = PublicClass.FilterRequestTrim("NumTotal");
                string UseShopIDArr = PublicClass.FilterRequestTrim("UseShopIDArr");
                string UseGoodsIDArr = PublicClass.FilterRequestTrim("UseGoodsIDArr");
                string UseTimeRange = PublicClass.FilterRequestTrim("UseTimeRange");
                string ExpenseReachSum = PublicClass.FilterRequestTrim("ExpenseReachSum");
                string IssueType = PublicClass.FilterRequestTrim("IssueType");
                string IssueExpenseSum = PublicClass.FilterRequestTrim("IssueExpenseSum");
                string IsRepeatGet = PublicClass.FilterRequestTrim("IsRepeatGet");
                string IsMallCoupons = PublicClass.FilterRequestTrim("IsMallCoupons");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                string IsOfflineUse = PublicClass.FilterRequestTrim("IsOfflineUse");


                //防止数字类型为空
                CouponsID = PublicClass.preventNumberDataIsNull(CouponsID); //等于0时，为添加操作
                UseMoney = PublicClass.preventDecimalDataIsNull(UseMoney);
                UseDiscount = PublicClass.preventDecimalDataIsNull(UseDiscount);
                NumTotal = PublicClass.preventNumberDataIsNull(NumTotal);
                ExpenseReachSum = PublicClass.preventDecimalDataIsNull(ExpenseReachSum);
                IssueExpenseSum = PublicClass.preventDecimalDataIsNull(IssueExpenseSum);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //提交 优惠券 信息  -----API调用方法
                string _jsonBack = BusiCoupons.submitCouponsMsgApi(Convert.ToInt64(CouponsID), CouponsTitle, CouponsDesc, Convert.ToDecimal(UseMoney), Convert.ToDecimal(UseDiscount), Convert.ToInt32(NumTotal), UseShopIDArr, UseGoodsIDArr, UseTimeRange, Convert.ToDecimal(ExpenseReachSum), IssueType, Convert.ToDecimal(IssueExpenseSum), Convert.ToInt64(ShopUserID), IsMallCoupons, IsLock, IsRepeatGet, IsOfflineUse);
                return _jsonBack;
            }
            else if (_exeType == "3") //开关锁定优惠券信息
            {
                // 获取传递的参数
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");

                //锁定优惠券信息 --API调用方法
                return BusiCoupons.toggleLockCouponsMsgApi(Convert.ToInt64(CouponsID));
            }
            else if (_exeType == "4") //删除 单个或批量 优惠券信息
            {
                // 获取传递的参数
                string CouponsIDArr = PublicClass.FilterRequestTrim("CouponsIDArr");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字类型为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //删除 单个或批量 优惠券信息  ---API调用方法
                return BusiCoupons.delCouponsMsgArrApi(CouponsIDArr, Convert.ToInt64(ShopUserID));
            }
            else if (_exeType == "5") //暂停或继续发放 优惠券
            {
                // 获取传递的参数
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");
                string IssuePause = PublicClass.FilterRequestTrim("IssuePause");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字类型为空
                CouponsID = PublicClass.preventNumberDataIsNull(CouponsID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //暂停或继续发放 优惠券  ---API调用方法
                string _jsonBack = BusiCoupons.toggleIssueCouponsMsgApi(Convert.ToInt64(CouponsID), IssuePause, Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "6") //初始化优惠券详情
            {
                // 获取传递的参数
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");

                //防止数字类型为空
                CouponsID = PublicClass.preventNumberDataIsNull(CouponsID);

                return BusiCoupons.jsonCouponsMsgApi(Convert.ToInt64(CouponsID));
            }
            else if (_exeType == "8") //买家获取优惠券 单个获取
            {
                // 获取传递的参数
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字类型为空
                CouponsID = PublicClass.preventNumberDataIsNull(CouponsID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //买家获取优惠券 单个获取
                string _jsonBack = BusiCoupons.buyerGetCouponsApi(Convert.ToInt64(CouponsID), Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }
            else if (_exeType == "16") //初始化优惠券详情(CMS版)
            {
                // 获取传递的参数
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");

                //防止数字类型为空
                CouponsID = PublicClass.preventNumberDataIsNull(CouponsID);

                return BusiCoupons.initCouponsMsgCMSApi(Convert.ToInt64(CouponsID));
            }

            return "";
        }

        /// <summary>
        /// 优惠券发放信息
        /// </summary>
        /// <returns></returns>
        public string CouponsIssueMsg()
        {

            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 添加/编辑优惠券发放信息 Type=3 开关 锁定优惠券发放信息 Type=4 加载单个商品买家可使用的优惠券列表 Type=5 初始化默认使用的优惠券 单个商品订单 Type=6 视图_优惠券发放信息_优惠券信息 搜索分页数据 Type=7 加载多个商品买家可使用的优惠券列表 (商家多个商品的订单) Type=8 初始化默认使用的优惠券 多个商品订单 Type=9 数据搜索分页-视图-Wap端 Type=10 统计买家各种优惠券信息总数 Type=11 初始化优惠券发放信息 -带优惠券详情，会员信息，订单信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string IssueID = PublicClass.FilterRequestTrim("IssueID");
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");
                string IssueOrderID = PublicClass.FilterRequestTrim("IssueOrderID");
                string IsUsed = PublicClass.FilterRequestTrim("IsUsed");
                string UsedTime = PublicClass.FilterRequestTrim("UsedTime");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                IssueID = PublicClass.preventNumberDataIsNull(IssueID);
                CouponsID = PublicClass.preventNumberDataIsNull(CouponsID);
                IssueOrderID = PublicClass.preventNumberDataIsNull(IssueOrderID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelCouponsIssueMsg _modelCouponsIssueMsg = new ModelCouponsIssueMsg();
                _modelCouponsIssueMsg.IssueID = Convert.ToInt64(IssueID);
                _modelCouponsIssueMsg.CouponsID = Convert.ToInt64(CouponsID);
                _modelCouponsIssueMsg.IssueOrderID = Convert.ToInt64(IssueOrderID);
                _modelCouponsIssueMsg.IsUsed = IsUsed;
                _modelCouponsIssueMsg.UsedTime = UsedTime;
                _modelCouponsIssueMsg.BuyerUserID = Convert.ToInt64(BuyerUserID);
                _modelCouponsIssueMsg.IsLock = IsLock;
                _modelCouponsIssueMsg.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONCouponsIssueMsg(_modelCouponsIssueMsg, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加/编辑优惠券发放信息
            {
                // 获取传递的参数
                string IssueID = PublicClass.FilterRequestTrim("IssueID");
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");
                string IssueOrderID = PublicClass.FilterRequestTrim("IssueOrderID");
                string IsUsed = PublicClass.FilterRequestTrim("IsUsed");
                string UsedTime = PublicClass.FilterRequestTrim("UsedTime");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //防止数字类型为空
                IssueID = PublicClass.preventNumberDataIsNull(IssueID); //为0时是添加操作
                CouponsID = PublicClass.preventNumberDataIsNull(CouponsID);
                IssueOrderID = PublicClass.preventNumberDataIsNull(IssueOrderID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //提交 优惠券发放信息  -----API调用方法
                return BusiCoupons.submitCouponsIssueMsgApi(Convert.ToInt64(IssueID), Convert.ToInt64(CouponsID), Convert.ToInt64(IssueOrderID), Convert.ToInt64(BuyerUserID), IsUsed, UsedTime, IsLock);
            }
            else if (_exeType == "3") //开关 锁定优惠券发放信息
            {
                // 获取传递的参数
                string IssueID = PublicClass.FilterRequestTrim("IssueID");

                // 锁定优惠券发放信息 --API调用方法
                return BusiCoupons.toggleLockCouponsIssueMsgApi(Convert.ToInt64(IssueID));
            }
            else if (_exeType == "4") //加载单个商品买家可使用的优惠券列表
            {
                // 获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string ExpenseReachSum = PublicClass.FilterRequestTrim("ExpenseReachSum");

                //防止数字为空值
                GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                ExpenseReachSum = PublicClass.preventDecimalDataIsNull(ExpenseReachSum);

                // 得到单个商品买家可使用的优惠券列表  ---API调用方法
                string _jsonBack = BusiCoupons.getUseCouponsMsgListSingleGoodsApi(Convert.ToInt64(GoodsID), Convert.ToInt64(BuyerUserID), Convert.ToDecimal(ExpenseReachSum));
                return _jsonBack;
            }
            else if (_exeType == "5") //初始化默认使用的优惠券 -- 单个商品订单
            {
                // 获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string SpecPropID = PublicClass.FilterRequestTrim("SpecPropID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string ExpenseReachSum = PublicClass.FilterRequestTrim("ExpenseReachSum");
                //防止数字为空值
                GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);
                SpecPropID = PublicClass.preventNumberDataIsNull(SpecPropID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                ExpenseReachSum = PublicClass.preventDecimalDataIsNull(ExpenseReachSum);

                //得到买家_商品默认使用的优惠券信息 ---API调用方法
                string _jsonBack = BusiCoupons.getBuyerDefaultUseCouponsMsgApi(Convert.ToInt64(BuyerUserID), Convert.ToInt64(GoodsID), Convert.ToDecimal(ExpenseReachSum), Convert.ToInt64(SpecPropID));
                return _jsonBack;
            }
            else if (_exeType == "6") //视图_优惠券发放信息_优惠券信息 搜索分页数据
            {
                //获取传递的参数
                string IssueID = PublicClass.FilterRequestTrim("IssueID");
                string CouponsID = PublicClass.FilterRequestTrim("CouponsID");
                string CouponsTitle = PublicClass.FilterRequestTrim("CouponsTitle");
                string UseMoney = PublicClass.FilterRequestTrim("UseMoney");
                string UseDiscount = PublicClass.FilterRequestTrim("UseDiscount");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string IsUsed = PublicClass.FilterRequestTrim("IsUsed");
                string IsOverTime = PublicClass.FilterRequestTrim("IsOverTime");
                string IsMallCoupons = PublicClass.FilterRequestTrimNoConvert("IsMallCoupons");
                string UsedTime = PublicClass.FilterRequestTrimNoConvert("UsedTime");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //当前页
                string pageCurrent = PublicClass.FilterRequestTrim("pageCurrent");

                //防止数字类型为空
                IssueID = PublicClass.preventNumberDataIsNull(IssueID);
                CouponsID = PublicClass.preventNumberDataIsNull(CouponsID);
                UseMoney = PublicClass.preventDecimalDataIsNull(UseMoney);
                UseDiscount = PublicClass.preventDecimalDataIsNull(UseDiscount);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelV_CouponsIssueMsg_CouponsMsg _modelV = ModelV_CouponsIssueMsg_CouponsMsg.initModelView();
                _modelV.ModelCouponsMsg.CouponsID = Convert.ToInt64(CouponsID);
                _modelV.ModelCouponsMsg.CouponsTitle = CouponsTitle;
                _modelV.ModelCouponsMsg.UseMoney = Convert.ToDecimal(UseMoney);
                _modelV.ModelCouponsMsg.UseDiscount = Convert.ToDecimal(UseDiscount);
                _modelV.ModelCouponsMsg.IsMallCoupons = IsMallCoupons;
                _modelV.ModelCouponsMsg.ShopUserID = Convert.ToInt64(ShopUserID);

                _modelV.ModelCouponsIssueMsg.IssueID = Convert.ToInt64(IssueID);
                _modelV.ModelCouponsIssueMsg.BuyerUserID = Convert.ToInt64(BuyerUserID);
                _modelV.ModelCouponsIssueMsg.IsUsed = IsUsed;
                _modelV.ModelCouponsIssueMsg.IsOverTime = IsOverTime;
                _modelV.ModelCouponsIssueMsg.UsedTime = UsedTime;
                _modelV.ModelCouponsIssueMsg.WriteDate = WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder", "IsLock", "CouponsDesc" };
                string _strJson = BusiJsonPageStr.morePageJSONV_CouponsIssueMsg_CouponsMsg(_modelV, pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "7") //加载多个商品买家可使用的优惠券列表 (商家多个商品的订单)
            {
                //获取传递过来的参数
                //商品ID拼接字符串 "^"字符拼接
                string GoodsIDArr = PublicClass.FilterRequestTrim("GoodsIDArr");
                //加入折扣后的商品单价拼接字符串 "^"字符拼接
                string GoodsUnitPriceArr = PublicClass.FilterRequestTrim("GoodsUnitPriceArr");

                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string OrderExpenseReachSum = PublicClass.FilterRequestTrim("OrderExpenseReachSum");

                if (string.IsNullOrWhiteSpace(GoodsIDArr))
                {
                    return "";
                }

                //防止数字类型为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                OrderExpenseReachSum = PublicClass.preventDecimalDataIsNull(OrderExpenseReachSum);

                //将商品ID拼接字符串 转换成数组
                string[] _GoodsIDArr = null;
                if (GoodsIDArr.IndexOf("^") >= 0)
                {
                    _GoodsIDArr = GoodsIDArr.Split('^');
                }
                else
                {
                    _GoodsIDArr = new string[] { GoodsIDArr };
                }

                //单品单价拼接字符串 转换成功 数组
                string[] _GoodsUnitPriceArr = null;
                if (GoodsUnitPriceArr.IndexOf("^") >= 0)
                {
                    _GoodsUnitPriceArr = GoodsUnitPriceArr.Split('^');
                }
                else
                {
                    _GoodsUnitPriceArr = new string[] { GoodsUnitPriceArr };
                }


                //得到多个商品买家可使用的优惠券列表 (商家多个商品的订单) --API调用方法
                string _jsonBack = BusiCoupons.getUseCouponsMsgListMulGoodsApi(_GoodsIDArr, Convert.ToInt64(BuyerUserID), Convert.ToDecimal(OrderExpenseReachSum), _GoodsUnitPriceArr);
                return _jsonBack;
            }
            else if (_exeType == "8") //初始化默认使用的优惠券 多个商品订单
            {
                //获取传递过来的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                //用“^”分割
                string GoodsIDArr = PublicClass.FilterRequestTrim("GoodsIDArr");
                string ExpenseReachSum = PublicClass.FilterRequestTrim("ExpenseReachSum");
                string SpecPropIDArr = PublicClass.FilterRequestTrim("SpecPropIDArr");
                string GoodsUnitPriceArr = PublicClass.FilterRequestTrim("GoodsUnitPriceArr");
                //防止数字类型为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                ExpenseReachSum = PublicClass.preventDecimalDataIsNull(ExpenseReachSum);

                //分割数组
                string[] _GoodsIDArrSplit = GoodsIDArr.Split('^');
                string[] _SpecPropIDArrSplit = SpecPropIDArr.Split('^');
                string[] _GoodsUnitPriceArrSplit = GoodsUnitPriceArr.Split('^');
                //数组数据类型转换
                long[] _GoodsIDArr = Array.ConvertAll(_GoodsIDArrSplit, long.Parse);
                long[] _SpecPropIDArr = Array.ConvertAll(_SpecPropIDArrSplit, long.Parse);
                decimal[] _GoodsUnitPriceArr = Array.ConvertAll(_GoodsUnitPriceArrSplit, decimal.Parse);

                //得到买家_商品默认使用的优惠券信息_多商品订单 ---API调用方法
                string _jsonBack = BusiCoupons.getBuyerDefaultUseCouponsMsgMulOrderApi(Convert.ToInt64(BuyerUserID), _GoodsIDArr, Convert.ToDecimal(ExpenseReachSum), _SpecPropIDArr, _GoodsUnitPriceArr);
                return _jsonBack;

            }
            else if (_exeType == "9") //数据搜索分页-视图-Wap端
            {
                // 获取传递的参数
                string IsUsed = PublicClass.FilterRequestTrim("IsUsed");
                string IsOverTime = PublicClass.FilterRequestTrim("IsOverTime");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //------------用实体类去限制的查询条件 AND 连接 视图------------//
                ModelV_CouponsIssueMsg_CouponsMsg _modelV_CouponsIssueMsg_CouponsMsg = ModelV_CouponsIssueMsg_CouponsMsg.initModelView();

                _modelV_CouponsIssueMsg_CouponsMsg.ModelCouponsIssueMsg.BuyerUserID = Convert.ToInt64(BuyerUserID);
                _modelV_CouponsIssueMsg_CouponsMsg.ModelCouponsIssueMsg.IsUsed = IsUsed;
                _modelV_CouponsIssueMsg_CouponsMsg.ModelCouponsIssueMsg.IsOverTime = IsOverTime;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder", "IsLock", "BuyerUserID" };
                string _strJson = BusiJsonPageStr.morePageJSONV_CouponsIssueMsg_CouponsMsg(_modelV_CouponsIssueMsg_CouponsMsg, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "wap");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "10") //统计买家各种优惠券信息总数
            {
                // 获取传递的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                string _jsonBack = BusiCoupons.countAllCouponsMsgApi(Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }
            else if (_exeType == "11") //初始化优惠券发放信息 -带优惠券详情，会员信息，订单信息
            {
                //获取传递的参数
                string IssueID = PublicClass.FilterRequestTrim("IssueID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字为空
                IssueID = PublicClass.preventNumberDataIsNull(IssueID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiCoupons.initCouponsIssueDetailViewApi(Convert.ToInt64(IssueID), Convert.ToInt64(ShopUserID));
                return _jsonBack;

            }
            return "";
        }

        /// <summary>
        /// 优惠券线下验证使用
        /// </summary>
        /// <returns></returns>
        public string CouponsVerifyCode()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            // 获取操作类型  Type=1 初始化优惠券线下使用验证码 Type=2 查询验证优惠券信息列表 - 根据验证码
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string IssueID = PublicClass.FilterRequestTrim("IssueID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsReSet = PublicClass.FilterRequestTrim("IsReSet");

                //防止数字类型为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                IssueID = PublicClass.preventNumberDataIsNull(IssueID);

                string _jsonBack = BusiCoupons.initVerifyCodeCouponsApi(Convert.ToInt64(IssueID), Convert.ToInt64(BuyerUserID), Convert.ToInt64(ShopUserID), IsReSet);
                return _jsonBack;
            }
            else if (_exeType == "2") //查询验证优惠券信息列表 - 根据验证码
            {
                // 获取传递的参数
                string VerifyCode = PublicClass.FilterRequestTrim("VerifyCode");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IssueID = PublicClass.FilterRequestTrim("IssueID");

                //防止数字类型为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                IssueID = PublicClass.preventNumberDataIsNull(IssueID);

                string _jsonBack = BusiCoupons.searchCouponsUseVerifyListApi(VerifyCode, Convert.ToInt64(IssueID), Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }



            return "";
        }


    }
}