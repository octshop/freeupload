// pages/shop/activity/activity.js
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiLogin = require('../../../busicode/busilogin.js');
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
    loadActivityPageMsg_Data: null, //加载店铺活动信息,活动，抽奖
    loadShopCouponsTopList_Data: null, //加载优惠券指定记录条数
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
    //加载活动页信息 ,活动，抽奖
    this.loadActivityPageMsg();
    //加载优惠券指定记录条数
    this.loadShopCouponsTopList();
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
   * 买家获取优惠券 单个获取
   */
  buyerGetCoupons: function (e) {

    console.log(e.currentTarget.dataset);
    var pCouponsID = e.currentTarget.dataset.couponsId;

    //判断买家是否登录 
    mBusiLogin.isLoginUserNavigate(res => {

      if (res == "") {
        return;
      }

      //获取用户登录信息 --异步函数
      mBusiLogin.getLoginCookieAsyn(res => {

        //构造POST参数
        var _dataPOST = {
          "SignKey": mHttp.signKeyRsa(res.UserID, res.LoginPwdSha1),
          "Type": "4",
          "CouponsID": pCouponsID,
          "BuyerUserID": res.UserID,
        };

        //正式发送Http请求
        mHttp.postHttp(app.apiURLData.shopApi_Index, _dataPOST, _jsonReTxt => {
          console.log(_jsonReTxt);

          if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
            mUtils.showToast(_jsonReTxt.ErrMsg, 1500, false);
          }
          if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
            mUtils.showToast(_jsonReTxt.Msg, 1500, false);
          }

        });

      });

    }, false, "", "../../../pages/shop/activity/activity^SID~" + this.data.shopID);

  },

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
   * 加载活动页信息 ,活动，抽奖
   */
  loadActivityPageMsg: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "1",
      "ShopID": this.data.shopID,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.shopApi_Activity, _dataPOST, res => {


      //-----设置公共变量-----//
      this.setData({
        loadActivityPageMsg_Data: res,
      });

    });

  },
  /**
   *  加载优惠券指定记录条数
   */
  loadShopCouponsTopList: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "3",
      "ShopID": this.data.shopID,
      "LoadNum": "20",
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.shopApi_Index, _dataPOST, res => {

      if (res != "") {
        //处理返回数据
        for (var i = 0; i < res.CouponsMsgList.length; i++) {
          res.CouponsMsgList[i].UseTimeRange = res.CouponsMsgList[i].UseTimeRange.replace("^", "至");
        }
      }

      //-----设置公共变量-----//
      this.setData({
        loadShopCouponsTopList_Data: res,
      });

    });

  },
  //====================公共函数========================//
  /**
   * 跳转到页面 navigate
   * @param {} e 
   */
  navigateToURL: function (e) {
    var _dataSet = e.currentTarget.dataset;
    console.log(e);
    //跳转
    mUtils.navigateToURL(_dataSet.navigateUrl);
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