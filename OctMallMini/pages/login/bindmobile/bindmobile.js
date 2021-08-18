const mBusiLogin = require('../../../busicode/busilogin.js');
// pages/login/bindmobile/bindmobile.js
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mLogin = require('../../../utils/wxloginuserinfo.js');
var mBusiCookie = require('../../../busicode/busicookie.js');

//------公共变量-----//
var mBackURL = "";
//获取连接传递的推广者信息 二维码内容  BuyerUserID ^ LoginPwdNoSha1 ^ PromoteUser  RSA加密的
var mPQRCRSA = "";

//------初始化APP对象-----//
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    apiWebDoamin: app.globalData.apiWebDoamin, //小程序Api的网站域名
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取回退的URL
    if (options.BackURL == undefined || options.BackURL == "") {
      mBackURL = "";
    } else {
      mBackURL = options.BackURL;
    }
    mUtils.logOut("mBackURL=" + mBackURL);

    //--------获取传递的参数--------//
    var _PQRCRSA = options.PQRCRSA;
    if (_PQRCRSA != undefined && _PQRCRSA != "") {
      mPQRCRSA = _PQRCRSA;
    }
    if (_PQRCRSA == undefined || _PQRCRSA == "") {
      mPQRCRSA = "";
    }
    mUtils.logOut("mPQRCRSA=" + mPQRCRSA);
    //设置 - 分享好友链接-PQRCRSA的Cookie
    mBusiCookie.setPQRCRSACookie(mPQRCRSA);

    //---------AppID(小程序ID) 是否可以获取 用户手机号---------//
    this.wxMiniIsGetUserMobile();




  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //================自定义函数======================//

  /**
   * AppID(小程序ID) 是否可以获取 用户手机号
   */
  wxMiniIsGetUserMobile: function () {

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "1",
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.loginApi_Index, _dataPOST, _jsonReTxt => {

      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        mUtils.redirectToURL("../buyerlogin/buyerlogin?BackURL=" + mBackURL);
        return;
      }
      if (_jsonReTxt.WxMiniIsGetUserMobile == "false") {
        mUtils.redirectToURL("../buyerlogin/buyerlogin?BackURL=" + mBackURL);
        return;
      }

    });

  },

  /**
   * 获取用户手机号
   * @param {}} e 
   */
  getPhoneNumber: function (e) {
    console.log(e);
    //得到小程序 用户手机号
    mLogin.getPhoneNumberAsyn(e, res => {
      //手机号
      console.log(res);
      if (res != "") {
        //获取到了用户号

        //显示加载提示
        mUtils.showLoadingWin("加载中");

        //小程序 注册或登录 用户信息
        mBusiLogin.loginRegUserMobileMini(res, jsonReTxt => {

          //移除加载提示
          mUtils.hideLoadingWin();

          if (jsonReTxt.Msg != "" && jsonReTxt.Msg != null && jsonReTxt.Msg != undefined) {

            if (mBackURL != "") {
              //格式化，回跳的URL字符串，把 ^ 换成 ?  把 ~ 换成 = 把 & 换成 |
              mBackURL = mUtils.formatBackURLParamChar(mBackURL);
              console.log("登录后跳转mBackURL=" + mBackURL);
              mUtils.redirectToURL(mBackURL);
            } else {
              mUtils.switchTabURL("../../../pages/tabbar/buyerindex/buyerindex");
            }

            //登录成功
            return;
          }
          //显示错误提示
          mUtils.showToast(jsonReTxt.ErrMsg + ",请重试！");
          return;

        }, false,mPQRCRSA);


      }
    });
  },

  //====================公共函数========================//
  /**
   * 跳转到页面 navigate
   * @param {} e 
   */
  navigateSwitchToURL: function (e) {
    var _dataSet = e.currentTarget.dataset;
    console.log(e);
    if (_dataSet.openTypeUrl == "switchTab") {
      //跳转
      mUtils.switchTabURL(_dataSet.navigateUrl);
      return;
    }
    //跳转
    mUtils.navigateToURL(_dataSet.navigateUrl);
  },
})