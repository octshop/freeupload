using BusiApiKeyVerifyNS;
using OctCommonCodeNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【系统信息】相关API接口控制器
/// </summary>
namespace OctCommonCodeSystemWeb.PageControllers.ApiPage
{
    public class SysMsgController : Controller
    {
        /// <summary>
        /// 公共接口首页
        /// </summary>
        /// <returns></returns>
        public string Index()
        {

            return "";
        }

        /// <summary>
        /// 系统信息(系统级异常错误)
        /// </summary>
        /// <returns></returns>
        public string SystemMsg()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据  Type=2 删除几个月以前的 系统异常信息
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


                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                SysMsgID = PublicClass.preventNumberDataIsNull(SysMsgID);


                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelSystemMsg _modelSystemMsg = new ModelSystemMsg();
                _modelSystemMsg.SysMsgID = Convert.ToInt64(SysMsgID);
                _modelSystemMsg.OrderIDArr = OrderIDArr;
                _modelSystemMsg.UserIDArr = UserIDArr;
                _modelSystemMsg.MsgTitle = MsgTitle;
                _modelSystemMsg.MsgContent = MsgContent;
                _modelSystemMsg.MsgType = MsgType;
                _modelSystemMsg.SendToType = SendToType;
                _modelSystemMsg.ExtraData = ExtraData;
                _modelSystemMsg.IsRead = IsRead;
                _modelSystemMsg.IsLock = IsLock;
                _modelSystemMsg.WriteDate = WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONSystemMsg(_modelSystemMsg, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                if (string.IsNullOrWhiteSpace(_strJson) == false)
                {
                    //将所有系统异常信息 更改为【已读】
                    BusiSystemMsg.readedAllSystemMsg();
                }

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //删除几个月以前的 系统异常信息
            {
                //获取传递的参数
                string MonthNumAgo = PublicClass.FilterRequestTrim("MonthNumAgo");

                //防止数字类型为空
                MonthNumAgo = PublicClass.preventNumberDataIsNull(MonthNumAgo);

                string _jsonBack = BusiSystemMsg.delSystemMsgMonthAgoApi(Convert.ToInt32(MonthNumAgo));
                return _jsonBack;
            }

            return "";
        }

    }
}