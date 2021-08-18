// pages/buyer/vip/withdrawsubmit/withdrawsubmit.js
//==============引入相关的Js文件========//
var mHttp = require('../../../../utils/http.js');
var mUtils = require('../../../../utils/util.js');
var mBusiLogin = require('../../../../busicode/busilogin.js');

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
    toType: "", ///提现到什么地方 ( 微信钱包 WeChat， 支付宝 Alipay ，银行卡 Bank )
    isGetVerifyCode: false, //是否得到了验证码
    countNum: 0, //显示的计数秒
    bindMobile: "", //买家绑定的手机号
    getBuyerCurrentBalance_Data: null, //得到当前买家的余额
    getUserAccWeiXinMsg_Data: null, //获取账户微信注册信息
    loadPreBuyerWithDraw_Data: null, //预加载买家以前最近的提现信息
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

    //获取传递的参数
    var _toType = options.ToType;
    //console.log(_toType);
    this.setData({
      toType: _toType,
    });

    //------判断用户是否登录 没有登录 则跳转到指定URL 并设置UserID,LoginSha1-------//
    mBusiLogin.isLoginUserNavigateSetUserIDPwdSha1Global(res => {
      //console.log(res)

      //得到最新没有完成的提现信息ID
      this.recentNoFinishWithDrawID(() => {

        //得到当前买家的余额
        this.getBuyerCurrentBalance();
        //获取账户微信注册信息
        this.getUserAccWeiXinMsg();
        //预加载买家以前最近的提现信息
        this.loadPreBuyerWithDraw();

      });


    }, false, "../../../../pages/login/bindmobile/bindmobile");


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
   * 第二个图标导航 
   */
  home: function () {
    wx.switchTab({
      url: '#',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //=====================自定义函数==========================//

  /**
   * 得到最新没有完成的提现信息ID
   */
  recentNoFinishWithDrawID: function (pCallBack) {
    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "4",
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.vipApi_WithdrawSubmit, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined || _jsonReTxt == null) {
        return;
      }

      if (parseInt(_jsonReTxt.RecentNoFinishWithDrawID) != 0) {
        mUtils.navigateToURL("../../../../pages/buyer/vip/withdrawdetail/withdrawdetail?WDID=" + _jsonReTxt.RecentNoFinishWithDrawID);
        return;
      }
      //回调函数
      pCallBack();

    });
  },

  /**
   * 得到当前买家的余额
   */
  getBuyerCurrentBalance: function () {
    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "2",
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.vipApi_WithdrawSubmit, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined || _jsonReTxt == null) {
        return;
      }

      //设置公共变量值
      this.setData({
        getBuyerCurrentBalance_Data: _jsonReTxt
      });
    });
  },

  /**
   * 获取账户微信注册信息
   */
  getUserAccWeiXinMsg: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.vipApi_WithdrawSubmit, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined || _jsonReTxt == null) {
        return;
      }

      var _bindMobile = _jsonReTxt.BindMobile;
      _jsonReTxt.BindMobile = mUtils.maskMobileNumber(_jsonReTxt.BindMobile);

      //设置公共变量值
      this.setData({
        getUserAccWeiXinMsg_Data: _jsonReTxt,
        bindMobile: _bindMobile,
      });
    });

  },

  /**
   * 预加载买家以前最近的提现信息
   */
  loadPreBuyerWithDraw: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "6",
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.vipApi_WithdrawSubmit, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined || _jsonReTxt == null) {
        return;
      }

      //设置公共变量值
      this.setData({
        loadPreBuyerWithDraw_Data: _jsonReTxt
      });
    });


  },

  /**
   * 得到短信验证码
   */
  getSmsVerifyCode: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
      "ToMobileNumbers": this.data.bindMobile,
      "SmsType": "BuyerWithDraw",
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
   * 提交表单
   * @param {}} e 
   */
  formSubmit: function (e) {
    console.log(e);

    var _detailVal = e.detail.value;

    var WithDrawAmt = _detailVal.WithDrawAmt
    var TrueName = _detailVal.TrueName
    var LinkMobile = _detailVal.LinkMobile
    var WeChatAccount = _detailVal.WeChatAccount
    var AlipayAccount = _detailVal.AlipayAccount
    var BankCardNumber = _detailVal.BankCardNumber
    var BankAccName = _detailVal.BankAccName
    var OpeningBank = _detailVal.OpeningBank
    var VerifyCode = _detailVal.VerifyCode
    var LinkMobileBank = _detailVal.LinkMobileBank

    if (WithDrawAmt == undefined) {
      WithDrawAmt = "";
    }
    if (TrueName == undefined) {
      TrueName = "";
    }
    if (LinkMobile == undefined) {
      LinkMobile = "";
    }
    if (WeChatAccount == undefined) {
      WeChatAccount = "";
    }
    if (AlipayAccount == undefined) {
      AlipayAccount = "";
    }
    if (BankCardNumber == undefined) {
      BankCardNumber = "";
    }
    if (BankAccName == undefined) {
      BankAccName = "";
    }
    if (OpeningBank == undefined) {
      OpeningBank = "";
    }
    if (VerifyCode == undefined) {
      VerifyCode = "";
    }
    if (LinkMobileBank == undefined) {
      LinkMobileBank = "";
    }

    if (LinkMobile == "" || LinkMobile == undefined) {
      LinkMobile = LinkMobileBank;
    }

    //提交添加用户提现请求
    this.addBuyerWithDraw(WithDrawAmt, TrueName, LinkMobile, WeChatAccount, AlipayAccount, BankCardNumber, BankAccName, OpeningBank, VerifyCode);


  },

  /**
   * 提交添加用户提现请求
   */
  addBuyerWithDraw: function (pWithDrawAmt, pTrueName, pLinkMobile, pWeChatAccount, pAlipayAccount, pBankCardNumber, pBankAccName, pOpeningBank, pVerifyCode) {

    //判断输入是否合法
    if (parseFloat(pWithDrawAmt) <= 0 || pWithDrawAmt == "") {
      mUtils.showToast("提现金额必须大于零！");
      return;
    }

    if (this.data.toType != "Bank") {
      if (pTrueName == "" || pLinkMobile == "") {
        mUtils.showToast("【真实姓名】和【联系电话】不能为空！");
        return;
      }
    }

    if (pVerifyCode == "") {
      mUtils.showToast("【短信验证码】不能为空！");
      return;
    }

    //判断手机号是否正确
    var _ischeckMobile = mUtils.checkMobileNumber(pLinkMobile);
    if (_ischeckMobile == false) {
      mUtils.showToast("联系手机号错误！");
      return;
    }

    //提现到什么地方 ( 微信钱包 WeChat， 支付宝 Alipay ，银行卡 Bank )
    if (this.data.toType == "WeChat") {
      if (pWeChatAccount == "") {
        mUtils.showToast("【微信号】不能为空！");
        return;
      }
    } else if (this.data.toType == "Alipay") {
      if (pAlipayAccount == "") {
        mUtils.showToast("【支付宝账号】不能为空！");
        return;
      }
    } else if (this.data.toType == "Bank") {
      if (pBankCardNumber == "" || pBankAccName == "" || pOpeningBank == "" || pLinkMobile == "") {
        //console.log("pOpeningBank=" + pOpeningBank + "| pBankAccName=" + pBankAccName + "| pBankAccName=" + pBankAccName + "| pBankCardNumber=" + pBankCardNumber);
        mUtils.showToast("所有项必须填写！");
        return;
      }
    }

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "3",
      "ToType": this.data.toType,
      "WithDrawAmt": pWithDrawAmt,
      "TrueName": pTrueName,
      "LinkMobile": pLinkMobile,
      "WeChatAccount": pWeChatAccount,
      "AlipayAccount": pAlipayAccount,
      "BankCardNumber": pBankCardNumber,
      "BankAccName": pBankAccName,
      "OpeningBank": pOpeningBank,
      "WithDrawMemo": "",
      "SmsVerifyCode": pVerifyCode,
    };
    //加载提示
    mUtils.showLoadingWin("提交中");
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.vipApi_WithdrawSubmit, _dataPOST, _jsonReTxt => {
      //移除加载提示
      mUtils.hideLoadingWin();
      if (_jsonReTxt == "" || _jsonReTxt == undefined || _jsonReTxt == null) {
        return;
      }

      if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
        mUtils.showToast(_jsonReTxt.ErrMsg);
        return;
      }

      if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
        mUtils.showToastCb(_jsonReTxt.Msg, () => {

          mUtils.redirectToURL("../../../../pages/buyer/vip/withdrawdetail/withdrawdetail?WDID=" + _jsonReTxt.DataDic.RecentWithDrawID);

        });
        return;
      }

    });
  },


  //================倒计时===============//
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