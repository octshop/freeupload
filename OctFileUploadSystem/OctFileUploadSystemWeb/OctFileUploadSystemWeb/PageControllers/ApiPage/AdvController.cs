using BusiApiKeyVerifyNS;
using OctFileUploadSystemNS;
using PublicClassNS;
using System;
using System.Web.Mvc;

/// <summary>
/// 【广告系统】相关文件上传的API接口控制器
/// </summary>
namespace OctFileUploadSystemWeb.PageControllers.ApiPage
{
    public class AdvController : Controller
    {

        /// <summary>
        /// 【栏目图标导航图片】 相关操作
        /// </summary>
        /// <returns></returns>
        public string NavIconImg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型 Type=1 上传图片 Type=2 删除图片 Type=3 删除因重复上传导致的多余图片 Type=4 图片数据分页
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递过来的参数 
                //NavType 导航类型 ( Home B2C首页  Near 附近首页 )
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //调用上传函数
                return BusiUploadFile.uploadNavIconImg(ExtraData, UploadGuid);
            }
            else if (_exeType == "2") //删除图片
            {
                //获取传递过来的参数
                string UploadGuidArr = PublicClass.FilterRequestTrim("UploadGuidArr");

                //删除图片
                return BusiUploadFileData.delDataNavIconImgApi(UploadGuidArr);
            }
            else if (_exeType == "3") //删除因重复上传导致的多余图片
            {
                //获取传递过来的参数
                //NavType 导航类型 ( Home B2C首页  Near 附近首页 )
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");

                //删除因重复上传导致的多余图片 --API调用方法
                return BusiAdv.delNavIconImgRepeatApi(ExtraData);
            }
            else if (_exeType == "4") //图片数据分页
            {
                //// 获取传递的参数
                //string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                //string ImgKeyGuid = PublicClass.FilterRequestTrim("ImgKeyGuid");
                //string ServerDomain = PublicClass.FilterRequestTrim("ServerDomain");
                //string ImgPath = PublicClass.FilterRequestTrim("ImgPath");
                //string IsLock = PublicClass.FilterRequestTrim("IsLock");
                //string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                ////获取当前页数
                //string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                ////防止数字类型为空
                ////UserID = PublicClass.preventNumberDataIsNull(UserID);

                ////------------用实体类去限制的查询条件 AND 连接------------//
                //ModelNavIconImg _modelNavIconImg = new ModelNavIconImg();
                //_modelNavIconImg.ExtraData = ExtraData;
                //_modelNavIconImg.ImgKeyGuid = ImgKeyGuid;
                //_modelNavIconImg.ServerDomain = ServerDomain;
                //_modelNavIconImg.ImgPath = ImgPath;
                //_modelNavIconImg.IsLock = IsLock;
                //_modelNavIconImg.WriteDate = WriteDate;


                //// 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                //string _initSQLCharWhere = "";

                ////获取分页JSON数据字符串
                ////显示的字段值
                //string[] _showFieldArr = { "IsLock", "WriteDate", "PageOrder" };
                //string _strJson = BusiJsonPageStr.morePageJSONNavIconImg(_modelNavIconImg, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                ////输出前台显示代码
                //return _strJson;
            }


            return "";
        }


        /// <summary>
        /// 【轮播广告图片_表 ( Adv_CarouselImg )】 相关操作
        /// </summary>
        /// <returns></returns>
        public string AdvCarouselImg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型 Type=1 上传图片 Type=2 删除图片 Type=3 删除因重复上传导致的多余图片 Type=4 图片数据分页
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递过来的参数 
                //AdvType 广告的类型 ( Home 首页轮播 HomeNear 附近首页 )
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //调用上传函数
                return BusiUploadFile.uploadAdvCarouselImg(ExtraData, UploadGuid);
            }
            else if (_exeType == "2") //删除图片
            {
                //获取传递过来的参数
                string UploadGuidArr = PublicClass.FilterRequestTrim("UploadGuidArr");

                //删除图片
                return BusiUploadFileData.delDataAdvCarouselImgApi(UploadGuidArr);
            }
            else if (_exeType == "3") //删除因重复上传导致的多余图片
            {
                //获取传递过来的参数
                //AdvType 广告的类型 ( Home 首页轮播 HomeNear 附近首页 )
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");

                //删除因重复上传导致的多余图片 --API调用方法
                return BusiAdv.delAdvCarouselImgRepeatApi(ExtraData);
            }
            else if (_exeType == "4") //图片数据分页
            {

            }


            return "";
        }


        /// <summary>
        ///【横幅通栏广告_表 ( Adv_BannerImg )】 相关操作
        /// </summary>
        /// <returns></returns>
        public string AdvBannerImg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型 Type=1 上传图片 Type=2 删除图片 Type=3 删除因重复上传导致的多余图片 Type=4 图片数据分页
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递过来的参数 
                //AdvType 广告的类型 ( Home 首页横幅， GoodsTypeShow 商品分类显示 )
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //调用上传函数
                return BusiUploadFile.uploadAdvBannerImg(ExtraData, UploadGuid);
            }
            else if (_exeType == "2") //删除图片
            {
                //获取传递过来的参数
                string UploadGuidArr = PublicClass.FilterRequestTrim("UploadGuidArr");

                //删除图片
                return BusiUploadFileData.delDataAdvBannerImgApi(UploadGuidArr);
            }
            else if (_exeType == "3") //删除因重复上传导致的多余图片
            {
                //获取传递过来的参数
                //AdvType 广告的类型 ( Home 首页横幅， GoodsTypeShow 商品分类显示 )
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");

                //删除因重复上传导致的多余图片 --API调用方法
                return BusiAdv.delAdvBannerImgRepeatApi(ExtraData);
            }
            else if (_exeType == "4") //图片数据分页
            {

            }


            return "";
        }


        /// <summary>
        ///【图片列表广告图片_表 ( Adv_ImgListImg )】 相关操作
        /// </summary>
        /// <returns></returns>
        public string AdvImgListImg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型 Type=1 上传图片 Type=2 删除图片 Type=3 删除因重复上传导致的多余图片 Type=4 图片数据分页
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递过来的参数 
                //AdvType 广告的类型 ( Home 首页广告图片列表， Near 附近页广告图片列表 )
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //调用上传函数
                return BusiUploadFile.uploadAdvImgListImg(ExtraData, UploadGuid);
            }
            else if (_exeType == "2") //删除图片
            {
                //获取传递过来的参数
                string UploadGuidArr = PublicClass.FilterRequestTrim("UploadGuidArr");

                //删除图片
                return BusiUploadFileData.delDataAdvImgListImgApi(UploadGuidArr);
            }
            else if (_exeType == "3") //删除因重复上传导致的多余图片
            {
                //获取传递过来的参数
                //AdvType 广告的类型 ( Home 首页广告图片列表， Near 附近页广告图片列表 )
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");

                //删除因重复上传导致的多余图片 --API调用方法
                return BusiAdv.delAdvImgListImgRepeatApi(ExtraData);
            }
            else if (_exeType == "4") //图片数据分页
            {

            }


            return "";
        }





    }
}