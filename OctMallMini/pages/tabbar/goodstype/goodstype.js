// pages/buyer/goodstype/goodstype.js
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');

//------初始化APP对象-----//
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: 0,
    navBarHeight: 0,
    apiWebDoamin: app.globalData.apiWebDoamin, //小程序Api的网站域名
    octContentMarginTop: 0, //设置主体内容离顶部的距离
    scrollViewHeight: 0, //页ScrollView的高度
    screenHeightPhone: 0, // 手机屏幕的高度
    windowHeightPhone: 0, //内容窗口的高度
    tabbarHeightPhone: 0, //底部Tabbar高度
    //-----------------自定义变量-------------//
    tabNum: "1", //切换选项卡
    goodsTypeId: "", //商品类别ID
    loadGoodsTypeSecLevel_Data: null, //加载第二级商品类目,主要用于手机端(分类显示页) 并SortNum排序
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 通过获取系统信息计算导航栏高度
    this.getSysStatusBarHeight();

    console.log("statusHeight=" + this.data.statusHeight);

    //设置主体内容离顶部的距离和ScrollView的高度
    this.setData({
      octContentMarginTop: this.data.statusHeight + this.data.navBarHeight + 12,
      scrollViewHeight: this.data.windowHeightPhone - this.data.statusHeight - this.data.navBarHeight - this.data.tabbarHeightPhone, //计算ScrollView高度
    });
    //console.log("tabbarHeightPhone=" + this.data.tabbarHeightPhone);

    //-------------调用自定义函数------------//

    //加载第二级商品类目,主要用于手机端(分类显示页) 并SortNum排序
    this.loadGoodsTypeSecLevel("");


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
      statusHeight: statusHeight,
      navBarHeight: navHeight,
      screenHeightPhone: screenHeight,
      windowHeightPhone: windowHeight,
      tabbarHeightPhone: screenHeight - windowHeight - statusHeight // 底部的导航栏计算公式: const tabbarHeight = ( screenHeight - windowHeight - statusBarHeight ) * pixelRatio
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //------------------------自定义函数------------------//
  /**
   * 设置底部Tabbar内容
   */
  setTabBarContent: function () {
    //记录当前进入的TabBar索引，以便加载中间Tabbar的内容
    app.globalData.tabbarMidIndex = 1;
    //设置中间TabBar样式
    wx.setTabBarItem({
      index: 2,
      text: '附近',
      iconPath: 'assets/imgs/icons/navlocation.png',
      selectedIconPath: 'assets/imgs/icons/navlocation_red.png'
    })

    // wx.setTabBarBadge({
    //   index: 4,
    //   text: '10'
    // })

  },

  /**
   * 加载第二级商品类目,主要用于手机端(分类显示页) 并SortNum排序
   * @param pIsEntity 是否实体店分类(false /true )
   */
  loadGoodsTypeSecLevel: function (pIsEntity) {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "1",
      "IsEntity": pIsEntity,
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

      //加载第三级商品类目,根据第二级类目ID
      this.loadGoodsTypeThirdLevelBySec(_jsonReTxt.GooGoodsTypeSecLevelList[0].GoodsTypeID);

    });

  },

  /**
   * 加载第三级商品类目,根据第二级类目ID
   * @param {any} pGoodsTypeIDSec 第二级类目ID
   */
  loadGoodsTypeThirdLevelBySec: function (e) {
    var _goodsTypeId = "";
    if (e.currentTarget == undefined) {
      _goodsTypeId = e; //直接传递的参数
    } else {
      _goodsTypeId = e.currentTarget.dataset.goodsTypeId;
    }

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "2",
      "GoodsTypeIDSec": _goodsTypeId,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.mallApi_GoodsType, _dataPOST, _jsonReTxt => {
      // if (_jsonReTxt == "" || _jsonReTxt == undefined) {
      //   return;
      // }

      //设置公共变量
      this.setData({
        loadGoodsTypeThirdLevelBySec_Data: _jsonReTxt,
        goodsTypeId: _goodsTypeId,
      });

    });
  },

  /**
   * 切换到加载实体店分类
   */
  chgTab: function (e) {

    var _tabNum = e.currentTarget.dataset.tabNum;
    if (_tabNum == "1") {
      this.loadGoodsTypeSecLevel("");
    } else {
      this.loadGoodsTypeSecLevel("true");
    }
    //设置公共变量值
    this.setData({
      tabNum: _tabNum,
    });

  },


  //===================== 公共函数===========================//
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