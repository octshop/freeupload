using BusiApiHttpNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
///【售后,投诉,客服反馈,消息系统 (OctAfterSaleAccCusSystem)】Ajax请求控制器
/// </summary>
namespace OctCmsSystemWeb.PageControllers.AjaxPage
{
    public class AfterSaleAccCusController : Controller
    {
        /// <summary>
        /// 公共AJax首页
        /// </summary>
        /// <returns></returns>
        public string Index()
        {
            return "";
        }

        /// <summary>
        /// 投诉信息
        /// </summary>
        /// <returns></returns>
        public string OrderComplainMsg()
        {

            return "";
        }

        #region【售后,退款退货】

        /// <summary>
        /// 售后申请信息
        /// </summary>
        /// <returns></returns>
        public string AfterSaleApplyMsg()
        {

            return "";
        }

        /// <summary>
        /// 退货退款申请
        /// </summary>
        /// <returns></returns>
        public string RefundApplyMsg()
        {
           

            return "";
        }

        #endregion

        #region【说明性文本】

        [ValidateInput(false)]
        /// <summary>
        /// 说明文章信息
        /// </summary>
        /// <returns></returns>
        public string ExplainText()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("AfterSaleAccCusPage/ExplainText^AfterSaleAccCusPage/ExplainTextAe^AfterSaleAccCusPage/ExplainImg");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索数据分页 Type=2 提交 说明性文本内容 Type=3 初始化说明性文本内容 Type=4 删除说明性文本内容 Type=5 批量锁定/解锁 说明性文本内容 Type=6 置顶 说明性文本内容
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string ExplainID = PublicClass.FilterRequestTrim("ExplainID");
                string ExplainType = PublicClass.FilterRequestTrim("ExplainType");
                string ExplainTitle = PublicClass.FilterRequestTrim("ExplainTitle");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //---当前页----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", PageCurrent);
                _dic.Add("ExplainID", ExplainID);
                _dic.Add("ExplainType", ExplainType);
                _dic.Add("ExplainTitle", ExplainTitle);
                _dic.Add("IsLock", IsLock);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_ExplainText, "ASAC_ExplainText", "2", _dic);
                return _json;
            }
            else if (_exeType == "2") //提交 说明性文本内容
            {
                // 获取传递的参数
                string ExplainID = PublicClass.FilterRequestTrim("ExplainID");
                string ExplainType = PublicClass.FilterRequestTrim("ExplainType");
                string ExplainTitle = PublicClass.FilterRequestTrim("ExplainTitle");

                string ExplainContent = "";
                try
                {
                    ExplainContent = Request["ExplainContent"].ToString().Trim();
                }
                catch { };
                //过滤掉 GiftDesc 中的<Script /> 等标签
                ExplainContent = PublicClass.FilterFrameset(PublicClass.FilterHrefScript(PublicClass.FilterIframe(PublicClass.FilterScript(ExplainContent))));
                //说明性文本内容 需要进行 Base64 转换加密
                ExplainContent = EncryptionClassNS.EncryptionClass.EncodeBase64("utf-8", ExplainContent);

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ExplainID", ExplainID);
                _dic.Add("ExplainType", ExplainType);
                _dic.Add("ExplainTitle", ExplainTitle);
                _dic.Add("ExplainContent", ExplainContent);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_ExplainText, "ASAC_ExplainText", "3", _dic);
                return _json;
            }
            else if (_exeType == "3") //初始化说明性文本内容
            {
                // 获取传递的参数
                string ExplainID = PublicClass.FilterRequestTrim("ExplainID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ExplainID", ExplainID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_ExplainText, "ASAC_ExplainText", "8", _dic);
                return _json;
            }
            else if (_exeType == "4")
            {
                // 获取传递的参数
                string ExplainIDArr = PublicClass.FilterRequestTrim("ExplainIDArr");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ExplainIDArr", ExplainIDArr);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_ExplainText, "ASAC_ExplainText", "6", _dic);
                return _json;
            }
            else if (_exeType == "5") //批量锁定/解锁 说明性文本内容
            {
                // 获取传递的参数
                string ExplainIDArr = PublicClass.FilterRequestTrim("ExplainIDArr");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ExplainIDArr", ExplainIDArr);
                _dic.Add("IsLock", IsLock);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_ExplainText, "ASAC_ExplainText", "4", _dic);
                return _json;
            }
            else if (_exeType == "6") //置顶 说明性文本内容
            {
                // 获取传递的参数
                string ExplainID = PublicClass.FilterRequestTrim("ExplainID");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("ExplainID", ExplainID);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_ExplainText, "ASAC_ExplainText", "5", _dic);
                return _json;
            }

            return "";
        }

        /// <summary>
        /// 说明文章图片
        /// </summary>
        /// <returns></returns>
        public string ExplainImg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("AfterSaleAccCusPage/ExplainText^AfterSaleAccCusPage/ExplainTextAe^AfterSaleAccCusPage/ExplainImg");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }

            return "";
        }

        #endregion

        #region【系统通知信息】

        /// <summary>
        /// 买家通知信息
        /// </summary>
        /// <returns></returns>
        public string BuyerSysMsg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("AfterSaleAccCusPage/BuyerSysMsg");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索数据分页 Type=2 删除几个月以前的 买家通知信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string BSysMsgID = PublicClass.FilterRequestTrim("BSysMsgID");
                string BuyerUserID = PublicClass.FilterRequestTrim("BuyerUserID");
                string SysMsgType = PublicClass.FilterRequestTrim("SysMsgType");
                string MsgTitle = PublicClass.FilterRequestTrim("MsgTitle");
                string MsgContent = PublicClass.FilterRequestTrim("MsgContent");
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string IsRead = PublicClass.FilterRequestTrim("IsRead");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //---当前页----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", PageCurrent);
                _dic.Add("BSysMsgID", BSysMsgID);
                _dic.Add("BuyerUserID", BuyerUserID);
                _dic.Add("SysMsgType", SysMsgType);
                _dic.Add("MsgTitle", MsgTitle);
                _dic.Add("MsgContent", MsgContent);
                _dic.Add("OrderID", OrderID);
                _dic.Add("ExtraData", ExtraData);
                _dic.Add("IsRead", IsRead);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_BuyerSysMsg, "ASAC_BuyerSysMsg", "1", _dic);
                return _json;
            }
            else if (_exeType == "2") //删除几个月以前的 买家通知信息
            {
                // 获取传递的参数
                string MonthNumAgo = PublicClass.FilterRequestTrim("MonthNumAgo");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("MonthNumAgo", MonthNumAgo);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_BuyerSysMsg, "ASAC_BuyerSysMsg", "5", _dic);
                return _json;
            }

            return "";
        }

        /// <summary>
        /// 商家通知信息
        /// </summary>
        /// <returns></returns>
        public string ShopSysMsg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("AfterSaleAccCusPage/ShopSysMsg");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索数据分页 Type=2 删除几个月以前的通知信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string SSysMsgID = PublicClass.FilterRequestTrim("SSysMsgID");
                string ShopUserID = PublicClass.FilterRequestTrim("ShopUserID");
                string SysMsgType = PublicClass.FilterRequestTrim("SysMsgType");
                string MsgTitle = PublicClass.FilterRequestTrim("MsgTitle");
                string MsgContent = PublicClass.FilterRequestTrim("MsgContent");
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string IsRead = PublicClass.FilterRequestTrim("IsRead");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //---当前页----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", PageCurrent);
                _dic.Add("SSysMsgID", SSysMsgID);
                _dic.Add("ShopUserID", ShopUserID);
                _dic.Add("SysMsgType", SysMsgType);
                _dic.Add("MsgTitle", MsgTitle);
                _dic.Add("MsgContent", MsgContent);
                _dic.Add("OrderID", OrderID);
                _dic.Add("ExtraData", ExtraData);
                _dic.Add("IsRead", IsRead);
                _dic.Add("WriteDate", WriteDate);

                _dic.Add("IsCMSLoad", "true");

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_ShopSysMsg, "ASAC_ShopSysMsg", "1", _dic);
                return _json;
            }
            else if (_exeType == "2") //删除几个月以前的通知信息
            {
                // 获取传递的参数
                string MonthNumAgo = PublicClass.FilterRequestTrim("MonthNumAgo");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("MonthNumAgo", MonthNumAgo);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_ShopSysMsg, "ASAC_ShopSysMsg", "5", _dic);
                return _json;
            }


            return "";
        }

        /// <summary>
        /// 平台通知信息
        /// </summary>
        /// <returns></returns>
        public string PlatformSysMsg()
        {
            //------检测【Ajax请求】用户登录是否正确 CPAUL_01------//
            string _backLoginCode = BusiLogin.chkAjaxAdminUserLogin("AfterSaleAccCusPage/PlatformSysMsg");
            if (_backLoginCode != "CPAUL_01")
            {
                return "";
            }


            //获取操作类型  Type=1 搜索数据分页 Type=2 删除几个月以前的通知信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string PSysMsgID = PublicClass.FilterRequestTrim("PSysMsgID");
                string SysMsgType = PublicClass.FilterRequestTrim("SysMsgType");
                string MsgTitle = PublicClass.FilterRequestTrim("MsgTitle");
                string MsgContent = PublicClass.FilterRequestTrim("MsgContent");
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string IsRead = PublicClass.FilterRequestTrim("IsRead");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //---当前页----//
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", PageCurrent);

                _dic.Add("PSysMsgID", PSysMsgID);
                _dic.Add("SysMsgType", SysMsgType);
                _dic.Add("MsgTitle", MsgTitle);
                _dic.Add("MsgContent", MsgContent);
                _dic.Add("ExtraData", ExtraData);
                _dic.Add("IsRead", IsRead);
                _dic.Add("WriteDate", WriteDate);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_PlatformSysMsg, "ASAC_PlatformSysMsg", "1", _dic);
                return _json;
            }
            else if (_exeType == "2") //删除几个月以前的通知信息
            {
                // 获取传递的参数
                string MonthNumAgo = PublicClass.FilterRequestTrim("MonthNumAgo");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("MonthNumAgo", MonthNumAgo);

                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_PlatformSysMsg, "ASAC_PlatformSysMsg", "5", _dic);
                return _json;
            }


            return "";
        }


        #endregion

    }
}