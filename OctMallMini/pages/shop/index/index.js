// pages/shop/index/index.js
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiLogin = require('../../../busicode/busilogin.js');
var mBusiCookie = require('../../../busicode/busicookie.js');

//=============公共变量================//

//------数据分页变量----//
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
    orderGoodsList: null, //排行榜数据
    orderTabNum1: "order-current",
    orderTabNum2: "",
    isShowAddrNav: false, //是否显示导航条
    pageDataSearch_Page: null, //猜你喜欢数据分页
    loadShopCouponsTopList_Data: null, //加载优惠券指定记录条数
    initSliderGoodsImgData_Data: null, //初始化轮播图片信息
    ShopCarouselHrefList: null, //轮播图片跳转URL

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options);
    //----获取传递的参数赋值-----//
    var _shopID = options.SID;
    if (_shopID == undefined || _shopID == null || _shopID == "") {
      //获取场景值
      var scene = decodeURIComponent(query.scene);
      if (scene != undefined && scene != null && scene != "") {
        _shopID = scene;
      } else {
        _shopID = "";
      }
    }
    if (_shopID == undefined || _shopID == null || _shopID == "") {
      return;
    }

    this.setData({
      shopID: _shopID
    });

    //console.log("传递的店铺ID=" + this.data.shopID);

    //---得到navBar的高度----//
    var _navbarHeight = this.selectComponent("#NavBar").getNavBarHeight();
    this.setData({
      navbarHeight: _navbarHeight,
      octContentMarginTop: _navbarHeight + 90
    });

    //加载优惠券指定记录条数
    this.loadShopCouponsTopList();
    //初始化轮播图片信息
    this.initSliderGoodsImgData();

    // 如果用户登录啦，则设置全局的  loginBuyerUserID 和 loginPwdSha1 可根据这两个参数是否为空，判断是否用户登录
    mBusiLogin.setLoginBuyerUserIDPwdSha1Global(res => {
      //用户已登录的状态
      if (res != "") {}

      //----------方法调用-----------//
      //加载店铺首页信息
      this.loadShopHomeMsg();

    });

  },
  /**
   * 显示页面时执行
   */
  onShow: function () {
    mIntPageCurrent = 1; //当前的分页索引
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //下一页
    this.nextPage();
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //====================自定义函数========================//
  /**
   * 买家获取优惠券 单个获取
   */
  buyerGetCoupons: function (e) {

    console.log(e.currentTarget.dataset);
    var pCouponsID = e.currentTarget.dataset.couponsId;

    //判断买家是否登录 
    mBusiLogin.isLoginUserNavigate(res => {

      if (res == "") {
        return;
      }

      //获取用户登录信息 --异步函数
      mBusiLogin.getLoginCookieAsyn(res => {

        //构造POST参数
        var _dataPOST = {
          "SignKey": mHttp.signKeyRsa(res.UserID, res.LoginPwdSha1),
          "Type": "4",
          "CouponsID": pCouponsID,
          "BuyerUserID": res.UserID,
        };

        //正式发送Http请求
        mHttp.postHttp(app.apiURLData.shopApi_Index, _dataPOST, _jsonReTxt => {
          console.log(_jsonReTxt);

          if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
            mUtils.showToast(_jsonReTxt.ErrMsg, 1500, false);
          }
          if (_jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
            mUtils.showToast(_jsonReTxt.Msg, 1500, false);
          }


        });

      });

    }, false, "", "../../../pages/shop/index/index^SID~" + this.data.shopID);

  },

  /**
   * 加载店铺首页信息
   */
  loadShopHomeMsg: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "1",
      "ShopID": this.data.shopID,
      "BuyerUserID": app.globalData.loginBuyerUserID,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.shopApi_Index, _dataPOST, res => {
      console.log(res);

      //设置公共变量值
      this.setData({
        shopUserID: res.ShopMsgTopBarItem.ShopUserID
      });


      //去掉小数点后的数
      var _appraiseStarRed = Math.floor(res.ShopMsgTopBarItem.AvgAppraiseScore);
      //计算灰色星数
      var _appraiseStarGray = 5 - _appraiseStarRed;
      console.log("_appraiseStarGray=" + _appraiseStarGray);

      // mUtils.logOut(res.SaleCountSortList);
      //格式化值
      if (res.SaleCountSortList != undefined) {
        for (var i = 0; i < res.SaleCountSortList.length; i++) {
          var _GoodsTitle = res.SaleCountSortList[i].GoodsTitle;
          if (_GoodsTitle.length > 15) {
            _GoodsTitle = _GoodsTitle.substring(0, 15);
            res.SaleCountSortList[i].GoodsTitle = _GoodsTitle + "…";
          }
        }
      }

      if (res.FavCountSortList != undefined) {
        for (var i = 0; i < res.FavCountSortList.length; i++) {
          var _GoodsTitle = res.FavCountSortList[i].GoodsTitle;
          if (_GoodsTitle.length > 15) {
            _GoodsTitle = _GoodsTitle.substring(0, 15);
            res.FavCountSortList[i].GoodsTitle = _GoodsTitle + "…";
          }
        }
      }

      if (res.ShopShowMsgList.ShopShowMsgGoods != undefined) {
        for (var j = 0; j < res.ShopShowMsgList.ShopShowMsgGoods.length; j++) {

          var _shopShowMsgGoods = res.ShopShowMsgList.ShopShowMsgGoods[j];

          //拼团的商品 - 信息列表
          if (_shopShowMsgGoods.HomeGroupGoodsList != undefined && _shopShowMsgGoods.HomeGroupGoodsList.length > 0) {
            for (var k = 0; k < _shopShowMsgGoods.HomeGroupGoodsList.length; k++) {
              if (_shopShowMsgGoods.HomeGroupGoodsList[k].GoodsTitle.length > 20) {

                res.ShopShowMsgList.ShopShowMsgGoods[j].HomeGroupGoodsList[k].GoodsTitle = _shopShowMsgGoods.HomeGroupGoodsList[k].GoodsTitle.substring(0, 20) + "…";

              }

              //价格与折扣的处理
              res.ShopShowMsgList.ShopShowMsgGoods[j].HomeGroupGoodsList[k].GoodsPrice =  res.ShopShowMsgList.ShopShowMsgGoods[j].HomeGroupGoodsList[k].GoodsPrice * ( res.ShopShowMsgList.ShopShowMsgGoods[j].HomeGroupGoodsList[k].GroupDiscount / 10);
              res.ShopShowMsgList.ShopShowMsgGoods[j].HomeGroupGoodsList[k].GoodsPrice = mUtils.formatNumberDotDigit(res.ShopShowMsgList.ShopShowMsgGoods[j].HomeGroupGoodsList[k].GoodsPrice);


            }
          }

          //礼品领取 - 信息列表
          if (_shopShowMsgGoods.HomePresentGoodsList != undefined && _shopShowMsgGoods.HomePresentGoodsList.length > 0) {
            for (var k = 0; k < _shopShowMsgGoods.HomePresentGoodsList.length; k++) {
              if (_shopShowMsgGoods.HomePresentGoodsList[k].PresentTitle.length > 20) {

                res.ShopShowMsgList.ShopShowMsgGoods[j].HomePresentGoodsList[k].PresentTitle = _shopShowMsgGoods.HomePresentGoodsList[k].PresentTitle.substring(0, 20) + "…";

              }
            }
          }

          //秒杀商品 - 信息列表
          if (_shopShowMsgGoods.HomeSecKillGoodsList != undefined && _shopShowMsgGoods.HomeSecKillGoodsList.length > 0) {
            for (var k = 0; k < _shopShowMsgGoods.HomeSecKillGoodsList.length; k++) {
              if (_shopShowMsgGoods.HomeSecKillGoodsList[k].GoodsTitle.length > 20) {
                res.ShopShowMsgList.ShopShowMsgGoods[j].HomeSecKillGoodsList[k].GoodsTitle = _shopShowMsgGoods.HomeSecKillGoodsList[k].GoodsTitle.substring(0, 20) + "…";
              }

              //价格与折扣的处理
              res.ShopShowMsgList.ShopShowMsgGoods[j].HomeSecKillGoodsList[k].GoodsPrice =  res.ShopShowMsgList.ShopShowMsgGoods[j].HomeSecKillGoodsList[k].GoodsPrice * ( res.ShopShowMsgList.ShopShowMsgGoods[j].HomeSecKillGoodsList[k].SkDiscount / 10);
              res.ShopShowMsgList.ShopShowMsgGoods[j].HomeSecKillGoodsList[k].GoodsPrice = mUtils.formatNumberDotDigit(res.ShopShowMsgList.ShopShowMsgGoods[j].HomeSecKillGoodsList[k].GoodsPrice);


            }
          }

          //商家推荐 - 信息列表
          if (_shopShowMsgGoods.HomeCommendGoodsList != undefined && _shopShowMsgGoods.HomeCommendGoodsList.length > 0) {
            for (var k = 0; k < _shopShowMsgGoods.HomeCommendGoodsList.length; k++) {
              if (_shopShowMsgGoods.HomeCommendGoodsList[k].GoodsTitle.length > 20) {

                res.ShopShowMsgList.ShopShowMsgGoods[j].HomeCommendGoodsList[k].GoodsTitle = _shopShowMsgGoods.HomeCommendGoodsList[k].GoodsTitle.substring(0, 20) + "…";

              }
            }
          }

          //打折商品 - 信息列表
          if (_shopShowMsgGoods.HomeDiscountGoodsList != undefined && _shopShowMsgGoods.HomeDiscountGoodsList.length > 0) {
            for (var k = 0; k < _shopShowMsgGoods.HomeDiscountGoodsList.length; k++) {
              if (_shopShowMsgGoods.HomeDiscountGoodsList[k].GoodsTitle.length > 20) {

                res.ShopShowMsgList.ShopShowMsgGoods[j].HomeDiscountGoodsList[k].GoodsTitle = _shopShowMsgGoods.HomeDiscountGoodsList[k].GoodsTitle.substring(0, 20) + "…";

              }

                //价格与折扣的处理
                res.ShopShowMsgList.ShopShowMsgGoods[j].HomeDiscountGoodsList[k].GoodsPrice =  res.ShopShowMsgList.ShopShowMsgGoods[j].HomeDiscountGoodsList[k].GoodsPrice * ( res.ShopShowMsgList.ShopShowMsgGoods[j].HomeDiscountGoodsList[k].Discount / 10);
                res.ShopShowMsgList.ShopShowMsgGoods[j].HomeDiscountGoodsList[k].GoodsPrice = mUtils.formatNumberDotDigit(res.ShopShowMsgList.ShopShowMsgGoods[j].HomeDiscountGoodsList[k].GoodsPrice);


            }
          }



        }
      }


      //是否显示导航条
      var _isShowAddrNav = false;
      if (res.ShopAddrLocationTel != undefined) {
        if (res.ShopAddrLocationTel.Longitude != null && res.ShopAddrLocationTel.Longitude != "" && res.ShopMsgTopBarItem.IsEntity == "true") {
          _isShowAddrNav = true;
        } else {
          _isShowAddrNav = false;
        }
      }
      //显示变量
      var _showData = {
        loadShopHomeMsg: res
      };

      //------设置变量值------//
      this.setData({
        showData: _showData,
        appraiseStarGray: _appraiseStarGray,
        appraiseStarRed: _appraiseStarRed,
        orderGoodsList: res.SaleCountSortList,
        isShowAddrNav: _isShowAddrNav,
      });

      //猜你喜欢数据分页
      this.pageDataSearch();

      mUtils.logOut(this.data.isShowAddrNav);

    });
  },
  /**
   * 切换排行榜选项卡
   * @param {*} e 
   */
  chgOrderTab(e) {
    var _dataSet = e.currentTarget.dataset;
    console.log(_dataSet);
    if (_dataSet.tabNum == "1") {
      this.setData({
        orderTabNum1: "order-current",
        orderTabNum2: "",
        orderGoodsList: this.data.showData.loadShopHomeMsg.SaleCountSortList
      });
    } else if (_dataSet.tabNum == "2") {
      this.setData({
        orderTabNum1: "",
        orderTabNum2: "order-current",
        orderGoodsList: this.data.showData.loadShopHomeMsg.FavCountSortList
      });
    }
  },
  /**
   * 加载优惠券指定记录条数
   */
  loadShopCouponsTopList: function () {
    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "3",
      "ShopID": this.data.shopID,
    };
    //正式发送Http
    mHttp.postHttp(app.apiURLData.shopApi_Index, _dataPOST, res => {

      //-----设置公共变量------//
      this.setData({
        loadShopCouponsTopList_Data: res,
      });

    });
  },
  /**
   * 初始化轮播图片信息
   */
  initSliderGoodsImgData: function () {
    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "2",
      "ShopID": this.data.shopID,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.shopApi_Index, _dataPOST, res => {

      if (res != "") {
        //定义数组
        var _ShopCarouselHrefList = new Array();
        if (res.ShopCarouselList != undefined) {
          for (var i = 0; i < res.ShopCarouselList.length; i++) {
            _ShopCarouselHrefList[i] = this.getRedirectPageURL(res.ShopCarouselList[i].AdvLinkType, res.ShopCarouselList[i].AdvLinkA);
          }
        }
      }

      //----设置公共变量 ----//
      this.setData({
        initSliderGoodsImgData_Data: res,
        ShopCarouselHrefList: _ShopCarouselHrefList,
      });

    });

  },
  /**
   * 得到 不同类型的链接 跳转地址 
   * @param pAdvLinkType 链接类型 ( Goods 商品，Present 礼品，Coupons 优惠券，Activity 活动，LuckyDraw 抽奖) 
   * @param pAdvLinkA 各种ID
   */
  getRedirectPageURL: function (pAdvLinkType, pAdvLinkA) {

    var _redirectURL = "";
    //轮播图片的跳转链接类型 ( Goods 商品，Present 礼品，Coupons 优惠券，Activity 活动，LuckyDraw 抽奖) 
    if (pAdvLinkType == "Goods") {

      _redirectURL = "../../goods/goodsdetail/goodsdetail?GID=" + pAdvLinkA;
    } else if (pAdvLinkType == "Present") {
      _redirectURL = "../../goods/giftdetail/giftdetail?PID=" + pAdvLinkA;
    } else if (pAdvLinkType == "Coupons") {
      _redirectURL = "../../buyer/coupons/couponsdetail/couponsdetail?CID=" + pAdvLinkA;
    } else if (pAdvLinkType == "Activity") {
      _redirectURL = "../../shop/activitydetail/activitydetail?AID=" + pAdvLinkA;
    } else if (pAdvLinkType == "LuckyDraw") {
      _redirectURL = "../../mall/luckydraw/luckydrawdetail/luckydrawdetail?LID=" + pAdvLinkA;
    }
    return _redirectURL;

  },
  //=====================数据分页==========================//
  /**
   * 猜你喜欢数据分页
   */
  pageDataSearch: function () {

    //如果是第一页则重新加载数据
    if (mIntPageCurrent == "1") {
      this.setData({
        pageDataSearch_Page: null,
      });
    }

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "6",
      "PageCurrent": mIntPageCurrent,
      "ShopID": this.data.shopID,
      "ShopUserID": this.data.shopUserID,
    };

    //判断是否分页Http是否发送中
    if (mPageHttpSending == true) {
      return;
    }
    mPageHttpSending = true;

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.shopApi_Index, _dataPOST, res => {

      //分页Http完成
      mPageHttpSending = false;

      if (res == "") {
        this.setData({
          pageDataSearch_Page: null,
        });
        return;
      }

      //----------格式化字符串---------//
      if (res != "") {
        //设置返回的变量 
        for (var i = 0; i < res.DataPage.length; i++) {
          if (res.DataPage[i].GoodsTitle.length > 20) {
            res.DataPage[i].GoodsTitle = res.DataPage[i].GoodsTitle.substring(0, 20) + "…";
          }

           //------计算折扣------//
          // var i = k;
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

      //----分页Http完成-----//
      var _numberPage_Page = this.data.pageDataSearch_Page;
      mPageSum = parseInt(res.PageSum);
      mIntPageCurrent = parseInt(res.PageCurrent);
      mRecordSum = parseInt(res.RecordSum);

      //将数据分页数据添加到公共变量中
      if (this.data.pageDataSearch_Page == null) {
        _numberPage_Page = res;
      } else {
        //添加数据分页中
        _numberPage_Page.PageCurrent = (parseInt(_numberPage_Page.PageCurrent) + 1).toString();
        //添加数组
        _numberPage_Page.DataPage = _numberPage_Page.DataPage.concat(res.DataPage);
        _numberPage_Page.DataPageExtra = _numberPage_Page.DataPageExtra.concat(res.DataPageExtra);
      }

      //-----设置公共变量------//
      this.setData({
        pageDataSearch_Page: _numberPage_Page,
      });


    });

  },
  /**
   * 下一页
   */
  nextPage: function () {

    console.log("执行啦-猜你喜欢");

    if (mPageHttpSending == true) {
      return;
    }

    if (mIntPageCurrent < mPageSum) {

      mIntPageCurrent += 1;

      //重新加载数据
      this.pageDataSearch();
    }
  },
  //====================公共函数========================//
  /**
   * 拨打电话
   * @param {} e 
   */
  makePhoneCall: function (e) {
    //mUtils.logOut(e.target.dataset.phoneNumber)
    var _dataSet = e.currentTarget.dataset;
    //拨打电话
    mUtils.makePhoneCall(_dataSet.phoneNumber);
  },
  /**
   * 直接打开微信内置地图插件
   * @param {} e 
   */
  openMiniMap: function (e) {
    var _dataSet = e.currentTarget.dataset;

    //console.log(_dataSet);

    //直接打开微信内置地图插件
    mUtils.openMiniMap(parseFloat(_dataSet.latitude), parseFloat(_dataSet.longitude), _dataSet.name, _dataSet.address);

  },
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



  //=====================在线客服接入==========================//

  /**
   * 构建【商家店铺】咨询进入IM在线客服系统 跳转 URL
   */
  buildBuyerGoToImSysURL_ShopWap: function () {

    mUtils.logOut("【商家店铺】咨询进入I");

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "1",
      "ShopUserID": this.data.shopUserID,
      "BuyerUserID": app.globalData.loginBuyerUserID,
    };
    mUtils.logOut(_dataPOST);

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.imSysApi_Index, _dataPOST, _jsonReTxt => {

      mUtils.logOut(_jsonReTxt);

      if (_jsonReTxt != "") {
        //设置跳转到 IM在线客服系统 的 URL cookie值
        mBusiCookie.saveGoToImSysUrlCookie(_jsonReTxt);
        //跳转到IM在线客服系统 WebView页
        mUtils.navigateToURL("../../../pages/webviewpg/imwebview/imwebview");
      } else {
        //直接拨打店铺客服电话
        mUtils.makePhoneCall(this.data.showData.loadShopHomeMsg.ShopAddrLocationTel.ShopMobile);
      }

    });
  },




})