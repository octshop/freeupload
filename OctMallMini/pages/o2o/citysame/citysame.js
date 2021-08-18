// pages/o2o/citysame/citysame.js
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiLogin = require('../../../busicode/busilogin.js');
var mBusiRegion = require('../../../busicode/busiregion.js');
var mBusiLocation = require('../../../busicode/busilocation.js');

//----------数据分页----------//
var mSearchWhereArr = ""; //搜索条件拼接字符串 "^"
var mIntPageCurrent = 1; //当前的分页索引
var mPageSum = 1; //总页数
var mRecordSum = 0; //总记录
var mPageHttpSending = false; //数据分页Http发送中

var mHttpSending = false; //Http发送中

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
    // ----------------自定义变量-----------//
    selCityRegionCodeArr: "", //得到 用户选择的城市区域代号拼接  - [ 430000_430100 ] - 省_市
    loadAdvCarousel_Data: null, //加载主轮播图片
    loadGoodsTypeSecLevel_Data: null, //加载第二级商品类目,主要用于手机端(分类显示页) 并SortNum排序
    loadAdvImgList_Data: null, //加载图片列表广告
    numberPage_Page: null, //数据分页对象

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

    mHttpSending = false;

    //加载第二级商品类目,主要用于手机端(分类显示页) 并SortNum排序
    this.loadGoodsTypeSecLevel();

    // 如果用户登录啦，则设置全局的  loginBuyerUserID 和 loginPwdSha1 可根据这两个参数是否为空，判断是否用户登录
    mBusiLogin.setLoginBuyerUserIDPwdSha1Global(res => {
      //用户已登录的状态
      if (res != "") {

      }
    });

    //-----得到 用户选择的城市区域代号信息 --Cookie值 -----//
    mBusiRegion.getSelCityRegionArrCookie(res => {
      mUtils.logOut(res);
      this.setData({
        selCityRegionCodeArr: res.ProvinceCode + "_" + res.CityCode,
      });

      if (mHttpSending == false) {
        mHttpSending = true; //Http发送中
        //加载主轮播图片
        this.loadAdvCarousel();
        //加载图片列表广告
        this.loadAdvImgList();
        //加载数据分页 - 网络请求
        this.numberPage();

      }
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
   * o2o商家分类
   */
  home: function () {
    wx.switchTab({
      url: '../../tabbar/shopnear/shopnear',
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
  //==================自定义函数=================//

  /**
   * 加载主轮播图片
   */
  loadAdvCarousel: function () {
    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "1",
      "AdvOsTypeFix": "Mini",
      "AdvType": "AdvO2o",
      "AdvTitleType": "O2oGoodsIndex",
      "SelCityRegionCodeArr": this.data.selCityRegionCodeArr,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.mallApi_Index, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }
      //设置公共变量
      this.setData({
        loadAdvCarousel_Data: _jsonReTxt,
      });

    });

  },

  /**
   * 加载第二级商品类目,主要用于手机端(分类显示页) 并SortNum排序
   */
  loadGoodsTypeSecLevel: function () {
    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "1",
      "IsEntity": "true",
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.mallApi_GoodsType, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }
      //设置公共变量
      this.setData({
        loadGoodsTypeSecLevel_Data: _jsonReTxt,
      });

    });
  },

  /**
   * 加载图片列表广告
   */
  loadAdvImgList: function () {
    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "3",
      "AdvType": "AdvO2o",
      "AdvTitleType": "O2oGoodsIndex",
      "SelCityRegionCodeArr": this.data.selCityRegionCodeArr,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.mallApi_Index, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }
      //设置公共变量
      this.setData({
        loadAdvImgList_Data: _jsonReTxt,
      });

    });
  },

  //=====================数据分页==========================//
  /**
   * 初始化搜索条件
   */
  initSearchWhereArr: function (pOrderStatus = "") {
    mSearchWhereArr = pOrderStatus; //this.data.shopID + "^" + pPageOrderName + "^" + pIsOnlyDiscount
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
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "5",
      "PageCurrent": pPageCurrent,
      "IsEntity": "true",
      "BuyerUserID": app.globalData.loginBuyerUserID,
    };

    //判断是否分页Http是否发送中
    if (mPageHttpSending == true) {
      return;
    }
    mPageHttpSending = true;

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.mallApi_Index, _dataPOST, res => {
      //回调函数
      pCallBack(true);

      mPageHttpSending = false;

      if (res == "") {
        this.setData({
          numberPage_Page: null,
        });
        return;
      }

      //------格式化分页数据-----//
      for (var k = 0; k < res.DataPage.length; k++) {

        if (res.DataPage[k].GoodsTitle.length > 21) {
          res.DataPage[k].GoodsTitle = res.DataPage[k].GoodsTitle.substring(0, 21) + "…";
        }

        //------计算折扣------//
        var i = k;
        var item = res.DataPage[i];
        if (item.Discount > 0 && item.GroupDiscount <= 0) {
          res.DataPage[i].GoodsPrice = item.GoodsPrice * (item.Discount / 10);
        } else if (item.GroupDiscount > 0) {
          res.DataPage[i].GoodsPrice = item.GoodsPrice * (item.GroupDiscount / 10);
        } else if (item.SkDiscount > 0 && item.GroupDiscount <= 0) {
          res.DataPage[i].GoodsPrice = item.GoodsPrice * (item.SkDiscount / 10);
        }
        res.DataPage[i].GoodsPrice = mUtils.formatNumberDotDigit(res.DataPage[i].GoodsPrice);

      }

      //----分页Http完成-----//
      var _numberPage_Page = this.data.numberPage_Page;
      mPageSum = parseInt(res.PageSum);
      mIntPageCurrent = parseInt(res.PageCurrent);
      mRecordSum = parseInt(res.RecordSum);

      //将数据分页数据添加到公共变量中
      if (this.data.numberPage_Page == null) {
        _numberPage_Page = res;

      } else {
        //添加数据分页中
        _numberPage_Page.PageCurrent = (parseInt(_numberPage_Page.PageCurrent) + 1).toString();
        //添加数组
        _numberPage_Page.DataPage = _numberPage_Page.DataPage.concat(res.DataPage);
        _numberPage_Page.DataPageExtra = _numberPage_Page.DataPageExtra.concat(res.DataPageExtra);

      }

      //console.log(_numberPage_Page);

      //------设置公共变量-----//
      this.setData({
        numberPage_Page: _numberPage_Page,
      });

      //console.log(this.data.orderGoodsList);

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