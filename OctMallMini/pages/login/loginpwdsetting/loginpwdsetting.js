// pages/login//loginpwdsetting/loginpwdsetting.js
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiLogin = require('../../../busicode/busilogin.js');

//------公共变量-----//
//定时器
var mTimer = null;
//计数器 以60开始
var mCountNum = 60;

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
    initgetUserAccMsgSimple_Data: null, //初始化用户账号信息(简单版)
    loginPwdNew: "", //新的登录密码
    //-------获取验证码------//
    isGetVerifyCode: false, //是否得到了验证码
    countNum: 0, //显示的计数秒
    bindMobile: "", //买家绑定的手机号
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

    //------判断用户是否登录 没有登录 则跳转到指定URL 并设置UserID,LoginSha1-------//
    mBusiLogin.isLoginUserNavigateSetUserIDPwdSha1Global(res => {
      //console.log(res)
      //初始化用户账号信息(简单版)
      this.initgetUserAccMsgSimple();

    }, false, "../../../pages/login/bindmobile/bindmobile");



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
   * 初始化用户账号信息(简单版)
   */
  initgetUserAccMsgSimple: function () {

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "3",
      "IsMaskMobile": "false",
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.settingApi_Index, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }


      //设置公共变量值
      this.setData({
        initgetUserAccMsgSimple_Data: _jsonReTxt,
        bindMobile: _jsonReTxt.BindMobile,
      });

    });


  },

  /**
   * 监听新密码的输入
   */
  bindInputLoginPwd: function (e) {
    var _detailVal = e.detail.value;
    //console.log(_payPwdNew);
    this.setData({
      loginPwdNew: _detailVal,
    });
  },

  /**
   * 监听短信验证码输入
   */
  bindInputSmsVerifyCode: function (e) {
    var _detailVal = e.detail.value;
    //console.log(_detailVal);
    this.setData({
      smsVerifyCode: _detailVal,
    });
  },


  /**
   * 重设登录密码
   */
  chgUserLoginPwd: function () {

    if (this.data.payPwdNew == "" || this.data.smsVerifyCode == "") {
      mUtils.showToast("【新的登录密码】和【短信验证码】不能为空！");
      return;
    }
    if (this.data.loginPwdNew.length < 6) {
      mUtils.showToast("登录密码必须6个字符以上！");
      return;
    }

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "4",
      "BindMobile": this.data.bindMobile,
      "LoginPwdNew": this.data.loginPwdNew,
      "SmsVerifyCode": this.data.smsVerifyCode,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.settingApi_Index, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }

      //重设失败
      if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
        mUtils.showToast(_jsonReTxt.ErrMsg);
        return;
      }
      //重设成功
      if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {

        mUtils.showToastCb(_jsonReTxt.Msg, function () {
          //清除登录Cookie
          mBusiLogin.clearLoginCookie();
          //跳转到登录页面
          mUtils.redirectToURL("../bindmobile/bindmobile");
        });

        return;
      }



    });

  },



  //================获取验证码 - 倒计时===============//
  /**
   * 得到短信验证码
   */
  getSmsVerifyCode: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
      "ToMobileNumbers": this.data.bindMobile,
      "SmsType": "ChgLoginPwd",
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




})