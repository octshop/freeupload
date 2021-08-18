using BusiApiKeyVerifyNS;
using Newtonsoft.Json;
using OctTradingSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【数据统计】相关的API接口控制器
/// </summary>
namespace OctTradingSystemWeb.PageControllers.ApiPage
{
    public class CountSumController : Controller
    {
        /// <summary>
        /// 公共首页
        /// </summary>
        /// <returns></returns>
        public string Index()
        {
            //-------------需要验证签名-----------------//
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 统计总数-各种数据 Type=2 统计各种审核中，处理中的信息 Type=3 得到平台与商家的通知信息，一般是审核中 Type=4 统计订单的相关数据 Type=5 估计优惠券各种总数 Type=6 统计交易账务相关信息(商家后台使用)
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = JsonConvert.SerializeObject(BusiCountSum.countSumData(Convert.ToInt64(ShopUserID)));
                return _jsonBack;
            }
            else if (_exeType == "2") //统计各种审核中，处理中的信息
            {
                //获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiCountSum.countCheckingDataApi(Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "3") //得到平台与商家的通知信息，一般是审核中
            {
                //获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiCountSum.getNotificationListApi(Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "4") //统计订单的相关数据
            {
                //获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string IsTodayCount = PublicClass.FilterRequestTrim("IsTodayCount");

                //防止数字为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiCountSum.countOrderDataApi(IsTodayCount, Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "5") //统计优惠券各种总数
            {
                //获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = JsonConvert.SerializeObject(BusiCountSum.countCouponsData(Convert.ToInt64(ShopUserID)));
                return _jsonBack;
            }
            else if (_exeType == "6") //统计交易账务相关信息(商家后台使用)
            {
                //获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //统计商家移动端各项数据
                string _jsonBack = JsonConvert.SerializeObject(BusiCountSum.countSumDataShopCenter(Convert.ToInt64(ShopUserID)));
                return _jsonBack;
            }

            return "";
        }


    }
}