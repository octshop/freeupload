// pages/buyer//officialservice/officialservice.js
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiLogin = require('../../../busicode/busilogin.js');
var mBusiCookie = require('../../../busicode/busicookie');

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
    loadServiceTel_Data: null, // 加载各种客服电话信息
    pubServiceTel: "", //电话客服号码
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

    // 如果用户登录啦，则设置全局的  loginBuyerUserID 和 loginPwdSha1 可根据这两个参数是否为空，判断是否用户登录
    mBusiLogin.setLoginBuyerUserIDPwdSha1Global(res => {
      //用户已登录的状态
      if (res != "") {}
    });

    //加载各种客服电话信息
    this.loadServiceTel();
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
   * 加载各种客服电话信息
   */
  loadServiceTel: function () {

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
      "ExplainType": "ServiceTel",
      "ClearOrShowPropertyNameArr": "IsLock^WriteDate^PageOrder"
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.buyerApi_OfficialService, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }

      //循环格式化数据
      for (var i = 0; i < _jsonReTxt.ExplainTextList.length; i++) {
        if (_jsonReTxt.ExplainTextList[i].ExplainTitle == "客服电话") {
          this.setData({
            pubServiceTel: _jsonReTxt.ExplainTextList[i].ExplainContent
          });
          break
        }

      }

      //设置公共变量值
      this.setData({
        loadServiceTel_Data: _jsonReTxt,
      });

    });
  },

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
    mUtils.navigateToURL("../../../pages/webviewpg/webviewPub/webviewPub");
  },

  //=====================公共函数==========================//

  /**
   * 拨打电话
   * @param {} e 
   */
  makePhoneCall: function (e) {
    //console.log(e.target.dataset.phoneNumber)
    var _dataSet = e.currentTarget.dataset;
    //拨打电话
    mUtils.makePhoneCall(_dataSet.phoneNumber);
  },

  /**
   * 跳转到页面 navigate
   * @param {} e 
   */
  navigateToURL: function (e) {
    console.log(e);
    var _dataSet = e.currentTarget.dataset;

    var _openType = _dataSet.openType;

    if (_openType == "navigate") {
      //跳转
      mUtils.navigateToURL(_dataSet.navigateUrl);
    } else if (_openType == "redirect") {
      mUtils.redirectToURL(_dataSet.navigateUrl);
    } else {
      //跳转
      mUtils.navigateToURL(_dataSet.navigateUrl);
    }

  },


  //=====================在线客服接入==========================//

  /**
   * 构建【商家店铺】咨询进入IM在线客服系统 跳转 URL
   */
  buildBuyerGoToImSysURL_ShopWap: function () {
    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "3",
      "MallOfficialIMShopUserID": "88888888888888888",
      "BuyerUserID": app.globalData.loginBuyerUserID,
      "VisitorMemo": "商城平台官方在线客服"
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.imSysApi_Index, _dataPOST, _jsonReTxt => {

      if (_jsonReTxt != "") {
        //设置跳转到 IM在线客服系统 的 URL cookie值
        mBusiCookie.saveGoToImSysUrlCookie(_jsonReTxt);
        //跳转到IM在线客服系统 WebView页
        mUtils.navigateToURL("../../../pages/webviewpg/imwebview/imwebview");
      } else {
        //直接拨打店铺客服电话
        mUtils.makePhoneCall(this.data.initAsOrderGoodsMsg_Data.ShopMobile);
      }

    });
  },




})