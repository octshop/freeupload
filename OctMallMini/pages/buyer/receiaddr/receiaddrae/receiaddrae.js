// pages/buyer/receiaddr/receiaddrae/receiaddrae.js
//==============引入相关的Js文件========//
var mHttp = require('../../../../utils/http.js');
var mUtils = require('../../../../utils/util.js');
var mBusiLogin = require('../../../../busicode/busilogin.js');
var mBusiCookie = require('../../../../busicode/busicookie.js');

//--------页面公共变量-------//
var mbackurl = ""; //返回的页面URL
//当前区域 
var RegionNameArr = "湖南省_长沙市_岳麓区";

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
    //--------------自定义变量-----------//
    region: ["湖南省", "长沙市", "岳麓区"], //省市区选择器
    regionShowDefault: "湖南省_长沙市_岳麓区",
    regionCodeArr: "430000_430100_430104",
    switchChecked: true, //Switch按钮是否选中
    bReceiAddrID: "", //当前收货地址ID
    initBuyerReceiAddr_Data: null, //初始化收货地址
    redirectType: "", //跳转到此页的类型 sel 为选择地址


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

    //获取参数
    var _bReceiAddrID = options.RAID; //收货地址ID
    console.log("_bReceiAddrID=" + _bReceiAddrID);
    mbackurl = options.backurl; //返回URL


    //-----判断用户是否登录 没有登录 则跳转到指定URL 并设置UserID,LoginSha1-----//
    mBusiLogin.isLoginUserNavigateSetUserIDPwdSha1Global(res => {
      //console.log(res)
      //------登录成功后的调用函数-------//

      if (_bReceiAddrID != undefined && _bReceiAddrID != "" && _bReceiAddrID != "0") {
        //初始化买家收货地址
        this.initBuyerReceiAddr();
      }


    }, false, "../../../../pages/login/bindmobile/bindmobile", "../../../pages/buyer/receiaddr/receiaddrae/receiaddrae");

    //-------设置全局变量--------//
    this.setData({
      bReceiAddrID: _bReceiAddrID,
      redirectType: options.type,
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
  //======================自定义函数=======================//
  /**
   * 初始化买家收货地址
   */
  initBuyerReceiAddr: function () {

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "2",
      "BReceiAddrID": this.data.bReceiAddrID,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.buyerApi_ReceiAddrEdit, _dataPOST, _jsonReTxt => {

      if (_jsonReTxt.BReceiAddrID > 0) {

        var _switchChecked = false;
        if (_jsonReTxt.AddrType == "default") {
          _switchChecked = true;
        }
        //设置公共变量
        this.setData({
          initBuyerReceiAddr_Data: _jsonReTxt,
          regionShowDefault: _jsonReTxt.RegionNameArr,
          switchChecked: _switchChecked,
        });
      }

    });

  },
  /**
   * 提交表单
   */
  formSubmit: function (e) {
    console.log(e.detail.value);
    var _detailVal = e.detail.value;
    var ReceiName = _detailVal.ReceiName;
    var Mobile = _detailVal.Mobile;
    var DetailAddr = _detailVal.DetailAddr;
    if (ReceiName == "" || Mobile == "" || DetailAddr == "") {
      mUtils.showToast("所有选项都必须填写！");
      return;
    }
    //地址类型( default 默认，general 一般 )  地址中必须有一个是：default
    var _switchCheckedVal = "general";
    if (this.data.switchChecked == true) {
      _switchCheckedVal = "default";
    }

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
      "BReceiAddrID": this.data.bReceiAddrID,
      "ReceiName": ReceiName,
      "Mobile": Mobile,
      "DetailAddr": DetailAddr,
      "AddrType": _switchCheckedVal,
      "RegionCodeArr": this.data.regionCodeArr,
    };

    //加载提示
    mUtils.showLoadingWin("保存中");

    var _buyerApiReceiAddrURL = app.apiURLData.buyerApi_ReceiAddrAdd;
    if (parseInt(this.data.bReceiAddrID) > 0) {
      _buyerApiReceiAddrURL = app.apiURLData.buyerApi_ReceiAddrEdit;
    }

    //正式发送Http请求
    mHttp.postHttp(_buyerApiReceiAddrURL, _dataPOST, _jsonReTxt => {
      //移除加载提示
      mUtils.hideLoadingWin();
      //错误提示
      if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != "") {
        mUtils.showToast(_jsonReTxt.ErrMsg);
        return;
      }
      //成功提示
      if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != "") {
        mUtils.showToastCb(_jsonReTxt.Msg, () => {

          if (this.data.redirectType == "add") {

            //设置当前选择收货地址
            mBusiCookie.saveBuyerSelReceiAddrRegionCookie(_jsonReTxt.DataDic.BReceiAddrID, _jsonReTxt.DataDic.RegionCodeArr, _jsonReTxt.DataDic.RegionNameArr);

            //格式化，回跳的URL字符串，把 ^ 换成 ?  把 ~ 换成 = 把 & 换成 |
            mbackurl = mUtils.formatBackURLParamChar(mbackurl);
            console.log("mbackurl=" + mbackurl);

            if (mbackurl.indexOf('orderdetail') >= 0 || mbackurl.indexOf('orderpay') >= 0 || mbackurl.indexOf('afterapply') >= 0 || mbackurl.indexOf('presentorderdetail') >= 0) {
              if (mbackurl.indexOf('afterapply') >= 0) {
                //执行不能返回的跳转 ， 跳转回订单详情，修改收货地址
                mUtils.redirectToURL("../../../../" + mbackurl + "?BID=" + _jsonReTxt.DataDic.BReceiAddrID);
              } else {
                //执行不能返回的跳转 ， 跳转回订单详情，修改收货地址
                mUtils.redirectToURL("../../../../" + mbackurl + "&BID=" + _jsonReTxt.DataDic.BReceiAddrID);
              }
            } else {
              //执行不能返回的跳转
              mUtils.redirectToURL("../../../../" + mbackurl);
            }


          } else {
            //跳转到收货地址列表
            mUtils.navigateToURL("../../../../pages/buyer/receiaddr/receiaddrlist/receiaddrlist");
          }



        });
        return;
      }
    });
  },
  /**
   * 省市区选择器 选择值后
   */
  bindRegionChange: function (e) {
    console.log(e);
    //为选择值变量赋值
    RegionNameArr = e.detail.value.join("_");
    var RegionCodeArr = e.detail.code.join("_");
    console.log(RegionNameArr);
    this.setData({
      regionShowDefault: RegionNameArr,
      regionCodeArr: RegionCodeArr,
    });
  },
  /**
   * Switch按钮变化
   * @param {*} e 
   */
  switchChange: function (e) {
    console.log(e.detail.value);
    var _switchChecked = e.detail.value;
    this.setData({
      switchChecked: _switchChecked,
    });
  },



})