using BusiApiHttpNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【系统】Ajax请求控制器
/// </summary>
namespace OctCmsSystemWeb.PageControllers.AjaxPage
{
    public class SysController : Controller
    {
        /// <summary>
        /// 系统首页
        /// </summary>
        /// <returns></returns>
        public string Index()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("SysPage/Index");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }

            //获取操作类型  Type=1 统计总数-各种数据 Type=2 得到平台的通知信息，一般是审核中 Type=3 统计订单的相关数据 Type=4 统计售后和投诉信息 Type=5 统计平台通知信息和 系统异常信息 未读总数 Type=6 初始化 CMS管理用户信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", "0");

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_Index, "T_Index", "1", _dic);
                return _json;
            }
            else if (_exeType == "2") //得到平台的通知信息，一般是审核中
            {
                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", "0");

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_Index, "T_Index", "3", _dic);
                return _json;
            }
            else if (_exeType == "3") //统计订单的相关数据
            {
                //获取传递的参数
                string IsTodayCount = PublicClass.FilterRequestTrim("IsTodayCount");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", "0");
                _dic.Add("IsTodayCount", IsTodayCount);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_Index, "T_Index", "4", _dic);
                return _json;
            }
            else if (_exeType == "4") //统计售后和投诉信息
            {
                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", "0");

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_Index, "ASAC_Index", "1", _dic);
                return _json;
            }
            else if (_exeType == "5") //统计平台通知信息和 系统异常信息 未读总数
            {
                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                //_dic.Add("ShopUserID", "0");

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_PlatformSysMsg, "ASAC_PlatformSysMsg", "6", _dic);
                return _json;
            }
            else if (_exeType == "6") //初始化 CMS管理用户信息
            {
                //获取传递的参数
                string AdUserID = BusiLogin.getAdUserIDLoginCookie(); //PublicClass.FilterRequestTrim("AdUserID");

                if (string.IsNullOrWhiteSpace(AdUserID))
                {
                    return "";
                }

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("AdUserID", AdUserID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_AdminUserMsg, "ASAC_AdminUserMsg", "6", _dic);
                return _json;
            }


            return "";
        }

        /// <summary>
        /// 数据统计
        /// </summary>
        /// <returns></returns>
        public string DataCount()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("SysPage/DataCount");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 统计优惠券各种总数
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ShopUserID", "0");

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_T_Index, "T_Index", "5", _dic);
                return _json;
            }

            return "";
        }

    }
}