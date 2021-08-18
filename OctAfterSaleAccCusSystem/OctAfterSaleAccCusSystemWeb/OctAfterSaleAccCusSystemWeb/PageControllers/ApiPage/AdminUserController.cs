using BusiApiKeyVerifyNS;
using OctAfterSaleAccCusNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【CMS管理用户】API接口控制器
/// </summary>
namespace OctAfterSaleAccCusSystemWeb.PageControllers.ApiPage
{
    public class AdminUserController : Controller
    {

        /// <summary>
        /// CMS管理用户信息
        /// </summary>
        /// <returns></returns>
        public string AdminUserMsg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索数据分页 Type=2 提交 CMS管理用户信息 Type=3 批量删除 - CMS管理用户信息 Type=4 批量锁定/解锁- CMS管理用户信息 Type=5 检测管理用户登录是否正确 Type=6 初始化 CMS管理用户信息 Type=7 修改 管理用户的 登录密码
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string AdUserID = PublicClass.FilterRequestTrim("AdUserID");
                string AdUserType = PublicClass.FilterRequestTrim("AdUserType");
                string AdUserName = PublicClass.FilterRequestTrim("AdUserName");
                string AdPowerIDArr = PublicClass.FilterRequestTrim("AdPowerIDArr");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                AdUserID = PublicClass.preventNumberDataIsNull(AdUserID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelAdminUserMsg _modelAdminUserMsg = new ModelAdminUserMsg();
                _modelAdminUserMsg.AdUserID = Convert.ToInt64(AdUserID);
                _modelAdminUserMsg.AdUserType = AdUserType;
                _modelAdminUserMsg.AdUserName = AdUserName;
                _modelAdminUserMsg.AdPowerIDArr = AdPowerIDArr;
                _modelAdminUserMsg.IsLock = IsLock;
                _modelAdminUserMsg.WriteDate = WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONAdminUserMsg(_modelAdminUserMsg, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //提交 CMS管理用户信息
            {
                // 获取传递的参数
                string AdUserID = PublicClass.FilterRequestTrim("AdUserID");
                string AdUserType = PublicClass.FilterRequestTrim("AdUserType");
                string AdUserName = PublicClass.FilterRequestTrim("AdUserName");
                string AdUserPwd = PublicClass.FilterRequestTrim("AdUserPwd");
                string AdExePwd = PublicClass.FilterRequestTrim("AdExePwd");
                string AdPowerIDArr = PublicClass.FilterRequestTrim("AdPowerIDArr");

                //防止数字类型为空
                AdUserID = PublicClass.preventNumberDataIsNull(AdUserID);

                //加密密码
                string AdUserPwdSHA1 = EncryptionClassNS.EncryptionClass.GetSHA1(AdUserPwd);
                string AdExePwdSHA1 = EncryptionClassNS.EncryptionClass.GetSHA1(AdExePwd);

                string _jsonBack = BusiAdminUser.submitAdminUserMsgApi(Convert.ToInt64(AdUserID), AdUserType, AdUserName, AdUserPwdSHA1, AdExePwdSHA1, AdPowerIDArr);
                return _jsonBack;
            }
            else if (_exeType == "3") //批量删除 - CMS管理用户信息{
            {
                // 获取传递的参数
                string AdUserIDArr = PublicClass.FilterRequestTrim("AdUserIDArr");

                string _jsonBack = BusiAdminUser.delAdminUserMsgArrApi(AdUserIDArr);
                return _jsonBack;
            }
            else if (_exeType == "4") //批量锁定/解锁- CMS管理用户信息
            {
                // 获取传递的参数
                string AdUserIDArr = PublicClass.FilterRequestTrim("AdUserIDArr");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                string _jsonBack = BusiAdminUser.lockAdminUserMsgArrApi(AdUserIDArr, IsLock);
                return _jsonBack;
            }
            else if (_exeType == "5") //检测管理用户登录是否正确
            {
                //获取传递的参数
                //AdUserID 和 AdUserName 必须有一个不为空
                string AdUserID = PublicClass.FilterRequestTrim("AdUserID");
                string AdUserName = PublicClass.FilterRequestTrim("AdUserName");
                //SHA1加密的密码
                string AdUserPwdSHA1 = PublicClass.FilterRequestTrim("AdUserPwdSHA1");
                //选填
                string EnterPagePathCurrent = PublicClass.FilterRequestTrim("EnterPagePathCurrent");

                //防止数字类型为空
                AdUserID = PublicClass.preventNumberDataIsNull(AdUserID);

                string _jsonBack = BusiAdminUser.chkAdminUserLoginApi(Convert.ToInt64(AdUserID),AdUserName, AdUserPwdSHA1, EnterPagePathCurrent);
                return _jsonBack;
            }
            else if (_exeType == "6") //初始化 CMS管理用户信息
            {
                //获取传递的参数
                string AdUserID = PublicClass.FilterRequestTrim("AdUserID");

                //防止数字类型为空
                AdUserID = PublicClass.preventNumberDataIsNull(AdUserID);

                string _jsonBack = BusiAdminUser.initAdminUserMsgApi(Convert.ToInt64(AdUserID));
                return _jsonBack;
            }
            else if (_exeType == "7") //修改 管理用户的 登录密码
            {
                //获取传递的参数
                string AdUserID = PublicClass.FilterRequestTrim("AdUserID");
                string AdUserPwdOldSha1 = PublicClass.FilterRequestTrim("AdUserPwdOldSha1");
                string AdUserPwdNewSha1 = PublicClass.FilterRequestTrim("AdUserPwdNewSha1");

                //防止数字类型为空
                AdUserID = PublicClass.preventNumberDataIsNull(AdUserID);

                string _jsonBack = BusiAdminUser.chgAdUserPwdApi(Convert.ToInt64(AdUserID), AdUserPwdOldSha1, AdUserPwdNewSha1);
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        ///CMS管理权限信息
        /// </summary>
        /// <returns></returns>
        public string AdminPowerMsg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索数据分页 Type=2 提交 CMS管理权限信息 Type=3 批量删除-CMS管理权限信息 Type=4 批量锁定/解锁-CMS管理权限信息 
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string AdPowerID = PublicClass.FilterRequestTrim("AdPowerID");
                string PowerName = PublicClass.FilterRequestTrim("PowerName");
                string EnterPagePath = PublicClass.FilterRequestTrim("EnterPagePath");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                AdPowerID = PublicClass.preventNumberDataIsNull(AdPowerID);

                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelAdminPowerMsg _modelAdminPowerMsg = new ModelAdminPowerMsg();
                _modelAdminPowerMsg.AdPowerID = Convert.ToInt64(AdPowerID);
                _modelAdminPowerMsg.PowerName = PowerName;
                _modelAdminPowerMsg.EnterPagePath = EnterPagePath;
                _modelAdminPowerMsg.IsLock = IsLock;
                _modelAdminPowerMsg.WriteDate = WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONAdminPowerMsg(_modelAdminPowerMsg, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //提交 CMS管理权限信息
            {
                // 获取传递的参数
                string AdPowerID = PublicClass.FilterRequestTrim("AdPowerID");
                string PowerName = PublicClass.FilterRequestTrim("PowerName");
                string EnterPagePath = PublicClass.FilterRequestTrim("EnterPagePath");

                //防止数字类型为空
                AdPowerID = PublicClass.preventNumberDataIsNull(AdPowerID);

                string _jsonBack = BusiAdminUser.submitAdminPowerMsgApi(Convert.ToInt64(AdPowerID), PowerName, EnterPagePath);
                return _jsonBack;
            }
            else if (_exeType == "3") //批量删除-CMS管理权限信息
            {
                // 获取传递的参数
                string AdPowerIDArr = PublicClass.FilterRequestTrim("AdPowerIDArr");

                string _jsonBack = BusiAdminUser.delAdminPowerMsgArrApi(AdPowerIDArr);
                return _jsonBack;
            }
            else if (_exeType == "4") //批量锁定/解锁-CMS管理权限信息 
            {
                // 获取传递的参数
                string AdPowerIDArr = PublicClass.FilterRequestTrim("AdPowerIDArr");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                string _jsonBack = BusiAdminUser.lockAdminPowerMsgArrApi(AdPowerIDArr, IsLock);
                return _jsonBack;
            }
            return "";

        }


    }
}