// pages/shop//aggregate/index/index.js
//==============引入相关的Js文件========//
var mHttp = require('../../../../utils/http.js');
var mUtils = require('../../../../utils/util.js');
var mBusiLogin = require('../../../../busicode/busilogin.js');

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
    shopId: "", //店铺ID
    loadShopMsgSimple_Data: "", //加载店铺简单信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //---得到navBar的高度----//
    var _navbarHeight = this.selectComponent("#NavBar").getNavBarHeight();
    this.setData({
      navbarHeight: _navbarHeight,
      octContentMarginTop: _navbarHeight
    });

    //----获取传递的参数赋值-----//
    var _shopId = options.SID;
    if (_shopId == undefined || _shopId == null || _shopId == "") {
      //获取场景值
      const scene = decodeURIComponent(query.scene);
      if (scene != undefined && scene != null && scene != "") {
        _shopId = scene;
      } else {
        _shopId = "";
      }
    }
    if (_shopId == undefined || _shopId == null || _shopId == "") {
      mUtils.switchTabURL("../../../../pages/tabbar/index/index");
      return;
    }

    this.setData({
      shopId: _shopId,
    });

    //判断用户是否登录 没有登录 则跳转到指定URL 并设置UserID,LoginSha1
    mBusiLogin.isLoginUserNavigateSetUserIDPwdSha1Global(res => {
      console.log(res)

      //加载店铺简单信息
      this.loadShopMsgSimple();

    }, false, "../../../login/bindmobile/bindmobile", "../../../pages/shop/aggregate/index/index^SID~" + this.data.shopId);


    //-------自定义方法--------//




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
   * 第二个按钮
   */
  home: function () {
    wx.navigateTo({
      url: '../../../../pages/shop/index/index?SID=' + this.data.shopId,
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //===================自定义函数===================//

  /**
   * 加载店铺简单信息
   */
  loadShopMsgSimple: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "1",
      "ShopID": this.data.shopId,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.aggregateApi_Index, _dataPOST, res => {

      //----设置公共变量 ----//
      this.setData({
        loadShopMsgSimple_Data: res,
      });

    });


  },



  //===================公共函数===================//

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