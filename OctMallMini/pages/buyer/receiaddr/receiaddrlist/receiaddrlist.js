// pages/buyer/receiaddr/receiaddrlist/receiaddrlist.js
//==============引入相关的Js文件========//
var mHttp = require('../../../../utils/http.js');
var mUtils = require('../../../../utils/util.js');
var mBusiLogin = require('../../../../busicode/busilogin.js');
var mBusiCookie = require('../../../../busicode/busicookie.js');

//----------数据分页----------//
var mSearchWhereArr = ""; //搜索条件拼接字符串 "^"
var mIntPageCurrent = 1; //当前的分页索引
var mPageSum = 1; //总页数
var mRecordSum = 0; //总记录
var mPageHttpSending = false; //数据分页Http发送中

//--------页面公共变量-------//
var mbackurl = ""; //返回的页面URL

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
    redirectType: "", //跳转到此页的类型 sel 为选择地址
    addReceiBackUrl: "", //如果单击添加新地址，而此页带有BackURL那么添加页也要带BackUrl
    isShowClickSelHint: false, //是否显示单击选择提示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //---得到navBar的高度----//
    var _navbarHeight = this.selectComponent("#NavBar").getNavBarHeight();
    this.setData({
      navbarHeight: _navbarHeight,
      octContentMarginTop: _navbarHeight + 8,
    });

    //------设置公共变量------//
    this.setData({
      redirectType: options.type,
    });

    mbackurl = options.backurl;
    if (mbackurl != "" && mbackurl != undefined) {
      //console.log("mbackurl=" + mbackurl);
      //mbackurl=pages/goods/goodsdetail/goodsdetail^GID~60069
      //type=add&backurl=pages/goods/goodsdetail/goodsdetail^GID~60069
      var _backUrl = "?type=add&backurl=" + mbackurl;

      this.setData({
        addReceiBackUrl: _backUrl,
        isShowClickSelHint: true,
      });

    } else {
      this.setData({
        isShowClickSelHint: false,
      });
    }

  },
  /**
   * 显示页面时每次都执行
   */
  onShow: function () {

    //判断用户是否登录 没有登录 则跳转到指定URL 并设置UserID,LoginSha1
    mBusiLogin.isLoginUserNavigateSetUserIDPwdSha1Global(res => {
      //console.log(res)
      //------登录成功后的调用函数-------//
      //加载数据分页
      this.numberPage();

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
      url: '../../../tabbar/buyerindex/buyerindex',
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
   * 设为默认地址
   * @param {*} e 
   */
  setDefaultReceiAddr: function (e) {
    var _receiAddrId = e.currentTarget.dataset.receiAddrid;

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "2",
      "BReceiAddrID": _receiAddrId,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.buyerApi_ReceiAddrList, _dataPOST, _jsonReTxt => {

      //错误提示
      if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != "") {
        mUtils.showToast(_jsonReTxt.ErrMsg);
        return;
      }
      //成功提示
      if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != "") {
        mUtils.showToast(_jsonReTxt.Msg);

        //更新数据分页对象
        this.updateNumberPage_Page(_receiAddrId, "default");

        return;
      }

    });

  },
  /**
   * 删除收货地址
   * @param {*} e 
   */
  delReceiAddr: function (e) {

    var _receiAddrId = e.currentTarget.dataset.receiAddrid;

    mUtils.confirmWin("确认要删除吗？", res => {

      //-----构造POST参数-----//
      var _dataPOST = {
        "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
        "Type": "3",
        "BReceiAddrID": _receiAddrId,
      };

      //正式发送Http请求
      mHttp.postHttp(app.apiURLData.buyerApi_ReceiAddrList, _dataPOST, _jsonReTxt => {

        //错误提示
        if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != "") {
          mUtils.showToast(_jsonReTxt.ErrMsg);
          return;
        }
        //成功提示
        if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined && _jsonReTxt.Msg != "") {
          mUtils.showToast(_jsonReTxt.Msg);

          //更新数据分页对象
          this.updateNumberPage_Page(_receiAddrId, "", true);

          return;
        }

      });

    });

  },
  /**
   * 选择收货地址后的逻辑
   */
  selReceiAddr: function (e) {
    //console.log(e);
    var _receiAddrId = e.currentTarget.dataset.receiAddrId;
    var _regionCodeArr = e.currentTarget.dataset.regionCodeArr;
    var _regionNameArr = e.currentTarget.dataset.regionNameArr;

    //console.log(this.data.redirectType);
    if (this.data.redirectType == "sel") {

      //设置当前选择收货地址
      mBusiCookie.saveBuyerSelReceiAddrRegionCookie(_receiAddrId, _regionCodeArr, _regionNameArr);

      //格式化，回跳的URL字符串，把 ^ 换成 ?  把 ~ 换成 = 把 & 换成 |
      mbackurl = mUtils.formatBackURLParamChar(mbackurl);
      console.log("mbackurl=" + mbackurl);

      if (mbackurl.indexOf('orderdetail') >= 0 || mbackurl.indexOf('orderpay') >= 0 || mbackurl.indexOf('afterapply') >= 0 || mbackurl.indexOf('presentorderdetail') >= 0) {
        if (mbackurl.indexOf('afterapply') >= 0) {
          //执行不能返回的跳转 ， 跳转回订单详情，修改收货地址
          mUtils.redirectToURL("../../../../" + mbackurl + "?BID=" + _receiAddrId);
        } else {

          console.log("执行啦。。。" + mbackurl);

          //执行不能返回的跳转 ， 跳转回订单详情，修改收货地址
          mUtils.redirectToURL("../../../../" + mbackurl + "&BID=" + _receiAddrId);

        }
      } else {
        //执行不能返回的跳转
        mUtils.redirectToURL("../../../../" + mbackurl);
      }


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
    mHttp.postHttp(app.apiURLData.buyerApi_ReceiAddrList, _dataPOST, res => {

      mPageHttpSending = false;

      if (res == "") {
        this.setData({
          numberPage_Page: null,
        });
        return;
      }

      //------格式化分页数据-----//
      for (var i = 0; i < res.DataPage.length; i++) {

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
  /**
   * 更新数据分页对象
   * @param {*} pBReceiAddrID 
   * @param {*} pAddrTypeNew 
   * @param {*} pIsDel 
   */
  updateNumberPage_Page(pBReceiAddrID, pAddrTypeNew = "", pIsDel = false) {

    var _numberPage_Page = this.data.numberPage_Page;
    //循环更新
    for (var i = 0; i < _numberPage_Page.DataPage.length; i++) {
      if (_numberPage_Page.DataPage[i].BReceiAddrID == pBReceiAddrID) {
        if (pAddrTypeNew != "") {
          _numberPage_Page.DataPage[i].AddrType = pAddrTypeNew;
        }
        //是否删除
        if (pIsDel == true) {
          //console.log(_numberPage_Page.DataPage);
          //删除数组
          _numberPage_Page.DataPage.splice(i, 1);
        }
      } else {
        if (pAddrTypeNew != "") {
          _numberPage_Page.DataPage[i].AddrType = "general";
        }
      }
    }
    //设置公共变量
    this.setData({
      numberPage_Page: _numberPage_Page,
    });

  },
  //=====================公共函数==========================//
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