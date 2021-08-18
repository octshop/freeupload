using BusiApiKeyVerifyNS;
using EncryptionClassNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


/// <summary>
/// 【与Api的Key】相关的接口控制器
/// </summary>
namespace OctCommonCodeSystemWeb.PageControllers.ApiPage
{
    public class KeyController : Controller
    {
        // GET: Key
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 获取系统的RSA加密的RndKey
        /// </summary>
        /// <returns></returns>
        public string GetRndKeyRSA()
        {

            //获取传递过来的RSA加密字符串  pUserKeyID + "^" + pUserKey + "^" + pOneTime
            string _userKeyIDAndUserKeyArrRSA = PublicClass.FilterRequestTrimNoConvert("UserKeyIDAndUserKeyArrRSA");
            //语言类别
            string _langType = PublicClass.FilterRequestTrimNoConvert("LangType");

            //得到 RSA加密后的 RndKey
            string _rndKeyRSA = BusiApiKey.getRndKeyRSA(_userKeyIDAndUserKeyArrRSA, _langType);

            return _rndKeyRSA;
        }


    }
}