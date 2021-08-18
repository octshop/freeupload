using BusiApiKeyVerifyNS;
using OctUserGoodsShopSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【会员等级，信用分】相关的API接口控制器
/// </summary>
namespace OctUserGoodsShopSystemWeb.PageControllers.ApiPage
{
    public class VipCreditController : Controller
    {
        /// <summary>
        /// 公共接口首页
        /// </summary>
        /// <returns></returns>
        public string Index()
        {
            //-------------要验证签名------------//
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 得到用户的当前等级和信用分 Type=2 得到用户的当前等级和信用分 还有会员账号信息,如：昵称  pBuyerUserID , pBindMobile必须有一个不为空
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1")
            {
                // 获取传递的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");

                //防止数字类型为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiVipLevelCreditScore.getUserVipLevelMsgApi(Convert.ToInt64(BuyerUserID));
                return _jsonBack;
            }
            else if (_exeType == "2") //得到用户的当前等级和信用分 还有会员账号信息,如：昵称  pBuyerUserID , pBindMobile必须有一个不为空
            {
                // 获取传递的参数
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string BindMobile = PublicClass.FilterRequestTrim("BindMobile");
                string IsMaskMobile = PublicClass.FilterRequestTrim("IsMaskMobile");

                //防止数字类型为空
                BuyerUserID = PublicClass.preventNumberDataIsNull(BuyerUserID);

                string _jsonBack = BusiVipLevelCreditScore.getUserVipLevelUserMsgApi(Convert.ToInt64(BuyerUserID), BindMobile, IsMaskMobile);
                return _jsonBack;
            }

            return "";
        }

        /// <summary>
        /// 用户设置信息
        /// </summary>
        /// <returns></returns>
        public string UserSettingMsg()
        {
            //-------------要验证签名------------//
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索数据分页 Type=2 切换锁定/解锁用户设置信息 Type=3 提交用户设置信息 Type=4  批量删除 用户设置信息
            string _exeType = PublicClass.FilterRequestTrim("Type");

            if (_exeType == "1")
            {
                // 获取传递的参数
                string UserSettingID = PublicClass.FilterRequestTrim("UserSettingID");
                string SettingType = PublicClass.FilterRequestTrim("SettingType");
                string SettingMainValue = PublicClass.FilterRequestTrim("SettingMainValue");
                string SettingSubValue = PublicClass.FilterRequestTrim("SettingSubValue");
                string SettingDesc = PublicClass.FilterRequestTrim("SettingDesc");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                UserSettingID = PublicClass.preventNumberDataIsNull(UserSettingID);


                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelUserSettingMsg _modelUserSettingMsg = new ModelUserSettingMsg();
                _modelUserSettingMsg.UserSettingID = Convert.ToInt64(UserSettingID);
                _modelUserSettingMsg.SettingType = SettingType;
                _modelUserSettingMsg.SettingMainValue = SettingMainValue;
                _modelUserSettingMsg.SettingSubValue = SettingSubValue;
                _modelUserSettingMsg.SettingDesc = SettingDesc;
                _modelUserSettingMsg.IsLock = IsLock;
                _modelUserSettingMsg.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONUserSettingMsg(_modelUserSettingMsg, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //切换锁定/解锁用户设置信息
            {
                // 获取传递的参数
                string UserSettingID = PublicClass.FilterRequestTrim("UserSettingID");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //防止数字类型为空
                UserSettingID = PublicClass.preventNumberDataIsNull(UserSettingID);
                string _jsonBack = BusiVipLevelCreditScore.tglLockUserSettingMsgApi(Convert.ToInt64(UserSettingID), IsLock);
                return _jsonBack;
            }
            else if (_exeType == "3") //提交用户设置信息
            {
                //获取传递的参数
                string UserSettingID = PublicClass.FilterRequestTrim("UserSettingID");
                string SettingType = PublicClass.FilterRequestTrim("SettingType");
                string SettingMainValue = PublicClass.FilterRequestTrim("SettingMainValue");
                string SettingSubValue = PublicClass.FilterRequestTrim("SettingSubValue");
                string SettingDesc = PublicClass.FilterRequestTrim("SettingDesc");

                //防止数字类型为空
                UserSettingID = PublicClass.preventNumberDataIsNull(UserSettingID);

                string _jsonBack = BusiVipLevelCreditScore.submitUserSettingMsgApi(Convert.ToInt64(UserSettingID), SettingType, SettingMainValue, SettingSubValue, SettingDesc, "");
                return _jsonBack;
            }
            else if (_exeType == "4") //批量删除 用户设置信息
            {
                //获取传递的参数
                string UserSettingIDArr = PublicClass.FilterRequestTrim("UserSettingIDArr");

                string _jsonBack = BusiVipLevelCreditScore.delUserSettingMsgArrApi(UserSettingIDArr);
                return _jsonBack;
            }

            return "";
        }


    }
}