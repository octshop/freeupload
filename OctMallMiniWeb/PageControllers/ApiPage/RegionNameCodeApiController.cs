using PublicClassNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

/// <summary>
/// 【省市县区，三级，二级联动】相关Api控制器
/// </summary>
namespace OctMallMiniWeb.PageControllers.ApiPage
{
    public class RegionNameCodeApiController : Controller
    {
        /// <summary>
        /// 接口首页
        /// </summary>
        /// <returns></returns>
        public string Index()
        {
            //获取操作类型  Type=1  加载小程序省市二级联动Json数据
            string _exeType = PublicClass.FilterRequestTrim("Type");
            if (_exeType == "1")
            {
                // 加载 [微信小程序] 省市二级联动Data的Json字符串
                string _jsonBack = RegionCodeNameNS.RegionCodeName.loadWxMiniRegionCodeProvinceCityDataJson();
                return _jsonBack;

            }
            return "";
        }





    }
}