using ConfigHelperNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// 【Http请求的一些公共】业务逻辑
/// </summary>
namespace BusiHttpCodeNS
{
    public class BusiHttpCode
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        public BusiHttpCode()
        {

        }

        /// <summary>
        /// 得到 文件上传系统的 域名协议头名称 是Https://还是Http://
        /// </summary>
        /// <returns></returns>
        public static string getUploadHttpHeader()
        {
            //获取OctFileUploadSystemWeb (文件上传系统) API请求地址域名 
            string OctFileUploadSystemWeb_ApiDomain = ConfigHelper.getAppSettingsValue("OctFileUploadSystemWeb_ApiDomain").Trim();
            //分解出Http的协议头,是Https还是Http
            string _httpHeader = OctFileUploadSystemWeb_ApiDomain.Substring(0, OctFileUploadSystemWeb_ApiDomain.IndexOf("//") + 2);
            return _httpHeader;
        }

    }
}