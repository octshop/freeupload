using BusiApiKeyVerifyNS;
using OctCommonCodeNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【短地址URL】相关API接口和Page页面控制器
/// </summary>
namespace OctCommonCodeSystemWeb.PageControllers.ApiPage
{
    public class ShortUrlController : Controller
    {
        /// <summary>
        /// Page页面 首页
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 构建与管理 短地址URL
        /// </summary>
        /// <returns></returns>
        public string BuildMan()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1  添加短地址URL内容 Type=2 得到指定的短地址URL
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string RawUrl = PublicClass.FilterRequestTrimNoConvert("RawUrl");
                string ShortType = PublicClass.FilterRequestTrim("ShortType");
                string KeyGuid = PublicClass.FilterRequestTrim("KeyGuid");
                string ShortUrlMemo = PublicClass.FilterRequestTrim("ShortUrlMemo");
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");

                if (string.IsNullOrWhiteSpace(ShortType))
                {
                    ShortType = "Common";
                }

                //添加短地址URL 内容  --API方法
                string _jsonBack = BusiShortUrl.addShortUrlApi(RawUrl, ShortType, KeyGuid, ShortUrlMemo, ExtraData);
                return _jsonBack;
            }
            else if (_exeType == "2") //得到指定的短地址URL
            {
                string KeyGuid = PublicClass.FilterRequestTrim("KeyGuid");

                //得到指定的短地址URL --API方法
                string _jsonBack = BusiShortUrl.getShortUrlApi(KeyGuid);
                return _jsonBack;
            }

            return "";
        }

    }
}