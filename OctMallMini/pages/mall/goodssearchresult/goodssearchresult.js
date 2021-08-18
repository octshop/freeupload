// pages/mall/goodssearchresult/goodssearchresult.js
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

//------搜索相关变量------//
var mGoodsTypeNeedProp = ""; //商品必填属性（属性名_属性值^属性名_属性值） [ 袖长_无袖^腰型_高腰^廓形_A型^当季热销_121^裙长_超短裙 ]
var mGoodsTypeIDRepeatMax = ""; //搜索商品重复次数最多的商品类目ID


//创建全局App对象
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //-----------侧边栏相关-----------//
    slideCoverHeight: 300, //遮罩层高度
    slideHeight: 300, //侧边栏高度
    slideWidth: 300, //侧边栏宽度
    slideTop: 50, //侧边栏定位Top值
    isShowSlide: true, //是否显示侧边栏
    slideContentHeight: 660, //侧边栏内容高度
    apiWebDoamin: app.globalData.apiWebDoamin, //小程序Api的网站域名
    navbarHeight: 0, //navBar的高度
    octContentMarginTop: 0, //主体内容距子导航的距离
    //-----------------自定义变量-------------//
    searchTxt: "", //搜索的内容
    numberPage_Page: null, //加载数据分页
    curTabClassArr: null, //当前选项卡当前样式数组
    curGoodsPriceOrder: "Desc", //当前商品价格排序方式 Asc,Desc
    tabType: "Commend", //选项卡类别
    goodsPriceSort: "GoodsPriceAsc", //切换价格排序
    getGoodsTypeNeedProp_Data: null, //得到商品类目必填属性集合
    needPropList: null, //得到商品类目必填属性集合 的具体数组值
    isPayDelivery: "",
    isShopExpense: "",
    isOfflinePay: "",
    isHasGift: "",

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
      octContentMarginTop: _navbarHeight + 75,

      //-----侧边栏相关----//
      slideTop: _navbarHeight, //侧边栏定位Top值
      slideHeight: this.data.slideHeight - _navbarHeight,
      slideContentHeight: this.data.slideHeight - _navbarHeight - 38
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


    //-------调用自定义方法------//

    mGoodsTypeIDRepeatMax = "";

    //初始化搜索条件
    this.initSearchWhereArr("Commend", "false");
    //加载数据分页 - 网络请求
    this.numberPage();




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
      "IsEntity": "false",
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.searchApi_SearchGoodsResult, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }
    });

  },

  /**
   * 切换选项卡
   */
  chgTab: function (e) {
    var _tabType = "";
    if (e == undefined) {
      _tabType = this.data.tabType;
    } else {
      _tabType = e.currentTarget.dataset.tabType;
    }
    if (_tabType == "Discount") {
      //设置搜索条件
      this.initSearchWhereArr(_tabType, "true", "false", "false");
    } else if (_tabType == "GroupMsgCount") {
      //设置搜索条件
      this.initSearchWhereArr(_tabType, "false", "true", "false");
    } else if (_tabType == "SecKill") {
      //设置搜索条件
      this.initSearchWhereArr(_tabType, "false", "false", "true");
    } else {
      //设置搜索条件
      this.initSearchWhereArr(_tabType, "false", "false", "false");
    }

    //设置公共变量值
    this.setData({
      tabType: _tabType,
    });

    //加载数据分页 - 网络请求
    this.numberPage();

  },

  /**
   * 切换价格排序
   */
  chgTabPrice: function () {

    if (this.data.goodsPriceSort == "GoodsPriceAsc") {
      this.setData({
        goodsPriceSort: "GoodsPriceDesc",
        tabType: "GoodsPriceDesc",
      });

    } else {
      this.setData({
        goodsPriceSort: "GoodsPriceAsc",
        tabType: "GoodsPriceAsc",
      });
    }
    //切换选项卡
    this.chgTab();
  },

  /**
   * 得到商品类目必填属性集合
   */
  getGoodsTypeNeedProp: function () {

    if (mGoodsTypeIDRepeatMax == "") {
      return
    }

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "3",
      "GoodsTypeID": mGoodsTypeIDRepeatMax,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.searchApi_SearchGoodsResult, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }
      //-----格式化数据------//
      var _needPropList = "{\"GooGoodsTypeNeedPropList\":[";
      for (var i = 0; i < _jsonReTxt.GooGoodsTypeNeedPropList.length; i++) {
        _needPropList += "{";
        _needPropList += "\"GtPropID\":\"" + _jsonReTxt.GooGoodsTypeNeedPropList[i].GtPropID + "\",";
        _needPropList += "\"PropName\":\"" + _jsonReTxt.GooGoodsTypeNeedPropList[i].PropName + "\",";
        _needPropList += "\"PropValue\":["

        //分割拼接字符串
        var _propValueArr = mUtils.splitStringJoinChar(_jsonReTxt.GooGoodsTypeNeedPropList[i].PropValue);
        for (var j = 0; j < _propValueArr.length; j++) {
          _needPropList += "{\"Value\":\"" + _propValueArr[j] + "\",\"IsSel\":\"false\"},"
        }
        //去掉前后的","
        _needPropList = mUtils.removeFrontAndBackChar(_needPropList, ",");

        _needPropList += "]";
        _needPropList += "},";
      }
      //去掉前后的","
      _needPropList = mUtils.removeFrontAndBackChar(_needPropList, ",");
      _needPropList += "]}";
      console.log(_needPropList);


      //设置公共变量值
      this.setData({
        getGoodsTypeNeedProp_Data: _jsonReTxt,
        needPropList: JSON.parse(_needPropList),
      });

    });

  },

  /**
   * 切换顶部选择的条件
   * @param {} e 
   */
  tglIsWhere: function (e) {
    var _whereType = e.currentTarget.dataset.whereType;
    var _isTrueFalse = e.currentTarget.dataset.isTrueFalse;


    // isPayDelivery isShopExpense  isOfflinePay isHasGift
    if (_whereType == "isPayDelivery") {
      if (_isTrueFalse == "") {
        this.setData({
          isPayDelivery: "true",
        });
      } else {
        this.setData({
          isPayDelivery: "",
        });
      }
    } else if (_whereType == "isShopExpense") {
      if (_isTrueFalse == "") {
        this.setData({
          isShopExpense: "true",
        });
      } else {
        this.setData({
          isShopExpense: "",
        });
      }
    } else if (_whereType == "isOfflinePay") {
      if (_isTrueFalse == "") {
        this.setData({
          isOfflinePay: "true",
        });
      } else {
        this.setData({
          isOfflinePay: "",
        });
      }

    } else if (_whereType == "isHasGift") {
      if (_isTrueFalse == "") {
        this.setData({
          isHasGift: "true",
        });
      } else {
        this.setData({
          isHasGift: "",
        });
      }
    }

    //加载数据分页 - 网络请求
    this.numberPage();
    //关闭窗口
    this.closeSlide();

  },

  /**
   * 构造商品类目必填属性 查询条件字符串 
   */
  whereGoodsTypeNeedProp: function (e) {
    var _propName = e.currentTarget.dataset.propName;
    var _propValue = e.currentTarget.dataset.propValue;

    if (_propName == "" || _propValue == "") {
      mGoodsTypeNeedProp = "";
      return;
    }

    var _addPropValue = false; //是否已添加

    //商品必填属性（属性名_属性值^属性名_属性值） [ 袖长_无袖^腰型_高腰^廓形_A型^当季热销_121^裙长_超短裙 ]
    var GoodsTypeNeedPropArr = mUtils.splitStringJoinChar(mGoodsTypeNeedProp);
    //循环判断是否为当前属性名
    for (var i = 0; i < GoodsTypeNeedPropArr.length; i++) {
      if (GoodsTypeNeedPropArr[i].indexOf(_propName + "_") >= 0) {
        GoodsTypeNeedPropArr[i] = _propName + "_" + _propValue;

        _addPropValue = true; //已添加

        break;
      }
    }
    if (_addPropValue == false) {
      GoodsTypeNeedPropArr[GoodsTypeNeedPropArr.length] = _propName + "_" + _propValue;
    }
    //连接数据
    mGoodsTypeNeedProp = GoodsTypeNeedPropArr.join("^");
    console.log("mGoodsTypeNeedProp=" + mGoodsTypeNeedProp);

    //------构造当前选择项的样式-----//
    var _index = e.currentTarget.dataset.index;
    var _idx = e.currentTarget.dataset.idx;
    var _needPropList = this.data.needPropList;
    for (var k = 0; k < _needPropList.GooGoodsTypeNeedPropList[_index].PropValue.length; k++) {
      if (k == _idx) {
        _needPropList.GooGoodsTypeNeedPropList[_index].PropValue[k].IsSel = "true";
      } else {
        _needPropList.GooGoodsTypeNeedPropList[_index].PropValue[k].IsSel = "false";
      }
    }
    //设置公共变量值
    this.setData({
      needPropList: _needPropList,
    });
  },

  /**
   * 确认筛选的规格属性值
   */
  okGoodsTypeNeedProp: function () {
    //加载数据分页 - 网络请求
    this.numberPage();
    //关闭窗口
    this.closeSlide();
  },

  /**
   * 重置必填属性查询条件字符串
   */
  resetGoodsTypeNeedProp: function () {
    mGoodsTypeNeedProp = "";
    this.setData({
      isPayDelivery: "",
      isShopExpense: "",
      isOfflinePay: "",
      isHasGift: "",
    });
    //重置必填规格属性
    var _needPropList = this.data.needPropList;
    for (var j = 0; j < _needPropList.GooGoodsTypeNeedPropList.length; j++) {
      for (var k = 0; k < _needPropList.GooGoodsTypeNeedPropList[j].PropValue.length; k++) {
        _needPropList.GooGoodsTypeNeedPropList[j].PropValue[k].IsSel = "false";
      }
    }
    //设置公共变量值
    this.setData({
      needPropList: _needPropList,
    });

    //加载数据分页 - 网络请求
    //this.numberPage();
    //关闭窗口
    //this.closeSlide();
  },

  //=====================数据分页==========================//
  /**
   * 初始化搜索条件
   * @param {*} pPageOrderName  Commend 推荐 SaleCount 销量 GoodsPriceAsc 价格升序 GoodsPriceDesc 价格降序 WriteDate 新品 Discount 打折  GroupMsgCount 团购  SecKill  秒杀
   * @param {*} pIsOnlyDiscount 是否只加载打折的商品 ( true / false )
   */
  initSearchWhereArr: function (pPageOrderName, pIsOnlyDiscount, pIsOnlyGroup, pIsOnlySecKill) {

    //SearchKeyword + "^" + pPageOrderName + "^" + pIsOnlyDiscount + "^" + pIsOnlyGroup

    mSearchWhereArr = this.data.searchTxt + "^" + pPageOrderName + "^" + pIsOnlyDiscount + "^" + pIsOnlyGroup + "^" + pIsOnlySecKill;

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
      "GoodsTypeNeedProp": mGoodsTypeNeedProp,
      "IsPayDelivery": this.data.isPayDelivery,
      "IsShopExpense": this.data.isShopExpense,
      "IsOfflinePay": this.data.isOfflinePay,
      "IsHasGift": this.data.isHasGift,
    };

    //判断是否分页Http是否发送中
    if (mPageHttpSending == true) {
      return;
    }
    mPageHttpSending = true;

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.searchApi_SearchGoodsResult, _dataPOST, res => {

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
          if (res.DataPage[i].GoodsTitle.length > 25) {
            res.DataPage[i].GoodsTitle = res.DataPage[i].GoodsTitle.substring(0, 25) + "…";
          }

          //------计算折扣------//
          //var i = k;
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
      }

      if (mGoodsTypeIDRepeatMax != res.GoodsTypeIDRepeatMax) {
        mGoodsTypeIDRepeatMax = res.GoodsTypeIDRepeatMax;
        //得到商品类目必填属性集合
        this.getGoodsTypeNeedProp();
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


  //=====================侧边栏相关===========================//
  /**
   * 显示侧边栏
   */
  openSlide: function () {
    this.setData({
      isShowSlide: false //显示
    });
  },
  /**
   * 隐藏侧边栏
   */
  closeSlide: function () {
    this.setData({
      isShowSlide: true //隐藏
    });
  }

})