using ConfigHelperNS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// 【项目配置参数】与文件WebAppConfig.config对应
/// </summary>
public class WebAppConfig
{
    //Api请求的UserKeyID  API用户ID(Key关联的用户ID)  8866
    public static string UserKeyID = ConfigHelper.getAppSettingsValue("UserKeyID").Trim();

    //Api请求的UserKey 系统分配给Api请求用户的Key值  9af7f46a-ea52-4aa3-b8c3-9fd484c2af88
    public static string UserKey = ConfigHelper.getAppSettingsValue("UserKey").Trim();

    #region 【API接口的具体路径】

    #region【OctCommonCodeSystemWeb (各项目通用代码项目)】API请求配置信息

    //OctCommonCodeSystemWeb 各项目通用代码项目 API请求地址域名  http://192.168.3.10:1100
    public static string OctCommonCodeSystemWeb_ApiDomain = ConfigHelper.getAppSettingsValue("OctCommonCodeSystemWeb_ApiDomain").Trim();

    //获取RSA加密后的RndKey
    public static string ApiUrl_GetRndKeyRSA = OctCommonCodeSystemWeb_ApiDomain + "/Key/GetRndKeyRSA";
    // Api请求用户信息管理
    public static string ApiUrl_UserKeyMsg = OctCommonCodeSystemWeb_ApiDomain + "/Api/UserKeyMsg";

    #endregion

    #region【OctUserGoodsShopSystemWeb (会员店铺产品系统)】API请求配置信息

    //OctUserGoodsShopSystemWeb (会员店铺产品系统) API请求地址域名  http://192.168.3.10:1200
    public static string OctUserGoodsShopSystemWeb_ApiDomain = ConfigHelper.getAppSettingsValue("OctUserGoodsShopSystemWeb_ApiDomain").Trim();

    //会员账号 管理
    public static string ApiUrl_UserAccount = OctUserGoodsShopSystemWeb_ApiDomain + "/User/UserAccount";

    #endregion


    #endregion


}
