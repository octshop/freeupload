using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BusiApiKeyVerifyNS;
using OctFileUploadSystemNS;
using PublicClassNS;

/// <summary>
/// 【文件IO操作】相关文件上传的API接口控制器
/// </summary>
namespace OctFileUploadSystemWeb.PageControllers.ApiPage
{
    public class FileIOController : Controller
    {
        // GET: FileIO
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 删除单个或多个文件  
        /// </summary>
        /// <returns></returns>
        public string DelFileByPathArr()
        {
            
            ModelJsonBack _modelJsonBack = new ModelJsonBack();

            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                _modelJsonBack.ErrCode = "DFBPA_02";
                _modelJsonBack.ErrMsg = "删除失败,签名错误";

                return ModelJsonBack.convertModelToJson(_modelJsonBack);
            }

            //获取传递过来的参数
            //文件相对路径的拼接字符串组合 如[Upload/ShopAlbumImg/SAI_4_201908061442456750.jpg ^ Upload/ShopAlbumImg/SAI_4_201908061442536160.jpg ^ Upload/ShopAlbumImg/SAI_4_201908061508191120.jpg]
            string FilePathArr = PublicClass.FilterRequestTrim("FilePathArr");
            FilePathArr = PublicClass.RemoveFrontAndBackChar(FilePathArr, "^");
            if (string.IsNullOrWhiteSpace(FilePathArr))
            {
                return "";
            }

            //判断是否为多个
            if (FilePathArr.IndexOf("^") >= 0)
            {
                string[] _pathArr = FilePathArr.Split('^');
                for (int i = 0; i < _pathArr.Length; i++)
                {
                    //删除文件
                    PublicClass.delFileSingle(_pathArr[i]);
                }
            }
            else
            {
                //删除文件
                PublicClass.delFileSingle(FilePathArr);
            }

            //删除成功
            _modelJsonBack.Code = "DFBPA_01";
            _modelJsonBack.Msg = "删除成功";

            return ModelJsonBack.convertModelToJson(_modelJsonBack);
        }


    }
}