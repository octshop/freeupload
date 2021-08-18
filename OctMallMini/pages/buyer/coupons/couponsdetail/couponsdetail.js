// pages/buyer/coupons/couponsdetail/couponsdetail.js
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
    couponsId: "0", //优惠券ID
    issueId: "0", //券号，发放ID
    buyerUserID: "", //买家UserID
    loginPwdSha1: "", //买家登录的
    intCouponsMsgBar_Data: null, //初始化优惠券横条的Bar信息
    loadCouponsAbleUseShopList_Data: null, //初始化可使用店铺
    loadCouponsAbleUseGoodsList_Data: null, //得到优惠券可以使用的产品列表
    chgTabNum: 1, //选项卡的次序
    initCouponsVerifyCode_Data: null, // 初始化 优惠券线下使用 验证码 --包括重新生成
    isGetCoupons: false, //是否已领取

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

    //------获取传递的参数------//
    var _couponsId = options.CID;
    var _issueId = options.IID;
    if (_couponsId == undefined) {
      _couponsId = "";
    }
    if (_issueId == undefined) {
      _issueId = "";
    }

    this.setData({
      couponsId: _couponsId,
      issueId: _issueId,
    });

    //-----判断用户是否登录 - 如：res 返回空 "" 那么登录失败-----//
    mBusiLogin.isLoginUserUserIDLoginPwdSha1(res => {
      console.log(res)

      if (res != "") {
        this.setData({
          buyerUserID: res.UserID,
          loginPwdSha1: res.LoginPwdSha1,
        });
        app.globalData.loginBuyerUserID = res.UserID;
        app.globalData.loginPwdSha1 = res.LoginPwdSha1;
      }

      //------不需要登录就可以加载的----//
      this.intCouponsMsgBar();
      //得到优惠券可以使用的产品列表
      this.loadCouponsAbleUseGoodsList();
      //加载优惠券可以使用的店铺列表
      this.loadCouponsAbleUseShopList();

    });




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
   * 初始化优惠券横条的Bar信息
   */
  intCouponsMsgBar: function () {

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "2",
      "CouponsID": this.data.couponsId,
      "IssueID": this.data.issueId,
      "BuyerUserID": this.data.buyerUserID,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.buyerApi_CouponsMy, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined || _jsonReTxt == null) {
        return;
      }

      this.setData({
        intCouponsMsgBar_Data: _jsonReTxt,
      });

      if (this.data.buyerUserID != "") {
        // 初始化 优惠券线下使用 验证码 --包括重新生成
        this.initCouponsVerifyCode();
      }


    });


  },
  /**
   * 得到优惠券可以使用的产品列表
   */
  loadCouponsAbleUseGoodsList: function () {

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "5",
      "CouponsID": this.data.couponsId,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.buyerApi_CouponsMy, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined || _jsonReTxt == null) {
        return;
      }

      this.setData({
        loadCouponsAbleUseGoodsList_Data: _jsonReTxt,
      });

    });



  },
  /**
   * 加载优惠券可以使用的店铺列表
   */
  loadCouponsAbleUseShopList: function () {
    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "6",
      "CouponsID": this.data.couponsId,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.buyerApi_CouponsMy, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined || _jsonReTxt == null) {
        return;
      }

      this.setData({
        loadCouponsAbleUseShopList_Data: _jsonReTxt,
      });

    });

  },
  /**
   * 切换选项卡
   */
  chgTab: function (e) {
    var _chgTabNum = e.currentTarget.dataset.chgTabNum;
    //设置公共变量值
    this.setData({
      chgTabNum: _chgTabNum,
    });
  },
  /**
   * 初始化 优惠券线下使用 验证码 --包括重新生成
   * @param {*} e 
   */
  initCouponsVerifyCode: function (e) {
    var _isReSet = "false";
    if (e != undefined) {
      _isReSet = e.currentTarget.dataset.isReSet;
    }

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "4",
      "IssueID": this.data.issueId,
      "IsReSet": _isReSet,
      "ShopUserID": this.data.intCouponsMsgBar_Data.CouponsMsg.ShopUserID,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.buyerApi_CouponsMy, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined || _jsonReTxt == null) {
        return;
      }

      this.setData({
        initCouponsVerifyCode_Data: _jsonReTxt,
      });

    });



  },
  /**
   * 领取优惠券
   * @param {*} e 
   */
  buyerGetCoupons: function () {

    //判断用户是否登录 没有登录 则跳转到指定URL
    mBusiLogin.isLoginUserNavigate(res => {}, false, "../../../../pages/login/bindmobile/bindmobile");

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "3",
      "CouponsID": this.data.couponsId,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.buyerApi_CouponsMy, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined || _jsonReTxt == null) {
        return;
      }

      this.setData({
        isGetCoupons: true,
      });

      if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null) {
        mUtils.showToast(_jsonReTxt.ErrMsg);
        return;
      }

      if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null) {
        mUtils.showToast(_jsonReTxt.Msg);
        return;
      }

    });

  },
  //=====================公共函数==========================//
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

  /**
   *打开预览图片窗口
   * @param {} e 
   */
  previewImgShow: function (e) {
    console.log(e);

    //得到项目的协议头名称
    //var _httpName = mUtils.getHttpProtocolURL(app.globalData.apiWebDoamin);

    var _ImgUrl = new Array(e.currentTarget.dataset.imgUrl);
    var _curIndex = "0"; //e.currentTarget.dataset.curIndex;

    mUtils.previewImg(_ImgUrl, _curIndex);

  },


})