using BusiApiKeyVerifyNS;
using OctAdvertiserSystemNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【导航】相关的API接口控制器
/// </summary>
namespace OctAdvertiserSystemWeb.PageControllers.ApiPage
{
    public class NavController : Controller
    {

        #region【栏目图标导航信息】

        /// <summary>
        /// 栏目图标导航信息
        /// </summary>
        /// <returns></returns>
        public string NavIconMsg()
        {
            //获取操作类型  Type=1 搜索分页数据  Type=2 加载 不同类型的栏目图标导航信息 Type=3 提交 栏目图标导航信息 Type=4 切换显隐 栏目图标导航 Type=5 批量删除 栏目图标导航信息 Type=6 修改栏目图标导航信息 排序 Type=7 初始化栏目图标导航信息
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "2")
            {
                // 获取传递的参数
                string NavType = PublicClass.FilterRequestTrim("NavType");
                string OsType = PublicClass.FilterRequestTrim("OsType");
                if (string.IsNullOrWhiteSpace(OsType))
                {
                    OsType = "All";
                }

                string _jsonBack = BusiNav.loadListNavIconMsgApi(NavType, OsType);
                return _jsonBack;
            }

            //------验证RndKeyRsa是否正确-----//
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //搜索分页数据
            if (_exeType == "1")
            {
                // 获取传递的参数
                string NavIconID = PublicClass.FilterRequestTrim("NavIconID");
                string NavType = PublicClass.FilterRequestTrim("NavType");
                string OsType = PublicClass.FilterRequestTrim("OsType");
                string NavName = PublicClass.FilterRequestTrim("NavName");
                string LinkType = PublicClass.FilterRequestTrim("LinkType");
                string LinkURL = PublicClass.FilterRequestTrim("LinkURL");
                string SortNum = PublicClass.FilterRequestTrim("SortNum");
                string NavMemo = PublicClass.FilterRequestTrim("NavMemo");
                string IsShow = PublicClass.FilterRequestTrim("IsShow");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                NavIconID = PublicClass.preventNumberDataIsNull(NavIconID);
                SortNum = PublicClass.preventNumberDataIsNull(SortNum);


                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelNavIconMsg _modelNavIconMsg = new ModelNavIconMsg();
                _modelNavIconMsg.NavIconID = Convert.ToInt64(NavIconID);
                _modelNavIconMsg.NavType = NavType;
                _modelNavIconMsg.OsType = OsType;
                _modelNavIconMsg.NavName = NavName;
                _modelNavIconMsg.LinkType = LinkType;
                _modelNavIconMsg.LinkURL = LinkURL;
                _modelNavIconMsg.SortNum = Convert.ToInt32(SortNum);
                _modelNavIconMsg.NavMemo = NavMemo;
                _modelNavIconMsg.IsShow = IsShow;
                _modelNavIconMsg.IsLock = IsLock;
                _modelNavIconMsg.WriteDate = WriteDate;


                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { };
                string _strJson = BusiJsonPageStr.morePageJSONNavIconMsg(_modelNavIconMsg, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms", "SortNum DESC,PageOrder DESC");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "3") //提交 栏目图标导航信息
            {
                // 获取传递的参数
                string NavIconID = PublicClass.FilterRequestTrim("NavIconID");
                string NavType = PublicClass.FilterRequestTrim("NavType");
                string OsType = PublicClass.FilterRequestTrim("OsType");
                string NavName = PublicClass.FilterRequestTrim("NavName");
                string IconUrl = PublicClass.FilterRequestTrimNoConvert("IconUrl");
                string LinkType = PublicClass.FilterRequestTrim("LinkType");
                string LinkURL = PublicClass.FilterRequestTrimNoConvert("LinkURL");
                string UploadGuid = PublicClass.FilterRequestTrim("UploadGuid");
                string SortNum = PublicClass.FilterRequestTrim("SortNum");
                string NavMemo = PublicClass.FilterRequestTrim("NavMemo");
                string IsShow = PublicClass.FilterRequestTrim("IsShow");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                //防止数字为空
                NavIconID = PublicClass.preventNumberDataIsNull(NavIconID);
                SortNum = PublicClass.preventNumberDataIsNull(SortNum);

                string _jsonBack = BusiNav.submitNavIconMsgApi(Convert.ToInt64(NavIconID), NavType, NavName, IconUrl, LinkType, LinkURL, UploadGuid, Convert.ToInt32(SortNum), NavMemo, IsShow, IsLock, OsType);
                return _jsonBack;
            }
            else if (_exeType == "4") //切换显隐 栏目图标导航
            {
                // 获取传递的参数
                string NavIconIDArr = PublicClass.FilterRequestTrim("NavIconIDArr");
                string IsShow = PublicClass.FilterRequestTrim("IsShow");

                string _jsonBack = BusiNav.tglShowNavIconArrApi(NavIconIDArr, IsShow);
                return _jsonBack;
            }
            else if (_exeType == "5") //批量删除 栏目图标导航信息
            {
                // 获取传递的参数
                string UploadGuidArr = PublicClass.FilterRequestTrim("UploadGuidArr");

                string _jsonBack = BusiNav.delNavIconMsgArrApi(UploadGuidArr);
                return _jsonBack;
            }
            else if (_exeType == "6") //修改栏目图标导航信息 排序
            {
                // 获取传递的参数
                string NavIconID = PublicClass.FilterRequestTrim("NavIconID");
                string SortNum = PublicClass.FilterRequestTrim("SortNum");

                //防止数字为空
                NavIconID = PublicClass.preventNumberDataIsNull(NavIconID);
                SortNum = PublicClass.preventNumberDataIsNull(SortNum);

                string _jsonBack = BusiNav.chgNavIconSortNumApi(Convert.ToInt64(NavIconID), Convert.ToInt32(SortNum));
                return _jsonBack;
            }
            else if (_exeType == "7") //初始化栏目图标导航信息
            {
                // 获取传递的参数
                string NavIconID = PublicClass.FilterRequestTrim("NavIconID");

                //防止数字为空
                NavIconID = PublicClass.preventNumberDataIsNull(NavIconID);

                string _json = BusiNav.initNavIconMsgApi(Convert.ToInt64(NavIconID));
                return _json;
            }

            return "";
        }


        #endregion



    }
}