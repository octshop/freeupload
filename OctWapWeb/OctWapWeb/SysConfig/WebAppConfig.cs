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

    /// <summary>
    /// 微信公众号类型 [ dy 订阅号 / fw 服务号 / test 测试号 ]
    /// </summary>
    public static string Wx_OfficialAccType = ConfigHelper.getAppSettingsValue("Wx_OfficialAccType").Trim();



    #region【IM在线客服系统对接】

    /// <summary>
    /// IM在线客服系统 == 是否开通了IM在线客服系统 true / false
    /// </summary>
    public static string IMSysIsAbleUse = ConfigHelper.getAppSettingsValue("IMSysIsAbleUse").Trim();

    /// <summary>
    /// IM在线客服系统域名地址URL
    /// </summary>
    public static string ImSystemWebDomainURL = ConfigHelper.getAppSettingsValue("ImSystemWebDomainURL").Trim();

    #endregion

    #region【各前端平台的域名地址】

    //OctWapWeb 手机Web端(公众号端)地址域名
    public static string OctWapWeb_AddrDomain = ConfigHelper.getAppSettingsValue("OctWapWeb_AddrDomain").Trim();

    //OctMallMiniWeb 小程序后台API端地址域名
    public static string OctMallMiniWeb_AddrDomain = ConfigHelper.getAppSettingsValue("OctMallMiniWeb_AddrDomain").Trim();

    //OctShopSystemWeb 商家后台管理Web端 地址域名
    public static string OctShopSystemWeb_AddrDomain = ConfigHelper.getAppSettingsValue("OctShopSystemWeb_AddrDomain").Trim();

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

    //---------------【账号】相关----------------------//

    //【会员账号】 管理
    public static string ApiUrl_UserAccount = OctUserGoodsShopSystemWeb_ApiDomain + "/User/UserAccount";
    public static string ApiUrl_UGS_UserAccount = OctUserGoodsShopSystemWeb_ApiDomain + "/User/UserAccount";

    //【验证用户账号信息】 管理
    public static string ApiUrl_CheckUserAccount = OctUserGoodsShopSystemWeb_ApiDomain + "/User/CheckUserAccount";

    //【用户注册 - 微信-手机号短信】
    public static string ApiUrl_UGS_RegUserAccount = OctUserGoodsShopSystemWeb_ApiDomain + "/User/RegUserAccount";

    //【用户信息-位置-微信信息】
    public static string ApiUrl_UGS_UserAccountMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/User/UserAccountMsg";

    //【用户登录验证】
    public static string ApiUrl_UGS_UserLoginVerify = OctUserGoodsShopSystemWeb_ApiDomain + "/User/UserLoginVerify";


    //---------------【会员等级与信用分】相关----------------------//

    //【公共接口首页】
    public static string ApiUrl_UGS_VipCreditIndex = OctUserGoodsShopSystemWeb_ApiDomain + "/VipCredit/Index";


    //---------------【商品】相关----------------------//

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


    //---------------【店铺】相关----------------------//

    //【店铺类别】 管理
    public static string ApiUrl_UGS_ShopType = OctUserGoodsShopSystemWeb_ApiDomain + "/Shop/ShopType";
    //【店铺商品类别】 管理
    public static string ApiUrl_UGS_ShopGoodsType = OctUserGoodsShopSystemWeb_ApiDomain + "/Shop/ShopGoodsType";
    //【店铺信息】 管理
    public static string ApiUrl_UGS_ShopMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/Shop/ShopMsg";
    //【店铺Logo门头图片】 管理
    public static string ApiUrl_UGS_ShopLogoImg = OctUserGoodsShopSystemWeb_ApiDomain + "/Shop/ShopLogoImg";
    //【店铺轮播信息】 管理
    public static string ApiUrl_UGS_ShopCarousel = OctUserGoodsShopSystemWeb_ApiDomain + "/Shop/ShopCarousel";
    //【店铺相关页-数据加载】 管理
    public static string ApiUrl_UGS_ShopHomeData = OctUserGoodsShopSystemWeb_ApiDomain + "/Shop/ShopHomeData";


    //---------------【公司】相关----------------------//

    //【公司信息】 管理
    public static string ApiUrl_UGS_CompanyMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/Company/CompanyMsg";
    //【公司证件信息】 管理
    public static string ApiUrl_UGS_CompanyCertificate = OctUserGoodsShopSystemWeb_ApiDomain + "/Company/CompanyCertificate";

    //---------------【买家】相关----------------------//

    //【买家收货地址】 
    public static string ApiUrl_UGS_BuyerReceiAddr = OctUserGoodsShopSystemWeb_ApiDomain + "/Buyer/BuyerReceiAddr";

    //【关注收藏】 
    public static string ApiUrl_UGS_BuyerFocusFav = OctUserGoodsShopSystemWeb_ApiDomain + "/Buyer/BuyerFocusFav";

    //【浏览足迹】 
    public static string ApiUrl_UGS_BuyerBrowseHistory = OctUserGoodsShopSystemWeb_ApiDomain + "/Buyer/BuyerBrowseHistory";

    //【我推广的人】 
    public static string ApiUrl_UGS_BuyerPromoteUser = OctUserGoodsShopSystemWeb_ApiDomain + "/Buyer/BuyerPromoteUser";


    //---------------【购物车】相关----------------------//

    //【购物车】 管理
    public static string ApiUrl_UGS_SCart = OctUserGoodsShopSystemWeb_ApiDomain + "/SCart/Index";

    //---------------【积分】相关----------------------//

    //【积分规则设置】 
    public static string ApiUrl_UGS_ShopIntegralSetting = OctUserGoodsShopSystemWeb_ApiDomain + "/Integral/ShopIntegralSetting";

    //---------------【拼团】相关----------------------//

    //【拼团商品设置信息】 
    public static string ApiUrl_UGS_GroupGoodsSetting = OctUserGoodsShopSystemWeb_ApiDomain + "/Group/GroupGoodsSetting";
    //【拼团发起信息 开团信息】 
    public static string ApiUrl_UGS_GroupCreateMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/Group/GroupCreateMsg";

    //----------【礼品】相关--------------//

    //【礼品信息】 
    public static string ApiUrl_UGS_PresentMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/Present/PresentMsg";

    //----------【活动】相关--------------//

    //【活动信息】 
    public static string ApiUrl_UGS_ActivityMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/Activity/ActivityMsg";

    //【 活动参与信息】 
    public static string ApiUrl_UGS_ActivityJoin = OctUserGoodsShopSystemWeb_ApiDomain + "/Activity/ActivityJoin";

    //----------【抽奖】相关--------------//

    //【抽奖信息】 
    public static string ApiUrl_UGS_LuckyDrawMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/LuckyDraw/LuckyDrawMsg";

    //【抽奖参与信息】 
    public static string ApiUrl_UGS_LuckyDrawJoinMsg = OctUserGoodsShopSystemWeb_ApiDomain + "/LuckyDraw/LuckyDrawJoinMsg";

    //【抽奖中奖结果信息】 
    public static string ApiUrl_UGS_LuckyDrawResult = OctUserGoodsShopSystemWeb_ApiDomain + "/LuckyDraw/LuckyDrawResult";

    //----------【搜索】相关--------------//

    //【商品的搜索】 
    public static string ApiUrl_UGS_GoodsSearch = OctUserGoodsShopSystemWeb_ApiDomain + "/Search/GoodsSearch";

    //----------【猜你喜欢商品】相关--------------//

    //【店铺-猜你喜欢商品】 
    public static string ApiUrl_UGS_ShopGuessYouLike = OctUserGoodsShopSystemWeb_ApiDomain + "/GuessYouLike/ShopGuessYouLike";

    //【平台-猜你喜欢商品】 
    public static string ApiUrl_UGS_MallGuessYouLike = OctUserGoodsShopSystemWeb_ApiDomain + "/GuessYouLike/MallGuessYouLike";

    //----------【O2O展示页面】相关--------------//

    //【O2o商品类目】 
    public static string ApiUrl_UGS_GoodsTypeO2o = OctUserGoodsShopSystemWeb_ApiDomain + "/O2o/GoodsTypeO2o";

    //【O2o店铺类目 (两级分类)】 
    public static string ApiUrl_UGS_ShopTypeO2o = OctUserGoodsShopSystemWeb_ApiDomain + "/O2o/ShopTypeO2o";

    //【公共首页API】 
    public static string ApiUrl_UGS_PubIndex = OctUserGoodsShopSystemWeb_ApiDomain + "/O2o/PubIndex";

    //----------【商城展示页面】相关--------------//

    //【拼团商品显示】 
    public static string ApiUrl_UGS_GroupGoods = OctUserGoodsShopSystemWeb_ApiDomain + "/Mall/GroupGoods";

    //【秒杀商品显示】 
    public static string ApiUrl_UGS_SecKillGoods = OctUserGoodsShopSystemWeb_ApiDomain + "/Mall/SecKillGoods";

    //【打折商品显示】 
    public static string ApiUrl_UGS_DiscountGoods = OctUserGoodsShopSystemWeb_ApiDomain + "/Mall/DiscountGoods";

    //【礼品显示】 
    public static string ApiUrl_UGS_PresentGoods = OctUserGoodsShopSystemWeb_ApiDomain + "/Mall/PresentGoods";

    //【抽奖信息显示】 
    public static string ApiUrl_UGS_LuckyDrawMsgMall = OctUserGoodsShopSystemWeb_ApiDomain + "/Mall/LuckyDrawMsg";

    //【活动信息显示】 
    public static string ApiUrl_UGS_ActivityMsgMall = OctUserGoodsShopSystemWeb_ApiDomain + "/Mall/ActivityMsg";


    //----------【IM在线客服系统】相关--------------//

    //【构建商家店铺咨询进入IM在线客服系统 跳转 URL】 
    public static string ApiUrl_UGS_ImSysIndex = OctUserGoodsShopSystemWeb_ApiDomain + "/ImSys/Index";


    #endregion

    #region【OctTradingSystemWeb (订单与财务 交易系统 )】API请求配置信息

    //OctTradingSystemWeb (订单与财务 交易系统 ) API请求地址域名  http://192.168.3.10:1200
    public static string OctTradingSystemWeb_ApiDomain = ConfigHelper.getAppSettingsValue("OctTradingSystemWeb_ApiDomain").Trim();

    //--------------/Coupons/ 优惠券------------------//

    //【优惠券信息】
    public static string ApiUrl_T_CouponsMsg = OctTradingSystemWeb_ApiDomain + "/Coupons/CouponsMsg";

    //【优惠券发放信息】
    public static string ApiUrl_T_CouponsIssueMsg = OctTradingSystemWeb_ApiDomain + "/Coupons/CouponsIssueMsg";

    //【优惠券线下验证使用】
    public static string ApiUrl_T_CouponsVerifyCode = OctTradingSystemWeb_ApiDomain + "/Coupons/CouponsVerifyCode";

    //--------------/Order/ 订单------------------//

    //【订单信息】
    public static string ApiUrl_T_OrderMsg = OctTradingSystemWeb_ApiDomain + "/Order/OrderMsg";

    //【提交订单】
    public static string ApiUrl_T_PlaceOrder = OctTradingSystemWeb_ApiDomain + "/Order/PlaceOrder";

    //【提交订单-多商家多商品】
    public static string ApiUrl_T_PlaceOrderMul = OctTradingSystemWeb_ApiDomain + "/Order/PlaceOrderMul";

    //【订单发票信息】管理
    public static string ApiUrl_T_OrderInvoice = OctTradingSystemWeb_ApiDomain + "/Order/OrderInvoice";

    //【订单收货信息】管理
    public static string ApiUrl_T_OrderDelivery = OctTradingSystemWeb_ApiDomain + "/Order/OrderDelivery";

    //【订单验证码信息】
    public static string ApiUrl_T_OrderCheckCode = OctTradingSystemWeb_ApiDomain + "/Order/OrderCheckCode";

    //【快递查询与跟踪】
    public static string ApiUrl_T_ExpressDetail = OctTradingSystemWeb_ApiDomain + "/Order/ExpressDetail";


    //----------【礼品】相关--------------//

    //【礼品下订单】 
    public static string ApiUrl_T_PresentOrder = OctTradingSystemWeb_ApiDomain + "/Present/PresentOrder";

    //【礼品订单信息】 
    public static string ApiUrl_T_PresentOrderMsg = OctTradingSystemWeb_ApiDomain + "/Present/PresentOrderMsg";


    //--------------/Finance/ 财务------------------//

    //【财务公共接口首页】
    public static string ApiUrl_T_FinanceIndex = OctTradingSystemWeb_ApiDomain + "/Finance/Index";

    //【买家收支信息】管理
    public static string ApiUrl_T_BuyerIncomeExpense = OctTradingSystemWeb_ApiDomain + "/Finance/BuyerIncomeExpense";

    //【买家积分收支信息】
    public static string ApiUrl_T_BuyerIntegral = OctTradingSystemWeb_ApiDomain + "/Finance/BuyerIntegral";


    //--------------/Pay/ 支付------------------//

    //【订单支付 主要是： 余额支付，货到付款，到店付，银行转账】
    public static string ApiUrl_T_PayOrder = OctTradingSystemWeb_ApiDomain + "/Pay/PayOrder";

    //【转账汇款银行信息】
    public static string ApiUrl_T_PayTransBankMsg = OctTradingSystemWeb_ApiDomain + "/Pay/PayTransBankMsg";

    //--------------/Aggregate/ 聚合支付------------------//

    //【聚合支付订单信息】
    public static string ApiUrl_T_AggregateOrderMsg = OctTradingSystemWeb_ApiDomain + "/Aggregate/AggregateOrderMsg";

    //--------------/Commission/ 订单抽成与分红分润------------------//

    //【分润余额积分】
    public static string ApiUrl_T_DividendBalanceIntegral = OctTradingSystemWeb_ApiDomain + "/Commission/DividendBalanceIntegral";

    //--------------/WithDraw/ 用户提现------------------//

    //【买家提现】
    public static string ApiUrl_T_BuyerWithDraw = OctTradingSystemWeb_ApiDomain + "/WithDraw/BuyerWithDraw";

    //--------------/Recharge/ 充值，充积分------------------//

    //【买家余额充值】
    public static string ApiUrl_T_BuyerRecharge = OctTradingSystemWeb_ApiDomain + "/Recharge/BuyerRecharge";





    #endregion

    #region【OctAfterSaleAccCusSystemWeb ( 售后,投诉,客服反馈,消息系统 )】API请求配置信息

    //OctAfterSaleAccCusSystemWeb ( 售后,投诉,客服反馈,消息系统 ) API请求地址域名  http://192.168.3.10:1800
    public static string OctAfterSaleAccCusSystemWeb_ApiDomain = ConfigHelper.getAppSettingsValue("OctAfterSaleAccCusSystemWeb_ApiDomain").Trim();

    //-----------------/SysMsg/ 系统消息(商家，买家，平台)------------------//

    //【商家系统消息】
    public static string ApiUrl_ASAC_ShopSysMsg = OctAfterSaleAccCusSystemWeb_ApiDomain + "/SysMsg/ShopSysMsg";

    //【平台系统消息】
    public static string ApiUrl_ASAC_PlatformSysMsg = OctAfterSaleAccCusSystemWeb_ApiDomain + "/SysMsg/PlatformSysMsg";

    //【各种系统消息阅读集合，售后，咨询，交易】
    public static string ApiUrl_ASAC_ReadAllSysMsg = OctAfterSaleAccCusSystemWeb_ApiDomain + "/SysMsg/ReadAllSysMsg";

    //--------------------/AfterSale/--售后----------------------//

    //【售后申请信息】
    public static string ApiUrl_ASAC_AfterSaleApplyMsg = OctAfterSaleAccCusSystemWeb_ApiDomain + "/AfterSale/AfterSaleApplyMsg";

    //【售后发货信息】
    public static string ApiUrl_ASAC_AfterSaleSendGoods = OctAfterSaleAccCusSystemWeb_ApiDomain + "/AfterSale/AfterSaleSendGoods";

    //--------------------/Complain/--投诉----------------------//

    //【各种投诉信息】
    public static string ApiUrl_ASAC_OrderComplainMsg = OctAfterSaleAccCusSystemWeb_ApiDomain + "/Complain/OrderComplainMsg";

    //--------------------/ExplainText/--说明性文本----------------------//

    //【说明性文本】
    public static string ApiUrl_ASAC_ExplainText = OctAfterSaleAccCusSystemWeb_ApiDomain + "/ExplainText/ExplainText";

    //--------------------/RCHint/--各项小红点提示数----------------------//

    //【各项小红点提示数】
    public static string ApiUrl_ASAC_CountData = OctAfterSaleAccCusSystemWeb_ApiDomain + "/RCHint/CountData";



    #endregion

    #region【OctAdvertiserSystemWeb ( 广告内容系统 )】API请求配置信息

    //OctAdvertiserSystemWeb ( 广告内容系统 ) API请求地址域名  http://192.168.3.10:2100
    public static string OctAdvertiserSystemWeb_ApiDomain = ConfigHelper.getAppSettingsValue("OctAdvertiserSystemWeb_ApiDomain").Trim();

    //【商品店铺搜索历史】
    public static string ApiUrl_ADV_SearchHistoryGoodsShop = OctAdvertiserSystemWeb_ApiDomain + "/Adv/SearchHistoryGoodsShop";

    //【加载搜索发现内容】
    public static string ApiUrl_ADV_SearchFindMsg = OctAdvertiserSystemWeb_ApiDomain + "/Adv/SearchFindMsg";

    //【轮播广告】
    public static string ApiUrl_ADV_AdvCarousel = OctAdvertiserSystemWeb_ApiDomain + "/Adv/AdvCarousel";

    //【横幅通栏广告】
    public static string ApiUrl_ADV_AdvBanner = OctAdvertiserSystemWeb_ApiDomain + "/Adv/AdvBanner";

    //【图片列表广告】
    public static string ApiUrl_ADV_AdvImgList = OctAdvertiserSystemWeb_ApiDomain + "/Adv/AdvImgList";

    //【推荐商品商家信息】
    public static string ApiUrl_ADV_RcdGoodsShop = OctAdvertiserSystemWeb_ApiDomain + "/Adv/RcdGoodsShop";

    //【栏目图标导航信息】
    public static string ApiUrl_ADV_NavIconMsg = OctAdvertiserSystemWeb_ApiDomain + "/Nav/NavIconMsg";

    #endregion

    #region【OctFileUploadSystemWeb (文件上传系统)】API请求配置信息

    //【上传文件系统 域名列表数组】
    public static string[] OctFileUploadSystemWebDomainListArr = ConfigHelper.getAppSettingsValue("OctFileUploadSystemWebDomainListArr").Trim().Split('^');

    //OctFileUploadSystemWeb (文件上传系统) API请求地址域名  http://192.168.3.10:1200
    public static string OctFileUploadSystemWeb_ApiDomain = ConfigHelper.getAppSettingsValue("OctFileUploadSystemWeb_ApiDomain").Trim();

    //-------------------【商品】相关---------------------------//

    //上传【商品类目图标】
    public static string ApiUrl_FU_GooGoodsTypeIcon = OctFileUploadSystemWeb_ApiDomain + "/Goo/GooGoodsTypeIcon";

    //上传【商品规格图片】
    public static string ApiUrl_FU_GooSpecParamImg = OctFileUploadSystemWeb_ApiDomain + "/Goo/GooSpecParamImg";

    //上传【商品图片】
    public static string ApiUrl_FU_GooGoodsImg = OctFileUploadSystemWeb_ApiDomain + "/Goo/GooGoodsImg";

    //上传【赠品图片】
    public static string ApiUrl_FU_GooGiftMsg = OctFileUploadSystemWeb_ApiDomain + "/Goo/GooGiftImg";

    //上传【晒单图片】
    public static string ApiUrl_FU_GooAppraiseImg = OctFileUploadSystemWeb_ApiDomain + "/Goo/GooAppraiseImg";

    //-------------------【商家,店铺】相关---------------------------//

    //【商家相册】相关操作
    public static string ApiUrl_FU_ShopAlbum = OctFileUploadSystemWeb_ApiDomain + "/Shop/ShopAlbum";

    //【商家相册图片】相关操作
    public static string ApiUrl_FU_ShopAlbumImg = OctFileUploadSystemWeb_ApiDomain + "/Shop/ShopAlbumImg";

    //上传【店铺头像图片】
    public static string ApiUrl_FU_ShopHeaderImg = OctFileUploadSystemWeb_ApiDomain + "/Shop/ShopHeaderImg";

    //上传【店铺Logo门头图片】
    public static string ApiUrl_FU_ShopLogoImg = OctFileUploadSystemWeb_ApiDomain + "/Shop/ShopLogoImg";

    //-------------------【公司】 相关---------------------------//

    //上传【公司证件资质图片】
    public static string ApiUrl_FU_CompanyCertificateImg = OctFileUploadSystemWeb_ApiDomain + "/Company/CompanyCertificateImg";

    //-------------------【支付】 相关---------------------------//

    //上传【买家转账汇款凭证图片】
    public static string ApiUrl_FU_PayTransCertImg = OctFileUploadSystemWeb_ApiDomain + "/Pay/PayTransCertImg";

    //-------------------【售后】相关----------------//
    //上传【售后问题图片】
    public static string ApiUrl_FU_AfterSaleProblemImgs = OctFileUploadSystemWeb_ApiDomain + "/AfterSale/AfterSaleProblemImgs";



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
