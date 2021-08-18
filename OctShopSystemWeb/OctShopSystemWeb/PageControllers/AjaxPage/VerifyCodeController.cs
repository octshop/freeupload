using BusiApiHttpNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【各种验证码信息-验证】相关Ajax请求控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.AjaxPage
{
    public class VerifyCodeController : Controller
    {
        /// <summary>
        /// 各种验证码信息-验证
        /// </summary>
        /// <returns></returns>
        public string VerifyCodeAll()
        {
            //判断商家登录是否正确，并获取登录的UserID
            string _loginUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return "";
            }

            //获取操作类型  Type=1  各种验证码信息-验证 --【扫码结果处理页】  Type=2 各种验证码信息-验证 -- 【非扫码】 Type=3 得到店铺指定类别的 验证码信息 列表
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {

                //获取传递的扫码参数
                string _ScanData = HttpContext.Request["ScanData"].ToString().Trim();
                _ScanData = _ScanData.Replace("%2B", "+").Replace(" ", "+");

                string _jsonBack = BusiVerifyCode.httpVerifyCodeScanData(_ScanData, Convert.ToInt64(_loginUserID));
                return _jsonBack;

            }
            else if (_exeType == "2") //各种验证码信息-验证 -- 【非扫码】
            {
                //获取传递的参数
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string VerifyType = PublicClass.FilterRequestTrim("VerifyType");
                string VerifyCode = PublicClass.FilterRequestTrim("VerifyCode");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                //string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);
                _dic.Add("ExtraData", ExtraData);
                _dic.Add("VerifyTypeCode", VerifyType);
                _dic.Add("VerifyCode", VerifyCode);
                _dic.Add("BuyerUserID", BuyerUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_VerifyCodeScanData, "T_VerifyCodeScanData", "1", _dic);
                return _json;
            }
            else if (_exeType == "3") //得到店铺指定类别的 验证码信息 列表
            {
                //获取传递的参数
                string VerifyType = PublicClass.FilterRequestTrim("VerifyType");
                string VerifyCode = PublicClass.FilterRequestTrim("VerifyCode");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", _loginUserID);
                _dic.Add("VerifyTypeCode", VerifyType);
                _dic.Add("VerifyCode", VerifyCode);


                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_VerifyCodeScanData, "T_VerifyCodeScanData", "2", _dic);
                return _json;
            }

            return "";
        }




    }
}