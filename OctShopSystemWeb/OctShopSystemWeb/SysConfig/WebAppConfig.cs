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
    /// <summary>
    /// Api请求的UserKeyID  API用户ID(Key关联的用户ID)  8866
    /// </summary>
    public static string UserKeyID = ConfigHelper.getAppSettingsValue("UserKeyID").Trim();

    /// <summary>
    /// Api请求的UserKey 系统分配给Api请求用户的Key值  9af7f46a-ea52-4aa3-b8c3-9fd484c2af88
    /// </summary>
    public static string UserKey = ConfigHelper.getAppSettingsValue("UserKey").Trim();

    /// <summary>
    /// 是否开通了 微信小程序版 ,小程序客户端 (true / false)
    /// </summary>
    public static string IsOpenWxMiniClient = ConfigHelper.getAppSettingsValue("IsOpenWxMiniClient").Trim();

    #region【IM在线客服系统对接】

    /// <summary>
    /// IM在线客服系统 == 是否开通了IM在线客服系统 true / false
    /// </summary>
    public static string IMSysIsAbleUse = ConfigHelper.getAppSettingsValue("IMSysIsAbleUse").Trim();

    /// <summary>
    /// IM在线客服系统对接Key信息
    /// </summary>
    public static string IMSysKey = ConfigHelper.getAppSettingsValue("IMSysKey").Trim();

    /// <summary>
    /// IM在线客服系统域名地址URL
    /// </summary>
    public static string ImSystemWebDomainURL = ConfigHelper.getAppSettingsValue("ImSystemWebDomainURL").Trim();

    /// <summary>
    /// IM在线客服系统 == 商城平台官方客服账号
    /// </summary>
    public static string ImSystemShopUserAccount = ConfigHelper.getAppSettingsValue("ImSystemShopUserAccount").Trim();

    #region【IM在线客服系统 API 路径】

    ///////////////////【商家】/////////////////////////

    //商家各项数据统计
    public static string ApiUrl_IM_DataCount = ImSystemWebDomainURL + "/ShopApi/DataCount";


    #endregion

    #endregion

    #region【各前端平台的域名地址】

    //OctWapWeb 手机Web端(公众号端)地址域名
    public static string OctWapWeb_AddrDomain = ConfigHelper.getAppSettingsValue("OctWapWeb_AddrDomain").Trim();

    //OctMallMiniWeb 微信小程序后台地址域名
    public static string OctMallMiniWeb_AddrDomain = ConfigHelper.getAppSettingsValue("OctMallMiniWeb_AddrDomain").Trim();


    #endregion

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

    //---------------【会员账号】相关---------------------//

    //【会员账号】 管理
    public static string ApiUrl_UserAccount = OctUserGoodsShopSystemWeb_ApiDomain + "/User/UserAccount";

    //【验证用户账号信息】 管理
    public static string ApiUrl_CheckUserAccount = OctUserGoodsShopSystemWeb_ApiDomain + "/User/CheckUserAccount";

    //【用户登录验证】
    public static string ApiUrl_UGS_UserLoginVerify = OctUserGoodsShopSystemWeb_ApiDomain + "/User/UserLoginVerify";


    //---------------【商品】相关---------------------//

    //【商品类目】 管理
    public static string ApiUrl_GooGoodsType = OctUserGoodsShopSystemWeb_ApiDomain + "/Goo/GooGoodsType";
    //【类目图标上传】
    public static string ApiUrl_UGS_GooGoodsTypeIcon = OctUserGoodsShopSystemWeb_ApiDomain + "/Goo/GooGoodsTypeIcon";
    //【商品类目必填属性】 管理
    public static string ApiUrl_UGS_GooGoodsTypeNeedProp = OctUserGoodsShopSystemWeb_ApiDomain + "/Goo/GooGoodsTypeNeedProp";
    //【商品规格 预写入信息】 管理
    public static string ApiUrl_UGS_GooSpecParamPre = OctUserGoodsShopSystemWeb_ApiDomain + "/Goo/GooSpecParamPre";
    //【商品规格属性信息】 管理
    public static string ApiUrl_UGS_GooSpecParam = OctUserGoodsShopSystemWeb_ApiDomain + "/Goo/GooSpecParam";
    //【商品规格和属性总标题信息】 管理
    public static string ApiUrl_UGS_GooSpecParamName = OctUserGoodsShopSystemWeb_ApiDomain + "/Goo/GooSpecParamName";
    //【商品赠品】 管理
    public static string ApiUrl_UGS_GooGiftMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/Goo/GooGiftMsg";
    //【赠品图片】 管理
    public static string ApiUrl_UGS_GooGiftImg = OctUserGoodsShopSystemWeb_ApiDomain + "/Goo/GooGiftImg";
    //【商品信息】 管理
    public static string ApiUrl_UGS_GooGoodsMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/Goo/GooGoodsMsg";
    //【商品图片信息】 管理
    public static string ApiUrl_UGS_GooGoodsImg = OctUserGoodsShopSystemWeb_ApiDomain + "/Goo/GooGoodsImg";
    //【商品评价】
    public static string ApiUrl_UGS_GooAppraise = OctUserGoodsShopSystemWeb_ApiDomain + "/Goo/GooAppraise";

    //---------------【店铺】相关---------------------//

    //【店铺类别】 管理
    public static string ApiUrl_UGS_ShopType = OctUserGoodsShopSystemWeb_ApiDomain + "/Shop/ShopType";
    //【店铺商品类别】 管理
    public static string ApiUrl_UGS_ShopGoodsType = OctUserGoodsShopSystemWeb_ApiDomain + "/Shop/ShopGoodsType";
    //【店铺信息】 管理
    public static string ApiUrl_UGS_ShopMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/Shop/ShopMsg";
    //【店铺Logo门头图片】 管理
    public static string ApiUrl_UGS_ShopLogoImg = OctUserGoodsShopSystemWeb_ApiDomain + "/Shop/ShopLogoImg";
    //【运费模板信息】 管理
    public static string ApiUrl_UGS_ShopFreightTemplate = OctUserGoodsShopSystemWeb_ApiDomain + "/Shop/ShopFreightTemplate";
    //【运费模板参数信息】 管理
    public static string ApiUrl_UGS_ShopFreightTemplateParamList = OctUserGoodsShopSystemWeb_ApiDomain + "/Shop/ShopFreightTemplateParamList";
    //【店铺评价】 
    public static string ApiUrl_UGS_ShopAppraise = OctUserGoodsShopSystemWeb_ApiDomain + "/Shop/ShopAppraise";
    //【店铺展示信息】 
    public static string ApiUrl_UGS_ShopShowMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/Shop/ShopShowMsg";
    //【店铺相关页-数据加载】 
    public static string ApiUrl_UGS_ShopHomeData = OctUserGoodsShopSystemWeb_ApiDomain + "/Shop/ShopHomeData";
    //【店铺轮播图片】 
    public static string ApiUrl_UGS_ShopCarousel = OctUserGoodsShopSystemWeb_ApiDomain + "/Shop/ShopCarousel";

    //---------------【公司】相关---------------------//

    //【公司信息】 管理
    public static string ApiUrl_UGS_CompanyMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/Company/CompanyMsg";
    //【公司证件信息】 管理
    public static string ApiUrl_UGS_CompanyCertificate = OctUserGoodsShopSystemWeb_ApiDomain + "/Company/CompanyCertificate";

    //---------------【买家】相关---------------------//

    //【买家收货地址】
    public static string ApiUrl_UGS_BuyerReceiAddr = OctUserGoodsShopSystemWeb_ApiDomain + "/Buyer/BuyerReceiAddr";

    //---------------【积分】相关---------------------//

    //【积分规则设置】 
    public static string ApiUrl_UGS_ShopIntegralSetting = OctUserGoodsShopSystemWeb_ApiDomain + "/Integral/ShopIntegralSetting";

    //----------【秒杀抢购】相关--------------//

    //【秒杀商品信息】 
    public static string ApiUrl_UGS_SecKillGoodsMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/SecKill/SecKillGoodsMsg";

    //----------【拼团】相关--------------//

    //【拼团商品设置】 
    public static string ApiUrl_UGS_GroupGoodsSetting = OctUserGoodsShopSystemWeb_ApiDomain + "/Group/GroupGoodsSetting";

    //【拼团发起信息】 
    public static string ApiUrl_UGS_GroupCreateMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/Group/GroupCreateMsg";

    //【加入拼团信息】 
    public static string ApiUrl_UGS_GroupJoinMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/Group/GroupJoinMsg";

    //----------【礼品】相关--------------//

    //【礼品信息】 
    public static string ApiUrl_UGS_PresentMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/Present/PresentMsg";

    //【礼品图片信息】 
    public static string ApiUrl_UGS_PresentImgs = OctUserGoodsShopSystemWeb_ApiDomain + "/Present/PresentImgs";


    //----------【活动】相关--------------//

    //【活动信息】 
    public static string ApiUrl_UGS_ActivityMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/Activity/ActivityMsg";

    //【活动图片信息】 
    public static string ApiUrl_UGS_ActivityImgs = OctUserGoodsShopSystemWeb_ApiDomain + "/Activity/ActivityImgs";

    //【活动参与信息】 
    public static string ApiUrl_UGS_ActivityJoin = OctUserGoodsShopSystemWeb_ApiDomain + "/Activity/ActivityJoin";


    //----------【抽奖】相关--------------//

    //【抽奖信息】 
    public static string ApiUrl_UGS_LuckyDrawMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/LuckyDraw/LuckyDrawMsg";

    //【抽奖参与信息】 
    public static string ApiUrl_UGS_LuckyDrawJoinMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/LuckyDraw/LuckyDrawJoinMsg";

    //【抽奖中奖结果信息】 
    public static string ApiUrl_UGS_LuckyDrawResult = OctUserGoodsShopSystemWeb_ApiDomain + "/LuckyDraw/LuckyDrawResult";

    //【抽奖发货信息】 
    public static string ApiUrl_UGS_LuckyDrawSendGoods = OctUserGoodsShopSystemWeb_ApiDomain + "/LuckyDraw/LuckyDrawSendGoods";


    #endregion

    #region【OctFileUploadSystemWeb (文件上传系统)】API请求配置信息

    //【上传文件系统 域名列表数组】
    public static string[] OctFileUploadSystemWebDomainListArr = ConfigHelper.getAppSettingsValue("OctFileUploadSystemWebDomainListArr").Trim().Split('^');

    //OctFileUploadSystemWeb (文件上传系统) API请求地址域名  http://192.168.3.10:1200
    public static string OctFileUploadSystemWeb_ApiDomain = ConfigHelper.getAppSettingsValue("OctFileUploadSystemWeb_ApiDomain").Trim();

    //上传【商品类目图标】
    public static string ApiUrl_FU_GooGoodsTypeIcon = OctFileUploadSystemWeb_ApiDomain + "/Goo/GooGoodsTypeIcon";

    //上传【商品规格图片】
    public static string ApiUrl_FU_GooSpecParamImg = OctFileUploadSystemWeb_ApiDomain + "/Goo/GooSpecParamImg";

    //上传【商品图片】
    public static string ApiUrl_FU_GooGoodsImg = OctFileUploadSystemWeb_ApiDomain + "/Goo/GooGoodsImg";

    //上传【赠品图片】
    public static string ApiUrl_FU_GooGiftMsg = OctFileUploadSystemWeb_ApiDomain + "/Goo/GooGiftImg";

    //上传【礼品图片】
    public static string ApiUrl_FU_PresentImg = OctFileUploadSystemWeb_ApiDomain + "/Goo/PresentImg";

    //上传【活动图片】
    public static string ApiUrl_FU_ActivityImg = OctFileUploadSystemWeb_ApiDomain + "/Goo/ActivityImg";

    //上传【抽奖图片】
    public static string ApiUrl_FU_LuckyDrawImg = OctFileUploadSystemWeb_ApiDomain + "/Goo/LuckyDrawImg";

    //上传【店铺轮播图片】
    public static string ApiUrl_FU_ShopCarouselImg = OctFileUploadSystemWeb_ApiDomain + "/Shop/ShopCarouselImg";

    //【商家相册】相关操作
    public static string ApiUrl_FU_ShopAlbum = OctFileUploadSystemWeb_ApiDomain + "/Shop/ShopAlbum";

    //【商家相册图片】相关操作
    public static string ApiUrl_FU_ShopAlbumImg = OctFileUploadSystemWeb_ApiDomain + "/Shop/ShopAlbumImg";

    //上传【店铺头像图片】
    public static string ApiUrl_FU_ShopHeaderImg = OctFileUploadSystemWeb_ApiDomain + "/Shop/ShopHeaderImg";

    //上传【结算商家 营业执照照片】
    public static string ApiUrl_FU_SettleCertificateImg = OctFileUploadSystemWeb_ApiDomain + "/Shop/SettleCertificateImg";

    //上传【店铺Logo门头图片】
    public static string ApiUrl_FU_ShopLogoImg = OctFileUploadSystemWeb_ApiDomain + "/Shop/ShopLogoImg";

    //上传【公司证件资质图片】
    public static string ApiUrl_FU_CompanyCertificateImg = OctFileUploadSystemWeb_ApiDomain + "/Company/CompanyCertificateImg";

    #endregion

    #region【OctTradingSystemWeb (订单与财务 交易系统 )】API请求配置信息

    //OctTradingSystemWeb (订单与财务 交易系统 ) API请求地址域名  http://192.168.3.10:1200
    public static string OctTradingSystemWeb_ApiDomain = ConfigHelper.getAppSettingsValue("OctTradingSystemWeb_ApiDomain").Trim();

    ///////////////////【订单相关】/////////////////////////
    ///
    //【订单管理】
    public static string ApiUrl_T_OrderMsg = OctTradingSystemWeb_ApiDomain + "/Order/OrderMsg";
    //【订单发货信息】
    public static string ApiUrl_T_OrderSendGoods = OctTradingSystemWeb_ApiDomain + "/Order/OrderSendGoods";
    //【订单验证码信息】
    public static string ApiUrl_T_OrderCheckCode = OctTradingSystemWeb_ApiDomain + "/Order/OrderCheckCode";
    //【订单详情(商家版)】
    public static string ApiUrl_T_OrderDetailShop = OctTradingSystemWeb_ApiDomain + "/Order/OrderDetailShop";
    //【订单发票管理】
    public static string ApiUrl_T_OrderInvoice = OctTradingSystemWeb_ApiDomain + "/Order/OrderInvoice";

    //【快递查询与跟踪】
    public static string ApiUrl_T_ExpressDetail = OctTradingSystemWeb_ApiDomain + "/Order/ExpressDetail";


    ///////////////////【优惠券相关】/////////////////////////

    //【优惠券信息】管理
    public static string ApiUrl_T_CouponsMsg = OctTradingSystemWeb_ApiDomain + "/Coupons/CouponsMsg";

    //【优惠券发放信息】管理
    public static string ApiUrl_T_CouponsIssueMsg = OctTradingSystemWeb_ApiDomain + "/Coupons/CouponsIssueMsg";

    //【优惠券线下验证使用】
    public static string ApiUrl_T_CouponsVerifyCode = OctTradingSystemWeb_ApiDomain + "/Coupons/CouponsVerifyCode";


    ///////////////////【财务】相关/////////////////////////

    //【商家积分】管理
    public static string ApiUrl_T_ShopIntegral = OctTradingSystemWeb_ApiDomain + "/Finance/ShopIntegral";

    //【商家余额收支信息】
    public static string ApiUrl_T_ShopIncomeExpense = OctTradingSystemWeb_ApiDomain + "/Finance/ShopIncomeExpense";


    ///////////////////【支付】相关/////////////////////////

    //【商家充积分支付】
    public static string ApiUrl_T_PayShopIntegralRecharge = OctTradingSystemWeb_ApiDomain + "/Pay/PayShopIntegralRecharge";

    ///////////////////【拼团】相关/////////////////////////

    //【拼团发起信息】
    public static string ApiUrl_T_GroupCreateMsg = OctTradingSystemWeb_ApiDomain + "/Group/GroupCreateMsg";

    ///////////////////【礼品订单】相关/////////////////////////

    //【礼品订单信息】
    public static string ApiUrl_T_PresentOrderMsg = OctTradingSystemWeb_ApiDomain + "/Present/PresentOrderMsg";

    ///////////////////【各种验证码信息-验证】相关/////////////////////////

    //【验证扫码，各种验证码信息扫码】
    public static string ApiUrl_T_VerifyCodeScanData = OctTradingSystemWeb_ApiDomain + "/VerifyCode/VerifyCodeScanData";

    ///////////////////【Settle / 商家结算】相关/////////////////////////

    //【商家结算资料】
    public static string ApiUrl_T_SettleShopMsg = OctTradingSystemWeb_ApiDomain + "/Settle/SettleShopMsg";

    //【商家结算申请】
    public static string ApiUrl_T_SettleApply = OctTradingSystemWeb_ApiDomain + "/Settle/SettleApply";

    //【商城结算订单信息】
    public static string ApiUrl_T_SettleOrderMsg = OctTradingSystemWeb_ApiDomain + "/Settle/SettleOrderMsg";

    //【聚合支付结算订单信息】
    public static string ApiUrl_T_SettleAggregateOrderMsg = OctTradingSystemWeb_ApiDomain + "/Settle/SettleAggregateOrderMsg";

    ///////////////////【Aggregate / 聚合支付】相关/////////////////////////

    //【聚合支付订单信息】
    public static string ApiUrl_T_AggregateOrderMsg = OctTradingSystemWeb_ApiDomain + "/Aggregate/AggregateOrderMsg";

    ///////////////////【CountSum / 数据统计】相关/////////////////////////

    //【公共首页】
    public static string ApiUrl_T_Index = OctTradingSystemWeb_ApiDomain + "/CountSum/Index";


    #endregion

    #region【OctAfterSaleAccCusSystem (售后,投诉,客服反馈,消息系统)】API请求配置信息


    //OctAfterSaleAccCusSystemWeb (售后,投诉,客服反馈,消息系统 ) API请求地址域名  http://192.168.3.10:1200
    public static string OctAfterSaleAccCusSystemWeb_ApiDomain = ConfigHelper.getAppSettingsValue("OctAfterSaleAccCusSystemWeb_ApiDomain").Trim();

    //------售后 AfterSale ------//

    //【售后申请信息】
    public static string ApiUrl_ASAC_AfterSaleApplyMsg = OctAfterSaleAccCusSystemWeb_ApiDomain + "/AfterSale/AfterSaleApplyMsg";

    //【售后收货信息】
    public static string ApiUrl_ASAC_AfterSaleDelivery = OctAfterSaleAccCusSystemWeb_ApiDomain + "/AfterSale/AfterSaleDelivery";

    //【售后发货信息】
    public static string ApiUrl_ASAC_AfterSaleSendGoods = OctAfterSaleAccCusSystemWeb_ApiDomain + "/AfterSale/AfterSaleSendGoods";

    //------投诉 Complain ------//

    //【投诉信息】
    public static string ApiUrl_ASAC_OrderComplainMsg = OctAfterSaleAccCusSystemWeb_ApiDomain + "/Complain/OrderComplainMsg";

    ///////////////////【CountSum / 数据统计】相关/////////////////////////

    //【公共首页】
    public static string ApiUrl_ASAC_Index = OctAfterSaleAccCusSystemWeb_ApiDomain + "/CountData/Index";

    ///////////////////【SysMsg / 系统消息】相关/////////////////////////

    //【商家系统消息】
    public static string ApiUrl_ASAC_ShopSysMsg = OctAfterSaleAccCusSystemWeb_ApiDomain + "/SysMsg/ShopSysMsg";

    //--------------------/ExplainText/--说明性文本----------------------//

    //【说明性文本】
    public static string ApiUrl_ASAC_ExplainText = OctAfterSaleAccCusSystemWeb_ApiDomain + "/ExplainText/ExplainText";


    #endregion

    #region【OctThirdApiCallSystemWeb (第三方系统调用)】API请求配置信息

    //OctThirdApiCallSystemWeb (第三方系统调用) API请求地址域名 http://192.168.3.10:1600
    public static string OctThirdApiCallSystemWeb_ApiDomain = ConfigHelper.getAppSettingsValue("OctThirdApiCallSystemWeb_ApiDomain").Trim();

    //-------------------【微信各种操作】相关---------------------------//

    //【获取微信的 APPID 和 APPSECRET】
    public static string ApiUrl_TAC_GetWxAppIDAppScecret = OctThirdApiCallSystemWeb_ApiDomain + "/WeiXin/GetWxAppIDAppScecret";

    ///////////////////【 Sms / 发送短信】相关/////////////////////////

    //【发送短信信息】
    public static string ApiUrl_TAC_SmsSendMsg = OctThirdApiCallSystemWeb_ApiDomain + "/Sms/SmsSendMsg";


    #endregion

    #endregion


}
