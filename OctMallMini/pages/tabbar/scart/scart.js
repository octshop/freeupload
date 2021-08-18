// pages/buyer/scart/scart.js
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
    //----------底部滑出的自定义窗口---------------//
    isDisplaySlide: "none", //是否显示窗口 normal ,none
    slideBottomWinHeight: 400, //窗口高度
    //----------自定义变量---------------//
    initSCartMsg_Data: null, //初始化购物车
    jsonScartSelList: null, //选择商品与未选择的操作对象
    sumOrderPrice: 0, //订单总额
    isAllSel: "true", //是否全选
    //-------------优惠券相关----------//
    goodsAbleUseCouponsListJson: null, //得到商品可以使用的优惠券列表Json对象
    isDisplaySlideCoupons: "none", //是否显示优惠券窗口
    slideWinHeightCoupons: 430, //优惠券窗口高度
    couponsStyleValObj: null, //优惠券窗口相关样式显示值对象

  },

  /**
   * 返回首页
   */
  back: function () {
    wx.switchTab({
      url: '../../../pages/tabbar/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //---得到navBar的高度----//
    var _navbarHeight = this.selectComponent("#NavBar").getNavBarHeight();
    this.setData({
      navbarHeight: _navbarHeight,
    });

  },
  /**
   * 页面相关事件处理函数--监听页面显示
   */
  onShow: function () {
    //设置底部Tabbar内容
    this.setTabBarContent();

    //----判断用户是否登录 没有登录 则跳转到指定URL 并设置UserID,LoginSha1-----//
    mBusiLogin.isLoginUserNavigateSetUserIDPwdSha1Global(res => {
      //------登录成功后的调用函数-------//

      //初始化购物车
      this.initSCartMsg();

    });


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
  //=========================自定义函数=========================//
  /**
   * 初始化购物车
   */
  initSCartMsg: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.sCartApi_Index, _dataPOST, _jsonReTxt => {
      console.log(_jsonReTxt);
      if (_jsonReTxt == "") {
        return;
      }

      //--------格式化数据-----//

      // [{
      //   "ShopID": "50039",
      //   "IsSel": "true",
      //   "ShopGoodsSel": [{
      //   "CartID": "50039",
      //     "GoodsID": "60069",
      //     "IsSel": "true",
      //     "OrderNum": "5"
      //   }]
      // }]

      //初始化选择对象对象
      var _jsonScartSelList = "[";
      for (var i = 0; i < _jsonReTxt.GoodsMsgArr.length; i++) {

        _jsonScartSelList += "{";
        _jsonScartSelList += "\"ShopID\":\"" + _jsonReTxt.ShopMsgArr[i].ShopID + "\",";
        _jsonScartSelList += "\"IsSel\": \"true\",";
        _jsonScartSelList += "\"ShopGoodsSel\":[";


        for (var j = 0; j < _jsonReTxt.GoodsMsgArr[i].ShopGoodsMsgArr.length; j++) {

          var _shopGoodsMsg = _jsonReTxt.GoodsMsgArr[i].ShopGoodsMsgArr[j];
          if (_shopGoodsMsg.GoodsTitle.length > 28) {
            _jsonReTxt.GoodsMsgArr[i].ShopGoodsMsgArr[j].GoodsTitle = _shopGoodsMsg.GoodsTitle.substring(0, 25) + "…";
          }
          //计算折扣后的价格
          if (parseFloat(_jsonReTxt.GoodsMsgArr[i].ShopGoodsMsgArr[j].Discount) > 0) {
            _jsonReTxt.GoodsMsgArr[i].ShopGoodsMsgArr[j].GoodsPrice = parseFloat(_shopGoodsMsg.GoodsPrice) * (parseFloat(_shopGoodsMsg.Discount) / 10);
            _jsonReTxt.GoodsMsgArr[i].ShopGoodsMsgArr[j].GoodsPrice = mUtils.formatNumberDotDigit(_jsonReTxt.GoodsMsgArr[i].ShopGoodsMsgArr[j].GoodsPrice, 2);
          }

          _jsonScartSelList += "{"
          _jsonScartSelList += "\"CartID\":\"" + _shopGoodsMsg.CartID + "\","
          _jsonScartSelList += "\"GoodsID\":\"" + _shopGoodsMsg.GoodsID + "\","
          _jsonScartSelList += "\"SpecID\":\"" + _shopGoodsMsg.SpecID + "\","
          _jsonScartSelList += "\"IsSel\": \"true\",";
          _jsonScartSelList += "\"OrderNum\": \"" + _shopGoodsMsg.OrderNum + "\"";
          _jsonScartSelList += "},"
        }
        //去掉前后的“,”
        _jsonScartSelList = mUtils.removeFrontAndBackChar(_jsonScartSelList, ",");

        _jsonScartSelList += "]";
        _jsonScartSelList += "},";
      }
      //去掉前后的“,”
      _jsonScartSelList = mUtils.removeFrontAndBackChar(_jsonScartSelList, ",");
      _jsonScartSelList += "]"

      console.log(_jsonScartSelList);

      //--------设置公共变量-------//
      this.setData({
        initSCartMsg_Data: _jsonReTxt,
        jsonScartSelList: JSON.parse(_jsonScartSelList),
      });

      //统计订单总额
      this.sumOrderPrice();

    });

  },

  /**
   * 去结算按钮
   */
  goSettle: function () {

    if (parseFloat(this.data.sumOrderPrice) <= 0) {
      mUtils.showToast("请选择结算商品");
      return;
    }
    //得到购物车信息ID 与之对应的  订购数量 拼接字符串  [ SCartID _ OrderNum ^ SCartID _ OrderNum | SCartID _ OrderNum ^ SCartID _ OrderNum]
    this.getScartIDOrderNumArr();

    //跳转到结算页
    mUtils.navigateToURL("../../../pages/buyer/placeordermul/placeordermul");

  },
  /**
   * 得到购物车信息ID 与之对应的  订购数量 拼接字符串  [ SCartID _ OrderNum ^ SCartID _ OrderNum | SCartID _ OrderNum ^ SCartID _ OrderNum]
   */
  getScartIDOrderNumArr: function () {

    //操作Json对象
    var _jsonScartSelList = this.data.jsonScartSelList;

    //构造拼接字符串
    var _scartIDOrderNumArr = "";

    //-----循环得到拼接字符串-----//
    for (var i = 0; i < _jsonScartSelList.length; i++) {

      //判断此店铺是否选择了商品
      var _isSelGoods = false;
      for (var j = 0; j < _jsonScartSelList[i].ShopGoodsSel.length; j++) {
        var _ShopGoodsSel = _jsonScartSelList[i].ShopGoodsSel[j];
        if (_ShopGoodsSel.IsSel == "true") {
          _scartIDOrderNumArr += _ShopGoodsSel.CartID + "_" + _ShopGoodsSel.OrderNum + "^";

          _isSelGoods = true;
        }
      }
      //去掉前后的"^"
      _scartIDOrderNumArr = mUtils.removeFrontAndBackChar(_scartIDOrderNumArr, "^");
      if (_isSelGoods == true)
      {
        _scartIDOrderNumArr += "|";
      }
    }
    //去掉前后的"|"
    _scartIDOrderNumArr = mUtils.removeFrontAndBackChar(_scartIDOrderNumArr, "|");
    console.log("_scartIDOrderNumArr=" + _scartIDOrderNumArr);

    //设置去结算的Cookie  得到购物车信息ID 与之对应的  订购数量 拼接字符串  [ SCartID _ OrderNum ^ SCartID _ OrderNum | SCartID _ OrderNum ^ SCartID _ OrderNum]
    mBusiCookie.setScartIDOrderNumArrCookie(_scartIDOrderNumArr);

  },

  /**
   * 设置底部Tabbar内容
   */
  setTabBarContent: function () {
    //记录当前进入的TabBar索引，以便加载中间Tabbar的内容
    app.globalData.tabbarMidIndex = 3;
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
   * 选择全店铺商品
   */
  selShopGoodsItem: function (e) {
    console.log(e);
    var _shopID = e.currentTarget.dataset.shopId;
    var _isSel = e.currentTarget.dataset.isSel;

    //操作Json对象
    var _jsonScartSelList = this.data.jsonScartSelList;

    //循环赋值
    for (var i = 0; i < _jsonScartSelList.length; i++) {

      if (_shopID == _jsonScartSelList[i].ShopID) {
        _jsonScartSelList[i].IsSel = _isSel;
      }

      for (var j = 0; j < _jsonScartSelList[i].ShopGoodsSel.length; j++) {
        if (_jsonScartSelList[i].IsSel == "true") {
          _jsonScartSelList[i].ShopGoodsSel[j].IsSel = "true";
        } else {
          _jsonScartSelList[i].ShopGoodsSel[j].IsSel = "false";
        }
      }
    }

    //设置全局变量
    this.setData({
      jsonScartSelList: _jsonScartSelList,
    });

    //统计订单总额
    this.sumOrderPrice();

  },
  /**
   * 选择单个商品
   * @param {*} e 
   */
  selGoodsItem: function (e) {
    console.log(e);
    var _goodsId = e.currentTarget.dataset.goodsId;
    var _specId = e.currentTarget.dataset.specId;
    var _isSel = e.currentTarget.dataset.isSel;

    //操作Json对象
    var _jsonScartSelList = this.data.jsonScartSelList;

    //循环赋值
    for (var i = 0; i < _jsonScartSelList.length; i++) {
      for (var j = 0; j < _jsonScartSelList[i].ShopGoodsSel.length; j++) {
        if (_jsonScartSelList[i].ShopGoodsSel[j].GoodsID == _goodsId && _jsonScartSelList[i].ShopGoodsSel[j].SpecID == _specId) {
          _jsonScartSelList[i].ShopGoodsSel[j].IsSel = _isSel;
        }
      }
    }
    //console.log(_jsonScartSelList);
    //设置全局变量
    this.setData({
      jsonScartSelList: _jsonScartSelList,
    });
    //console.log(this.data.jsonScartSelList[0].ShopGoodsSel[0].IsSel);

    //统计订单总额
    this.sumOrderPrice();
  },
  /**
   * 统计订单总额
   */
  sumOrderPrice: function () {

    //订单总额
    var _sumOrderPrice = 0;

    //操作Json对象
    var _jsonScartSelList = this.data.jsonScartSelList;

    //-----循环赋值订单数量-----//
    for (var i = 0; i < _jsonScartSelList.length; i++) {
      for (var j = 0; j < _jsonScartSelList[i].ShopGoodsSel.length; j++) {

        var _ShopGoodsSel = _jsonScartSelList[i].ShopGoodsSel[j];
        if (_ShopGoodsSel.IsSel == "true") {

          var _shopGoodsMsg = this.data.initSCartMsg_Data.GoodsMsgArr[i].ShopGoodsMsgArr[j];

          //初始化时就计算了折扣，这里不需要计算啦
          _sumOrderPrice += parseInt(_ShopGoodsSel.OrderNum) * parseFloat(_shopGoodsMsg.GoodsPrice);

        }
      }
    }
    _sumOrderPrice = mUtils.formatNumberDotDigit(_sumOrderPrice, 2);

    //----设置全局变量----//
    this.setData({
      sumOrderPrice: _sumOrderPrice,
    });

  },
  /**
   * 切换全选与全不选
   * @param {*} e 
   */
  toggleAllSel: function (e) {
    console.log(e);
    var _isAllSel = e.currentTarget.dataset.allSel;

    //操作Json对象
    var _jsonScartSelList = this.data.jsonScartSelList;

    //-----循环赋值订单数量-----//
    for (var i = 0; i < _jsonScartSelList.length; i++) {
      //全选
      if (_isAllSel == "true") {
        _jsonScartSelList[i].IsSel = "true";
      } else //全不选
      {
        _jsonScartSelList[i].IsSel = "false";
      }

      for (var j = 0; j < _jsonScartSelList[i].ShopGoodsSel.length; j++) {
        //全选
        if (_isAllSel == "true") {
          _jsonScartSelList[i].ShopGoodsSel[j].IsSel = "true";
        } else //全不选
        {
          _jsonScartSelList[i].ShopGoodsSel[j].IsSel = "false";
        }
      }
    }

    //----设置全局变量----//
    this.setData({
      jsonScartSelList: _jsonScartSelList,
      isAllSel: _isAllSel,
    });

    //统计订单总额
    this.sumOrderPrice();

  },
  /**
   * 删除购物车中商品信息
   */
  delScartGoodsArr: function () {

    var _selScartGoodsIDArr = "";

    //操作Json对象
    var _jsonScartSelList = this.data.jsonScartSelList;

    //-----循环赋值构造删除拼接字符串-----//
    for (var i = 0; i < _jsonScartSelList.length; i++) {
      for (var j = 0; j < _jsonScartSelList[i].ShopGoodsSel.length; j++) {

        var _ShopGoodsSel = _jsonScartSelList[i].ShopGoodsSel[j];
        if (_ShopGoodsSel.IsSel == "true") {

          _selScartGoodsIDArr += _ShopGoodsSel.CartID + "^";
        }
      }
    }
    //去掉前后的"^
    _selScartGoodsIDArr = mUtils.removeFrontAndBackChar(_selScartGoodsIDArr, "^");
    console.log(_selScartGoodsIDArr);
    if (_selScartGoodsIDArr == "") {
      mUtils.showToast("请选择删除的商品！");
      return;
    }

    mUtils.confirmWin("确定要删除吗？", (res) => {
      if (res == "Ok") {

        //构造POST参数
        var _dataPOST = {
          "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
          "Type": "3",
          "SCartIDArr": _selScartGoodsIDArr,
        };

        //正式发送Http请求
        mHttp.postHttp(app.apiURLData.sCartApi_Index, _dataPOST, _jsonReTxt => {
          console.log(_jsonReTxt);
          if (_jsonReTxt == "") {
            return;
          }
          //错误信息
          if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
            mUtils.showToast(_jsonReTxt.ErrMsg);
            return;
          }
          //操作成功信息
          if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != "") {
            //重新加载页面
            this.onShow();

            return;
          }


        });


      }
    });



  },
  //=========================增减订购数量=========================//
  /**
   * 当订购数量直接输入数值时
   * @param {*} e 
   */
  bindInputOrderNum: function (e) {
    console.log(e);
    var _detailVal = e.detail.value;
    if (_detailVal == "" || _detailVal == undefined || _detailVal == null) {
      //_detailVal = 1;
      return;
    }
    if (isNaN(_detailVal)) {
      _detailVal = 1;
    }

    var _goodsId = e.currentTarget.dataset.goodsId;
    var _specId = e.currentTarget.dataset.specId;

    //操作Json对象
    var _jsonScartSelList = this.data.jsonScartSelList;

    //-----循环赋值订单数量-----//
    for (var i = 0; i < _jsonScartSelList.length; i++) {
      for (var j = 0; j < _jsonScartSelList[i].ShopGoodsSel.length; j++) {
        if (_jsonScartSelList[i].ShopGoodsSel[j].GoodsID == _goodsId && _jsonScartSelList[i].ShopGoodsSel[j].SpecID == _specId) {
          _jsonScartSelList[i].ShopGoodsSel[j].OrderNum = _detailVal;
        }
      }
    }

    //-----设置全部变量值-----//
    this.setData({
      jsonScartSelList: _jsonScartSelList,
    });

    //统计订单总额
    this.sumOrderPrice();
  },
  /**
   * 订购数量文本框失去焦点
   * @param {*} e 
   */
  bindBlurOrderNum: function (e) {
    console.log(e);
    var _detailVal = e.detail.value;
    if (_detailVal == "" || _detailVal == undefined || _detailVal == null) {
      _detailVal = 1;
    }
    if (isNaN(_detailVal)) {
      _detailVal = 1;
    }

    var _goodsId = e.currentTarget.dataset.goodsId;
    var _specId = e.currentTarget.dataset.specId;

    //操作Json对象
    var _jsonScartSelList = this.data.jsonScartSelList;

    //-----循环赋值订单数量-----//
    for (var i = 0; i < _jsonScartSelList.length; i++) {
      for (var j = 0; j < _jsonScartSelList[i].ShopGoodsSel.length; j++) {
        if (_jsonScartSelList[i].ShopGoodsSel[j].GoodsID == _goodsId && _jsonScartSelList[i].ShopGoodsSel[j].SpecID == _specId) {
          _jsonScartSelList[i].ShopGoodsSel[j].OrderNum = _detailVal;
        }
      }
    }

    //-----设置全部变量值-----//
    this.setData({
      jsonScartSelList: _jsonScartSelList,
    });

    //统计订单总额
    this.sumOrderPrice();
  },
  /**
   * 增减订购数量
   * @param {} e 
   */
  addReduceOrderNum: function (e) {
    var _dataset = e.currentTarget.dataset;
    //console.log(_dataset);
    var _goodsId = e.currentTarget.dataset.goodsId;
    var _specId = e.currentTarget.dataset.specId;
    var _orderNum = e.currentTarget.dataset.orderNum;

    var _exeType = _dataset.exeType //操作类型 add / reduce

    //当前订购数量
    var _orderNumCurrent = _orderNum;

    if (_exeType == "add") {
      _orderNumCurrent++;
    } else if (_exeType == "reduce") {
      if (_orderNumCurrent <= 1) {
        _orderNumCurrent = 1;
      } else {
        _orderNumCurrent--;
      }
    }

    //操作Json对象
    var _jsonScartSelList = this.data.jsonScartSelList;

    //-----循环赋值订单数量-----//
    for (var i = 0; i < _jsonScartSelList.length; i++) {
      for (var j = 0; j < _jsonScartSelList[i].ShopGoodsSel.length; j++) {
        if (_jsonScartSelList[i].ShopGoodsSel[j].GoodsID == _goodsId && _jsonScartSelList[i].ShopGoodsSel[j].SpecID == _specId) {
          _jsonScartSelList[i].ShopGoodsSel[j].OrderNum = _orderNumCurrent;
        }
      }
    }


    //-----设置全部变量值-----//
    this.setData({
      jsonScartSelList: _jsonScartSelList,
    });

    //统计订单总额
    this.sumOrderPrice();

  },
  //=======================优惠券相关逻辑==========================//
  /**
   * 得到 店铺可以使用的优惠券列表  买家UserID不判断 
   * @param {*} e 
   */
  shopAbleUseCouponsList: function (pShopUserID) {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "2",
      "ShopUserID": pShopUserID,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.sCartApi_Index, _dataPOST, _jsonReTxt => {
      console.log(_jsonReTxt);
      if (_jsonReTxt == "") {
        return;
      }

      //------格式化与赋值返回数据------//
      var _couponsStyleValObj = [];
      for (var i = 0; i < _jsonReTxt.ShopAbleUseCouponsList.length; i++) {
        var _goodsAbleUseCoupons = _jsonReTxt.ShopAbleUseCouponsList[i];
        _couponsStyleValObj[i] = {
          "couponsId": _goodsAbleUseCoupons.CouponsID,
          "btnValTxt": "立即领取",
          "isGetCoupons": false
        };
      }


      //赋值全局变量
      this.setData({
        shopAbleUseCouponsList_Data: _jsonReTxt,
        goodsAbleUseCouponsListJson: _jsonReTxt,
        couponsStyleValObj: _couponsStyleValObj,
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
  },


  //===================== 底部滑出的自定义窗口===========================//
  /**
   * 显示底部滑出窗口
   */
  openSlideBottom: function (e) {
    var _shopUserID = e.currentTarget.dataset.shopUserId;

    //得到 店铺可以使用的优惠券列表  买家UserID不判断 
    this.shopAbleUseCouponsList(_shopUserID);

    this.setData({
      isDisplaySlideCoupons: "normal", //是否显示窗口
    });

  },
  /**
   * 隐藏底部滑出窗口
   */
  closeSlideBottom: function () {
    this.setData({
      isDisplaySlideCoupons: "none", //是否显示窗口
    });
  }


})