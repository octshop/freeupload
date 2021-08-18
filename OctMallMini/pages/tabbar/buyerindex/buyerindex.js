// pages/tabbar/buyerindex/buyerindex.js
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiCookie = require('../../../busicode/busicookie');
var mBusiLogin = require('../../../busicode/busilogin.js');
var mBusiLocation = require('../../../busicode/busilocation.js');

//----------数据分页----------//
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
    apiWebDoamin: app.globalData.apiWebDoamin, //小程序Api的网站域名
    navbarHeight: 0, //navBar的高度
    //-----------------自定义变量-------------//
    loadUserMsgAccFinance_Data: null, //加载买家用户的 账号，买家信息，余额积分信息
    numberPage_Page: null, //数据分页对象
    countBuyerIndexRCHint_Data: null, //统计买家中心首页 各项小红点提示数

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //---得到navBar的高度----//
    this.setData({
      navbarHeight: this.selectComponent("#NavBar").getNavBarHeight(),
    });

    //----得到与保存当前用户的位置信息-----//
    mBusiLocation.getSaveUserLoctaion(res => {
      //console.log(res);
    });


  },
  /**
   * 单击标签跳转到 相关页 (navigate)
   * @param {*} e 
   */
  navigateURLLabel: function (e) {
    //console.log(e);
    var _gourl = e.currentTarget.dataset.gourl;
    util.navigateToURL(_gourl);
  },

  onShow: function () {

    //设置底部Tabbar内容
    this.setTabBarContent();

    //判断用户是否登录 没有登录 则跳转到指定URL 并设置UserID,LoginSha1
    mBusiLogin.isLoginUserNavigateSetUserIDPwdSha1Global(res => {
      console.log(res)

      //判断是否存在绑定的微信用户信息
      this.isExistWeiXinUserInfoByUserID(() => {

        // 加载买家用户的 账号，买家信息，余额积分信息
        this.loadUserMsgAccFinance();

        //加载猜你喜欢 - 数据分页查询
        this.numberPage();

        //统计买家中心首页 各项小红点提示数
        this.countBuyerIndexRCHint();

      });


    });
    

  },
  /**
   * 商城首页
   */
  back: function () {
    wx.switchTab({
      url: '../../../pages/tabbar/index/index',
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
  //------------------------自定义函数------------------//
  /**
   * 设置底部Tabbar内容
   */
  setTabBarContent: function () {
    //记录当前进入的TabBar索引，以便加载中间Tabbar的内容
    app.globalData.tabbarMidIndex = 4;
    //设置中间TabBar样式
    wx.setTabBarItem({
      index: 2,
      text: '消息',
      iconPath: 'assets/imgs/icons/navmsg.png',
      selectedIconPath: 'assets/imgs/icons/navmsg_red.png'
    })

    // wx.setTabBarBadge({
    //   index: 4,
    //   text: '10'
    // })
  },
  /**
   * 判断是否存在绑定的微信用户信息
   */
  isExistWeiXinUserInfoByUserID: function (pCallBack) {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "3",
      "BuyerUserID": app.globalData.loginBuyerUserID,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.loginApi_MiniLoginRegUserAccount, _dataPOST, jsonReTxt => {

      if (jsonReTxt.ErrMsg != "" && jsonReTxt.ErrMsg != null && jsonReTxt.ErrMsg != undefined) {
        //进行跳转
        mUtils.redirectToURL("../../../pages/login/index/index");
        return;
      }

      pCallBack();

    });
  },

  /**
   * 加载买家用户的 账号，买家信息，余额积分信息
   */
  loadUserMsgAccFinance: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "3",
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.buyerApi_Index, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined || _jsonReTxt == null) {
        return;
      }

      _jsonReTxt.UserAccount = mUtils.maskMobileNumber(_jsonReTxt.UserAccount);

      //设置公共变量值
      this.setData({
        loadUserMsgAccFinance_Data: _jsonReTxt
      });


    });

  },

  /**
   * 统计买家中心首页 各项小红点提示数
   */
  countBuyerIndexRCHint: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.rCHintApi_CountData, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined || _jsonReTxt == null) {
        return;
      }
      //设置公共变量值
      this.setData({
        countBuyerIndexRCHint_Data: _jsonReTxt,
      });

      if (parseInt(_jsonReTxt.AllCount) > 0) {
        //设置导航下的徽章值
        wx.setTabBarBadge({
          index: 4,
          text: '..'
        })
      }
      if (parseInt(_jsonReTxt.ShoppingCartCount) > 0) {
        //设置导航下的徽章值
        wx.setTabBarBadge({
          index: 3,
          text: '..'
        })
      }
      if (parseInt(_jsonReTxt.BuyerSysMsgNoRead) > 0) {
        //设置导航下的徽章值
        wx.setTabBarBadge({
          index: 2,
          text: '..'
        })
      }



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
      "Type": "1",
      "PageCurrent": pPageCurrent,
    };

    //判断是否分页Http是否发送中
    if (mPageHttpSending == true) {
      return;
    }
    mPageHttpSending = true;

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.buyerApi_Index, _dataPOST, res => {
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

  /**
   * 调用弹出扫码框
   */
  scanCodeQr: function () {
    mUtils.scanCodeQr(res => {

      mBusiCookie.setWebViewSrcCookie(res);

      //直接跳转到网址
      mUtils.navigateToURL("../../webviewpg/webviewPub/webviewPub");

    });
  },

})