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
    billNumber: "0", //支付交易号
    orderIdSingle: "0", //单个产品支付成功的订单ID
    //-----------------数据分页-------------//
    numberPage_Page: null, //分页数据对象


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //---得到navBar的高度----//
    var _navbarHeight = this.selectComponent("#NavBar").getNavBarHeight();
    this.setData({
      navbarHeight: _navbarHeight,
      octContentMarginTop: _navbarHeight,
    });

    //---------加载逻辑------//
    var _billNumber = options.BN;

    //---------设置公共变量值------//
    this.setData({
      billNumber: _billNumber,
      initBillNumberOrderMsg_Data: null, //初始化BillNumber下的所有订单信息
      payOrderCount: 1, //支付订单的总数
    });


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    //判断用户是否登录 没有登录 则跳转到指定URL 并设置UserID,LoginSha1
    mBusiLogin.isLoginUserNavigateSetUserIDPwdSha1Global(res => {
      //console.log(res)

      //------登录成功后的调用函数-------//
      //初始化BillNumber下的所有订单信息
      this.initBillNumberOrderMsg();

      //数据分页查询,猜你喜欢
      this.numberPage();


    });


  },

  /**
   * 跳转到我的
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

    //加载数据分页
    this.nextPage();


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //=====================自定义函数==========================//

  /**
   * 初始化BillNumber下的所有订单信息
   */
  initBillNumberOrderMsg: function () {

  
  },

  //=====================数据分页==========================//
  /**
   * 初始化搜索条件
   * @param {*} pPageOrderName  
   * @param {*} pIsOnlyDiscount 
   */
  initSearchWhereArr: function (pPageOrderName = "", pIsOnlyDiscount = "") {
    mSearchWhereArr = ""; //this.data.shopID + "^" + pPageOrderName + "^" + pIsOnlyDiscount
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
      "Type": "5",
      "PageCurrent": pPageCurrent,
      "IsEntity": "",
      "SearchWhereArr": mSearchWhereArr,
    };

    //判断是否分页Http是否发送中
    if (mPageHttpSending == true) {
      return;
    }
    mPageHttpSending = true;

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.mallApi_Index, _dataPOST, res => {

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




})