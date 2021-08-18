using BusiApiKeyVerifyNS;
using OctThirdApiCallSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【发送短信】相关Api接口控制器
/// </summary>
namespace OctThirdApiCallSystemWeb.PageControllers.ApiPage
{
    public class SmsController : Controller
    {
        // GET: Sms
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 发送短信信息
        /// </summary>
        /// <returns></returns>
        public string SmsSendMsg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 数据分页 Type=2  添加 发送短信信息 Type=3 验证短信中的验证码是否正确 Type=4 锁定/解锁 发送短信信息 Type=5 发送验证码短信 Type=6 删除几个月以前的 发送短信信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string SmsSendID = PublicClass.FilterRequestTrim("SmsSendID");
                string ToMobileNumbers = PublicClass.FilterRequestTrim("ToMobileNumbers");
                string SmsType = PublicClass.FilterRequestTrim("SmsType");
                string SmsTemplateCode = PublicClass.FilterRequestTrim("SmsTemplateCode");
                string SmsTemplateParam = PublicClass.FilterRequestTrim("SmsTemplateParam");
                string VerifyCode = PublicClass.FilterRequestTrim("VerifyCode");
                string IsVerify = PublicClass.FilterRequestTrim("IsVerify");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                SmsSendID = PublicClass.preventNumberDataIsNull(SmsSendID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelSmsSendMsg _modelSmsSendMsg = new ModelSmsSendMsg();
                _modelSmsSendMsg.SmsSendID = Convert.ToInt64(SmsSendID);
                _modelSmsSendMsg.ToMobileNumbers = ToMobileNumbers;
                _modelSmsSendMsg.SmsType = SmsType;
                _modelSmsSendMsg.SmsTemplateCode = SmsTemplateCode;
                _modelSmsSendMsg.SmsTemplateParam = SmsTemplateParam;
                _modelSmsSendMsg.VerifyCode = VerifyCode;
                _modelSmsSendMsg.IsVerify = IsVerify;
                _modelSmsSendMsg.IsLock = IsLock;
                _modelSmsSendMsg.WriteDate = WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONSmsSendMsg(_modelSmsSendMsg, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //添加 发送短信信息
            {
                //获取传递的参数
                string ToMobileNumbers = PublicClass.FilterRequestTrimNoConvert("ToMobileNumbers");
                string SmsType = PublicClass.FilterRequestTrim("SmsType");
                string SmsTemplateCode = PublicClass.FilterRequestTrim("SmsTemplateCode");
                string SmsTemplateParam = PublicClass.FilterRequestTrimNoConvert("SmsTemplateParam");
                string VerifyCode = PublicClass.FilterRequestTrim("VerifyCode");

                //添加 发送短信信息 --API调用方法
                string _addBack = BusiSms.addSmsSendMsgApi(ToMobileNumbers, SmsType, SmsTemplateCode, SmsTemplateParam, VerifyCode);
                return _addBack;
            }
            else if (_exeType == "3") //验证短信中的验证码是否正确
            {
                //获取传递的参数
                string ToMobileNumbers = PublicClass.FilterRequestTrim("ToMobileNumbers");
                string VerifyCode = PublicClass.FilterRequestTrim("VerifyCode");

                //验证短信中的验证码是否正确 --API调用方法
                return BusiSms.verifySmsCheckCodeApi(ToMobileNumbers, VerifyCode);
            }
            else if (_exeType == "4") //锁定/解锁 发送短信信息
            {
                // 获取传递的参数
                string SmsSendID = PublicClass.FilterRequestTrim("SmsSendID");

                //锁定/解锁 发送短信信息 --API调用方法
                return BusiSms.lockSmsSendMsgApi(Convert.ToInt64(SmsSendID));
            }
            else if (_exeType == "5") //发送验证码短信
            {
                // 获取传递的参数
                string ToMobileNumbers = PublicClass.FilterRequestTrim("ToMobileNumbers");
                string SmsType = PublicClass.FilterRequestTrim("SmsType");

                string _josnBack = BusiSms.addSmsSendMsgVerifyCodeApi(ToMobileNumbers, SmsType);
                return _josnBack;
            }
            else if (_exeType == "6") //删除几个月以前的 发送短信信息
            {
                // 获取传递的参数
                string MonthNumAgo = PublicClass.FilterRequestTrim("MonthNumAgo");

                //防止数字类型为空
                MonthNumAgo = PublicClass.preventNumberDataIsNull(MonthNumAgo);

                string _jsonBack = BusiSms.delSmsSendMsgMonthAgoApi(Convert.ToInt32(MonthNumAgo));
                return _jsonBack;
            }

            return "";
        }



    }
}