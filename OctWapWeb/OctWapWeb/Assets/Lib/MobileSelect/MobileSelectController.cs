using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MobileSelectNS
{
    public class MobileSelectController : Controller
    {
        /// <summary>
        /// 加载 滚动插件，城市选择器Json数据
        /// </summary>
        /// <returns></returns>
        public string LoadMobileSelectJsonData()
        {
            string _dataJson ="";

            try
            {
                _dataJson = RegionCodeNameNS.RegionCodeName.loadRegionCodeDataMobileSelectJson();
            }
            catch { };

            return _dataJson;
        }



    }
}