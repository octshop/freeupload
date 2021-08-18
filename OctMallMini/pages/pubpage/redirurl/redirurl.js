// pages/pubpage/redirurl/redirurl.js
//==============引入相关的Js文件========//
var mUtils = require('../../../utils/util.js');
var mBusiCookie = require('../../../busicode/busicookie.js');

//------初始化APP对象-----//
var app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取传递的参数
    var _rediType = options.RdType;
    if (_rediType == undefined || _rediType == "" || _rediType == null) {
      return;
    }

    //跳转到商家入驻相关页
    if (_rediType == "ShopEnter") {

      //设置WebView的Src cookie
      mBusiCookie.setWebViewSrcCookie(app.globalData.octWapWebDoamin + "/Buyer/QuestionDetail?EType=ShopEnter&ETitle=商家入驻&TbDisplay=none");
      //跳转到webView页面
      mUtils.redirectToURL("../../../pages/webviewpg/webviewPub/webviewPub");

    }


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  }
})