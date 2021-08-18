using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// 【店铺】相关业务逻辑
/// </summary>
namespace OctShopSystemWeb
{
    public class BusiShop
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        public BusiShop()
        {

        }

        /// <summary>
        /// 店铺状态提示文本
        /// </summary>
        /// <param name="pIsCheck">审核是否通过 ( false  通过审核 /  true 加入审核)</param>
        /// <param name="pIsLock">是否锁定 ( true / false )</param>
        /// <param name="pCheckReason">审核原因</param>
        /// <returns>_backArr[2] = "#008903";</returns>
        public static string[] showShopStatusTxt(string pIsCheck,string pIsLock,string pCheckReason="")
        {
            //返回数组
            string[] _backArr = new string[3];
            _backArr[2] = "";

            if (pIsCheck.ToLower() == "true")
            {
                _backArr[0] = "店铺审核中";
                if (string.IsNullOrWhiteSpace(pCheckReason))
                {
                    _backArr[1] = "店铺和相关信息审核中……";
                }
                else
                {
                    _backArr[1] = pCheckReason;
                }
                _backArr[2] = "#FF6A00";

            }
            else
            {
                _backArr[0] = "店铺正常营业";
                _backArr[1] = "店铺状态正常,营业中……";
                _backArr[2] = "#03AD05";
            }

            if (pIsLock.ToLower() == "true")
            {
                _backArr[0] = "店铺被锁定";
                _backArr[1] = "店铺因异常已被官方锁定,店铺已下线,请联系客服解决……";
                _backArr[2] = "#FF0000";
            }

            return _backArr;
        }



        /// <summary>
        /// Http请求 得到微信的 APPID 和 APPSECRET
        /// </summary>
        /// <returns></returns>
        public static Dictionary<string, object> httpWxAppIDAppScecret()
        {
            //构造POST参数
            Dictionary<string, string> _dicPost = new Dictionary<string, string>();
            _dicPost.Add("OpenID", "");

            string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_TAC_GetWxAppIDAppScecret, "TAC_GetWxAppIDAppScecret", "1", _dicPost);

            JObject _jObj = (JObject)JsonConvert.DeserializeObject(_jsonBack);

            Dictionary<string, object> _dic = new Dictionary<string, object>();
            _dic["APPID"] = _jObj["APPID"].ToString().Trim();
            _dic["APPSECRET"] = _jObj["APPSECRET"].ToString().Trim();

            return _dic;
        }


    }
}