// pages/buyer//setting/commonquestion/commonquestion.js
//==============引入相关的Js文件========//
var mHttp = require('../../../../utils/http.js');
var mUtils = require('../../../../utils/util.js');
var mBusiCookie = require('../../../../busicode/busicookie');

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
    loadQuestionList_Data: null, // 加载问题类型列表
    webViewSrcDomain: "", //OctWapWeb 手机Web端(公众号端)地址域名
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

    // 加载问题类型列表
    this.loadQuestionList();
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
   * 跳转到我的
   */
  home: function () {
    wx.switchTab({
      url: '../../../tabbar/buyerindex/buyerindex',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //=====================自定义函数==========================//


  /**
   *  加载问题类型列表
   */
  loadQuestionList: function () {

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
      "ExplainType": "Question",
      "ClearOrShowPropertyNameArr": "ExplainContent^IsLock^WriteDate^PageOrder"
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.buyerApi_OfficialService, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }


      //设置公共变量值
      this.setData({
        loadQuestionList_Data: _jsonReTxt,
        webViewSrcDomain: _jsonReTxt.WebViewSrcDomain,
      });

    });

  },

  /**
   * 跳转到WebView中
   */
  goToWebViewQuestion: function (e) {
    var _explainID = e.currentTarget.dataset.explainId;
    //设置WebView的Src cookie
    mBusiCookie.setWebViewSrcCookie(this.data.webViewSrcDomain + "/Buyer/QuestionDetail?EID=" + _explainID + "&TbDisplay=none");
    //跳转到webView页面
    mUtils.navigateToURL("../../../../pages/webviewpg/webviewPub/webviewPub");
  },


})