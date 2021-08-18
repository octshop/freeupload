using BusiApiHttpNS;
using BusiRndKeyNS;
using PublicClassNS;
using System.Collections.Generic;
using System.Web.Mvc;

/// <summary>
/// 【OctCommonCodeSystem(各项目通用代码项目)】Ajax接口调用控制器
/// </summary>
namespace OctCmsSystemWeb.PageControllers.ApiPage
{
    public class CommonCodeController : Controller
    {
        // GET: CommonCode
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Api请求用户信息管理
        /// </summary>
        /// <returns></returns>
        public string UserKeyMsg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("CommonCodePage/UserKeyMsg");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }

            //------只有超级管理员(AdUserType=Admin)才能进入的页-------// 
            string _loginUserAdUserType = BusiLogin.getLoginUserAdUserType();
            if (_loginUserAdUserType != "Admin")
            {
                return "无权限访问";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 添加修改API用户信息 Type=3 得到API用户信息(初始化窗口) type=4 开关锁定 type=5 删除信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string _KeyID = PublicClass.FilterRequestTrim("KeyID");
                string _UserKeyID = PublicClass.FilterRequestTrim("UserKeyID");
                string _UserKeyName = PublicClass.FilterRequestTrim("UserKeyName");
                string _VerifyMobile = PublicClass.FilterRequestTrim("VerifyMobile");
                string _UserKey = PublicClass.FilterRequestTrimNoConvert("UserKey");
                string _VerifyTypeArr = PublicClass.FilterRequestTrimNoConvert("VerifyTypeArr");
                string _HttpDomainArr = PublicClass.FilterRequestTrimNoConvert("HttpDomainArr");
                string _HttpServerIPArr = PublicClass.FilterRequestTrimNoConvert("HttpServerIPArr");
                string _LinkMan = PublicClass.FilterRequestTrim("LinkMan");
                string _LinkMobile = PublicClass.FilterRequestTrim("LinkMobile");
                string _KeyMemo = PublicClass.FilterRequestTrim("KeyMemo");
                string _IsRecord = PublicClass.FilterRequestTrim("IsRecord");
                string _IsRndKeyTimeRecord = PublicClass.FilterRequestTrim("IsRndKeyTimeRecord");
                string _IsLock = PublicClass.FilterRequestTrim("IsLock");
                string _WriteDate = PublicClass.FilterRequestTrimNoConvert("WriteDate");

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("KeyID", _KeyID);
                _dic.Add("UserKeyID", _UserKeyID);
                _dic.Add("UserKeyName", _UserKeyName);
                _dic.Add("VerifyMobile", _VerifyMobile);
                _dic.Add("UserKey", _UserKey);
                _dic.Add("VerifyTypeArr", _VerifyTypeArr);
                _dic.Add("HttpDomainArr", _HttpDomainArr);
                _dic.Add("HttpServerIPArr", _HttpServerIPArr);
                _dic.Add("LinkMan", _LinkMan);
                _dic.Add("LinkMobile", _LinkMobile);
                _dic.Add("KeyMemo", _KeyMemo);
                _dic.Add("IsRecord", _IsRecord);
                _dic.Add("IsRndKeyTimeRecord", _IsRndKeyTimeRecord);
                _dic.Add("IsLock", _IsLock);
                _dic.Add("WriteDate", _WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpUserKeyMsg("CC_UserKeyMsg", "1", _dic);

                return _json;

            }
            else if (_exeType == "2") //添加修改API用户信息
            {
                //获取传递的参数
                string ExeType = PublicClass.FilterRequestTrim("ExeType");
                string KeyID = PublicClass.FilterRequestTrim("KeyID");
                string UserKeyID = PublicClass.FilterRequestTrim("UserKeyID");
                string UserKeyName = PublicClass.FilterRequestTrim("UserKeyName");
                string VerifyMobile = PublicClass.FilterRequestTrim("VerifyMobile");
                string UserKey = PublicClass.FilterRequestTrimNoConvert("UserKey");
                string VerifyTypeArr = PublicClass.FilterRequestTrimNoConvert("VerifyTypeArr");
                string HttpDomainArr = PublicClass.FilterRequestTrimNoConvert("HttpDomainArr");
                string HttpServerIPArr = PublicClass.FilterRequestTrimNoConvert("HttpServerIPArr");
                string LinkMan = PublicClass.FilterRequestTrim("LinkMan");
                string LinkMobile = PublicClass.FilterRequestTrim("LinkMobile");
                string KeyMemo = PublicClass.FilterRequestTrim("KeyMemo");
                string IsRecord = PublicClass.FilterRequestTrim("IsRecord");
                string IsRndKeyTimeRecord = PublicClass.FilterRequestTrim("IsRndKeyTimeRecord");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ExeType", ExeType);
                _dic.Add("KeyID", KeyID);
                _dic.Add("UserKeyID", UserKeyID);
                _dic.Add("UserKeyName", UserKeyName);
                _dic.Add("VerifyMobile", VerifyMobile);
                _dic.Add("UserKey", UserKey);
                _dic.Add("VerifyTypeArr", VerifyTypeArr);
                _dic.Add("HttpDomainArr", HttpDomainArr);
                _dic.Add("HttpServerIPArr", HttpServerIPArr);
                _dic.Add("LinkMan", LinkMan);
                _dic.Add("LinkMobile", LinkMobile);
                _dic.Add("KeyMemo", KeyMemo);
                _dic.Add("IsRecord", IsRecord);
                _dic.Add("IsRndKeyTimeRecord", IsRndKeyTimeRecord);

                //正式发送Http请求
                string _json = BusiApiHttp.httpUserKeyMsg("CC_UserKeyMsg", "2", _dic);

                return _json;
            }
            else if (_exeType == "3") //得到API用户信息(初始化窗口)
            {
                //获取传递的参数
                string KeyID = PublicClass.FilterRequestTrim("KeyID");
                string UserKeyID = PublicClass.FilterRequestTrim("UserKeyID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("KeyID", KeyID);
                _dic.Add("UserKeyID", UserKeyID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpUserKeyMsg("CC_UserKeyMsg", "3", _dic);
                return _json;
            }
            else if (_exeType == "4") //开关锁定
            {
                //获取传递的参数
                string KeyID = PublicClass.FilterRequestTrim("KeyID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("KeyID", KeyID);
                //正式发送Http请求
                string _json = BusiApiHttp.httpUserKeyMsg("CC_UserKeyMsg", "4", _dic);
                return _json;
            }
            else if (_exeType == "5") //删除信息
            {
                //获取传递的参数
                string MsgIDArr = PublicClass.FilterRequestTrim("MsgIDArr");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("MsgIDArr", MsgIDArr);
                //正式发送Http请求
                string _json = BusiApiHttp.httpUserKeyMsg("CC_UserKeyMsg", "5", _dic);
                return _json;
            }
            return "";
        }

        /// <summary>
        /// Api请求Key验证记录
        /// </summary>
        /// <returns></returns>
        public string KeyVerifyRecord()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("CommonCodePage/KeyVerifyRecord");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }

            //------只有超级管理员(AdUserType=Admin)才能进入的页-------// 
            string _loginUserAdUserType = BusiLogin.getLoginUserAdUserType();
            if (_loginUserAdUserType != "Admin")
            {
                return "无权限访问";
            }


            //获取操作类型  Type=1 搜索分页数据 Type=2 开关锁定 Type=3 删除信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //获取传递的参数
                string VRecordID = PublicClass.FilterRequestTrim("VRecordID");
                string UserKeyID = PublicClass.FilterRequestTrim("UserKeyID");
                string RndKey = PublicClass.FilterRequestTrimNoConvert("RndKey");
                string UserKey = PublicClass.FilterRequestTrimNoConvert("UserKey");
                string VerifyType = PublicClass.FilterRequestTrimNoConvert("VerifyType");
                string LangType = PublicClass.FilterRequestTrimNoConvert("LangType");
                string IsVerify = PublicClass.FilterRequestTrimNoConvert("IsVerify");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrimNoConvert("WriteDate");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("VRecordID", VRecordID);
                _dic.Add("UserKeyID", UserKeyID);
                _dic.Add("RndKey", RndKey);
                _dic.Add("UserKey", UserKey);
                _dic.Add("VerifyTypeArr", VerifyType);
                _dic.Add("LangTypeArr", LangType);
                _dic.Add("IsVerify", IsVerify);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_KeyVerifyRecord, "CC_KeyVerifyRecord", "1", _dic); //BusiApiHttp.httpUserKeyMsg("CC_KeyVerifyRecord", "1", _dic);

                return _json;
            }
            else if (_exeType == "2") //开关锁定
            {
                //获取传递的参数
                string VRecordID = PublicClass.FilterRequestTrim("VRecordID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("VRecordID", VRecordID);
                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_KeyVerifyRecord, "CC_KeyVerifyRecord", "2", _dic);
                return _json;
            }
            else if (_exeType == "3") //删除信息
            {
                //获取传递的参数
                string MsgIDArr = PublicClass.FilterRequestTrim("MsgIDArr");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("MsgIDArr", MsgIDArr);
                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_KeyVerifyRecord, "CC_KeyVerifyRecord", "3", _dic);
                return _json;
            }


            return "";
        }

        /// <summary>
        /// Api调用记录
        /// </summary>
        /// <returns></returns>
        public string ApiReqRecord()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("CommonCodePage/ApiReqRecord");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }

            //------只有超级管理员(AdUserType=Admin)才能进入的页-------// 
            string _loginUserAdUserType = BusiLogin.getLoginUserAdUserType();
            if (_loginUserAdUserType != "Admin")
            {
                return "无权限访问";
            }


            //获取操作类型  Type=1 搜索分页数据 Type=2 删除信息 Type=3 删除几个月以前的Api请求记录
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //获取传递的参数
                string RRecordID = PublicClass.FilterRequestTrim("RRecordID");
                string UserKeyID = PublicClass.FilterRequestTrim("UserKeyID");
                string TodayInvokeTime = PublicClass.FilterRequestTrim("TodayInvokeTime");
                string LastApiUrl = PublicClass.FilterRequestTrimNoConvert("LastApiUrl");
                string PassParam = PublicClass.FilterRequestTrimNoConvert("PassParam");
                string LangType = PublicClass.FilterRequestTrim("LangType");
                string InvokeDate = PublicClass.FilterRequestTrim("InvokeDate");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("RRecordID", RRecordID);
                _dic.Add("UserKeyID", UserKeyID);
                _dic.Add("TodayInvokeTime", TodayInvokeTime);
                _dic.Add("LastApiUrl", LastApiUrl);
                _dic.Add("PassParam", PassParam);
                _dic.Add("LangTypeArr", LangType);
                _dic.Add("InvokeDate", InvokeDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ApiReqRecord, "CC_ApiReqRecord", "1", _dic); //BusiApiHttp.httpUserKeyMsg("CC_KeyVerifyRecord", "1", _dic);

                return _json;
            }
            else if (_exeType == "2") //删除信息
            {
                //获取传递的参数
                string MsgIDArr = PublicClass.FilterRequestTrim("MsgIDArr");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("MsgIDArr", MsgIDArr);
                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ApiReqRecord, "CC_KeyVerifyRecord", "2", _dic);
                return _json;
            }
            else if (_exeType == "3") //删除几个月以前的Api请求记录
            {
                // 获取传递的参数
                string MonthNumAgo = PublicClass.FilterRequestTrim("MonthNumAgo");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("MonthNumAgo", MonthNumAgo);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ApiReqRecord, "CC_ApiReqRecord", "3", _dic);
                return _json;
            }


            return "";
        }

        /// <summary>
        /// 系统配置参数
        /// </summary>
        /// <returns></returns>
        public string SystemConfigParam()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("CommonCodePage/SystemConfigParam");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }

            //------只有超级管理员(AdUserType=Admin)才能进入的页-------// 
            string _loginUserAdUserType = BusiLogin.getLoginUserAdUserType();
            if (_loginUserAdUserType != "Admin")
            {
                return "无权限访问";
            }


            //获取操作类型  Type=1 搜索分页数据 Type=2 保存配置参数信息, pConfigID和pConfigName必须有一个不为空
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string ConfigID = PublicClass.FilterRequestTrim("ConfigID");
                string SystemName = PublicClass.FilterRequestTrim("SystemName");
                string ConfigName = PublicClass.FilterRequestTrim("ConfigName");
                string ConfigValue = PublicClass.FilterRequestTrim("ConfigValue");
                string ConfigDesc = PublicClass.FilterRequestTrim("ConfigDesc");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);

                _dic.Add("ConfigID", ConfigID);
                _dic.Add("SystemName", SystemName);
                _dic.Add("ConfigName", ConfigName);
                _dic.Add("ConfigValue", ConfigValue);
                _dic.Add("ConfigDesc", ConfigDesc);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_CC_SystemConfigParam, "CC_SystemConfigParam", "1", _dic);

                return _json;
            }
            else if (_exeType == "2") //保存配置参数信息, pConfigID和pConfigName必须有一个不为空
            {
                //获取传递的参数
                string ConfigID = PublicClass.FilterRequestTrim("ConfigID");
                string ConfigName = PublicClass.FilterRequestTrimNoConvert("ConfigName").Replace("+", "%2B");
                string ConfigValue = PublicClass.FilterRequestTrimNoConvert("ConfigValue").Replace("+", "%2B");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ConfigID", ConfigID);
                _dic.Add("ConfigName", ConfigName);
                _dic.Add("ConfigValue", ConfigValue);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_CC_SystemConfigParam, "CC_SystemConfigParam", "2", _dic);

                return _json;
            }

            return "";
        }

        /// <summary>
        /// 系统信息(系统级异常错误)
        /// </summary>
        /// <returns></returns>
        public string SystemMsg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("CommonCodePage/SystemMsg");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索分页数据  Type=2 删除几个月以前的系统异常信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string SysMsgID = PublicClass.FilterRequestTrim("SysMsgID");
                string OrderIDArr = PublicClass.FilterRequestTrim("OrderIDArr");
                string UserIDArr = PublicClass.FilterRequestTrim("UserIDArr");
                string MsgTitle = PublicClass.FilterRequestTrim("MsgTitle");
                string MsgContent = PublicClass.FilterRequestTrimNoConvert("MsgContent");
                string MsgType = PublicClass.FilterRequestTrimNoConvert("MsgType");
                string SendToType = PublicClass.FilterRequestTrimNoConvert("SendToType");
                string ExtraData = PublicClass.FilterRequestTrimNoConvert("ExtraData");
                string IsRead = PublicClass.FilterRequestTrimNoConvert("IsRead");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrimNoConvert("WriteDate");

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("SysMsgID", SysMsgID);
                _dic.Add("OrderIDArr", OrderIDArr);
                _dic.Add("UserIDArr", UserIDArr);
                _dic.Add("MsgTitle", MsgTitle);
                _dic.Add("MsgContent", MsgContent);
                _dic.Add("MsgType", MsgType);
                _dic.Add("SendToType", SendToType);
                _dic.Add("ExtraData", ExtraData);
                _dic.Add("IsRead", IsRead);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_CC_SystemMsg, "CC_SystemMsg", "1", _dic);

                return _json;
            }
            else if (_exeType == "2") //删除几个月以前的系统异常信息
            {
                //获取传递的参数
                string MonthNumAgo = PublicClass.FilterRequestTrim("MonthNumAgo");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("MonthNumAgo", MonthNumAgo);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_CC_SystemMsg, "CC_SystemMsg", "2", _dic);

                return _json;
            }

            return "";
        }



    }
}