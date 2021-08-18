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


    #region【各前端平台的域名地址】

    //OctWapWeb 手机Web端(公众号端)地址域名
    public static string OctWapWeb_AddrDomain = ConfigHelper.getAppSettingsValue("OctWapWeb_AddrDomain").Trim();

    /// <summary>
    /// IM在线客服系统域名地址URL
    /// </summary>
    public static string ImSystemWebDomainURL = ConfigHelper.getAppSettingsValue("ImSystemWebDomainURL").Trim();


    #endregion

    #region 【API接口的具体路径】

    #region【OctCommonCodeSystemWeb (各项目通用代码项目)】API请求配置信息

    //OctCommonCodeSystemWeb 各项目通用代码项目 API请求地址域名  http://192.168.3.10:1100
    public static string OctCommonCodeSystemWeb_ApiDomain = ConfigHelper.getAppSettingsValue("OctCommonCodeSystemWeb_ApiDomain").Trim();

    //--------------【 Key / Key相关操作 】---------------------//

    //获取RSA加密后的RndKey
    public static string ApiUrl_GetRndKeyRSA = OctCommonCodeSystemWeb_ApiDomain + "/Key/GetRndKeyRSA";

    //--------------【 Api / 接口相关操作 】---------------------//

    // Api请求用户信息管理
    public static string ApiUrl_UserKeyMsg = OctCommonCodeSystemWeb_ApiDomain + "/Api/UserKeyMsg";

    // Api请求Key验证记录
    public static string ApiUrl_KeyVerifyRecord = OctCommonCodeSystemWeb_ApiDomain + "/Api/KeyVerifyRecord";

    // Api调用记录
    public static string ApiUrl_ApiReqRecord = OctCommonCodeSystemWeb_ApiDomain + "/Api/ApiReqRecord";

    //--------------【 SysConfig / 系统配置 】---------------------//

    //【系统配置参数】
    public static string ApiUrl_CC_SystemConfigParam = OctCommonCodeSystemWeb_ApiDomain + "/SysConfig/SystemConfigParam";

    //--------------【 SysMsg / 系统信息 】---------------------//

    //【系统信息(系统级异常错误)】
    public static string ApiUrl_CC_SystemMsg = OctCommonCodeSystemWeb_ApiDomain + "/SysMsg/SystemMsg";


    #endregion

    #region【OctUserGoodsShopSystemWeb (会员店铺产品系统)】API请求配置信息

    //OctUserGoodsShopSystemWeb (会员店铺产品系统) API请求地址域名  http://192.168.3.10:1200
    public static string OctUserGoodsShopSystemWeb_ApiDomain = ConfigHelper.getAppSettingsValue("OctUserGoodsShopSystemWeb_ApiDomain").Trim();

    //-----------------【 User / 会员账号】---------------------//

    //会员账号信息
    public static string ApiUrl_UserAccount = OctUserGoodsShopSystemWeb_ApiDomain + "/User/UserAccount";

    public static string ApiUrl_UGS_UserAccount = OctUserGoodsShopSystemWeb_ApiDomain + "/User/UserAccount";

    //-----------------【 Vip / 会员等级，信用分】---------------------//

    //用户设置信息
    public static string ApiUrl_UGS_UserSettingMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/VipCredit/UserSettingMsg";

    //Index公共接口 0 会员等级，信用分 
    public static string ApiUrl_UGS_VipCreditIndex = OctUserGoodsShopSystemWeb_ApiDomain + "/VipCredit/Index";


    //-----------------【 Goo / 商品相关】---------------------//

    //商品类目 管理
    public static string ApiUrl_GooGoodsType = OctUserGoodsShopSystemWeb_ApiDomain + "/Goo/GooGoodsType";
    //类目图标上传
    public static string ApiUrl_UGS_GooGoodsTypeIcon = OctUserGoodsShopSystemWeb_ApiDomain + "/Goo/GooGoodsTypeIcon";
    //商品类目必填属性 管理
    public static string ApiUrl_UGS_GooGoodsTypeNeedProp = OctUserGoodsShopSystemWeb_ApiDomain + "/Goo/GooGoodsTypeNeedProp";
    //商品信息管理
    public static string ApiUrl_UGS_GooGoodsMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/Goo/GooGoodsMsg";

    //【商品评价】
    public static string ApiUrl_UGS_GooAppraise = OctUserGoodsShopSystemWeb_ApiDomain + "/Goo/GooAppraise";

    //【商品赠品】
    public static string ApiUrl_UGS_GooGiftMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/Goo/GooGiftMsg";


    //-----------------【 Shop / 店铺相关】---------------------//

    //店铺类别 管理
    public static string ApiUrl_UGS_ShopType = OctUserGoodsShopSystemWeb_ApiDomain + "/Shop/ShopType";
    //店铺信息 管理
    public static string ApiUrl_UGS_ShopMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/Shop/ShopMsg";
    //店铺Logo门头图片 管理
    public static string ApiUrl_UGS_ShopLogoImg = OctUserGoodsShopSystemWeb_ApiDomain + "/Shop/ShopLogoImg";
    //店铺抽成比例
    public static string ApiUrl_UGS_ShopCommission = OctUserGoodsShopSystemWeb_ApiDomain + "/Shop/ShopCommission";

    //【店铺评价】
    public static string ApiUrl_UGS_ShopAppraise = OctUserGoodsShopSystemWeb_ApiDomain + "/Shop/ShopAppraise";


    //-----------------【 Buyer / 推广会员信息】---------------------//

    //【推广会员信息】
    public static string ApiUrl_UGS_BuyerPromoteUser = OctUserGoodsShopSystemWeb_ApiDomain + "/Buyer/BuyerPromoteUser";

    //-----------------【 Buyer / 会员发展店铺】---------------------//

    //【会员发展店铺】
    public static string ApiUrl_UGS_BuyerExpandShop = OctUserGoodsShopSystemWeb_ApiDomain + "/Buyer/BuyerExpandShop";



    //-----------------【 Company / 公司相关】---------------------//

    //公司信息 管理
    public static string ApiUrl_UGS_CompanyMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/Company/CompanyMsg";

    //公司证件信息 管理
    public static string ApiUrl_UGS_CompanyCertificate = OctUserGoodsShopSystemWeb_ApiDomain + "/Company/CompanyCertificate";

    //-----------------【 Present / 礼品】---------------------//

    //【礼品信息】
    public static string ApiUrl_UGS_PresentMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/Present/PresentMsg";

    //【礼品分类】
    public static string ApiUrl_UGS_PresentGoodsType = OctUserGoodsShopSystemWeb_ApiDomain + "/Present/PresentGoodsType";

    //----------【秒杀抢购】相关--------------//

    //【秒杀商品信息】 
    public static string ApiUrl_UGS_SecKillGoodsMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/SecKill/SecKillGoodsMsg";

    //【秒杀商品分类】 
    public static string ApiUrl_UGS_SecKillGoodsType = OctUserGoodsShopSystemWeb_ApiDomain + "/SecKill/SecKillGoodsType";

    //----------【拼团】相关--------------//

    //【拼团商品设置】 
    public static string ApiUrl_UGS_GroupGoodsSetting = OctUserGoodsShopSystemWeb_ApiDomain + "/Group/GroupGoodsSetting";

    //【拼团发起信息】 
    public static string ApiUrl_UGS_GroupCreateMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/Group/GroupCreateMsg";

    //【加入拼团信息】 
    public static string ApiUrl_UGS_GroupJoinMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/Group/GroupJoinMsg";

    //【拼团商品显示】 
    public static string ApiUrl_UGS_GroupGoods = OctUserGoodsShopSystemWeb_ApiDomain + "/Mall/GroupGoods";


    //----------【活动】相关--------------//

    //【活动信息】 
    public static string ApiUrl_UGS_ActivityMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/Activity/ActivityMsg";

    //【活动参与信息】 
    public static string ApiUrl_UGS_ActivityJoin = OctUserGoodsShopSystemWeb_ApiDomain + "/Activity/ActivityJoin";

    //----------【 LuckyDraw / 抽奖】相关--------------//

    //【抽奖信息管理】 
    public static string ApiUrl_UGS_LuckyDrawMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/LuckyDraw/LuckyDrawMsg";

    //【抽奖参与信息】 
    public static string ApiUrl_UGS_LuckyDrawJoinMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/LuckyDraw/LuckyDrawJoinMsg";

    //【抽奖中奖结果信息】 
    public static string ApiUrl_UGS_LuckyDrawResult = OctUserGoodsShopSystemWeb_ApiDomain + "/LuckyDraw/LuckyDrawResult";




    #endregion

    #region【OctTradingSystemWeb (交易系统订单与财务)】API请求配置信息

    //OctTradingSystemWeb (订单与财务 交易系统 ) API请求地址域名  http://192.168.3.10:1200
    public static string OctTradingSystemWeb_ApiDomain = ConfigHelper.getAppSettingsValue("OctTradingSystemWeb_ApiDomain").Trim();

    ///////////////////【Settle / 商家结算 】/////////////////////////

    //【商家结算资料】
    public static string ApiUrl_T_SettleShopMsg = OctTradingSystemWeb_ApiDomain + "/Settle/SettleShopMsg";

    //【商家结算申请】
    public static string ApiUrl_T_SettleApply = OctTradingSystemWeb_ApiDomain + "/Settle/SettleApply";

    //【商城结算订单信息】
    public static string ApiUrl_T_SettleOrderMsg = OctTradingSystemWeb_ApiDomain + "/Settle/SettleOrderMsg";

    //【聚合支付结算订单信息】
    public static string ApiUrl_T_SettleAggregateOrderMsg = OctTradingSystemWeb_ApiDomain + "/Settle/SettleAggregateOrderMsg";

    ///////////////////【Commission / 订单抽成与分红分润 】/////////////////////////

    //【商城-订单抽成与分红分润信息】
    public static string ApiUrl_T_OrderCommission = OctTradingSystemWeb_ApiDomain + "/Commission/OrderCommission";

    //【聚合支付-订单抽成与分红分润信息】
    public static string ApiUrl_T_AggregateOrderCommission = OctTradingSystemWeb_ApiDomain + "/Commission/AggregateOrderCommission";


    ///////////////////【Aggregate / 聚合支付 】/////////////////////////

    //【聚合支付订单信息】
    public static string ApiUrl_T_AggregateOrderMsg = OctTradingSystemWeb_ApiDomain + "/Aggregate/AggregateOrderMsg";

    ///////////////////【Order / 商城订单 】/////////////////////////

    //【订单信息管理】
    public static string ApiUrl_T_OrderMsg = OctTradingSystemWeb_ApiDomain + "/Order/OrderMsg";

    ///////////////////【Finance / 财务 】/////////////////////////

    //【买家账户余额收支信息】
    public static string ApiUrl_T_BuyerIncomeExpense = OctTradingSystemWeb_ApiDomain + "/Finance/BuyerIncomeExpense";

    //【买家分润余额收支信息】
    public static string ApiUrl_T_BuyerIncomeExpenseDividend = OctTradingSystemWeb_ApiDomain + "/Finance/BuyerIncomeExpenseDividend";

    //【买家账户积分收支信息】
    public static string ApiUrl_T_BuyerIntegral = OctTradingSystemWeb_ApiDomain + "/Finance/BuyerIntegral";

    //【买家分润积分收支信息】
    public static string ApiUrl_T_BuyerIntegralDividend = OctTradingSystemWeb_ApiDomain + "/Finance/BuyerIntegralDividend";

    //【商家余额收支信息】
    public static string ApiUrl_T_ShopIncomeExpense = OctTradingSystemWeb_ApiDomain + "/Finance/ShopIncomeExpense";

    //【商家积分收支信息】
    public static string ApiUrl_T_ShopIntegral = OctTradingSystemWeb_ApiDomain + "/Finance/ShopIntegral";

    ///////////////////【充值，充积分】/////////////////////////

    //【买家余额充值】
    public static string ApiUrl_T_BuyerRecharge = OctTradingSystemWeb_ApiDomain + "/Recharge/BuyerRecharge";

    //【 商家充积分信息】
    public static string ApiUrl_T_ShopIntegralRecharge = OctTradingSystemWeb_ApiDomain + "/Recharge/ShopIntegralRecharge";


    //--------------------【Pay / 支付 】---------------------//

    //【转账汇款银行信息】
    public static string ApiUrl_T_PayTransBankMsg = OctTradingSystemWeb_ApiDomain + "/Pay/PayTransBankMsg";

    //【转账记录信息】
    public static string ApiUrl_T_PayTransRecord = OctTradingSystemWeb_ApiDomain + "/Pay/PayTransRecord";

    //--------------------【Coupons / 优惠券 】---------------------//

    //【优惠券信息】
    public static string ApiUrl_T_CouponsMsg = OctTradingSystemWeb_ApiDomain + "/Coupons/CouponsMsg";

    //【优惠券发放信息】
    public static string ApiUrl_T_CouponsIssueMsg = OctTradingSystemWeb_ApiDomain + "/Coupons/CouponsIssueMsg";

    //--------------------【Present / 礼品 】---------------------//

    //【礼品订单信息】
    public static string ApiUrl_T_PresentOrderMsg = OctTradingSystemWeb_ApiDomain + "/Present/PresentOrderMsg";

    //--------------------【WithDraw / 提现 】---------------------//

    //【买家提现信息】
    public static string ApiUrl_T_BuyerWithDraw = OctTradingSystemWeb_ApiDomain + "/WithDraw/BuyerWithDraw";

    //---------------------【CountSum / 数据统计】----------------------//

    //【公共首页】
    public static string ApiUrl_T_Index = OctTradingSystemWeb_ApiDomain + "/CountSum/Index";

    ///////////////////【拼团】相关/////////////////////////

    //【拼团发起信息】
    public static string ApiUrl_T_GroupCreateMsg = OctTradingSystemWeb_ApiDomain + "/Group/GroupCreateMsg";


    #endregion

    #region【OctAfterSaleAccCusSystem (售后,投诉,客服反馈,消息系统)】API请求配置信息

    //OctAfterSaleAccCusSystem (售后,投诉,客服反馈,消息系统) API请求地址域名  http://192.168.3.10:1200
    public static string OctAfterSaleAccCusSystemWeb_ApiDomain = ConfigHelper.getAppSettingsValue("OctAfterSaleAccCusSystemWeb_ApiDomain").Trim();

    //--------------------【Complain / 投诉 】---------------------//

    //【投诉信息】
    public static string ApiUrl_ASAC_OrderComplainMsg = OctAfterSaleAccCusSystemWeb_ApiDomain + "/Complain/OrderComplainMsg";

    //--------------------【AfterSale / 售后 】---------------------//

    //【售后申请信息】
    public static string ApiUrl_ASAC_AfterSaleApplyMsg = OctAfterSaleAccCusSystemWeb_ApiDomain + "/AfterSale/AfterSaleApplyMsg";

    //--------------------【ExplainText / 说明性文本 】---------------------//

    //【说明性文本信息】
    public static string ApiUrl_ASAC_ExplainText = OctAfterSaleAccCusSystemWeb_ApiDomain + "/ExplainText/ExplainText";

    //--------------------【SysMsg / 系统通知信息 】---------------------//

    //【买家系统消息】
    public static string ApiUrl_ASAC_BuyerSysMsg = OctAfterSaleAccCusSystemWeb_ApiDomain + "/SysMsg/BuyerSysMsg";

    //【商家系统消息】
    public static string ApiUrl_ASAC_ShopSysMsg = OctAfterSaleAccCusSystemWeb_ApiDomain + "/SysMsg/ShopSysMsg";

    //【平台系统消息】
    public static string ApiUrl_ASAC_PlatformSysMsg = OctAfterSaleAccCusSystemWeb_ApiDomain + "/SysMsg/PlatformSysMsg";

    //---------------------【CountSum / 数据统计】相关------------------------//

    //【公共首页】
    public static string ApiUrl_ASAC_Index = OctAfterSaleAccCusSystemWeb_ApiDomain + "/CountData/Index";

    //---------------------【AdminUser / CMS管理用户】相关------------------------//

    //【CMS管理用户信息】
    public static string ApiUrl_ASAC_AdminUserMsg = OctAfterSaleAccCusSystemWeb_ApiDomain + "/AdminUser/AdminUserMsg";



    #endregion

    #region【OctAdvertiserSystemWeb (广告系统)】API请求配置信息

    //OctUserGoodsShopSystemWeb (会员店铺产品系统) API请求地址域名  http://192.168.3.10:1200
    public static string OctAdvertiserSystemWeb_ApiDomain = ConfigHelper.getAppSettingsValue("OctAdvertiserSystemWeb_ApiDomain").Trim();

    //================【 Adv / 广告图片显示 】==========================//

    //【轮播广告】
    public static string ApiUrl_ADV_AdvCarousel = OctAdvertiserSystemWeb_ApiDomain + "/Adv/AdvCarousel";

    //【横幅通栏广告】
    public static string ApiUrl_ADV_AdvBanner = OctAdvertiserSystemWeb_ApiDomain + "/Adv/AdvBanner";

    //【图片列表广告】
    public static string ApiUrl_ADV_AdvImgList = OctAdvertiserSystemWeb_ApiDomain + "/Adv/AdvImgList";

    //【推荐商品商家信息】
    public static string ApiUrl_ADV_RcdGoodsShop = OctAdvertiserSystemWeb_ApiDomain + "/Adv/RcdGoodsShop";

    //【搜索发现展示】
    public static string ApiUrl_ADV_SearchFindMsg = OctAdvertiserSystemWeb_ApiDomain + "/Adv/SearchFindMsg";

    //【栏目图标导航信息】
    public static string ApiUrl_ADV_NavIconMsg = OctAdvertiserSystemWeb_ApiDomain + "/Nav/NavIconMsg";


    #endregion

    #region【OctFileUploadSystemWeb (文件上传系统)】API请求配置信息

    //【上传文件系统 域名列表数组】
    public static string[] OctFileUploadSystemWebDomainListArr = ConfigHelper.getAppSettingsValue("OctFileUploadSystemWebDomainListArr").Trim().Split('^');

    //OctFileUploadSystemWeb (文件上传系统) API请求地址域名  http://192.168.3.10:1200
    public static string OctFileUploadSystemWeb_ApiDomain = ConfigHelper.getAppSettingsValue("OctFileUploadSystemWeb_ApiDomain").Trim();

    //上传【商品类目图标】
    public static string ApiUrl_FU_GooGoodsTypeIcon = OctFileUploadSystemWeb_ApiDomain + "/Goo/GooGoodsTypeIcon";

    //上传【店铺类目图标】
    public static string ApiUrl_FU_ShopTypeIcon = OctFileUploadSystemWeb_ApiDomain + "/Shop/ShopTypeIcon";

    //上传【店铺头像图片】
    public static string ApiUrl_FU_ShopHeaderImg = OctFileUploadSystemWeb_ApiDomain + "/Shop/ShopHeaderImg";

    //上传【店铺Logo门头图片】
    public static string ApiUrl_FU_ShopLogoImg = OctFileUploadSystemWeb_ApiDomain + "/Shop/ShopLogoImg";

    //上传【公司证件资质图片】
    public static string ApiUrl_FU_CompanyCertificateImg = OctFileUploadSystemWeb_ApiDomain + "/Company/CompanyCertificateImg";

    //上传【轮播广告图片】
    public static string ApiUrl_FU_AdvCarouselImg = OctFileUploadSystemWeb_ApiDomain + "/Adv/AdvCarouselImg";

    //上传【横幅通栏广告图片】
    public static string ApiUrl_FU_AdvBannerImg = OctFileUploadSystemWeb_ApiDomain + "/Adv/AdvBannerImg";

    //上传【图片列表广告图片】
    public static string ApiUrl_FU_AdvImgListImg = OctFileUploadSystemWeb_ApiDomain + "/Adv/AdvImgListImg";

    //上传【栏目图标导航图片】
    public static string ApiUrl_FU_NavIconImg = OctFileUploadSystemWeb_ApiDomain + "/Adv/NavIconImg";

    //上传【结算转账凭证照片】
    public static string ApiUrl_FU_SettleTransferVoucherImg = OctFileUploadSystemWeb_ApiDomain + "/Shop/SettleTransferVoucherImg";

    //上传【说明性文本图片】
    public static string ApiUrl_FU_ExplainImg = OctFileUploadSystemWeb_ApiDomain + "/Explain/ExplainImg";


    #endregion

    #region【OctThirdApiCallSystemWeb (第三方系统调用) 】API请求配置信息

    //OctThirdApiCallSystemWeb (第三方系统调用) API请求地址域名  http://192.168.3.10:1600
    public static string OctThirdApiCallSystemWeb_ApiDomain = ConfigHelper.getAppSettingsValue("OctThirdApiCallSystemWeb_ApiDomain").Trim();

    //================【 PayAdmin / 支付管理 】==========================//

    //【支付设置信息】
    public static string ApiUrl_TAC_PaySetting = OctThirdApiCallSystemWeb_ApiDomain + "/PayAdmin/PaySetting";

    //【预支付信息】
    public static string ApiUrl_TAC_PayPreMsg = OctThirdApiCallSystemWeb_ApiDomain + "/PayAdmin/PayPreMsg";

    //================【 Sms / 发送短信管理 】==========================//

    //【发送短信信息】
    public static string ApiUrl_TAC_SmsSendMsg = OctThirdApiCallSystemWeb_ApiDomain + "/Sms/SmsSendMsg";


    #endregion



    #endregion


}
