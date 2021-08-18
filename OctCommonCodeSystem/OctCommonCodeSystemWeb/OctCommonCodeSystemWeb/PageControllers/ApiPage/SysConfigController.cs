using BusiApiKeyVerifyNS;
using BusiDbSysConfigNS;
using OctCommonCodeNS;
using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【系统配置】相关API接口控制器
/// </summary>
namespace OctCommonCodeSystemWeb.PageControllers.ApiPage
{
    public class SysConfigController : Controller
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
        /// 系统配置参数
        /// </summary>
        /// <returns></returns>
        public string SystemConfigParam()
        {
            //验证RndKeyRsa是否正确
            bool _verifySu = BusiApiKeyVerify.verifyRndKeyRSARequest();
            if (_verifySu == false)
            {
                return "";
            }

            //获取操作类型  Type=1 搜索分页数据  Type=2  保存配置参数信息, pConfigID和pConfigName必须有一个不为空
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {

                //获取传递的参数
                string ConfigID = PublicClass.FilterRequestTrim("ConfigID");
                string SystemName = PublicClass.FilterRequestTrim("SystemName"); ;
                string ConfigName = PublicClass.FilterRequestTrimNoConvert("ConfigName");
                string ConfigValue = PublicClass.FilterRequestTrimNoConvert("ConfigValue");
                string ConfigDesc = PublicClass.FilterRequestTrimNoConvert("ConfigDesc");
                string IsLock = PublicClass.FilterRequestTrim("IsLock");
                string WriteDate = PublicClass.FilterRequestTrimNoConvert("WriteDate");


                //获取当前页数
                string _pageCurrent = PublicClass.FilterRequestTrim("PageCurrent");

                //防止数字类型为空
                ConfigID = PublicClass.preventNumberDataIsNull(ConfigID);


                //------------用实体类去限制的查询条件 AND 连接------------//
                ModelSystemConfigParam _modelSystemConfigParam = new ModelSystemConfigParam();
                _modelSystemConfigParam.ConfigID = Convert.ToInt64(ConfigID);
                _modelSystemConfigParam.SystemName = SystemName;
                _modelSystemConfigParam.ConfigName = ConfigName;
                _modelSystemConfigParam.ConfigValue = ConfigValue;
                _modelSystemConfigParam.ConfigDesc = ConfigDesc;
                _modelSystemConfigParam.IsLock = IsLock;
                _modelSystemConfigParam.WriteDate = WriteDate;

                // 要独立出来的查询条件 用【...... AND(" + _strInitSQLCharWhere + ") AND.....】连接的
                string _initSQLCharWhere = "";

                //获取分页JSON数据字符串
                //显示的字段值
                string[] _showFieldArr = { "PageOrder" };
                string _strJson = BusiJsonPageStr.morePageJSONSystemConfigParam(_modelSystemConfigParam, _pageCurrent, _initSQLCharWhere, _showFieldArr, true, "cms");

                //输出前台显示代码
                return _strJson;
            }
            else if (_exeType == "2") //保存配置参数信息, pConfigID和pConfigName必须有一个不为空
            {
                //获取传递的参数
                string ConfigID = PublicClass.FilterRequestTrim("ConfigID");
                string ConfigName = PublicClass.FilterRequestTrimNoConvert("ConfigName").Replace("%2B", "+");
                string ConfigValue = PublicClass.FilterRequestTrimNoConvert("ConfigValue").Replace("%2B", "+");

                //防止数字类型为空
                ConfigID = PublicClass.preventNumberDataIsNull(ConfigID);

                ModelJsonBack _modelJsonBack = new ModelJsonBack();

                bool _backBool = BusiDbSysConfig.saveSystemConfigParam(ConfigValue, ConfigID, ConfigName);
                if (_backBool)
                {
                    _modelJsonBack.Code = "SSCP_01";
                    _modelJsonBack.Msg = "修改成功";
                }
                else
                {
                    _modelJsonBack.Code = "SSCP_02";
                    _modelJsonBack.Msg = "修改失败";
                }
                return ModelJsonBack.convertModelToJson(_modelJsonBack);

            }


            return "";
        }




    }
}