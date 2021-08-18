// pages/buyer/vip/onlinetopup/onlinetopup.js
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
    rechargeAmt: 0, //充值金额
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
      //设置MiniOpenID
      mBusiLogin.setAppMiniOpenID();

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
   * 监听充值金额的变化
   * @param {} e 
   */
  bindInputRechargeAmt(e) {
    //console.log(e);
    var _rechargeAmt = e.detail.value
    //设置公共变量值
    this.setData({
      rechargeAmt: _rechargeAmt,
    });
    console.log(this.data.rechargeAmt);
  },

  /**
   * 添加买家充值信息
   */
  addBuyerRecharge: function () {

    //获取表单值
    var RechargeAmt = this.data.rechargeAmt;
    if (RechargeAmt == "") {
      mUtils.showToast("充值金额不能为空！");
      return;
    }
    if (isNaN(RechargeAmt)) {
      mUtils.showToast("充值金额必须是数字！");
      return;
    }
    if (parseFloat(RechargeAmt) <= 0) {
      mUtils.showToast("充值金额必须大于零！");
      return;
    }

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
      "RechargeAmt": RechargeAmt,
      "FromType": "WeChat",
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.vipApi_OnLineTopUp, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined || _jsonReTxt == null) {
        return;
      }

      if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
        mUtils.showToast(_jsonReTxt.ErrMsg);
        return;
      }

      if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {

        //微信小程序支付 - 买家充值 
        this.payWeiXin(_jsonReTxt.DataDic.BillNumber);

        return;
      }
    });
  },


  /**
   * 微信小程序支付 - 买家充值 
   */
  payWeiXin: function (pBillNumber) {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "4",
      "WxOpenID": app.globalData.buyerMiniOpenID,
      "BillNumber": pBillNumber,
    };
    //显示加载提示
    mUtils.showLoadingWin("支付中");
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.payApi_Index, _dataPOST, _jsonReTxt => {
      //console.log(_jsonReTxt);
      //移除加载提示
      mUtils.hideLoadingWin();
      if (_jsonReTxt == "") {
        return;
      }
      //错误提示
      if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
        mUtils.showToastCb(_jsonReTxt.ErrMsg, () => {
          //跳转到订单详情页
          //mUtils.redirectToURL("../../../pages/buyer/orderdetail/orderdetail?OID=" + this.data.orderID);

        });
        return;
      }

      //---拉起微信小程序支付----//
      //console.log(_jsonReTxt.nonceStr);
      var MiniPayJson = JSON.parse(_jsonReTxt.toString());
      // console.log(MiniPayJson);
      wx.requestPayment({
        timeStamp: MiniPayJson.timeStamp,
        nonceStr: MiniPayJson.nonceStr,
        package: MiniPayJson.package,
        signType: MiniPayJson.signType,
        paySign: MiniPayJson.paySign,
        success(res) {
          console.log(res);

          mUtils.showToastCb("充值成功！", res => {
            //跳转到支付成功页
            mUtils.redirectToURL("../../../buyer/vip/index");
          });


        },
        fail(res) {
          console.log(res);
          mUtils.showToast("支付失败，充值失败！");
          //跳转到订单详情页
          //mUtils.redirectToURL("../../../pages/buyer/orderdetail/orderdetail?OID=" + this.data.orderID);
        }
      });

    });

  },





})