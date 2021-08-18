using BusiRndKeyNS;
using BusiRndKeyUploadNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


/// <summary>
/// 【OctFileUploadSystem (文件上传系统)】Ajax接口调用控制器
/// </summary>
namespace OctCmsSystemWeb.PageControllers.AjaxPage
{
    public class FileUploadController : Controller
    {
        // GET: FileUpload
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 【商品类目的ICON图标】相关操作
        /// </summary>
        /// <returns></returns>
        public string GooGoodsTypeIcon()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }



            //获取操作类型  Type=1 上传 图标
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string MsgID = PublicClass.FilterRequestTrim("MsgID");

                //创建GUID
                string _guid = PublicClass.CreateNewGuid();

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("Type", "1"); //操作类型 Type=1 上传
                _dic.Add("MsgID", MsgID); //商品类目ID
                _dic.Add("UploadGuid", _guid);

                //调用上传函数
                return BusiRndKeyUpload.httpNoLoginRndKeyRsaUpload(WebAppConfig.ApiUrl_FU_GooGoodsTypeIcon, "FU_GooGoodsTypeIcon", _dic);
            }


            return "";
        }

        /// <summary>
        /// 【店铺类目的ICON图标】相关操作
        /// </summary>
        /// <returns></returns>
        public string ShopTypeIcon()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 上传 图标
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string MsgID = PublicClass.FilterRequestTrim("MsgID");

                //创建GUID
                string _guid = PublicClass.CreateNewGuid();

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("Type", "1"); //操作类型 Type=1 上传
                _dic.Add("MsgID", MsgID); //店铺类目ID
                _dic.Add("UploadGuid", _guid);

                //调用上传函数
                return BusiRndKeyUpload.httpNoLoginRndKeyRsaUpload(WebAppConfig.ApiUrl_FU_ShopTypeIcon, "FU_ShopTypeIcon", _dic);
            }


            return "";
        }

        /// <summary>
        /// 上传店铺头像图片
        /// </summary>
        /// <returns></returns>
        public string ShopHeaderImg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 上传图片
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");

                //创建GUID
                string _guid = PublicClass.CreateNewGuid();

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("Type", "1"); //操作类型 Type=1 上传
                _dic.Add("UserID", UserID); //店铺ID
                _dic.Add("UploadGuid", _guid);

                //调用上传函数
                return BusiRndKeyUpload.httpNoLoginRndKeyRsaUpload(WebAppConfig.ApiUrl_FU_ShopHeaderImg, "FU_ShopHeaderImg", _dic);
            }


            return "";
        }

        /// <summary>
        /// 上传店铺门头照图片
        /// </summary>
        /// <returns></returns>
        public string ShopLogoImg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 上传图片
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");

                //创建GUID
                string _guid = PublicClass.CreateNewGuid();

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("Type", "1"); //操作类型 Type=1 上传
                _dic.Add("UserID", UserID); //店铺ID
                _dic.Add("UploadGuid", _guid);

                //调用上传函数
                return BusiRndKeyUpload.httpNoLoginRndKeyRsaUpload(WebAppConfig.ApiUrl_FU_ShopLogoImg, "FU_ShopLogoImg", _dic);
            }

            return "";
        }

        /// <summary>
        /// 上传公司证件资质图片
        /// </summary>
        /// <returns></returns>
        public string CompanyCertificateImg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 上传图片 Type=2 删除上传服务器上的图片
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string UserID = PublicClass.FilterRequestTrim("UserID");

                //创建GUID
                string _guid = PublicClass.CreateNewGuid();

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("Type", "1"); //操作类型 Type=1 上传
                _dic.Add("UserID", UserID); //店铺ID
                _dic.Add("UploadGuid", _guid);

                //调用上传函数
                return BusiRndKeyUpload.httpNoLoginRndKeyRsaUpload(WebAppConfig.ApiUrl_FU_CompanyCertificateImg, "FU_CompanyCertificateImg", _dic);
            }
            else if (_exeType == "2") //删除上传服务器上的图片
            {
                //获取传递的参数
                string UploadGuidArr = PublicClass.FilterRequestTrim("UploadGuidArr");

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UploadGuidArr", UploadGuidArr);

                //调用上传函数
                return BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_FU_CompanyCertificateImg, "FU_CompanyCertificateImg", "2", _dic);
            }

            return "";
        }

        /// <summary>
        /// 轮播图片广告
        /// </summary>
        /// <returns></returns>
        public string AdvCarouselImg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 上传图片 Type=2 删除已上传没保存的图片
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string AdvType = PublicClass.FilterRequestTrim("AdvType");
                //创建GUID
                string _guid = PublicClass.CreateNewGuid();

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("Type", "1"); //操作类型 Type=1 上传
                _dic.Add("ExtraData", AdvType); // AdvType 广告的类型 ( Home 首页轮播 HomeNear 附近首页 )
                _dic.Add("UploadGuid", _guid);

                //调用上传函数
                return BusiRndKeyUpload.httpNoLoginRndKeyRsaUpload(WebAppConfig.ApiUrl_FU_AdvCarouselImg, "FU_AdvCarouselImg", _dic);
            }
            else if (_exeType == "2") //删除已上传没保存的图片
            {
                //获取传递过来的参数
                string ImgKeyGuid = PublicClass.FilterRequestTrim("ImgKeyGuid");

                //获取【上传文件系统 域名列表数组】
                string[] _octFileUploadSystemWebDomainListArr = WebAppConfig.OctFileUploadSystemWebDomainListArr;
                //向每个上传文件系统发送Http请求
                for (int i = 0; i < _octFileUploadSystemWebDomainListArr.Length; i++)
                {
                    //定义POST参数
                    Dictionary<string, string> _dic = new Dictionary<string, string>();
                    _dic.Add("UploadGuidArr", ImgKeyGuid);

                    try
                    {
                        //调用上传函数
                        string _backMsg = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(_octFileUploadSystemWebDomainListArr[i] + "/Adv/AdvCarouselImg", "FU_AdvCarouselImg", "2", _dic);
                    }
                    catch
                    {
                        continue;
                    }
                }

                return "SUCCESS";

            }


            return "";
        }

        /// <summary>
        /// 横幅通栏广告
        /// </summary>
        /// <returns></returns>
        public string AdvBannerImg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 上传图片 Type=2 删除已上传没保存的图片 Type=3 删除因重复上传导致的多余图片 Type=4 图片数据分页
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string AdvType = PublicClass.FilterRequestTrim("AdvType");
                //创建GUID
                string _guid = PublicClass.CreateNewGuid();

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("Type", "1"); //操作类型 Type=1 上传
                _dic.Add("ExtraData", AdvType); // AdvType 广告的类型 ( Home 首页轮播 HomeNear 附近首页 )
                _dic.Add("UploadGuid", _guid);

                //调用上传函数
                return BusiRndKeyUpload.httpNoLoginRndKeyRsaUpload(WebAppConfig.ApiUrl_FU_AdvBannerImg, "FU_AdvBannerImg", _dic);
            }
            else if (_exeType == "2") //删除已上传没保存的图片
            {
                //获取传递过来的参数
                string ImgKeyGuid = PublicClass.FilterRequestTrim("ImgKeyGuid");

                //获取【上传文件系统 域名列表数组】
                string[] _octFileUploadSystemWebDomainListArr = WebAppConfig.OctFileUploadSystemWebDomainListArr;
                //向每个上传文件系统发送Http请求
                for (int i = 0; i < _octFileUploadSystemWebDomainListArr.Length; i++)
                {
                    //定义POST参数
                    Dictionary<string, string> _dic = new Dictionary<string, string>();
                    _dic.Add("UploadGuidArr", ImgKeyGuid);

                    try
                    {
                        //调用上传函数
                        string _backMsg = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(_octFileUploadSystemWebDomainListArr[i] + "/Adv/AdvBannerImg", "FU_AdvBannerImg", "2", _dic);
                    }
                    catch
                    {
                        continue;
                    }
                }

                return "SUCCESS";

            }
            return "";
        }

        /// <summary>
        /// 图片列表广告
        /// </summary>
        /// <returns></returns>
        public string AdvImgListImg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 上传图片 Type=2 删除已上传没保存的图片 Type=3 删除因重复上传导致的多余图片 Type=4 图片数据分页
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string AdvType = PublicClass.FilterRequestTrim("AdvType");
                //创建GUID
                string _guid = PublicClass.CreateNewGuid();

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("Type", "1"); //操作类型 Type=1 上传
                _dic.Add("ExtraData", AdvType); // 广告的类型 ( AdvB2c 线上B2C， AdvO2o 线下O2O )
                _dic.Add("UploadGuid", _guid);

                //调用上传函数
                return BusiRndKeyUpload.httpNoLoginRndKeyRsaUpload(WebAppConfig.ApiUrl_FU_AdvImgListImg, "FU_AdvImgListImg", _dic);
            }
            else if (_exeType == "2") //删除已上传没保存的图片
            {
                //获取传递过来的参数
                string ImgKeyGuid = PublicClass.FilterRequestTrim("ImgKeyGuid");

                //获取【上传文件系统 域名列表数组】
                string[] _octFileUploadSystemWebDomainListArr = WebAppConfig.OctFileUploadSystemWebDomainListArr;
                //向每个上传文件系统发送Http请求
                for (int i = 0; i < _octFileUploadSystemWebDomainListArr.Length; i++)
                {
                    //定义POST参数
                    Dictionary<string, string> _dic = new Dictionary<string, string>();
                    _dic.Add("UploadGuidArr", ImgKeyGuid);

                    try
                    {
                        //调用上传函数
                        string _backMsg = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(_octFileUploadSystemWebDomainListArr[i] + "/Adv/AdvImgListImg", "FU_AdvImgListImg", "2", _dic);
                    }
                    catch
                    {
                        continue;
                    }
                }

                return "SUCCESS";

            }
            return "";
        }

        /// <summary>
        /// 【栏目图标导航图片】 相关操作
        /// </summary>
        /// <returns></returns>
        public string NavIconImg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }



            //获取操作类型  Type=1 上传图片 Type=2 删除已上传没保存的图片
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数 
                //导航类型 MallIndex  线上首页, O2oIndex 附近首页  O2oGoodsIndex 同城优选
                string NavType = PublicClass.FilterRequestTrim("NavType");
                //创建GUID
                string _guid = PublicClass.CreateNewGuid();

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("Type", "1"); //操作类型 Type=1 上传
                _dic.Add("ExtraData", NavType); // 广告的类型 ( AdvB2c 线上B2C， AdvO2o 线下O2O )
                _dic.Add("UploadGuid", _guid);

                //调用上传函数
                return BusiRndKeyUpload.httpNoLoginRndKeyRsaUpload(WebAppConfig.ApiUrl_FU_NavIconImg, "FU_NavIconImg", _dic);
            }
            else if (_exeType == "2") //删除已上传没保存的图片
            {
                //获取传递过来的参数
                string ImgKeyGuid = PublicClass.FilterRequestTrim("ImgKeyGuid");

                //获取【上传文件系统 域名列表数组】
                string[] _octFileUploadSystemWebDomainListArr = WebAppConfig.OctFileUploadSystemWebDomainListArr;
                //向每个上传文件系统发送Http请求
                for (int i = 0; i < _octFileUploadSystemWebDomainListArr.Length; i++)
                {
                    //定义POST参数
                    Dictionary<string, string> _dic = new Dictionary<string, string>();
                    _dic.Add("UploadGuidArr", ImgKeyGuid);

                    try
                    {
                        //调用上传函数
                        string _backMsg = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(_octFileUploadSystemWebDomainListArr[i] + "/Adv/NavIconImg", "FU_NavIconImg", "2", _dic);
                    }
                    catch
                    {
                        continue;
                    }
                }

                return "SUCCESS";

            }
            return "";
        }

        /// <summary>
        /// 结算转账凭证照片
        /// </summary>
        /// <returns></returns>
        public string SettleTransferVoucherImg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 上传图片
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");

                //创建GUID
                string _guid = PublicClass.CreateNewGuid();

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("Type", "1"); //操作类型 Type=1 上传
                _dic.Add("ExtraData", ExtraData); //店铺ID
                _dic.Add("UploadGuid", _guid);

                //调用上传函数
                return BusiRndKeyUpload.httpNoLoginRndKeyRsaUpload(WebAppConfig.ApiUrl_FU_SettleTransferVoucherImg, "FU_SettleTransferVoucherImg", _dic);
            }


            return "";
        }

        /// <summary>
        /// 上传【说明性文本图片】相关操作
        /// </summary>
        /// <returns></returns>
        public string ExplainImg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 上传图片 Type=2 删除已上传没保存的图片 Type=3 图片数据分页
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string ExplainType = PublicClass.FilterRequestTrim("ExplainType");
                //创建GUID
                string _guid = PublicClass.CreateNewGuid();

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("Type", "1"); //操作类型 Type=1 上传

                //说明文本类型 ( VipLevel^CreditScore会员等级信用分说明 ServiceTel 各种平台联系电话  Question 说明性问题 )
                _dic.Add("ExtraData", ExplainType);

                _dic.Add("UploadGuid", _guid);

                //调用上传函数
                return BusiRndKeyUpload.httpNoLoginRndKeyRsaUpload(WebAppConfig.ApiUrl_FU_ExplainImg, "FU_ExplainImg", _dic);
            }
            else if (_exeType == "2") //删除已上传没保存的图片
            {
                //获取传递过来的参数
                string ImgKeyGuid = PublicClass.FilterRequestTrim("ImgKeyGuid");

                //获取【上传文件系统 域名列表数组】
                string[] _octFileUploadSystemWebDomainListArr = WebAppConfig.OctFileUploadSystemWebDomainListArr;
                //向每个上传文件系统发送Http请求
                for (int i = 0; i < _octFileUploadSystemWebDomainListArr.Length; i++)
                {
                    //定义POST参数
                    Dictionary<string, string> _dic = new Dictionary<string, string>();
                    _dic.Add("UploadGuidArr", ImgKeyGuid);

                    try
                    {
                        //调用上传函数
                        string _backMsg = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(_octFileUploadSystemWebDomainListArr[i] + "/Explain/ExplainImg", "FU_ExplainImg", "2", _dic);
                    }
                    catch
                    {
                        continue;
                    }
                }

                return "SUCCESS";

            }
            else if (_exeType == "3") //图片数据分页
            {
                // 获取传递的参数
                string ImgKeyGuid = PublicClass.FilterRequestTrim("ImgKeyGuid");
                string ServerDomain = PublicClass.FilterRequestTrim("ServerDomain");
                string ImgPath = PublicClass.FilterRequestTrim("ImgPath");
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");


                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", PageCurrent);
                _dic.Add("ImgKeyGuid", ImgKeyGuid);
                _dic.Add("ServerDomain", ServerDomain);
                _dic.Add("ImgPath", ImgPath);
                _dic.Add("ExtraData", ExtraData);
                _dic.Add("IsLock", "false");

                //发送Http请求
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_FU_ExplainImg, "FU_ExplainImg", "3", _dic);
                return _jsonBack;
            }

            return "";
        }


    }
}