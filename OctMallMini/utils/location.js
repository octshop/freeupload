//==================处理定位与地址业务逻辑=================//

/**
 * ---------引入文件---------
 */
var util = require('util.js');

/**
 * ---------定义公共变量--------------
 */
// 引入腾讯地图SDK核心类
var QQMapWX = require('qqmap-wx-jssdk.min.js');
var qqmapsdk;
//腾讯地图Key 需要在腾讯地图申请的
var mQQMapKey = "UYIBZ-XPM3X-WMQ4E-76XMH-E3WP5-NSB2E";


//================暴露接口=============//
module.exports = {
  //腾讯地图 获取当前的地址,返回地址对象 调用：location.qqmapGeocoder(res => {});
  qqmapGeocoder: qqmapGeocoder,
  //得到当前的经纬度 坐标系”Wgs84“ 调用：location.getLongLatWgs84(res => {});
  getLongLatWgs84: getLongLatWgs84,
  //得到当前的经纬度 坐标系”gcj02“ 返回可以用于wx.openLocation的经纬度. 调用：location.getLongLatGcj02(res => {});
  getLongLatGcj02: getLongLatGcj02,
  // 得到【省，市，区县】的名称 用“_”连接 调用：location.getProvinceCityDistrict(res => {});
  getProvinceCityDistrict: getProvinceCityDistrict,
  //得到【省，市，区县和详细地址】信息 返回对象 调用：location.getProCityDisDetailAddr(res => {});
  getProCityDisDetailAddr: getProCityDisDetailAddr,
}

/**
 * ================方法与函数定义区==================
 */

/**
 * 腾讯地图 获取当前的地址
 */
function qqmapGeocoder(callback) {

  // 腾讯地国 实例化API核心类
  qqmapsdk = new QQMapWX({
    key: mQQMapKey
  });

  //得到当前用户的经纬度
  wx.getLocation({
    type: 'wgs84',
    success: function(res) {

      var latitude = res.latitude
      var longitude = res.longitude
      var speed = res.speed
      var accuracy = res.accuracy

      // 调用接口
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: latitude,
          longitude: longitude
        },
        success: function(res) {
          console.log(res);
          //返回省_市_区
          //var regionAddr = util.strReplace(util.strReplace(res.result.ad_info.name, ",", "_"), "中国_", "");

          //console.log(regionAddr);
          //回调函数
          callback(res);

        },
        fail: function(res) {
          console.log(res);
        },
        complete: function(res) {
          //console.log(res);
        }
      });
    }
  })
}

/**
 * 得到当前的经纬度 坐标系”Wgs84“
 */
function getLongLatWgs84(pCallBack) {
  //得到当前用户的经纬度
  wx.getLocation({
    type: 'wgs84',
    success: function(res) {
      var latitude = res.latitude
      var longitude = res.longitude
      var _location = {
        longitude: longitude, //经度
        latitude: latitude //纬度
      };
      console.log(_location);
      //回调函数传参
      pCallBack(_location);
    }
  });
}

/**
 * 得到当前的经纬度 坐标系”gcj02“ 返回可以用于wx.openLocation的经纬度
 */
function getLongLatGcj02(pCallBack) {
  //得到当前用户的经纬度
  wx.getLocation({
    type: 'gcj02',
    success: function (res) {
      var latitude = res.latitude
      var longitude = res.longitude
      var _location = {
        longitude: longitude, //经度
        latitude: latitude //纬度
      };
      console.log(_location);
      //回调函数传参
      pCallBack(_location);
    }
  });
}

/**
 * 得到【省，市，区县】的名称 用“_”连接
 */
function getProvinceCityDistrict(pCallBack) {
  //调用腾讯地址解析
  qqmapGeocoder(res => {

    //返回省_市_区
    var regionAddr = util.strReplace(util.strReplace(res.result.ad_info.name, ",", "_"), "中国_", "");

    console.log(regionAddr);
    //回调函数传参
    pCallBack(regionAddr);

  })
}
 
 /**
  * 得到【省，市，区县和详细地址】信息 返回对象
  */
 function getProCityDisDetailAddr(pCallBack){
   //调用腾讯地址解析
   qqmapGeocoder(res => {

     //返回省_市_区
     var regionAddr = util.strReplace(util.strReplace(res.result.ad_info.name, ",", "_"), "中国_", "");
     //详细地址
     var _detailAddr = res.result.address;

     var _address = {
       procitydis: regionAddr,
       detailaddr: _detailAddr
     };
     console.log(_address);
      //回调函数传参
     pCallBack(_address);
   });

 }