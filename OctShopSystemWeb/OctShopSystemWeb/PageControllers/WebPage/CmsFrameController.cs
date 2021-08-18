using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【CMS系统前端架构】相关页面控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.WebPage
{
    public class CmsFrameController : Controller
    {
        /// <summary>
        /// 后台框架主体页面
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {

            //---判断用户是否登录---//
            string _shopUserID = BusiLogin.isLoginPageRetrunUserID("../CmsFrame/Index");
            if (string.IsNullOrWhiteSpace(_shopUserID))
            {
                return Content("用户登录错误！");
            }

            //OctWapWeb 手机Web端(公众号端)地址域名
            ViewBag.OctWapWeb_AddrDomain = WebAppConfig.OctWapWeb_AddrDomain.ToString().Trim();

            //判断当前浏览器是否为 移动端
            ViewBag.IsMobile = PublicClass.isMobileOS().ToString().ToLower();
            if (ViewBag.IsMobile == "true")
            {
                //跳转到移动端
                Response.Redirect("~/WapPage/Index");
                return null;
            }


            //----------得到店铺的ID-------------//
            //POST参数
            Dictionary<string, string> _dicPost = new Dictionary<string, string>();
            _dicPost.Add("Type", "19");
            _dicPost.Add("ShopUserID", _shopUserID);

            string _jsonBack = HttpServiceNS.HttpService.Post(WebAppConfig.ApiUrl_UGS_ShopMsg, _dicPost);
            JObject _jObj = (JObject)JsonConvert.DeserializeObject(_jsonBack);
            ViewBag.ShopID = _jObj["ShopID"].ToString();


            return View();
        }

    }
}