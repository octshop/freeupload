// pages/shop//aggregate/paybalance/paybalance.js
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
    shopUserId: "", //商家UserID
    orderPrice: 0, //支付金额
    loadShopMsgSimple_Data: "", //加载店铺简单信息
    initCurrentBalance_Data: null, //得到用户当前的可用余额
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

    //获取传递的参数
    var _shopId = options.SID;
    if (_shopId == "" || _shopId == undefined) {
      mUtils.switchTabURL("../../../../pages/tabbar/index/index");
      return;
    }
    this.setData({
      shopId: _shopId,
    });

    //----------调用自定义函数--------------//

    // 如果用户登录啦，则设置全局的  loginBuyerUserID 和 loginPwdSha1 可根据这两个参数是否为空，判断是否用户登录
    mBusiLogin.setLoginBuyerUserIDPwdSha1Global(res => {
      //用户已登录的状态
      if (res != "") {

        //------登录后的调用函数-----//

        //得到用户当前的可用余额
        this.initCurrentBalance();


      }
    });


    //加载店铺简单信息
    this.loadShopMsgSimple();

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

  //===================自定义方法===================//

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

      //设置其他数据
      this.setData({
        shopUserId: res.UserID,
      });

      //----设置公共变量 ----//
      this.setData({
        loadShopMsgSimple_Data: res,
      });

    });

  },

  /**
   * 得到用户当前的可用余额
   */
  initCurrentBalance: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.vipApi_Index, _dataPOST, res => {

      //----设置公共变量 ----//
      this.setData({
        initCurrentBalance_Data: res,
      });

    });

  },

  /**
   * 立即余额支付
   */
  payAggregateOrder: function () {

    if (this.data.shopUserId == "" || this.data.shopUserId == undefined) {
      return;
    }

    if (this.data.orderPrice <= 0 || isNaN(this.data.orderPrice)) {
      mUtils.showToast("支付金额必须是数字且大于零！");
      return;
    }

    if (parseFloat(this.data.orderPrice) > parseFloat(this.data.initCurrentBalance_Data.CurrentBalance)) {
      mUtils.showToast("可用余额不足，不能支付！");
      return;
    }

    mUtils.confirmWin("确认支付？", res => {
      if (res == "Ok") {



        //构造POST参数
        var _dataPOST = {
          "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
          "Type": "1",
          "OrderPrice": this.data.orderPrice,
          "ShopUserID": this.data.shopUserId,
          "PayWay": "Balance",
        };
        //加载提示
        mUtils.showLoadingWin("支付中");
        //正式发送Http请求
        mHttp.postHttp(app.apiURLData.aggregateApi_PayDirect, _dataPOST, _jsonReTxt => {
          //移除加载提示
          mUtils.hideLoadingWin();

          if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
            mUtils.showToast(_jsonReTxt.ErrMsg);
            return;
          }

          if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
            //跳转到支付成功
            mUtils.navigateToURL("../../../buyer/paysunoorder/paysunoorder");
            return;
          }


        });

        
      }
    });

  },

  /**
   * 监听支付金额值
   * @param {*} e 
   */
  bindInputOrderPrice(e) {
    var _detailVal = e.detail.value;
    this.setData({
      orderPrice: _detailVal,
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