// pages/buyer/myorder/myorder.js
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
    currentTabNum: "0", //当前选项卡的次序
    //-----------------数据分页-------------//
    numberPage_Page: null, //分页数据对象
    orderGoodsList: null, //订单商品信息列表

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

    //获取传递的参数

    //判断用户是否登录 没有登录 则跳转到指定URL 并设置UserID,LoginSha1
    mBusiLogin.isLoginUserNavigateSetUserIDPwdSha1Global(res => {
      //console.log(res)

      //初始化搜索条件
      this.initSearchWhereArr("");
      //加载数据分页 - 网络请求
      this.numberPage();

    });


  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {



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
   * 搜索我的订单
   */
  home: function () {
    wx.navigateTo({
      url: '../myorderquery/myorderquery',
    })
  },
  /**
   * 单击标签跳转到 相关页 (navigate)
   * @param {*} e 
   */
  navigateURLLabel: function (e) {
    //console.log(e);
    var _gourl = e.currentTarget.dataset.gourl;
    mUtils.navigateToURL(_gourl);
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("执行啦 onPullDownRefresh");
    //重新加载数据
    this.numberPage("1", res => {

      //停止刷新
      wx.stopPullDownRefresh();

    });
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
   *  切换订单的状态
   */
  chgTab: function (e) {
    console.log(e);
    var _orderStatus = e.currentTarget.dataset.orderStatus;
    var _tabNum = e.currentTarget.dataset.tabNum;
    this.setData({
      currentTabNum: _tabNum,
    });

    //初始化搜索条件
    this.initSearchWhereArr(_orderStatus);
    //加载数据分页 - 网络请求
    this.numberPage();
  },
  /**
   * 取消订单
   */
  cancelOrder: function (e) {
    var _orderId = e.currentTarget.dataset.orderId;

    mUtils.confirmWin("确定要取消订单吗？", res => {
      if (res == "Ok") {
        //-----构造POST参数-----//
        var _dataPOST = {
          "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
          "Type": "3",
          "OrderID": _orderId,
        };
        //正式发送Http请求
        mHttp.postHttp(app.apiURLData.orderApi_OrderDetail, _dataPOST, _jsonReTxt => {
          if (_jsonReTxt == "" || _jsonReTxt == undefined) {
            return;
          }
          if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
            mUtils.showToast(_jsonReTxt.ErrMsg)
            return;
          }
          if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {

            //更改当前列表值
            this.updateNumberPage_Page(_orderId, "取消");

          }

        });
      }
    });
  },
  /**
   * 申请退款(未发货)
   */
  applyRefund: function (e) {
    var _orderId = e.currentTarget.dataset.orderId;

    mUtils.confirmWin("确定要申请退款吗？", res => {
      if (res == "Ok") {

        //-----构造POST参数-----//
        var _dataPOST = {
          "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
          "Type": "5",
          "OrderID": _orderId,
        };
        //正式发送Http请求
        mHttp.postHttp(app.apiURLData.orderApi_OrderDetail, _dataPOST, _jsonReTxt => {
          if (_jsonReTxt == "" || _jsonReTxt == undefined) {
            return;
          }

          //错误提示
          if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != "") {
            mUtils.showToast(_jsonReTxt.ErrMsg);
            return
          }

          if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != "") {
            mUtils.showToastCb(_jsonReTxt.Msg, () => {

              //更改当前列表值
              this.updateNumberPage_Page(_orderId, "退款中");

            });
          }

        });
      }
    });

  },
  /**
   * 向商家或平台发送提醒退款
   * @param {*} e 
   */
  remindRefund: function (e) {
    var _payWayName = e.currentTarget.dataset.payWayName;
    var _orderId = e.currentTarget.dataset.orderId;
    var _shopUserId = e.currentTarget.dataset.shopUserId;

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "6",
      "OrderID": _orderId,
      "ShopUserID": _shopUserId,
      "PayWayName": _payWayName,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.orderApi_OrderDetail, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }

      mUtils.showToast("提醒成功");
      return;


    });


  },
  /**
   * 延长自动确认收货时间
   */
  delayReceiOrder: function (e) {
    var _orderId = e.currentTarget.dataset.orderId;

    mUtils.confirmWin("延长自动确认收货时间？", res => {
      if (res == "Ok") {

        //-----构造POST参数-----//
        var _dataPOST = {
          "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
          "Type": "9",
          "OrderID": _orderId,
        };
        //正式发送Http请求
        mHttp.postHttp(app.apiURLData.orderApi_OrderDetail, _dataPOST, _jsonReTxt => {
          if (_jsonReTxt == "" || _jsonReTxt == undefined) {
            return;
          }

          //错误提示
          if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != "") {
            mUtils.showToast(_jsonReTxt.ErrMsg);
            return
          }

          if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != "") {
            mUtils.showToastCb(_jsonReTxt.Msg, () => {

            });
          }

        });

      }
    });

  },
  /**
   * 确认收货 
   */
  confirmReceiOrder: function (e) {
    var _orderId = e.currentTarget.dataset.orderId;

    mUtils.confirmWin("确认收货吗？", res => {
      if (res == "Ok") {

        //-----构造POST参数-----//
        var _dataPOST = {
          "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
          "Type": "8",
          "OrderID": _orderId,
        };
        //正式发送Http请求
        mHttp.postHttp(app.apiURLData.orderApi_OrderDetail, _dataPOST, _jsonReTxt => {
          if (_jsonReTxt == "" || _jsonReTxt == undefined) {
            return;
          }

          //错误提示
          if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != "") {
            mUtils.showToast(_jsonReTxt.ErrMsg);
            return
          }

          if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != "") {
            mUtils.showToastCb(_jsonReTxt.Msg, () => {

              //更改当前列表值
              this.updateNumberPage_Page(_orderId, "待评价");

            });
          }

        });
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
      "OrderStatus": mSearchWhereArr,
      "ExpressType": "shop",
    };

    //判断是否分页Http是否发送中
    if (mPageHttpSending == true) {
      return;
    }
    mPageHttpSending = true;

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.buyerApi_MyOrder, _dataPOST, res => {
      //回调函数
      pCallBack(true);

      mPageHttpSending = false;

      if (res == "") {
        this.setData({
          numberPage_Page: null,
        });
        return;
      }

      // {
      //   "OrderGoodsList": [{
      //     "GoodsMsgArr": [{
      //       "GoodsTitle": "国金筑梦智能影院房aa",
      //       "OrderNum": "12",
      //       "GoodsUnitPrice": "255.00",
      //       "IsSpecParamArr": "true",
      //       "SpecPropName": "2天,豪华型",
      //       "GoodsCoverImgPath": "localhost:1400/Upload/GooGoodsImg/GoGI_20040_202012131517297700.png"
      //     }, {
      //       "GoodsTitle": "国金筑梦智能影院房aa",
      //       "OrderNum": "12",
      //       "GoodsUnitPrice": "255.00",
      //       "IsSpecParamArr": "true",
      //       "SpecPropName": "2天,豪华型",
      //       "GoodsCoverImgPath": "localhost:1400/Upload/GooGoodsImg/GoGI_20040_202012131517297700.png"
      //     }],
      //   }]
      // }

      //构造商品信息列表Json字符串
      var _orderGoodsList = "{\"OrderGoodsList\": [";

      //------格式化分页数据-----//
      for (var k = 0; k < res.DataPage.length; k++) {

        //分割商品信息
        var GoodsIDArr = mUtils.splitStringJoinChar(res.DataPage[k].GoodsIDArr);
        var GoodsTitleArr = mUtils.splitStringJoinChar(res.DataPage[k].GoodsTitleArr);
        var GoodsSpecIDOrderNumArr = mUtils.splitStringJoinChar(res.DataPage[k].GoodsSpecIDOrderNumArr);
        var GoodsUnitPriceArr = mUtils.splitStringJoinChar(res.DataPage[k].GoodsUnitPriceArr);
        var IsSpecParamArr = mUtils.splitStringJoinChar(res.DataPage[k].IsSpecParamArr);
        var SpecNameArr = mUtils.splitStringJoinChar(res.DataPageExtra[k].SpecNameArr);
        var GoodsCoverImgPathArr = mUtils.splitStringJoinChar(res.DataPageExtra[k].GoodsCoverImgPathArr);

        _orderGoodsList += "{";
        _orderGoodsList += "\"GoodsCount\":\"" + GoodsIDArr.length + "\",";
        _orderGoodsList += "		\"GoodsMsgArr\": [";


        for (var i = 0; i < GoodsIDArr.length; i++) {
          var _orderNum = GoodsSpecIDOrderNumArr[i].split("_")[1];

          var _SpecNameArr = SpecNameArr[i];
          if (_SpecNameArr == undefined) {
            _SpecNameArr = "";
          }

          _orderGoodsList += "{";
          _orderGoodsList += "			\"GoodsID\": \"" + GoodsIDArr[i] + "\",";
          _orderGoodsList += "			\"GoodsTitle\": \"" + GoodsTitleArr[i] + "\",";
          _orderGoodsList += "			\"OrderNum\": \"" + _orderNum + "\",";
          _orderGoodsList += "			\"GoodsUnitPrice\": \"" + GoodsUnitPriceArr[i] + "\",";
          _orderGoodsList += "			\"IsSpecParamArr\": \"" + IsSpecParamArr[i] + "\",";
          _orderGoodsList += "			\"SpecPropName\": \"" + _SpecNameArr + "\",";
          _orderGoodsList += "			\"GoodsCoverImgPath\": \"" + GoodsCoverImgPathArr[i] + "\"";
          _orderGoodsList += "},";
        }
        _orderGoodsList = mUtils.removeFrontAndBackChar(_orderGoodsList, ",");

        _orderGoodsList += "]";
        _orderGoodsList += "},";
      }
      _orderGoodsList = mUtils.removeFrontAndBackChar(_orderGoodsList, ",");
      _orderGoodsList += "]}";
      //转换成Json对象
      _orderGoodsList = JSON.parse(_orderGoodsList);

      //----分页Http完成-----//
      var _numberPage_Page = this.data.numberPage_Page;
      mPageSum = parseInt(res.PageSum);
      mIntPageCurrent = parseInt(res.PageCurrent);
      mRecordSum = parseInt(res.RecordSum);

      //----额外的拼接json字符串----//
      var _orderGoodsList_Page = this.data.orderGoodsList;


      //将数据分页数据添加到公共变量中
      if (this.data.numberPage_Page == null) {
        _numberPage_Page = res;

        //----额外的拼接json字符串----//
        _orderGoodsList_Page = _orderGoodsList;

      } else {
        //添加数据分页中
        _numberPage_Page.PageCurrent = (parseInt(_numberPage_Page.PageCurrent) + 1).toString();
        //添加数组
        _numberPage_Page.DataPage = _numberPage_Page.DataPage.concat(res.DataPage);
        _numberPage_Page.DataPageExtra = _numberPage_Page.DataPageExtra.concat(res.DataPageExtra);

        //----额外的拼接json字符串-----//
        _orderGoodsList_Page.OrderGoodsList = _orderGoodsList_Page.OrderGoodsList.concat(_orderGoodsList.OrderGoodsList);
      }



      //console.log(_numberPage_Page);

      //------设置公共变量-----//
      this.setData({
        numberPage_Page: _numberPage_Page,
        orderGoodsList: _orderGoodsList_Page,
      });

      console.log(this.data.orderGoodsList);

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
  /**
   * 更新数据分页对象
   */
  updateNumberPage_Page(pOrderId, pOrderStatus) {

    var _numberPage_Page = this.data.numberPage_Page;
    //循环更新
    for (var i = 0; i < _numberPage_Page.DataPage.length; i++) {
      if (_numberPage_Page.DataPage[i].OrderID == pOrderId) {

        _numberPage_Page.DataPage[i].OrderStatus = pOrderStatus;

        // //是否删除
        // if (pIsDel == true) {
        //   //console.log(_numberPage_Page.DataPage);
        //   //删除数组
        //   _numberPage_Page.DataPage.splice(i, 1);
        // }
      }
    }
    //设置公共变量
    this.setData({
      numberPage_Page: _numberPage_Page,
    });

  },

  //===================== 公共函数===========================//
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