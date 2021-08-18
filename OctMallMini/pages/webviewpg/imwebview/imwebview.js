// pages/webviewpg/imwebview/imwebview.js
//==============引入相关的Js文件========//
var mUtils = require('../../../utils/util.js');
var mBusiCookie = require('../../../busicode/busicookie.js');


//创建全局App对象
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    webViewSrc: "", //WebView的URL
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (app.globalData.IsWebViewEnter == "false") {

      mUtils.confirmWin("小程序商城演示，暂未配置OctIm在线客服系统。请进入微信公众号OctShop查看演示，有疑问请咨询OctShop全栈工程师！", function (res) {
        wx.navigateBack({
          delta: 1,
        })
      });


    } else {
      //得到进入IM在线客服系统 的 URL
      mBusiCookie.getGoToImSysUrlCookie(_jsonReTxt => {

        //全局变量赋值
        this.setData({
          webViewSrc: _jsonReTxt,
        });

      });
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