//=========================省市县，地区的，区域范围处理 -相关逻辑====================//
//-------引入相关的Js文件-------//
var mHttp = require('../utils/http.js');
var mUtils = require('../utils/util.js');



//=================暴露接口==============//
module.exports = {
  loadWxMiniRegionCodeProvinceCityData: loadWxMiniRegionCodeProvinceCityData, //加载小程序省市二级联动json数据，并返回数组对象
  setSelCityRegionArrCookie: setSelCityRegionArrCookie, //设置用户选择的城市区域代号信息 --Cookie值 - “ 430000_430100 ^ 湖南省_长沙市 ”
  getSelCityRegionArrCookie: getSelCityRegionArrCookie, // 得到 用户选择的城市区域代号信息 --Cookie值 
  showSelRegionCityName: showSelRegionCityName, //得到当前选择的 城市名称 --用于显示
  getUserSelCityRegionArrCookie: getUserSelCityRegionArrCookie, //得到用户选择的区域  没有选择区域时，设置默认的区域
}


//=============公共变量================//

//------初始化APP对象-----//
var app = getApp();

//==============自定函数=================//

/**
 * 得到当前选择的 城市名称 --用于显示
 * @param {*} pCallBack 
 */
function showSelRegionCityName(pCallBack) {

  getSelCityRegionArrCookie(res => {
    if (res != "") {
      if (res.CityName == "市辖区") {
        pCallBack(res.ProvinceName);
      } else {
        pCallBack(res.CityName);
      }
    } else {
      //--设置默认的选择城市----//
      setSelCityRegionArrCookie("430000", "430100", "湖南省", "长沙市");
      pCallBack("长沙市");
    }
  })
}

/**
 * 得到用户选择的区域  没有选择区域时，设置默认的区域
 * @param {*} pCallBack 
 */
function getUserSelCityRegionArrCookie(pCallBack) {
  //得到 用户选择的城市区域代号信息 --Cookie值 
  getSelCityRegionArrCookie(res => {

    if (res == "") //没有选择区域时，设置默认的区域
    {
      //--设置默认的选择城市----//
      setSelCityRegionArrCookie("430000", "430100", "湖南省", "长沙市");
      var _jsonBack = "{";
      _jsonBack += "\"ProvinceCode\":\"430000\","
      _jsonBack += "\"CityCode\":\"430100\","
      _jsonBack += "\"ProvinceName\":\"湖南省\","
      _jsonBack += "\"CityName\":\"长沙市\""
      _jsonBack += "}";
      pCallBack(JSON.parse(_jsonBack));
    } else {
      pCallBack(res);
    }
  });
}

/**
 * 设置用户选择的城市区域代号信息 --Cookie值 - “ 430000_430100 ^ 湖南省_长沙市 ”
 * @param {*} pProvinceCode 
 * @param {*} pCityCode 
 * @param {*} pProvinceName 
 * @param {*} pCityName 
 */
function setSelCityRegionArrCookie(pProvinceCode, pCityCode, pProvinceName, pCityName) {
  //“ 430000_430100 ^ 湖南省_长沙市 ”
  //构造值
  var _selCityRegionArr = pProvinceCode + "_" + pCityCode + "^" + pProvinceName + "_" + pCityName;
  //设置Cookie值
  mUtils.setCookie("SelCityRegionArrCookie", _selCityRegionArr);
  return;
}

/**
 * 得到 用户选择的城市区域代号信息 --Cookie值 
 * @param {*} pCallBack 
 */
function getSelCityRegionArrCookie(pCallBack) {
  mUtils.getCookie("SelCityRegionArrCookie", res => {
    //构造返回Json
    var _jsonBack = "{";

    if (res == "" || res == null || res == undefined) {
      _jsonBack += "\"ProvinceCode\":\"430000\","
      _jsonBack += "\"CityCode\":\"430100\","
      _jsonBack += "\"ProvinceName\":\"湖南省\","
      _jsonBack += "\"CityName\":\"长沙市\""
    } else {
      var _selCityRegionArr = mUtils.splitStringJoinChar(res, "^");
      var _codeArr = mUtils.splitStringJoinChar(_selCityRegionArr[0], "_");
      var _nameArr = mUtils.splitStringJoinChar(_selCityRegionArr[1], "_");
      //构造返回Json
      _jsonBack += "\"ProvinceCode\":\"" + _codeArr[0] + "\","
      _jsonBack += "\"CityCode\":\"" + _codeArr[1] + "\","
      _jsonBack += "\"ProvinceName\":\"" + _nameArr[0] + "\","
      _jsonBack += "\"CityName\":\"" + _nameArr[1] + "\""
    }
    _jsonBack += "}";
    mUtils.logOut(_jsonBack);
    pCallBack(JSON.parse(_jsonBack));
    return;

  });
}

//==============省市 地区二级联动===============//

/**
 * 加载小程序省市二级联动json数据，并返回数组对象
 */
function loadWxMiniRegionCodeProvinceCityData(pCallBack) {
  if (pCallBack == undefined || pCallBack == null) {
    pCallBack = function () {};
  }

  var multiIndex = [0, 0];
  var multiArray = [
    ['北京市'],
    ['北京市']
  ]
  var objectMultiArray = new Array();

  //构造POST参数
  var _dataPOST = {
    "Type": "1",
  };
  //正式发送Http请求
  mHttp.postHttp(app.apiURLData.regionNameCodeApi_Index, _dataPOST, jsonReTxt => {
    mUtils.logOut(jsonReTxt);

    //第一级数据
    for (var i = 0; i < jsonReTxt.ProvinceList.length; i++) {
      multiArray[0][i] = jsonReTxt.ProvinceList[i].REGIONNAME;
    }

    //第二级数据
    objectMultiArray = jsonReTxt.CityList;

    //返回数据
    pCallBack(multiIndex, multiArray, jsonReTxt.ProvinceList, objectMultiArray);

  });

}

//-----第一级的Json----//
// [
//   ['北京','安徽', "福建", "甘肃", "广东"],
//   ['北京']
// ]
//-----第二级的Json----//
// [{
//   "REGIONCODE": "430100",
//   "PCODE": "430000",
//   "REGIONNAME": "长沙市"
// }, {
//   "REGIONCODE": "430102",
//   "PCODE": "430100",
//   "REGIONNAME": "芙蓉区"
// }]

// ------========城市选择器变量=========-------//
// multiIndex: [0, 0],
// multiArray: null,
// objectMultiArray: null,
// objectProvinceList: null,
// objectSelCityRegionArrColumnChange: null, //Picker 城市列表变化时获取的,最终城市信息对象
// cityListColumnChange: null, //Picker 省列表变化时获取的城市信息列表对象

//----得到当前选择的 城市名称 --用于显示----//
// mBusiRegion.showSelRegionCityName(res => {
//   this.setData({
//     selRegionCityName: res,
//   });
// });

// //----加载小程序省市二级联动json数据，并返回数组对象-----//
// mBusiRegion.loadWxMiniRegionCodeProvinceCityData((outMultiIndex, outMultiArray, outObjectProvinceList, outObjectMultiArray) => {
//   // console.log(outMultiIndex);
//   // console.log(outMultiArray);
//   // console.log(outObjectMultiArray);
//   this.setData({
//     multiIndex: outMultiIndex,
//     multiArray: outMultiArray,
//     objectProvinceList: outObjectProvinceList,
//     objectMultiArray: outObjectMultiArray
//   });
// });


//========================城市选择器 函数=======================//
// bindMultiPickerChange: function (e) {

//   this.setData({
//     "multiIndex[0]": e.detail.value[0],
//     "multiIndex[1]": e.detail.value[1]
//   })

//   //单击确定按钮保存选择的城市值 Cookie中
//   mBusiRegion.setSelCityRegionArrCookie(this.data.objectSelCityRegionArrColumnChange.ProvinceCode, this.data.objectSelCityRegionArrColumnChange.CityCode, this.data.objectSelCityRegionArrColumnChange.ProvinceName, this.data.objectSelCityRegionArrColumnChange.CityName);

//   //设置选择的城市名称 - 显示
//   this.setData({
//     selRegionCityName: this.data.objectSelCityRegionArrColumnChange.CityName,
//   });

// },
// bindMultiPickerColumnChange: function (e) {

//   console.log(e);

//   var cityList = [];

//   switch (e.detail.column) {
//     case 0:
//       var list = [];
//       for (var i = 0; i < this.data.objectMultiArray.length; i++) {
//         if (this.data.objectMultiArray[i].PCODE == this.data.objectProvinceList[e.detail.value].REGIONCODE) {
//           list.push(this.data.objectMultiArray[i].REGIONNAME);

//           var _cityMsg = {};
//           _cityMsg.REGIONCODE = this.data.objectMultiArray[i].REGIONCODE;
//           _cityMsg.REGIONNAME = this.data.objectMultiArray[i].REGIONNAME;
//           cityList.push(_cityMsg);
//         }
//       }
//       this.setData({
//         "multiArray[1]": list,
//         "multiIndex[0]": e.detail.value,
//         "multiIndex[1]": 0,
//         cityListColumnChange: cityList,
//       })
//   }

//   //获取最终选择的值
//   var _provinceCode = "";
//   var _provinceName = "";
//   var _cityCode = "";
//   var _cityName = "";

//   //省这一列变动时
//   if (e.detail.column == 0) {
//     _provinceCode = this.data.objectProvinceList[e.detail.value].REGIONCODE;
//     _provinceName = this.data.objectProvinceList[e.detail.value].REGIONNAME;
//     _cityCode = cityList[0].REGIONCODE;
//     _cityName = cityList[0].REGIONNAME;
//   }

//   //城市这一列变动时
//   if (e.detail.column == 1) {
//     _provinceCode = this.data.objectSelCityRegionArrColumnChange.ProvinceCode;
//     _provinceName = this.data.objectSelCityRegionArrColumnChange.ProvinceName;
//     _cityCode = this.data.cityListColumnChange[e.detail.value].REGIONCODE;
//     _cityName = this.data.cityListColumnChange[e.detail.value].REGIONNAME;
//   }

//   var _jsonSelCityRegionArrColumnChange = "{";
//   _jsonSelCityRegionArrColumnChange += "\"ProvinceCode\":\"" + _provinceCode + "\","
//   _jsonSelCityRegionArrColumnChange += "\"CityCode\":\"" + _cityCode + "\","
//   _jsonSelCityRegionArrColumnChange += "\"ProvinceName\":\"" + _provinceName + "\","
//   _jsonSelCityRegionArrColumnChange += "\"CityName\":\"" + _cityName + "\""
//   _jsonSelCityRegionArrColumnChange += "}"
//   mUtils.logOut(_jsonSelCityRegionArrColumnChange);
//   //设置公共变量值
//   this.setData({
//     objectSelCityRegionArrColumnChange: JSON.parse(_jsonSelCityRegionArrColumnChange),
//   });


// },



/* <picker mode="multiSelector" bindchange="bindMultiPickerChange" bindcolumnchange="bindMultiPickerColumnChange"
value="{<!-- -->{multiIndex}}" range="{<!-- -->{multiArray}}">
<view class="picker">
  当前选择：{
  <!-- -->{multiArray[0][multiIndex[0]]}}，{
  <!-- -->{multiArray[1][multiIndex[1]]}}
</view>
</picker> */