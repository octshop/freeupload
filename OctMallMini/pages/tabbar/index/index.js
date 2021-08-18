// pages/buyer/index.js
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiLogin = require('../../../busicode/busilogin.js');

//----------数据分页----------//
var mSearchWhereArr = ""; //搜索条件拼接字符串 "^"
var mIntPageCurrent = 1; //当前的分页索引
var mPageSum = 1; //总页数
var mRecordSum = 0; //总记录
var mPageHttpSending = false; //数据分页Http发送中

//----------商品分类频道 数据分页----------//
var mSearchWhereArr2 = ""; //搜索条件拼接字符串 "^"
var mIntPageCurrent2 = 1; //当前的分页索引
var mPageSum2 = 1; //总页数
var mRecordSum2 = 0; //总记录
var mPageHttpSending2 = false; //数据分页Http发送中


//创建全局App对象
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: 0,
    navBarHeight: 0,
    navBarSubTop: 0,
    apiWebDoamin: app.globalData.apiWebDoamin, //小程序Api的网站域名
    octContentMarginTop: 0, //设置主体内容离顶部的距离
    // ----------------业务逻辑变量-----------//
    loadGoodsTypeSecLevelWap_Data: null, //加载第二级商品类目
    loadAdvCarousel_Data: null, //加载主轮播图片
    loadListNavIconMsg_Data: null, //栏目图标导航信息
    loadAdvImgList_Data: null, //加载图片列表广告
    loadGoodsTypeThirdLevelBySecWap_Data: null, //加载第三级商品类目
    mTabTypeCurrent: "热门",
    numberPage_Page: null, //数据分页对象
    goodsTypeIdSec: "", //第二级分类ID
    //----------------商品分类频道-----------//

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 通过获取系统信息计算导航栏高度
    this.getSysStatusBarHeight();
    // console.log("statusHeight=" + this.data.statusHeight);
    // console.log("navBarSubTop=" + this.data.navBarSubTop);
    //设置主体内容离顶部的距离
    this.setData({
      octContentMarginTop: this.data.navBarSubTop + 37
    });

    //------------调用自定义方法----------//
    //加载第二级商品类目
    this.loadGoodsTypeSecLevelWap();

    if (this.data.mTabTypeCurrent == "热门") {
      //加载主轮播图片
      this.loadAdvCarousel();
      //栏目图标导航信息
      this.loadListNavIconMsg();
      //加载图片列表广告
      this.loadAdvImgList();
      //加载数据分页 - 网络请求
      this.numberPage();
    }

    //mUtils.confirmWin("【OctShop免费开源大型专业级商城系统】特别提醒：此为系统演示，非正式商城平台，所有数据均为演示或测试数据！",function(){});

  },
  // 通过获取系统信息计算导航栏高度,并设置navBar的top和高度
  getSysStatusBarHeight: function () {
    var that = this,
      sysinfo = wx.getSystemInfoSync(),
      statusHeight = sysinfo.statusBarHeight,
      isiOS = sysinfo.system.indexOf('iOS') > -1,
      navHeight;
    if (!isiOS) {
      navHeight = 34;
    } else {
      navHeight = 30;
    }
    that.setData({
      statusHeight: statusHeight,
      navBarHeight: navHeight,
      navBarSubTop: statusHeight + navHeight + 8,
    })
  },

  onShow: function () {
    //设置底部Tabbar内容
    this.setTabBarContent();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

    if (this.data.mTabTypeCurrent == "热门") {
      //重新加载数据
      this.numberPage("1", res => {
        //停止刷新
        wx.stopPullDownRefresh();
      });
    } else {
      //重新加载数据
      this.numberPage2("1", res => {
        //停止刷新
        wx.stopPullDownRefresh();
      });
    }


  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    if (this.data.mTabTypeCurrent == "热门") {
      //下一页 --数据分页
      this.nextPage();
    } else {
      //下一页 --数据分页
      this.nextPage2();
    }


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //==================自定义函数=================//
  /**
   * 设置底部Tabbar内容
   */
  setTabBarContent: function () {

    //记录当前进入的TabBar索引，以便加载中间Tabbar的内容
    app.globalData.tabbarMidIndex = 0;

    //设置中间TabBar样式
    wx.setTabBarItem({
      index: 2,
      text: '附近',
      iconPath: 'assets/imgs/icons/navlocation.png',
      selectedIconPath: 'assets/imgs/icons/navlocation_red.png'
    })
    console.log("设置中间TabBar样式");
    // wx.setTabBarBadge({
    //   index: 4,
    //   text: '10'
    // })
  },
  // -----切换 分类 Tab-----//
  chgTypeTab: function (e) {
    console.log(e.currentTarget);
    var _dataTabType = e.currentTarget.dataset.tabtype;
    var _goodsTypeId = e.currentTarget.dataset.goodsTypeId;
    //记录当前分类名称
    this.setData({
      mTabTypeCurrent: _dataTabType,
      goodsTypeIdSec: _goodsTypeId,
    });
    console.log("mTabTypeCurrent=" + this.data.mTabTypeCurrent);

    //加载其他分类内容
    if (this.data.mTabTypeCurrent != "热门") {
      //加载第三级商品类目
      this.loadGoodsTypeThirdLevelBySecWap(() => {

        //初始化搜索条件
        this.initSearchWhereArr2();
        //加载数据分页 - 网络请求
        this.numberPage2();

      });
    }


  },

  /**
   * 加载第二级商品类目
   */
  loadGoodsTypeSecLevelWap: function () {

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "1",
      "IsEntity": "false",
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.mallApi_GoodsType, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }
      //设置公共变量
      this.setData({
        loadGoodsTypeSecLevelWap_Data: _jsonReTxt
      });

    });

  },

  //==================热门频道 - 函数=================//

  /**
   * 加载主轮播图片
   */
  loadAdvCarousel: function () {
    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "1",
      "AdvOsTypeFix": "Mini",
      "AdvType": "AdvB2c",
      "AdvTitleType": "MallIndex",
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
   * 栏目图标导航信息
   */
  loadListNavIconMsg: function () {
    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "4",
      "NavType": "MallIndex",
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.mallApi_Index, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }
      //设置公共变量
      this.setData({
        loadListNavIconMsg_Data: _jsonReTxt,
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
      "AdvType": "AdvB2c",
      "AdvTitleType": "MallIndex"
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

  //==================商品分类频道 - 函数=================//

  /**
   * 加载第三级商品类目
   */
  loadGoodsTypeThirdLevelBySecWap: function (pCallBack) {

    if (this.data.goodsTypeIdSec == "" || this.data.goodsTypeIdSec == "0") {
      return;
    }

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "2",
      "GoodsTypeIDSec": this.data.goodsTypeIdSec,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.mallApi_GoodsType, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }
      //设置公共变量
      this.setData({
        loadGoodsTypeThirdLevelBySecWap_Data: _jsonReTxt,
      });

      pCallBack();

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
      "IsEntity": "false"
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
        var i=k;
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

  //===================== 第二个 数据分页 -   商品分类频道==========================//
  /**
   * 初始化搜索条件
   */
  initSearchWhereArr2: function (pPageOrderName = "Commend", pIsOnlyDiscount = "false") {
    mSearchWhereArr2 = " ^" + pPageOrderName + "^" + pIsOnlyDiscount;
  },
  /**
   * 加载数据分页 - 网络请求
   * @param {*} pPageCurrent 
   */
  numberPage2: function (pPageCurrent = "1", pCallBack) {

    if (pCallBack == undefined || pCallBack == null || pCallBack == "") {
      pCallBack = function () {};
    }

    //如果是第一页则重新加载数据
    if (pPageCurrent == "1") {
      this.setData({
        numberPage_Page2: null,
      });
    }

    //记录当前的分页索引
    mIntPageCurrent2 = pPageCurrent;

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
      "PageCurrent": pPageCurrent,
      "SearchWhereArr": mSearchWhereArr2,
      "GoodsTypeIDSec": this.data.goodsTypeIdSec,
    };

    //判断是否分页Http是否发送中
    if (mPageHttpSending2 == true) {
      return;
    }
    mPageHttpSending2 = true;

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.searchApi_SearchGoodsResult, _dataPOST, res => {
      //回调函数
      pCallBack(true);

      mPageHttpSending2 = false;

      if (res == "") {
        this.setData({
          numberPage_Page2: null,
        });
        return;
      }

      //------格式化分页数据-----//
      for (var k = 0; k < res.DataPage.length; k++) {

        if (res.DataPage[k].GoodsTitle.length > 21) {
          res.DataPage[k].GoodsTitle = res.DataPage[k].GoodsTitle.substring(0, 21) + "…";
        }

         //------计算折扣------//
         var i=k;
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
      var _numberPage_Page = this.data.numberPage_Page2;
      mPageSum2 = parseInt(res.PageSum);
      mIntPageCurrent2 = parseInt(res.PageCurrent);
      mRecordSum2 = parseInt(res.RecordSum);

      //将数据分页数据添加到公共变量中
      if (this.data.numberPage_Page2 == null) {
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
        numberPage_Page2: _numberPage_Page,
      });

      //console.log(this.data.orderGoodsList);

    });

  },
  /**
   * 下一页 --数据分页
   */
  nextPage2: function () {
    mUtils.logOut("数据分页nextPage2()");
    if (mPageHttpSending2 == true) {
      return;
    }
    if (mIntPageCurrent2 < mPageSum2) {

      mIntPageCurrent2 += 1;

      //数据分页
      this.numberPage2(mIntPageCurrent2);
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