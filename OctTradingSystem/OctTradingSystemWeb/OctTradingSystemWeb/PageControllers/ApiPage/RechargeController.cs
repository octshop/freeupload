using BusiApiKeyVerifyNS;
using OctTradingSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【充值，充积分】相关的API接口控制器
/// </summary>
namespace OctTradingSystemWeb.PageControllers.ApiPage
{
    public class RechargeController : Controller
    {

        /// <summary>
        /// 商家充积分信息
        /// </summary>
        /// <returns></returns>
        public string ShopIntegralRecharge()
        {
          

            return "";
        }

        /// <summary>
        /// 买家余额充值
        /// </summary>
        /// <returns></returns>
        public string BuyerRecharge()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }


            //获取操作类型  Type=1 搜索分页数据 Type=2 添加买家充值信息 Type=3 删除一天之后,没有充值成功的信息 --API方法
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string RechargeID = PublicClass.FilterRequestTrim("RechargeID");
                string SerialNumber = PublicClass.FilterRequestTrim("SerialNumber");
                string RechargeAmt = PublicClass.FilterRequestTrim("RechargeAmt");
                string FromType = PublicClass.FilterRequestTrim("FromType");
                string RechargeStatus = PublicClass.FilterRequestTrim("RechargeStatus");
                string RechargeMemo = PublicClass.FilterRequestTrim("RechargeMemo");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                RechargeID = PublicClass.preventNumberDataIsNull(RechargeID);
                RechargeAmt = PublicClass.preventDecimalDataIsNull(RechargeAmt);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelBuyerRecharge _modelBuyerRecharge = new ModelBuyerRecharge();
                _modelBuyerRecharge.RechargeID = Convert.ToInt64(RechargeID);
                _modelBuyerRecharge.SerialNumber = SerialNumber;
                _modelBuyerRecharge.RechargeAmt = Convert.ToDecimal(RechargeAmt);
                _modelBuyerRecharge.FromType = FromType;
                _modelBuyerRecharge.RechargeStatus = RechargeStatus;
                _modelBuyerRecharge.RechargeMemo = RechargeMemo;
                _modelBuyerRecharge.BuyerUserID = Convert.ToInt64(BuyerUserID);
                _modelBuyerRecharge.IsLock = IsLock;
                _modelBuyerRecharge.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONBuyerRecharge(_modelBuyerRecharge, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加买家充值信息
            {
                // 获取传递的参数
                string RechargeAmt = PublicClass.FilterRequestTrim("RechargeAmt");
                string FromType = PublicClass.FilterRequestTrim("FromType");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string RechargeMemo = PublicClass.FilterRequestTrim("RechargeMemo");

                //防止数字类型为空
                RechargeAmt = PublicClass.preventDecimalDataIsNull(RechargeAmt);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiRecharge.addBuyerRechargeApi(Convert.ToDecimal(RechargeAmt), FromType, Convert.ToInt64(BuyerUserID), RechargeMemo);
                return _jsonBack;
            }
            else if (_exeType == "3") //删除一天之后,没有充值成功的信息 --API方法
            {
                string _jsonBack = BusiRecharge.delBuyerNoRechargeMsgApi();
                return _jsonBack;
            }


            return "";
        }


    }
}