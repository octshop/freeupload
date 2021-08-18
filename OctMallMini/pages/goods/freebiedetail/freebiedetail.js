// pages/goods/freebiedetail/freebiedetail.js
//在使用的View中引入WxParse模块
var WxParse = require('../../../wxParse/wxParse.js');
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiLogin = require('../../../busicode/busilogin.js');
var mBusiCookie = require('../../../busicode/busicookie.js');

//------初始化APP对象-----//
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    apiWebDoamin: app.globalData.apiWebDoamin, //小程序Api的网站域名
    navbarHeight: 0, //navBar的高度
    navDetailIsShow: false, //是否显示商品详情切换Tab栏
    octContentMarginTop: 0,
    navTabIndex: 1, //当前选项卡的索引
    //-----------自定义变量-------//
    giftId: "", //赠品ID
    shopId: "", //店铺ID
    shopUserId: "", //店铺UserID
    initGooGiftMsg_Data: null, //初始化赠品信息
    preImgUrlArr: null, //预览图片数组
    //-------------加载店铺信息Bar----------//
    loadShopBarMsg_Data: null, // 加载店铺信息Bar数据
    shopLabelArr: null, //店铺的标签
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //---得到navBar的高度----//
    var _navbarHeight = this.selectComponent("#NavBar").getNavBarHeight();
    this.setData({
      navbarHeight: _navbarHeight,
      octContentMarginTop: _navbarHeight + 35
    });

    // ----加载显示HTML 商品描述-----//
    var that = this;
    var detail_content = "<div>我是HTML代码<b style='color:red'>324324324324</b></div>";
    WxParse.wxParse('detail_content', 'html', detail_content, that, 5);

    //------获取传递的参数-----//
    var _giftId = options.GIID;
    if (_giftId == undefined || _giftId == null) {
      _giftId = "";
    }
    this.setData({
      giftId: _giftId
    });

    //--------------调用自定义函数-----------//

    //初始化赠品信息
    this.initGooGiftMsg();

  },
  /**
   * 跳转到首页
   */
  home: function () {
    wx.switchTab({
      url: '../../tabbar/index/index',
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

  // ========================自定义函数区========================== //

  chgTab: function (e) {
    console.log(e.currentTarget);
    console.log("e.currentTarget.dataset.tab=" + e.currentTarget.dataset.tab);
    var _tabNum = e.currentTarget.dataset.tab;
    if (_tabNum == 1) //赠品
    {
      this.setData({
        octContentMarginTop: this.data.navbarHeight + 35,
        navDetailIsShow: false,
        navTabIndex: _tabNum,
      });
    } else if (_tabNum == 2) //详情
    {
      this.setData({
        octContentMarginTop: this.data.navbarHeight + 35,
        navDetailIsShow: true, //显示商品详情切换
        navTabIndex: _tabNum,
      });

      //设置商品详情值到页面
      this.setWxParseVal("");
      this.setWxParseVal(this.data.initGooGiftMsg_Data.GooGiftMsg.GiftDesc);

    }

    // 控制滚动
    wx.pageScrollTo({
      scrollTop: 0
    })

  },

  /**
   * 初始化赠品信息
   */
  initGooGiftMsg: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "1",
      "GIID": this.data.giftId,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.goodsApi_GiftDetail, _dataPOST, _jsonReTxt => {

      //--------构造数组---------// 
      var _preImgUrlArr = new Array();
      for (var i = 0; i < _jsonReTxt.GooGiftImgList.length; i++) {
        _preImgUrlArr[i] = _jsonReTxt.GooGiftImgList[i].ImgURL;
      }

      //设置公共变量
      this.setData({
        initGooGiftMsg_Data: _jsonReTxt,
        preImgUrlArr: _preImgUrlArr,
        shopUserId: _jsonReTxt.GooGiftMsg.ShopUserID,
      });

      //加载店铺Bar信息
      this.loadShopBarMsg();

    });


  },


  /**
   * 添加关注收藏信息 (收藏商品或店铺)
   */
  addBuyerFocusFav: function () {

    //判断买家是否登录 
    mBusiLogin.isLoginUserNavigate(res => {
      //console.log(res);

      if (res == "") {
        return;
      }

      //构造POST参数
      var _dataPOST = {
        "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
        "Type": "1",
        "FocusFavType": "shop",
        "ShopID": this.data.shopId,
      };

      //正式发送Http请求
      mHttp.postHttp(app.apiURLData.buyerApi_BuyerFocusFav, _dataPOST, _jsonReTxt => {
        //错误提示
        if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
          mUtils.showToast(_jsonReTxt.ErrMsg);
          return;
        }
        //成功提示
        if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
          mUtils.showToast(_jsonReTxt.Msg);
          return;
        }
      });
    }, false, "", "../../../pages/goods/freebiedetail/freebiedetail^GIID~" + this.data.giftId);

  },


  //------------加载店铺信息Bar------------//
  /**
   * 加载店铺Bar信息
   */
  loadShopBarMsg: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "2",
      "ShopID": this.data.shopId,
      "ShopUserID": this.data.shopUserId,
      "IsLoadGoods": "true",
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.shopApi_ShopMsg, _dataPOST, _jsonReTxt => {

      //----格式化数据---//
      var _shopLabelArr = mUtils.splitStringJoinChar(_jsonReTxt.ShopMsg.ShopLabelArr);
      for (var i = 0; i < _jsonReTxt.PreListGoodsMsg.length; i++) {
        if (_jsonReTxt.PreListGoodsMsg[i].GoodsTitle.length > 5) {
          _jsonReTxt.PreListGoodsMsg[i].GoodsTitle = _jsonReTxt.PreListGoodsMsg[i].GoodsTitle.substring(0, 5);
        }
      }

      //-----全局变量赋值-----//
      this.setData({
        loadShopBarMsg_Data: _jsonReTxt,
        shopLabelArr: _shopLabelArr,
        shopId: _jsonReTxt.ShopMsg.ShopID
      });

    });
  },


  // ========================公共函数区========================== //

  /**
   * 设置商品详情值到页面
   */
  setWxParseVal: function (pGoodsDescHtml) {

    // ----加载显示HTML 商品描述-----//
    var that = this;
    var detail_content = pGoodsDescHtml; //"<div>我是HTML代码<b style='color:red'>324324324324</b></div><img src=\"http://localhost:1400/Upload/GooGoodsImg/GoGI_20040_202012131512031380.png\" /> ";
    WxParse.wxParse('detail_content', 'html', detail_content, that, 5);


  },

  /**
   * 显示图片预览组件
   * @param {*} e 
   */
  previewImg: function (e) {

    var _dataSet = e.currentTarget.dataset;

    console.log(this.data.preImgUrlArr);
    console.log(_dataSet.preIndex);

    //得到项目的协议头名称
    var _httpName = mUtils.getHttpProtocolURL(app.globalData.apiWebDoamin);
    var _preImgUrlArr = this.data.preImgUrlArr;

    for (var i = 0; i < _preImgUrlArr.length; i++) {
      if (_preImgUrlArr[i].indexOf("http") < 0) {
        _preImgUrlArr[i] = _httpName + _preImgUrlArr[i];
      }
    }

    mUtils.previewImg(_preImgUrlArr, _dataSet.preIndex);
  },

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


  //=====================在线客服接入==========================//

  /**
   * 构建【商家店铺】咨询进入IM在线客服系统 跳转 URL
   */
  buildBuyerGoToImSysURL_ShopWap: function () {
    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "1",
      "ShopUserID": this.data.shopUserId,
      "BuyerUserID": app.globalData.loginBuyerUserID,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.imSysApi_Index, _dataPOST, _jsonReTxt => {

      if (_jsonReTxt != "") {
        //设置跳转到 IM在线客服系统 的 URL cookie值
        mBusiCookie.saveGoToImSysUrlCookie(_jsonReTxt);
        //跳转到IM在线客服系统 WebView页
        mUtils.navigateToURL("../../../pages/webviewpg/imwebview/imwebview");
      } else {
        //直接拨打店铺客服电话
        mUtils.makePhoneCall(this.data.loadShopBarMsg_Data.ShopMsg.ShopMobile);
      }

    });
  },



})