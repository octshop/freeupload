// pages/shop/shopsearch/shopsearch.js
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiLogin = require('../../../busicode/busilogin.js');

//------公共变量-------//

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

    searchTxt: "", //搜索内容

    loadSearchHistoryGoodsShop_Data: null, //加载买家商品店铺搜索历史
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //---得到navBar的高度----//
    var _navbarHeight = this.selectComponent("#NavBar").getNavBarHeight();
    this.setData({
      navbarHeight: _navbarHeight,
      octContentMarginTop: _navbarHeight + 60
    });

    //搜索内容
    var _seCon = "";
    if (options.SeCon != undefined && options.SeCon != "")
    {
      _seCon = options.SeCon;
    }

      //----设置公共变量-----//
      this.setData({
        shopID: options.SID,
        searchTxt: _seCon,
      });

    //--------调用方法函数-------//

    //如果用户登录啦，则设置全局的  loginBuyerUserID 和 loginPwdSha1 可根据这两个参数是否为空，判断是否用户登录
    mBusiLogin.setLoginBuyerUserIDPwdSha1Global(res => {

      //加载买家商品店铺搜索历史
      this.loadSearchHistoryGoodsShop();

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
   * 商城首页
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
   * 加载买家商品店铺搜索历史
   */
  loadSearchHistoryGoodsShop: function () {

    if (app.globalData.loginBuyerUserID == "") {
      return;
    }
    //console.log("loginBuyerUserID=" + app.globalData.loginBuyerUserID + "  | loginPwdSha1=" + app.globalData.loginPwdSha1);

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
      "BuyerUserID": app.globalData.loginBuyerUserID,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.shopApi_ShopSearch, _dataPOST, res => {
      //设置公共变量
      this.setData({
        loadSearchHistoryGoodsShop_Data: res,
      });
    });

  },
  /**
   * 单击最近搜索列 
   */
  clickItemHistory: function (e) {
    var pSeContent = e.currentTarget.dataset.seContent

    //跳转到结果页
    wx.redirectTo({
      url: '../shopsearchresult/shopsearchresult?SID=' + this.data.shopID + '&SC=' + pSeContent,
    })

  },
  /**
   * 删除商品搜索历史
   */
  delSearchHistoryGoodsShop: function () {

    mUtils.confirmWin("确定删除商品搜索历史吗？", res => {
      if (res == "Ok") {
        //构造POST参数
        var _dataPOST = {
          "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
          "Type": "2",
          "BuyerUserID": app.globalData.loginBuyerUserID,
        };

        //正式发送Http请求
        mHttp.postHttp(app.apiURLData.shopApi_ShopSearch, _dataPOST, _jsonReTxt => {

          if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null) {
            mUtils.showToastNoMaskShort(_jsonReTxt.ErrMsg);
            return;
          }

          if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null) {
            mUtils.showToastNoMaskShort(_jsonReTxt.Msg);
            //加载买家商品店铺搜索历史
            this.loadSearchHistoryGoodsShop();
            return;
          }

        });
      }
    });

  },
  /**
   * 搜索店铺商品
   */
  searchGoods: function (e) {

    console.log(e);
    var _formVal = e.detail.value; //表单值
    //console.log(_formVal);

    // console.log(_formVal.length);
    // console.log(_formVal.searchTxt);

    //搜索内容
    var mSearchContent = "";

    if (_formVal.length == undefined || _formVal.length <= 0) {
      if (_formVal.searchTxt == "" || _formVal.searchTxt == undefined) {
        //提示
        mUtils.showToast("请输入商品名称！");
        return;
      } else {
        mSearchContent = _formVal.searchTxt;
      }
    } else {
      mSearchContent = _formVal
    }
    //跳转到结果页
    wx.redirectTo({
      url: '../shopsearchresult/shopsearchresult?SID=' + this.data.shopID + '&SC=' + mSearchContent,
    })

  },

  //====================公共函数========================//


  
})