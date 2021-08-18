// pages/mall/coupons/coupons.js
//==============引入文件===========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiLogin = require('../../../busicode/busilogin.js');

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
    apiWebDoamin: app.globalData.apiWebDoamin, //小程序Api的网站域名
    navbarHeight: 0, //navBar的高度
    navBarSubTop: 0, //子菜单距顶部高度
    octContentMarginTop: 0, //主体内容距子导航的距离
    // ----------------自定义变量-----------//
    isFilterShow: false, //是否显示条件选择 
    shopTypeIdSec: "", //第二级店铺分类
    shopTypeNameSec: "全部分类", //当前选择的分类名称
    isOfflineUse: "", //是否线下使用
    regionCountyCode: "", //区县代号
    expenseReachSum: "", //消费满多少
    loadCouponsShopType_Data: null, //加载店铺显示分类

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
    this.setData({
      navbarHeight: _navbarHeight,
      navBarSubTop: _navbarHeight,
      octContentMarginTop: _navbarHeight + 31,
    });

    //-------调用自定义方法-------//
    //加载店铺显示分类
    this.loadCouponsShopType(() => {

      //加载数据分页 - 网络请求
      this.numberPage();

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
   * 进入搜索
   */
  home: function () {
    wx.switchTab({
      url: '../../../pages/tabbar/index/index',
    })
  },
  /**
   * 显示与关闭 第三级分类面板
   */
  toggleShowSubType: function () {
    if (this.data.isSubTypeShow == false) {
      this.setData({
        isSubTypeShow: true,
      });
    } else {
      this.setData({
        isSubTypeShow: false,
      });
    }
  },
  /**
   * 关闭 第三级分类面板
   */
  closeShowSubType: function () {
    this.setData({
      isFilterShow: false,
    });
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
   * 显示地区选择窗口
   */
  showItemSearchWhere1: function () {
    this.setData({
      isFilterShow: true,
    });
  },

  /**
   * 选择第一个条件
   */
  clickItemSearchWhere1: function (e) {

    var _shopTypeIdSec = e.currentTarget.dataset.shopTypeIdSec;
    var _shopTypeNameSec = e.currentTarget.dataset.shopTypeNameSec;

    this.setData({
      shopTypeIdSec: _shopTypeIdSec,
      isFilterShow: false, //关闭窗口
      shopTypeNameSec: _shopTypeNameSec,
    });

    //加载数据分页 - 网络请求
    this.numberPage();

  },

  /**
   * 选择排序方式
   */
  clickItemSearchWhere2: function (e) {
    var _pageOrderName = e.currentTarget.dataset.pageOrderName;
    if (_pageOrderName == "NoExpenseReach") {
      this.setData({
        expenseReachSum: "1",
        pageOrderName: _pageOrderName,
      });
    } else {
      this.setData({
        expenseReachSum: "",
        pageOrderName: _pageOrderName,
      });
    }




    //初始化搜索条件
    // this.initSearchWhereArr(_pageOrderName);
    //加载数据分页 - 网络请求
    this.numberPage();
  },

  /**
   * 加载店铺显示分类
   */
  loadCouponsShopType: function (pCallBack) {

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "2",
      "IsEntity": "false",
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.mallApi_Coupons, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }
      //设置公共变量
      this.setData({
        loadCouponsShopType_Data: _jsonReTxt,
      });

      //回调函数
      pCallBack();

    });

  },


  //=====================数据分页==========================//
  /**
   * 初始化搜索条件
   * @param {*} pPageOrderName  
   */
  initSearchWhereArr: function (pPageOrderName = "Commend", pIsOnlyDiscount = "true") {
    //SearchKeyword + "^" + pPageOrderName + "^" + pIsOnlyDiscount + "^" + pIsOnlyGroup
    mSearchWhereArr = " ^" + pPageOrderName + "^" + pIsOnlyDiscount + "^true";
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
      "SearchWhereArr": mSearchWhereArr,
      "ShopTypeID": this.data.shopTypeIdSec,
      //"IsEntity": "",
      "IsOfflineUse": this.data.isOfflineUse,
      "RegionCountyCode": this.data.regionCountyCode,
      "ExpenseReachSum": this.data.expenseReachSum,
    };

    //判断是否分页Http是否发送中
    if (mPageHttpSending == true) {
      return;
    }
    mPageHttpSending = true;

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.mallApi_Coupons, _dataPOST, res => {

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

          if (res.DataPage[i].CouponsTitle.length > 19) {
            res.DataPage[i].CouponsTitle = res.DataPage[i].CouponsTitle.substring(0, 19) + "…";
          }

          //---计算价格----//
          var _goodsPrice = "";


          //构造Json字符串
          _numberPage_Page_CustomJson += "{";
          _numberPage_Page_CustomJson += "\"goodsPrice\":\"" + _goodsPrice + "\""
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