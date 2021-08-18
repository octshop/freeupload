using BusiApiKeyVerifyNS;
using OctFileUploadSystemNS;
using PublicClassNS;
using System;
using System.Web.Mvc;

/// <summary>
/// 【说明性文本信息】相关文件上传的API接口控制器
/// </summary>
namespace OctFileUploadSystemWeb.PageControllers.ApiPage
{
    public class ExplainController : Controller
    {
        /// <summary>
        /// 说明性文本图片
        /// </summary>
        /// <returns></returns>
        public string ExplainImg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型 Type=1 上传图片 Type=2 删除图片 Type=3 图片数据分页
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递过来的参数 

                //说明文本类型 
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //调用上传函数
                return BusiUploadFile.uploadExplainImg(ExtraData, UploadGuid);
            }
            else if (_exeType == "2") //删除图片
            {
                //获取传递过来的参数
                string UploadGuidArr = PublicClass.FilterRequestTrim("UploadGuidArr");

                //删除图片
                return BusiUploadFileData.delDataExplainImgApi(UploadGuidArr);
            }
            else if (_exeType == "3") //图片数据分页
            {
                // 获取传递的参数
                string UploadID = PublicClass.FilterRequestTrim("UploadID");
                string ImgKeyGuid = PublicClass.FilterRequestTrim("ImgKeyGuid");
                string ServerDomain = PublicClass.FilterRequestTrim("ServerDomain");
                string ImgPath = PublicClass.FilterRequestTrim("ImgPath");
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                UploadID = PublicClass.preventNumberDataIsNull(UploadID);
                UserID = PublicClass.preventNumberDataIsNull(UserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelExplainImgFU _modelExplainImg = new ModelExplainImgFU();
                _modelExplainImg.UploadID = Convert.ToInt64(UploadID);
                _modelExplainImg.ImgKeyGuid = ImgKeyGuid;
                _modelExplainImg.ServerDomain = ServerDomain;
                _modelExplainImg.ImgPath = ImgPath;
                _modelExplainImg.UserID = Convert.ToInt64(UserID);
                _modelExplainImg.ExtraData = ExtraData;
                _modelExplainImg.IsLock = IsLock;
                _modelExplainImg.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONExplainImg(_modelExplainImg, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }



            return "";
        }


    }
}