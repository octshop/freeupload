using OctAfterSaleAccCusNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【说明性文本】API接口控制器
/// </summary>
namespace OctAfterSaleAccCusSystemWeb.PageControllers.ApiPage
{
    public class ExplainTextController : Controller
    {
        // GET: ExplainText
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 说明性文本信息
        /// </summary>
        /// <returns></returns>
        public string ExplainText()
        {
            //获取操作类型  Type=1  加载指定类型的说明性文本 Type=2 搜索数据分页 Type=3 提交说明性文本内容 Type=4 批量锁定/解锁 说明性文本内容 Type=5 置顶 说明性文本内容 Type=6 批量删除 说明性文本内容 Type=7 加载指定类型和标题的说明性文本内容 Type=8 初始化说明性文本内容
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                //获取传递的参数
                string ExplainType = PublicClass.FilterRequestTrim("ExplainType");

                string _jsonBack = BusiExplainText.loadExplainTextListApi(ExplainType);
                return _jsonBack;
            }
            else if (_exeType == "2") //搜索数据分页
            {
                // 获取传递的参数
                string ExplainID = PublicClass.FilterRequestTrim("ExplainID");
                string ExplainType = PublicClass.FilterRequestTrim("ExplainType");
                string ExplainTitle = PublicClass.FilterRequestTrim("ExplainTitle");
                string ExplainContent = PublicClass.FilterRequestTrim("ExplainContent");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrim("WriteDate");

                //获取当前页数
                string PageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                ExplainID = PublicClass.preventNumberDataIsNull(ExplainID);


                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelExplainText _modelExplainText = new ModelExplainText();
                _modelExplainText.ExplainID = Convert.ToInt64(ExplainID);
                _modelExplainText.ExplainType = ExplainType;
                _modelExplainText.ExplainTitle = ExplainTitle;
                _modelExplainText.ExplainContent = ExplainContent;
                _modelExplainText.IsLock = IsLock;
                _modelExplainText.WriteDate = WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONExplainText(_modelExplainText, PageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "3") //提交 说明性文本内容
            {
                // 获取传递的参数
                string ExplainID = PublicClass.FilterRequestTrim("ExplainID");
                string ExplainType = PublicClass.FilterRequestTrim("ExplainType");
                string ExplainTitle = PublicClass.FilterRequestTrim("ExplainTitle");
                //说明性文本内容 需要进行 Base64 转换加密
                string ExplainContent = Request["ExplainContent"].ToString().Trim();
                ExplainContent = EncryptionClassNS.EncryptionClass.DecodeBase64("utf-8", ExplainContent);

                //防止数字类型为空
                ExplainID = PublicClass.preventNumberDataIsNull(ExplainID);

                string _jsonBack = BusiExplainText.submitExplainTextApi(Convert.ToInt64(ExplainID), ExplainType, ExplainTitle, ExplainContent);
                return _jsonBack;
            }
            else if (_exeType == "4") //批量锁定/解锁 说明性文本内容
            {
                // 获取传递的参数
                string ExplainIDArr = PublicClass.FilterRequestTrim("ExplainIDArr");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");

                string _jsonBack = BusiExplainText.lockExplainTextArrApi(ExplainIDArr, IsLock);
                return _jsonBack;
            }
            else if (_exeType == "5") //置顶 说明性文本内容
            {
                // 获取传递的参数
                string ExplainID = PublicClass.FilterRequestTrim("ExplainID");

                //防止数字类型为空
                ExplainID = PublicClass.preventNumberDataIsNull(ExplainID);

                string _jsonBack = BusiExplainText.goToExplainTextApi(Convert.ToInt64(ExplainID));
                return _jsonBack;
            }
            else if (_exeType == "6") //批量删除 说明性文本内容
            {
                // 获取传递的参数
                string ExplainIDArr = PublicClass.FilterRequestTrim("ExplainIDArr");

                //防止数字类型为空
                ExplainIDArr = PublicClass.preventNumberDataIsNull(ExplainIDArr);

                string _jsonBack = BusiExplainText.delExplainTextArrApi(ExplainIDArr);
                return _jsonBack;
            }
            else if (_exeType == "7") //加载指定类型和标题的说明性文本内容
            {
                // 获取传递的参数
                string ExplainType = PublicClass.FilterRequestTrim("ExplainType");
                string ExplainTitle = PublicClass.FilterRequestTrim("ExplainTitle");

                //----------选 填---------------//
                //是包含还是清除模式 (true / false )
                string Exclude = PublicClass.FilterRequestTrim("Exclude");
                if (string.IsNullOrWhiteSpace(Exclude))
                {
                    Exclude = "true";
                }
                //包含与清仓字段，用 “^”连接
                string ClearOrShowPropertyNameArr = PublicClass.FilterRequestTrim("ClearOrShowPropertyNameArr");
                string[] _clearOrShowPropertyNameArr = PublicClass.splitStringJoinChar(ClearOrShowPropertyNameArr);

                string _jsonBack = BusiExplainText.loadExplainTextListApi(ExplainType, ExplainTitle, _clearOrShowPropertyNameArr, Convert.ToBoolean(Exclude));
                return _jsonBack;
            }
            else if (_exeType == "8") //初始化说明性文本内容
            {
                // 获取传递的参数
                string ExplainID = PublicClass.FilterRequestTrim("ExplainID");
                string Islock = PublicClass.FilterRequestTrim("Islock");

                string ExplainType = PublicClass.FilterRequestTrim("ExplainType");
                string ExplainTitle = PublicClass.FilterRequestTrim("ExplainTitle");


                //防止数字类型为空
                ExplainID = PublicClass.preventNumberDataIsNull(ExplainID);

                string _jsonBack = BusiExplainText.initExplainTextApi(Convert.ToInt64(ExplainID), Islock, ExplainType, ExplainTitle);
                return _jsonBack;
            }


            return "";
        }

    }
}