using BusiApiKeyVerifyNS;
using OctAfterSaleAccCusNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【各项小红点提示数】API接口控制器
/// </summary>
namespace OctAfterSaleAccCusSystemWeb.PageControllers.ApiPage
{
    public class RCHintController : Controller
    {
        /// <summary>
        /// 各项小红点提示数
        /// </summary>
        /// <returns></returns>
        public string CountData()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }
            //获取操作类型  Type=1 统计买家中心首页 各项小红点提示数 Type=2 统计买家购物车 小红点的提示数 Type=3 统计底部导航条的 小红点的提示数 Type=4 统计买家中奖数 小红点的提示数
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递过来的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiCountData.countBuyerIndexRCHintApi(Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }
            else if (_exeType == "2") //统计买家购物车 小红点的提示数
            {
                //获取传递过来的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiCountData.countBuyerShoppingCartRCHintApi(Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }
            else if (_exeType == "3") //统计底部导航条的 小红点的提示数
            {
                //获取传递过来的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiCountData.countBottomNavRCHintApi(Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }
            else if (_exeType == "4") //统计买家中奖数 小红点的提示数
            {
                //获取传递过来的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiCountData.countLuckyDrawResultRCHintApi(Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }


            return "";
        }



    }
}