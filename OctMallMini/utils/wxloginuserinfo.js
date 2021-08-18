//==============引入相关的Js文件========//
var mDecryptData = require('../utils/decryptdatautil.js');

//------初始化APP对象-----//
var app = getApp();

//-------------处理用户登录以及得到用户信息相关业务--------------//
//通过code发起网络请求获取  openid,unionid,session_key 的页面路径 
var httpPageUrlCode = app.apiWxMiniUrl.wxMiniApi_WxLoginGetMsg;


//-----暴露接口------//
module.exports = {
  checkLogin: checkLogin, //检测登录状态，失败就重新登录 并保存  openid,unionid,session_key [LoginMsgCookie]
  getWxUserInfo: getWxUserInfo, //得到用户信息
  wxLoginGetMsg: wxLoginGetMsg, //登录并得到 openid,unionid,session_key
  getWxUserInfoSimple: getWxUserInfoSimple, //直接简单的获取 微信用户信息UserInfo
  getPhoneNumberAsyn: getPhoneNumberAsyn, //得到小程序 用户手机号
}

//=====================小程序获取登录，公共函数=================//

/**
 * 得到小程序 用户手机号
 * @param {*} e 
 * @param {*} pCallBack 
 */
function getPhoneNumberAsyn(e, pCallBack) {

  //得到小程序登录信息 _sesstionKey
  wxLoginGetMsg(res => {

    //console.log("得到小程序登录信息=" + JSON.stringify(res));

    var _sesstionKey = res.data.session_key;

    //console.log(e);
    var _encrypteData = e.detail.encryptedData;
    var _iv = e.detail.iv;

    //console.log("_sesstionKey=" + _sesstionKey + " | _encrypteData=" + _encrypteData + " | _iv=" + _iv);

    var _loginMobile = mDecryptData.decryptDataContent(_encrypteData, _sesstionKey, _iv);
    //console.log(_loginMobile);
    if (_loginMobile.phoneNumber != "" && _loginMobile.phoneNumber != null && _loginMobile.phoneNumber != undefined) {
      //回调函数
      pCallBack(_loginMobile.phoneNumber);
    }
    else{
      pCallBack("");
    }
    //console.log(_loginMobile);

  });

}

/**
 * 直接简单的获取 微信用户信息UserInfo -- 这个必须是已经授权的情况才有效
 * @param {} pCallBack (userInfo)
 */
function getWxUserInfoSimple(pCallBack) {
  // 查看是否授权
  wx.getSetting({
    success(res) {
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
        wx.getUserInfo({
          success: function (res) {
            //console.log(res.userInfo)
            pCallBack(res);
            //console.log("获取用户信息成功！");
          }
        });
      } else {
        pCallBack("");
        //console.log("获取用户信息失败！ -- 未授权 -- ");
      }
    }
  });
}


/**
 * -----检测登录状态，失败就重新登录 并保存  openid,unionid,session_key [LoginMsgCookie]----------
 * @param callback  登录成功后的回调函数
 */
function checkLogin(callback) {
  wx.checkSession({
    success: function () {
      //session 未过期，并且在本生命周期一直有效

      //console.log('登录未过期');
      //回调函数
      callback("登录未过期");

    },
    fail: function () {
      //登录态过期
      wxLoginGetMsg(res => {

        console.log("登录过期返回：" + JSON.stringify(res));
        //console.log('登录过期');
        //登录成功回调函数
        callback(res);

      }); //重新登录

    }
  })
}



/**
 * --------------登录并得到 openid,unionid,session_key------------
 */
function wxLoginGetMsg(callback) {
  wx.login({
    success: function (res) {
      if (res.code) {


        //发送异步请求获取，openid, unionid, session_key
        getWxLoginMsg(res.code, res => {
          //console.log("获取openid, unionid, session_key成功！");
          //console.log(res);
          callback(res);

        });


      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    }
  });
}




/**
 * ------发送异步请求登录并获取，openid,unionid,session_key------
 */
function getWxLoginMsg(pWxLoginCode, callback) {

  //发起网络请求
  wx.request({
    url: httpPageUrlCode,
    data: {
      code: pWxLoginCode,
      MiniAppId: app.globalData.WxMiniAppID,
      MiniAppSecret: app.globalData.WxMiniAppSecret,
    },
    success: function (res) {
      //console.log(res);
      console.log("openid=" + res.data.openid);
      //console.log("session_key=" + res.data.session_key)

      //回调函数
      callback(res);

    },
    fail: function (error) {
      console.log(error);
    }
  });
}


/**
 * --------------得到用户信息---------------
 */
function getWxUserInfo(callback) {
  //检测登录
  checkLogin(res => {

    console.log('检测登录成功返回');

    //得到用户信息
    wx.getUserProfile({
      success: function (res) {
        //console.log(res);

        //console.log('获取到了用户信息!');
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country

        //构造Json对象
        var userInfo = {
          nickName: nickName,
          avatarUrl: avatarUrl,
          gender: gender,
          province: province,
          city: userInfo.city,
          country: country
        };

        callback(userInfo);

      },
      fail: function () {

      }
    })

  });
}