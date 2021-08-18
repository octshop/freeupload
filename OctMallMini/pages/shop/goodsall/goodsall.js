// pages/shop/goodsall/goodsall.js
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiLogin = require('../../../busicode/busilogin.js');
var mBusiCode = require('../../../busicode/busicode.js');
var mBusiCookie = require('../../../busicode/busicookie.js');

//----------数据分页----------//
var mSearchWhereArr = ""; //搜索条件拼接字符串 "^"
var mIntPageCurrent = 1; //当前的分页索引
var mPageSum = 1; //总页数
var mRecordSum = 0; //总记录
var mPageHttpSending = false; //数据分页Http发送中


//-----初始化APP对象-----//
var app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    apiWebDoamin: app.globalData.apiWebDoamin, //小程序Api的网站域名
    navbarHeight: 0, //navBar的高度
    octContentMarginTop: 0, //主体内容距子导航的距离

    shopID: 0, //店铺ID
    shopUserID: 0, //商家UserID
    showData: null,
    appraiseStarGray: 0,
    appraiseStarRed: 0,
    initShopMsgTopBarItem_Data: null, //初始化 店铺信息条，店铺首页顶部条信息
    appraiseStarGray: 0,
    appraiseStarRed: 0,
    numberPage_Page: null, //加载数据分页
    curTabClassArr: null, //当前选项卡当前样式数组
    curGoodsPriceOrder: "Desc", //当前商品价格排序方式 Asc,Desc

    tabNumDefault: "0", //当前默认选项卡次序
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //---得到navBar的高度----//
    var _navbarHeight = this.selectComponent("#NavBar").getNavBarHeight();
    this.setData({
      navbarHeight: _navbarHeight,
      octContentMarginTop: _navbarHeight + 125
    });

    //设置推荐为默认
    var _curTabClassArr = new Array();
    _curTabClassArr[0] = "nav-item-current";

    //设置公共变量
    this.setData({
      shopID: options.SID,
      curTabClassArr: _curTabClassArr,
      tabNumDefault: options.TBN,
    });

    if (options.TBN == undefined) {
      this.setData({
        tabNumDefault: "0",
      });
    }


    //--------调用方法函数-------//

    //初始化 店铺信息条，店铺首页顶部条信息
    this.initShopMsgTopBarItem();

    //默认切换选项卡
    this.chgTabDefault();

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
    this.nextPage();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //====================自定义函数========================//
  /**
   * 快捷加入购物车，不需要带规格属性ID
   * @param {*} e 
   */
  addToSCartNoSpecPropID: function (e) {
    console.log(e.currentTarget.dataset);
    var pGoodsID = e.currentTarget.dataset.goodsId;

    //正式加入购物车
    mBusiCode.addToSCartNoSpecPropID(pGoodsID, "../../../pages/shop/goodsall/goodsall^SID~" + this.data.shopID)

  },
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
  /**
   * 默认切换选项卡
   */
  chgTabDefault: function () {

    console.log("this.data.tabNumDefault=" + this.data.tabNumDefault);

    var _curTabClassArr = new Array();
    _curTabClassArr[this.data.tabNumDefault] = "nav-item-current";

    if (this.data.tabNumDefault == 0) //推荐
    {
      //初始化搜索条件
      this.initSearchWhereArr("Commend", "false");

    } else if (this.data.tabNumDefault == 1) //销量
    {
      //初始化搜索条件
      this.initSearchWhereArr("SaleCount", "false");
    } else if (this.data.tabNumDefault == 2) //价格
    {
      if (this.data.curGoodsPriceOrder == "Desc") {
        //初始化搜索条件
        this.initSearchWhereArr("GoodsPriceAsc", "false");

        this.setData({
          curGoodsPriceOrder: "Asc",
        });

      } else {
        //初始化搜索条件
        this.initSearchWhereArr("GoodsPriceDesc", "false");
        this.setData({
          curGoodsPriceOrder: "Desc",
        });
      }

    } else if (this.data.tabNumDefault == 3) //新品
    {
      //初始化搜索条件
      this.initSearchWhereArr("WriteDate", "false");
    } else if (this.data.tabNumDefault == 4) //打折 
    {
      //初始化搜索条件
      this.initSearchWhereArr("Discount", "true");
    } else if (this.data.tabNumDefault == 5) //团购
    {
      //初始化搜索条件
      this.initSearchWhereArr("GroupMsgCount", "false");
    } else if (this.data.tabNumDefault == 6) //秒杀
    {
      //初始化搜索条件
      this.initSearchWhereArr("SecKill", "false");
    }

    //初始化数据分页
    this.numberPage("1");

    //-----设置公共变量值----//
    this.setData({
      curTabClassArr: _curTabClassArr,
    });


  },
  /**
   * 切换选项卡
   */
  chgTab: function (e) {
    var _dataSet = e.currentTarget.dataset;

    var _curTabClassArr = new Array();
    _curTabClassArr[_dataSet.tabNum] = "nav-item-current";
    if (_dataSet.tabNum == 0) //推荐
    {
      //初始化搜索条件
      this.initSearchWhereArr("Commend", "false");

    } else if (_dataSet.tabNum == 1) //销量
    {
      //初始化搜索条件
      this.initSearchWhereArr("SaleCount", "false");
    } else if (_dataSet.tabNum == 2) //价格
    {
      if (this.data.curGoodsPriceOrder == "Desc") {
        //初始化搜索条件
        this.initSearchWhereArr("GoodsPriceAsc", "false");

        this.setData({
          curGoodsPriceOrder: "Asc",
        });

      } else {
        //初始化搜索条件
        this.initSearchWhereArr("GoodsPriceDesc", "false");
        this.setData({
          curGoodsPriceOrder: "Desc",
        });
      }

    } else if (_dataSet.tabNum == 3) //新品
    {
      //初始化搜索条件
      this.initSearchWhereArr("WriteDate", "false");
    } else if (_dataSet.tabNum == 4) //打折 
    {
      //初始化搜索条件
      this.initSearchWhereArr("Discount", "true");
    } else if (_dataSet.tabNum == 5) //团购
    {
      //初始化搜索条件
      this.initSearchWhereArr("GroupMsgCount", "false");
    } else if (_dataSet.tabNum == 6) //秒杀
    {
      //初始化搜索条件
      this.initSearchWhereArr("SecKill", "false");
    }

    //初始化数据分页
    this.numberPage("1");

    //-----设置公共变量值----//
    this.setData({
      curTabClassArr: _curTabClassArr,
    });

  },
  //=====================数据分页==========================//
  /**
   * 初始化搜索条件
   * @param {*} pPageOrderName  Commend 推荐 SaleCount 销量 GoodsPriceAsc 价格升序 GoodsPriceDesc 价格降序 WriteDate 新品 Discount 打折  GroupMsgCount 团购  SecKill  秒杀
   * @param {*} pIsOnlyDiscount 是否只加载打折的商品 ( true / false )
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
    mHttp.postHttp(app.apiURLData.shopApi_GoodsAll, _dataPOST, res => {

      mPageHttpSending = false;

      if (res == "") {
        this.setData({
          numberPage_Page: null,
        });
        return;
      }

      //------格式化分页数据-----//
      for (var i = 0; i < res.DataPage.length; i++) {
        if (res.DataPage[i].GoodsTitle.length > 20) {
          res.DataPage[i].GoodsTitle = res.DataPage[i].GoodsTitle.substring(0, 20);
        }

        //计算折扣
        var item =  res.DataPage[i];
        if (item.Discount > 0 && item.GroupDiscount <= 0) {
          res.DataPage[i].GoodsPrice = item.GoodsPrice * (item.Discount / 10);
        }
        else if (item.GroupDiscount > 0)
        {
          res.DataPage[i].GoodsPrice = item.GoodsPrice * (item.GroupDiscount / 10);
        }
        else if (item.SkDiscount > 0 && item.GroupDiscount <= 0)
        {
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
  //====================公共函数========================//


    //=====================在线客服接入==========================//

  /**
   * 构建【商家店铺】咨询进入IM在线客服系统 跳转 URL
   */
  buildBuyerGoToImSysURL_ShopWap: function () {

    mUtils.logOut("【商家店铺】咨询进入");

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "1",
      "ShopUserID": this.data.initShopMsgTopBarItem_Data.ShopUserID,
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
        mUtils.makePhoneCall(this.data.initShopMsgTopBarItem_Data.ShopMobile);
      }

    });
  },




})