using BusiApiKeyVerifyNS;
using OctCommonCodeNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【与Api信息管理】相关的接口控制器
/// </summary>
namespace OctCommonCodeSystemWeb.PageControllers.ApiPage
{
    public class ApiController : Controller
    {
        // GET: Api
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
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据  Type=2 添加编辑API用户信息 Type=3 得到API用户信息(初始化窗口) Type=4 开关锁定 Type=5 删除信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

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


                //防止数字类型为空
                _KeyID = PublicClass.preventNumberDataIsNull(_KeyID);
                _UserKeyID = PublicClass.preventNumberDataIsNull(_UserKeyID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelApiUserKeyMsg _modelApiUserKeyMsg = new ModelApiUserKeyMsg();
                _modelApiUserKeyMsg.KeyID = Convert.ToInt64(_KeyID);
                _modelApiUserKeyMsg.UserKeyID = Convert.ToInt64(_UserKeyID);
                _modelApiUserKeyMsg.UserKeyName = _UserKeyName;
                _modelApiUserKeyMsg.VerifyMobile = _VerifyMobile;
                _modelApiUserKeyMsg.UserKey = _UserKey;
                _modelApiUserKeyMsg.VerifyTypeArr = _VerifyTypeArr;
                _modelApiUserKeyMsg.HttpDomainArr = _HttpDomainArr;
                _modelApiUserKeyMsg.HttpServerIPArr = _HttpServerIPArr;
                _modelApiUserKeyMsg.LinkMan = _LinkMan;
                _modelApiUserKeyMsg.LinkMobile = _LinkMobile;
                _modelApiUserKeyMsg.KeyMemo = _KeyMemo;
                _modelApiUserKeyMsg.IsRecord = _IsRecord;
                _modelApiUserKeyMsg.IsRndKeyTimeRecord = _IsRndKeyTimeRecord;
                _modelApiUserKeyMsg.IsLock = _IsLock;
                _modelApiUserKeyMsg.WriteDate = _WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "HttpDomainArr,HttpServerIPArr,IsRecord,IsRndKeyTimeRecord,VerifyTypeArr,PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONApiUserKeyMsg(_modelApiUserKeyMsg, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加编辑API用户信息
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

                if (string.IsNullOrWhiteSpace(ExeType) == false && ExeType == "edit" && KeyID != "0")
                {
                    //编辑API用户信息
                    return BusiUserKeyMsg.editUserKeyMsgApi(Convert.ToInt64(KeyID), UserKeyID, UserKeyName, VerifyMobile, UserKey, LinkMan, LinkMobile, VerifyTypeArr, HttpDomainArr, HttpServerIPArr, KeyMemo, IsRecord, IsRndKeyTimeRecord);
                }
                else
                {
                    //添加API用户信息
                    return BusiUserKeyMsg.addUserKeyMsgApi(UserKeyID, UserKeyName, VerifyMobile, UserKey, LinkMan, LinkMobile, VerifyTypeArr, HttpDomainArr, HttpServerIPArr, KeyMemo, IsRecord, IsRndKeyTimeRecord);
                }
            }
            else if (_exeType == "3") //得到API用户信息(初始化窗口)
            {
                //获取传递的参数
                string KeyID = PublicClass.FilterRequestTrim("KeyID");
                string UserKeyID = PublicClass.FilterRequestTrim("UserKeyID");

                KeyID = PublicClass.preventNumberDataIsNull(KeyID);
                UserKeyID = PublicClass.preventNumberDataIsNull(UserKeyID);

                //得到API用户信息 返回Json字符串
                return BusiUserKeyMsg.getUserKeyMsgApi(Convert.ToInt64(KeyID), Convert.ToInt64(UserKeyID));

            }
            else if (_exeType == "4") //开关锁定
            {
                //获取传递的参数
                string KeyID = PublicClass.FilterRequestTrim("KeyID");

                //开关锁定
                return BusiUserKeyMsg.lockApiUserKeyMsgApi(Convert.ToInt64(KeyID));
            }
            else if (_exeType == "5") //删除信息
            {
                //获取传递的参数
                string MsgIDArr = PublicClass.FilterRequestTrim("MsgIDArr");

                //批量删除 API用户信息
                return BusiUserKeyMsg.delMulUserKeyMsgApi(MsgIDArr);
            }

            return "";
        }

        /// <summary>
        /// Api请求Key验证记录
        /// </summary>
        /// <returns></returns>
        public string KeyVerifyRecord()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 开关锁定 Type=3 删除信息 Type=4 删除几个月以前的 Api请求Key验证记录
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取当前页
                string _pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //获取传递的参数
                string VRecordID = PublicClass.FilterRequestTrim("VRecordID");
                string UserKeyID = PublicClass.FilterRequestTrim("UserKeyID");
                string RndKey = PublicClass.FilterRequestTrimNoConvert("RndKey");
                string UserKey = PublicClass.FilterRequestTrimNoConvert("UserKey");
                string VerifyType = PublicClass.FilterRequestTrimNoConvert("VerifyTypeArr");
                string LangType = PublicClass.FilterRequestTrimNoConvert("LangTypeArr");
                string IsVerify = PublicClass.FilterRequestTrimNoConvert("IsVerify");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrimNoConvert("WriteDate");


                //防止数字类型为空
                VRecordID = PublicClass.preventNumberDataIsNull(VRecordID);
                UserKeyID = PublicClass.preventNumberDataIsNull(UserKeyID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelApiKeyVerifyRecord _modelApiKeyVerifyRecord = new ModelApiKeyVerifyRecord();
                _modelApiKeyVerifyRecord.VRecordID = Convert.ToInt64(VRecordID);
                _modelApiKeyVerifyRecord.UserKeyID = Convert.ToInt64(UserKeyID);
                _modelApiKeyVerifyRecord.RndKey = RndKey;
                _modelApiKeyVerifyRecord.UserKey = UserKey;
                _modelApiKeyVerifyRecord.VerifyType = VerifyType;
                _modelApiKeyVerifyRecord.LangType = LangType;
                _modelApiKeyVerifyRecord.IsVerify = IsVerify;
                _modelApiKeyVerifyRecord.IsLock = IsLock;
                _modelApiKeyVerifyRecord.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONApiKeyVerifyRecord(_modelApiKeyVerifyRecord, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //开关锁定
            {
                //获取传递的参数
                string VRecordID = PublicClass.FilterRequestTrim("VRecordID");
                //开关锁定
                return BusiApi.lockApiKeyVerifyRecordApi(Convert.ToInt64(VRecordID));
            }
            else if (_exeType == "3") //删除信息
            {
                //获取传递的参数
                string MsgIDArr = PublicClass.FilterRequestTrim("MsgIDArr");

                //批量删除 API用户信息
                return BusiApi.delMulApiKeyVerifyRecordApi(MsgIDArr);
            }
            else if (_exeType == "4") //删除几个月以前的 Api请求Key验证记录
            {
                // 获取传递的参数
                string MonthNumAgo = PublicClass.FilterRequestTrim("MonthNumAgo");

                //防止数字类型为空
                MonthNumAgo = PublicClass.preventNumberDataIsNull(MonthNumAgo);

                string _jsonBack = BusiApi.delApiKeyVerifyRecordMonthAgoApi(Convert.ToInt32(MonthNumAgo));
                return _jsonBack;
            }


            return "";
        }

        /// <summary>
        /// Api调用记录
        /// </summary>
        /// <returns></returns>
        public string ApiReqRecord()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据 Type=2 删除信息 Type=3 删除几个月以前的Api请求记录
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取当前页
                string _pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //获取传递的参数
                string RRecordID = PublicClass.FilterRequestTrim("RRecordID");
                string UserKeyID = PublicClass.FilterRequestTrim("UserKeyID");
                string TodayInvokeTime = PublicClass.FilterRequestTrim("TodayInvokeTime");
                string LastApiUrl = PublicClass.FilterRequestTrimNoConvert("LastApiUrl");
                string PassParam = PublicClass.FilterRequestTrimNoConvert("PassParam");
                string LangType = PublicClass.FilterRequestTrim("LangType");
                string InvokeDate = PublicClass.FilterRequestTrim("InvokeDate");

                //防止数字类型为空
                RRecordID = PublicClass.preventNumberDataIsNull(RRecordID);
                UserKeyID = PublicClass.preventNumberDataIsNull(UserKeyID);
                TodayInvokeTime = PublicClass.preventNumberDataIsNull(TodayInvokeTime);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelApiReqRecord _modelApiReqRecord = new ModelApiReqRecord();
                _modelApiReqRecord.RRecordID = Convert.ToInt64(RRecordID);
                _modelApiReqRecord.UserKeyID = Convert.ToInt64(UserKeyID);
                _modelApiReqRecord.TodayInvokeTime = Convert.ToInt64(TodayInvokeTime);
                _modelApiReqRecord.LastApiUrl = LastApiUrl;
                _modelApiReqRecord.PassParam = PassParam;
                _modelApiReqRecord.LangType = LangType;
                _modelApiReqRecord.InvokeDate = InvokeDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONApiReqRecord(_modelApiReqRecord, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //删除信息
            {
                //获取传递的参数
                string MsgIDArr = PublicClass.FilterRequestTrim("MsgIDArr");

                //批量删除 API用户信息
                return BusiApi.delMulApiReqRecordApi(MsgIDArr);
            }
            else if (_exeType == "3") //删除几个月以前的Api请求记录
            {
                // 获取传递的参数
                string MonthNumAgo = PublicClass.FilterRequestTrim("MonthNumAgo");

                //防止数字类型为空
                MonthNumAgo = PublicClass.preventNumberDataIsNull(MonthNumAgo);

                string _jsonBack = BusiApi.delApiReqRecordMonthAgoApi(Convert.ToInt32(MonthNumAgo));
                return _jsonBack;
            }

            return "";
        }



    }
}