using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// 【买家】相关业务逻辑 --移动web版
/// </summary>
namespace OctMallMiniWeb
{
    public class BusiBuyer
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        public BusiBuyer()
        {

        }

        #region【收货地址】
        /// <summary>
        /// 设置当前买家选择的收货地址Cookie值【 BReceiAddrID ^ 430000_430100_430121 ^ 湖南省_长沙市_长沙县 】
        /// </summary>
        /// <param name="pRegionCodeArr">地区范围代码 用"_"连接</param>
        /// <param name="pRegionNameArr">地区范围名称 用"_"连接</param>
        /// <returns>返回: BReceiAddrID ^ 430000_430100_430121 ^ 湖南省_长沙市_长沙县</returns>
        public static string setBuyerReceiAddrSelCookieArr(long pBReceiAddrID, string pRegionCodeArr, string pRegionNameArr)
        {
            //构造Cookie值
            string _cookieVal = "" + pBReceiAddrID + "^" + pRegionCodeArr + "^" + pRegionNameArr + "";
            //设置Cookie值
            PublicClassNS.PublicClass.setCookieValue("BuyerReceiAddrSelCookieArr", _cookieVal);

            return _cookieVal;
        }

        /// <summary>
        /// 得到当前买家选择的收货地址Cookie值【 BReceiAddrID ^ 430000_430100_430121 ^ 湖南省_长沙市_长沙县 】
        /// </summary>
        /// <returns></returns>
        public static string getBuyerReceiAddrSelCookieArr()
        {
            string _receiAddrSelCookieArr = PublicClass.getCookieValue("BuyerReceiAddrSelCookieArr");
            return _receiAddrSelCookieArr;
        }

        /// <summary>
        /// 得到当前选择的 收货地址ID  从Cookie中获取
        /// </summary>
        /// <returns></returns>
        public static string getBReceiAddrIDSelCookie()
        {
            string _bReceiAddrIDSelCookie = getBuyerReceiAddrSelCookieArr().Split('^')[0];
            if (string.IsNullOrWhiteSpace(_bReceiAddrIDSelCookie))
            {
                _bReceiAddrIDSelCookie = "0";
            }

            return _bReceiAddrIDSelCookie;
        }

        /// <summary>
        /// 得到当前选择的 收货地址省份Code  从Cookie中获取
        /// </summary>
        /// <returns></returns>
        public static string getReceiAddrRegionProCodeCookie()
        {
            string _buyerReceiAddrSelCookieArr = getBuyerReceiAddrSelCookieArr();
            string _ProCodeCookie = _buyerReceiAddrSelCookieArr.Split('^')[1].Split('_')[0];
            return _ProCodeCookie;
        }

        /// <summary>
        /// 得到买家当前选择的收货地址  如果没有选择则加载默认收货地址,如果为空则无收货地址，需要新建
        /// </summary>
        /// <param name="pBuyerUserID">买家UserID</param>
        /// <returns></returns>
        public static string getBuyerReceiAddrSelJson(long pBuyerUserID)
        {
            string _backMsg = "";

            string _bReceiAddrID = getBReceiAddrIDSelCookie();
            if (string.IsNullOrWhiteSpace(_bReceiAddrID) || _bReceiAddrID == "0")
            {
                //没有选择收货地址,加载默认的收货地址

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", pBuyerUserID.ToString());

                //加载默认的收货地址
                _backMsg = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_BuyerReceiAddr, "UGS_BuyerReceiAddr", "7", _dicPost);
            }
            else
            {
                //得到选择的收货地址信息

                //POST参数
                Dictionary<string, string> _dicPost = new Dictionary<string, string>();
                _dicPost.Add("BuyerUserID", pBuyerUserID.ToString());
                _dicPost.Add("BReceiAddrID", _bReceiAddrID);

                //初始化买家收货地址
                _backMsg = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_BuyerReceiAddr, "UGS_BuyerReceiAddr", "5", _dicPost);
            }

            //设置当前买家选择的收货地址Cookie值【 BReceiAddrID ^ 430000_430100_430121 ^ 湖南省_长沙市_长沙县 】
            JObject _jObj = (JObject)JsonConvert.DeserializeObject(_backMsg);
            setBuyerReceiAddrSelCookieArr(Convert.ToInt64(_jObj["BReceiAddrID"].ToString()), _jObj["RegionCodeArr"].ToString(), _jObj["RegionNameArr"].ToString());


            return _backMsg;
        }

        #endregion

        #region【推广会员注册】

        /// <summary>
        /// 被推广人扫码注册 - 微信扫码 
        /// </summary>
        /// <param name="pPQRCRSA">连接传递的推广者信息 二维码内容  BuyerUserID ^ LoginPwdNoSha1 ^ PromoteUser  RSA分段加密的</param>
        /// <param name="pOpenID">微信OPENID</param>
        /// <param name="pNickName">微信昵称</param>
        /// <param name="pHeadImgUrl">微信头像</param>
        /// <param name="pSex">微信性别 1 男性 2 女性</param>
        /// <param name="pUnionID">微信UionID</param>
        /// <returns></returns>
        public static string httpRegPromoteWxAutoUserAccount(string pPQRCRSA, string pOpenID, string pNickName, string pHeadImgUrl, string pSex, string pUnionID)
        {
            //构造POST参数
            Dictionary<string, string> _dicPost = new Dictionary<string, string>();
            _dicPost.Add("PQRCRSA", pPQRCRSA);
            _dicPost.Add("OpenID", pOpenID);
            _dicPost.Add("NickName", pNickName);
            _dicPost.Add("HeadImgUrl", pHeadImgUrl);
            _dicPost.Add("Sex", pSex);
            _dicPost.Add("UnionID", pUnionID);

            string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_RegUserAccount, "UGS_RegUserAccount", "1", _dicPost);
            return _jsonBack;
        }

        #endregion

        #region【用户注册 - 微信-手机号短信】

        /// <summary>
        /// 微信用户自动登录和注册会员
        /// </summary>
        /// <param name="pOpenID">微信OPENID</param>
        /// <param name="pNickName">微信昵称</param>
        /// <param name="pHeadImgUrl">微信头像</param>
        /// <param name="pSex">微信性别 1 男性 2 女性</param>
        /// <param name="pUnionID">微信UionID</param>
        /// <param name="pBuyerUserIDPromoteFather">推广者的UserID (可以是店铺主) 不为空或0 则进行添加</param>
        /// <returns></returns>
        public static string httpWxAutoLoginAndRegUserAccount(string pOpenID, string pNickName, string pHeadImgUrl, string pSex, string pUnionID, long pBuyerUserIDPromoteFather = 0)
        {
            //构造POST参数
            Dictionary<string, string> _dicPost = new Dictionary<string, string>();
            _dicPost.Add("OpenID", pOpenID);
            _dicPost.Add("NickName", pNickName);
            _dicPost.Add("HeadImgUrl", pHeadImgUrl);
            _dicPost.Add("Sex", pSex);
            _dicPost.Add("UnionID", pUnionID);

            //推广者的UserID (可以是店铺主) 不为空或0 则进行添加
            _dicPost.Add("BuyerUserIDPromoteFather", pBuyerUserIDPromoteFather.ToString());

            string _jsonBack = BusiApiHttpNS.BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_UGS_RegUserAccount, "UGS_RegUserAccount", "2", _dicPost);
            return _jsonBack;
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


        #endregion


    }
}