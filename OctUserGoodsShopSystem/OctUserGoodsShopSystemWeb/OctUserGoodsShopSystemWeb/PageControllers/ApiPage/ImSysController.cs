using BusiApiKeyVerifyNS;
using OctUserGoodsShopSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【IM在线客服对接】相关的API接口控制器
/// </summary>
namespace OctUserGoodsShopSystemWeb.PageControllers.ApiPage
{
    public class ImSysController : Controller
    {
        /// <summary>
        /// API接口首页
        /// </summary>
        /// <returns></returns>
        public string Index()
        {
            //-------------要验证签名------------//
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 构建【商家店铺】咨询进入IM在线客服系统 跳转 URL Type=2 构建 【商品】 咨询进入IM在线客服系统 跳转 URL Type=3 构建【商城平台官方客服】咨询进入IM在线客服系统 跳转 URL
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string VisitorMemo = PublicClass.FilterRequestTrim("VisitorMemo");
                string IsShowTitleHeader = PublicClass.FilterRequestTrim("IsShowTitleHeader");

                //防止数字为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiIM.buildBuyerGoToImSysURL_ShopWap(Convert.ToInt64(ShopUserID), Convert.ToInt64(BuyerUserID), VisitorMemo, IsShowTitleHeader);
                return _jsonBack;
            }
            else if (_exeType == "2") //构建 【商品】 咨询进入IM在线客服系统 跳转 URL
            {
                // 获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string VisitorMemo = PublicClass.FilterRequestTrim("VisitorMemo");
                string IsShowTitleHeader = PublicClass.FilterRequestTrim("IsShowTitleHeader");

                if (string.IsNullOrWhiteSpace(VisitorMemo))
                {
                    VisitorMemo = "商品咨询";
                }

                //防止数字为空
                GoodsID = PublicClass.preventNumberDataIsNull(GoodsID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiIM.buildBuyerGoToImSysURL_GoodsWap(Convert.ToInt64(GoodsID), Convert.ToInt64(BuyerUserID), VisitorMemo, IsShowTitleHeader);
                return _jsonBack;
            }
            else if (_exeType == "3") //构建【商城平台官方客服】咨询进入IM在线客服系统 跳转 URL
            {
                // 获取传递的参数
                string MallOfficialIMShopUserID = PublicClass.FilterRequestTrim("MallOfficialIMShopUserID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string VisitorMemo = PublicClass.FilterRequestTrim("VisitorMemo");
                string IsShowTitleHeader = PublicClass.FilterRequestTrim("IsShowTitleHeader");


                if (string.IsNullOrWhiteSpace(MallOfficialIMShopUserID))
                {
                    MallOfficialIMShopUserID = "88888888888888888";
                }
                if (string.IsNullOrWhiteSpace(VisitorMemo))
                {
                    VisitorMemo = "买家咨询商城平台";
                }

                //防止数字为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiIM.buildBuyerGoToImSysURL_PlatformWap(Convert.ToInt64(BuyerUserID), MallOfficialIMShopUserID, VisitorMemo, IsShowTitleHeader);
                return _jsonBack;

            }

            return "";
        }
    }


}