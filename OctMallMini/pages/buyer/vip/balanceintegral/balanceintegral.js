// pages/buyer//vip/balanceintegral/balanceintegral.js
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
    //-----------------自定义变量-------------//
    loadBuyerAllCurBalanceIntegral_Data: null, //得到买家所有的余额和积分信息
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

    }, false, "../../../../pages/login/bindmobile/bindmobile");

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
   * 将买家当前所有的【分润余额】转入【账户余额】
   */
  transDividendToAccBalance: function () {

    //当前的分润余额
    var _curBalanceDividend = parseFloat(this.data.loadBuyerAllCurBalanceIntegral_Data.CurBalanceDividend);

    if (_curBalanceDividend <= 0) {
      mUtils.showToast("分润余额为零,不能转入！");
      return;
    }

    mUtils.confirmWin("确定要转入吗？", res => {
      if (res == "Ok") {

        //构造POST参数
        var _dataPOST = {
          "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
          "Type": "1",
        };
        //加载提示
        mUtils.showLoadingWin("转入中");

        //正式发送Http请求
        mHttp.postHttp(app.apiURLData.vipApi_BalanceIntegral, _dataPOST, _jsonReTxt => {
          //移除加载提示
          mUtils.hideLoadingWin();
          if (_jsonReTxt == "" || _jsonReTxt == undefined || _jsonReTxt == null) {
            return;
          }

          if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
            mUtils.showToast(_jsonReTxt.ErrMsg);
            return;
          }

          if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
            mUtils.showToast(_jsonReTxt.Msg);
            //重新加载数据
            this.loadBuyerAllCurBalanceIntegral();
            return;
          }
        });
      }
    });

  },

  /**
   * 将买家当前所有的【分润积分】转入【账户积分】
   */
  transDividendToAccIntegral: function () {

    //当前的分润积分
    var _CurIntegralDividend = parseFloat(this.data.loadBuyerAllCurBalanceIntegral_Data.CurIntegralDividend);

    if (_CurIntegralDividend <= 0) {
      mUtils.showToast("分润积分为零,不能转入！");
      return;
    }

    mUtils.confirmWin("确定要转入吗？", res => {
      if (res == "Ok") {

        //构造POST参数
        var _dataPOST = {
          "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
          "Type": "2",
        };
        //加载提示
        mUtils.showLoadingWin("转入中");

        //正式发送Http请求
        mHttp.postHttp(app.apiURLData.vipApi_BalanceIntegral, _dataPOST, _jsonReTxt => {
          //移除加载提示
          mUtils.hideLoadingWin();
          if (_jsonReTxt == "" || _jsonReTxt == undefined || _jsonReTxt == null) {
            return;
          }

          if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
            mUtils.showToast(_jsonReTxt.ErrMsg);
            return;
          }

          if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
            mUtils.showToast(_jsonReTxt.Msg);
            //重新加载数据
            this.loadBuyerAllCurBalanceIntegral();
            return;
          }
        });
      }
    });



  },



})