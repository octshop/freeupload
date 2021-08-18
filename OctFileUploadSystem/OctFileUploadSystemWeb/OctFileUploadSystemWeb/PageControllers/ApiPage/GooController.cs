using BusiApiKeyVerifyNS;
using OctFileUploadSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【商品】相关文件上传的API接口控制器
/// </summary>
namespace OctFileUploadSystemWeb.PageControllers.ApiPage
{
    public class GooController : Controller
    {
        // GET: Goo
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 【晒单图片】相关操作
        /// </summary>
        /// <returns></returns>
        public string GooAppraiseImg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型 Type=1 上传图片 Type=2 删除图片 Type=3 删除指定文件名的单张商品评价图片
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递过来的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //调用上传函数
                return BusiUploadFile.uploadGooAppraiseImg(UserID, UploadGuid);
            }
            else if (_exeType == "2") //删除图片
            {
                //获取传递过来的参数
                string UploadGuidArr = PublicClass.FilterRequestTrim("UploadGuidArr");

                //【晒单(评价)图片】 删除
                return BusiUploadFileData.delDataGooAppraiseImgApi(UploadGuidArr);
            }
            else if (_exeType == "3") //删除指定文件名的单张商品评价图片
            {
                //获取传递过来的参数
                string ImgKeyGuid = PublicClass.FilterRequestTrim("ImgKeyGuid");
                string ImgPath = PublicClass.FilterRequestTrimNoConvert("ImgPath");

                //删除指定文件名的单张商品评价图片
                string _jsonBack = BusiUploadFileData.delDataGooAppraiseImgSingleApi(ImgKeyGuid, ImgPath);
                return _jsonBack;
            }


            return "";
        }

        /// <summary>
        /// 【赠品 图片】相关操作
        /// </summary>
        /// <returns></returns>
        public string GooGiftImg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型 Type=1 上传图片 Type=2 删除图片 Type=3 批量编辑图片信息更新ID  Type=4 赠品图片数据分页  Type=5 删除因重复上传导致的多余赠品图片
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递过来的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //调用上传函数
                return BusiUploadFile.uploadGooGiftImg(UserID, UploadGuid);
            }
            else if (_exeType == "2") //删除图片
            {
                //获取传递过来的参数
                string UploadGuidArr = PublicClass.FilterRequestTrim("UploadGuidArr");

                //【赠品图片】 删除
                return BusiUploadFileData.delDataGooGiftImgApi(UploadGuidArr);
            }
            else if (_exeType == "3") //批量编辑图片信息更新ID
            {
                //获取传递过来的参数
                string GiftID = PublicClass.FilterRequestTrim("GiftID"); //赠品ID
                string UploadGuidArr = PublicClass.FilterRequestTrim("UploadGuidArr");

                //【赠品 图片】批量编辑图片信息更新ID
                return BusiUploadFileData.editDataGooGiftImgApi(GiftID, UploadGuidArr);
            }
            else if (_exeType == "4") //赠品图片 数据分页
            {
                // 获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string ImgKeyGuid = PublicClass.FilterRequestTrim("ImgKeyGuid");
                string ServerDomain = PublicClass.FilterRequestTrim("ServerDomain");
                string ImgPath = PublicClass.FilterRequestTrim("ImgPath");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                UserID = PublicClass.preventNumberDataIsNull(UserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelGooGiftImgFU _modelGooGiftImg = new ModelGooGiftImgFU();
                _modelGooGiftImg.UserID = Convert.ToInt64(UserID);
                _modelGooGiftImg.ImgKeyGuid = ImgKeyGuid;
                _modelGooGiftImg.ServerDomain = ServerDomain;
                _modelGooGiftImg.ImgPath = ImgPath;
                _modelGooGiftImg.IsLock = IsLock;
                _modelGooGiftImg.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "IsLock", "WriteDate", "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONGooGiftImg(_modelGooGiftImg, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "5") //删除因重复上传导致的多余赠品图片
            {
                //获取传递过来的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");

                //删除因重复上传导致的多余商品图片 --API调用方法
                return BusiGoods.delGiftImgRepeatApi(Convert.ToInt64(UserID));
            }

            return "";
        }

        /// <summary>
        /// 【礼品 图片】相关操作
        /// </summary>
        /// <returns></returns>
        public string PresentImg()
        {
            return "";
        }

        /// <summary>
        /// 【活动图片】 相关操作
        /// </summary>
        /// <returns></returns>
        public string ActivityImg()
        {
          

            return "";
        }

        /// <summary>
        /// 【抽奖图片】 相关操作
        /// </summary>
        /// <returns></returns>
        public string LuckyDrawImg()
        {
           

            return "";
        }

        /// <summary>
        /// 【商品图片】相关操作
        /// </summary>
        /// <returns></returns>
        public string GooGoodsImg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型 Type=1 上传图片 Type=2 删除图片  Type=3 删除因重复上传导致的多余商品图片 Type=4 商品图片数据分页
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递过来的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //调用上传函数
                return BusiUploadFile.uploadGooGoodsImg(UserID, UploadGuid);
            }
            else if (_exeType == "2") //删除图片
            {
                //获取传递过来的参数
                string UploadGuidArr = PublicClass.FilterRequestTrim("UploadGuidArr");

                //【商品图片】 删除
                return BusiUploadFileData.delDataGooGoodsImgApi(UploadGuidArr);
            }
            else if (_exeType == "3") //删除因重复上传导致的多余商品图片
            {
                //获取传递过来的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");

                //删除因重复上传导致的多余商品图片 --API调用方法
                return BusiGoods.delGoodsImgRepeatApi(Convert.ToInt64(UserID));
            }
            else if (_exeType == "4") //商品图片数据分页
            {
                // 获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string ImgKeyGuid = PublicClass.FilterRequestTrim("ImgKeyGuid");
                string ServerDomain = PublicClass.FilterRequestTrim("ServerDomain");
                string ImgPath = PublicClass.FilterRequestTrim("ImgPath");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                UserID = PublicClass.preventNumberDataIsNull(UserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelGooGoodsImgFU _modelGooGoodsImg = new ModelGooGoodsImgFU();
                _modelGooGoodsImg.UserID = Convert.ToInt64(UserID);
                _modelGooGoodsImg.ImgKeyGuid = ImgKeyGuid;
                _modelGooGoodsImg.ServerDomain = ServerDomain;
                _modelGooGoodsImg.ImgPath = ImgPath;
                _modelGooGoodsImg.IsLock = IsLock;
                _modelGooGoodsImg.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "IsLock", "WriteDate", "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONGooGoodsImg(_modelGooGoodsImg, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }

            return "";
        }

        /// <summary>
        /// 【商品类目的ICON图标】相关操作
        /// </summary>
        /// <returns></returns>
        public string GooGoodsTypeIcon()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型 Type=1 上传图片 Type=2 删除图片  Type=3 保存类目ID到图片信息表中
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递过来的参数
                string MsgID = PublicClass.FilterRequestTrim("MsgID"); // [GoodsTypeID 商品类目ID]
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //调用上传函数
                return BusiUploadFile.uploadGooGoodsTypeIcon(MsgID, UploadGuid);
            }
            else if (_exeType == "2") //删除图片
            {
                //获取传递过来的参数
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID"); //[GoodsTypeID 商品类目ID]
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //删除
                return BusiUploadFileData.delDataGooGoodsTypeIconApi(GoodsTypeID, UploadGuid);
            }
            else if (_exeType == "3") //保存类目ID到图片信息表中
            {
                //获取传递过来的参数
                string GoodsTypeID = PublicClass.FilterRequestTrim("GoodsTypeID"); //[GoodsTypeID 商品类目ID]
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //将GoodsTypeID更新到类目图标信息表中
                return BusiGoods.saveGoodsTypeIDToTypeIconApi(Convert.ToInt64(GoodsTypeID), UploadGuid);
            }

            return "";
        }

        /// <summary>
        /// 【商品规格图片】相关操作
        /// </summary>
        /// <returns></returns>
        public string GooSpecParamImg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型 Type=1 上传图片 Type=2 删除图片  Type=3 删除因重复上传导致的多余规格图片
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递过来的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //调用上传函数
                return BusiUploadFile.uploadGooSpecParamImg(UserID, UploadGuid);
            }
            else if (_exeType == "2") //删除图片
            {
                //获取传递过来的参数
                string UploadGuidArr = PublicClass.FilterRequestTrim("pUploadGuidArr");

                //【商品图片】 删除
                return BusiUploadFileData.delDataGooSpecParamImgApi(UploadGuidArr);
            }
            else if (_exeType == "3") //删除因重复上传导致的多余规格图片
            {
                //获取传递过来的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");

                //删除因重复上传导致的多余规格图片 --API调用方法
                return BusiGoods.delGooSpecParamImgRepeatApi(Convert.ToInt64(UserID));

            }

            return "";
        }



    }
}