// pages/o2o/shoptypeshow/shoptypeshow.js
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiLogin = require('../../../busicode/busilogin.js');
var mBusiLocation = require('../../../busicode/busilocation.js');
var mBusiRegion = require('../../../busicode/busiregion.js');

//----------数据分页----------//
var mSearchWhereArr = ""; //搜索条件拼接字符串 "^"
var mIntPageCurrent = 1; //当前的分页索引
var mPageSum = 1; //总页数
var mRecordSum = 0; //总记录
var mPageHttpSending = false; //数据分页Http发送中

//创建全局App对象
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: 0,
    apiWebDoamin: app.globalData.apiWebDoamin, //小程序Api的网站域名
    navbarHeight: 0, //navBar的高度
    octContentMarginTop: 0, //主体内容距子导航的距离
    //--------------自定义变量--------------//
    lngLatCookie: "", //当前用户的位置, longitude ^ latitude
    regionCityCode: "", //当前选择城市代号

    //------数据分页------//
    numberPage_Page: null, //数据分页对象
    numberPage_Page_Custom: null, //自定义数据分页对象
    pageOrderName: "WriteDate", //排序方式

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //---得到navBar的高度----//
    var _navbarHeight = this.selectComponent("#NavBar").getNavBarHeight();
    console.log("_navbarHeight=" + _navbarHeight);
    this.setData({
      navbarHeight: _navbarHeight,
      octContentMarginTop: _navbarHeight,
    });

    //----------调用自定义函数----------//

    // 加载O2o店铺类目 (两级分类)
    this.loadShopTypeList();

    // 如果用户登录啦，则设置全局的  loginBuyerUserID 和 loginPwdSha1 可根据这两个参数是否为空，判断是否用户登录
    mBusiLogin.setLoginBuyerUserIDPwdSha1Global(res => {
      //用户已登录的状态
      if (res != "") {

      }

      //----得到与保存当前用户的位置信息-----//
      mBusiLocation.getSaveUserLoctaion(res => {
        //console.log(res);
        //lngLatCookie: "", //当前用户的位置, longitude ^ latitude
        if (res.longitude == undefined || res.latitude == undefined) {
          return;
        }

        this.setData({
          lngLatCookie: res.longitude + "^" + res.latitude,
        });

        //----得到当前选择的 城市名称 --用于显示----//
        mBusiRegion.showSelRegionCityName(res => {
          // this.setData({
          //   selRegionCityName: res,
          // });

          //得到 用户选择的城市区域代号信息 --Cookie值 
          mBusiRegion.getSelCityRegionArrCookie(res => {
            mUtils.logOut(res);
            this.setData({
              regionCityCode: res.CityCode, //当前选择城市代号
            });

              //加载数据分页 - 网络请求
              this.numberPage();


          });

        });

      });


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
   * o2o同城优选
   */
  home: function () {
    wx.switchTab({
      url: '../../../pages/tabbar/shopnear/shopnear',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //重新加载数据
    this.numberPage("1", res => {
      //停止刷新
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //下一页 --数据分页
    this.nextPage();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //================自定义函数===============//

  /**
   * 加载O2o店铺类目 (两级分类)
   */
  loadShopTypeList: function () {

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "1",
      "IsEntity": "true",
      "FatherTypeID": "0",
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.o2oApi_ShopNear, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }
      //设置公共变量
      this.setData({
        loadShopTypeList_Data: _jsonReTxt,
      });

    });


  },

  //=====================数据分页==========================//
  /**
   * 初始化搜索条件
   * @param {*} pPageOrderName  
   */
  initSearchWhereArr: function (pPageOrderName = "Commend", pIsOnlyDiscount = "true") {
    //SearchKeyword + "^" + pPageOrderName + "^" + pIsOnlyDiscount + "^" + pIsOnlyGroup
    // mSearchWhereArr = " ^" + pPageOrderName + "^" + pIsOnlyDiscount + "^false";
  },
  /**
   * 加载数据分页 - 网络请求
   * @param {*} pPageCurrent 
   */
  numberPage: function (pPageCurrent = "1", pCallBack) {

    if (pCallBack == undefined || pCallBack == null || pCallBack == "") {
      pCallBack = function () {};
    }

    //如果是第一页则重新加载数据
    if (pPageCurrent == "1") {
      this.setData({
        numberPage_Page: null,
      });
    }

    //记录当前的分页索引
    mIntPageCurrent = pPageCurrent;

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "1",
      "PageCurrent": pPageCurrent,
      "SearchKeyword": "",
      "OrderBy": "Distance",
      "LoadTypeExtra": "NoPreGoodsList",
      "LngLatCookie": this.data.lngLatCookie,
      "RegionCityCode": this.data.regionCityCode,
      "RegionCountyCode": "",
      "BuyerUserID": app.globalData.loginBuyerUserID,
    };

    //判断是否分页Http是否发送中
    if (mPageHttpSending == true) {
      return;
    }
    mPageHttpSending = true;

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.searchApi_SearchShopResultO2o, _dataPOST, res => {

      //回调函数
      pCallBack(true);

      //可以重新发送Http
      mPageHttpSending = false;

      if (res == "") {
        this.setData({
          numberPage_Page: null,
        });
        return;
      }

      //----自定义数据分页对象----//
      var _numberPage_Page_CustomJson = "{\"DataPageCustom\":[";
      //------格式化分页数据-----//
      if (res != "") {
        for (var i = 0; i < res.DataPage.length; i++) {

          // if (res.DataPage[i].LuckydrawTitle.length > 20) {
          //   res.DataPage[i].LuckydrawTitle = res.DataPage[i].LuckydrawTitle.substring(0, 20) + "…";
          // }

          _numberPage_Page_CustomJson += "{";
          _numberPage_Page_CustomJson += "\"AwardsItem\":\"\""
          _numberPage_Page_CustomJson += "},";
        }
      }
      //去掉前后“,”
      _numberPage_Page_CustomJson = mUtils.removeFrontAndBackChar(_numberPage_Page_CustomJson, ",");
      _numberPage_Page_CustomJson += "]}"
      mUtils.logOut(_numberPage_Page_CustomJson);
      //转换成Json对象
      _numberPage_Page_CustomJson = JSON.parse(_numberPage_Page_CustomJson);

      //----分页Http完成-----//
      var _numberPage_Page = this.data.numberPage_Page;
      mPageSum = parseInt(res.PageSum);
      mIntPageCurrent = parseInt(res.PageCurrent);
      mRecordSum = parseInt(res.RecordSum);

      //----自定义数据分页对象----//
      var _numberPage_Page_Custom = this.data.numberPage_Page_Custom;

      //将数据分页数据添加到公共变量中
      if (this.data.numberPage_Page == null) {
        _numberPage_Page = res;
        //----自定义数据分页对象----//
        _numberPage_Page_Custom = _numberPage_Page_CustomJson;
      } else {
        //添加数据分页中
        _numberPage_Page.PageCurrent = (parseInt(_numberPage_Page.PageCurrent) + 1).toString();
        //添加数组
        _numberPage_Page.DataPage = _numberPage_Page.DataPage.concat(res.DataPage);
        _numberPage_Page.DataPageExtra = _numberPage_Page.DataPageExtra.concat(res.DataPageExtra);

        //----自定义数据分页对象----//
        _numberPage_Page_Custom.DataPageCustom = _numberPage_Page_Custom.DataPageCustom.concat(_numberPage_Page_CustomJson.DataPageCustom);
      }

      //------设置公共变量-----//
      this.setData({
        numberPage_Page: _numberPage_Page,
        numberPage_Page_Custom: _numberPage_Page_Custom, //自定义数据分页对象
      });

    });

  },
  /**
   * 下一页 --数据分页
   */
  nextPage: function () {

    console.log("数据分页nextPage()");

    if (mPageHttpSending == true) {
      return;
    }

    if (mIntPageCurrent < mPageSum) {

      mIntPageCurrent += 1;

      //数据分页
      this.numberPage(mIntPageCurrent);
    }

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






})