// pages/login//bindmobilechg/bindmobilechg.js
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiLogin = require('../../../busicode/busilogin.js');
const busilogin = require('../../../busicode/busilogin.js');

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
   * 监听绑定手机号的输入
   */
  bindInputBindMobile: function (e) {
    var _detailVal = e.detail.value;
    this.setData({
      bindMobile: _detailVal,
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
   * 正式绑定手机号
   */
  bindBuyerMobile: function () {

    if (this.data.bindMobile == "" || this.data.smsVerifyCode == "") {
      mUtils.showToast("【手机号】和【短信验证码】不能为空！");
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
      "ToMobileNumber": this.data.bindMobile,
      "SmsVerifyCode": this.data.smsVerifyCode,
    };
    //加载提示
    mUtils.showLoadingWin("绑定中");
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.settingApi_Index, _dataPOST, _jsonReTxt => {
      //移除加载提示
      mUtils.hideLoadingWin();
      if (_jsonReTxt == "" || _jsonReTxt == undefined || _jsonReTxt == null) {
        return;
      }

      //错误提示
      if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
        //手机号已被绑定，请先登录冻结此手机账号，再进行绑定！
        if (_jsonReTxt.ErrCode == "EBM_01_02") {
          mUtils.showToast("此手机号已被绑定！");
          return;
        } else {
          mUtils.showToast(_jsonReTxt.ErrMsg, 4000);
          return;
        }
      }
      //成功
      if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
        mUtils.showToastCb(_jsonReTxt.Msg, () => {
          mUtils.switchTabURL("../../../pages/tabbar/buyerindex/buyerindex");
        });
        return;
      }



    });
  },

  /**
   * 处理手机号被绑定并且存在第三方注册信息 - 【有微信小程序 OPENDID，没有微信公众号OPENDID 】
   */
  proBindMobileMiniOpenIDNoWxOpenID: function (pLoginUserID, pBindMobile) {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "4",
      "LoginUserID": pLoginUserID,
      "BindMobile": pBindMobile,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.loginApi_Buyer, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined || _jsonReTxt == null) {
        return;
      }

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
      "SmsType": "BindMobile",
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