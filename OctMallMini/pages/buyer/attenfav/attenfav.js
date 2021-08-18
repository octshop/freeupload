// pages/buyer/attenfav/attenfav.js
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
    searchKey: "goods", //搜索关键字
    countAllFavMsg_Data: null, //统计买家所有的收藏信息 商品，店铺
    chgTabNum: 1, //当前选项卡次序
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //---得到navBar的高度----//
    var _navbarHeight = this.selectComponent("#NavBar").getNavBarHeight();
    this.setData({
      navbarHeight: _navbarHeight,
      octContentMarginTop: _navbarHeight + 28,
    });

    //判断用户是否登录 没有登录 则跳转到指定URL 并设置UserID,LoginSha1
    mBusiLogin.isLoginUserNavigateSetUserIDPwdSha1Global(res => {
      //console.log(res)
      //------登录成功后的调用函数-------//
      this.numberPage();
      //统计买家所有的收藏信息 商品，店铺
      this.countAllFavMsg();

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
   * 切换选项卡
   * @param {*} e 
   */
  chgTab: function (e) {
    var _tabNum = e.currentTarget.dataset.tabNum;
    var _searchKey = "goods"
    if (_tabNum == "2") {
      _searchKey = "shop";
    }

    this.setData({
      chgTabNum: _tabNum,
      searchKey: _searchKey,
    });

    //重新加载数据
    this.numberPage();

  },
  /**
   * 统计买家所有的收藏信息 商品，店铺
   */
  countAllFavMsg: function () {

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "3",
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.buyerApi_BuyerFocusFav, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined || _jsonReTxt == null) {
        return;
      }

      //设置公共变量值
      this.setData({
        countAllFavMsg_Data: _jsonReTxt,
      });

    });



  },

  /**
   * 找相似的类别商品
   */
  findSameGoodsType: function (e) {
    var _goodsTypeID = e.currentTarget.dataset.goodsTypeId;
    var _isEntity = e.currentTarget.dataset.isEntity;

    if (_isEntity != "true") //非实体店
    {
      mUtils.navigateToURL("../../../pages/mall/goodstypelistdetail/goodstypelistdetail?GTID=" + _goodsTypeID);
    } else {
      mUtils.navigateToURL("../../../pages/o2o/goodstype/goodstype?GTID=" + _goodsTypeID);
    }
  },

  //=====================数据分页==========================//
  /**
   * 初始化搜索条件
   * @param {*} pPageOrderName  
   * @param {*} pIsOnlyDiscount 
   */
  initSearchWhereArr: function (pPageOrderName = "", pIsOnlyDiscount = "") {
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
      "Type": "2",
      "PageCurrent": pPageCurrent,
      "SearchKey": this.data.searchKey,
    };

    //判断是否分页Http是否发送中
    if (mPageHttpSending == true) {
      return;
    }
    mPageHttpSending = true;

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.buyerApi_BuyerFocusFav, _dataPOST, res => {

      mPageHttpSending = false;

      if (res == "") {
        this.setData({
          numberPage_Page: null,
        });
        return;
      }

      //------格式化分页数据-----//
      for (var i = 0; i < res.DataPage.length; i++) {
        if (this.data.chgTabNum == "2") {
          if (res.DataPageExtra[i].MajorGoods.length > 22) {
            res.DataPageExtra[i].MajorGoods = res.DataPageExtra[i].MajorGoods.substring(0, 22) + "…";
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




})