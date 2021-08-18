using BusiApiKeyVerifyNS;
using OctFileUploadSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【退款】相关文件上传的API接口控制器
/// </summary>
namespace OctFileUploadSystemWeb.PageControllers.ApiPage
{
    public class RefundController : Controller
    {
        // GET: Refund
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 【退款问题图片】相关操作
        /// </summary>
        /// <returns></returns>
        public string RefundProblemImgs()
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
                //string UpType = PublicClass.FilterRequestTrim("UpType");

                //调用上传函数
                return BusiUploadFile.uploadRefundProblemImgs(UserID, UploadGuid);
            }
            else if (_exeType == "2") //删除图片
            {
                //获取传递过来的参数
                string UploadGuidArr = PublicClass.FilterRequestTrim("UploadGuidArr");

                //删除
                return BusiUploadFileData.delDataRefundProblemImgsApi(UploadGuidArr);
            }
            return "";
        }


    }
}