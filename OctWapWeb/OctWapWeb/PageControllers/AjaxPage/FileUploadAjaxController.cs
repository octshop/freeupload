using BusiRndKeyUploadNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【上传文件】相关Ajax控制器
/// </summary>
namespace OctWapWeb.PageControllers.AjaxPage
{
    public class FileUploadAjaxController : Controller
    {
        /// <summary>
        /// 上传商品晒单图片
        /// </summary>
        /// <returns></returns>
        public string GooAppraiseImg()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }

            //获取操作类型  Type=1  上传商品晒单图片 Type=2 删除商品晒单图片 Type=3 删除指定文件名的单张商品评价图片
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("Type", "1"); //操作类型 Type=1 上传
                _dic.Add("UserID", _loginBuyerUserID); //店铺ID
                _dic.Add("UploadGuid", UploadGuid);

                //调用上传函数
                return BusiRndKeyUpload.httpNoLoginRndKeyRsaUpload(WebAppConfig.ApiUrl_FU_GooAppraiseImg, "FU_GooAppraiseImg", _dic);
            }
            else if (_exeType == "2") //删除商品晒单图片
            {
                //获取传递的参数
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                //_dic.Add("Type", "2"); //操作类型 Type=1 上传
                _dic.Add("UploadGuidArr", UploadGuid);

                //调用上传函数
                return BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_FU_GooAppraiseImg, "FU_GooAppraiseImg", "2", _dic);
            }
            else if (_exeType == "3") //删除指定文件名的单张商品评价图片
            {
                //获取传递的参数
                string ImgKeyGuid = PublicClass.FilterRequestTrim("ImgKeyGuid");
                string ImgPath = PublicClass.FilterRequestTrimNoConvert("ImgPath");

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                //_dic.Add("Type", "2"); //操作类型 Type=1 上传
                _dic.Add("ImgKeyGuid", ImgKeyGuid);
                _dic.Add("ImgPath", ImgPath);

                //调用上传函数
                return BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_FU_GooAppraiseImg, "FU_GooAppraiseImg", "3", _dic);
            }


            return "";
        }


        /// <summary>
        /// 【售后问题图片】相关操作
        /// </summary>
        /// <returns></returns>
        public string AfterSaleProblemImgs()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }

            //获取操作类型  Type=1  上传售后问题图片 Type=2  Type=3 删除指定文件名的单张售后问题图片
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("Type", "1"); //操作类型 Type=1 上传
                _dic.Add("UserID", _loginBuyerUserID); //店铺ID
                _dic.Add("UploadGuid", UploadGuid);

                //调用上传函数
                return BusiRndKeyUpload.httpNoLoginRndKeyRsaUpload(WebAppConfig.ApiUrl_FU_AfterSaleProblemImgs, "FU_AfterSaleProblemImgs", _dic);
            }
            else if (_exeType == "2")
            {

            }
            else if (_exeType == "3") //删除指定文件名的单张售后问题图片
            {
                //获取传递的参数
                string ImgKeyGuid = PublicClass.FilterRequestTrim("ImgKeyGuid");
                string ImgPath = PublicClass.FilterRequestTrimNoConvert("ImgPath");

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                //_dic.Add("Type", "2"); //操作类型 Type=1 上传
                _dic.Add("ImgKeyGuid", ImgKeyGuid);
                _dic.Add("ImgPath", ImgPath);

                //调用上传函数
                return BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_FU_AfterSaleProblemImgs, "FU_AfterSaleProblemImgs", "3", _dic);
            }

            return "";
        }

    }
}