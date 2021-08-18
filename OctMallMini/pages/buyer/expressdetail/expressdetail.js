// pages/buyer/expressdetail/expressdetail.js
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
    loadOrderFirstGoodsMsgSimple_Data: null, //加载订单第一个商品的简单信息
    searchOrderExpress_Data: null, //查询快递信息
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
      // 加载订单第一个商品的简单信息
      this.loadOrderFirstGoodsMsgSimple();
      //查询快递信息
      this.searchOrderExpress();

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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //=====================自定义函数==========================//
  /**
   * 加载订单第一个商品的简单信息
   */
  loadOrderFirstGoodsMsgSimple: function () {

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "10",
      "OrderID": this.data.orderId,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.orderApi_OrderDetail, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }

      //设置公共变量
      this.setData({
        loadOrderFirstGoodsMsgSimple_Data: _jsonReTxt,
      })


    });


  },
  /**
   * 查询快递信息
   */
  searchOrderExpress: function () {
    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
      "OrderID": this.data.orderId,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.orderApi_ExpressDetail, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }

      //设置公共变量
      this.setData({
        searchOrderExpress_Data: _jsonReTxt,
      })


    });

  },

    //===================== 公共函数===========================//
    
    /**
   * 复制内容到剪贴板上
   * @param {*} e 
   */
  copyContentClipboard: function (e) {
    var _copyContent = e.currentTarget.dataset.copyContent;
    mUtils.copyContentClipboard(_copyContent);

  },


})