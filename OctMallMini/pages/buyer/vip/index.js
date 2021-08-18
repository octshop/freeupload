// pages/buyer/vip/index.js
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiLogin = require('../../../busicode/busilogin.js');


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
    //-----------------自定义变量-------------//
    loadBuyerAllCurBalanceIntegral_Data: null, //得到买家所有的余额和积分信息
    loadUserVipLevelMsg_Data: null, //得到用户的当前等级和信用分
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //---得到navBar的高度----//
    var _navbarHeight = this.selectComponent("#NavBar").getNavBarHeight();
    this.setData({
      navbarHeight: _navbarHeight,
      octContentMarginTop: _navbarHeight + 0,
    });

    //判断用户是否登录 没有登录 则跳转到指定URL 并设置UserID,LoginSha1
    mBusiLogin.isLoginUserNavigateSetUserIDPwdSha1Global(res => {
      //console.log(res)
      //得到买家所有的余额和积分信息
      this.loadBuyerAllCurBalanceIntegral();
      //得到用户的当前等级和信用分
      this.loadUserVipLevelMsg();

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
   * 进入我的
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
   * 得到买家所有的余额和积分信息
   */
  loadBuyerAllCurBalanceIntegral: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "3",
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.vipApi_Index, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined || _jsonReTxt == null) {
        return;
      }


      //设置公共变量值
      this.setData({
        loadBuyerAllCurBalanceIntegral_Data: _jsonReTxt
      });


    });

  },

  /**
   * 得到用户的当前等级和信用分
   */
  loadUserVipLevelMsg: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "2",
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.vipApi_Index, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined || _jsonReTxt == null) {
        return;
      }


      //设置公共变量值
      this.setData({
        loadUserVipLevelMsg_Data: _jsonReTxt
      });


    });



  },

  //===================== 公共函数===========================//



})