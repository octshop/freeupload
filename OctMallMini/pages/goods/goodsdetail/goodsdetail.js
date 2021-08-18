// pages/goods/goodsdetail/goodsdetail.js
//在使用的View中引入WxParse模块
var WxParse = require('../../../wxParse/wxParse.js');
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiLogin = require('../../../busicode/busilogin.js');
var mBusiCode = require('../../../busicode/busicode.js');
var mBusiCookie = require('../../../busicode/busicookie.js');
const busicookie = require('../../../busicode/busicookie.js');

//--------公共变量--------//

//------数据分页变量----//
var mSearchWhereArr = ""; //搜索条件拼接字符串 "^"
var mIntPageCurrent = 1; //当前的分页索引
var mPageSum = 1; //总页数
var mRecordSum = 0; //总记录
var mPageHttpSending = false; //数据分页Http发送中

//--------公共变量------//
var mCounterTimer = null;
var mKeyEn = ""; //加密后的 商品分享KEY  带 + 的

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

    //----------底部滑出的自定义窗口---------------//
    isDisplaySlide: "none", //是否显示窗口 normal ,none
    isDisplaySlideShare: "none", //是否显示分享窗口 normal ,none
    slideBottomWinHeight: 400, //窗口高度
    slideBottomWinHeightShare: 400, //分享商品返佣 窗口

    //--------自定义参数------//
    goodsId: 0, //商品ID
    shopId: 0, //店铺ID
    shopUserId: 0, //商家UserID
    loadGoodsMsg_Data: null, //加载商品信息
    IsPayDeliveryShow: "", //是否货到付款
    IsShopExpenseShow: "", //是否支持 【到店消费 或者 快递，到店都支持】
    GoodsTitleShow: "", //顶部显示标题
    goodsPriceShow: "", // 商品显示价格
    marketPriceName: "", //门店，市场价格
    defaultSpecPropShow: "", //显示默认的规格属性
    loadSliderContent_Data: null, //加载商品图片轮播的内容
    preImgUrlArr: null, //图片预览数组
    loadSpecPropMsg_Data: null, //加载商品的规格和属性值
    specPropImgArr: null, //可选规格参数的图片数组
    specPropImgIsShow: false, //是否显示可选参数的图片列表
    giftIDArrMsg: null, //赠品信息数组
    btnOrderTxt: "立即购买", //立即购买的文本
    freightMoneyShow: 0, //运费显示
    getBuyerShareGoodsURL_Data: null, // 得到买家分享商品返佣的URL
    //-------------规格属性窗口----------//
    isSpecShowWin: false, //是否窗口显示规格
    isPropShowWin: false, //是否窗口显示属性
    specObjArrCurrent: null, //当前规格对象数组
    propObjArrCurrent: null, //当前选择规格后的属性对象数组
    specPropImgPreSrc: "", //当前的规格属性图片Src
    specPropSelName: "", //当前选择规格属性名称
    specIDOrPropIDCurrent: 0, //当前选择的规格属性ID
    finalDiscount: 0, //最终的折扣值
    goodsPriceCurrent: 0, //当前商品价格，选择不同规格时,计算了折扣的
    slideWinHeight: 450, //当前规格选择窗口高度
    orderNumCurrent: 1, //当前的订购数量
    //-------------优惠券相关----------//
    goodsAbleUseCouponsListJson: null, //得到商品可以使用的优惠券列表Json对象
    isDisplaySlideCoupons: "none", //是否显示优惠券窗口
    slideWinHeightCoupons: 430, //优惠券窗口高度
    couponsStyleValObj: null, //优惠券窗口相关样式显示值对象
    //-------------收货地址----------//
    loadBuyerDefaultReceiAddr_Data: null, //加载默认收货地址
    isDisplaySlideReceiAddr: "none", //是否显示收货地址窗口
    slideWinHeightReceiAddr: 430, //收货地址窗口高度
    loadBuyerReceiAddrList_Data: null, //收货地址列表对象
    selBuyerReceiAddrRegionName: "", //当前买家选择的收货地址区域名称
    //-------------限时秒杀----------//
    countDownTimer: null, //倒计时对象
    secKillTypeTxt: "抢购秒杀", //秒杀类型，限时秒杀，一般抢购秒杀
    countDownEndTime: "", //限时秒杀结束时间

    //-------------加载评价----------//
    initGoodsAppraiseSelTop_Data: null, //初始化商品评价,指定记录条数
    countAppraiseMsg_Data: null, //统计商品评价信息
    goodAppraisePercent: 0, //好评度百分比
    preGoodsAppraiseImgUrlArr: null, //商品评价图片预览数组
    preAllGoodsAppraiseImgUrlArr: null, //所有商品评价图片预览数组
    goodsAppraiseTabNum: 0, //0 全部，1 好评，2中评，3差评,4有图
    numberPage_Page: null, //商品评价数据分页

    //-------------加载店铺信息Bar----------//
    loadShopBarMsg_Data: null, // 加载店铺信息Bar数据
    shopLabelArr: null, //店铺的标签

    //-------------加载商品描述规格参数包装售后----------//
    loadGoodsDescPropPackAfterSale_Data: null, //加载商品描述规格参数包装售后数据
    chgGoodsDescTab: 1, //商品详情页切换不同内容
    goodsSpecPropTable: null, //商品详情规格属性表对象
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


    // // ----加载显示HTML 商品描述-----//
    // var that = this;
    // var detail_content = "<div>我是HTML代码<b style='color:red'>324324324324</b></div><img src=\"http://localhost:1400/Upload/GooGoodsImg/GoGI_20040_202012131512031380.png\" /> ";
    // WxParse.wxParse('detail_content', 'html', detail_content, that, 5);

    //-------自定义参数--------//
    var _goodsId = options.GID;
    if (_goodsId == undefined || _goodsId == "") {
      return;
    }
    var _keyEn = options.KeyEn; //加密后的 商品分享KEY  带 + 的
    //mUtils.logOut("_keyEn=" + _keyEn);
    if (_keyEn == undefined || _keyEn == "") {
      mKeyEn = "";
    } else {
      mKeyEn = _keyEn
      //------设置 - 分享商品返佣Cookie------//
      mBusiCookie.setBuyerShareGoodsCookie(mKeyEn);
    }

    this.setData({
      goodsId: _goodsId,
    });


    // ----自定义函数调用-----//

    //加载商品信息
    this.loadGoodsMsg();
    //加载商品图片轮播的内容
    this.loadSliderContent();

    // 如果用户登录啦，则设置全局的  loginBuyerUserID 和 loginPwdSha1 可根据这两个参数是否为空，判断是否用户登录
    mBusiLogin.setLoginBuyerUserIDPwdSha1Global(res => {

      //用户已登录的状态
      if (res != "") {

        //得到用户已选择的收货地址Cookie
        mBusiCookie.getBuyerSelReceiAddrRegionCookie(res => {

          //没有选择收货地址的情况下，重新加载买家的默认收货地址
          if (res == "" || res == undefined || res == null) {
            //加载买家的默认收货地址
            this.loadBuyerDefaultReceiAddr();
          } else {
            //直接加载Cookie中的区域范围名称
            this.setData({
              selBuyerReceiAddrRegionName: res.RegionNameArr,
            });
          }
        });

      }
    });


  },
  onUnload: function () {
    clearTimeout(mCounterTimer);
    mCounterTimer = null;
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
   * 第二个图标按钮
   */
  home: function () {
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
  // ========================自定义函数区========================== //
  /**
   * 加载商品图片轮播的内容
   */
  loadSliderContent: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "1",
      "GoodsID": this.data.goodsId,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.goodsApi_GoodsDetail, _dataPOST, _jsonReTxt => {

      var _preImgUrlArr = new Array();
      for (var i = 0; i < _jsonReTxt.GoodsImgList.length; i++) {
        _preImgUrlArr[i] = app.globalData.httpHeader + _jsonReTxt.GoodsImgList[i].ImgPath;
      }


      //----数据赋值----//
      this.setData({
        loadSliderContent_Data: _jsonReTxt,
        preImgUrlArr: _preImgUrlArr,
      });

    });

  },
  /**
   * 加载商品信息
   */
  loadGoodsMsg: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "2",
      "GoodsID": this.data.goodsId,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.goodsApi_GoodsDetail, _dataPOST, _jsonReTxt => {
      console.log(_jsonReTxt);
      if (_jsonReTxt == "") {
        return;
      }

      //如果存在拼团，则直接跳转到拼团页
      if (parseFloat(_jsonReTxt.GroupDiscount) > 0) {
        mUtils.redirectToURL("../../../pages/goods/groupdetail/groupdetail?GID=" + this.data.goodsId);
        return;
      }

      //是否支持货到付款
      var _IsPayDeliveryShow = "";
      if (_jsonReTxt.GoodsMsg.IsPayDelivery == "true") {
        _IsPayDeliveryShow = "货到付款";
      }

      //是否支持 【到店消费 或者 快递，到店都支持】 (true , false , both)
      var _IsShopExpenseShow = "";
      var _marketPriceName = "";
      if (_jsonReTxt.GoodsMsg.IsShopExpense == "true") {
        _IsShopExpenseShow = "到店消费或自取";
        _marketPriceName = "门店:";
      } else if (_jsonReTxt.GoodsMsg.IsShopExpense == "false") {
        _IsShopExpenseShow = "快递物流发货";
        _marketPriceName = "市场:";
      } else if (_jsonReTxt.GoodsMsg.IsShopExpense == "both") {
        _IsShopExpenseShow = "到店或快递物流";
        _marketPriceName = "市场:";
      }

      //顶部显示标题
      var _GoodsTitleShow = _jsonReTxt.GoodsMsg.GoodsTitle;
      if (_GoodsTitleShow.length > 8) {
        _GoodsTitleShow = _GoodsTitleShow.substring(0, 8);
      }

      //显示价格
      var _goodsPriceShow = this.showDiscountGoodsPrice(_jsonReTxt.GoodsMsgExtra.GoodsPriceLow, _jsonReTxt.GoodsMsg.Discount);

      //显示默认的规格属性
      var _defaultSpecPropShow = this.showDefaultSpecProp(_jsonReTxt.GoodsMsgExtra.GoodsPriceLowSpecPropArr);

      var _isSpecShowWin = false;
      if (_jsonReTxt.GoodsMsgExtra.SpecTitle != "" && _jsonReTxt.GoodsMsgExtra.SpecTitle != "-" && _jsonReTxt.GoodsMsgExtra.SpecTitle != undefined && _jsonReTxt.GoodsMsgExtra.SpecTitle != null) {
        _isSpecShowWin = true;
      }
      var _isPropShowWin = false;
      if (_jsonReTxt.GoodsMsgExtra.SpecAttrName != "" && _jsonReTxt.GoodsMsgExtra.SpecAttrName != "-" && _jsonReTxt.GoodsMsgExtra.SpecAttrName != undefined && _jsonReTxt.GoodsMsgExtra.SpecAttrName != null) {
        _isPropShowWin = true;
      }

      //赠品信息
      var _giftIDArrMsg = new Array();
      if (_jsonReTxt.GiftIDArrMsg != undefined && _jsonReTxt.GiftIDArrMsg != null) {
        for (var j = 0; j < _jsonReTxt.GiftIDArrMsg.length; j++) {
          if (_jsonReTxt.GiftIDArrMsg[j].GiftName.length > 12) {
            _jsonReTxt.GiftIDArrMsg[j].GiftName = _jsonReTxt.GiftIDArrMsg[j].GiftName.substring(0, 12);
          }
        }
        _giftIDArrMsg = _jsonReTxt.GiftIDArrMsg;
      }

      //设置最终的折扣值 ，首页是 商品本身打折，然后是秒杀折扣
      var _finalDiscount = 0;
      if (_jsonReTxt.GoodsMsg.Discount > 0) {
        _finalDiscount = _jsonReTxt.GoodsMsg.Discount;
      }
      //秒杀的折扣
      if (_jsonReTxt.SecKillMsg != undefined && _jsonReTxt.SecKillMsg != null && _jsonReTxt.SecKillMsg != "") {
        if (_jsonReTxt.SecKillMsg.SkDiscount > 0 && _jsonReTxt.SecKillMsg.SkStockNum > 0) {
          _finalDiscount = _jsonReTxt.SecKillMsg.SkDiscount;
        }
      }

      //------------数据赋值---------//
      this.setData({
        loadGoodsMsg_Data: _jsonReTxt,
        IsPayDeliveryShow: _IsPayDeliveryShow,
        IsShopExpenseShow: _IsShopExpenseShow,
        GoodsTitleShow: _GoodsTitleShow,
        goodsPriceShow: _goodsPriceShow,
        marketPriceName: _marketPriceName,
        defaultSpecPropShow: _defaultSpecPropShow,
        giftIDArrMsg: _giftIDArrMsg,
        isSpecShowWin: _isSpecShowWin,
        isPropShowWin: _isPropShowWin,
        finalDiscount: _finalDiscount,
        goodsPriceCurrent: _goodsPriceShow,
        shopUserId: _jsonReTxt.GoodsMsg.ShopUserID,
        shopId: _jsonReTxt.GoodsMsg.ShopID,
      });

      //-----------调用相关函数-----------//

      //加载商品的规格和属性值
      this.loadSpecPropMsg(_jsonReTxt.GoodsMsg.IsSpecParam);
      //得到 商品可以使用的优惠券列表  买家UserID不判断 
      this.goodsAbleUseCouponsList();
      //初始化限时秒杀Bar
      this.initSecKillBar(_jsonReTxt.SecKillMsg);
      //初始化商品评价,指定记录条数
      this.initGoodsAppraiseSelTop();
      //统计商品评价信息
      this.countAppraiseMsg();
      //加载店铺Bar信息
      this.loadShopBarMsg();
      // 初始化统计商品运费
      this.initFreightMoney();

      // ----得到买家分享商品返佣的URL------//
      if (_jsonReTxt.GoodsMsgExtra.ShareGoodsPersent > 0) {
        this.getBuyerShareGoodsURL();
      }

      //添加更新浏览足
      this.addBuyerBrowseHistory();


    });
  },

  /**
   * 加载商品的规格和属性值
   * @parm pIsSpecParam 是否有规格 [true / false]
   * */
  loadSpecPropMsg: function (pIsSpecParam) {


    if (pIsSpecParam == "false" || pIsSpecParam == null || pIsSpecParam == "") {

      this.setData({
        slideWinHeight: 205,
      });

      return "";
    }

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "3",
      "GoodsID": this.data.goodsId,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.goodsApi_GoodsDetail, _dataPOST, _jsonReTxt => {

      //当前规格对象数组
      var _specObjArrCurrent = [];
      //当前选择规格后的属性对象数组
      var _propObjArrCurrent = [];
      //当前选择的规格属性图片Src
      var _specPropImgPreSrc = "";
      var _specPropSelName = ""; //当前选择规格属性名称
      //当前的价格
      var _goodsPriceCurrent = 0;
      //当前选择的规格属性ID
      var _specIDOrPropIDCurrent = 0;

      //可选规格参数的图片数组
      var _specPropImgArr = new Array();
      var _specPropImgArrIndex = 0;
      for (var i = 0; i < _jsonReTxt.length; i++) {
        if (_jsonReTxt[i].SpecParamImg != null && _jsonReTxt[i].SpecParamImg != "") {
          _specPropImgArr[_specPropImgArrIndex] = _jsonReTxt[i].SpecParamImg;
          _specPropImgArrIndex++;
        }

        //可选规格图片数组
        for (var j = 0; j < _jsonReTxt[i].PropList.length; j++) {
          if (_jsonReTxt[i].PropList[j].SpecParamImg != null && _jsonReTxt[i].PropList[j].SpecParamImg != "") {
            _specPropImgArr[_specPropImgArrIndex] = _jsonReTxt[i].PropList[j].SpecParamImg;
            _specPropImgArrIndex++;
          }
        }

        //规格对象
        var _specObj = {
          "currentSelSpec": false
        };

        //设置默认第一个规格属性相关信息
        if (i == 0) {
          _specObj.currentSelSpec = true;
          if (_jsonReTxt[i].SpecParamImg != null && _jsonReTxt[i].SpecParamImg != "") {
            _specPropImgPreSrc = _jsonReTxt[i].SpecParamImg;
          }
          //当前的规格名称
          _specPropSelName = _jsonReTxt[i].SpecParamVal;
          //设置当前的价格，计算了折扣的
          if (_jsonReTxt[i].GoodsPrice > 0) {
            _goodsPriceCurrent = mBusiCode.getGoodsPriceDiscount(this.data.finalDiscount, _jsonReTxt[i].GoodsPrice);
          }
          //设置当前选择规格ID
          _specIDOrPropIDCurrent = _jsonReTxt[i].SpecID;

          //设置当前选择的规格的属性值
          if (_jsonReTxt[i].PropList != undefined && _jsonReTxt[i].PropList.length > 0) {
            //循环赋值
            for (var j = 0; j < _jsonReTxt[i].PropList.length; j++) {

              //属性对象
              var _propObj = {
                "currentSelProp": true,
                "SpecID": 0,
                "FatherSpecID": 0,
                "SpecParamVal": "",
                "SpecParamImg": "",
                "UploadGuid": "",
                "GoodsPrice": 0,
                "StockNum": 0,
                "GoodsID": 0
              };

              if (j == 0) {
                _propObj.currentSelProp = true;

                if (_jsonReTxt[i].PropList[j].SpecParamImg != null && _jsonReTxt[i].PropList[j].SpecParamImg != "") {
                  _specPropImgPreSrc = _jsonReTxt[i].PropList[j].SpecParamImg;
                }

                //当前属性名称
                _specPropSelName += "，" + _jsonReTxt[i].PropList[j].SpecParamVal;
                //设置当前的价格，计算了折扣的
                if (_jsonReTxt[i].PropList[j].GoodsPrice > 0) {
                  _goodsPriceCurrent = mBusiCode.getGoodsPriceDiscount(this.data.finalDiscount, _jsonReTxt[i].PropList[j].GoodsPrice);
                }

                //设置当前选择规格ID
                _specIDOrPropIDCurrent = _jsonReTxt[i].PropList[j].SpecID;


              } else {
                _propObj.currentSelProp = false;
              }
              //其他属性值
              _propObj.SpecID = _jsonReTxt[i].PropList[j].SpecID
              _propObj.FatherSpecID = _jsonReTxt[i].PropList[j].FatherSpecID
              _propObj.SpecParamVal = _jsonReTxt[i].PropList[j].SpecParamVal
              _propObj.SpecParamImg = _jsonReTxt[i].PropList[j].SpecParamImg
              _propObj.UploadGuid = _jsonReTxt[i].PropList[j].UploadGuid
              _propObj.GoodsPrice = _jsonReTxt[i].PropList[j].GoodsPrice
              _propObj.StockNum = _jsonReTxt[i].PropList[j].StockNum
              _propObj.GoodsID = _jsonReTxt[i].PropList[j].GoodsID
              //设置数组值
              _propObjArrCurrent[j] = _propObj;

            }
            console.log(_propObjArrCurrent);

          }
        } else {
          _specObj.currentSelSpec = false;
        }

        //设置数组值
        _specObjArrCurrent[i] = _specObj;

      }
      if (_specPropImgArr.length > 0) {
        this.setData({
          specPropImgIsShow: true, //显示
        });
      }

      //----数据赋值----//
      this.setData({
        loadSpecPropMsg_Data: _jsonReTxt,
        specPropImgArr: _specPropImgArr,
        specObjArrCurrent: _specObjArrCurrent,
        propObjArrCurrent: _propObjArrCurrent,
        specPropImgPreSrc: _specPropImgPreSrc,
        specPropSelName: _specPropSelName,
        goodsPriceCurrent: _goodsPriceCurrent,
        specIDOrPropIDCurrent: _specIDOrPropIDCurrent,
      });

    });

  },
  /**
   * 选择当前规格属性
   */
  selCurrentSpec: function (e) {
    var _dataset = e.currentTarget.dataset;
    //console.log(_dataset);
    var _specId = _dataset.specId;

    //设置当前选择的规格相关信息
    this.setSelCurrentSpec(_specId);
  },
  /**
   * 设置当前选择的规格相关信息
   * @param {*} pSpecID 规格ID
   */
  setSelCurrentSpec: function (pSpecID) {

    var _specIDOrPropIDCurrent = pSpecID;

    //当前规格对象数组
    var _specObjArrCurrent = [];
    //当前选择规格后的属性对象数组
    var _propObjArrCurrent = [];
    //当前选择的规格属性图片Src
    var _specPropImgPreSrc = "";
    var _specPropSelName = ""; //当前选择规格属性名称
    //当前的价格
    var _goodsPriceCurrent = 0;

    //循环判断当前选择的规格是哪个
    for (var i = 0; i < this.data.loadSpecPropMsg_Data.length; i++) {

      if (pSpecID == this.data.loadSpecPropMsg_Data[i].SpecID) {
        //规格对象
        var _specObj = {
          "currentSelSpec": true
        };

        //设置规格属性相关信息
        if (this.data.loadSpecPropMsg_Data[i].SpecParamImg != null && this.data.loadSpecPropMsg_Data[i].SpecParamImg != "") {
          _specPropImgPreSrc = this.data.loadSpecPropMsg_Data[i].SpecParamImg;
        }
        //当前的规格名称
        _specPropSelName = this.data.loadSpecPropMsg_Data[i].SpecParamVal;
        //设置当前的价格，计算了折扣的
        if (this.data.loadSpecPropMsg_Data[i].GoodsPrice > 0) {
          _goodsPriceCurrent = mBusiCode.getGoodsPriceDiscount(this.data.finalDiscount, this.data.loadSpecPropMsg_Data[i].GoodsPrice);
        }

        //设置当前选择的规格的属性值
        if (this.data.loadSpecPropMsg_Data[i].PropList != undefined && this.data.loadSpecPropMsg_Data[i].PropList.length > 0) {
          //循环赋值
          for (var j = 0; j < this.data.loadSpecPropMsg_Data[i].PropList.length; j++) {

            //属性对象
            var _propObj = {
              "currentSelProp": true,
              "SpecID": 0,
              "FatherSpecID": 0,
              "SpecParamVal": "",
              "SpecParamImg": "",
              "UploadGuid": "",
              "GoodsPrice": 0,
              "StockNum": 0,
              "GoodsID": 0
            };

            if (j == 0) {
              _propObj.currentSelProp = true;

              if (this.data.loadSpecPropMsg_Data[i].PropList[j].SpecParamImg != null && this.data.loadSpecPropMsg_Data[i].PropList[j].SpecParamImg != "") {
                _specPropImgPreSrc = this.data.loadSpecPropMsg_Data[i].PropList[j].SpecParamImg;
              }

              //当前属性名称
              _specPropSelName += "，" + this.data.loadSpecPropMsg_Data[i].PropList[j].SpecParamVal;
              //设置当前的价格，计算了折扣的
              if (this.data.loadSpecPropMsg_Data[i].PropList[j].GoodsPrice > 0) {
                _goodsPriceCurrent = mBusiCode.getGoodsPriceDiscount(this.data.finalDiscount, this.data.loadSpecPropMsg_Data[i].PropList[j].GoodsPrice);
              }

              _specIDOrPropIDCurrent = this.data.loadSpecPropMsg_Data[i].PropList[j].SpecID;


            } else {
              _propObj.currentSelProp = false;
            }
            //其他属性值
            _propObj.SpecID = this.data.loadSpecPropMsg_Data[i].PropList[j].SpecID
            _propObj.FatherSpecID = this.data.loadSpecPropMsg_Data[i].PropList[j].FatherSpecID
            _propObj.SpecParamVal = this.data.loadSpecPropMsg_Data[i].PropList[j].SpecParamVal
            _propObj.SpecParamImg = this.data.loadSpecPropMsg_Data[i].PropList[j].SpecParamImg
            _propObj.UploadGuid = this.data.loadSpecPropMsg_Data[i].PropList[j].UploadGuid
            _propObj.GoodsPrice = this.data.loadSpecPropMsg_Data[i].PropList[j].GoodsPrice
            _propObj.StockNum = this.data.loadSpecPropMsg_Data[i].PropList[j].StockNum
            _propObj.GoodsID = this.data.loadSpecPropMsg_Data[i].PropList[j].GoodsID
            //设置数组值
            _propObjArrCurrent[j] = _propObj;
          }
          //console.log(_propObjArrCurrent);
        }
        //设置数组值
        _specObjArrCurrent[i] = _specObj;
      } else {
        //规格对象
        var _specObj = {
          "currentSelSpec": false
        };
        //设置数组值
        _specObjArrCurrent[i] = _specObj;
      }
    }
    //----数据赋值----//
    this.setData({
      specObjArrCurrent: _specObjArrCurrent,
      propObjArrCurrent: _propObjArrCurrent,
      specPropImgPreSrc: _specPropImgPreSrc,
      specPropSelName: _specPropSelName,
      goodsPriceCurrent: _goodsPriceCurrent,
      specIDOrPropIDCurrent: _specIDOrPropIDCurrent,
    });

  },
  /**
   * 单击选择属性
   * @param {*} pPropID  属性ID 也就是 SpecID
   */
  selCurrentProp: function (e) {
    var _dataset = e.currentTarget.dataset;
    // console.log(_dataset);
    var _propId = _dataset.propId;
    if (_propId == undefined || _propId == null || _propId <= 0) {
      return;
    }
    //console.log(this.data.propObjArrCurrent);
    //设置当前选择的属性相关信息
    this.setSelCurrentProp(_propId);
  },
  /**
   * 设置当前选择的属性相关信息
   */
  setSelCurrentProp: function (pPropId) {
    //当前选择的规格属性图片Src
    var _specPropImgPreSrc = "";
    var _specPropSelName = this.data.specPropSelName; //当前选择规格属性名称
    //当前的价格
    var _goodsPriceCurrent = 0;
    //当前的属性对象数组 
    var _propObjArrCurrent = this.data.propObjArrCurrent;

    //循环判断当前选择的属性
    for (var i = 0; i < this.data.propObjArrCurrent.length; i++) {

      //属性对象
      var _propObj = {
        "currentSelProp": false,
        "SpecID": this.data.propObjArrCurrent[i].SpecID,
        "FatherSpecID": this.data.propObjArrCurrent[i].FatherSpecID,
        "SpecParamVal": this.data.propObjArrCurrent[i].SpecParamVal,
        "SpecParamImg": this.data.propObjArrCurrent[i].SpecParamImg,
        "UploadGuid": this.data.propObjArrCurrent[i].UploadGuid,
        "GoodsPrice": this.data.propObjArrCurrent[i].GoodsPrice,
        "StockNum": this.data.propObjArrCurrent[i].StockNum,
        "GoodsID": this.data.propObjArrCurrent[i].GoodsID
      };

      //判断是否为当前选择值
      if (pPropId == this.data.propObjArrCurrent[i].SpecID) {

        //设置当前属性为选择状态
        _propObj.currentSelProp = true;

        if (this.data.propObjArrCurrent[i].SpecParamImg != undefined && this.data.propObjArrCurrent[i].SpecParamImg != null && this.data.propObjArrCurrent[i].SpecParamImg != "") {
          _specPropImgPreSrc = this.data.propObjArrCurrent[i].SpecParamImg;
        } else {

        }

        //当前属性名称
        _specPropSelName = _specPropSelName.substring(0, _specPropSelName.indexOf("，"));
        _specPropSelName += "，" + this.data.propObjArrCurrent[i].SpecParamVal;
        console.log("_specPropSelName=" + _specPropSelName);

        //设置当前的价格，计算了折扣的
        if (this.data.propObjArrCurrent[i].GoodsPrice > 0) {
          _goodsPriceCurrent = mBusiCode.getGoodsPriceDiscount(this.data.finalDiscount, this.data.propObjArrCurrent[i].GoodsPrice);
        }

      } else {
        //设置当前属性为未选择状态
        _propObj.currentSelProp = false;
      }
      //重新设置属性对象数组值
      _propObjArrCurrent[i] = _propObj;
    }

    //------设置全局变量值------//
    this.setData({
      propObjArrCurrent: _propObjArrCurrent,
      specPropSelName: _specPropSelName,
      goodsPriceCurrent: _goodsPriceCurrent,
      specIDOrPropIDCurrent: pPropId,
    });
    //不为空则设置规格图片
    if (_specPropImgPreSrc != "") {
      this.setData({
        specPropImgPreSrc: _specPropImgPreSrc,
      });
    }


  },

  /**
   * 显示默认的规格属性
   * @param {any} pGoodsPriceLowSpecPropArr 规格属性值 (规格ID^规格名称)或(规格ID^规格名称 | 属性ID^属性名称)
   */
  showDefaultSpecProp: function (pGoodsPriceLowSpecPropArr) {
    var _backMsg = "";
    if (pGoodsPriceLowSpecPropArr.indexOf("|") >= 0) {
      var _specPropArr = pGoodsPriceLowSpecPropArr.split("|");
      _backMsg = _specPropArr[0].split("^")[1] + "，" + _specPropArr[1].split("^")[1]
    } else {
      _backMsg = pGoodsPriceLowSpecPropArr.split("^")[1];
    }
    if (_backMsg == undefined) {
      _backMsg = "";
    }
    return _backMsg;
  },
  /**
   * 显示打折后的商品价格
   * @param {any} pGoodsPriceLow 商品规格最低价
   * @param {any} pDiscount 折扣
   */
  showDiscountGoodsPrice: function (pGoodsPriceLow, pDiscount) {

    if (pDiscount != "0") {
      var _goodsPriceLow = parseFloat(pGoodsPriceLow) * (parseFloat(pDiscount) * 0.1);
      return mUtils.formatNumberDotDigit(_goodsPriceLow, 2);
    }

    return mUtils.formatNumberDotDigit(pGoodsPriceLow, 2);

  },
  /**
   * 当订购数量直接输入数值时
   * @param {*} e 
   */
  bindInputOrderNum: function (e) {
    //console.log(e);
    var _detailVal = e.detail.value;
    _detailVal = parseInt(_detailVal);

    //-----设置全部变量值-----//
    this.setData({
      orderNumCurrent: _detailVal,
    });
  },
  /**
   * 订购数量文本框失去焦点
   * @param {*} e 
   */
  bindBlurOrderNum: function (e) {
    var _detailVal = e.detail.value;
    if (_detailVal == "" || _detailVal == undefined || _detailVal == null) {
      //-----设置全部变量值-----//
      this.setData({
        orderNumCurrent: 1,
      });
    }
  },
  /**
   * 增减订购数量
   * @param {} e 
   */
  addReduceOrderNum: function (e) {
    var _dataset = e.currentTarget.dataset;
    //console.log(_dataset);
    var _exeType = _dataset.exeType //操作类型 add / reduce

    //当前订购数量
    var _orderNumCurrent = this.data.orderNumCurrent;
    if (_exeType == "add") {
      _orderNumCurrent++;
    } else if (_exeType == "reduce") {
      if (_orderNumCurrent <= 1) {
        _orderNumCurrent = 1;
      } else {
        _orderNumCurrent--;
      }
    }
    //-----设置全部变量值-----//
    this.setData({
      orderNumCurrent: _orderNumCurrent,
    });

  },
  /**
   * 切换选项卡
   * @param {} e 
   */
  chgTab: function (e) {
    console.log(e.currentTarget);
    console.log("e.currentTarget.dataset.tab=" + e.currentTarget.dataset.tab);
    var _tabNum = e.currentTarget.dataset.tab;
    if (_tabNum == 1) //商品
    {
      this.setData({
        octContentMarginTop: this.data.navbarHeight + 35,
        navDetailIsShow: false,
        navTabIndex: _tabNum,
      });
    } else if (_tabNum == 2) //详情
    {

      this.setData({
        octContentMarginTop: this.data.navbarHeight + 35 + 35,
        navDetailIsShow: true, //显示商品详情切换
        navTabIndex: _tabNum,
      });

      //加载商品描述规格参数包装售后
      this.loadGoodsDescPropPackAfterSale();

      if (this.data.loadGoodsDescPropPackAfterSale_Data != null) {
        //console.log("执行啦--------------");
        //设置商品详情值到页面
        this.setWxParseVal("");
        this.setWxParseVal(this.data.loadGoodsDescPropPackAfterSale_Data.GoodsDesc);
      }


    } else if (_tabNum == 3) //评价
    {
      this.setData({
        octContentMarginTop: this.data.navbarHeight + 35,
        navDetailIsShow: false,
        navTabIndex: _tabNum,
      });

      //加载商品评价数据分页
      if (this.data.numberPage_Page == null) {
        //调用数据分页
        this.numberPage("1");
      }

    }

    // 控制滚动
    wx.pageScrollTo({
      scrollTop: 0
    })

  },
  /**
   * 弹出窗口的加入购物车
   */
  btnAddToSCartWin: function () {
    //判断买家是否登录 
    mBusiLogin.isLoginUserNavigate(res => {
      console.log(res);

      if (res == "") {
        return;
      }

      //构造POST参数
      var _dataPOST = {
        "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
        "Type": "9",
        "GoodsID": this.data.goodsId,
        "BuyerUserID": app.globalData.loginBuyerUserID,
        "SpecIDOrPropID": this.data.specIDOrPropIDCurrent,
        "OrderNum": this.data.orderNumCurrent,
      };

      //加载提示
      mUtils.showLoadingWin("加入中");

      //正式发送Http请求
      mHttp.postHttp(app.apiURLData.goodsApi_GoodsDetail, _dataPOST, _jsonReTxt => {

        //移除加载提示
        mUtils.hideLoadingWin();

        //请先登录
        if (_jsonReTxt == "92") {
          mUtils.showToast("请先登录！");
          return;
        }

        if (_jsonReTxt.ErrCode == "ATSC_02") {
          _jsonReTxt.ErrMsg = "加入购物车成功";

          //关闭窗口
          this.closeSlideBottom();

        }
        if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {

          if (_jsonReTxt.ErrMsg.indexOf("成功") >= 0) {
            mUtils.showToastSu(_jsonReTxt.ErrMsg);
          } else {
            mUtils.showToast(_jsonReTxt.ErrMsg);
          }
          return;
        }
        if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {

          //关闭窗口
          this.closeSlideBottom();
          mUtils.showToastSu(_jsonReTxt.Msg);

          return;
        }

      });


    }, false, "", "../../../pages/goods/goodsdetail/goodsdetail^GID~" + this.data.goodsId);
  },
  /**
   * 立即订购
   */
  btnOrderNow: function () {
    //判断买家是否登录 
    mBusiLogin.isLoginUserNavigate(res => {
      console.log(res);

      if (res == "") {
        return;
      }

      //构造POST参数
      var _dataPOST = {
        "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
        "Type": "8",
        "GID": this.data.goodsId,
        "SelSpecPropIDVal": this.data.specIDOrPropIDCurrent,
        "OrderNumber": this.data.orderNumCurrent,
        "BuyerReceiAddrSelCookieArr": "", //当前选择的收货地址
      };

      //加载提示
      mUtils.showLoadingWin("订购中");

      //正式发送Http请求
      mHttp.postHttp(app.apiURLData.goodsApi_GoodsDetail, _dataPOST, _jsonReTxt => {
        //移除加载提示
        mUtils.hideLoadingWin();

        //错误信息
        if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined) {
          mUtils.showToast(_jsonReTxt.ErrMsg);
          return;
        }

        if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined) {

          //写入收货地址的Cookie信息

          //设置需要订单商品Cookie数组,以便下单使用 _单个商品订购通道  用“^”拼接【GoodsID ^ OrderNum ^ SpecID ^ pGroupSettingID】
          mBusiCookie.setOrderGoodsMsgCookieArrSingle(_jsonReTxt.DataDic.GoodsID, _jsonReTxt.DataDic.OrderNum, _jsonReTxt.DataDic.SpecID);

          console.log("执行啦");
          mUtils.navigateToURL("../../../pages/buyer/placeorder/placeorder");


        }


      });
    }, false, "", "../../../pages/goods/goodsdetail/goodsdetail^GID~" + this.data.goodsId);
  },
  /**
   * 得到 商品可以使用的优惠券列表  买家UserID不判断 
   */
  goodsAbleUseCouponsList: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "5",
      "ShopUserID": this.data.shopUserId,
      "GoodsID": this.data.goodsId,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.goodsApi_GoodsDetail, _dataPOST, _jsonReTxt => {

      //------格式化与赋值返回数据------//
      var _couponsStyleValObj = [];

      if (_jsonReTxt.GoodsAbleUseCouponsList != undefined) {
        for (var i = 0; i < _jsonReTxt.GoodsAbleUseCouponsList.length; i++) {
          var _goodsAbleUseCoupons = _jsonReTxt.GoodsAbleUseCouponsList[i];
          _couponsStyleValObj[i] = {
            "couponsId": _goodsAbleUseCoupons.CouponsID,
            "btnValTxt": "立即领取",
            "isGetCoupons": false
          };
        }
      }
      //console.log(_couponsStyleValObj);

      //------全局变量赋值-----//
      this.setData({
        goodsAbleUseCouponsListJson: _jsonReTxt,
        couponsStyleValObj: _couponsStyleValObj
      });

    });
  },
  /**
   * 买家领取优惠券
   * @param {*} e 
   */
  buyerGetCoupons: function (e) {
    var _dataset = e.currentTarget.dataset;
    var _couponsID = _dataset.couponsId;

    //判断买家是否登录 
    mBusiLogin.isLoginUserNavigate(res => {
      //console.log(res);

      if (res == "") {
        return;
      }

      //判断当前优惠券是否已被领取
      for (var j = 0; j < this.data.couponsStyleValObj.length; j++) {
        if (_couponsID == this.data.couponsStyleValObj[j].couponsId && this.data.couponsStyleValObj[j].isGetCoupons == true) {
          mUtils.showToast("已领取！");
          return;
        }
      }

      //构造POST参数
      var _dataPOST = {
        "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
        "Type": "6",
        "CouponsID": _couponsID,
      };

      //加载提示
      mUtils.showLoadingWin("领取中");

      //正式发送Http请求
      mHttp.postHttp(app.apiURLData.goodsApi_GoodsDetail, _dataPOST, _jsonReTxt => {
        //移除加载提示
        mUtils.hideLoadingWin();

        //已领取
        if (_jsonReTxt.Code == "BGC_01" || _jsonReTxt.ErrCode == "BGC_02") {
          // $("#GetCouponsBtn_" + pCouponsID).html("已领取");

          console.log(this.data.couponsStyleValObj);

          //已领取的样式
          var _couponsStyleValObj = [];
          for (var i = 0; i < this.data.couponsStyleValObj.length; i++) {

            console.log("_couponsID=" + _couponsID);
            console.log("this.data.couponsStyleValObj[i].couponsId=" + this.data.couponsStyleValObj[i].couponsId);

            if (_couponsID == this.data.couponsStyleValObj[i].couponsId) {
              _couponsStyleValObj[i] = {
                "couponsId": this.data.couponsStyleValObj[i].couponsId,
                "btnValTxt": "已领取",
                "isGetCoupons": true
              };
            } else {
              if (this.data.couponsStyleValObj[i].isGetCoupons == false) {
                _couponsStyleValObj[i] = {
                  "couponsId": this.data.couponsStyleValObj[i].couponsId,
                  "btnValTxt": "立即领取",
                  "isGetCoupons": false
                };
              } else {
                _couponsStyleValObj[i] = {
                  "couponsId": this.data.couponsStyleValObj[i].couponsId,
                  "btnValTxt": "已领取",
                  "isGetCoupons": true
                };
              }

            }
          }

          console.log(_couponsStyleValObj);

          //-------全局变量赋值----//
          this.setData({
            couponsStyleValObj: _couponsStyleValObj,
          });

          return;
        } else {
          // $("#GetCouponsBtn_" + pCouponsID).html("领取失败");
          // reTxt;
          mUtils.showToast(_jsonReTxt.ErrMsg);
        }



      });

    }, false, "", "../../../pages/goods/goodsdetail/goodsdetail^GID~" + this.data.goodsId);
  },
  /**
   * 加载买家的默认收货地址
   */
  loadBuyerDefaultReceiAddr: function () {

    //判断买家是否登录
    mBusiLogin.isLoginUser(res => {

      if (res == false) {
        return; //买家没有登录
      }

      //构造POST参数
      var _dataPOST = {
        "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
        "Type": "4",
        "GoodsID": this.data.goodsId,
      };

      //正式发送Http请求
      mHttp.postHttp(app.apiURLData.goodsApi_GoodsDetail, _dataPOST, _jsonReTxt => {

        //console.log(_jsonReTxt);

        //设置默认收货地址为选择的收货地址，保存到Cookie中
        mBusiCookie.saveBuyerSelReceiAddrRegionCookie(_jsonReTxt.ReceiAddrRegion.BReceiAddrID, _jsonReTxt.ReceiAddrRegion.RegionCodeArr, _jsonReTxt.ReceiAddrRegion.RegionNameArr);

        //-----全局变量赋值-----//
        this.setData({
          loadBuyerDefaultReceiAddr_Data: _jsonReTxt,
          selBuyerReceiAddrRegionName: _jsonReTxt.ReceiAddrRegion.RegionNameArr,
        });

        //console.log("执行加载默认收货地址_jsonReTxt.BReceiAddrID=" + _jsonReTxt.ReceiAddrRegion.BReceiAddrID);
        //初始化统计商品运费
        this.initFreightMoney();

      });

    });
  },
  /**
   * 打开选择收货地址窗口
   */
  openSelReceiAddrWin: function () {

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
        "PageCurrent": "1",
      };

      //加载提示
      mUtils.showLoadingWin("加载中");

      //正式发送Http请求
      mHttp.postHttp(app.apiURLData.buyerApi_ReceiAddrList, _dataPOST, _jsonReTxt => {

        //移除加载提示
        mUtils.hideLoadingWin();
        //打开收货地址窗口
        this.setData({
          isDisplaySlideReceiAddr: "normal",
          loadBuyerReceiAddrList_Data: _jsonReTxt,
        });


      });

    }, false, "", "../../../pages/goods/goodsdetail/goodsdetail^GID~" + this.data.goodsId);
  },
  /**
   * 选择当前收货地址
   */
  selReceiAddrCurrent: function (e) {
    var _dataset = e.currentTarget.dataset;
    //console.log(_dataset);
    var _receiAddrId = _dataset.receiAddrId;
    var _regionCodeArr = _dataset.regionCodeArr;
    var _regionNameArr = _dataset.regionNameArr;

    mBusiCookie.saveBuyerSelReceiAddrRegionCookie(_receiAddrId, _regionCodeArr, _regionNameArr);
    //关闭窗口
    this.closeSlideBottom();

    //全局变量赋值
    this.setData({
      selBuyerReceiAddrRegionName: _regionNameArr,
    });

    //重新初始化运算计算
    this.initFreightMoney();

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
        "FocusFavType": "goods",
        "GoodsID": this.data.goodsId,
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
    }, false, "", "../../../pages/goods/goodsdetail/goodsdetail^GID~" + this.data.goodsId);

  },

  /**
   * 添加更新浏览足
   */
  addBuyerBrowseHistory: function () {

    //判断买家是否登录 
    mBusiLogin.isLoginUserNavigate(res => {
      //console.log(res);

      if (res == "") {
        return;
      }

      //构造POST参数
      var _dataPOST = {
        "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
        "Type": "2",
        "GoodsID": this.data.goodsId,
      };

      //正式发送Http请求
      mHttp.postHttp(app.apiURLData.buyerApi_BuyerBrowseHistory, _dataPOST, _jsonReTxt => {
        //错误提示
        if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {}
        //成功提示
        if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {

        }
      });
    }, false, "", "../../../pages/goods/goodsdetail/goodsdetail^GID~" + this.data.goodsId);

  },

  /**
   * 初始化统计商品运费
   */
  initFreightMoney: function () {

    //获取当前选择的收货地址Cookie  【 BReceiAddrID ^ 430000_430100_430121 ^ 湖南省_长沙市_长沙县 】
    mBusiCookie.getBuyerSelReceiAddrRegionCookie(res => {
      if (res != "") {
        var _regionProCode = res.RegionCodeArr.split("_")[0];

        //发送Http请求，统计运费
        //构造POST参数
        var _dataPOST = {
          "SignKey": mHttp.signKeyRsa(),
          "Type": "7",
          "FtID": this.data.loadGoodsMsg_Data.GoodsMsg.FtID,
          "RegionProCode": _regionProCode,
        };

        //正式发送Http请求
        mHttp.postHttp(app.apiURLData.goodsApi_GoodsDetail, _dataPOST, _jsonReTxt => {
          console.log(_jsonReTxt);
          if (_jsonReTxt == "") {
            return;
          }

          var _freightMoney = "免运费";
          if (_jsonReTxt.DataDic.FreightMoney > 0) {
            _freightMoney = "￥ " + _jsonReTxt.DataDic.FreightMoney;
          }
          //----赋值全局变量-----//
          this.setData({
            freightMoneyShow: _freightMoney,
          });



        });

      } else {
        //----赋值全局变量-----//
        this.setData({
          freightMoneyShow: "免运费",
        });
      }
    });

  },

  //------------限时秒杀-----------------//
  /**
   * 初始化限时秒杀Bar
   * @param {*} pJsonSecKillMsg 
   */
  initSecKillBar: function (pJsonSecKillMsg) {
    //没有折扣的情况
    if (pJsonSecKillMsg.SkDiscount <= 0 || pJsonSecKillMsg.SkDiscount >= 10) {
      return;
    }

    var _secKillTypeTxt = "抢购秒杀";

    //判断是否为 限时秒杀 或一般抢购秒杀
    if (pJsonSecKillMsg.EndTime != "" && pJsonSecKillMsg.EndTime != null && pJsonSecKillMsg.EndTime != undefined) {
      _secKillTypeTxt = "限时秒杀";

      this.setData({
        countDownEndTime: pJsonSecKillMsg.EndTime,
      });

      //倒计时开始
      this.countDown();

    } else {
      _secKillTypeTxt = "抢购秒杀";
    }

    //------全局变量赋值------//
    this.setData({
      btnOrderTxt: "立即抢购",
      secKillTypeTxt: _secKillTypeTxt,
    });

  },
  //================倒计时===============//
  addZero: function (i) {
    return i < 10 ? "0" + i : i + "";
  },
  /**
   * 倒计时器 
   */
  countDown: function () {

    clearTimeout(mCounterTimer);
    mCounterTimer = null;

    var nowtime = new Date();
    //var endtime = new Date("2020/07/03 17:57:00");
    var endtime = new Date(this.data.countDownEndTime);
    var lefttime = parseInt((endtime.getTime() - nowtime.getTime()) / 1000);
    var d = parseInt(lefttime / (24 * 60 * 60))
    var h = parseInt(lefttime / (60 * 60) % 24);
    var m = parseInt(lefttime / 60 % 60);
    var s = parseInt(lefttime % 60);
    d = this.addZero(d)
    h = this.addZero(h);
    m = this.addZero(m);
    s = this.addZero(s);

    // var myJsVal = "";
    // myJsVal += "<span>" + d + "</span>天";
    // myJsVal += "<span>" + h + "</span>:";
    // myJsVal += "<span>" + m + "</span>:";
    // myJsVal += "<span>" + s + "</span>";

    // // document.querySelector("#SecKillMid").innerHTML = `活动倒计时  ${d}天 ${h} 时 ${m} 分 ${s} 秒`;
    // document.querySelector("#SecKillMid").innerHTML = myJsVal;
    var _isOver = false; //是否结束
    if (lefttime <= 0) {
      //document.querySelector("#SecKillMid").innerHTML = "活动已结束";
      _isOver = true;
    }

    var _countDownTimerObj = {
      "day": d,
      "hour": h,
      "minute": m,
      "second": s,
      "isOver": _isOver,
    }
    //------全局变量赋值-------//
    this.setData({
      countDownTimerObj: _countDownTimerObj,
    });

    //console.log(this.data.countDownTimerObj);

    if (_isOver == false) //没有结束
    {
      mCounterTimer = setTimeout(this.countDown, 1000);
    }
  },
  //--------评价相关-----//
  /**
   * 初始化商品评价,指定记录条数
   */
  initGoodsAppraiseSelTop: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "2",
      "GoodsID": this.data.goodsId,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.buyerApi_AppraiseDetail, _dataPOST, _jsonReTxt => {

      var _preGoodsAppraiseImgUrlArr = new Array();
      var _indexPreImg = 0;

      if (_jsonReTxt.ListGooAppraiseImg != undefined) {
        //循环格式化数据
        for (var i = 0; i < _jsonReTxt.ListGooAppraiseImg.length; i++) {
          var _item = _jsonReTxt.ListGooAppraiseImg[i].ListGooAppraiseImgs;
          for (var j = 0; j < _item.length; j++) {
            _preGoodsAppraiseImgUrlArr[_indexPreImg] = _item[j].ImgUrl;
            _indexPreImg++;
          }
        }
      }

      //-----全局变量赋值-----//
      this.setData({
        initGoodsAppraiseSelTop_Data: _jsonReTxt,
        preGoodsAppraiseImgUrlArr: _preGoodsAppraiseImgUrlArr,
      })


    });
  },

  /**
   * 统计商品评价信息
   */
  countAppraiseMsg: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "2",
      "GoodsID": this.data.goodsId,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.goodsApi_GoodsAppraise, _dataPOST, _jsonReTxt => {

      //-----全局变量赋值-----//
      this.setData({
        countAppraiseMsg_Data: _jsonReTxt,
        goodAppraisePercent: parseInt(_jsonReTxt.GoodAppraisePercent * 100),
      });

    });


  },
  /**
   * 切换不同的评价类型
   * @param {*} e 
   */
  chgAppraiseTab: function (e) {
    var _dataset = e.currentTarget.dataset;
    console.log(_dataset);
    var _tabNum = _dataset.tabNum;

    //全局变量赋值
    this.setData({
      goodsAppraiseTabNum: _tabNum,
    });
    //重新加载数据
    this.numberPage("1");

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
      });

    });
  },
  //-------------加载商品描述规格参数包装售后-----------------------//

  /**
   * 加载商品描述规格参数包装售后
   */
  loadGoodsDescPropPackAfterSale: function () {

    if (this.data.loadGoodsDescPropPackAfterSale_Data != null && this.data.loadGoodsDescPropPackAfterSale_Data != "") {
      //设置商品详情值到页面
      this.setWxParseVal(this.data.loadGoodsDescPropPackAfterSale_Data.GoodsDesc);
      return;
    }
    //构造POST参数
    var _dataPOST = {
      // "SignKey": mHttp.signKeyRsa(),
      "Type": "1",
      "GoodsID": this.data.goodsId,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.goodsApi_GoodsDetailMsg, _dataPOST, _jsonReTxt => {

      //_jsonReTxt.GoodsDesc = mUtils.strReplace( _jsonReTxt.GoodsDesc,"//","http://");
      //设置商品详情值到页面
      this.setWxParseVal(_jsonReTxt.GoodsDesc);

      //表格的数组对象
      var _goodsSpecPropTable = new Array();
      var _goodsSpecPropIndex = 0;

      var _goodsTypeNeedProp = mUtils.splitStringJoinChar(_jsonReTxt.GoodsTypeNeedProp, '^');
      for (var i = 0; i < _goodsTypeNeedProp.length; i++) {
        var _specPropArr = _goodsTypeNeedProp[i].split("_");
        _goodsSpecPropTable[_goodsSpecPropIndex] = {
          "SpecPropName": _specPropArr[0],
          "SpecPropVal": _specPropArr[1],
        }
        _goodsSpecPropIndex++;
      }
      var _goodsTypeCustomProp = mUtils.splitStringJoinChar(_jsonReTxt.GoodsTypeCustomProp, '^');
      for (var i = 0; i < _goodsTypeCustomProp.length; i++) {
        var _specPropArr = _goodsTypeCustomProp[i].split("|");
        _goodsSpecPropTable[_goodsSpecPropIndex] = {
          "SpecPropName": _specPropArr[0],
          "SpecPropVal": _specPropArr[1],
        }
        _goodsSpecPropIndex++;
      }
      console.log(_goodsSpecPropTable);

      //全局变量赋值
      this.setData({
        loadGoodsDescPropPackAfterSale_Data: _jsonReTxt,
        goodsSpecPropTable: _goodsSpecPropTable,
      });

    });
  },
  /**
   * 切换商品详情页显示内容
   * @param {*} e 
   */
  chgGoodsDescTabView: function (e) {
    var _dataset = e.currentTarget.dataset;
    var _tabNum = _dataset.tabNum;
    console.log("_tabNum=" + _tabNum);

    //----全局变量赋值----//
    this.setData({
      chgGoodsDescTab: _tabNum,
    });

    if (_tabNum == 1) {
      //设置商品详情值到页面
      //this.setWxParseVal("");
      this.setWxParseVal(this.data.loadGoodsDescPropPackAfterSale_Data.GoodsDesc);
    }

  },
  //--------------------分享商品返佣-------------------//

  /**
   * 得到买家分享商品返佣的URL
   */
  getBuyerShareGoodsURL: function () {

    if (app.globalData.loginBuyerUserID == "" || app.globalData.loginBuyerUserID == undefined || app.globalData.loginBuyerUserID == null) {
      return;
    }
    if (this.data.goodsId <= 0 || this.data.goodsId == undefined || this.data.goodsId == null) {
      return;
    }

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "11",
      "BuyerUserID": app.globalData.loginBuyerUserID,
      "GoodsID": this.data.goodsId,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.goodsApi_GoodsDetail, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }

      //全局变量赋值
      this.setData({
        getBuyerShareGoodsURL_Data: _jsonReTxt,
      });

    });

  },


  //===================== 底部滑出的自定义窗口===========================//
  /**
   * 显示底部滑出窗口
   */
  openSlideBottom: function () {
    this.setData({
      isDisplaySlide: "normal", //是否显示窗口
    });
  },
  /**
   * 显示底部滑出窗口 - 优惠券窗口
   */
  openSlideBottomCoupons: function () {
    this.setData({
      isDisplaySlideCoupons: "normal", //是否显示窗口
    });
  },
  /**
   * 显示底部滑出窗口 - 收货地址选择窗口
   */
  openSlideBottomReceiAddr: function () {
    this.setData({
      isDisplaySlideReceiAddr: "normal", //是否显示窗口
    });
  },
  /**
   * 显示底部滑出窗口 - 分享商品窗口
   */
  openSlideShareGoodsWin: function () {
    this.setData({
      isDisplaySlideShare: "normal", //是否显示窗口
    });
  },

  /**
   * 隐藏底部滑出窗口
   */
  closeSlideBottom: function () {
    this.setData({
      isDisplaySlide: "none", //是否显示窗口
      isDisplaySlideCoupons: "none", //是否显示窗口
      isDisplaySlideReceiAddr: "none", //是否显示收货地址窗口
      isDisplaySlideShare: "none", //显示分享窗口
    });
  },

  //=====================数据分页==========================//
  // /**
  //  * 初始化搜索条件
  //  */
  // initSearchWhereArr: function () {
  //   mSearchWhereArr = this.data.shopID
  // },
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
      "GoodsID": this.data.goodsId,
      "SearchTxt": this.data.goodsAppraiseTabNum, // 0 全部，1 好评，2中评，3差评,4有图
    };

    //判断是否分页Http是否发送中
    if (mPageHttpSending == true) {
      return;
    }
    mPageHttpSending = true;

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.goodsApi_GoodsAppraise, _dataPOST, res => {

      //----分页Http完成-----//
      mPageHttpSending = false;
      mPageSum = res.PageSum;
      mIntPageCurrent = res.PageCurrent;
      mRecordSum = res.RecordSum

      if (res == "") {
        //------设置公共变量-----//
        this.setData({
          numberPage_Page: null,
          preAllGoodsAppraiseImgUrlArr: null,
        });
        return;
      }

      if (res != "") {
        //------格式化分页数据-----//
        for (var i = 0; i < res.DataPage.length; i++) {

        }
      }

      //构造图片预览数组
      var _preGoodsAppraiseImgUrlArr = new Array();
      var _indexPreImg = 0;
      //循环格式化数据
      for (var i = 0; i < res.ListGooAppraiseImg.length; i++) {
        var _item = res.ListGooAppraiseImg[i].ListGooAppraiseImgs;
        for (var j = 0; j < _item.length; j++) {
          _preGoodsAppraiseImgUrlArr[_indexPreImg] = _item[j].ImgUrl;
          _indexPreImg++;
        }
      }

      //------设置公共变量-----//
      this.setData({
        numberPage_Page: res,
        preAllGoodsAppraiseImgUrlArr: _preGoodsAppraiseImgUrlArr,
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


  //-----------------------公共函数------------------//
  /**
   * 显示图片预览组件
   * @param {*} e 
   */
  previewImg: function (e) {
    var _dataSet = e.currentTarget.dataset;

    console.log(this.data.preImgUrlArr);
    console.log(_dataSet.preIndex);

    mUtils.previewImg(this.data.preImgUrlArr, _dataSet.preIndex);
  },
  /**
   * 显示图片预览组件
   * @param {*} e 
   */
  previewImgSpecProp: function (e) {
    var _dataSet = e.currentTarget.dataset;

    console.log(this.data.specPropImgArr);
    console.log(_dataSet.preIndex);

    var _specPropImgArr = new Array();
    for (var i = 0; i < this.data.specPropImgArr.length; i++) {
      _specPropImgArr[i] = app.globalData.httpHeader + this.data.specPropImgArr[i];
    }

    mUtils.previewImg(_specPropImgArr, _dataSet.preIndex);
  },
  /**
   * 显示商品晒单图片预览组件
   * @param {*} e 
   */
  previewImgGoodsAppraise: function (e) {
    var _dataSet = e.currentTarget.dataset;
    //console.log(_dataSet.appimgId);
    var _appimgId = _dataSet.appimgId;

    var _indexPreImg = 0;
    //循环格式化数据
    for (var i = 0; i < this.data.initGoodsAppraiseSelTop_Data.ListGooAppraiseImg.length; i++) {
      var _item = this.data.initGoodsAppraiseSelTop_Data.ListGooAppraiseImg[i].ListGooAppraiseImgs;
      for (var j = 0; j < _item.length; j++) {

        if (_appimgId == _item[j].AppImgID) {

          var _preGoodsAppraiseImgUrlArr = new Array();
          for (var k = 0; k < this.data.preGoodsAppraiseImgUrlArr.length; k++) {
            _preGoodsAppraiseImgUrlArr[k] = app.globalData.httpHeader + this.data.preGoodsAppraiseImgUrlArr[k];
          }
          //显示浏览图片插件
          mUtils.previewImg(_preGoodsAppraiseImgUrlArr, _indexPreImg);
          return;

        }
        _indexPreImg++
      }
    }
  },
  /**
   * 显示所有商品晒单图片预览组件
   * @param {*} e 
   */
  previewImgAllGoodsAppraise: function (e) {
    var _dataSet = e.currentTarget.dataset;
    //console.log(_dataSet.appimgId);
    var _appimgId = _dataSet.appimgId;

    var _indexPreImg = 0;
    //循环格式化数据
    for (var i = 0; i < this.data.numberPage_Page.ListGooAppraiseImg.length; i++) {
      var _item = this.data.numberPage_Page.ListGooAppraiseImg[i].ListGooAppraiseImgs;
      for (var j = 0; j < _item.length; j++) {

        if (_appimgId == _item[j].AppImgID) {

          var _preGoodsAppraiseImgUrlArr = new Array();
          for (var k = 0; k < this.data.preAllGoodsAppraiseImgUrlArr.length; k++) {
            _preGoodsAppraiseImgUrlArr[k] = app.globalData.httpHeader + this.data.preAllGoodsAppraiseImgUrlArr[k];
          }
          //显示浏览图片插件
          mUtils.previewImg(_preGoodsAppraiseImgUrlArr, _indexPreImg);
          return;

        }
        _indexPreImg++
      }
    }
  },
  /**
   * 拨打电话
   * @param {} e 
   */
  makePhoneCall: function (e) {
    //console.log(e.target.dataset.phoneNumber)
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
   *打开预览图片窗口
   * @param {} e 
   */
  previewImgShow: function (e) {
    console.log(e);

    //得到项目的协议头名称
    //var _httpName = mUtils.getHttpProtocolURL(app.globalData.apiWebDoamin);

    var _ImgUrl = new Array(e.currentTarget.dataset.imgUrl);
    var _curIndex = "0"; //e.currentTarget.dataset.curIndex;

    mUtils.previewImg(_ImgUrl, _curIndex);

  },

  /**
   * 复制内容到剪贴板上
   * @param {*} e 
   */
  copyContentClipboard: function (e) {
    var _copyContent = e.currentTarget.dataset.copyContent;
    mUtils.copyContentClipboard(_copyContent);
  },

  //=====================在线客服接入==========================//
  /**
   * 构建【商品】咨询进入IM在线客服系统 跳转 URL
   */
  buildBuyerGoToImSysURL_GoodsWap: function () {
    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "2",
      "GoodsID": this.data.goodsId,
      "BuyerUserID": app.globalData.loginBuyerUserID,
      "VisitorMemo": this.data.loadGoodsMsg_Data.GoodsMsg.GoodsTitle + "-小程序",
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
        mUtils.makePhoneCall(this.data.loadGoodsMsg_Data.ShopMsg.ShopMobile);
      }


    });
  },

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
        mUtils.makePhoneCall(this.data.loadGoodsMsg_Data.ShopMsg.ShopMobile);
      }

    });
  },

})