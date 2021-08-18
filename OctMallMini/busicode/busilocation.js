//=========================位置与导航-相关逻辑====================//
//-------引入相关的Js文件-------//
var mHttp = require('../utils/http.js');
var mUtils = require('../utils/util.js');
var mBusiLogin = require('../busicode/busilogin.js');

//=================暴露接口==============//
module.exports = {
  setLngLatCookie: setLngLatCookie, //设置当前小程序 用户位置信息Cookie值 
  getLngLatCookie: getLngLatCookie, //得到当前小程序 用户位置信息 Cookie值 
  getSaveUserLoctaion: getSaveUserLoctaion, //得到与保存当前用户的位置信息
  updateUserLongitudeLatitude: updateUserLongitudeLatitude, //更新用户的坐标位置信息 到数据库
}

//=============公共变量================//

//------初始化APP对象-----//
var app = getApp();


//==============自定函数=================//

/**
 * 得到与保存当前用户的位置信息
 */
function getSaveUserLoctaion(pCallBack) {
  if (pCallBack == undefined || pCallBack == null) {
    pCallBack = function () {};
  }

  //得到当前用户的位置信息
  mUtils.getMiniLocation(res => {
    if (res.errMsg == "getLocation:ok") {
      //设置定位Cookie
      this.setLngLatCookie(res.longitude, res.latitude);
      //回调函数
      pCallBack(res);

      //得到登录用户的UserID
      mBusiLogin.getLoginUserID(resuser => {
        //console.log("登录返回:" + res);
        if (resuser != "") {
          //更新用户的坐标位置信息 到数据库
          updateUserLongitudeLatitude(resuser, res.longitude, res.latitude, resup => {
            //console.log(resup);
          });
        }

      });
    } else {
      //得到保存在Cookie中的位置信息
      this.getLngLatCookie(res => {
        if (res != "") {

          //pLongitude + "^" + pLatitude
          var resArr = mUtils.splitStringJoinChar(res)

          var _jsonRes = {
            accuracy: 65,
            errMsg: "getLocation:ok",
            horizontalAccuracy: 65,
            latitude: resArr[1],
            longitude: resArr[0],
            speed: -1,
            verticalAccuracy: 65
          };
          //回调函数
          pCallBack(JSON.parse(_jsonRes));
          
        }
      });
    }

    //回调函数
    pCallBack("");

  });

  // accuracy: 65
  // errMsg: "getLocation:ok"
  // horizontalAccuracy: 65
  // latitude: 28.24595
  // longitude: 113.08093
  // speed: -1
  // verticalAccuracy: 65
}

/**
 * 更新用户的坐标位置信息 到数据库
 * @param {*} pUserID 
 * @param {*} pLongitude 
 * @param {*} pLatitude 
 * @param {*} pCallBack 
 */
function updateUserLongitudeLatitude(pUserID, pLongitude, pLatitude, pCallBack) {

  //console.log("执行啦...:" + pLongitude);

  if (pUserID == undefined || pUserID == null || pUserID == "") {
    return;
  }
  if (pLongitude == undefined || pLongitude == null || pLongitude == "") {
    return;
  }
  if (pLatitude == undefined || pLatitude == null || pLatitude == "") {
    return;
  }

  if (pCallBack == undefined || pCallBack == null || pCallBack == "") {
    pCallBack = function () {};
  }



  //----发送Http请求保存-----
  //构造POST参数
  var _dataPOST = {
    "SignKey": mHttp.signKeyRsa(),
    "Type": "4",
    "UserID": pUserID,
    "Longitude": pLongitude,
    "Latitude": pLatitude,
  };
  //正式发送Http请求
  mHttp.postHttp(app.apiURLData.buyerApi_Index, _dataPOST, jsonReTxt => {
    //回调函数
    pCallBack(jsonReTxt);
  });
}


/**
 * 设置当前小程序 用户位置信息Cookie值 
 * @param {*} pLongitude  经度
 * @param {*} pLatitude  纬度
 */
function setLngLatCookie(pLongitude, pLatitude) {
  mUtils.setCookie("LngLatCookie", pLongitude + "^" + pLatitude);
  return;
}

/**
 * 得到当前小程序 用户位置信息 Cookie值 
 * @param {*} pCallBack 
 */
function getLngLatCookie(pCallBack) {
  mUtils.getCookie("LngLatCookie", res => {
    pCallBack(res);
    return;
  });
}