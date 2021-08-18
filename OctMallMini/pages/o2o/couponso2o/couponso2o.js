// pages/o2o//couponso2o/couponso2o.js
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

var mHttpSending = false; //是否正在发送Http请求

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
    tabNum: "1", //当前选项卡的次序
    isFilterShow: false, //是否显示条件选择 
    shopTypeId: "", //店铺二级分类 ID
    shopTypeName: "全部分类", //店铺二级分类 名称
    isOfflineUse: "", //可线下使用
    expenseReachSum: "", //无门槛券
    orderBy: "", //排序类型
    pageOrderCode: "", //排序方式-代码
    pageOrderName: "使用条件", //排序方式-名称
    loadCouponsShopType_Data: null, //加载拼团商品显示分类
    loadCurUserCountyList_Data: null, //加载当前用户所在城市 的区县列表，没有登录则加载默认或已选择的

    // ----------------位置地区-----------//
    lngLatCookie: "", //当前用户的位置, longitude ^ latitude
    regionCityCode: "", //当前选择城市代号
    regionCountyCode: "", //当前选择的县区代号
    regionCountyName: "全部地区", //当前选择的县区名称
    selCityRegionCodeArr: "", //得到 用户选择的城市区域代号拼接  - [ 430000_430100 ] - 省_市

    //------数据分页------//
    numberPage_Page: null, //数据分页对象
    numberPage_Page_Custom: null, //自定义数据分页对象
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
      octContentMarginTop: _navbarHeight + 40,
    });

    //-------调用自定义方法-------//

    //加载优惠券店铺显示分类
    this.loadCouponsShopType();

    // 如果用户登录啦，则设置全局的  loginBuyerUserID 和 loginPwdSha1 可根据这两个参数是否为空，判断是否用户登录
    mBusiLogin.setLoginBuyerUserIDPwdSha1Global(res => {
      //用户已登录的状态
      if (res != "") {}

      //----得到与保存当前用户的位置信息-----//
      mBusiLocation.getSaveUserLoctaion(res => {
        //mUtils.logOut("res.longitude=" + res.longitude + " | res.latitude=" + res.latitude);
        //lngLatCookie: "", //当前用户的位置, longitude ^ latitude
        if (res.longitude == undefined || res.latitude == undefined) {
          return;
        }
        this.setData({
          lngLatCookie: res.longitude + "^" + res.latitude,
        });

        //-----得到用户选择的区域  没有选择区域时，设置默认的区域-----//
        mBusiRegion.getUserSelCityRegionArrCookie(res => {
          //console.log(res);
          this.setData({
            selCityRegionCodeArr: res.ProvinceCode + "_" + res.CityCode,
            regionCityCode: res.CityCode,
          });

          if (mHttpSending == false) {
            mHttpSending = true;
            //加载当前用户所在城市 的区县列表，没有登录则加载默认或已选择的
            this.loadCurUserCountyList(() => {

              //初始化搜索条件
              this.initSearchWhereArr();
              //加载数据分页 - 网络请求
              this.numberPage();

            });
          }

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
   * 第二个顶部导航按钮
   */
  home: function () {
    wx.switchTab({
      url: '../../../pages/tabbar/shopnear/shopnear',
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
   * 显示条件筛选层
   */
  showItemSearchWhere: function (e) {
    var _tabNum = e.currentTarget.dataset.tabNum;
    this.setData({
      isFilterShow: true,
      tabNum: _tabNum,
    });
  },

  /**
   * 选择第一个条件
   */
  clickItemSearchWhere1: function (e) {

    var _shopTypeId = e.currentTarget.dataset.shopTypeId;
    var _shopTypeName = e.currentTarget.dataset.shopTypeName;

    this.setData({
      isFilterShow: false, //关闭窗口
      shopTypeId: _shopTypeId,
      shopTypeName: _shopTypeName,
    });

    //初始化搜索条件
    this.initSearchWhereArr();
    //加载数据分页 - 网络请求
    this.numberPage();

  },

  /**
   * 选择第二个条件
   */
  clickItemSearchWhere2: function (e) {

    var _regionCountyCode = e.currentTarget.dataset.regionCountyCode;
    var _regionCountyName = e.currentTarget.dataset.regionCountyName;

    this.setData({
      isFilterShow: false, //关闭窗口
      regionCountyCode: _regionCountyCode,
      regionCountyName: _regionCountyName,
    });

    //初始化搜索条件
    this.initSearchWhereArr();
    //加载数据分页 - 网络请求
    this.numberPage();

  },

  /**
   * 选择第三个条件
   */
  clickItemSearchWhere3: function (e) {

    var _pageOrderCode = e.currentTarget.dataset.pageOrderCode;
    var _pageOrderName = e.currentTarget.dataset.pageOrderName;

    if (_pageOrderCode == "NoExpenseReach") {
      this.setData({
        expenseReachSum: "1",
        isOfflineUse: "",
        pageOrderCode:_pageOrderCode,
        pageOrderName:_pageOrderName,
      });
  }
  else if (_pageOrderCode == "OfflineUse") {
      this.setData({
        expenseReachSum: "",
        isOfflineUse: "true",
        pageOrderCode:_pageOrderCode,
        pageOrderName:_pageOrderName,
      });
  }
  else{
    this.setData({
      expenseReachSum: "",
      isOfflineUse: "",
      pageOrderCode:"",
      pageOrderName:_pageOrderName,
    });
  }



    this.setData({
      isFilterShow: false, //关闭窗口
      pageOrderCode: _pageOrderCode,
      pageOrderName: _pageOrderName,
      orderBy: _pageOrderCode
    });

    //初始化搜索条件
    this.initSearchWhereArr();
    //加载数据分页 - 网络请求
    this.numberPage();

  },


  /**
   * 加载优惠券店铺显示分类
   */
  loadCouponsShopType: function () {

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "2",
      "IsEntity": "true",
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

      mHttpSending = false;

      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }
      //设置公共变量
      this.setData({
        loadCurUserCountyList_Data: _jsonReTxt,
      });

    });

  },



  //=====================数据分页==========================//
  /**
   * 初始化搜索条件
   * @param {*} pPageOrderName  
   */
  initSearchWhereArr: function () {
    // SearchKeyword + "^" + pPageOrderName + "^" + pIsOnlyDiscount + "^" + pIsOnlyGroup
    mSearchWhereArr = this.data.regionCountyCode + "^" + this.data.pageOrderCode + "^ ";

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
      "ShopTypeID": this.data.shopTypeId,
      "IsEntity": "true",
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