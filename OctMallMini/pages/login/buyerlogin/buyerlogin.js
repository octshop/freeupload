// pages/login//buyerlogin/buyerlogin.js
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiCode = require('../../../busicode/busicode');
var mBusiLogin = require('../../../busicode/busilogin.js');
var mBusiCookie = require('../../../busicode/busicookie.js');

//------公共变量-----//
//定时器
var mTimer = null;
//计数器 以60开始
var mCountNum = 60;
//获取连接传递的推广者信息 二维码内容  BuyerUserID ^ LoginPwdNoSha1 ^ PromoteUser  RSA加密的
var mPQRCRSA = "";
//返回URL
var mBackURL = "";

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

    //-------获取验证码------//
    isGetVerifyCode: false, //是否得到了验证码
    countNum: 0, //显示的计数秒
    bindMobile: "", //买家绑定的手机号
    smsVerifyCode: "", //短信验证码
    wxMiniIsGetUserMobile: "false", //是否可以获取用户手机号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //---得到navBar的高度----//
    var _navbarHeight = this.selectComponent("#NavBar").getNavBarHeight();
    this.setData({
      navbarHeight: _navbarHeight,
      octContentMarginTop: _navbarHeight + 8,
    });

    //----获取传递的参数----//
    if (options.BackURL == undefined || options.BackURL == "") {
      mBackURL = "";
    } else {
      mBackURL = options.BackURL;
    }
    mUtils.logOut("mBackURL=" + mBackURL);

    //----获取分享好友链接-PQRCRSA的Cookie----//
    mBusiCookie.getPQRCRSACookie(res => {
      if (res == undefined || res == null) {
        return;
      }
      mPQRCRSA = res;
      mUtils.logOut("mPQRCRSA111=" + mPQRCRSA);
    });


    // AppID(小程序ID) 是否可以获取 用户手机号
    this.wxMiniIsGetUserMobile();



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
      url: '../../tabbar/index/index',
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //=====================自定义函数==========================//

  /**
   * 监听绑定手机号的输入
   */
  bindInputBindMobile: function (e) {
    var _detailVal = e.detail.value;
    this.setData({
      bindMobile: _detailVal.trim(),
    });
  },

  /**
   * 监听短信验证码输入
   */
  bindInputSmsVerifyCode: function (e) {
    var _detailVal = e.detail.value;
    //console.log(_detailVal);
    this.setData({
      smsVerifyCode: _detailVal.trim(),
    });
  },

  /**
   * 买家手机号登录请求
   */
  loginBuyerMobile: function () {


    if (this.data.bindMobile == "" || this.data.smsVerifyCode == "") {
      mUtils.showToast("【手机号】和【短信验证码】不能为空！");
      return;
    }
    //验证手机号是否成功
    var _isCheckMobile = mUtils.checkMobileNumber(this.data.bindMobile);
    if (_isCheckMobile == false) {
      mUtils.showToast("【手机号】错误！");
      return;
    }

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
      "ToMobileNumber": this.data.bindMobile,
      "SmsVerifyCode": this.data.smsVerifyCode,
      "PQRCRSA": mPQRCRSA,
    };
    //加载提示
    mUtils.showLoadingWin("登录中");
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.loginApi_Buyer, _dataPOST, _jsonReTxt => {
      //移除加载提示
      mUtils.hideLoadingWin();
      if (_jsonReTxt == "" || _jsonReTxt == undefined || _jsonReTxt == null) {
        return;
      }
      //错误提示
      if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
        mUtils.showToast(_jsonReTxt.ErrMsg);
        return;
      }
      //登录提示
      if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {

        //清除之前的登录信息
        mBusiLogin.clearLoginCookie();
        //设置全局变量中的 buyerMiniOpenID
        mBusiLogin.setAppMiniOpenID();
        //写入登录Cookie
        //保存用户登录信息
        mBusiLogin.setLoginCookieSHA1(_jsonReTxt.DataDic.RegUserID, _jsonReTxt.DataDic.LoginKey);


        if (mBackURL != "") {
          //格式化，回跳的URL字符串，把 ^ 换成 ?  把 ~ 换成 = 把 & 换成 |
          mBackURL = mUtils.formatBackURLParamChar(mBackURL);
          console.log("登录后跳转mBackURL=" + mBackURL);
          mUtils.redirectToURL(mBackURL);
        } else {
          mUtils.switchTabURL("../../../pages/tabbar/buyerindex/buyerindex");
        }

        return;
      }




    });


  },


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
        this.setData({
          wxMiniIsGetUserMobile: "false",
        });
        return
      }

      this.setData({
        wxMiniIsGetUserMobile: _jsonReTxt.WxMiniIsGetUserMobile,
      });


    });

  },




  //================获取验证码 - 倒计时===============//
  /**
   * 得到短信验证码
   */
  getSmsVerifyCode: function () {

    //判断手机号是否为空，是否正确
    if (this.data.bindMobile == "") {
      mUtils.showToast("手机号不能为空！");
      return;
    }
    var _isCheckMobile = mUtils.checkMobileNumber(this.data.bindMobile);
    if (_isCheckMobile == false) {
      mUtils.showToast("手机号错误！");
      return;
    }

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
      "ToMobileNumbers": this.data.bindMobile,
      "SmsType": "Login",
    };
    //加载提示
    mUtils.showLoadingWin("获取中");
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.smsApi_Index, _dataPOST, _jsonReTxt => {
      //移除加载提示
      mUtils.hideLoadingWin();
      if (_jsonReTxt == "" || _jsonReTxt == undefined || _jsonReTxt == null) {
        return;
      }
      //设置公共变量值
      this.setData({
        getSmsVerifyCode_Data: _jsonReTxt,
        isGetVerifyCode: true,
      });

      //-----开启定时器-----//
      this.timerSecond(res => {
        if (res == "end") {
          this.setData({
            isGetVerifyCode: false,
          });
        }
        //设置计数器
        this.setData({
          countNum: mCountNum
        });
      });
      //-----开启定时器-----//



    });


  },

  /**
   * 启动定时器
   * */
  timerSecond: function (pCallBack) {

    clearInterval(mTimer);
    mTimer = null;
    mTimer = undefined;

    mTimer = setInterval(function () {

      if (mCountNum <= 0) {
        clearInterval(mTimer);
        mTimer = null;
        mTimer = undefined;

        //重置计数器
        mCountNum = 60;

        pCallBack('end');
        return
      }

      mCountNum--;
      //$("#TimerSecondI").html(mCountNum + "秒");
      pCallBack('timering');

    }, 1000);

  },

  //==================公共函数============//
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