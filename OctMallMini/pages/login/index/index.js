// pages/login/index.js
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiLogin = require('../../../busicode/busilogin.js');

//-------公共变量--------//

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

    //判断是否已登录绑定手机
    mBusiLogin.isLoginUserNavigate(res => {

      //设置全局变量中的 buyerMiniOpenID
      //mBusiLogin.setAppMiniOpenID();

    });



  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //====================自定义函数========================//
  /**
   * 得到小程序微信用户信息
   * @param {*} e 
   */
  getLoginWxUserInfo: function (e) {
    console.log(e);
    var _userInfo = e.detail.userInfo;
    console.log(_userInfo);
    //{"nickName":"IT独孤键客😇","gender":1,"language":"zh_CN","city":"Changsha","province":"Hunan","country":"China","avatarUrl":"https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIbWFEIJj8IpLx2lWWp8KpAicibFWbeFD8bv8BYLuSo8adUfLKCSRmlPrprvzmWgNU2sibDVVDTv5k0A/132"}
    if (_userInfo != "" && _userInfo != null && _userInfo != undefined) {

      //构造POST参数
      var _dataPOST = {
        "SignKey": mHttp.signKeyRsa(),
        "Type": "2",
        "UserID": app.globalData.loginBuyerUserID,
        "MiniOpenID": app.globalData.buyerMiniOpenID,
        "NickName": _userInfo.nickName,
        "HeadImgUrl": _userInfo.avatarUrl,
        "Sex": _userInfo.gender,
      };

      //显示加载提示
      mUtils.showLoadingWin("加载中");

      //正式发送Http请求
      mHttp.postHttp(app.apiURLData.loginApi_MiniLoginRegUserAccount, _dataPOST, jsonReTxt => {

        //移除加载提示
        mUtils.hideLoadingWin();

        if (jsonReTxt.Msg != "" && jsonReTxt.Msg != null && jsonReTxt.Msg != undefined) {

          //跳转到会员中心
          mUtils.switchTabURL("../../tabbar/buyerindex/buyerindex");
          return;
        }

        //显示错误提示
        mUtils.showToast(jsonReTxt.ErrMsg + ",请重试！");
        return;


      });


    }

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