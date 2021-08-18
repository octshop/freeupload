//---------------引用文件-----------//
var mUtils = require('../../../utils/util.js');
var mHttp = require('../../../utils/http.js');

//------初始化APP对象-----//
var app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    apiWebDoamin: app.globalData.apiWebDoamin, //小程序Api的网站域名
    octShopWapDoamin: app.globalData.OctShopWapDoamin, //OctShopWap 商城官网移动版 域名地址,小程序首页
    navbarHeight: 0, //navBar的高度
    octContentMarginTop: 0,
    //-----------自定义公共变量-------//
    loadHomeArtSpec_Data: null, //加载首页特性文章列表
    loadFooterMsgOctShop_Data:null, //加载页脚下面的信息OctShopWap
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //---得到navBar的高度----//
    var _navbarHeight = this.selectComponent("#NavBar").getNavBarHeight();
    this.setData({
      navbarHeight: _navbarHeight,
      octContentMarginTop: _navbarHeight - 3
    });

    //加载首页特性文章列表
    this.loadHomeArtSpec();
    //加载页脚下面的信息OctShopWap
    this.loadFooterMsgOctShop();

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //==============自定义函数============//
  /**
   * 加载首页特性文章列表
   */
  loadHomeArtSpec: function () {

    //-----构造POST参数-----//
    var _dataPOST = {
      "Type": "1",
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiCompanyWebURLData.OctShopWapApi_Index, _dataPOST, _jsonReTxt => {

      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }

      //格式化数据
      for (var i = 0; i < _jsonReTxt.ArtSpecList.length; i++) {
        // _jsonReTxt.ArtSpecList[i].ArtSketch = mUtils.strReplace(  _jsonReTxt.ArtSpecList[i].ArtSketch,"<b","<text");
        // _jsonReTxt.ArtSpecList[i].ArtSketch = mUtils.strReplace(  _jsonReTxt.ArtSpecList[i].ArtSketch,"</b","</text");
      }

      //设置公共变量
      this.setData({
        loadHomeArtSpec_Data: _jsonReTxt,
      });


    });


  },
  /**
   * 加载页脚下面的信息OctShopWap
   */
  loadFooterMsgOctShop: function () {

    //-----构造POST参数-----//
    var _dataPOST = {
      "Type": "2",
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiCompanyWebURLData.OctShopWapApi_Index, _dataPOST, _jsonReTxt => {

      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }

      //设置公共变量
      this.setData({
        loadFooterMsgOctShop_Data: _jsonReTxt,
      });
    });


  },

  

  //==================公共函数============//
  /**
   * 跳转到页面 navigate
   * @param {} e 
   */
  navigateToURL: function (e) {
    console.log(e);
    var _dataSet = e.currentTarget.dataset;

    var _openType = _dataSet.openType;

    if (_openType == "navigate") {
      //跳转
      mUtils.navigateToURL(_dataSet.navigateUrl);
    } else if (_openType == "redirect") {
      mUtils.redirectToURL(_dataSet.navigateUrl);
    } else {
      //跳转
      mUtils.navigateToURL(_dataSet.navigateUrl);
    }
  },

    /**
   * 拨打电话
   * @param {} e 
   */
  makePhoneCall: function (e) {
    //mUtils.logOut(e.target.dataset.phoneNumber)
    var _dataSet = e.currentTarget.dataset;
    //拨打电话
    mUtils.makePhoneCall(_dataSet.phoneNumber);
  },

    /**
   * 复制内容到剪贴板上
   * @param {*} e 
   */
  copyContentClipboard: function (e) {
    var _copyContent = e.currentTarget.dataset.copyContent;
    mUtils.copyContentClipboard(_copyContent);
  },


})