using BusiApiKeyVerifyNS;
using OctUserGoodsShopSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【商家店铺】相关的API接口控制器
/// </summary>
namespace OctUserGoodsShopSystemWeb.PageControllers.ApiPage
{
    public class ShopController : Controller
    {
        // GET: Shop
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 快递列表
        /// </summary>
        /// <returns></returns>
        public string ShopExpressNameList()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 添加 快递列表信息 Type=3 编辑 快递列表信息 Type=4 删除快递列表信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string ExpressID = PublicClass.FilterRequestTrim("ExpressID");
                string ExpressName = PublicClass.FilterRequestTrim("ExpressName");
                string ExpressDesc = PublicClass.FilterRequestTrim("ExpressDesc");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                ExpressID = PublicClass.preventNumberDataIsNull(ExpressID);


                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelShopExpressNameList _modelShopExpressNameList = new ModelShopExpressNameList();
                _modelShopExpressNameList.ExpressID = Convert.ToInt64(ExpressID);
                _modelShopExpressNameList.ExpressName = ExpressName;
                _modelShopExpressNameList.ExpressDesc = ExpressDesc;
                _modelShopExpressNameList.IsLock = IsLock;
                _modelShopExpressNameList.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONShopExpressNameList(_modelShopExpressNameList, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加 快递列表信息
            {
                // 获取传递的参数
                string ExpressName = PublicClass.FilterRequestTrim("ExpressName");
                string ExpressDesc = PublicClass.FilterRequestTrim("ExpressDesc");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                //添加 快递列表信息
                return BusiShop.addShopExpressNameListApi(ExpressName, ExpressDesc, IsLock);
            }
            else if (_exeType == "3") //编辑 快递列表信息
            {
                // 获取传递的参数
                string ExpressID = PublicClass.FilterRequestTrim("ExpressID");
                string ExpressName = PublicClass.FilterRequestTrim("ExpressName");
                string ExpressDesc = PublicClass.FilterRequestTrim("ExpressDesc");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                //编辑 快递列表信息
                return BusiShop.editShopExpressNameListApi(Convert.ToInt64(ExpressID), ExpressName, ExpressDesc, IsLock);
            }
            else if (_exeType == "4") //删除快递列表信息
            {
                // 获取传递的参数
                string ExpressID = PublicClass.FilterRequestTrim("ExpressID");
                //删除 快递列表信息
                return BusiShop.delShopExpressNameListApi(Convert.ToInt64(ExpressID));
            }
            return "";
        }

        /// <summary>
        /// 运费模板信息
        /// </summary>
        /// <returns></returns>
        public string ShopFreightTemplate()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 添加运费模板信息 Type=3 编辑运费模板信息 Type=4 删除运费模板信息 Type=5 加载所有的运费模板信息 Type=6 锁定/解锁运费模板信息 
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string FtID = PublicClass.FilterRequestTrim("FtID");
                string FtTitle = PublicClass.FilterRequestTrim("FtTitle");
                string FtDesc = PublicClass.FilterRequestTrim("FtDesc");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsDefault = PublicClass.FilterRequestTrim("IsDefault");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string IsDel = PublicClass.FilterRequestTrim("IsDel");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                FtID = PublicClass.preventNumberDataIsNull(FtID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);


                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelShopFreightTemplate _modelShopFreightTemplate = new ModelShopFreightTemplate();
                _modelShopFreightTemplate.FtID = Convert.ToInt64(FtID);
                _modelShopFreightTemplate.FtTitle = FtTitle;
                _modelShopFreightTemplate.FtDesc = FtDesc;
                _modelShopFreightTemplate.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelShopFreightTemplate.IsDefault = IsDefault;
                _modelShopFreightTemplate.IsLock = IsLock;
                _modelShopFreightTemplate.IsDel = IsDel;
                _modelShopFreightTemplate.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONShopFreightTemplate(_modelShopFreightTemplate, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加运费模板信息
            {
                //获取传递的参数
                string FtTitle = PublicClass.FilterRequestTrim("FtTitle");
                string FtDesc = PublicClass.FilterRequestTrim("FtDesc");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsDefault = PublicClass.FilterRequestTrim("IsDefault");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                if (string.IsNullOrWhiteSpace(FtDesc))
                {
                    FtDesc = "-";
                }

                //防止数字为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //添加 运费模板信息
                return BusiShop.addShopFreightTemplateApi(FtTitle, FtDesc, Convert.ToInt64(ShopUserID), IsDefault, IsLock);
            }
            else if (_exeType == "3") //编辑运费模板信息
            {
                // 获取传递的参数
                string FtID = PublicClass.FilterRequestTrim("FtID");
                string FtTitle = PublicClass.FilterRequestTrim("FtTitle");
                string FtDesc = PublicClass.FilterRequestTrim("FtDesc");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsDefault = PublicClass.FilterRequestTrim("IsDefault");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                if (string.IsNullOrWhiteSpace(FtDesc))
                {
                    FtDesc = "-";
                }

                //防止数字为空
                FtID = PublicClass.preventNumberDataIsNull(FtID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //编辑运费模板信息
                return BusiShop.editShopFreightTemplateApi(Convert.ToInt64(FtID), FtTitle, FtDesc, Convert.ToInt64(ShopUserID), IsDefault, IsLock);
            }
            else if (_exeType == "4") //删除运费模板信息
            {
                // 获取传递的参数
                string FtID = PublicClass.FilterRequestTrim("FtID");
                //删除运费模板信息
                return BusiShop.delShopFreightTemplateApi(Convert.ToInt64(FtID));
            }
            else if (_exeType == "5") //加载所有的运费模板信息
            {
                // 获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsExtraJson = PublicClass.FilterRequestTrim("IsExtraJson");
                if (string.IsNullOrWhiteSpace(IsExtraJson))
                {
                    IsExtraJson = "true";
                }

                //加载所有的运费模板信息 返回Json字符串
                string _jsonBack = BusiShop.loadShopFreightTemplateListJsonApi(Convert.ToInt64(ShopUserID), IsExtraJson);
                return _jsonBack;
            }
            else if (_exeType == "6") //锁定/解锁运费模板信息 
            {
                // 获取传递的参数
                string FtID = PublicClass.FilterRequestTrim("FtID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字为空
                FtID = PublicClass.preventNumberDataIsNull(FtID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //锁定/解锁 运费模板信息
                string _jsonBack = BusiShop.lockShopFreightTemplateApi(Convert.ToInt64(FtID), Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 运费模板参数列表设置
        /// </summary>
        /// <returns></returns>
        public string ShopFreightTemplateParamList()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 添加运费模板参数列表 Type=3 编辑运费模板参数列表 Type=4 删除运费模板参数列表 Type=5 保存运费模板参数列表设置 Type=6 初始化运费模板参数列表
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string FtPlID = PublicClass.FilterRequestTrim("FtPlID");
                string FtID = PublicClass.FilterRequestTrim("FtID");
                string RegionProCode = PublicClass.FilterRequestTrim("RegionProCode");
                string RegionCityCode = PublicClass.FilterRequestTrim("RegionCityCode");
                string RegionCountryCode = PublicClass.FilterRequestTrim("RegionCountryCode");
                string RegionProName = PublicClass.FilterRequestTrim("RegionProName");
                string RegionCityName = PublicClass.FilterRequestTrim("RegionCityName");
                string RegionCountryName = PublicClass.FilterRequestTrim("RegionCountryName");
                string ExpressNumberArr = PublicClass.FilterRequestTrim("ExpressNumberArr");
                string FreightMoney = PublicClass.FilterRequestTrim("FreightMoney");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string IsDel = PublicClass.FilterRequestTrim("IsDel");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                FtPlID = PublicClass.preventNumberDataIsNull(FtPlID);
                FtID = PublicClass.preventNumberDataIsNull(FtID);
                FreightMoney = PublicClass.preventDecimalDataIsNull(FreightMoney);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);


                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelShopFreightTemplateParamList _modelShopFreightTemplateParamList = new ModelShopFreightTemplateParamList();
                _modelShopFreightTemplateParamList.FtPlID = Convert.ToInt64(FtPlID);
                _modelShopFreightTemplateParamList.FtID = Convert.ToInt64(FtID);
                _modelShopFreightTemplateParamList.RegionProCode = RegionProCode;
                _modelShopFreightTemplateParamList.RegionCityCode = RegionCityCode;
                _modelShopFreightTemplateParamList.RegionCountryCode = RegionCountryCode;
                _modelShopFreightTemplateParamList.RegionProName = RegionProName;
                _modelShopFreightTemplateParamList.RegionCityName = RegionCityName;
                _modelShopFreightTemplateParamList.RegionCountryName = RegionCountryName;
                _modelShopFreightTemplateParamList.ExpressNumberArr = ExpressNumberArr;
                _modelShopFreightTemplateParamList.FreightMoney = Convert.ToDecimal(FreightMoney);
                _modelShopFreightTemplateParamList.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelShopFreightTemplateParamList.IsLock = IsLock;
                _modelShopFreightTemplateParamList.IsDel = IsDel;
                _modelShopFreightTemplateParamList.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONShopFreightTemplateParamList(_modelShopFreightTemplateParamList, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加运费模板参数列表
            {
                // 获取传递的参数
                string FtID = PublicClass.FilterRequestTrim("FtID");
                string RegionProCode = PublicClass.FilterRequestTrim("RegionProCode");
                string RegionCityCode = PublicClass.FilterRequestTrim("RegionCityCode");
                string RegionCountryCode = PublicClass.FilterRequestTrim("RegionCountryCode");
                string RegionProName = PublicClass.FilterRequestTrim("RegionProName");
                string RegionCityName = PublicClass.FilterRequestTrim("RegionCityName");
                string RegionCountryName = PublicClass.FilterRequestTrim("RegionCountryName");
                string ExpressNumberArr = PublicClass.FilterRequestTrim("ExpressNumberArr");
                string FreightMoney = PublicClass.FilterRequestTrim("FreightMoney");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                //添加 运费模板参数列表
                return BusiShop.addShopFreightTemplateParamListApi(Convert.ToInt64(FtID), RegionProCode, RegionCityCode, RegionCountryCode, RegionProName, RegionCityName, RegionCountryName, ExpressNumberArr, Convert.ToDecimal(FreightMoney), Convert.ToInt64(ShopUserID));
            }
            else if (_exeType == "3") //编辑运费模板参数列表
            {
                // 获取传递的参数
                string FtPlID = PublicClass.FilterRequestTrim("FtPlID");
                string FtID = PublicClass.FilterRequestTrim("FtID");
                string RegionProCode = PublicClass.FilterRequestTrim("RegionProCode");
                string RegionCityCode = PublicClass.FilterRequestTrim("RegionCityCode");
                string RegionCountryCode = PublicClass.FilterRequestTrim("RegionCountryCode");
                string RegionProName = PublicClass.FilterRequestTrim("RegionProName");
                string RegionCityName = PublicClass.FilterRequestTrim("RegionCityName");
                string RegionCountryName = PublicClass.FilterRequestTrim("RegionCountryName");
                string ExpressNumberArr = PublicClass.FilterRequestTrim("ExpressNumberArr");
                string FreightMoney = PublicClass.FilterRequestTrim("FreightMoney");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                //编辑运费模板参数列表
                return BusiShop.editShopFreightTemplateParamListApi(Convert.ToInt64(FtPlID), Convert.ToInt64(FtID), RegionProCode, RegionCityCode, RegionCountryCode, RegionProName, RegionCityName, RegionCountryName, ExpressNumberArr, Convert.ToDecimal(FreightMoney), Convert.ToInt64(ShopUserID), IsLock);
            }
            else if (_exeType == "4") //删除运费模板参数列表
            {
                // 获取传递的参数
                string FtPlID = PublicClass.FilterRequestTrim("FtPlID");
                //删除运费模板参数列表
                return BusiShop.delShopFreightTemplateParamListApi(Convert.ToInt64(FtPlID));
            }
            else if (_exeType == "5") //保存运费模板参数列表设置
            {
                // 获取传递的参数
                string FtID = PublicClass.FilterRequestTrim("FtID");
                string AllSelRegionArr = PublicClass.FilterRequestTrim("AllSelRegionArr");
                string AllFreightOneArr = PublicClass.FilterRequestTrim("AllFreightOneArr");
                string AllFreightAddValArr = PublicClass.FilterRequestTrim("AllFreightAddValArr");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                //防止数字为空
                FtID = PublicClass.preventNumberDataIsNull(FtID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //保存运费模板参数列表设置 ---API调用方法
                string _jsonBack = BusiShop.saveFreightTemplateParamListApi(Convert.ToInt64(FtID), AllSelRegionArr, AllFreightOneArr, AllFreightAddValArr, Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "6") //初始化运费模板参数列表
            {
                // 获取传递的参数
                string FtID = PublicClass.FilterRequestTrim("FtID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                //防止数字为空
                FtID = PublicClass.preventNumberDataIsNull(FtID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //初始化运费模板参数列表信息 返回Json字符串 ---API调用方法
                string _jsonBack = BusiShop.initFreightTemplateParamListApi(Convert.ToInt64(FtID), Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 店铺商品类别
        /// </summary>
        /// <returns></returns>
        public string ShopGoodsType()
        {
            //获取操作类型  Type=1 搜索分页数据 Type=2 添加店铺商品类别 Type=3 编辑店铺商品类别 Type=4 删除店铺商品类别 Type=5 加载店铺商品类别指定FatherTypeID列表 Type=6 加载店铺商品类别父级和子级列表 Type=7 初始化店铺商品分类信息ShopGoodsTypeID  Type=8 锁定与解锁
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "6") //加载店铺商品类别父级和子级列表
            {
                // 获取传递的参数
                //ShopUserID和ShopID必须有一个不为空
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string ShopID = PublicClass.FilterRequestTrim("ShopID");

                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //防止数字类型为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                ShopID = PublicClass.preventNumberDataIsNull(ShopID);

                if (ShopUserID == "0")
                {
                    ShopUserID = BusiShop.getShopUserID(Convert.ToInt64(ShopID)).ToString();
                }

                //加载店铺商品类别列表(包含父级和子级类别)  返回Json字符
                string _json = BusiShop.loadShopGoodsTypeListApi(Convert.ToInt64(ShopUserID), IsLock);
                return _json;
            }
            else if (_exeType == "7") //初始化店铺商品分类信息ShopGoodsTypeID
            {
                //获取传递的参数
                string ShopGoodsTypeID = PublicClass.FilterRequestTrim("ShopGoodsTypeID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                ModelShopGoodsType _modelShopGoodsType = BusiGetData.getModelShopGoodsType(Convert.ToInt64(ShopGoodsTypeID), IsLock);
                //构造Json
                string _jsonBack = BusiJsonBuilder.jsonModel(_modelShopGoodsType, true, new string[] { "WriteDate", "PageOrder" });
                return _jsonBack;
            }

            //-----验证RndKeyRsa是否正确------//
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }


            if (_exeType == "1")
            {
                // 获取传递的参数
                string ShopGoodsTypeID = PublicClass.FilterRequestTrim("ShopGoodsTypeID");
                string ShopGoodsTypeName = PublicClass.FilterRequestTrim("ShopGoodsTypeName");
                string FatherTypeID = PublicClass.FilterRequestTrim("FatherTypeID");
                string TypeMemo = PublicClass.FilterRequestTrim("TypeMemo");
                string SortNum = PublicClass.FilterRequestTrim("SortNum");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                //string IsEntity = PublicClass.FilterRequestTrim("IsEntity");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                ShopGoodsTypeID = PublicClass.preventNumberDataIsNull(ShopGoodsTypeID);
                FatherTypeID = PublicClass.preventNumberDataIsNull(FatherTypeID);
                ShopUserID = PublicClass.preventDecimalDataIsNull(ShopUserID);


                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelShopGoodsType _modelShopGoodsType = new ModelShopGoodsType();
                _modelShopGoodsType.ShopGoodsTypeID = Convert.ToInt64(ShopGoodsTypeID);
                _modelShopGoodsType.ShopGoodsTypeName = ShopGoodsTypeName;
                _modelShopGoodsType.FatherTypeID = Convert.ToInt64(FatherTypeID);
                _modelShopGoodsType.TypeMemo = TypeMemo;
                _modelShopGoodsType.SortNum = Convert.ToInt32(SortNum);
                _modelShopGoodsType.ShopUserID = Convert.ToInt64(ShopUserID);
                //_modelShopGoodsType.IsEntity = IsEntity;
                _modelShopGoodsType.IsLock = IsLock;
                _modelShopGoodsType.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";


                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONShopGoodsType(_modelShopGoodsType, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加店铺商品类别
            {
                // 获取传递的参数
                string ShopGoodsTypeName = PublicClass.FilterRequestTrim("ShopGoodsTypeName");
                string FatherTypeID = PublicClass.FilterRequestTrim("FatherTypeID");
                string TypeMemo = PublicClass.FilterRequestTrim("TypeMemo");
                string SortNum = PublicClass.FilterRequestTrim("SortNum");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                //添加 店铺商品类别
                return BusiShop.addShopGoodsTypeApi(ShopGoodsTypeName, Convert.ToInt64(FatherTypeID), TypeMemo, Convert.ToInt32(SortNum), Convert.ToInt64(ShopUserID));
            }
            else if (_exeType == "3") //编辑店铺商品类别
            {
                // 获取传递的参数
                string ShopGoodsTypeID = PublicClass.FilterRequestTrim("ShopGoodsTypeID");
                string ShopGoodsTypeName = PublicClass.FilterRequestTrim("ShopGoodsTypeName");
                string FatherTypeID = PublicClass.FilterRequestTrim("FatherTypeID");
                string TypeMemo = PublicClass.FilterRequestTrim("TypeMemo");
                string SortNum = PublicClass.FilterRequestTrim("SortNum");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                //编辑店铺商品类别
                return BusiShop.editShopGoodsTypeApi(Convert.ToInt64(ShopGoodsTypeID), ShopGoodsTypeName, Convert.ToInt64(FatherTypeID), TypeMemo, Convert.ToInt32(SortNum), Convert.ToInt64(ShopUserID), IsLock);
            }
            else if (_exeType == "4") //删除店铺商品类别
            {
                // 获取传递的参数
                string ShopGoodsTypeID = PublicClass.FilterRequestTrim("ShopGoodsTypeID");
                return BusiShop.delShopGoodsTypeApi(Convert.ToInt64(ShopGoodsTypeID));
            }
            else if (_exeType == "5") //加载店铺商品类别子级列表
            {
                // 获取传递的参数
                //父级ID FatherTypeID 为0时，为加载顶级类别
                string FatherTypeID = PublicClass.FilterRequestTrim("FatherTypeID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //防止数字类型为空
                FatherTypeID = PublicClass.preventNumberDataIsNull(FatherTypeID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //得到店铺商品类别子级列表
                List<ModelShopGoodsType> _listModelShopGoodsType = BusiGetData.getListModelShopGoodsTypeSub(Convert.ToInt64(FatherTypeID), IsLock, Convert.ToInt64(ShopUserID));
                //Model转换Json
                return BusiJsonBuilder.jsonListModel(_listModelShopGoodsType.OfType<object>().ToList(), "ShopGoodsTypeSubList", true, new string[] { "ShopGoodsTypeID", "ShopGoodsTypeName" }, false);
            }
            else if (_exeType == "8") //锁定与解锁
            {
                //获取传递的参数
                string ShopGoodsTypeID = PublicClass.FilterRequestTrim("ShopGoodsTypeID");

                //锁定/解锁 店铺商品类别 --API调用方法
                string _jsonBack = BusiShop.lockShopGoodsTypeApi(Convert.ToInt64(ShopGoodsTypeID));
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 店铺信息
        /// </summary>
        /// <returns></returns>
        public string ShopMsg()
        {
            //获取操作类型  Type=1 搜索分页数据 Type=2 添加 店铺信息 Type=3 编辑 店铺信息 Type=4 开关审核 店铺信息 Type=5 初始化买家信息 Type=6 初始化公司信息 Type=7 保存店铺头像信息 Type=8 保存店铺门头Logo信息 Type=9 初始化店铺信息 Type=10 显隐店铺信息 Type=11 锁定/解锁店铺信息 Type=12 保存店铺信息(商家后台) Type=13 加载店铺地址坐标相关信息 Type=14 加载店铺条相关信息(前端)如:商品详情页的店铺信息 Type=15 加载店铺的各项评分 Type=16 判断是否为 线下实体店 Type=17 初始化 店铺信息条，店铺首页顶部条信息 Type=18 加载店铺详细信息 ,店铺信息详细页 Type=19 加载店铺简单信息 Type=20 初始化店铺状态信息 
            string _exeType = PublicClass.FilterRequestTrim("Type");

            //加载店铺地址坐标相关信息
            if (_exeType == "13")
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                //买家UserID 计算店铺与当前买家的距离
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                //防止数字类型为空
                ShopID = PublicClass.preventNumberDataIsNull(ShopID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);


                //初始化店铺的地址和位置信息，店铺电话
                string _jsonBack = BusiShop.initShopAddrLocationTelApi(Convert.ToInt64(ShopID), Convert.ToInt64(BuyerUserID));
                return _jsonBack;

            }
            else if (_exeType == "14") //加载店铺条相关信息
            {
                // 获取传递的参数
                //ShopID 和 ShopUserID 必须有一个不为空
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //是否加载店铺商品的预览列表 [ true / false ]
                string IsLoadGoods = PublicClass.FilterRequestTrim("IsLoadGoods"); //可选


                //防止数字类型为空
                ShopID = PublicClass.preventNumberDataIsNull(ShopID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiShop.loadShopBarMsgApi(Convert.ToInt64(ShopID), Convert.ToInt64(ShopUserID), IsLoadGoods);
                return _jsonBack;
            }
            else if (_exeType == "15") //加载店铺的各项评分
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");

                //防止数字类型为空
                ShopID = PublicClass.preventNumberDataIsNull(ShopID);

                string _jsonBack = BusiShop.loadShopAllItemAppScoreApi(Convert.ToInt64(ShopID));
                return _jsonBack;
            }
            else if (_exeType == "16") //判断是否为 线下实体店
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字类型为空
                ShopID = PublicClass.preventNumberDataIsNull(ShopID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiShop.isEntityShopApi(Convert.ToInt64(ShopID), Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "17") //初始化 店铺信息条，店铺首页顶部条信息
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");

                //防止数字类型为空
                ShopID = PublicClass.preventNumberDataIsNull(ShopID);

                string _jsonBack = BusiShop.initShopMsgTopBarItemApi(Convert.ToInt64(ShopID));
                return _jsonBack;
            }
            else if (_exeType == "18") //加载店铺详细信息 ,店铺信息详细页
            {
                // 获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string ShopID = PublicClass.FilterRequestTrim("ShopID");

                //防止数字类型为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                ShopID = PublicClass.preventNumberDataIsNull(ShopID);

                string _jsonBack = BusiShop.loadShopDetailMsgApi(Convert.ToInt64(ShopID), Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "19") //加载店铺简单信息
            {
                // 获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                string IsMaskMobile = PublicClass.FilterRequestTrim("IsMaskMobile");

                if (string.IsNullOrWhiteSpace(IsMaskMobile))
                {
                    IsMaskMobile = "true";
                }

                //防止数字类型为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                ShopID = PublicClass.preventNumberDataIsNull(ShopID);

                string _jsonBack = BusiShop.loadShopMsgSimpleApi(Convert.ToInt64(ShopUserID), Convert.ToInt64(ShopID), IsMaskMobile);
                return _jsonBack;
            }
            else if (_exeType == "20") //初始化店铺状态信息 
            {
                // 获取传递的参数  pShopID和pShopUserID必须有一个不为空 --API方法
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string ShopID = PublicClass.FilterRequestTrim("ShopID");

                //防止数字类型为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                ShopID = PublicClass.preventNumberDataIsNull(ShopID);

                string _jsonBack = BusiShop.initShopStatusMsgApi(Convert.ToInt64(ShopID), Convert.ToInt64(ShopUserID));
                return _jsonBack;

            }


            //-----------需要签名验证的Http请求---------------//

            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }


            //----需要签名验证的Http请求-----//
            if (_exeType == "1")
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string ShopTypeID = PublicClass.FilterRequestTrim("ShopTypeID");
                string ShopName = PublicClass.FilterRequestTrim("ShopName");
                string CompanyID = PublicClass.FilterRequestTrim("CompanyID");
                string ShopLogoImg = PublicClass.FilterRequestTrimNoConvert("ShopLogoImg");
                string ShopHeaderImg = PublicClass.FilterRequestTrimNoConvert("ShopHeaderImg");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");
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
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                ShopID = PublicClass.preventNumberDataIsNull(ShopID);
                UserID = PublicClass.preventNumberDataIsNull(UserID);
                ShopTypeID = PublicClass.preventDecimalDataIsNull(ShopTypeID);
                CompanyID = PublicClass.preventNumberDataIsNull(CompanyID);



                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelShopMsg _modelShopMsg = new ModelShopMsg();
                _modelShopMsg.ShopID = Convert.ToInt64(ShopID);
                _modelShopMsg.UserID = Convert.ToInt64(UserID);
                _modelShopMsg.ShopTypeID = Convert.ToInt64(ShopTypeID);
                _modelShopMsg.ShopName = ShopName;
                _modelShopMsg.CompanyID = Convert.ToInt64(CompanyID);
                _modelShopMsg.ShopLogoImg = ShopLogoImg;
                _modelShopMsg.ShopHeaderImg = ShopHeaderImg;
                _modelShopMsg.UploadGuid = UploadGuid;
                _modelShopMsg.ShopFixTel = ShopFixTel;
                _modelShopMsg.ShopMobile = ShopMobile;
                _modelShopMsg.SendMobile = SendMobile;
                _modelShopMsg.LinkMan = LinkMan;
                _modelShopMsg.LinkManMobile = LinkManMobile;
                _modelShopMsg.LinkEmail = LinkEmail;
                _modelShopMsg.RegionCodeArr = RegionCodeArr;
                _modelShopMsg.RegionNameArr = RegionNameArr;
                _modelShopMsg.DetailAddr = DetailAddr;
                _modelShopMsg.SearchKey = SearchKey;
                _modelShopMsg.MajorGoods = MajorGoods;
                _modelShopMsg.ShopDesc = ShopDesc;
                _modelShopMsg.IsShow = IsShow;
                _modelShopMsg.IsCheck = IsCheck;
                _modelShopMsg.CheckReason = CheckReason;
                _modelShopMsg.IsLock = IsLock;
                _modelShopMsg.RegDate = RegDate;
                _modelShopMsg.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONShopMsg(_modelShopMsg, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加 店铺信息
            {
                // 获取传递的参数
                string UserAccount = PublicClass.FilterRequestTrim("UserAccount");

                string UserID = PublicClass.FilterRequestTrim("UserID");
                string ShopTypeID = PublicClass.FilterRequestTrim("ShopTypeID");
                string ShopName = PublicClass.FilterRequestTrim("ShopName");
                string ShopLabelArr = PublicClass.FilterRequestTrimNoConvert("ShopLabelArr");
                string CompanyID = PublicClass.FilterRequestTrim("CompanyID");
                string ShopLogoImg = PublicClass.FilterRequestTrim("ShopLogoImg");
                string ShopHeaderImg = PublicClass.FilterRequestTrim("ShopHeaderImg");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");
                string ShopFixTel = PublicClass.FilterRequestTrim("ShopFixTel");
                string ShopMobile = PublicClass.FilterRequestTrim("ShopMobile");
                string SendMobile = PublicClass.FilterRequestTrim("SendMobile");
                string LinkMan = PublicClass.FilterRequestTrim("LinkMan");
                string LinkManMobile = PublicClass.FilterRequestTrim("LinkManMobile");
                string LinkEmail = PublicClass.FilterRequestTrimNoConvert("LinkEmail");
                string RegionCodeArr = PublicClass.FilterRequestTrim("RegionCodeArr");
                string DetailAddr = PublicClass.FilterRequestTrim("DetailAddr");
                string SearchKey = PublicClass.FilterRequestTrim("SearchKey");
                string MajorGoods = PublicClass.FilterRequestTrim("MajorGoods");
                string ShopDesc = PublicClass.FilterRequestTrim("ShopDesc");

                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");
                string Latitude = PublicClass.FilterRequestTrim("Latitude");
                string Longitude = PublicClass.FilterRequestTrim("Longitude");

                string IsSelfShop = PublicClass.FilterRequestTrim("IsSelfShop");

                //防止数字类型为空
                UserID = PublicClass.preventDecimalDataIsNull(UserID);
                ShopTypeID = PublicClass.preventDecimalDataIsNull(ShopTypeID);
                CompanyID = PublicClass.preventDecimalDataIsNull(CompanyID);

                //添加 店铺信息
                return BusiShop.addShopMsgApi(Convert.ToInt64(UserID), Convert.ToInt64(CompanyID), Convert.ToInt64(ShopTypeID), ShopName, ShopLogoImg, ShopHeaderImg, UploadGuid, ShopFixTel, ShopMobile, SendMobile, LinkMan, LinkManMobile, LinkEmail, RegionCodeArr, DetailAddr, SearchKey, MajorGoods, ShopDesc, UserAccount, IsEntity, Latitude, Longitude, IsSelfShop,ShopLabelArr);
            }
            else if (_exeType == "3") //编辑 店铺信息
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                string UserAccount = PublicClass.FilterRequestTrim("UserAccount");

                string ShopTypeID = PublicClass.FilterRequestTrim("ShopTypeID");
                string ShopName = PublicClass.FilterRequestTrim("ShopName");
                string ShopLabelArr = PublicClass.FilterRequestTrimNoConvert("ShopLabelArr");

                string CompanyID = PublicClass.FilterRequestTrim("CompanyID");
                string ShopLogoImg = PublicClass.FilterRequestTrim("ShopLogoImg");
                string ShopHeaderImg = PublicClass.FilterRequestTrim("ShopHeaderImg");
                string ShopFixTel = PublicClass.FilterRequestTrim("ShopFixTel");
                string ShopMobile = PublicClass.FilterRequestTrim("ShopMobile");
                string SendMobile = PublicClass.FilterRequestTrim("SendMobile");
                string LinkMan = PublicClass.FilterRequestTrim("LinkMan");
                string LinkManMobile = PublicClass.FilterRequestTrim("LinkManMobile");
                string LinkEmail = PublicClass.FilterRequestTrimNoConvert("LinkEmail");
                string RegionCodeArr = PublicClass.FilterRequestTrim("RegionCodeArr");
                //string RegionNameArr = PublicClass.FilterRequestTrim("RegionNameArr");
                string DetailAddr = PublicClass.FilterRequestTrim("DetailAddr");
                string SearchKey = PublicClass.FilterRequestTrim("SearchKey");
                string MajorGoods = PublicClass.FilterRequestTrim("MajorGoods");
                string ShopDesc = PublicClass.FilterRequestTrim("ShopDesc");
                string IsShow = PublicClass.FilterRequestTrim("IsShow");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");
                string Latitude = PublicClass.FilterRequestTrim("Latitude");
                string Longitude = PublicClass.FilterRequestTrim("Longitude");

                string IsSelfShop = PublicClass.FilterRequestTrim("IsSelfShop");

                //防止数字类型为空
                ShopID = PublicClass.preventDecimalDataIsNull(ShopID);
                ShopTypeID = PublicClass.preventDecimalDataIsNull(ShopTypeID);
                CompanyID = PublicClass.preventDecimalDataIsNull(CompanyID);

                //编辑 店铺信息
                return BusiShop.editShopMsgApi(Convert.ToInt64(ShopID), 0, Convert.ToInt64(CompanyID), Convert.ToInt64(ShopTypeID), ShopName, ShopLogoImg, ShopHeaderImg, "", ShopFixTel, ShopMobile, SendMobile, LinkMan, LinkManMobile, LinkEmail, RegionCodeArr, DetailAddr, SearchKey, MajorGoods, ShopDesc, UserAccount, "true", "false", IsEntity, Latitude, Longitude, IsSelfShop, ShopLabelArr);
            }
            else if (_exeType == "4") //开关审核 店铺信息
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                string IsCheck = PublicClass.FilterRequestTrim("IsCheck");
                string CheckReason = PublicClass.FilterRequestTrim("CheckReason");
                //开关审核 店铺信息
                return BusiShop.checkShopMsgApi(Convert.ToInt64(ShopID), IsCheck, CheckReason);
            }
            else if (_exeType == "5") //初始化买家信息
            {
                // 获取传递的参数
                string UserAccount = PublicClass.FilterRequestTrim("UserAccount");
                string IsAdd = PublicClass.FilterRequestTrim("IsAdd"); //是否为添加操作 true,false
                string IsAddCompany = PublicClass.FilterRequestTrim("IsAddCompany");//是否为添加公司操作 true,false

                //得到UserID
                long _userID = BusiUser.getUserID(UserAccount);

                if (IsAdd.ToLower() == "true")
                {
                    if (IsAddCompany == "true")
                    {
                        //判断账号是否有公司信息
                        bool _existComSu = BusiCompany.existCompanyMsgByShopUserID(_userID);
                        if (_existComSu)
                        {
                            return "54"; //账号已存在公司信息,不能重复添加
                        }
                    }
                    else
                    {
                        //判断此UserID是否已存在店铺
                        bool _existSu = BusiShop.existShopMsgByUserID(_userID);
                        if (_existSu)
                        {
                            return "52"; //已存在店铺此账号不能添加
                        }
                    }
                }

                //得到买家信息
                ModelBuyerMsg _modelBuyerMsg = BusiSqlData.searchBuyerMsg("UserID=" + _userID);
                //Model转换成Json字符串
                return BusiJsonBuilder.jsonModel(_modelBuyerMsg, true, new string[] { "UserNick", "HeaderImg", "UserID" }, false);
            }
            else if (_exeType == "6") //初始化公司信息
            {
                // 获取传递的参数
                string CompanyID = PublicClass.FilterRequestTrim("CompanyID");
                //得到公司信息
                ModelCompanyMsg _modelCompanyMsg = BusiGetData.getModelCompanyMsg(Convert.ToInt64(CompanyID));
                //Model转换成Json字符串
                return BusiJsonBuilder.jsonModel(_modelCompanyMsg, true, new string[] { "CompanyName", "RegAddress" }, false);
            }
            else if (_exeType == "7") //保存店铺头像信息
            {
                // 获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string ShopHeaderImg = PublicClass.FilterRequestTrimNoConvert("ShopHeaderImg");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //更改店铺头像信息 -- API调用方法
                return BusiShop.chgShopHeaderImgApi(Convert.ToInt64(UserID), ShopHeaderImg, UploadGuid);
            }
            else if (_exeType == "8") //保存店铺门头Logo信息
            {
                // 获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string ShopLogoImg = PublicClass.FilterRequestTrimNoConvert("ShopLogoImg");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //更改店铺头像信息 -- API调用方法
                return BusiShop.submitShopLogoImgApi(Convert.ToInt64(UserID), ShopLogoImg, UploadGuid);
            }
            else if (_exeType == "9") //初始化店铺信息
            {
                // 获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string ShopID = PublicClass.FilterRequestTrim("ShopID");

                //防止数字类型为空
                UserID = PublicClass.preventNumberDataIsNull(UserID);
                ShopID = PublicClass.preventNumberDataIsNull(ShopID);

                if (string.IsNullOrWhiteSpace(ShopID) || ShopID == "0")
                {
                    //得到店铺ID
                    ShopID = BusiShop.getShopID(Convert.ToInt64(UserID)).ToString();
                }

                //初始化店铺相关信息 包括公司信息和买家信息,店铺ID和用户UserID 一个为0一个不为0
                string _jsonBack = BusiShop.initShopMsgApi(Convert.ToInt64(ShopID), Convert.ToInt64(UserID));
                //转换成功Json字符串
                return _jsonBack;
            }
            else if (_exeType == "10") //显隐店铺信息
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                //显示/隐藏 店铺信息
                return BusiShop.showShopMsgApi(Convert.ToInt64(ShopID));
            }
            else if (_exeType == "11") //锁定/解锁店铺信息 
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                //锁定/解锁店铺信息 
                return BusiShop.lockShopMsgApi(Convert.ToInt64(ShopID));
            }
            else if (_exeType == "12") //保存店铺信息(商家后台)
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                string UserAccount = PublicClass.FilterRequestTrim("UserAccount");
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string ShopTypeID = PublicClass.FilterRequestTrim("ShopTypeID");
                string ShopName = PublicClass.FilterRequestTrim("ShopName");
                string CompanyID = PublicClass.FilterRequestTrim("CompanyID");
                string ShopLogoImg = PublicClass.FilterRequestTrim("ShopLogoImg");
                string ShopHeaderImg = PublicClass.FilterRequestTrim("ShopHeaderImg");
                string ShopFixTel = PublicClass.FilterRequestTrim("ShopFixTel");
                string ShopMobile = PublicClass.FilterRequestTrim("ShopMobile");
                string SendMobile = PublicClass.FilterRequestTrim("SendMobile");
                string LinkMan = PublicClass.FilterRequestTrim("LinkMan");
                string LinkManMobile = PublicClass.FilterRequestTrim("LinkManMobile");
                string LinkEmail = PublicClass.FilterRequestTrimNoConvert("LinkEmail");
                string RegionCodeArr = PublicClass.FilterRequestTrim("RegionCodeArr");
                //string RegionNameArr = PublicClass.FilterRequestTrim("RegionNameArr");
                string DetailAddr = PublicClass.FilterRequestTrim("DetailAddr");
                string SearchKey = PublicClass.FilterRequestTrim("SearchKey");
                string MajorGoods = PublicClass.FilterRequestTrim("MajorGoods");
                string ShopDesc = PublicClass.FilterRequestTrim("ShopDesc");

                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");
                string Latitude = PublicClass.FilterRequestTrim("Latitude");
                string Longitude = PublicClass.FilterRequestTrim("Longitude");

                string IsSelfShop = PublicClass.FilterRequestTrim("IsSelfShop");

                //防止数字类型为空
                ShopID = PublicClass.preventDecimalDataIsNull(ShopID);
                UserID = PublicClass.preventDecimalDataIsNull(UserID);
                ShopTypeID = PublicClass.preventDecimalDataIsNull(ShopTypeID);
                CompanyID = PublicClass.preventDecimalDataIsNull(CompanyID);

                //保存店铺信息(商家后台)
                return BusiShop.saveShopMsgApi(Convert.ToInt64(ShopID), Convert.ToInt64(UserID), Convert.ToInt64(CompanyID), Convert.ToInt64(ShopTypeID), ShopName, ShopLogoImg, ShopHeaderImg, "", ShopFixTel, ShopMobile, SendMobile, LinkMan, LinkManMobile, LinkEmail, RegionCodeArr, DetailAddr, SearchKey, MajorGoods, ShopDesc, UserAccount, IsEntity, Latitude, Longitude, IsSelfShop);
            }
            return "";
        }

        /// <summary>
        /// 店铺Logo门头图片
        /// </summary>
        /// <returns></returns>
        public string ShopLogoImg()
        {

            //获取操作类型  Type=1 搜索分页数据 Type=2 删除图片 Type=3 加载店铺Logo门头照片
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "3") //加载店铺Logo门头照片
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");

                //防止数字类型为空
                ShopID = PublicClass.preventNumberDataIsNull(ShopID);

                string _jsonBack = BusiShop.loadShopLogoImgApi(Convert.ToInt64(ShopID));
                return _jsonBack;
            }

            //-----验证RndKeyRsa是否正确-----//
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            if (_exeType == "1")
            {

            }
            else if (_exeType == "2") //删除图片
            {
                //获取传递过来的参数
                string UploadGuidArr = PublicClass.FilterRequestTrim("UploadGuidArr");

                //删除 店铺Logo门头照片
                return BusiShop.delShopLogoImgArrApi(UploadGuidArr);
            }

            return "";
        }

        /// <summary>
        /// 店铺类别
        /// </summary>
        /// <returns></returns>
        public string ShopType()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 添加店铺类别 Type=3 编辑店铺类别 Type=4 删除 单个或批量 店铺类别 Type=5 加载父级店铺类别 Type=6 初始化店铺类别信息 Type= 7 保存上传店铺类目图片信息
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


                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                ShopTypeID = PublicClass.preventNumberDataIsNull(ShopTypeID);
                FatherTypeID = PublicClass.preventNumberDataIsNull(FatherTypeID);
                SortNum = PublicClass.preventNumberDataIsNull(SortNum);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelShopType _modelShopType = new ModelShopType();
                _modelShopType.ShopTypeID = Convert.ToInt64(ShopTypeID);
                _modelShopType.ShopTypeName = ShopTypeName;
                _modelShopType.FatherTypeID = Convert.ToInt64(FatherTypeID);
                _modelShopType.ShopTypeMemo = ShopTypeMemo;
                _modelShopType.SortNum = Convert.ToInt32(SortNum);
                _modelShopType.IsEntity = IsEntity;
                _modelShopType.IsLock = IsLock;
                _modelShopType.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONShopType(_modelShopType, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms", "SortNum DESC,PageOrder DESC");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加店铺类别
            {
                // 获取传递的参数
                string ShopTypeName = PublicClass.FilterRequestTrim("ShopTypeName");
                string FatherTypeID = PublicClass.FilterRequestTrim("FatherTypeID");
                string ShopTypeMemo = PublicClass.FilterRequestTrim("ShopTypeMemo");
                string SortNum = PublicClass.FilterRequestTrim("SortNum");
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                string TypeIcon = PublicClass.FilterRequestTrim("TypeIcon");
                string ImgKeyGuid = PublicClass.FilterRequestTrim("ImgKeyGuid");

                FatherTypeID = PublicClass.preventNumberDataIsNull(FatherTypeID);
                SortNum = PublicClass.preventNumberDataIsNull(SortNum);

                //添加 店铺类别
                return BusiShop.addShopTypeApi(ShopTypeName, Convert.ToInt64(FatherTypeID), ShopTypeMemo, Convert.ToInt32(SortNum), IsLock, IsEntity, TypeIcon, ImgKeyGuid);
            }
            else if (_exeType == "3") //编辑店铺类别
            {
                // 获取传递的参数
                string ShopTypeID = PublicClass.FilterRequestTrim("ShopTypeID");
                string ShopTypeName = PublicClass.FilterRequestTrim("ShopTypeName");
                string FatherTypeID = PublicClass.FilterRequestTrim("FatherTypeID");
                string ShopTypeMemo = PublicClass.FilterRequestTrim("ShopTypeMemo");
                string SortNum = PublicClass.FilterRequestTrim("SortNum");
                string IsEntity = PublicClass.FilterRequestTrim("IsEntity");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                //编辑店铺类别
                return BusiShop.editShopTypeApi(Convert.ToInt64(ShopTypeID), ShopTypeName, Convert.ToInt64(FatherTypeID), ShopTypeMemo, Convert.ToInt32(SortNum), IsLock, IsEntity);
            }
            else if (_exeType == "4") //删除 单个或批量 店铺类别
            {
                // 获取传递的参数
                //店铺类别ID拼接字符串 用“^”隔开
                string ShopTypeIDArr = PublicClass.FilterRequestTrim("ShopTypeIDArr");
                //删除 店铺类别
                return BusiShop.delShopTypeArrApi(ShopTypeIDArr);
            }
            else if (_exeType == "5") //加载父级店铺类别
            {
                string FatherShopTypeID = PublicClass.FilterRequestTrim("FatherShopTypeID");
                //防止数字类型为空
                FatherShopTypeID = PublicClass.preventNumberDataIsNull(FatherShopTypeID);

                //得到商品类目的子类目列表
                List<ModelShopType> _listModelShopType = BusiGetData.getListModelShopTypeFather(Convert.ToInt64(FatherShopTypeID));
                //构造Json字符串
                string _backJson = BusiJsonBuilder.jsonListModel(_listModelShopType.OfType<object>().ToList(), "ShopTypeFatherList", true, new string[] { "ShopTypeID", "ShopTypeName" }, false);
                return _backJson;
            }
            else if (_exeType == "6") //初始化店铺类别信息
            {
                //获取传递的参数
                string ShopTypeID = PublicClass.FilterRequestTrim("ShopTypeID");

                return BusiShop.getShopTypeApi(Convert.ToInt64(ShopTypeID));
            }
            else if (_exeType == "7") //保存上传店铺类目图片信息
            {
                //获取传递的参数
                string ShopTypeID = PublicClass.FilterRequestTrim("ShopTypeID");
                string ImgPathDomain = PublicClass.FilterRequestTrimNoConvert("ImgPathDomain");

                //保存上传的类目图片信息 ---API调用方法
                return BusiShop.saveUploadImgShopTypeApi(Convert.ToInt64(ShopTypeID), ImgPathDomain);
            }

            return "";
        }

        /// <summary>
        /// 店铺评价
        /// </summary>
        /// <returns></returns>
        public string ShopAppraise()
        {

            //获取操作类型  Type=1 搜索分页数据 Type=2 提交数据  Type=3 单个或批量删除店铺评价 Type=4 锁定/解锁 店铺评价 Type=5 统计店铺各评价信息
            string _exeType = PublicClass.FilterRequestTrim("Type");

            //--------无需验证签名------//
            if (_exeType == "5") //统计店铺各评价信息
            {
                // 获取传递的参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");

                //防止数字类型为空
                ShopID = PublicClass.preventNumberDataIsNull(ShopID);

                if (ShopID == "0" || string.IsNullOrWhiteSpace(ShopID))
                {
                    //商家UserID
                    string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                    //防止数字类型为空
                    ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                    //得到店铺ID  ， ShopID
                    ShopID = BusiShop.getShopID(Convert.ToInt64(ShopUserID)).ToString();
                }

                //统计店铺各评价信息 --API调用方法
                string _jsonBack = BusiShop.countShopAppraiseMsgApi(Convert.ToInt64(ShopID));
                return _jsonBack;
            }
            else
            {
                //--------需要验证签名------//

                //验证RndKeyRsa是否正确
                bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
                if (_verifySu == false)
                {
                    return "";
                }

                if (_exeType == "1")
                {
                    // 获取传递的参数
                    string ShopAppID = PublicClass.FilterRequestTrim("ShopAppID");
                    string ShopID = PublicClass.FilterRequestTrim("ShopID");
                    string OrderID = PublicClass.FilterRequestTrim("OrderID");
                    string ConformityScore = PublicClass.FilterRequestTrim("ConformityScore");
                    string AttitudeScore = PublicClass.FilterRequestTrim("AttitudeScore");
                    string ExpressScore = PublicClass.FilterRequestTrim("ExpressScore");
                    string DeliverymanScore = PublicClass.FilterRequestTrim("DeliverymanScore");
                    string UserID = PublicClass.FilterRequestTrim("UserID");
                    string IsLock = PublicClass.FilterRequestTrim("IsLock");
                    string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                    //获取当前页数
                    string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                    //防止数字类型为空
                    ShopAppID = PublicClass.preventNumberDataIsNull(ShopAppID);
                    ShopID = PublicClass.preventNumberDataIsNull(ShopID);
                    OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                    ConformityScore = PublicClass.preventNumberDataIsNull(ConformityScore);
                    AttitudeScore = PublicClass.preventNumberDataIsNull(AttitudeScore);
                    ExpressScore = PublicClass.preventNumberDataIsNull(ExpressScore);
                    DeliverymanScore = PublicClass.preventNumberDataIsNull(DeliverymanScore);
                    UserID = PublicClass.preventNumberDataIsNull(UserID);

                    if (ShopID == "0" || string.IsNullOrWhiteSpace(ShopID))
                    {
                        //商家UserID
                        string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                        //防止数字类型为空
                        ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                        //得到店铺ID  ， ShopID
                        ShopID = BusiShop.getShopID(Convert.ToInt64(ShopUserID)).ToString();
                    }

                    //------------用实体类去限制的查询条件 AND 连接------------//
                    ModelShopAppraise _modelShopAppraise = new ModelShopAppraise();
                    _modelShopAppraise.ShopAppID = Convert.ToInt64(ShopAppID);
                    _modelShopAppraise.ShopID = Convert.ToInt64(ShopID);
                    _modelShopAppraise.OrderID = Convert.ToInt64(OrderID);
                    _modelShopAppraise.ConformityScore = Convert.ToInt32(ConformityScore);
                    _modelShopAppraise.AttitudeScore = Convert.ToInt32(AttitudeScore);
                    _modelShopAppraise.ExpressScore = Convert.ToInt32(ExpressScore);
                    _modelShopAppraise.DeliverymanScore = Convert.ToInt32(DeliverymanScore);
                    _modelShopAppraise.UserID = Convert.ToInt64(UserID);
                    _modelShopAppraise.IsLock = IsLock;
                    _modelShopAppraise.WriteDate = WriteDate;


                    // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                    string _initSQLCharWhere = "";

                    //获取分页JSON数据字符串
                    //显示的字段值
                    string[] _showFieldArr = { "PageOrder" };
                    string _strJson = BusiJsonPageStr.morePageJSONShopAppraise(_modelShopAppraise, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                    //输出前台显示代码
                    return _strJson;
                }
                else if (_exeType == "2") //提交数据
                {
                    // 获取传递的参数
                    string ShopAppID = PublicClass.FilterRequestTrim("ShopAppID");
                    string ShopID = PublicClass.FilterRequestTrim("ShopID");
                    string OrderID = PublicClass.FilterRequestTrim("OrderID");
                    string ConformityScore = PublicClass.FilterRequestTrim("ConformityScore");
                    string AttitudeScore = PublicClass.FilterRequestTrim("AttitudeScore");
                    string ExpressScore = PublicClass.FilterRequestTrim("ExpressScore");
                    string DeliverymanScore = PublicClass.FilterRequestTrim("DeliverymanScore");
                    string UserID = PublicClass.FilterRequestTrim("UserID");
                    string IsLock = PublicClass.FilterRequestTrim("IsLock");
                    string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                    //防止数字类型为空
                    ShopAppID = PublicClass.preventNumberDataIsNull(ShopAppID);
                    ShopID = PublicClass.preventNumberDataIsNull(ShopID);
                    OrderID = PublicClass.preventNumberDataIsNull(OrderID);
                    ConformityScore = PublicClass.preventNumberDataIsNull(ConformityScore);
                    AttitudeScore = PublicClass.preventNumberDataIsNull(AttitudeScore);
                    ExpressScore = PublicClass.preventNumberDataIsNull(ExpressScore);
                    DeliverymanScore = PublicClass.preventNumberDataIsNull(DeliverymanScore);
                    UserID = PublicClass.preventNumberDataIsNull(UserID);

                    //提交 店铺评价 --API调用方法
                    return BusiShop.submitShopAppraiseApi(Convert.ToInt64(ShopAppID), Convert.ToInt64(ShopID), Convert.ToInt64(OrderID), Convert.ToInt32(ConformityScore), Convert.ToInt32(AttitudeScore), Convert.ToInt32(ExpressScore), Convert.ToInt32(DeliverymanScore), Convert.ToInt64(UserID), IsLock);
                }
                else if (_exeType == "3") //单个或批量删除店铺评价
                {
                    //获取传递的参数
                    string ShopAppIDArr = PublicClass.FilterRequestTrim("ShopAppIDArr");

                    //删除 单个或批量 店铺评价 --API调用方法
                    return BusiShop.delShopAppraiseArrApi(ShopAppIDArr);
                }
                else if (_exeType == "4") //锁定/解锁 店铺评价
                {
                    //获取传递的参数
                    string ShopAppID = PublicClass.FilterRequestTrim("ShopAppID");

                    //锁定/解锁 店铺评价 --API调用方法
                    return BusiShop.lockShopAppraiseApi(Convert.ToInt64(ShopAppID));
                }
            }

            return "";
        }

        /// <summary>
        /// 店铺展示信息
        /// </summary>
        /// <returns></returns>
        public string ShopShowMsg()
        {

            //获取操作类型  Type=1 搜索分页数据 Type=2 修改店铺展示信息的 排序数值 Type=3 切换 - 店铺展示信息是否显示 Type=4 批量 - 删除店铺展示信息 Type=5 加载店铺首页 各种展示信息 Type=6 批量 - 添加店铺展示信息 Type=7 切换全部 - 店铺展示信息是否显示  Type=8 修改栏目的排序数据值 ,值越大越靠前显示 Type=9 置顶栏目，修改排序数值
            string _exeType = PublicClass.FilterRequestTrim("Type");


            //--------需要验证签名------//
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //搜索分页数据 
            if (_exeType == "1")
            {
                // 获取传递的参数
                string ShopShowID = PublicClass.FilterRequestTrim("ShopShowID");
                string ShowType = PublicClass.FilterRequestTrim("ShowType");
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string SortNum = PublicClass.FilterRequestTrim("SortNum");
                string CMemo = PublicClass.FilterRequestTrim("CMemo");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsShow = PublicClass.FilterRequestTrim("IsShow");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                ShopShowID = PublicClass.preventNumberDataIsNull(ShopShowID);
                GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);
                SortNum = PublicClass.preventNumberDataIsNull(SortNum);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelShopShowMsg _modelShopShowMsg = new ModelShopShowMsg();
                _modelShopShowMsg.ShopShowID = Convert.ToInt64(ShopShowID);
                _modelShopShowMsg.ShowType = ShowType;
                _modelShopShowMsg.GoodsID = Convert.ToInt64(GoodsID);
                _modelShopShowMsg.SortNum = Convert.ToInt32(SortNum);
                _modelShopShowMsg.CMemo = CMemo;
                _modelShopShowMsg.ShopUserID = Convert.ToInt32(ShopUserID);
                _modelShopShowMsg.IsShow = IsShow;
                _modelShopShowMsg.IsLock = IsLock;
                _modelShopShowMsg.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONShopShowMsg(_modelShopShowMsg, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //修改店铺展示信息的 排序数值
            {
                // 获取传递的参数
                string ShopShowID = PublicClass.FilterRequestTrim("ShopShowID");
                string SortNum = PublicClass.FilterRequestTrim("SortNum");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字类型为空
                ShopShowID = PublicClass.preventNumberDataIsNull(ShopShowID);
                SortNum = PublicClass.preventNumberDataIsNull(SortNum);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiShop.modifShopShowMsgSortNumApi(Convert.ToInt64(ShopShowID), Convert.ToInt32(SortNum), Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "3") //切换 - 店铺展示信息是否显示
            {
                // 获取传递的参数
                string ShopShowID = PublicClass.FilterRequestTrim("ShopShowID");
                string IsShow = PublicClass.FilterRequestTrim("IsShow");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字类型为空
                ShopShowID = PublicClass.preventNumberDataIsNull(ShopShowID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiShop.tglShopShowMsgIsShowApi(Convert.ToInt64(ShopShowID), IsShow, Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "4") //批量 - 删除店铺展示信息
            {
                // 获取传递的参数
                string ShopShowIDArr = PublicClass.FilterRequestTrim("ShopShowIDArr");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字类型为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiShop.delShopShowMsgArrApi(ShopShowIDArr, Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "5") //加载店铺首页 各种栏目展示信息
            {
                // 获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string LoadTopNum = PublicClass.FilterRequestTrim("LoadTopNum");
                string IsShow = PublicClass.FilterRequestTrim("IsShow");

                //防止数字类型为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                LoadTopNum = PublicClass.preventNumberDataIsNull(LoadTopNum);

                string _jsonBack = BusiShop.loadShopShowMsgHomeTopListApi(Convert.ToInt64(ShopUserID), Convert.ToInt32(LoadTopNum), IsShow);
                return _jsonBack;
            }
            else if (_exeType == "6") //批量 - 添加店铺展示信息
            {
                // 获取传递的参数
                string ExtraDataIDArr = PublicClass.FilterRequestTrim("ExtraDataIDArr");
                string ShowType = PublicClass.FilterRequestTrim("ShowType");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字类型为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiShop.addShopShowMsgArrApi(ExtraDataIDArr, ShowType, Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "7") //切换全部 - 店铺展示信息是否显示
            {
                // 获取传递的参数
                string IsShow = PublicClass.FilterRequestTrim("IsShow");
                string ShowType = PublicClass.FilterRequestTrim("ShowType");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字类型为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiShop.tglShopShowMsgIsShowAllApi(ShowType, IsShow, Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "8") //修改栏目的排序数据值 ,值越大越靠前显示
            {
                // 获取传递的参数
                string ShowType = PublicClass.FilterRequestTrim("ShowType");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string SortNumSection = PublicClass.FilterRequestTrim("SortNumSection");

                //防止数字类型为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                SortNumSection = PublicClass.preventNumberDataIsNull(SortNumSection);

                string _jsonBack = BusiShop.modifySortNumSectionApi(ShowType, Convert.ToInt64(ShopUserID), Convert.ToInt32(SortNumSection));
                return _jsonBack;
            }
            else if (_exeType == "9") //置顶栏目，修改排序数值
            {
                // 获取传递的参数
                string ShowType = PublicClass.FilterRequestTrim("ShowType");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字类型为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiShop.goTopSortNumSectionApi(ShowType, Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 店铺轮播信息
        /// </summary>
        /// <returns></returns>
        public string ShopCarousel()
        {

            //获取操作类型  Type=1 搜索数据分页 Type=2 提交店铺轮播信息 Type=3  批量-删除店铺轮播信息 Type=4 切换-隐藏与显示轮播信息 Type=5 置顶-店铺轮播信息 Type=6 初始化店铺轮播图片信息详细 Type=7 加载店铺轮播图片信息列表
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "7") //加载店铺轮播图片信息列表
            {
                //获取传递参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                string CarouselType = PublicClass.FilterRequestTrim("CarouselType");
                string TopNum = PublicClass.FilterRequestTrim("TopNum");
                if (string.IsNullOrWhiteSpace(TopNum))
                {
                    TopNum = "20";
                }

                //防止数字类型为空
                TopNum = PublicClass.preventNumberDataIsNull(TopNum);
                ShopID = PublicClass.preventNumberDataIsNull(ShopID);

                //得到UserID
                long ShopUserID = BusiShop.getShopUserID(Convert.ToInt64(ShopID));

                string _jsonBack = BusiShop.loadShopCarouseListApi(ShopUserID, CarouselType, Convert.ToInt32(TopNum));
                return _jsonBack;
            }

            //--------需要验证签名------//
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //搜索数据分页
            if (_exeType == "1")
            {
                //获取传递参数
                string CarouselID = PublicClass.FilterRequestTrim("CarouselID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string CarouselTitle = PublicClass.FilterRequestTrim("CarouselTitle");
                string AdvLinkType = PublicClass.FilterRequestTrimNoConvert("AdvLinkType");
                string AdvLinkA = PublicClass.FilterRequestTrimNoConvert("AdvLinkA");
                string CMemo = PublicClass.FilterRequestTrimNoConvert("CMemo");
                string UploadGuid = PublicClass.FilterRequestTrimNoConvert("UploadGuid");
                string CarouselType = PublicClass.FilterRequestTrimNoConvert("CarouselType");
                string OsType = PublicClass.FilterRequestTrimNoConvert("OsType");
                string WriteDate = PublicClass.FilterRequestTrimNoConvert("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                CarouselID = PublicClass.preventNumberDataIsNull(CarouselID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelShopCarousel _modelShopCarousel = new ModelShopCarousel();
                _modelShopCarousel.CarouselID = Convert.ToInt64(CarouselID);
                _modelShopCarousel.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelShopCarousel.CarouselTitle = CarouselTitle;
                _modelShopCarousel.AdvLinkType = AdvLinkType;
                _modelShopCarousel.AdvLinkA = AdvLinkA;
                _modelShopCarousel.CMemo = CMemo;
                _modelShopCarousel.UploadGuid = UploadGuid;
                _modelShopCarousel.CarouselType = CarouselType;
                _modelShopCarousel.OsType = OsType;
                _modelShopCarousel.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONShopCarousel(_modelShopCarousel, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //提交店铺轮播信息
            {
                //获取传递参数
                string CarouselID = PublicClass.FilterRequestTrim("CarouselID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string CarouselTitle = PublicClass.FilterRequestTrim("CarouselTitle");
                string ImgURL = PublicClass.FilterRequestTrimNoConvert("ImgURL");
                string AdvLinkType = PublicClass.FilterRequestTrimNoConvert("AdvLinkType");
                string AdvLinkA = PublicClass.FilterRequestTrimNoConvert("AdvLinkA");
                string CMemo = PublicClass.FilterRequestTrimNoConvert("CMemo");
                string UploadGuid = PublicClass.FilterRequestTrimNoConvert("UploadGuid");
                string CarouselType = PublicClass.FilterRequestTrimNoConvert("CarouselType");
                string OsType = PublicClass.FilterRequestTrimNoConvert("OsType");

                //防止数字类型为空
                CarouselID = PublicClass.preventNumberDataIsNull(CarouselID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiShop.submitShopCarouselApi(Convert.ToInt64(CarouselID), CarouselTitle, ImgURL, AdvLinkType, AdvLinkA, Convert.ToInt64(ShopUserID), CMemo, UploadGuid, CarouselType, OsType);
                return _jsonBack;
            }
            else if (_exeType == "3") //批量-删除店铺轮播信息
            {
                //获取传递参数
                string CarouselIDArr = PublicClass.FilterRequestTrim("CarouselIDArr");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字类型为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiShop.delShopCarouselArrApi(CarouselIDArr, Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "4") //切换-隐藏与显示轮播信息
            {
                //获取传递参数
                string CarouselID = PublicClass.FilterRequestTrim("CarouselID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsShow = PublicClass.FilterRequestTrim("IsShow");

                //防止数字类型为空
                CarouselID = PublicClass.preventNumberDataIsNull(CarouselID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiShop.tglShopCarouselIsShowApi(Convert.ToInt64(CarouselID), IsShow, Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "5") //置顶-店铺轮播信息
            {
                //获取传递参数
                string CarouselID = PublicClass.FilterRequestTrim("CarouselID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字类型为空
                CarouselID = PublicClass.preventNumberDataIsNull(CarouselID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiShop.goTopShopCarouselApi(Convert.ToInt64(CarouselID), Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "6") //初始化店铺轮播图片信息详细
            {
                //获取传递参数
                string CarouselID = PublicClass.FilterRequestTrim("CarouselID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                string _jsonBack = BusiShop.initShopCarouseDetailApi(Convert.ToInt64(CarouselID), Convert.ToInt64(ShopUserID));
                return _jsonBack;

            }

            return "";
        }

        /// <summary>
        /// 店铺相关页-数据加载
        /// </summary>
        /// <returns></returns>
        public string ShopHomeData()
        {
            //获取操作类型  Type=1 店铺全部商品搜索分页 Type=2 查询商品，礼品，优惠券，活动，抽奖标题等信息 Type=3 加载店铺首页信息 Type=4 加载活动页信息 ,活动，抽奖
            string _exeType = PublicClass.FilterRequestTrim("Type");

            //店铺全部商品搜索分页
            if (_exeType == "1")
            {
                //获取传递参数

                //ShopID和ShopUserID 必须有一个不为空
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");


                string SearchGoodsKey = PublicClass.FilterRequestTrim("SearchGoodsKey");
                string ShopGoodsTypeID = PublicClass.FilterRequestTrim("ShopGoodsTypeID");

                //Commend 推荐 SaleCount 销量 GoodsPriceAsc 价格升序 GoodsPriceDesc 价格降序 WriteDate 新品 Discount 打折  GroupMsgCount 团购  SecKill  秒杀
                string PageOrderName = PublicClass.FilterRequestTrim("PageOrderName");
                //是否只加载打折的商品 ( true / false )
                string IsOnlyDiscount = PublicClass.FilterRequestTrim("IsOnlyDiscount");

                //加载时的平台 wap, cms
                string PageType = PublicClass.FilterRequestTrim("PageType");
                if (string.IsNullOrWhiteSpace(PageType))
                {
                    PageType = "wap";
                }

                string _orderBy = "";

                //排序方式
                if (PageOrderName == "Commend") //推荐
                {
                    _orderBy = "WriteDate DESC,SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "SaleCount") //销量
                {
                    _orderBy = "SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "GoodsPriceAsc") //价格升序
                {
                    _orderBy = "GoodsPrice ASC,SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "GoodsPriceDesc") //价格降序
                {
                    _orderBy = "GoodsPrice DESC,SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "WriteDate") //新品
                {
                    _orderBy = "WriteDate DESC,SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "Discount") //打折
                {
                    _orderBy = "Discount ASC,SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "GroupMsgCount") //团购
                {
                    _orderBy = "SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }
                else if (PageOrderName == "SecKill") //秒杀
                {
                    _orderBy = "SkDiscount ASC,SaleCount DESC,PaidCount DESC,PageOrder DESC";
                }

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                ShopID = PublicClass.preventNumberDataIsNull(ShopID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                ShopGoodsTypeID = PublicClass.preventNumberDataIsNull(ShopGoodsTypeID);

                //如果ShopUserID 为0 则计算出 ShopUserID
                if (ShopUserID == "0")
                {
                    //ShopUserID = BusiShop.getShopUserID(Convert.ToInt64(ShopID)).ToString();
                }

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelVC_GoodsMsg_SortMsg _modelVC_GoodsMsg_SortMsg = new ModelVC_GoodsMsg_SortMsg();
                _modelVC_GoodsMsg_SortMsg.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelVC_GoodsMsg_SortMsg.ShopID = Convert.ToInt64(ShopID);
                _modelVC_GoodsMsg_SortMsg.GoodsTitle = SearchGoodsKey;

                //ShopGoodsTypeID 等于1 则查询 未进行店铺分类的商品
                if (ShopGoodsTypeID == "1")
                {
                    _modelVC_GoodsMsg_SortMsg.ShopGoodsTypeID = Convert.ToInt64(ShopGoodsTypeID);
                }


                _modelVC_GoodsMsg_SortMsg.GoodsStatus = "售";
                _modelVC_GoodsMsg_SortMsg.IsUnSale = "false";
                _modelVC_GoodsMsg_SortMsg.IsLock = "false";


                //店铺推荐
                if (PageOrderName == "Commend")
                {
                    _modelVC_GoodsMsg_SortMsg.IsShopCommend = "true";
                }
                //是否查询团购商品
                if (PageOrderName == "GroupMsgCount")
                {
                    _modelVC_GoodsMsg_SortMsg.GroupMsgCount = 1;
                }
                //是否秒杀
                if (PageOrderName == "SecKill")
                {
                    _modelVC_GoodsMsg_SortMsg.SecKillCount = 1;
                }

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //打折
                if (IsOnlyDiscount == "true")
                {
                    _initSQLCharWhere = " Discount>0";
                }

                //查询秒杀
                if (PageOrderName == "SecKill")
                {
                    _initSQLCharWhere = "GroupMsgCount<=0 AND SecKillCount>=1";
                }

                //-----如果带有查询店铺商品分类ID的。进行店铺商品分类信息查询 ------//
                if (ShopGoodsTypeID != "0" && ShopGoodsTypeID != "1")
                {

                    //得到查询的店铺商品分类ID
                    List<long> _listShopGoodsTypeID = BusiShop.getFatherSubShopGoodsTypeIDArr(Convert.ToInt64(ShopGoodsTypeID));
                    //构造查询条件字符串
                    string _initSQLCharWhereType = "";
                    for (int i = 0; i < _listShopGoodsTypeID.Count; i++)
                    {
                        _initSQLCharWhereType += " OR ShopGoodsTypeID=" + _listShopGoodsTypeID[i];
                    }
                    //去掉前后“OR”
                    _initSQLCharWhereType = PublicClass.RemoveFrontAndBackChar(_initSQLCharWhereType.Trim(), "OR", 2);

                    _initSQLCharWhere = _initSQLCharWhere + " AND " + "(" + _initSQLCharWhereType + ")";
                }
                _initSQLCharWhere = PublicClass.RemoveFrontAndBackChar(_initSQLCharWhere.Trim(), "AND", 3);
                _initSQLCharWhere = PublicClass.RemoveFrontAndBackChar(_initSQLCharWhere.Trim(), "OR", 2);

                //如果没有排序则默认PageOrder 排序
                if (string.IsNullOrWhiteSpace(PageOrderName))
                {
                    _orderBy = "PageOrder DESC";
                }

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONVC_GoodsMsg_SortMsg(_modelVC_GoodsMsg_SortMsg, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, PageType, _orderBy);

                //输出前台显示代码
                return _strJson;

            }
            else if (_exeType == "2") //查询商品，礼品，优惠券，活动，抽奖标题等信息
            {
                //获取传递参数
                string SearchType = PublicClass.FilterRequestTrim("SearchType");
                string DataID = PublicClass.FilterRequestTrim("DataID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字类型为空
                DataID = PublicClass.preventNumberDataIsNull(DataID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiShop.searchShopAllCategoryMsgApi(SearchType, Convert.ToInt64(DataID), Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "3") //加载店铺首页信息
            {
                // 获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string ShopID = PublicClass.FilterRequestTrim("ShopID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字类型为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                ShopID = PublicClass.preventNumberDataIsNull(ShopID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiShop.loadShopHomeMsgApi(Convert.ToInt64(ShopUserID), Convert.ToInt64(ShopID), Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }
            else if (_exeType == "4") //加载活动页信息 ,活动，抽奖
            {
                //获取传递参数
                string ShopID = PublicClass.FilterRequestTrim("ShopID");

                //防止数字类型为空
                ShopID = PublicClass.preventNumberDataIsNull(ShopID);

                string _jsonBack = BusiShop.loadActivityPageMsgApi(Convert.ToInt64(ShopID));
                return _jsonBack;
            }

            //--------需要验证签名------//
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }


            return "";
        }

        #region【店铺抽成比例】

        /// <summary>
        /// 店铺抽成比例
        /// </summary>
        /// <returns></returns>
        public string ShopCommission()
        {
           
            return "";
        }

        #endregion


    }
}