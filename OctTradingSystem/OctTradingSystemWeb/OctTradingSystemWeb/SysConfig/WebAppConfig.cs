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

    #region 【项目业务逻辑配置参数】

    //默认用户选择的城市区域代号,湖南省_长沙市 , 430000_430100
    public static string SelCityRegionCodeArrDefault = ConfigHelper.getAppSettingsValue("SelCityRegionCodeArrDefault").Trim();

    #endregion


    //Api请求的UserKeyID  API用户ID(Key关联的用户ID)  8866
    public static string UserKeyID = ConfigHelper.getAppSettingsValue("UserKeyID").Trim();

    //Api请求的UserKey 系统分配给Api请求用户的Key值  9af7f46a-ea52-4aa3-b8c3-9fd484c2af88
    public static string UserKey = ConfigHelper.getAppSettingsValue("UserKey").Trim();

    //OctTradingSystemWeb (交易系统 订单与财务)  API请求地址域名  http://192.168.3.10:1500
    public static string OctTradingSystemWeb_ApiDomain = ConfigHelper.getAppSettingsValue("OctTradingSystemWeb_ApiDomain").Trim();



    #region 【API接口的具体路径】

    #region【OctCommonCodeSystemWeb (各项目通用代码项目)】API请求配置信息

    //OctCommonCodeSystemWeb 各项目通用代码项目 API请求地址域名  http://192.168.3.10:1100
    public static string OctCommonCodeSystemWeb_ApiDomain = ConfigHelper.getAppSettingsValue("OctCommonCodeSystemWeb_ApiDomain").Trim();

    //获取RSA加密后的RndKey
    public static string ApiUrl_GetRndKeyRSA = OctCommonCodeSystemWeb_ApiDomain + "/Key/GetRndKeyRSA";
    // Api请求用户信息管理
    public static string ApiUrl_UserKeyMsg = OctCommonCodeSystemWeb_ApiDomain + "/Api/UserKeyMsg";
    // Api请求Key验证记录
    public static string ApiUrl_KeyVerifyRecord = OctCommonCodeSystemWeb_ApiDomain + "/Api/KeyVerifyRecord";
    // Api调用记录
    public static string ApiUrl_ApiReqRecord = OctCommonCodeSystemWeb_ApiDomain + "/Api/ApiReqRecord";

    #endregion

    #region【OctUserGoodsShopSystemWeb (会员店铺产品系统)】API请求配置信息

    //OctUserGoodsShopSystemWeb (会员店铺产品系统) API请求地址域名  http://192.168.3.10:1200
    public static string OctUserGoodsShopSystemWeb_ApiDomain = ConfigHelper.getAppSettingsValue("OctUserGoodsShopSystemWeb_ApiDomain").Trim();

    //会员账号 管理
    public static string ApiUrl_UserAccount = OctUserGoodsShopSystemWeb_ApiDomain + "/User/UserAccount";
    //商品类目 管理
    public static string ApiUrl_GooGoodsType = OctUserGoodsShopSystemWeb_ApiDomain + "/Goo/GooGoodsType";


    #endregion

    #region【OctThirdApiCallSystemWeb (第三方系统调用) 】API请求配置信息

    //OctUserGoodsShopSystemWeb (会员店铺产品系统) API请求地址域名  http://192.168.3.10:1200
    public static string OctThirdApiCallSystemWeb_ApiDomain = ConfigHelper.getAppSettingsValue("OctThirdApiCallSystemWeb_ApiDomain").Trim();

    //==================【微信支付 扫码，小程序，公众号】==========================//

    //扫码支付 非购物订单支付(如充值,充积分)
    public static string ApiUrl_TAC_CreateWeiXinScanPayURLNoOrder = OctThirdApiCallSystemWeb_ApiDomain + "/WxPay/CreateWeiXinScanPayURLNoOrder";



    #endregion

    #endregion


}
