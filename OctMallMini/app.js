//--------公共配置变量值------------//
var mAppConfig = {
  apiWebDoamin: "https://mini.opencodetiger.com", //小程序Api的网站域名 http://192.168.3.10:2000
  octWapWebDoamin: "https://h5.opencodetiger.com", //OctWapWeb 项目手机h5版 域名地址 http://192.168.3.10:1000
  httpSecretKey:"88c2dd28-c8bb-4d88-ad6e-82a4d0c892cs",  //发送http请求的密钥
  WxMiniAppID: "wx7d5e713f7c63bf", //AppID(小程序ID)
  IsWebViewEnter: "false", //是否WebView可以访问其他的网址 [ false / true]
}

App({
  onLaunch: function () {

    //设置TabBarBadge的Badge数字
    // wx.setTabBarBadge({
    //   index: 3,
    //   text: '32'
    // });

    // wx.setTabBarBadge({
    //   index: 4,
    //   text: '99+'
    // });
  },
  //------------公共设置变量---------------//
  globalData: {
    loginBuyerUserID: "", //登录的买家UserID
    loginPwdSha1: "", //登录的买家的密码 SHA1加密的
    buyerMiniOpenID: "", //用户买家的小程序OPENID
    userInfo: null,
    apiWebDoamin: mAppConfig.apiWebDoamin, //小程序Api的网站域名
    octWapWebDoamin: mAppConfig.octWapWebDoamin, //OctWapWeb 项目手机h5版 域名地址
    OctShopWapDoamin: mAppConfig.OctShopWapDoamin, //OctShopWap 商城官网移动版 域名地址,小程序首页
    OctImWapDoamin: mAppConfig.OctImWapDoamin, //OctImWap 在线客服系统官网移动版 域名地址,小程序首页
    httpSecretKey: mAppConfig.httpSecretKey, //发送http请求的密钥
    WxMiniAppID: mAppConfig.WxMiniAppID, //AppID(小程序ID)
    tabbarMidIndex: 1, //中间底部导航初始化索引
    httpHeader: "http://", //Http的协议头 字符串
    IsWebViewEnter: mAppConfig.IsWebViewEnter, //是否WebView可以访问其他的网址 [ false / true]
  },
  //------------小程序相关信息 API 的URL ---------//
  apiWxMiniUrl: {
    //【 建立微信小程序登录，并获取 openid,unionid,session_key】
    wxMiniApi_WxLoginGetMsg: mAppConfig.apiWebDoamin + "/WxMiniApi/WxLoginGetMsg",
  },

  //-------------API请求地址URL-----------//

  apiURLData: {
    //--------------店铺--------------//
    //【店铺首页】
    shopApi_Index: mAppConfig.apiWebDoamin + "/ShopApi/Index",
    //【商家信息详情】
    shopApi_ShopMsgDetail: mAppConfig.apiWebDoamin + "/ShopApi/ShopMsgDetail",
    //【商家全部商品】
    shopApi_GoodsAll: mAppConfig.apiWebDoamin + "/ShopApi/GoodsAll",
    //【店铺活动】
    shopApi_Activity: mAppConfig.apiWebDoamin + "/ShopApi/Activity",
    //【店铺热门分类】
    shopApi_GoodsType: mAppConfig.apiWebDoamin + "/ShopApi/GoodsType",
    //【店分类 显示商品】
    shopApi_GoodsTypeDetail: mAppConfig.apiWebDoamin + "/ShopApi/GoodsTypeDetail",
    //【店铺礼品】
    shopApi_Present: mAppConfig.apiWebDoamin + "/ShopApi/Present",
    //【店铺搜索】
    shopApi_ShopSearch: mAppConfig.apiWebDoamin + "/ShopApi/ShopSearch",
    //【店铺搜索结果】
    shopApi_ShopSearchResult: mAppConfig.apiWebDoamin + "/ShopApi/ShopSearchResult",
    //【店铺信息】
    shopApi_ShopMsg: mAppConfig.apiWebDoamin + "/ShopApi/ShopMsg",

    //--------------商品--------------//
    //【加载商品内容】
    goodsApi_GoodsDetail: mAppConfig.apiWebDoamin + "/GoodsApi/GoodsDetail",
    //【商品描述】
    goodsApi_GoodsDetailMsg: mAppConfig.apiWebDoamin + "/GoodsApi/GoodsDetailMsg",
    //【商品评价】
    goodsApi_GoodsAppraise: mAppConfig.apiWebDoamin + "/GoodsApi/GoodsAppraise",

    //--------------赠品--------------//
    //【赠品详情】
    goodsApi_GiftDetail: mAppConfig.apiWebDoamin + "/GoodsApi/GiftDetail",


    //--------------拼团--------------//
    //【拼团详情】
    groupApi_GroupDetail: mAppConfig.apiWebDoamin + "/GroupApi/GroupDetail",
    //【拼团商品设置信息】
    groupApi_GroupGoodsSetting: mAppConfig.apiWebDoamin + "/GroupApi/GroupGoodsSetting",

    //--------------买家中心--------------//
    //【买家中心首页】
    buyerApi_Index: mAppConfig.apiWebDoamin + "/BuyerApi/Index",
    //【关注收藏信息 (收藏商品或店铺)】
    buyerApi_BuyerFocusFav: mAppConfig.apiWebDoamin + "/BuyerApi/BuyerFocusFav",
    //【浏览足迹】
    buyerApi_BuyerBrowseHistory: mAppConfig.apiWebDoamin + "/BuyerApi/BuyerBrowseHistory",
    //【收货地址列表】
    buyerApi_ReceiAddrList: mAppConfig.apiWebDoamin + "/BuyerApi/ReceiAddrList",
    //【添加收货地址】
    buyerApi_ReceiAddrAdd: mAppConfig.apiWebDoamin + "/BuyerApi/ReceiAddrAdd",
    //【编辑收货地址】
    buyerApi_ReceiAddrEdit: mAppConfig.apiWebDoamin + "/BuyerApi/ReceiAddrEdit",
    //【评价详情】
    buyerApi_AppraiseDetail: mAppConfig.apiWebDoamin + "/BuyerApi/AppraiseDetail",
    //【我的订单】
    buyerApi_MyOrder: mAppConfig.apiWebDoamin + "/BuyerApi/MyOrder",
    //【扫码支付订单】
    buyerApi_AggreOrder: mAppConfig.apiWebDoamin + "/BuyerApi/AggreOrder",
    //【我的优惠券】
    buyerApi_CouponsMy: mAppConfig.apiWebDoamin + "/BuyerApi/CouponsMy",
    //【我的投诉】
    buyerApi_ComplainMy: mAppConfig.apiWebDoamin + "/BuyerApi/ComplainMy",
    //【提交投诉】
    buyerApi_ComplainSubmit: mAppConfig.apiWebDoamin + "/BuyerApi/ComplainSubmit",
    //【投诉详情】
    buyerApi_ComplainDetail: mAppConfig.apiWebDoamin + "/BuyerApi/ComplainDetail",
    //【我的推广码】
    buyerApi_MyPromoteQRCode: mAppConfig.apiWebDoamin + "/BuyerApi/MyPromoteQRCode",
    //【我推广的人】
    buyerApi_MyPromoteUser: mAppConfig.apiWebDoamin + "/BuyerApi/MyPromoteUser",
    //【官方客服】
    buyerApi_OfficialService: mAppConfig.apiWebDoamin + "/BuyerApi/OfficialService",
    //【买家消息列表】
    buyerApi_BuyerMsg: mAppConfig.apiWebDoamin + "/BuyerApi/BuyerMsg",

    //--------------买家登录--------------//
    //【登录注册首页】
    loginApi_Index: mAppConfig.apiWebDoamin + "/LoginApi/Index",
    //【买家登录】
    loginApi_Buyer: mAppConfig.apiWebDoamin + "/LoginApi/Buyer",
    //【小程序-用户注册登录】
    loginApi_MiniLoginRegUserAccount: mAppConfig.apiWebDoamin + "/LoginApi/MiniLoginRegUserAccount",

    //--------------IM在线客服系统--------------//
    //【接口首页】
    imSysApi_Index: mAppConfig.apiWebDoamin + "/ImSysApi/Index",

    //--------------订单--------------//
    //【确认下单】
    orderApi_PlaceOrder: mAppConfig.apiWebDoamin + "/OrderApi/PlaceOrder",
    //【确认下单 -- 多商家多商品】
    orderApi_PlaceOrderMul: mAppConfig.apiWebDoamin + "/OrderApi/PlaceOrderMul",
    //【订单详情】
    orderApi_OrderDetail: mAppConfig.apiWebDoamin + "/OrderApi/OrderDetail",
    //【订单动态】
    orderApi_OrderDynamic: mAppConfig.apiWebDoamin + "/OrderApi/OrderDynamic",
    //【订单快递 详情页】
    orderApi_ExpressDetail: mAppConfig.apiWebDoamin + "/OrderApi/ExpressDetail",

    //--------------售后--------------//
    //【买家售后主页】
    afterSaleApi_BuyerAsIndex: mAppConfig.apiWebDoamin + "/AfterSaleApi/BuyerAsIndex",
    //【多商品售后选择页】
    afterSaleApi_AsMulSel: mAppConfig.apiWebDoamin + "/AfterSaleApi/AsMulSel",
    //【选择售后类型】
    afterSaleApi_AsSelType: mAppConfig.apiWebDoamin + "/AfterSaleApi/AsSelType",
    //【提交维修申请】
    afterSaleApi_AsSubmit: mAppConfig.apiWebDoamin + "/AfterSaleApi/AsSubmit",
    //【售后详情】
    afterSaleApi_AsDetail: mAppConfig.apiWebDoamin + "/AfterSaleApi/AsDetail",
    //【售后动态信息】
    afterSaleApi_AsDynamic: mAppConfig.apiWebDoamin + "/AfterSaleApi/AsDynamic",

    //-------------发票信息-------------//
    //【订单发票信息】
    orderApi_OrderInvoice: mAppConfig.apiWebDoamin + "/OrderApi/OrderInvoice",

    //------------支付相关-------------//
    //【支付首页】
    payApi_Index: mAppConfig.apiWebDoamin + "/PayApi/Index",
    //【银行转账支付】
    payApi_BankTransfer: mAppConfig.apiWebDoamin + "/PayApi/BankTransfer",
    //【支付成功的跳转页】
    payApi_PaySuRedirect: mAppConfig.apiWebDoamin + "/PayApi/PaySuRedirect",
    //【订单支付 [从订单详情进入]】
    payApi_OrderPay: mAppConfig.apiWebDoamin + "/PayApi/OrderPay",

    //-------------购物车-------------//
    //【购物车首页】
    sCartApi_Index: mAppConfig.apiWebDoamin + "/SCartApi/Index",

    //-------------商城首页B2c-------------//
    //【商城首页 B2c】
    mallApi_Index: mAppConfig.apiWebDoamin + "/MallApi/Index",
    //【商品分类】
    mallApi_GoodsType: mAppConfig.apiWebDoamin + "/MallApi/GoodsType",
    //【商品分类列表显示】
    mallApi_GoodsTypeList: mAppConfig.apiWebDoamin + "/MallApi/GoodsTypeList",
    //【团购优惠】
    mallApi_GroupBuy: mAppConfig.apiWebDoamin + "/MallApi/GroupBuy",
    //【抢购秒杀】
    mallApi_SecondsKill: mAppConfig.apiWebDoamin + "/MallApi/SecondsKill",
    //【折扣商品】
    mallApi_DiscountGoods: mAppConfig.apiWebDoamin + "/MallApi/DiscountGoods",
    //【礼品兑换】
    mallApi_PresentExchange: mAppConfig.apiWebDoamin + "/MallApi/PresentExchange",
    //【领券中心】
    mallApi_Coupons: mAppConfig.apiWebDoamin + "/MallApi/Coupons",
    //【幸运抽奖】
    mallApi_LuckyDraw: mAppConfig.apiWebDoamin + "/MallApi/LuckyDraw",
    //【抽奖详情】
    mallApi_LuckyDrawDetail: mAppConfig.apiWebDoamin + "/MallApi/LuckyDrawDetail",
    //【活动优惠】
    mallApi_Activity: mAppConfig.apiWebDoamin + "/MallApi/Activity",

    //--------------文件上传--------------//
    //【上传商品晒单图片】
    fileUploadApi_GooAppraiseImg: mAppConfig.apiWebDoamin + "/FileUploadApi/GooAppraiseImg",
    //【售后问题图片】
    fileUploadApi_AfterSaleProblemImgs: mAppConfig.apiWebDoamin + "/FileUploadApi/AfterSaleProblemImgs",

    //--------------礼品--------------//
    //【礼品订购】
    presentApi_PresentDetail: mAppConfig.apiWebDoamin + "/PresentApi/PresentDetail",
    //【礼品下订单】
    presentApi_PresentOrder: mAppConfig.apiWebDoamin + "/PresentApi/PresentOrder",
    //【礼品订单详情】
    presentApi_PresentOrderDetail: mAppConfig.apiWebDoamin + "/PresentApi/PresentOrderDetail",
    //【我的礼品订单列表】
    presentApi_MyPresentOrder: mAppConfig.apiWebDoamin + "/PresentApi/MyPresentOrder",

    //--------------幸运抽奖--------------//
    //【抽奖信息- 买家中心】
    luckyDrawApi_LuckyDrawMsg: mAppConfig.apiWebDoamin + "/LuckyDrawApi/LuckyDrawMsg",
    //【中奖详情 - 买家中心】
    luckyDrawApi_LuckyDrawDetailBuyer: mAppConfig.apiWebDoamin + "/LuckyDrawApi/LuckyDrawDetailBuyer",
    //【幸运抽奖】
    luckyDrawApi_LuckyDraw: mAppConfig.apiWebDoamin + "/LuckyDrawApi/LuckyDraw",
    //【抽奖详情】
    luckyDrawApi_LuckyDrawDetail: mAppConfig.apiWebDoamin + "/LuckyDrawApi/LuckyDrawDetail",

    //--------------活动--------------//
    //【活动详情--展示页】
    activityApi_ActivityDetail: mAppConfig.apiWebDoamin + "/ActivityApi/ActivityDetail",
    //【活动列表-买家参与】
    activityApi_ActivityList: mAppConfig.apiWebDoamin + "/ActivityApi/ActivityList",

    //--------------会员系统,会员中心--------------//
    //【会员系统首页 余额，积分】
    vipApi_Index: mAppConfig.apiWebDoamin + "/VipApi/Index",
    //【余额积分 账户和分润的】
    vipApi_BalanceIntegral: mAppConfig.apiWebDoamin + "/VipApi/BalanceIntegral",
    //【账户余额明细】
    vipApi_BalanceDetail: mAppConfig.apiWebDoamin + "/VipApi/BalanceDetail",
    //【分润-账户余额明细】
    vipApi_DividendBalanceDetail: mAppConfig.apiWebDoamin + "/VipApi/DividendBalanceDetail",
    //【账户积分明细】
    vipApi_IntegralDetail: mAppConfig.apiWebDoamin + "/VipApi/IntegralDetail",
    //【分润-账户积分明细】
    vipApi_DividendIntegralDetail: mAppConfig.apiWebDoamin + "/VipApi/DividendIntegralDetail",
    //【收支详情 - 余额与积分】
    vipApi_InExDetail: mAppConfig.apiWebDoamin + "/VipApi/InExDetail",
    //【分润收支详情 - 余额与积分】
    vipApi_DividendInExDetail: mAppConfig.apiWebDoamin + "/VipApi/DividendInExDetail",
    //【会员等级】
    vipApi_VipLevel: mAppConfig.apiWebDoamin + "/VipApi/VipLevel",
    //【买家用户提现】
    vipApi_WithdrawSubmit: mAppConfig.apiWebDoamin + "/VipApi/WithdrawSubmit",
    //【买家在线充值】
    vipApi_OnLineTopUp: mAppConfig.apiWebDoamin + "/VipApi/OnLineTopUp",
    //--------------短信与验证码--------------//
    //【公共首页 】
    smsApi_Index: mAppConfig.apiWebDoamin + "/SmsApi/Index",
    //--------------系统设置--------------//
    //【公共首页Api】
    settingApi_Index: mAppConfig.apiWebDoamin + "/SettingApi/Index",
    //--------------各项小红点提示数--------------//
    //【各项小红点提示数】
    rCHintApi_CountData: mAppConfig.apiWebDoamin + "/RCHintApi/CountData",
    //--------------省市县区，三级，二级联动--------------//
    //【加载小程序省市二级联动Json数据】
    regionNameCodeApi_Index: mAppConfig.apiWebDoamin + "/RegionNameCodeApi/Index",

    //--------------平台搜索商品店铺--------------//
    //【搜索商品】
    searchApi_SearchGoods: mAppConfig.apiWebDoamin + "/SearchApi/SearchGoods",
    //【搜索商品结果】
    searchApi_SearchGoodsResult: mAppConfig.apiWebDoamin + "/SearchApi/SearchGoodsResult",
    //【搜索商品结果 O2o实体店商品结果】
    searchApi_SearchGoodsResultO2o: mAppConfig.apiWebDoamin + "/SearchApi/SearchGoodsResultO2o",
    //【搜索店铺】
    searchApi_SearchShop: mAppConfig.apiWebDoamin + "/SearchApi/SearchShop",
    //【搜索店铺结果】
    searchApi_SearchShopResult: mAppConfig.apiWebDoamin + "/SearchApi/SearchShopResult",
    //【搜索店铺结果 O2o实体店结果】
    searchApi_SearchShopResultO2o: mAppConfig.apiWebDoamin + "/SearchApi/SearchShopResultO2o",

    //-------------- 商城 O2O --------------//
    //【商城首页O2o】
    o2oApi_Index: mAppConfig.apiWebDoamin + "/O2oApi/Index",
    //【O2o商品类别】
    o2oApi_GoodsType: mAppConfig.apiWebDoamin + "/O2oApi/GoodsType",
    //【附近商家】
    o2oApi_ShopNear: mAppConfig.apiWebDoamin + "/O2oApi/ShopNear",

    //-------------- 商品评价 --------------//
    //【评价中心】
    buyerApi_AppraiseCenter: mAppConfig.apiWebDoamin + "/BuyerApi/AppraiseCenter",
    //【评价晒单表单】
    buyerApi_AppraiseForm: mAppConfig.apiWebDoamin + "/BuyerApi/AppraiseForm",
    //【评价详情】
    buyerApi_AppraiseDetail: mAppConfig.apiWebDoamin + "/BuyerApi/AppraiseDetail",

    //-------------- 聚合支付,扫码收单】 --------------//
    //【聚合扫码支付-首页】
    aggregateApi_Index: mAppConfig.apiWebDoamin + "/AggregateApi/Index",
    //【直接支付】
    aggregateApi_PayDirect: mAppConfig.apiWebDoamin + "/AggregateApi/PayDirect",


  },

  //-----------------官网-相关请求API路径--------------//
  apiCompanyWebURLData: {
    //【OctShop商城系统】 -- 首页
    OctShopWapApi_Index: mAppConfig.OctShopWapDoamin + "/OctShopWapApi/Index",
    //【OctImWap在线客服系统】 -- 首页
    OctImWapApi_Index: mAppConfig.OctImWapDoamin + "/OctImWapApi/Index",

  },


  //===============公共内部函数==============//

})