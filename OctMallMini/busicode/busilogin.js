//=========================登录相关逻辑=======================//
//-------引入相关的Js文件-------//
var mHttp = require('../utils/http.js');
var mEncryption = require('../utils/encryptionclass.js');
var mUtils = require('../utils/util.js');
var mLogin = require('../utils/wxloginuserinfo.js');


//------------暴露接口---------//
module.exports = {
  //--------------相关逻辑函数--------------//
  isLoginUser: isLoginUser, //判断用户是否登录
  isLoginUserNavigate: isLoginUserNavigate, //判断用户是否登录 没有登录 则跳转到指定URL
  isLoginUserNavigateSetUserIDPwdSha1Global: isLoginUserNavigateSetUserIDPwdSha1Global, //判断用户是否登录 没有登录 则跳转到指定URL 并设置UserID,LoginSha1
  isLoginUserUserIDLoginPwdSha1: isLoginUserUserIDLoginPwdSha1, //判断用户是否登录 - 如：res 返回空 "" 那么登录失败
  setLoginBuyerUserIDPwdSha1Global: setLoginBuyerUserIDPwdSha1Global, //如果用户登录啦，则设置全局的  loginBuyerUserID 和 loginPwdSha1 可根据这两个参数是否为空，判断是否用户登录
  getLoginUserID: getLoginUserID, //得到登录用户的UserID
  setAppMiniOpenID: setAppMiniOpenID, //设置全局变量中的 buyerMiniOpenID
  loginRegUserMobileMini: loginRegUserMobileMini, //小程序 注册或登录 用户信息
  httpIsCheckUserLogin: httpIsCheckUserLogin, // http 远程验证用户登录是否正确
  //--------------公共函数--------------//
  setLoginCookie: setLoginCookie, //设置登录用户Cookie信息 - 登录密码非SHA1
  setLoginCookieSHA1: setLoginCookieSHA1, //设置登录用户Cookie信息 登录密码SHA1加密
  getLoginCookieAsyn: getLoginCookieAsyn, //获取用户登录信息 --异步函数
  clearLoginCookie: clearLoginCookie, // 清除 登录用户Cookie 信息
  getMiniOpenIDCookie: getMiniOpenIDCookie, //得到小程序的OpenID 从Cookie中
  setMiniOpenIDCookie: setMiniOpenIDCookie, //设置保存 小程序的OpenID 到Cookie中
}


//-------公共变量-------//



//------初始化APP对象-----//
var app = getApp();


//--------------自定函数-------------//

/**
 * 如果用户登录啦，则设置全局的  loginBuyerUserID 和 loginPwdSha1 可根据这两个参数是否为空，判断是否用户登录
 */
function setLoginBuyerUserIDPwdSha1Global(pCallBack = "") {

  if (pCallBack == undefined || pCallBack == "") {
    pCallBack = function () {};
  }

  //判断是否已登录 
  isLoginUserUserIDLoginPwdSha1(res => {
    console.log(res);
    if (res == "") {
      app.globalData.loginBuyerUserID = "";
      app.globalData.loginPwdSha1 = "";
    } else {
      app.globalData.loginBuyerUserID = res.UserID;
      app.globalData.loginPwdSha1 = res.LoginPwdSha1;
      //console.log("执行啦 - 判断是否已登录, app.globalData.loginPwdSha1=" + app.globalData.loginPwdSha1);
    }
    // console.log("判断是否已登录 app.globalData.loginBuyerUserID=" + app.globalData.loginBuyerUserID + " | app.globalData.loginPwdSha1=" + app.globalData.loginPwdSha1);

    //回调函数
    pCallBack(res);

  });
}

/**
 * http 远程验证用户登录是否正确
 * @param pCallBack (true 登录成功 / false)
 */
function httpIsCheckUserLogin(pCallBack) {

  //获取用户登录信息Cookie --异步函数 {"UserID": "234324","LoginPwdSha1":"3d4f2bf07dc1be38b20cd6e46949a1071f9d0e3d"};
  getLoginCookieAsyn(res => {
    if (res == "") {
      pCallBack(false);
      return false; //登录信息错误
    } else {
      //设置全局变量中登录信息
      app.globalData.loginBuyerUserID = res.UserID;

      if (res.UserID == "" || res.UserID == null || res.UserID == undefined) {
        pCallBack(false);
        return false; //登录信息错误
      }
      if (res.LoginPwdSha1 == "" || res.LoginPwdSha1 == null || res.LoginPwdSha1 == undefined) {
        pCallBack(false);
        return false; //登录信息错误
      }

      //------Http请求验证-----//
      //构造POST参数
      var _dataPOST = {
        "SignKey": mHttp.signKeyRsa(),
        "Type": "4",
        "BuyerUserID": res.UserID,
        "LoginPwdSha1": res.LoginPwdSha1,
      };

      //正式发送Http请求
      mHttp.postHttp(app.apiURLData.loginApi_MiniLoginRegUserAccount, _dataPOST, jsonReTxt => {
        //用户ID登录密码正确
        if (jsonReTxt.Code == "CUALP_01") {
          pCallBack(true); //登录成功
          return
        } else {
          pCallBack(false); //登录失败
        }
        return;
      });

    }
  });


}

/**
 * 小程序 注册或登录 用户信息
 * @param {*} pBindMobile 绑定手机号
 * @param {*} pCallBack 
 * @param pPQRCRSA 获取连接传递的推广者信息 二维码内容  BuyerUserID ^ LoginPwdNoSha1 ^ PromoteUser  RSA加密的
 * @param 当没有绑定微信用户信息时，是否跳转到授权绑定面u false / true
 */
function loginRegUserMobileMini(pBindMobile, pCallBack, pIsExistWxUserInfoRedirect = false, pPQRCRSA = "") {

  //设置全局变量中的 buyerMiniOpenID
  this.setAppMiniOpenID();

  //构造POST参数
  var _dataPOST = {
    "SignKey": mHttp.signKeyRsa(),
    "Type": "1",
    "BindMobile": pBindMobile,
    "PQRCRSA": pPQRCRSA
  };
  //正式发送Http请求
  mHttp.postHttp(app.apiURLData.loginApi_MiniLoginRegUserAccount, _dataPOST, jsonReTxt => {

    //回调函数
    pCallBack(jsonReTxt);

    if (jsonReTxt.Msg != "" && jsonReTxt.Msg != null && jsonReTxt.Msg != undefined) {
      //mUtils.showToast(jsonReTxt.Msg);
      //保存用户登录信息
      this.setLoginCookieSHA1(jsonReTxt.DataDic.UserID, jsonReTxt.DataDic.LoginPwdSha1);

      //设置全局变量中的 登录的买家UserID
      app.globalData.loginBuyerUserID = jsonReTxt.DataDic.UserID;

      //-----如果没有绑定微信用户信息，则进行绑定-----//
      if (pIsExistWxUserInfoRedirect == true) {
        if (jsonReTxt.DataDic.IsExistWxUserInfo == "false") {
          //进行跳转
          mUtils.navigateToURL("../../../pages/login/index/index");
        } else {
          //跳转到会员中心
          mUtils.switchTabURL("../../../pages/tabbar/buyerindex/buyerindex");
        }
      }
      return;
    }
    return;

  });
}


/**
 * 设置全局变量中的 buyerMiniOpenID
 */
function setAppMiniOpenID() {

  //得到与设置Cookie中的 MiniOpenID
  getMiniOpenIDCookie(res => {
    if (res == "") {
      //请求后台，重新得到 MiniOpenID 登录并得到 openid,unionid,session_key
      mLogin.wxLoginGetMsg(res => {
        //console.log("setAppBuyerUserIDMiniOpenID=" + JSON.stringify(res));
        var _openid = res.data.openid;
        if (_openid != "" && _openid != null && _openid != undefined) {
          //设置保存 小程序的OpenID 到Cookie中
          setMiniOpenIDCookie(_openid);

          app.globalData.buyerMiniOpenID = _openid;
        } else {
          app.globalData.buyerMiniOpenID = "";
        }

      });
    } else {
      app.globalData.buyerMiniOpenID = res;
    }
  });

}

//--------------公共函数-------------//
/**
 * 判断用户是否登录 没有登录 则跳转到指定URL
 * @param pIsCheckLoginHttp 是否进行远程用户ID和密码验证
 * @param {*} pNavigateURL 
 */
function isLoginUserNavigate(pCallBack, pIsCheckLoginHttp = false, pNavigateURL = "", pBackURL = "") {

  //console.log("pBackURL=" + pBackURL);

  //console.log(pCallBack);
  if (pCallBack == undefined || pCallBack == "") {
    pCallBack = function () {

    };
  }

  if (pNavigateURL == undefined || pNavigateURL == "") {
    pNavigateURL = "../../../pages/login/bindmobile/bindmobile";
  }

  if (pBackURL != "" || pBackURL == undefined) {
    pNavigateURL += "?BackURL=" + pBackURL;
  }

  //----判断是否登录 异步----//
  isLoginUser(res => {
    console.log(res);
    if (res == false) {

      //console.log(pNavigateURL);
      //跳转到手机绑定页
      mUtils.navigateToURL(pNavigateURL);

      //回调函数
      pCallBack("");

    } else {

      //登录成功后的UserID
      getLoginCookieUserIDAsyn(res => {
        //回调函数
        pCallBack(res);
      });

    }

  }, pIsCheckLoginHttp);
}

/**
 *  判断用户是否登录 没有登录 则跳转到指定URL 并设置UserID,LoginSha1
 * @param {*} pCallBack  回调函数 返回UserID,LoginSha1对象
 * @param {*} pIsCheckLoginHttp 是否 调用Http进行验证
 * @param {*} pNavigateURL 没有登录跳转的URL路径
 * @param {*} pBackURL 返回的路径
 */
function isLoginUserNavigateSetUserIDPwdSha1Global(pCallBack, pIsCheckLoginHttp = false, pNavigateURL = "", pBackURL = "") {
  //判断用户是否登录 没有登录 则跳转到指定URL
  isLoginUserNavigate(res => {
    console.log("是否登录返回UserID=" + res);
    if (res != "" && res != undefined) //登录成功
    {
      //得到登录Cookie的UserID和LoginSha1
      getLoginCookieAsyn(res => {
        //console.log(res);
        app.globalData.loginBuyerUserID = res.UserID;
        app.globalData.loginPwdSha1 = res.LoginPwdSha1;

        pCallBack(res);

      });
    }
  }, pIsCheckLoginHttp, pNavigateURL, pBackURL);

}

/**
 * 判断用户是否登录
 * @param pIsCheckLoginHttp 是否进行远程用户ID和密码验证
 */
function isLoginUser(pCallBack, pIsCheckLoginHttp = false) {

  if (pCallBack == undefined) {
    pCallBack = function () {

    };
  }

  //设置全局变量中的 buyerMiniOpenID
  setAppMiniOpenID();

  //获取用户登录信息 --异步函数
  getLoginCookieAsyn(res => {

    if (res == "") {
      pCallBack(false);
      return false; //没有登录 
    }

    if (res.UserID != "" && res.LoginPwdSha1 != "") {

      if (pIsCheckLoginHttp == true) {

        //http 远程验证用户登录是否正确
        httpIsCheckUserLogin(resTxt => {
          if (resTxt == false) {
            pCallBack(false);
            return false; //登录失败
          }
        });

      }
      pCallBack(true);
      return true; //已登录
    }
    pCallBack(false);
    return false; //没有登录 

  });
}

/**
 * 得到登录用户的UserID
 */
function getLoginUserID(pCallBack) {
  //获取用户登录信息 --异步函数
  getLoginCookieAsyn(res => {

    if (res == "") {
      pCallBack("");
      return; //没有登录 
    }

    if (res.UserID != "" && res.LoginPwdSha1 != "") {
      pCallBack(res.UserID);
      return; //已登录
    }
    pCallBack("");
    return
  });
}


/**
 * 判断用户是否登录 - 如：res 返回空 "" 那么登录失败
 * @param pIsCheckLoginHttp 是否进行远程用户ID和密码验证
 */
function isLoginUserUserIDLoginPwdSha1(pCallBack, pIsCheckLoginHttp = false) {

  if (pCallBack == undefined) {
    pCallBack = function () {

    };
  }

  //设置全局变量中的 buyerMiniOpenID
  setAppMiniOpenID();

  //获取用户登录信息 --异步函数
  getLoginCookieAsyn(res => {

    if (res == "") {
      pCallBack("");
      return false; //没有登录 
    }

    if (res.UserID != "" && res.LoginPwdSha1 != "") {

      if (pIsCheckLoginHttp == true) {

        //http 远程验证用户登录是否正确
        httpIsCheckUserLogin(resTxt => {
          if (resTxt == false) {
            pCallBack("");
            return false; //登录失败
          }
        });

      }
      pCallBack({
        "UserID": res.UserID,
        "LoginPwdSha1": res.LoginPwdSha1
      });
      return true; //已登录
    }
    pCallBack("");
    return false; //没有登录 

  });
}



/**
 * 得到小程序的OpenID 从Cookie中
 * @param {} pCallBack res
 */
function getMiniOpenIDCookie(pCallBack) {
  mUtils.getCookie("MiniOpenIDCookie", res => {
    //回调函数
    pCallBack(res);
  });
}

/**
 * 设置保存 小程序的OpenID 到Cookie中
 * @param {*} pMiniOpenID 
 */
function setMiniOpenIDCookie(pMiniOpenID) {
  mUtils.setCookie("MiniOpenIDCookie", pMiniOpenID);
  return true;
}

/**
 * 设置登录用户Cookie信息 - 登录密码非SHA1
 * @param {*} pUserID 用户UserID(买家)
 * @param {*} pLoginPwd 登录密码非SHA1
 */
function setLoginCookie(pUserID, pLoginPwd) {

  //设置全局变量中的 buyerMiniOpenID
  setAppMiniOpenID();

  //SHA1加密登录密码
  var _loginPwdSha1 = mEncryption.getSHA1(pLoginPwd);

  var _loginCookieMsg = pUserID + "^" + _loginPwdSha1;
  //加密存储
  var _rsaCotnent = mEncryption.rsaEncryptSection(_loginCookieMsg);
  //保存登录信息
  mUtils.setCookie("OctUserLoginCookie", _rsaCotnent);

  return true;
}

/**
 * 设置登录用户Cookie信息 登录密码SHA1加密
 * @param {*} pUserID 用户UserID(买家)
 * @param {*} pLoginPwdSha1 用户登录密码SHA1加密
 */
function setLoginCookieSHA1(pUserID, pLoginPwdSha1) {

  //设置全局变量中的 buyerMiniOpenID
  setAppMiniOpenID();

  var _loginCookieMsg = pUserID + "^" + pLoginPwdSha1;
  //加密存储
  var _rsaCotnent = mEncryption.rsaEncryptSection(_loginCookieMsg);
  //保存登录信息
  mUtils.setCookie("OctUserLoginCookie", _rsaCotnent);

  return true;
}

/**
 * 获取用户登录信息 --异步函数
 * @param {}} pCallBack   {"UserID": "234324","LoginPwdSha1":"3d4f2bf07dc1be38b20cd6e46949a1071f9d0e3d"};
 */
function getLoginCookieAsyn(pCallBack) {

  //设置全局变量中的 buyerMiniOpenID
  setAppMiniOpenID();

  //得到登录Cookie
  mUtils.getCookie("OctUserLoginCookie", res => {

    //console.log(res);
    if (res == "" || res == null || res == undefined) {
      pCallBack("");
      return;
    }
    //RSA分段解密
    var _rsaDecryptionContent = mEncryption.rsaDecryptSection(res);
    //console.log(_rsaDecryptionContent);
    var _cookieLoginArr = _rsaDecryptionContent.split("^");
    var _loginMsg = {
      "UserID": _cookieLoginArr[0],
      "LoginPwdSha1": _cookieLoginArr[1]
    };
    //回调函数
    pCallBack(_loginMsg);

  });
}
/**
 * 得到登录用户的UserID
 * @param {*} pCallBack  data=UserID
 */
function getLoginCookieUserIDAsyn(pCallBack) {

  //设置全局变量中的 buyerMiniOpenID
  setAppMiniOpenID();

  getLoginCookieAsyn(res => {

    return pCallBack(res.UserID);

  });

}

/**
 * 清除 登录用户Cookie 信息
 */
function clearLoginCookie() {
  //保存登录信息
  mUtils.setCookie("OctUserLoginCookie", "");
  mUtils.setCookie("OctUserLoginCookie", null);
  return true;
}