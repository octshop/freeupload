using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【各项小红点提示数】相关Api控制器
/// </summary>
namespace OctMallMiniWeb.PageControllers.ApiPage
{
    public class RCHintApiController : Controller
    {

        /// <summary>
        /// 各项小红点提示数
        /// </summary>
        /// <returns></returns>
        public string CountData()
        {
            //-----验证小程序的签名 SignKey --公共函数-----//
            string _loginUserID = "";
            string _verifyBack = BusiSignKeyMiniNS.BusiSignKeyMini.verifySignKeyPubApi(out _loginUserID);
            if (_verifyBack != "VSKPA_01")
            {
                return _verifyBack;
            }

            //获取操作类型  Type=1 统计买家中心首页 各项小红点提示数
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                //_dicPost.Add("Type", "1");
                _dicPost.Add("BuyerUserID", _loginUserID);

             
                string _backJson = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_CountData, "ASAC_CountData", "1", _dicPost);
                return _backJson;
            }


            return "";
        }



    }
}