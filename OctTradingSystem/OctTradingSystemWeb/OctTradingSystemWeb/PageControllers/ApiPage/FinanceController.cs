using BusiApiKeyVerifyNS;
using OctTradingSystemNS;
using OctUserGoodsShopSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BusiJsonPageStr = OctTradingSystemNS.BusiJsonPageStr;
using BusiIntegral = OctTradingSystemNS.BusiIntegral;

/// <summary>
/// 【财务】相关的API接口控制器
/// </summary>
namespace OctTradingSystemWeb.PageControllers.ApiPage
{
    public class FinanceController : Controller
    {

        #region【----公共变量(锁死线程)----】

        //是否执行 防止重复提交
        public static bool mIsNoRepeatExe = true;
        //锁对象,锁死线程
        private static object mLockImport = new object();

        #endregion


        /// <summary>
        /// 公共接口首页
        /// </summary>
        /// <returns></returns>
        public string Index()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 得到买家所有的余额和积分信息 包括账号和分润的
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiFinance.getBuyerAllCurBalanceIntegralApi(Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }

            return "";
        }

        #region【买家 -- 收支，积分】

        /// <summary>
        /// 买家账户余额收支信息
        /// </summary>
        /// <returns></returns>
        public string BuyerIncomeExpense()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 添加/编辑买家收支信息 Type=3 锁定/解锁信息 Type=4 得到用户当前的可用余额 Type=5 初始化买家收支详情 - 余额详细 Type=6 平台管理增减买家用户的余额收支
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string InExMsgID = PublicClass.FilterRequestTrim("InExMsgID");
                string IncomeSum = PublicClass.FilterRequestTrim("IncomeSum");
                string ExpenseSum = PublicClass.FilterRequestTrim("ExpenseSum");
                string CurrentBalance = PublicClass.FilterRequestTrim("CurrentBalance");
                string InExType = PublicClass.FilterRequestTrim("InExType");
                string InExMemo = PublicClass.FilterRequestTrim("InExMemo");
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                InExMsgID = PublicClass.preventNumberDataIsNull(InExMsgID);
                IncomeSum = PublicClass.preventDecimalDataIsNull(IncomeSum);
                ExpenseSum = PublicClass.preventDecimalDataIsNull(ExpenseSum);
                CurrentBalance = PublicClass.preventDecimalDataIsNull(CurrentBalance);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelBuyerIncomeExpense _modelBuyerIncomeExpense = new ModelBuyerIncomeExpense();
                _modelBuyerIncomeExpense.InExMsgID = Convert.ToInt64(InExMsgID);
                _modelBuyerIncomeExpense.IncomeSum = Convert.ToDecimal(IncomeSum);
                _modelBuyerIncomeExpense.ExpenseSum = Convert.ToDecimal(ExpenseSum);
                _modelBuyerIncomeExpense.CurrentBalance = Convert.ToDecimal(CurrentBalance);
                _modelBuyerIncomeExpense.InExType = InExType;
                _modelBuyerIncomeExpense.InExMemo = InExMemo;
                _modelBuyerIncomeExpense.ExtraData = ExtraData;
                _modelBuyerIncomeExpense.BuyerUserID = Convert.ToInt64(BuyerUserID);
                _modelBuyerIncomeExpense.IsLock = IsLock;
                _modelBuyerIncomeExpense.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder", "IsLock" };
                string _strJson = BusiJsonPageStr.morePageJSONBuyerIncomeExpense(_modelBuyerIncomeExpense, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加/编辑买家收支信息
            {
                // 获取传递的参数
                string InExMsgID = PublicClass.FilterRequestTrim("InExMsgID");
                string IncomeSum = PublicClass.FilterRequestTrim("IncomeSum");
                string ExpenseSum = PublicClass.FilterRequestTrim("ExpenseSum");
                string CurrentBalance = PublicClass.FilterRequestTrim("CurrentBalance");
                string InExType = PublicClass.FilterRequestTrim("InExType");
                string InExMemo = PublicClass.FilterRequestTrim("InExMemo");
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                //string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                InExMsgID = PublicClass.preventNumberDataIsNull(InExMsgID); //等于0时，为添加操作
                IncomeSum = PublicClass.preventDecimalDataIsNull(IncomeSum);
                ExpenseSum = PublicClass.preventDecimalDataIsNull(ExpenseSum);
                CurrentBalance = PublicClass.preventDecimalDataIsNull(CurrentBalance);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //提交 买家收支信息  --- API调用方法
                string _jsonBack = BusiIncomeExpense.submitBuyerIncomeExpenseApi(Convert.ToInt64(InExMsgID), Convert.ToDecimal(IncomeSum), Convert.ToDecimal(ExpenseSum), Convert.ToDecimal(CurrentBalance), InExType, InExMemo, Convert.ToInt64(BuyerUserID), ExtraData, IsLock);
                return _jsonBack;
            }
            else if (_exeType == "3") //锁定/解锁信息
            {
                // 获取传递的参数
                string InExMsgID = PublicClass.FilterRequestTrim("InExMsgID");

                //锁定/解密 买家收支信息 -- API调用方法
                return BusiIncomeExpense.lockBuyerIncomeExpenseApi(Convert.ToInt64(InExMsgID));
            }
            else if (_exeType == "4") //得到用户当前的可用余额
            {
                // 获取传递的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                //防止数字为空
                BuyerUserID = PublicClass.preventDecimalDataIsNull(BuyerUserID);

                //统计当前余额   总收入 减去  总支出 可能为负数
                decimal sumCurrentBalanceBuyer = BusiFinance.sumCurrentBalanceBuyer(Convert.ToInt64(BuyerUserID));
                //构造Json字符串
                string _jsonBack = "{";
                _jsonBack += "\"BuyerUserID\":\"" + BuyerUserID + "\",";
                _jsonBack += "\"CurrentBalance\":\"" + sumCurrentBalanceBuyer + "\"";
                _jsonBack += "}";
                return _jsonBack;
            }
            else if (_exeType == "5") //初始化买家收支详情 - 余额详细
            {
                // 获取传递的参数
                string InExMsgID = PublicClass.FilterRequestTrim("InExMsgID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字为空
                InExMsgID = PublicClass.preventDecimalDataIsNull(InExMsgID);
                BuyerUserID = PublicClass.preventDecimalDataIsNull(BuyerUserID);

                string _jsonBack = BusiIncomeExpense.initBuyerIncomeExpenseDetailApi(Convert.ToInt64(InExMsgID), Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }
            else if (_exeType == "6") //平台管理增减买家用户的余额收支
            {
                //-------------锁死线程只能单线程执行-------//
                lock (mLockImport)
                {
                    //----------------防止重复提交-----------------//
                    if (mIsNoRepeatExe == false)
                    {
                        return "NOREPEAT_02"; //可以重复次执行逻辑
                    }
                    mIsNoRepeatExe = false;



                    // 获取传递的参数
                    string BindMobile = PublicClass.FilterRequestTrim("BindMobile");
                    string AddReduceSum = PublicClass.FilterRequestTrim("AddReduceSum");
                    string InExType = PublicClass.FilterRequestTrim("InExType");
                    string InExMemo = PublicClass.FilterRequestTrim("InExMemo");

                    //防止数字为空
                    AddReduceSum = PublicClass.preventDecimalDataIsNull(AddReduceSum);

                    string _jsonBack = BusiFinance.AddReduceBuyerInExPlatformApi(BindMobile, Convert.ToDecimal(AddReduceSum), InExType, InExMemo);



                    //-----------可以再次执行逻辑--------------//
                    mIsNoRepeatExe = true;
                    return _jsonBack;
                }

            }
            return "";
        }

        /// <summary>
        /// 买家分润余额收支信息
        /// </summary>
        /// <returns></returns>
        public string BuyerIncomeExpenseDividend()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string InExMsgID = PublicClass.FilterRequestTrim("InExMsgID");
                string IncomeSum = PublicClass.FilterRequestTrim("IncomeSum");
                string ExpenseSum = PublicClass.FilterRequestTrim("ExpenseSum");
                string CurrentBalance = PublicClass.FilterRequestTrim("CurrentBalance");
                string InExType = PublicClass.FilterRequestTrim("InExType");
                string InExMemo = PublicClass.FilterRequestTrim("InExMemo");
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                InExMsgID = PublicClass.preventNumberDataIsNull(InExMsgID);
                IncomeSum = PublicClass.preventDecimalDataIsNull(IncomeSum);
                ExpenseSum = PublicClass.preventDecimalDataIsNull(ExpenseSum);
                CurrentBalance = PublicClass.preventDecimalDataIsNull(CurrentBalance);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelBuyerIncomeExpenseDividend _modelBuyerIncomeExpenseDividend = new ModelBuyerIncomeExpenseDividend();
                _modelBuyerIncomeExpenseDividend.InExMsgID = Convert.ToInt64(InExMsgID);
                _modelBuyerIncomeExpenseDividend.IncomeSum = Convert.ToDecimal(IncomeSum);
                _modelBuyerIncomeExpenseDividend.ExpenseSum = Convert.ToDecimal(ExpenseSum);
                _modelBuyerIncomeExpenseDividend.CurrentBalance = Convert.ToDecimal(CurrentBalance);
                _modelBuyerIncomeExpenseDividend.InExType = InExType;
                _modelBuyerIncomeExpenseDividend.InExMemo = InExMemo;
                _modelBuyerIncomeExpenseDividend.ExtraData = ExtraData;
                _modelBuyerIncomeExpenseDividend.BuyerUserID = Convert.ToInt64(BuyerUserID);
                _modelBuyerIncomeExpenseDividend.IsLock = IsLock;
                _modelBuyerIncomeExpenseDividend.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder", "IsLock" };
                string _strJson = BusiJsonPageStr.morePageJSONBuyerIncomeExpenseDividend(_modelBuyerIncomeExpenseDividend, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }

            return "";
        }

        /// <summary>
        /// 买家积分收支信息
        /// </summary>
        /// <returns></returns>
        public string BuyerIntegral()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 统计买家当前积分总额 Type=3 初始化买家积分详细
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string IntegralID = PublicClass.FilterRequestTrim("IntegralID");
                string IncomeSum = PublicClass.FilterRequestTrim("IncomeSum");
                string ExpenseSum = PublicClass.FilterRequestTrim("ExpenseSum");
                string CurrentBalance = PublicClass.FilterRequestTrim("CurrentBalance");
                string InExType = PublicClass.FilterRequestTrim("InExType");
                string InExMemo = PublicClass.FilterRequestTrim("InExMemo");
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDateStart = PublicClass.FilterRequestTrim("WriteDateStart");
                string WriteDateEnd = PublicClass.FilterRequestTrim("WriteDateEnd");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                IntegralID = PublicClass.preventNumberDataIsNull(IntegralID);
                IncomeSum = PublicClass.preventDecimalDataIsNull(IncomeSum);
                ExpenseSum = PublicClass.preventDecimalDataIsNull(ExpenseSum);
                CurrentBalance = PublicClass.preventDecimalDataIsNull(CurrentBalance);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelBuyerIntegral _modelBuyerIntegral = new ModelBuyerIntegral();
                _modelBuyerIntegral.IntegralID = Convert.ToInt64(IntegralID);
                _modelBuyerIntegral.IncomeSum = Convert.ToDecimal(IncomeSum);
                _modelBuyerIntegral.ExpenseSum = Convert.ToDecimal(ExpenseSum);
                _modelBuyerIntegral.CurrentBalance = Convert.ToDecimal(CurrentBalance);
                _modelBuyerIntegral.InExType = InExType;
                _modelBuyerIntegral.InExMemo = InExMemo;
                _modelBuyerIntegral.ExtraData = ExtraData;
                _modelBuyerIntegral.BuyerUserID = Convert.ToInt64(BuyerUserID);
                _modelBuyerIntegral.IsLock = IsLock;
                //_modelShopIncomeExpense.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";
                if (string.IsNullOrWhiteSpace(WriteDateStart) == false)
                {
                    _initSQLCharWhere += "WriteDate>='" + WriteDateStart + "'";
                }
                if (string.IsNullOrWhiteSpace(WriteDateEnd) == false)
                {
                    if (string.IsNullOrWhiteSpace(WriteDateStart))
                    {
                        _initSQLCharWhere += "WriteDate<='" + WriteDateEnd + "'";
                    }
                    else
                    {
                        _initSQLCharWhere += " AND WriteDate<='" + WriteDateEnd + "'";
                    }
                }

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder", "IsLock" };
                string _strJson = BusiJsonPageStr.morePageJSONBuyerIntegral(_modelBuyerIntegral, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //统计买家当前积分总额
            {
                //获取传递的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字类型为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //统计商家当前积分总额
                decimal _currentIntegralBuyer = BusiFinance.sumCurrentIntegralBuyer(Convert.ToInt64(BuyerUserID));

                //得到买家昵称
                string _UserNick = BusiBuyer.getBuyerUserNick(Convert.ToInt64(BuyerUserID));

                string _json = "{";
                _json += "\"BuyerUserID\":\"" + BuyerUserID + "\"";
                _json += ",\"UserNick\":\"" + _UserNick + "\"";
                _json += ",\"CurrentIntegral\":\"" + _currentIntegralBuyer + "\"";
                _json += "}";
                return _json;
            }
            else if (_exeType == "3") //初始化买家积分详细
            {
                //获取传递的参数
                string IntegralID = PublicClass.FilterRequestTrim("IntegralID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字类型为空
                IntegralID = PublicClass.preventNumberDataIsNull(IntegralID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiIntegral.initBuyerIntegralDetail(Convert.ToInt64(IntegralID), Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }


            return "";
        }

        /// <summary>
        /// 买家分润积分收支信息
        /// </summary>
        /// <returns></returns>
        public string BuyerIntegralDividend()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string IntegralID = PublicClass.FilterRequestTrim("IntegralID");
                string IncomeSum = PublicClass.FilterRequestTrim("IncomeSum");
                string ExpenseSum = PublicClass.FilterRequestTrim("ExpenseSum");
                string CurrentBalance = PublicClass.FilterRequestTrim("CurrentBalance");
                string InExType = PublicClass.FilterRequestTrim("InExType");
                string InExMemo = PublicClass.FilterRequestTrim("InExMemo");
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDateStart = PublicClass.FilterRequestTrim("WriteDateStart");
                string WriteDateEnd = PublicClass.FilterRequestTrim("WriteDateEnd");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                IntegralID = PublicClass.preventNumberDataIsNull(IntegralID);
                IncomeSum = PublicClass.preventDecimalDataIsNull(IncomeSum);
                ExpenseSum = PublicClass.preventDecimalDataIsNull(ExpenseSum);
                CurrentBalance = PublicClass.preventDecimalDataIsNull(CurrentBalance);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelBuyerIntegralDividend _modelBuyerIntegralDividend = new ModelBuyerIntegralDividend();
                _modelBuyerIntegralDividend.IntegralID = Convert.ToInt64(IntegralID);
                _modelBuyerIntegralDividend.IncomeSum = Convert.ToDecimal(IncomeSum);
                _modelBuyerIntegralDividend.ExpenseSum = Convert.ToDecimal(ExpenseSum);
                _modelBuyerIntegralDividend.CurrentBalance = Convert.ToDecimal(CurrentBalance);
                _modelBuyerIntegralDividend.InExType = InExType;
                _modelBuyerIntegralDividend.InExMemo = InExMemo;
                _modelBuyerIntegralDividend.ExtraData = ExtraData;
                _modelBuyerIntegralDividend.BuyerUserID = Convert.ToInt64(BuyerUserID);
                _modelBuyerIntegralDividend.IsLock = IsLock;
                //_modelShopIncomeExpense.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";
                if (string.IsNullOrWhiteSpace(WriteDateStart) == false)
                {
                    _initSQLCharWhere += "WriteDate>='" + WriteDateStart + "'";
                }
                if (string.IsNullOrWhiteSpace(WriteDateEnd) == false)
                {
                    if (string.IsNullOrWhiteSpace(WriteDateStart))
                    {
                        _initSQLCharWhere += "WriteDate<='" + WriteDateEnd + "'";
                    }
                    else
                    {
                        _initSQLCharWhere += " AND WriteDate<='" + WriteDateEnd + "'";
                    }
                }

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder", "IsLock" };
                string _strJson = BusiJsonPageStr.morePageJSONBuyerIntegralDividend(_modelBuyerIntegralDividend, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }

            return "";
        }

        /// <summary>
        /// 买家财务信息
        /// </summary>
        /// <returns></returns>
        public string BuyerFinance()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 统计买家的当前总余额和总积分
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                //加载类型 [ Both , Balance,Integral ]
                string LoadType = PublicClass.FilterRequestTrim("LoadType");

                //防止数字类型为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiFinance.getBuyerCurBalanceIntegralApi(Convert.ToInt64(BuyerUserID), LoadType);
                return _jsonBack;
            }

            return "";
        }


        #endregion

        #region【商家 -- 收支，积分】

        /// <summary>
        /// 商家余额收支信息
        /// </summary>
        /// <returns></returns>
        public string ShopIncomeExpense()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 添加/编辑商家收支信息 Type=3 锁定/解锁信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string InExMsgID = PublicClass.FilterRequestTrim("InExMsgID");
                string IncomeSum = PublicClass.FilterRequestTrim("IncomeSum");
                string ExpenseSum = PublicClass.FilterRequestTrim("ExpenseSum");
                string CurrentBalance = PublicClass.FilterRequestTrim("CurrentBalance");
                string InExType = PublicClass.FilterRequestTrim("InExType");
                string InExMemo = PublicClass.FilterRequestTrim("InExMemo");
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                string WriteDateStart = PublicClass.FilterRequestTrim("WriteDateStart");
                string WriteDateEnd = PublicClass.FilterRequestTrim("WriteDateEnd");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                InExMsgID = PublicClass.preventNumberDataIsNull(InExMsgID);
                IncomeSum = PublicClass.preventDecimalDataIsNull(IncomeSum);
                ExpenseSum = PublicClass.preventDecimalDataIsNull(ExpenseSum);
                CurrentBalance = PublicClass.preventDecimalDataIsNull(CurrentBalance);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelShopIncomeExpense _modelShopIncomeExpense = new ModelShopIncomeExpense();
                _modelShopIncomeExpense.InExMsgID = Convert.ToInt64(InExMsgID);
                _modelShopIncomeExpense.IncomeSum = Convert.ToDecimal(IncomeSum);
                _modelShopIncomeExpense.ExpenseSum = Convert.ToDecimal(ExpenseSum);
                _modelShopIncomeExpense.CurrentBalance = Convert.ToDecimal(CurrentBalance);
                _modelShopIncomeExpense.InExType = InExType;
                _modelShopIncomeExpense.InExMemo = InExMemo;
                _modelShopIncomeExpense.ExtraData = ExtraData;
                _modelShopIncomeExpense.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelShopIncomeExpense.IsLock = IsLock;
                //_modelShopIncomeExpense.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";
                if (string.IsNullOrWhiteSpace(WriteDateStart) == false)
                {
                    _initSQLCharWhere += "WriteDate>='" + WriteDateStart + "'";
                }
                if (string.IsNullOrWhiteSpace(WriteDateEnd) == false)
                {
                    if (string.IsNullOrWhiteSpace(WriteDateStart))
                    {
                        _initSQLCharWhere += "WriteDate<='" + WriteDateEnd + "'";
                    }
                    else
                    {
                        _initSQLCharWhere += " AND WriteDate<='" + WriteDateEnd + "'";
                    }
                }

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONShopIncomeExpense(_modelShopIncomeExpense, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加/编辑商家收支信息
            {
                // 获取传递的参数
                string InExMsgID = PublicClass.FilterRequestTrim("InExMsgID");
                string IncomeSum = PublicClass.FilterRequestTrim("IncomeSum");
                string ExpenseSum = PublicClass.FilterRequestTrim("ExpenseSum");
                string CurrentBalance = PublicClass.FilterRequestTrim("CurrentBalance");
                string InExType = PublicClass.FilterRequestTrim("InExType");
                string InExMemo = PublicClass.FilterRequestTrim("InExMemo");
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                //string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                InExMsgID = PublicClass.preventNumberDataIsNull(InExMsgID); //等于0时，为添加操作
                IncomeSum = PublicClass.preventDecimalDataIsNull(IncomeSum);
                ExpenseSum = PublicClass.preventDecimalDataIsNull(ExpenseSum);
                CurrentBalance = PublicClass.preventDecimalDataIsNull(CurrentBalance);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //提交 买家收支信息  --- API调用方法
                string _jsonBack = BusiIncomeExpense.submitBuyerIncomeExpenseApi(Convert.ToInt64(InExMsgID), Convert.ToDecimal(IncomeSum), Convert.ToDecimal(ExpenseSum), Convert.ToDecimal(CurrentBalance), InExType, InExMemo, Convert.ToInt64(ShopUserID), ExtraData, IsLock);
                return _jsonBack;
            }
            else if (_exeType == "3") //锁定/解锁信息
            {
                // 获取传递的参数
                string InExMsgID = PublicClass.FilterRequestTrim("InExMsgID");
                //锁定/解密 商家收支信息 -- API调用方法
                return BusiIncomeExpense.lockShopIncomeExpenseApi(Convert.ToInt64(InExMsgID));
            }

            return "";
        }

        /// <summary>
        /// 商家积分收支信息
        /// </summary>
        /// <returns></returns>
        public string ShopIntegral()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 统计商家当前积分总额
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string IntegralID = PublicClass.FilterRequestTrim("IntegralID");
                string IncomeSum = PublicClass.FilterRequestTrim("IncomeSum");
                string ExpenseSum = PublicClass.FilterRequestTrim("ExpenseSum");
                string CurrentBalance = PublicClass.FilterRequestTrim("CurrentBalance");
                string InExType = PublicClass.FilterRequestTrim("InExType");
                string InExMemo = PublicClass.FilterRequestTrim("InExMemo");
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDateStart = PublicClass.FilterRequestTrim("WriteDateStart");
                string WriteDateEnd = PublicClass.FilterRequestTrim("WriteDateEnd");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                IntegralID = PublicClass.preventNumberDataIsNull(IntegralID);
                IncomeSum = PublicClass.preventDecimalDataIsNull(IncomeSum);
                ExpenseSum = PublicClass.preventDecimalDataIsNull(ExpenseSum);
                CurrentBalance = PublicClass.preventDecimalDataIsNull(CurrentBalance);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelShopIntegral _modelShopIntegral = new ModelShopIntegral();
                _modelShopIntegral.IntegralID = Convert.ToInt64(IntegralID);
                _modelShopIntegral.IncomeSum = Convert.ToDecimal(IncomeSum);
                _modelShopIntegral.ExpenseSum = Convert.ToDecimal(ExpenseSum);
                _modelShopIntegral.CurrentBalance = Convert.ToDecimal(CurrentBalance);
                _modelShopIntegral.InExType = InExType;
                _modelShopIntegral.InExMemo = InExMemo;
                _modelShopIntegral.ExtraData = ExtraData;
                _modelShopIntegral.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelShopIntegral.IsLock = IsLock;
                _modelShopIntegral.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";
                if (string.IsNullOrWhiteSpace(WriteDateStart) == false)
                {
                    _initSQLCharWhere += "WriteDate>='" + WriteDateStart + "'";
                }
                if (string.IsNullOrWhiteSpace(WriteDateEnd) == false)
                {
                    if (string.IsNullOrWhiteSpace(WriteDateStart))
                    {
                        _initSQLCharWhere += "WriteDate<='" + WriteDateEnd + "'";
                    }
                    else
                    {
                        _initSQLCharWhere += " AND WriteDate<='" + WriteDateEnd + "'";
                    }
                }

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder", "IsLock" };
                string _strJson = BusiJsonPageStr.morePageJSONShopIntegral(_modelShopIntegral, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //统计商家当前积分总额
            {
                //获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字类型为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //统计商家当前积分总额
                decimal _currentIntegralShop = BusiFinance.sumCurrentIntegralShop(Convert.ToInt64(ShopUserID));

                string _json = "{";
                _json += "\"ShopUserID\":\"" + ShopUserID + "\"";
                _json += ",\"CurrentIntegralShop\":\"" + _currentIntegralShop + "\"";
                _json += "}";
                return _json;
            }

            return "";
        }

        #endregion


    }
}