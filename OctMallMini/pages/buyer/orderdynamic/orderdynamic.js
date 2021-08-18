// pages/buyer/orderdynamic/orderdynamic.js
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiLogin = require('../../../busicode/busilogin.js');

//创建全局App对象
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    apiWebDoamin: app.globalData.apiWebDoamin, //小程序Api的网站域名
    navbarHeight: 0, //navBar的高度
    octContentMarginTop: 0, //主体内容距子导航的距离
    //-----------------自定义变量-------------//
    orderId: "0", //订单ID
    initOrderDynamic_Data: null, //初始化订单动态

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //---得到navBar的高度----//
    var _navbarHeight = this.selectComponent("#NavBar").getNavBarHeight();
    this.setData({
      navbarHeight: _navbarHeight,
      octContentMarginTop: _navbarHeight,
    });

    //-------加载后的业务逻辑--------//
    var _orderId = options.OID;

    //设置全局变量值
    this.setData({
      orderId: _orderId,
    });

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    //判断用户是否登录 没有登录 则跳转到指定URL 并设置UserID,LoginSha1
    mBusiLogin.isLoginUserNavigateSetUserIDPwdSha1Global(res => {
      //console.log(res)

      //----------登录后的函数-----------//
      //初始化订单动态
      this.initOrderDynamic();

    });


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
   * 跳转到我的
   */
  home: function () {
    wx.switchTab({
      url: '../../tabbar/buyerindex/buyerindex',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //=====================自定义函数==========================//
  /**
   * 初始化订单动态
   */
  initOrderDynamic: function () {

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
      "OrderID": this.data.orderId,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.orderApi_OrderDynamic, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }

      //设置公共变量
      this.setData({
        initOrderDynamic_Data: _jsonReTxt,
      })


    });

  },


})