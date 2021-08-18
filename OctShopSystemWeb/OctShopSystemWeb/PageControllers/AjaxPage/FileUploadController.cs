using BusiHttpCodeNS;
using BusiRndKeyUploadNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【文件上传】相关Ajax请求控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.AjaxPage
{
    public class FileUploadController : Controller
    {
        // GET: FileUpload
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 【商品规格图片】上传
        /// </summary>
        /// <returns></returns>
        public string GooSpecParamImg()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }
            //获取商家登录UserID
            string mUserID = _loginBuyerUserID;


            //获取操作类型  Type=1 上传图片 Type=2 删除因重复上传导致的多余规格图片
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //创建GUID
                string _guid = PublicClass.CreateNewGuid();

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("Type", "1"); //操作类型 Type=1 上传
                _dic.Add("UserID", mUserID);
                _dic.Add("UploadGuid", _guid);

                //调用上传函数
                return BusiRndKeyUpload.httpNoLoginRndKeyRsaUpload(WebAppConfig.ApiUrl_FU_GooSpecParamImg, "FU_GooSpecParamImg", _dic);
            }
            else if (_exeType == "2") //删除因重复上传导致的多余规格图片
            {
                //获取【上传文件系统 域名列表数组】
                string[] _octFileUploadSystemWebDomainListArr = WebAppConfig.OctFileUploadSystemWebDomainListArr;
                //向每个上传文件系统发送Http请求
                for (int i = 0; i < _octFileUploadSystemWebDomainListArr.Length; i++)
                {
                    //定义POST参数
                    Dictionary<string, string> _dic = new Dictionary<string, string>();
                    _dic.Add("UserID", mUserID);

                    try
                    {
                        //调用上传函数
                        string _backMsg = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(_octFileUploadSystemWebDomainListArr[i] + "/Goo/GooSpecParamImg", "FU_GooSpecParamImg", "3", _dic);
                    }
                    catch
                    {
                        continue;
                    }
                }
            }


            return "";
        }

        /// <summary>
        /// 【商品图片】上传
        /// </summary>
        /// <returns></returns>
        public string GooGoodsImg()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }
            //获取商家登录UserID
            string mUserID = _loginBuyerUserID;


            //获取操作类型  Type=1 上传图片 Type=2 删除因重复上传导致的多余商品图片 Type=3 删除已上传没保存的商品图片【上传服务器上的图片】Type=4 商品图片数据分页
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //创建GUID
                string _guid = PublicClass.CreateNewGuid();

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("Type", "1"); //操作类型 Type=1 上传
                _dic.Add("UserID", mUserID);
                _dic.Add("UploadGuid", _guid);

                //调用上传函数
                return BusiRndKeyUpload.httpNoLoginRndKeyRsaUpload(WebAppConfig.ApiUrl_FU_GooGoodsImg, "FU_GooGoodsImg", _dic);
            }
            else if (_exeType == "2") //删除因重复上传导致的多余商品图片
            {
                //获取【上传文件系统 域名列表数组】
                string[] _octFileUploadSystemWebDomainListArr = WebAppConfig.OctFileUploadSystemWebDomainListArr;
                //向每个上传文件系统发送Http请求
                for (int i = 0; i < _octFileUploadSystemWebDomainListArr.Length; i++)
                {
                    //定义POST参数
                    Dictionary<string, string> _dic = new Dictionary<string, string>();
                    _dic.Add("UserID", mUserID);

                    try
                    {
                        //调用上传函数
                        string _backMsg = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(_octFileUploadSystemWebDomainListArr[i] + "/Goo/GooGoodsImg", "FU_GooGoodsImg", "3", _dic);
                    }
                    catch
                    {
                        continue;
                    }
                }
            }
            else if (_exeType == "3") //删除已上传没保存的商品图片【上传服务器上的图片】
            {
                //获取传递过来的参数
                string ImgKeyGuid = PublicClass.FilterRequestTrim("ImgKeyGuid");
                string DomainUpload = PublicClass.FilterRequestTrim("DomainUpload");

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UploadGuidArr", ImgKeyGuid);

                //调用上传函数
                string _backMsg = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(BusiHttpCode.getUploadHttpHeader() + DomainUpload + "/Goo/GooGoodsImg", "FU_GooGoodsImg", "2", _dic);
                return _backMsg;
            }
            else if (_exeType == "4") //商品图片数据分页
            {
                //获取传递的参数
                string pageCurrent = PublicClass.FilterRequestTrim("pageCurrent");

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UserID", mUserID);
                _dic.Add("IsLock", "false");
                _dic.Add("pageCurrent", pageCurrent);

                //发送Http请求
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_FU_GooGoodsImg, "FU_GooGoodsImg", "4", _dic);
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 【商家相册】
        /// </summary>
        /// <returns></returns>
        public string ShopAlbum()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }
            //获取商家登录UserID
            string mUserID = _loginBuyerUserID;


            //获取操作类型  Type=1 上传相册图片 Type=2 加载商家相册 Type=3 相册图片数据分页
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string AlbumID = PublicClass.FilterRequestTrim("AlbumID");

                //创建GUID
                string _guid = PublicClass.CreateNewGuid();

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("Type", "1"); //操作类型 Type=1 上传
                _dic.Add("UserID", mUserID);
                _dic.Add("AlbumID", AlbumID);
                _dic.Add("UploadGuid", _guid);

                //调用上传函数
                return BusiRndKeyUpload.httpNoLoginRndKeyRsaUpload(WebAppConfig.ApiUrl_FU_ShopAlbumImg, "FU_ShopAlbumImg", _dic);
            }
            else if (_exeType == "2") //加载商家相册列表
            {
                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UserID", mUserID);

                //发送Http请求
                return BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_FU_ShopAlbum, "FU_ShopAlbum", "4", _dic);
            }
            else if (_exeType == "3") //相册图片数据分页
            {
                //获取传递的参数
                string AlbumID = PublicClass.FilterRequestTrim("AlbumID");
                string pageCurrent = PublicClass.FilterRequestTrim("pageCurrent");

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("AlbumID", AlbumID);
                _dic.Add("IsLock", "false");
                _dic.Add("pageCurrent", pageCurrent);


                //发送Http请求
                return BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_FU_ShopAlbumImg, "FU_ShopAlbumImg", "4", _dic);
            }

            return "";
        }

        /// <summary>
        /// 【赠品图片】上传
        /// </summary>
        /// <returns></returns>
        public string GooGiftImg()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }
            //获取商家登录UserID
            string mUserID = _loginBuyerUserID;



            //获取操作类型  Type=1 上传图片 Type=2 删除已上传没保存的赠品图片 Type=3 赠品图片数据分页 Type=4  删除因重复上传导致的多余赠品图片
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //创建GUID
                string _guid = PublicClass.CreateNewGuid();

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("Type", "1"); //操作类型 Type=1 上传
                _dic.Add("UserID", mUserID);
                _dic.Add("UploadGuid", _guid);

                //调用上传函数
                return BusiRndKeyUpload.httpNoLoginRndKeyRsaUpload(WebAppConfig.ApiUrl_FU_GooGiftMsg, "FU_GooGiftMsg", _dic);
            }
            else if (_exeType == "2") //删除已上传没保存的赠品图片
            {
                //获取传递过来的参数
                string ImgKeyGuid = PublicClass.FilterRequestTrim("ImgKeyGuid");
                string DomainUpload = PublicClass.FilterRequestTrim("DomainUpload");

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UploadGuidArr", ImgKeyGuid);

                //调用上传函数
                string _backMsg = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(BusiHttpCode.getUploadHttpHeader() + DomainUpload + "/Goo/GooGiftImg", "FU_GooGiftImg", "2", _dic);
                return _backMsg;
            }
            else if (_exeType == "3") //赠品图片数据分页
            {
                //获取传递的参数
                string pageCurrent = PublicClass.FilterRequestTrim("pageCurrent");

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UserID", mUserID);
                _dic.Add("IsLock", "false");
                _dic.Add("pageCurrent", pageCurrent);

                //发送Http请求
                return BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_FU_GooGiftMsg, "FU_GooGiftMsg", "4", _dic);
            }
            else if (_exeType == "4") //删除因重复上传导致的多余赠品图片
            {
                //获取【上传文件系统 域名列表数组】
                string[] _octFileUploadSystemWebDomainListArr = WebAppConfig.OctFileUploadSystemWebDomainListArr;
                //向每个上传文件系统发送Http请求
                for (int i = 0; i < _octFileUploadSystemWebDomainListArr.Length; i++)
                {
                    //定义POST参数
                    Dictionary<string, string> _dic = new Dictionary<string, string>();
                    _dic.Add("UserID", mUserID);

                    try
                    {
                        //调用上传函数
                        string _backMsg = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(_octFileUploadSystemWebDomainListArr[i] + "/Goo/GooGiftImg", "FU_GooGiftImg", "5", _dic);
                    }
                    catch
                    {
                        continue;
                    }
                }
            }

            return "";
        }

        /// <summary>
        /// 【礼品图片】上传
        /// </summary>
        /// <returns></returns>
        public string PresentImgs()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }
            //获取商家登录UserID
            string mUserID = _loginBuyerUserID;

            //获取操作类型  Type=1 上传图片 Type=2 删除已上传没保存的图片 Type=3 删除因重复上传导致的多余礼品图片 Type=4 礼品图片数据分页
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //创建GUID
                string _guid = PublicClass.CreateNewGuid();

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("Type", "1"); //操作类型 Type=1 上传
                _dic.Add("UserID", mUserID);
                _dic.Add("UploadGuid", _guid);

                //调用上传函数
                return BusiRndKeyUpload.httpNoLoginRndKeyRsaUpload(WebAppConfig.ApiUrl_FU_PresentImg, "FU_PresentImg", _dic);
            }
            else if (_exeType == "2") //删除已上传没保存的图片
            {
                //获取传递过来的参数
                string ImgKeyGuid = PublicClass.FilterRequestTrim("ImgKeyGuid");
                string DomainUpload = PublicClass.FilterRequestTrim("DomainUpload");

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UploadGuidArr", ImgKeyGuid);

                //调用上传函数
                string _backMsg = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(BusiHttpCode.getUploadHttpHeader() + DomainUpload + "/Goo/PresentImg", "FU_PresentImg", "2", _dic);
                return _backMsg;
            }
            else if (_exeType == "3") //删除因重复上传导致的多余礼品图片
            {
                //获取【上传文件系统 域名列表数组】
                string[] _octFileUploadSystemWebDomainListArr = WebAppConfig.OctFileUploadSystemWebDomainListArr;
                //向每个上传文件系统发送Http请求
                for (int i = 0; i < _octFileUploadSystemWebDomainListArr.Length; i++)
                {
                    //定义POST参数
                    Dictionary<string, string> _dic = new Dictionary<string, string>();
                    _dic.Add("UserID", mUserID);

                    try
                    {
                        //调用上传函数
                        string _backMsg = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(_octFileUploadSystemWebDomainListArr[i] + "/Goo/PresentImg", "FU_PresentImg", "3", _dic);
                    }
                    catch
                    {
                        continue;
                    }
                }
            }
            else if (_exeType == "4") //礼品图片数据分页
            {
                //获取传递的参数
                string pageCurrent = PublicClass.FilterRequestTrim("pageCurrent");

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UserID", mUserID);
                _dic.Add("IsLock", "false");
                _dic.Add("pageCurrent", pageCurrent);

                //发送Http请求
                return BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_FU_PresentImg, "FU_PresentImg", "4", _dic);
            }


            return "";
        }

        /// <summary>
        /// 【活动图片】上传
        /// </summary>
        /// <returns></returns>
        public string ActivityImgs()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }
            //获取商家登录UserID
            string mUserID = _loginBuyerUserID;

            //获取操作类型  Type=1 上传图片 Type=2 删除已上传没保存的图片 Type=3 删除因重复上传导致的多余活动图片 Type=4 活动图片数据分页
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //创建GUID
                string _guid = PublicClass.CreateNewGuid();

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("Type", "1"); //操作类型 Type=1 上传
                _dic.Add("UserID", mUserID);
                _dic.Add("UploadGuid", _guid);

                //调用上传函数
                return BusiRndKeyUpload.httpNoLoginRndKeyRsaUpload(WebAppConfig.ApiUrl_FU_ActivityImg, "FU_ActivityImg", _dic);
            }
            else if (_exeType == "2") //删除已上传没保存的图片
            {
                //获取传递过来的参数
                string ImgKeyGuid = PublicClass.FilterRequestTrim("ImgKeyGuid");
                string DomainUpload = PublicClass.FilterRequestTrim("DomainUpload");

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UploadGuidArr", ImgKeyGuid);

                //调用上传函数
                string _backMsg = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(BusiHttpCode.getUploadHttpHeader() + DomainUpload + "/Goo/ActivityImg", "FU_ActivityImg", "2", _dic);
                return _backMsg;
            }
            else if (_exeType == "3") //删除因重复上传导致的多余活动图片
            {
                //获取【上传文件系统 域名列表数组】
                string[] _octFileUploadSystemWebDomainListArr = WebAppConfig.OctFileUploadSystemWebDomainListArr;
                //向每个上传文件系统发送Http请求
                for (int i = 0; i < _octFileUploadSystemWebDomainListArr.Length; i++)
                {
                    //定义POST参数
                    Dictionary<string, string> _dic = new Dictionary<string, string>();
                    _dic.Add("UserID", mUserID);

                    try
                    {
                        //调用上传函数
                        string _backMsg = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(_octFileUploadSystemWebDomainListArr[i] + "/Goo/ActivityImg", "FU_ActivityImg", "3", _dic);
                    }
                    catch
                    {
                        continue;
                    }
                }
            }
            else if (_exeType == "4") //活动图片数据分页
            {
                //获取传递的参数
                string pageCurrent = PublicClass.FilterRequestTrim("pageCurrent");

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UserID", mUserID);
                _dic.Add("IsLock", "false");
                _dic.Add("pageCurrent", pageCurrent);

                //发送Http请求
                return BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_FU_ActivityImg, "FU_ActivityImg", "4", _dic);
            }


            return "";
        }

        /// <summary>
        /// 【抽奖图片】上传
        /// </summary>
        /// <returns></returns>
        public string LuckyDrawImgs()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }
            //获取商家登录UserID
            string mUserID = _loginBuyerUserID;

            //获取操作类型  Type=1 上传图片 Type=2 删除已上传没保存的图片 Type=3 删除因重复上传导致的多余抽奖图片 Type=4 抽奖图片数据分页
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //创建GUID
                string _guid = PublicClass.CreateNewGuid();

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("Type", "1"); //操作类型 Type=1 上传
                _dic.Add("UserID", mUserID);
                _dic.Add("UploadGuid", _guid);

                //调用上传函数
                return BusiRndKeyUpload.httpNoLoginRndKeyRsaUpload(WebAppConfig.ApiUrl_FU_LuckyDrawImg, "FU_ActivityImg", _dic);
            }
            else if (_exeType == "2") //删除已上传没保存的图片
            {
                //获取传递过来的参数
                string ImgKeyGuid = PublicClass.FilterRequestTrim("ImgKeyGuid");
                string DomainUpload = PublicClass.FilterRequestTrim("DomainUpload");

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UploadGuidArr", ImgKeyGuid);

                //调用上传函数
                string _backMsg = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(BusiHttpCode.getUploadHttpHeader() + DomainUpload + "/Goo/LuckyDrawImg", "FU_LuckyDrawImg", "2", _dic);
                return _backMsg;
            }
            else if (_exeType == "3") //删除因重复上传导致的多余抽奖图片
            {
                //获取【上传文件系统 域名列表数组】
                string[] _octFileUploadSystemWebDomainListArr = WebAppConfig.OctFileUploadSystemWebDomainListArr;
                //向每个上传文件系统发送Http请求
                for (int i = 0; i < _octFileUploadSystemWebDomainListArr.Length; i++)
                {
                    //定义POST参数
                    Dictionary<string, string> _dic = new Dictionary<string, string>();
                    _dic.Add("UserID", mUserID);

                    try
                    {
                        //调用上传函数
                        string _backMsg = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(_octFileUploadSystemWebDomainListArr[i] + "/Goo/LuckyDrawImg", "FU_LuckyDrawImg", "3", _dic);
                    }
                    catch
                    {
                        continue;
                    }
                }
            }
            else if (_exeType == "4") //活动图片数据分页
            {
                //获取传递的参数
                string pageCurrent = PublicClass.FilterRequestTrim("pageCurrent");

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UserID", mUserID);
                _dic.Add("IsLock", "false");
                _dic.Add("pageCurrent", pageCurrent);

                //发送Http请求
                return BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_FU_LuckyDrawImg, "FU_LuckyDrawImg", "4", _dic);
            }


            return "";
        }

        /// <summary>
        /// 店铺轮播图片
        /// </summary>
        /// <returns></returns>
        public string ShopCarouselImg()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 上传图片 Type=2 删除已上传没保存的图片 Type=3 删除因重复上传导致的多余图片 Type=4 图片数据分页
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //创建GUID
                string _guid = PublicClass.CreateNewGuid();

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("Type", "1"); //操作类型 Type=1 上传
                _dic.Add("UserID", _loginUserID);
                _dic.Add("UploadGuid", _guid);

                //调用上传函数
                return BusiRndKeyUpload.httpNoLoginRndKeyRsaUpload(WebAppConfig.ApiUrl_FU_ShopCarouselImg, "FU_ShopCarouselImg", _dic);
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
                    _dic.Add("UserID", _loginUserID);
                    _dic.Add("UploadGuidArr", ImgKeyGuid);

                    try
                    {
                        //调用上传函数
                        string _backMsg = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(_octFileUploadSystemWebDomainListArr[i] + "/Shop/ShopCarouselImg", "FU_ShopCarouselImg", "2", _dic);
                    }
                    catch
                    {
                        continue;
                    }
                }

                return "SUCCESS";

            }
            else if (_exeType == "3") //删除因重复上传导致的多余图片
            {
                //获取【上传文件系统 域名列表数组】
                string[] _octFileUploadSystemWebDomainListArr = WebAppConfig.OctFileUploadSystemWebDomainListArr;
                //向每个上传文件系统发送Http请求
                for (int i = 0; i < _octFileUploadSystemWebDomainListArr.Length; i++)
                {
                    //定义POST参数
                    Dictionary<string, string> _dic = new Dictionary<string, string>();
                    _dic.Add("UserID", _loginUserID);

                    try
                    {
                        //调用上传函数
                        string _backMsg = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(_octFileUploadSystemWebDomainListArr[i] + "/Shop/ShopCarouselImg", "FU_ShopCarouselImg", "3", _dic);
                    }
                    catch
                    {
                        continue;
                    }
                }
            }
            else if (_exeType == "4") //图片数据分页
            {
                //获取传递的参数
                string pageCurrent = PublicClass.FilterRequestTrim("pageCurrent");

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("UserID", _loginUserID);
                _dic.Add("IsLock", "false");
                _dic.Add("pageCurrent", pageCurrent);

                //发送Http请求
                return BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_FU_ShopCarouselImg, "FU_ShopCarouselImg", "4", _dic);
            }

            return "";
        }

        /// <summary>
        /// 上传店铺头像图片
        /// </summary>
        /// <returns></returns>
        public string ShopHeaderImg()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }
            //获取商家登录UserID
            string mUserID = _loginBuyerUserID;

            //获取操作类型  Type=1 上传图片
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string UserID = mUserID;

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
        /// 上传结算商家营业执照照片
        /// </summary>
        /// <returns></returns>
        public string SettleCertificateImg()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }
            //获取商家登录UserID
            string mUserID = _loginBuyerUserID;

            //获取操作类型  Type=1 上传图片
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string UserID = mUserID;

                //创建GUID
                string _guid = PublicClass.CreateNewGuid();

                //定义POST参数
                Dictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("Type", "1"); //操作类型 Type=1 上传
                _dic.Add("UserID", UserID); //店铺ID
                _dic.Add("UploadGuid", _guid);

                //调用上传函数
                return BusiRndKeyUpload.httpNoLoginRndKeyRsaUpload(WebAppConfig.ApiUrl_FU_SettleCertificateImg, "FU_SettleCertificateImg", _dic);
            }


            return "";
        }

        /// <summary>
        /// 上传店铺门头照图片
        /// </summary>
        /// <returns></returns>
        public string ShopLogoImg()
        {
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }
            //获取商家登录UserID
            string mUserID = _loginBuyerUserID;


            //获取操作类型  Type=1 上传图片
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string UserID = mUserID;

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
            //判断买家登录是否正确，并获取登录的UserID
            string _loginBuyerUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginBuyerUserID))
            {
                return "";
            }
            //获取商家登录UserID
            string mUserID = _loginBuyerUserID;


            //获取操作类型  Type=1 上传图片 Type=2 删除上传服务器上的图片
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string UserID = mUserID; //PublicClass.FilterRequestTrim("UserID");

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



    }
}