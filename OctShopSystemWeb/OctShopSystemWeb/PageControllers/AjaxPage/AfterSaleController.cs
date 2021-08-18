using BusiApiHttpNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【售后】相关Ajax请求控制器
/// </summary>
namespace OctShopSystemWeb.PageControllers.AjaxPage
{
    public class AfterSaleController : Controller
    {
        // GET: AfterSale
        public ActionResult Index()
        {
            return View();
        }

        #region【售后信息】

        /// <summary>
        /// 售后申请信息
        /// </summary>
        /// <returns></returns>
        public string AfterSaleApplyMsg()
        {

            return "";
        }

        /// <summary>
        /// 售后发货和上门信息
        /// </summary>
        /// <returns></returns>
        public string AfterSaleSendGoods()
        {

            return "";
        }

        #endregion

        #region【消息通知】

        /// <summary>
        /// 商家消息通知
        /// </summary>
        /// <returns></returns>
        public string ShopSysMsg()
        {
            //判断商家登录是否正确，并获取登录的UserID
            string _loginUserID = BusiLogin.isLoginRetrunUserID();
            if (string.IsNullOrWhiteSpace(_loginUserID))
            {
                return "";
            }

            //获取操作类型  Type=1 搜索数据分页 
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 获取传递的参数
                string SSysMsgID = PublicClass.FilterRequestTrim("SSysMsgID");
                string SysMsgType = PublicClass.FilterRequestTrim("SysMsgType");
                string MsgTitle = PublicClass.FilterRequestTrim("MsgTitle");
                string MsgContent = PublicClass.FilterRequestTrim("MsgContent");
                string OrderID = PublicClass.FilterRequestTrim("OrderID");
                string ExtraData = PublicClass.FilterRequestTrim("ExtraData");
                string IsRead = PublicClass.FilterRequestTrim("IsRead");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页
                string pageCurrent = PublicClass.FilterRequestTrimNoConvert("pageCurrent");

                //添加POST参数
                IDictionary<string, string> _dic = new Dictionary<string, string>();
                _dic.Add("PageCurrent", pageCurrent);
                _dic.Add("ShopUserID", _loginUserID);
                _dic.Add("SSysMsgID", SSysMsgID);
                _dic.Add("SysMsgType", SysMsgType);
                _dic.Add("MsgTitle", MsgTitle);
                _dic.Add("MsgContent", MsgContent);
                _dic.Add("OrderID", OrderID);
                _dic.Add("ExtraData", ExtraData);
                _dic.Add("IsRead", IsRead);
                _dic.Add("WriteDate", WriteDate);
                _dic.Add("IsCMSLoad", "false");


                //正式发送Http请求
                string _json = BusiApiHttp.httpApiAjaxPage(WebAppConfig.ApiUrl_ASAC_ShopSysMsg, "ASAC_ShopSysMsg", "1", _dic);
                return _json;
            }

            return "";
        }

        #endregion


    }
}