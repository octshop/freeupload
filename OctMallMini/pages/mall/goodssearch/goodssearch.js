// pages/mall/goodssearch/goodssearch.js
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiLogin = require('../../../busicode/busilogin.js');

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
    searchType: "", //搜索类别，是否为实体店
    searchTxt: "", //搜索的内容
    isEntity: false, //是否为实体店
    loadSearchHistoryGoods_Data: null, //加载买家商品店铺搜索历史
    loadTopSearchFindMsg_Data: null, //加载搜索发现内容

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

    //获取传递的参数
    var _searchType = options.ST; //Entity
    if (_searchType == undefined) {
      _searchType = "";
    }
    var _isEntity = false;
    if (_searchType == "Entity") {
      _isEntity = true;
    }
    this.setData({
      searchType: _searchType,
      isEntity: _isEntity,
    });

    // 如果用户登录啦，则设置全局的  loginBuyerUserID 和 loginPwdSha1 可根据这两个参数是否为空，判断是否用户登录
    mBusiLogin.setLoginBuyerUserIDPwdSha1Global(res => {
      //用户已登录的状态
      if (res != "") {
        // 加载买家商品店铺搜索历史
        this.loadSearchHistoryGoods();
      }
    });

    //--------调用方法--------//
    //加载搜索发现内容
    this.loadTopSearchFindMsg();

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //=====================自定义函数==========================//

  /**
   * 加载买家商品店铺搜索历史
   */
  loadSearchHistoryGoods: function () {

    if (app.globalData.loginBuyerUserID == "" || app.globalData.loginBuyerUserID == undefined) {
      return;
    }

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
      "BuyerUserID": app.globalData.loginBuyerUserID,
      "IsEntity": this.data.isEntity,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.searchApi_SearchGoods, _dataPOST, _jsonReTxt => {
      // if (_jsonReTxt == "" || _jsonReTxt == undefined) {
      //   return;
      // }

      //设置公共变量值
      this.setData({
        loadSearchHistoryGoods_Data: _jsonReTxt,
      });

    });


  },

  /**
   * 删除商品搜索历史
   */
  delSearchHistoryGoods: function () {

    if (app.globalData.loginBuyerUserID == "" || app.globalData.loginBuyerUserID == undefined) {
      return;
    }

    mUtils.confirmWin("确定要删除吗？", res => {
      if (res == "Ok") {
        //-----构造POST参数-----//
        var _dataPOST = {
          "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
          "Type": "2",
          "BuyerUserID": app.globalData.loginBuyerUserID,
        };
        //正式发送Http请求
        mHttp.postHttp(app.apiURLData.searchApi_SearchGoods, _dataPOST, _jsonReTxt => {
          if (_jsonReTxt == "" || _jsonReTxt == undefined) {
            return;
          }

          if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null) {
            mUtils.showToast(_jsonReTxt.ErrMsg);
            return;
          }

          if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != null) {
            mUtils.showToastCb(_jsonReTxt.Msg, () => {
              //加载买家商品店铺搜索历史
              this.loadSearchHistoryGoods();
            });
            return;
          }
        });
      }
    });
  },

  /**
   * 加载搜索发现内容
   */
  loadTopSearchFindMsg: function () {

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "3",
      "FindType": "Goods",
      "IsEntity": this.data.isEntity,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.searchApi_SearchGoods, _dataPOST, _jsonReTxt => {
      // if (_jsonReTxt == "" || _jsonReTxt == undefined) {
      //   return;
      // }

      //设置公共变量值
      this.setData({
        loadTopSearchFindMsg_Data: _jsonReTxt,
      });

    });


  },


  /**
   * 监听搜索内容的输入
   * @param {*} e 
   */
  bindInputSearchTxt: function (e) {
    var _detailVal = e.detail.value;
    if (_detailVal == undefined) {
      _detailVal = "";
    }
    this.setData({
      searchTxt: _detailVal,
    });
  },

  /**
   * 直接跳转搜索内容 
   */
  clickSearchGoods: function (e) {
    //搜索关键字
    var _searchTxt = "";
    if (e.currentTarget.dataset.searchTxt == undefined) {
      console.log("this.data.searchTxt=" + this.data.searchTxt);
      if (this.data.searchTxt == "") {
        mUtils.showToast("请输入搜索商品名称！");
        return;
      } else {
        _searchTxt = this.data.searchTxt;
      }
    } else {
      _searchTxt = e.currentTarget.dataset.searchTxt;
    }

    if (this.data.searchType == "Entity") {
      //跳转到商品搜索结果页
      mUtils.navigateToURL("../../../pages/mall/goodssearchresulto2o/goodssearchresulto2o?SC=" + _searchTxt);
    } else {
      //跳转到商品搜索结果页
      mUtils.navigateToURL("../../../pages/mall/goodssearchresult/goodssearchresult?SC=" + _searchTxt);
    }


    return;
  }



})