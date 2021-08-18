// pages/shop/presentall/presentall.js
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');

//=============公共变量================//

//------数据分页变量----//
var mSearchWhereArr = ""; //搜索条件拼接字符串 "^"
var mIntPageCurrent = 1; //当前的分页索引
var mPageSum = 1; //总页数
var mRecordSum = 0; //总记录
var mPageHttpSending = false; //数据分页Http发送中


//------初始化APP对象-----//
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopID: 0, //店铺ID
    shopUserID: 0, //商家UserID
    apiWebDoamin: app.globalData.apiWebDoamin, //小程序Api的网站域名
    navbarHeight: 0, //navBar的高度
    octContentMarginTop: 0, //主体内容距子导航的距离
    showData: null,
    appraiseStarGray: 0,
    appraiseStarRed: 0,
    numberPage_Page: null, //加载数据分页
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //console.log(options);
    //获取传递的参数赋值
    this.setData({
      shopID: options.SID
    });
    //console.log("传递的店铺ID=" + this.data.shopID);

    //---得到navBar的高度----//
    var _navbarHeight = this.selectComponent("#NavBar").getNavBarHeight();
    this.setData({
      navbarHeight: _navbarHeight,
      octContentMarginTop: _navbarHeight + 90
    });

    //----------方法调用-----------//

    //初始化 店铺信息条，店铺首页顶部条信息
    this.initShopMsgTopBarItem();

    //初始化搜索条件
    this.initSearchWhereArr();
    //加载数据
    this.numberPage("1");

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
   * 跳转商城首页
   */
  home: function () {
    wx.switchTab({
      url: '../../tabbar/index/index',
    })
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
  //====================自定义函数========================//
  /**
   * 初始化 店铺信息条，店铺首页顶部条信息
   */
  initShopMsgTopBarItem: function () {
    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "5",
      "ShopID": this.data.shopID,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.shopApi_Index, _dataPOST, res => {

      //设置公共变量
      this.setData({
        initShopMsgTopBarItem_Data: res,
        appraiseStarRed: Math.floor(res.AvgAppraiseScore),
        appraiseStarGray: (5 - Math.floor(res.AvgAppraiseScore)),
      });

    });

  },
  //=====================数据分页==========================//
  /**
   * 初始化搜索条件
   */
  initSearchWhereArr: function () {
    mSearchWhereArr = this.data.shopID
  },
  /**
   * 加载数据分页 - 网络请求
   * @param {*} pPageCurrent 
   */
  numberPage: function (pPageCurrent = "1") {

    //记录当前的分页索引
    mIntPageCurrent = pPageCurrent;

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "1",
      "PageCurrent": pPageCurrent,
      "SearchWhereArr": mSearchWhereArr,
    };

    //判断是否分页Http是否发送中
    if (mPageHttpSending == true) {
      return;
    }
    mPageHttpSending = true;

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.shopApi_Present, _dataPOST, res => {
      //----分页Http完成-----//
      mPageHttpSending = false;
      mPageSum = res.PageSum;
      mIntPageCurrent = res.PageCurrent;
      mRecordSum = res.RecordSum

      if (res != "") {
        //------格式化分页数据-----//
        for (var i = 0; i < res.DataPage.length; i++) {
          if (res.DataPage[i].PresentTitle.length > 25) {
            res.DataPage[i].PresentTitle = res.DataPage[i].PresentTitle.substring(0, 25) + "…";
          }
        }
      }


      //------设置公共变量-----//
      this.setData({
        numberPage_Page: res,
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
      numberPage(mIntPageCurrent);
    }

  },
  //====================公共函数========================//



})