using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【购物车】相关Api控制器
/// </summary>
namespace OctMallMiniWeb.PageControllers.ApiPage
{
    public class SCartApiController : Controller
    {
        /// <summary>
        /// 购物车首页
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

            //获取操作类型  Type=1 初始化购物车信息 Type=2 得到店铺可使用的优惠券列表 Type=3 批量删除购物车信息 Type=4 去结算 Type=5 保存商品订购数量的增减(直接保存值)
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", _loginUserID);

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_SCart, "UGS_SCart", "2", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "2") //得到店铺可使用的优惠券列表
            {
                //获取传递的参数
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("Type", "9");
                _dicPost.Add("ShopUserID", ShopUserID);

                //发送Http请求
                string _jsonBack = HttpServiceNS.HttpService.Post(WebAppConfig.ApiUrl_T_CouponsMsg, _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "3") //批量删除购物车信息
            {
                //获取传递的参数
                string SCartIDArr = PublicClass.FilterRequestTrim("SCartIDArr");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("SCartIDArr", SCartIDArr);

                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_SCart, "UGS_SCart", "3", _dicPost);
                return _jsonBack;
            }
            else if (_exeType == "4") //去结算
            {
                //获取传递的参数
                string ScartIDOrderNumArr = PublicClass.FilterRequestTrim("ScartIDOrderNumArr");

                //设置去结算的Cookie  得到购物车信息ID 与之对应的  订购数量 拼接字符串 [ SCartID _ OrderNum ^ SCartID _ OrderNum]
                PublicClass.setCookieValue("ScartIDOrderNumArrCookie", ScartIDOrderNumArr);
                //返回设置成功
                return "41";
            }
            else if (_exeType == "5") //保存商品订购数量的增减(直接保存值)
            {
                //获取传递的参数
                string CartID = PublicClass.FilterRequestTrim("CartID");
                string OrderNum = PublicClass.FilterRequestTrim("OrderNum");

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("CartID", CartID);
                _dicPost.Add("OrderNum", OrderNum);
                _dicPost.Add("BuyerUserID", _loginUserID);

                //正式发送Http请求
                string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_SCart, "UGS_SCart", "4", _dicPost);
                return _jsonBack;

            }


            return "";
        }



    }
}