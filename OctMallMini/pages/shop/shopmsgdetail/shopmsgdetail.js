// pages/shop/shopmsgdetail/shopmsgdetail.js
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiCode =  require('../../../busicode/busicode.js');

//------公共变量------//


//------初始化APP对象-----//
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopID: 0, //店铺ID
    apiWebDoamin: app.globalData.apiWebDoamin, //小程序Api的网站域名
    navbarHeight: 0, //navBar的高度
    octContentMarginTop: 0, //主体内容距子导航的距离
    loadShopDetailMsg_Data: null, //加载店铺详细信息
    appraiseStarRed: 5, //红星
    appraiseStarGray: 0, //灰星
    avgConformityScoreObj: null,
    avgAttitudeScoreObj: null,
    avgExpressScoreObj: null,
    avgDeliverymanScoreObj: null,
    showData: null, //显示页面数据
    loadShopLogoImg_Data: null, //加载店铺Logo门头照片
    preImgUrlArr: null, //图片预览数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //---得到navBar的高度----//
    var _navbarHeight = this.selectComponent("#NavBar").getNavBarHeight();
    this.setData({
      navbarHeight: _navbarHeight,
      octContentMarginTop: _navbarHeight
    });

    console.log("options.SID=" + options.SID);

    //设置公共变量
    this.setData({
      shopID: options.SID,
    });

    //-----------调用方法函数-------------//
    //加载店铺详细信息
    this.loadShopDetailMsg();
    //加载店铺Logo门头照片
    this.loadShopLogoImg();
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
   * 商城首页
   */
  home: function () {
    wx.switchTab({
      url: '../../tabbar/index/index',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //====================自定义函数========================//

  /**
   * 买家关注店铺
   */
  addBuyerFocusFav:function(e){
    console.log(e);
    var _dataSet = e.currentTarget.dataset;
    //console.log(_dataSet);
    //买家关注店铺
    mBusiCode.addBuyerFocusFav(_dataSet.shopId,"../../../pages/shop/shopmsgdetail/shopmsgdetail^SID~" + _dataSet.shopId);
  },

  /**
   *  加载店铺详细信息
   */
  loadShopDetailMsg: function () {
    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "1",
      "ShopID": this.data.shopID,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.shopApi_ShopMsgDetail, _dataPOST, res => {

      var _appraiseStarRed = Math.floor(res.ShopAppraise.AvgShopScore);
      var _appraiseStarGray = 5 - _appraiseStarRed;

      var _avgConformityScoreObj = {
        "appraiseStarRed": Math.floor(res.ShopAppraise.AvgConformityScore),
        "appraiseStarGray": (5 - Math.floor(res.ShopAppraise.AvgConformityScore)),
      };

      var _avgAttitudeScoreObj = {
        "appraiseStarRed": Math.floor(res.ShopAppraise.AvgAttitudeScore),
        "appraiseStarGray": (5 - Math.floor(res.ShopAppraise.AvgAttitudeScore)),
      };

      var _avgExpressScoreObj = {
        "appraiseStarRed": Math.floor(res.ShopAppraise.AvgExpressScore),
        "appraiseStarGray": (5 - Math.floor(res.ShopAppraise.AvgExpressScore)),
      };

      var _avgDeliverymanScoreObj = {
        "appraiseStarRed": Math.floor(res.ShopAppraise.AvgDeliverymanScore),
        "appraiseStarGray": (5 - Math.floor(res.ShopAppraise.AvgDeliverymanScore)),
      };

      var _IsEntityName = "线上店";
      if (res.ShopMsg.IsEntity == "true") {
        _IsEntityName = "有实体店";
      }

      var _IsNormalCompany = "官方审核中";
      if (res.IsNormalCompany == true) {
        _IsNormalCompany = "已通过官方审核";
      }

      //显示代码显示
      var _showData = {
        "IsEntityName": _IsEntityName,
        "IsNormalCompanyName": _IsNormalCompany
      };

      //设置公共变量值
      this.setData({
        loadShopDetailMsg_Data: res,
        appraiseStarRed: _appraiseStarRed,
        appraiseStarGray: _appraiseStarGray,
        avgConformityScoreObj: _avgConformityScoreObj,
        avgAttitudeScoreObj: _avgAttitudeScoreObj,
        avgExpressScoreObj: _avgExpressScoreObj,
        avgDeliverymanScoreObj: _avgDeliverymanScoreObj,
        showData: _showData,
      });

    });

  },
  /**
   * 加载店铺Logo门头照片
   */
  loadShopLogoImg: function () {
    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "2",
      "ShopID": this.data.shopID,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.shopApi_ShopMsgDetail, _dataPOST, res => {

      var _preImgUrlArr = new Array();
      for (var i = 0; i < res.ShopLogoImgList.length; i++) {
        _preImgUrlArr[i] = app.globalData.httpHeader + res.ShopLogoImgList[i].ImgURL;
      }
      
      //设置公共变量
      this.setData({
        loadShopLogoImg_Data: res,
        preImgUrlArr: _preImgUrlArr,
      });

    });

  },

  //====================公共函数========================//
  /**
   * 拨打电话
   * @param {} e 
   */
  makePhoneCall: function (e) {
    //console.log(e.target.dataset.phoneNumber)
    var _dataSet = e.currentTarget.dataset;
    //拨打电话
    mUtils.makePhoneCall(_dataSet.phoneNumber);
  },
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
   * 显示图片预览组件
   * @param {*} e 
   */
  previewImg: function (e) {
    var _dataSet = e.currentTarget.dataset;

    console.log(this.data.preImgUrlArr);
    console.log(_dataSet.preIndex);

    mUtils.previewImg(this.data.preImgUrlArr, _dataSet.preIndex);
  }

})