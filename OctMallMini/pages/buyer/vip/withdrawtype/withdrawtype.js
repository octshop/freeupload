// pages/buyer/vip/withdrawtype/withdrawtype.js
//==============引入相关的Js文件========//
var mHttp = require('../../../../utils/http.js');
var mUtils = require('../../../../utils/util.js');
var mBusiLogin = require('../../../../busicode/busilogin.js');

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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //---得到navBar的高度----//
    var _navbarHeight = this.selectComponent("#NavBar").getNavBarHeight();
    this.setData({
      navbarHeight: _navbarHeight,
      octContentMarginTop: _navbarHeight + 8,
    });

    //------判断用户是否登录 没有登录 则跳转到指定URL 并设置UserID,LoginSha1-------//
    mBusiLogin.isLoginUserNavigateSetUserIDPwdSha1Global(res => {
      //console.log(res)

      //得到最新没有完成的提现信息ID
      this.recentNoFinishWithDrawID(() => {

      });


    }, false, "../../../../pages/login/bindmobile/bindmobile");


  },
  /**
   * 第一个图标导航 回退 
   */
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 第二个图标导航 
   */
  home: function () {
    wx.switchTab({
      url: '#',
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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

  /**
   * 得到最新没有完成的提现信息ID
   */
  recentNoFinishWithDrawID: function (pCallBack) {
    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "4",
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.vipApi_WithdrawSubmit, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined || _jsonReTxt == null) {
        return;
      }

      if (parseInt(_jsonReTxt.RecentNoFinishWithDrawID) != 0) {
        mUtils.redirectToURL("../../../../pages/buyer/vip/withdrawdetail/withdrawdetail?WDID=" + _jsonReTxt.RecentNoFinishWithDrawID);
        return;
      }
      //回调函数
      pCallBack();

    });
  },


})