using BusiApiKeyVerifyNS;
using OctFileUploadSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【商家】相关文件上传的API接口控制器
/// </summary>
namespace OctFileUploadSystemWeb.PageControllers.ApiPage
{
    public class ShopController : Controller
    {
        // GET: Shop
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 【店铺头像图片】相关操作
        /// </summary>
        /// <returns></returns>
        public string ShopHeaderImg()
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
                return BusiUploadFile.uploadShopHeaderImg(UserID, UploadGuid);
            }
            else if (_exeType == "2") //删除图片
            {
                //获取传递过来的参数
                string UploadGuidArr = PublicClass.FilterRequestTrim("UploadGuidArr");

                //删除
                return BusiUploadFileData.delDataShopHeaderImgApi(UploadGuidArr);
            }

            return "";
        }

        /// <summary>
        /// 【店铺Logo门头图片】相关操作
        /// </summary>
        /// <returns></returns>
        public string ShopLogoImg()
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

                ModelJsonBack _modelJsonBack = new ModelJsonBack();
                //查询上传的店铺门头是否超出了限制张数
                int _maxUploadNum = BusiSqlData.countTableRecordProce("Shop_LogoImg", "UserID=" + UserID + "", "UploadID");
                if (_maxUploadNum >= WebAppConfig.ShopLogoImgMaxUploadNum)
                {
                    _modelJsonBack.ErrCode = "14";
                    _modelJsonBack.ErrMsg = "店铺门头照最多上传 " + WebAppConfig.ShopLogoImgMaxUploadNum + " 张！";
                    //返回Json
                    return ModelJsonBack.convertModelToJson(_modelJsonBack);
                }
                //调用上传函数
                return BusiUploadFile.uploadShopLogoImg(UserID, UploadGuid);
            }
            else if (_exeType == "2") //删除图片
            {
                //获取传递过来的参数
                string UploadGuidArr = PublicClass.FilterRequestTrim("UploadGuidArr");

                //【店铺Logo门头图片】 删除
                return BusiUploadFileData.delDataShopLogoImgApi(UploadGuidArr);
            }

            return "";
        }

        /// <summary>
        /// 【商家相册】相关操作
        /// </summary>
        /// <returns></returns>
        public string ShopAlbum()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型 Type=1 新建相册 Type=2 修改相册信息 Type=3 删除相册 Type=4 加载商家相册列表 Type=5 数据分页 Type=6 初始化相册信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string AlbumTitle = PublicClass.FilterRequestTrim("AlbumTitle");
                string AlbumDesc = PublicClass.FilterRequestTrim("AlbumDesc");
                if (string.IsNullOrWhiteSpace(AlbumTitle))
                {
                    return "";
                }

                //添加商家相册
                return BusiShop.addShopAlbumApi(Convert.ToInt64(ShopUserID), AlbumTitle, AlbumDesc);
            }
            if (_exeType == "2") //修改相册信息
            {
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string AlbumID = PublicClass.FilterRequestTrim("AlbumID");
                string AlbumTitle = PublicClass.FilterRequestTrim("AlbumTitle");
                string AlbumDesc = PublicClass.FilterRequestTrim("AlbumDesc");

                //防止数据类型为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //编辑商家相册信息
                return BusiShop.editShopAlbumApi(Convert.ToInt64(AlbumID), AlbumTitle, AlbumDesc, Convert.ToInt64(ShopUserID));
            }
            else if (_exeType == "3") //删除相册
            {
                string AlbumID = PublicClass.FilterRequestTrim("AlbumID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //防止数字类型为空
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //删除商家相册
                return BusiShop.delShopAlbumApi(Convert.ToInt64(AlbumID), Convert.ToInt64(ShopUserID));
            }
            else if (_exeType == "4") //加载商家相册列表
            {
                //获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");
                //得到商家所有的相册信息
                return BusiShop.getShopAlbumAllApi(Convert.ToInt64(UserID));
            }
            else if (_exeType == "5") //数据分页
            {
                // 获取传递的参数
                string AlbumID = PublicClass.FilterRequestTrim("AlbumID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string AlbumTitle = PublicClass.FilterRequestTrim("AlbumTitle");
                string AlbumDesc = PublicClass.FilterRequestTrim("AlbumDesc");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                AlbumID = PublicClass.preventNumberDataIsNull(AlbumID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelShopAlbum _modelShopAlbum = new ModelShopAlbum();
                _modelShopAlbum.AlbumID = Convert.ToInt64(AlbumID);
                _modelShopAlbum.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelShopAlbum.AlbumTitle = AlbumTitle;
                _modelShopAlbum.AlbumDesc = AlbumDesc;
                _modelShopAlbum.IsLock = IsLock;
                _modelShopAlbum.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "IsLock", "WriteDate", "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONShopAlbum(_modelShopAlbum, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "6") //初始化相册信息
            {
                // 获取传递的参数
                string AlbumID = PublicClass.FilterRequestTrim("AlbumID");

                //得到相册信息
                ModelShopAlbum _modelShopAlbum = BusiGetData.getModelShopAlbum(Convert.ToInt64(AlbumID));
                //构造Json
                string _json = BusiJsonBuilder.jsonModel(_modelShopAlbum, true, new string[] { "ShopUserID", "IsLock", "WriteDate", "PageOrder" });
                return _json;
            }

            return "";
        }

        /// <summary>
        /// 【商家相册图片】相关操作
        /// </summary>
        /// <returns></returns>
        public string ShopAlbumImg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型 Type=1 上传图片 Type=2 删除相册图片 Type=3 备注图片 Type=4 相册图片数据分页 Type=5 批量删除相册图片
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string AlbumID = PublicClass.FilterRequestTrim("AlbumID");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //调用上传函数
                return BusiUploadFile.uploadShopAlbumImg(AlbumID, UploadGuid);
            }
            else if (_exeType == "2") //删除相册图片
            {
                string AlbumImgID = PublicClass.FilterRequestTrim("AlbumImgID");

                //删除相册图片信息
                return BusiShop.delShopAlbumImgApi(Convert.ToInt64(AlbumImgID));
            }
            else if (_exeType == "3") //备注图片
            {
                string AlbumImgID = PublicClass.FilterRequestTrim("AlbumImgID");
                string ImgMemo = PublicClass.FilterRequestTrim("ImgMemo");

                //备注相册图片
                return BusiShop.memoShopAlbumImgApi(Convert.ToInt64(AlbumImgID), ImgMemo);
            }
            else if (_exeType == "4") //相册图片数据分页
            {
                // 获取传递的参数
                string AlbumID = PublicClass.FilterRequestTrim("AlbumID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string ImgKeyGuid = PublicClass.FilterRequestTrim("ImgKeyGuid");
                string ServerDomain = PublicClass.FilterRequestTrim("ServerDomain");
                string ImgPath = PublicClass.FilterRequestTrim("ImgPath");
                string ImgMemo = PublicClass.FilterRequestTrim("ImgMemo");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                AlbumID = PublicClass.preventNumberDataIsNull(AlbumID);
                ShopUserID = PublicClass.preventNumberDataIsNull(ShopUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelShopAlbumImg _modelShopAlbumImg = new ModelShopAlbumImg();
                _modelShopAlbumImg.AlbumID = Convert.ToInt64(AlbumID);
                _modelShopAlbumImg.ShopUserID = Convert.ToInt64(ShopUserID);
                _modelShopAlbumImg.ImgKeyGuid = ImgKeyGuid;
                _modelShopAlbumImg.ServerDomain = ServerDomain;
                _modelShopAlbumImg.ImgPath = ImgPath;
                _modelShopAlbumImg.ImgMemo = ImgMemo;
                _modelShopAlbumImg.IsLock = IsLock;
                _modelShopAlbumImg.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "IsLock", "WriteDate", "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONShopAlbumImg(_modelShopAlbumImg, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "5") //批量删除相册图片
            {
                // 获取传递的参数
                string AlbumImgIDArr = PublicClass.FilterRequestTrim("AlbumImgIDArr");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //调用 删除 相册图片信息 --API调用方法
                string _jsonBack = BusiShop.delShopAlbumImgArrApi(AlbumImgIDArr, Convert.ToInt64(ShopUserID));
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 【店铺轮播图片】 相关操作
        /// </summary>
        /// <returns></returns>
        public string ShopCarouselImg()
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
                string UserID = PublicClass.FilterRequestTrim("UserID");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //调用上传函数
                return BusiUploadFile.uploadShopCarouselImg(UserID, UploadGuid);
            }
            else if (_exeType == "2") //删除图片
            {
                //获取传递过来的参数
                string UploadGuidArr = PublicClass.FilterRequestTrim("UploadGuidArr");

                //删除图片
                return BusiUploadFileData.delDataShopCarouselImgApi(UploadGuidArr);
            }
            else if (_exeType == "3") //删除因重复上传导致的多余活动图片
            {
                //获取传递过来的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");

                //删除因重复上传导致的多余礼品图片 --API调用方法
                return BusiShop.delShopCarouselImgRepeatApi(Convert.ToInt64(UserID));
            }
            else if (_exeType == "4") //图片数据分页
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
                ModelShopCarouselImgFU _modelShopCarouselImg = new ModelShopCarouselImgFU();
                _modelShopCarouselImg.UserID = Convert.ToInt64(UserID);
                _modelShopCarouselImg.ImgKeyGuid = ImgKeyGuid;
                _modelShopCarouselImg.ServerDomain = ServerDomain;
                _modelShopCarouselImg.ImgPath = ImgPath;
                _modelShopCarouselImg.IsLock = IsLock;
                _modelShopCarouselImg.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "IsLock", "WriteDate", "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONShopCarouselImg(_modelShopCarouselImg, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }


            return "";
        }

        /// <summary>
        /// 【店铺类目的ICON图标】相关操作
        /// </summary>
        /// <returns></returns>
        public string ShopTypeIcon()
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
                return BusiUploadFile.uploadShopTypeIcon(MsgID, UploadGuid);
            }
            else if (_exeType == "2") //删除图片
            {
                //获取传递过来的参数
                string ShopTypeID = PublicClass.FilterRequestTrim("ShopTypeID"); //[GoodsTypeID 商品类目ID]
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //删除
                return BusiUploadFileData.delDataShopTypeIconApi(ShopTypeID, UploadGuid);
            }
            else if (_exeType == "3") //保存类目ID到图片信息表中
            {
                //获取传递过来的参数
                string ShopTypeID = PublicClass.FilterRequestTrim("ShopTypeID"); //[ShopTypeID 店铺类目ID]
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");

                //将GoodsTypeID更新到类目图标信息表中
                return BusiGoods.saveShopTypeIDToTypeIconApi(Convert.ToInt64(ShopTypeID), UploadGuid);
            }

            return "";
        }

        /// <summary>
        /// 结算商家 营业执照照片
        /// </summary>
        /// <returns></returns>
        public string SettleCertificateImg()
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
                return BusiUploadFile.uploadSettleCertificateImg(UserID, UploadGuid);
            }
            else if (_exeType == "2") //删除图片
            {
                //获取传递过来的参数
                string UploadGuidArr = PublicClass.FilterRequestTrim("UploadGuidArr");

                //删除
                return BusiUploadFileData.delDataSettleCertificateImgApi(UploadGuidArr);
            }


            return "";
        }

        /// <summary>
        /// 结算转账凭证照片
        /// </summary>
        /// <returns></returns>
        public string SettleTransferVoucherImg()
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
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData"); //结算单ID
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");
                //string UpType = PublicClass.FilterRequestTrim("UpType");

                //调用上传函数
                return BusiUploadFile.uploadSettleTransferVoucherImg(ExtraData, UploadGuid);
            }
            else if (_exeType == "2") //删除图片
            {
                //获取传递过来的参数
                string UploadGuidArr = PublicClass.FilterRequestTrim("UploadGuidArr");

                //删除
                return BusiUploadFileData.delDataSettleTransferVoucherImgApi(UploadGuidArr);
            }

            return "";
        }

    }
}