using BusiApiKeyVerifyNS;
using OctFileUploadSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【分销】相关文件上传的API接口控制器
/// </summary>
namespace OctFileUploadSystemWeb.PageControllers.ApiPage
{
    public class DistriController : Controller
    {
        // GET: Distri
        public ActionResult Index()
        {
            return View();
        }


        /// <summary>
        /// 【分销店铺Logo图片】相关操作
        /// </summary>
        /// <returns></returns>
        public string DistriShopLogoImg()
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
                return BusiUploadFile.uploadDistriShopLogoImg(UserID, UploadGuid);
            }
            else if (_exeType == "2") //删除图片
            {
                //获取传递过来的参数
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //删除图片
                return BusiUploadFileData.delDataDistriShopLogoImgApi(UploadGuid);
            }
            return "";
        }

        /// <summary>
        /// 【分销店铺头像图片】相关操作
        /// </summary>
        /// <returns></returns>
        public string DistriShopHeaderImg()
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
                return BusiUploadFile.uploadDistriShopHeaderImg(UserID, UploadGuid);
            }
            else if (_exeType == "2") //删除图片
            {
                //获取传递过来的参数
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //删除图片
                return BusiUploadFileData.delDataDistriShopHeaderImgApi(UploadGuid);
            }

            return "";
        }

        /// <summary>
        /// 【分销店铺身份证照片】相关操作
        /// </summary>
        /// <returns></returns>
        public string DistriIDCardImg()
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
                return BusiUploadFile.uploadDistriIDCardImg(UserID, UploadGuid);
            }
            else if (_exeType == "2") //删除图片
            {
                //获取传递过来的参数
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //删除图片
                return BusiUploadFileData.delDataDistriIDCardImgApi(UploadGuid);
            }

            return "";
        }

        /// <summary>
        /// 【分销店铺拥有者拍照照片_表 ( Distri_OwnerSelfieImg )】相关操作
        /// </summary>
        /// <returns></returns>
        public string DistriOwnerSelfieImg()
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
                return BusiUploadFile.uploadDistriOwnerSelfieImg(UserID, UploadGuid);
            }
            else if (_exeType == "2") //删除图片
            {
                //获取传递过来的参数
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //删除图片
                return BusiUploadFileData.delDataDistriOwnerSelfieImgApi(UploadGuid);
            }

            return "";
        }



    }
}