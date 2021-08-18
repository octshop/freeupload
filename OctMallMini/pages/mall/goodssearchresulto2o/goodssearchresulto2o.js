// pages/mall//goodssearchresulto2o/goodssearchresulto2o.js
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
    //-----------------自定义变量-------------//
    searchTxt: "", //搜索的内容
    regionCountyCode: "", //当前选择的县区代号
    regionCountyName: "全部地区",//当前选择的县区名称
    pageOrderName: "Distance", //排序类型 Distance 距离最近  GoodsPriceAsc 价格升序 GoodsPriceDesc 价格降序 WriteDate 新品 SaleCount 销量最高
    regionCityCode: "", //当前城市的代号
    lngLatCookie: "", //当前用户的位置, longitude ^ latitude
    numberPage_Page: null, //加载数据分页
    isFilterShow: false, //是否显示过滤层
    goodsPriceSort: "GoodsPriceAsc", //切换价格排序
    selCityRegionCodeArr: "", //当前选择城市代号拼接  从Cookie中得到相关值 [ 430000_430100 ]
    loadCurUserCountyList_Data: null, //加载当前用户所在城市 的区县列表，没有登录则加载默认或已选择的

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //通过获取系统信息计算导航栏高度,并设置navBar的top和高度
    this.getSysStatusBarHeight();

    //---得到navBar的高度----//
    var _navbarHeight = this.selectComponent("#NavBar").getNavBarHeight();
    this.setData({
      navbarHeight: _navbarHeight,
      octContentMarginTop: _navbarHeight + 78,
    });

    //-----获取传递的参数----//
    var _searchTxt = options.SC;
    this.setData({
      searchTxt: _searchTxt,
    });

    // 如果用户登录啦，则设置全局的  loginBuyerUserID 和 loginPwdSha1 可根据这两个参数是否为空，判断是否用户登录
    mBusiLogin.setLoginBuyerUserIDPwdSha1Global(res => {
      //用户已登录的状态
      if (res != "") {

      }
    });

    //得到当前小程序 用户位置信息 Cookie值 
    mBusiLocation.getLngLatCookie(res => {
      //mUtils.logOut(res);
      var resArr = mUtils.splitStringJoinChar(res);
      if (res != "") {
        this.setData({
          lngLatCookie: resArr[0] + "^" + resArr[1],
        })
      }


      //-----得到用户选择的区域  没有选择区域时，设置默认的区域-----//
      mBusiRegion.getUserSelCityRegionArrCookie(res => {
        //console.log(res);
        this.setData({
          selCityRegionCodeArr: res.ProvinceCode + "_" + res.CityCode,
          regionCityCode: res.CityCode,
        });

        //加载当前用户所在城市 的区县列表，没有登录则加载默认或已选择的
        this.loadCurUserCountyList(() => {

          //---加载数据分页----//
          //初始化搜索条件
          this.initSearchWhereArr();
          //加载数据分页 - 网络请求
          this.numberPage();

        });

      });




    });



  },

  // 通过获取系统信息计算导航栏高度,并设置navBar的top和高度
  getSysStatusBarHeight: function () {
    var that = this,
      sysinfo = wx.getSystemInfoSync(),
      statusHeight = sysinfo.statusBarHeight //顶部显示电池的状态栏高度
      ,
      screenHeight = sysinfo.screenHeight //屏幕高度
      ,
      windowHeight = sysinfo.windowHeight //内容窗口的高度
      ,
      isiOS = sysinfo.system.indexOf('iOS') > -1,
      navHeight;
    if (!isiOS) {
      navHeight = 34;
    } else {
      navHeight = 30;
    }
    that.setData({
      slideCoverHeight: screenHeight,
      slideHeight: windowHeight
    })
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
   * 返回到搜索表单
   */
  backSearch: function () {
    wx.navigateBack({
      delta: 1
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
  //=====================自定义函数===========================//
  /**
   * 添加搜索商品历史记录
   */
  addSearchHistoryGoods: function () {

    if (app.globalData.loginBuyerUserID == "" || app.globalData.loginBuyerUserID == undefined) {
      return;
    }

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "2",
      "BuyerUserID": app.globalData.loginBuyerUserID,
      "SearchContent": this.data.searchTxt,
      "IsEntity": "true",
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.searchApi_SearchGoodsResult, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }
    });

  },

  /**
   * 加载当前用户所在城市 的区县列表，没有登录则加载默认或已选择的
   */
  loadCurUserCountyList: function (pCallBack) {

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "2",
      "SelCityRegionCodeArr": this.data.selCityRegionCodeArr,
      "BuyerUserID": app.globalData.loginBuyerUserID,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.searchApi_SearchGoodsResultO2o, _dataPOST, _jsonReTxt => {
      //回调函数
      pCallBack();
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }
      //设置公共变量
      this.setData({
        loadCurUserCountyList_Data: _jsonReTxt,
      });

    });

  },

  /**
   * 选择地区范围
   */
  clickItemSearchWhere1: function (e) {
    var _regionCountyCode = e.currentTarget.dataset.regionCountyCode;
    var _regionCountyName = e.currentTarget.dataset.regionCountyName;
    this.setData({
      regionCountyCode: _regionCountyCode,
      regionCountyName:_regionCountyName,
      isFilterShow: false, //关闭窗口
    });

    //初始化搜索条件
    this.initSearchWhereArr();
    //加载数据分页 - 网络请求
    this.numberPage();

  },

  /**
   * 显示地区选择窗口
   */
  showItemSearchWhere1: function () {
    this.setData({
      isFilterShow: true,
    });
  },

  /**
   * 选择排序方式
   */
  clickItemSearchWhere2: function (e) {
    var _pageOrderName = e.currentTarget.dataset.pageOrderName;
    this.setData({
      pageOrderName: _pageOrderName,
    });
    //初始化搜索条件
    this.initSearchWhereArr();
    //加载数据分页 - 网络请求
    this.numberPage();
  },

  /**
   * 切换价格排序
   */
  chgTabPrice: function () {

    if (this.data.pageOrderName == "GoodsPriceAsc") {
      this.setData({
        pageOrderName: "GoodsPriceDesc",
      });

    } else {
      this.setData({
        pageOrderName: "GoodsPriceAsc",
      });
    }

    //初始化搜索条件
    this.initSearchWhereArr();
    //加载数据分页 - 网络请求
    this.numberPage();

  },



  //=====================数据分页==========================//
  /**
   * 初始化搜索条件
   * @param {*} pPageOrderName  Distance 距离最近  GoodsPriceAsc 价格升序 GoodsPriceDesc 价格降序 WriteDate 新品 SaleCount 销量最高
   */
  initSearchWhereArr: function () {

    mSearchWhereArr = this.data.regionCountyCode + "^" + this.data.pageOrderName + "^" + this.data.searchTxt;

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
      "LngLatCookie": this.data.lngLatCookie,
      "RegionCityCode": this.data.regionCityCode,
      "BuyerUserID": app.globalData.loginBuyerUserID,
    };

    //判断是否分页Http是否发送中
    if (mPageHttpSending == true) {
      return;
    }
    mPageHttpSending = true;

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.searchApi_SearchGoodsResultO2o, _dataPOST, res => {

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

      //------格式化分页数据-----//
      if (res != "") {
        for (var i = 0; i < res.DataPage.length; i++) {
          if (res.DataPage[i].GoodsTitle.length > 30) {
            res.DataPage[i].GoodsTitle = res.DataPage[i].GoodsTitle.substring(0, 30) + "…";
          }
        }
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

      //------设置公共变量-----//
      this.setData({
        numberPage_Page: _numberPage_Page,
      });

      //添加搜索商品历史记录
      if (pPageCurrent == "1" && res.DataPage.length > 0) {
        this.addSearchHistoryGoods();
      }


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