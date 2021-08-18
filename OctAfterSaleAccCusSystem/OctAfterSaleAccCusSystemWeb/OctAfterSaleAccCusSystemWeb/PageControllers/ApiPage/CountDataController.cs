using BusiApiKeyVerifyNS;
using Newtonsoft.Json;
using OctAfterSaleAccCusNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【数据统计】API接口控制器
/// </summary>
namespace OctAfterSaleAccCusSystemWeb.PageControllers.ApiPage
{
    public class CountDataController : Controller
    {
        /// <summary>
        /// 公共首页
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

            //获取操作类型  Type=1 统计总数-各种数据 Type=2 统计各种消息通知 Type=3 统计商家移动端 小红点数字
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递过来的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiCountData.countSumDataApi(Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "2") //统计各种消息通知
            {
                //获取传递过来的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiCountData.countShopSysMsgApi(Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "3") //统计商家移动端 小红点数字
            {
                //获取传递过来的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = JsonConvert.SerializeObject(BusiCountData.countAsAcRCHintWapShopCenter(Convert.ToInt64(ShopUserID)));
                return _jsonBack;
            }

            return "";
        }
    }
}