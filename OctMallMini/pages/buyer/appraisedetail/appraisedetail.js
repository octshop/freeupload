// pages/buyer//appraisedetail/appraisedetail.js
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
    //-----------------自定义变量-------------//
    orderId: "", //订单ID
    goodsIDArr: "", //商品ID拼接字符串 "^"
    initOrderGoodsMsg_Data: null, //初始化订单商品信息
    initOrderGoodsShopAppraise_Data: null, // 初始化 订单的商品评价信息，包括商品评价，晒单评价，店铺评价
    initAppraiseShopIntegralSetting_Data: null, //初始化商品评价晒单的返积分信息
    preImgUrlArr: null, //浏览图片的URL数组
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

    //----------获取传递的参数-----------//
    var _orderId = options.OID;
    if (_orderId == undefined || _orderId == null) {
      _orderId = "";
    }
    this.setData({
      orderId: _orderId,
    });

    //--------调用自定义函数----------//

    //判断用户是否登录 没有登录 则跳转到指定URL 并设置UserID,LoginSha1
    mBusiLogin.isLoginUserNavigateSetUserIDPwdSha1Global(res => {
      //console.log(res)
      //------登录成功后的调用函数-------//

      //初始化订单商品信息
      this.initOrderGoodsMsg();
      //初始化 订单的商品评价信息，包括商品评价，晒单评价，店铺评价
      this.initOrderGoodsShopAppraise();

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

  //===================自定义函数=========================//

  /**
   * 初始化订单商品信息
   */
  initOrderGoodsMsg: function () {

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
      "OrderID": this.data.orderId,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.buyerApi_AppraiseForm, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }

      var _goodsIDArr = ""; //商品拼接字符串
      for (var i = 0; i < _jsonReTxt.OrderGoodsList.length; i++) {
        //商品ID拼接
        _goodsIDArr += _jsonReTxt.OrderGoodsList[i].GoodsID + "^";
      }
      _goodsIDArr = mUtils.removeFrontAndBackChar(_goodsIDArr, "^");

      this.setData({
        initOrderGoodsMsg_Data: _jsonReTxt,
        goodsIDArr: _goodsIDArr,
      });

      //初始化商品评价晒单的返积分信息
      this.initAppraiseShopIntegralSetting();

    });

  },

  /**
   * 初始化 订单的商品评价信息，包括商品评价，晒单评价，店铺评价
   */
  initOrderGoodsShopAppraise: function () {

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
      "OrderID": this.data.orderId,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.buyerApi_AppraiseDetail, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }

      //--------构造数组---------// 
      var _preImgUrlArr = new Array();
      for (var i = 0; i < _jsonReTxt.GooAppraiseImgsList.length; i++) {
        _preImgUrlArr[i] = _jsonReTxt.GooAppraiseImgsList[i].ImgUrl;
      }


      this.setData({
        initOrderGoodsShopAppraise_Data: _jsonReTxt,
        preImgUrlArr: _preImgUrlArr,
      });

    });


  },

  /**
   * 初始化商品评价晒单的返积分信息
   */
  initAppraiseShopIntegralSetting: function () {

    if (this.data.goodsIDArr == "" || this.data.goodsIDArr == null) {
      return;
    }

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "3",
      "GoodsIDArr": this.data.goodsIDArr,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.buyerApi_AppraiseForm, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }

      this.setData({
        initAppraiseShopIntegralSetting_Data: _jsonReTxt,
      });

    });

  },


  //==================公共函数============//

  /**
   * 显示图片预览组件
   * @param {*} e 
   */
  previewImg: function (e) {

    var _dataSet = e.currentTarget.dataset;

    console.log(this.data.preImgUrlArr);
    console.log(_dataSet.preIndex);

    //得到项目的协议头名称
    var _httpName = mUtils.getHttpProtocolURL(app.globalData.apiWebDoamin);
    var _preImgUrlArr = this.data.preImgUrlArr;

    for (var i = 0; i < _preImgUrlArr.length; i++) {
      if (_preImgUrlArr[i].indexOf("http") < 0) {
        _preImgUrlArr[i] = _httpName + _preImgUrlArr[i];
      }
    }

    mUtils.previewImg(_preImgUrlArr, _dataSet.preIndex);
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




})