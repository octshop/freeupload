// pages/buyer/coupons/coupons.js
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
    numberPage_Page: null, //分页数据对象
    countAllCouponsMsg_Data: null, //统计买家各种优惠券信息
    searchKey: "false", //是否已使用的优惠券
    chgTabNum: 1, //切换选项卡的Number值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //---得到navBar的高度----//
    var _navbarHeight = this.selectComponent("#NavBar").getNavBarHeight();
    this.setData({
      navbarHeight: _navbarHeight,
      octContentMarginTop: _navbarHeight + 30,
    });

    //判断用户是否登录 没有登录 则跳转到指定URL 并设置UserID,LoginSha1
    mBusiLogin.isLoginUserNavigateSetUserIDPwdSha1Global(res => {
      //console.log(res)
      //------登录成功后的调用函数-------//

      //统计买家各种优惠券信息
      this.countAllCouponsMsg();

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
   * 进入我的
   */
  home: function () {
    wx.switchTab({
      url: '../../tabbar/buyerindex/buyerindex',
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
  //=====================自定义函数==========================//
  /**
   * 统计买家各种优惠券信息
   */
  countAllCouponsMsg: function () {

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "7",
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.buyerApi_CouponsMy, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined || _jsonReTxt == null) {
        return;
      }

      //设置公共变量值
      this.setData({
        countAllCouponsMsg_Data: _jsonReTxt,
      });

    });
  
  },
  /**
   * 切换选项卡
   */
  chgTab: function (e) {

    var _chgTabNum = e.currentTarget.dataset.chgTabNum;

    var _searchKey = "false";
    if (_chgTabNum == "2") {
      _searchKey = "true";
    }

    //设置公共变量值
    this.setData({
      chgTabNum: _chgTabNum,
      searchKey: _searchKey,
    });

    //重新加载数据
    this.numberPage();

  },

  //=====================数据分页==========================//
  /**
   * 初始化搜索条件
   * @param {*} pPageOrderName  
   * @param {*} pIsOnlyDiscount 
   */
  initSearchWhereArr: function () {
    mSearchWhereArr = this.data.shopID + "^" + pPageOrderName + "^" + pIsOnlyDiscount
  },
  /**
   * 加载数据分页 - 网络请求
   * @param {*} pPageCurrent 
   */
  numberPage: function (pPageCurrent = "1") {

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
      "Type": "1",
      "PageCurrent": pPageCurrent,
      "SearchKey": this.data.searchKey,
    };

    //判断是否分页Http是否发送中
    if (mPageHttpSending == true) {
      return;
    }
    mPageHttpSending = true;

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.buyerApi_CouponsMy, _dataPOST, res => {

      mPageHttpSending = false;

      if (res == "") {
        this.setData({
          numberPage_Page: null,
        });
        return;
      }

      //------格式化分页数据-----//
      for (var i = 0; i < res.DataPage1.length; i++) {

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
        _numberPage_Page.DataPage1 = _numberPage_Page.DataPage1.concat(res.DataPage1);
        _numberPage_Page.DataPage2 = _numberPage_Page.DataPage2.concat(res.DataPage2);
        _numberPage_Page.DataPageExtra = _numberPage_Page.DataPageExtra.concat(res.DataPageExtra);
      }
      //console.log(_numberPage_Page);

      //------设置公共变量-----//
      this.setData({
        numberPage_Page: _numberPage_Page,
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


  //=====================公共函数==========================//
  /**
   * 跳转到页面 navigate
   * @param {} e 
   */
  navigateToURL: function (e) {
    var _dataSet = e.currentTarget.dataset;
    console.log(e);
    //跳转
    mUtils.navigateToURL(_dataSet.navigateUrl);
  },


})