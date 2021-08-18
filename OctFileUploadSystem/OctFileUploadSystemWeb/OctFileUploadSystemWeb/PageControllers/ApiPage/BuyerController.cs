using BusiApiKeyVerifyNS;
using OctFileUploadSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【买家】相关文件上传的API接口控制器
/// </summary>
namespace OctFileUploadSystemWeb.PageControllers.ApiPage
{
    public class BuyerController : Controller
    {
        // GET: Buyer
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 【买家头像图片】相关操作
        /// </summary>
        /// <returns></returns>
        public string BuyerHeaderImg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型 Type=1 上传图片 Type=2 删除图片
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递过来的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //调用上传函数
                return BusiUploadFile.uploadBuyerHeaderImg(UserID, UploadGuid);
            }
            else if (_exeType == "2") //删除图片
            {
                //获取传递过来的参数
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //【买家头像图片】删除
                return BusiUploadFileData.delDataBuyerHeaderImgApi(UploadGuid);
            }

            return "";
        }


    }
}