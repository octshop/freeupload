using BusiApiHttpNS;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【登录】Ajax请求控制器
/// </summary>
namespace OctCmsSystemWeb.PageControllers.AjaxPage
{
    public class LoginController : Controller
    {
        /// <summary>
        /// 登录公共首页
        /// </summary>
        /// <returns></returns>
        public string Index()
        {

            //获取操作类型  Type=1 管理用户登录系统 Type=2 安全退出系统 Type=3 修改管理用户的登录密码
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string AdUserName = PublicClass.FilterRequestTrim("AdUserName");
                string AdUserPwd = PublicClass.FilterRequestTrim("AdUserPwd");

                //选填
                string EnterPagePathCurrent = ""; //不需要进行权限验证

                //进行SHA1加密
                string AdUserPwdSHA1 = EncryptionClassNS.EncryptionClass.GetSHA1(AdUserPwd);

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("AdUserID", "0");
                _dic.Add("AdUserName", AdUserName);
                _dic.Add("AdUserPwdSHA1", AdUserPwdSHA1);
                _dic.Add("EnterPagePathCurrent", EnterPagePathCurrent);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_AdminUserMsg, "ASAC_AdminUserMsg", "5", _dic);
                //如果登录成功则记录登录状态 否则，清除登录状态
                if (_json.IndexOf("CAUL_01") >= 0)
                {
                    JObject _jObj = (JObject)JsonConvert.DeserializeObject(_json);

                    //设置管理用户登录Cookie信息 
                    BusiLogin.setLoginCookie(Convert.ToInt64(_jObj["DataDic"]["AdUserID"].ToString()), AdUserPwdSHA1, _jObj["DataDic"]["AdUserType"].ToString());
                    //设置后要获取一下，要不然Cookie可能失效
                    string _logincookie = BusiLogin.getLoginCookie();

                }
                else
                {
                    //清除用户登录Cookie
                    BusiLogin.clearLoginCookie();
                }
                //管理用户登录 ={ "Code":"CAUL_01","Msg":"登录成功","ErrCode":null,"ErrMsg":null,"DataDic":{ "AdUserID":"1","AdUserType":"Admin","AdUserTypeName":"超级管理员"},"DataListDic":null,"DataDicExtra":null,"DataListDicExtra":null}


                return _json;
            }
            else if (_exeType == "2") //安全退出系统 
            {
                //清除用户登录Cookie
                BusiLogin.clearLoginCookie();

                return "21"; //安全退出
            }


            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            if (_exeType == "3") //修改管理用户的登录密码
            {
                //获取传递的参数
                string AdUserPwdOld = PublicClass.FilterRequestTrim("AdUserPwdOld");
                string AdUserPwdNew = PublicClass.FilterRequestTrim("AdUserPwdNew");

                //加密密码
                string AdUserPwdOldSha1 = EncryptionClassNS.EncryptionClass.GetSHA1(AdUserPwdOld);
                string AdUserPwdNewSha1 = EncryptionClassNS.EncryptionClass.GetSHA1(AdUserPwdNew);

                string AdUserID = BusiLogin.getAdUserIDLoginCookie();


                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("AdUserID", AdUserID);
                _dic.Add("AdUserPwdOldSha1", AdUserPwdOldSha1);
                _dic.Add("AdUserPwdNewSha1", AdUserPwdNewSha1);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_AdminUserMsg, "ASAC_AdminUserMsg", "7", _dic);
                return _json;
            }

            return "";
        }
    }
}