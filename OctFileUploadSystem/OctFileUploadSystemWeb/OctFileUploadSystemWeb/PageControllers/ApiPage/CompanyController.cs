using BusiApiKeyVerifyNS;
using OctFileUploadSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【公司】相关文件上传的API接口控制器
/// </summary>
namespace OctFileUploadSystemWeb.PageControllers.ApiPage
{
    public class CompanyController : Controller
    {
        // GET: Company
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 【公司证件图片】相关操作
        /// </summary>
        /// <returns></returns>
        public string CompanyCertificateImg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型 Type=1 上传图片 Type=2 单个或批量删除图片  Type=3 保存证件ID到图片信息表中
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递过来的参数
                string UserID = PublicClass.FilterRequestTrim("UserID"); // [CertID 证件ID]
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //调用上传函数
                return BusiUploadFile.uploadCompanyCertificateImg(UserID,UploadGuid);
            }
            else if (_exeType == "2") //单个或批量删除图片 
            {
                //获取传递过来的参数
                string UploadGuidArr = PublicClass.FilterRequestTrim("UploadGuidArr");

                //【公司证件图片】单个或批量删除
                return BusiUploadFileData.delDataCompanyCertificateImgApi(UploadGuidArr);
            }
            else if (_exeType == "3") //保存证件ID到图片信息表中
            {
                //获取传递过来的参数
                string CertID = PublicClass.FilterRequestTrim("CertID"); //[GoodsTypeID 商品类目ID]
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //将GoodsTypeID更新到类目图标信息表中
                return BusiCompany.saveCertIDToCompanyCertificateImgApi(Convert.ToInt64(CertID), UploadGuid);
            }


            return "";
        }


    }
}