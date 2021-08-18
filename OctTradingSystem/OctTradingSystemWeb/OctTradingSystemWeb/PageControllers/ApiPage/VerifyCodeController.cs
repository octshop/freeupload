using BusiApiKeyVerifyNS;
using OctTradingSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【各种验证码信息-验证】相关的API接口控制器
/// </summary>
namespace OctTradingSystemWeb.PageControllers.ApiPage
{
    public class VerifyCodeController : Controller
    {
        /// <summary>
        /// 验证扫码，各种验证码信息扫码
        /// </summary>
        /// <returns></returns>
        public string VerifyCodeScanData()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 验证--各种类型的验证码信息 Type=2 得到店铺指定类别的 验证码信息 列表
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string VerifyType = PublicClass.FilterRequestTrim("VerifyTypeCode");
                string VerifyCode = PublicClass.FilterRequestTrim("VerifyCode");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiVerifyCode.verifyCodeApi(ExtraData, VerifyType, VerifyCode, Convert.ToInt64(BuyerUserID), Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }
            else if (_exeType == "2") //得到店铺指定类别的 验证码信息 列表
            {
                //获取传递的参数
                string VerifyType = PublicClass.FilterRequestTrim("VerifyTypeCode");
                string VerifyCode = PublicClass.FilterRequestTrim("VerifyCode");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                string _jsonBack = BusiVerifyCode.getShopVerifyCodeMsgListApi(VerifyType, VerifyCode, Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }

            return "";
        }



    }
}