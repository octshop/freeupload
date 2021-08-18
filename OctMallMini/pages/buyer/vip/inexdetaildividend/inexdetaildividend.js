// pages/buyer//vip/inexdetaildividend/inexdetaildividend.js
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
    inExMsgId: "0", //余额信息ID
    integralId: "0", //积分信息ID
    pageTitle: "", //页面标题
    initBuyerIncomeExpenseDetailDividend_Data: null, //初始化买家收支详情 - 分润 余额详细

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
    var _inExMsgId = options.IEID;
    var _integralId = options.INID;
    if (_inExMsgId == undefined || _inExMsgId == "") {
      _inExMsgId = "0";
    }
    if (_integralId == undefined || _integralId == "") {
      _integralId = "0";
    }
    //设置公共变量值
    this.setData({
      inExMsgId: _inExMsgId, //余额信息ID
      integralId: _integralId, //积分信息ID
    });


    //判断用户是否登录 没有登录 则跳转到指定URL 并设置UserID,LoginSha1
    mBusiLogin.isLoginUserNavigateSetUserIDPwdSha1Global(res => {
      //console.log(res)
      //----登录后的操作-----//

      if (this.data.inExMsgId != "0" && this.data.inExMsgId != "") {
        // 初始化买家收支详情 - 分润 余额详细
        this.initBuyerIncomeExpenseDetailDividend();
      }

      if (this.data.integralId != "0" && this.data.integralId != "") {
        //初始化买家收支详情 - 分润积分详细
        this.initBuyerIntegralDetailDividend();
      }


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
   * 跳转到我的
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
   * 初始化买家收支详情 - 分润 余额详细
   */
  initBuyerIncomeExpenseDetailDividend: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
      "InExMsgID": this.data.inExMsgId,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.vipApi_DividendInExDetail, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined || _jsonReTxt == null) {
        return;
      }

      //设置公共变量值
      this.setData({
        initBuyerIncomeExpenseDetailDividend_Data: _jsonReTxt,
        pageTitle: "分润余额详情",
      });

    });
  },

  /**
   * 初始化买家收支详情 - 分润积分详细
   */
  initBuyerIntegralDetailDividend: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "2",
      "IntegralID": this.data.integralId,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.vipApi_DividendInExDetail, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined || _jsonReTxt == null) {
        return;
      }

      //设置公共变量值
      this.setData({
        initBuyerIncomeExpenseDetailDividend_Data: _jsonReTxt,
        initBuyerIntegralDetailDividend_Data: _jsonReTxt,
        pageTitle: "分润积分详情",
      });



    });


  },


})