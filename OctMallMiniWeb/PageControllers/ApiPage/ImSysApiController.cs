using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【IM在线客服系统】相关Api控制器
/// </summary>
namespace OctMallMiniWeb.PageControllers.ApiPage
{
    public class ImSysApiController : Controller
    {
        /// <summary>
        /// 接口首页
        /// </summary>
        /// <returns></returns>
        public string Index()
        {
            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }


            //获取操作类型  Type=1 构建商家店铺咨询进入IM在线客服系统 跳转 URL Type=2 构建【商品】咨询进入IM在线客服系统 跳转 URL Type=3 构建【商城平台官方客服】咨询进入IM在线客服系统 跳转 URL
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("ShopUserID", ShopUserID);
                _dicPost.Add("BuyerUserID", BuyerUserID);
                _dicPost.Add("VisitorMemo", "店铺咨询-小程序");
                _dicPost.Add("IsShowTitleHeader", "false");

                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ImSysIndex, "UGS_ImSysIndex", "1", _dicPost);
                return _backJson;
            }
            else if (_exeType == "2") //构建【商品】咨询进入IM在线客服系统 跳转 URL
            {
                // 获取传递的参数
                string GoodsID = PublicClass.FilterRequestTrim("GoodsID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                //如果备注带礼品二字，这样就加载礼品信息
                string VisitorMemo = PublicClass.FilterRequestTrim("VisitorMemo");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("GoodsID", GoodsID);
                _dicPost.Add("BuyerUserID", BuyerUserID);
                _dicPost.Add("VisitorMemo", VisitorMemo);
                _dicPost.Add("IsShowTitleHeader", "false");

                //保存买家收货地址
                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ImSysIndex, "UGS_ImSysIndex", "2", _dicPost);
                return _backJson;
            }
            else if (_exeType == "3") //构建【商城平台官方客服】咨询进入IM在线客服系统 跳转 URL
            {
                // 获取传递的参数
                string MallOfficialIMShopUserID = PublicClass.FilterRequestTrim("MallOfficialIMShopUserID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string VisitorMemo = PublicClass.FilterRequestTrim("VisitorMemo");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("MallOfficialIMShopUserID", MallOfficialIMShopUserID);
                _dicPost.Add("BuyerUserID", BuyerUserID);
                _dicPost.Add("VisitorMemo", VisitorMemo);
                _dicPost.Add("IsShowTitleHeader", "false");

                //保存买家收货地址
                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_ImSysIndex, "UGS_ImSysIndex", "3", _dicPost);
                return _backJson;

            }
            return "";
        }



    }
}