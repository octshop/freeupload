// pages/shop/shoptype/shoptype.js
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiCookie = require('../../../busicode/busicookie.js');

//------初始化APP对象-----//
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    apiWebDoamin: app.globalData.apiWebDoamin, //小程序Api的网站域名
    navbarHeight: 0, //navBar的高度
    octContentMarginTop: 0, //主体内容距子导航的距离

    shopID: 0, //店铺ID
    shopUserID: 0, //商家UserID
    showData: null,
    appraiseStarGray: 0,
    appraiseStarRed: 0,
    initShopMsgTopBarItem_Data: null, //初始化 店铺信息条，店铺首页顶部条信息
    loadShopGoodsType_Data:null, //加载店铺商品分类

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //---得到navBar的高度----//
    var _navbarHeight = this.selectComponent("#NavBar").getNavBarHeight();
    this.setData({
      navbarHeight: _navbarHeight,
      octContentMarginTop: _navbarHeight + 90
    });

    //-----获取传递的参数赋值------//
    this.setData({
      shopID: options.SID
    });

    //----------方法调用-----------//
    //初始化 店铺信息条，店铺首页顶部条信息
    this.initShopMsgTopBarItem();
    //加载店铺商品分类
    this.loadShopGoodsType();


  },
  /**
   * 回退
   */
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 跳转商城首页
   */
  home: function () {
    wx.switchTab({
      url: '../../tabbar/index/index',
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //====================自定义函数========================//
  /**
   * 初始化 店铺信息条，店铺首页顶部条信息
   */
  initShopMsgTopBarItem: function () {
    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "5",
      "ShopID": this.data.shopID,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.shopApi_Index, _dataPOST, res => {


      //设置公共变量
      this.setData({
        initShopMsgTopBarItem_Data: res,
        appraiseStarRed: Math.floor(res.AvgAppraiseScore),
        appraiseStarGray: (5 - Math.floor(res.AvgAppraiseScore)),
      });

    });

  },
  /**
   * 加载店铺商品分类
   */
  loadShopGoodsType: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "1",
      "ShopID": this.data.shopID,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.shopApi_GoodsType, _dataPOST, res => {


      //-----设置公共变量-----//
      this.setData({
        loadShopGoodsType_Data:res,
      });

    });


  },

      //=====================在线客服接入==========================//

  /**
   * 构建【商家店铺】咨询进入IM在线客服系统 跳转 URL
   */
  buildBuyerGoToImSysURL_ShopWap: function () {

    mUtils.logOut("【商家店铺】咨询进入I");

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "1",
      "ShopUserID": this.data.initShopMsgTopBarItem_Data.ShopUserID,
      "BuyerUserID": app.globalData.loginBuyerUserID,
    };
    mUtils.logOut(_dataPOST);

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.imSysApi_Index, _dataPOST, _jsonReTxt => {

      mUtils.logOut(_jsonReTxt);

      if (_jsonReTxt != "") {
        //设置跳转到 IM在线客服系统 的 URL cookie值
        mBusiCookie.saveGoToImSysUrlCookie(_jsonReTxt);
        //跳转到IM在线客服系统 WebView页
        mUtils.navigateToURL("../../../pages/webviewpg/imwebview/imwebview");
      } else {
        //直接拨打店铺客服电话
        mUtils.makePhoneCall(this.data.initShopMsgTopBarItem_Data.ShopMobile);
      }

    });
  },



})