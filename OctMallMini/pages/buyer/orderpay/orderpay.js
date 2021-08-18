// pages/buyer/orderpay/orderpay.js
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiLogin = require('../../../busicode/busilogin.js');

//--------公共变量------//
var mCounterTimer = null;

//------初始化APP对象-----//
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    apiWebDoamin: app.globalData.apiWebDoamin, //小程序Api的网站域名
    navbarHeight: 0, //navBar的高度
    octContentMarginTop: 0, //主体内容距子导航的距离
    //----------底部滑出的自定义窗口---------------//
    isDisplaySlide: "none", //是否显示窗口 normal ,none
    slideBottomWinHeight: 400, //窗口高度
    //----------自定义变量---------------//
    expressType: "express", //配送方式（送货上门 express  到店消费自取 shop）
    initOrderMsg_Data: null, //初始化订单信息
    orderGoodsList: null, //订单商品信息列表
    invoiceShowTxt: "不开发票", //发票显示
    orderGoodsCount: 0, //订单商品总数
    bReceiAddrID: "0", //选择的收货地址ID
    orderId: "0", //订单ID号
    //------------选择支付的窗口----------//
    sumOrderPrice: 0, //订单的总额
    isDisplaySlidePay: "none", //是否显示支付窗口
    payMsg_Data: null, //支付信息数据
    payType: "WeiXinPay", //选择了微信支付
    currentBalance: "0.00", //当前用户余额
    currentIntegral: "0.00", //当前用户积分
    billNumber: "0", //当前的支付交易号
    wxPay_IsSimulatePay: "否", //是否开启了微信模拟支付

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

    //------获取传递的参数------//
    var _orderID = options.OID;
    var _bReceiAddrID = options.BID;

    //---设置公共变量---//
    this.setData({
      orderId: _orderID,
      bReceiAddrID: _bReceiAddrID,
    });

  },
  /**
   * 进入页面显示事件
   */
  onShow: function () {

    //----判断用户是否登录 没有登录 则跳转到指定URL 并设置UserID,LoginSha1-----//
    mBusiLogin.isLoginUserNavigateSetUserIDPwdSha1Global(res => {
      //console.log(res)

      //------登录成功后的调用函数-------//
      //初始化订单信息
      this.initOrderMsg();


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
   * 返回我的
   */
  home: function () {
    wx.switchTab({
      url: '../../tabbar/buyerindex/buyerindex',
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
  //=========================自定义函数=========================//
  /**
   * 初始化订单信息
   */
  initOrderMsg: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
      "OrderID": this.data.orderId,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.payApi_OrderPay, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }

      var _orderGoodsCount = 0;

      //分割商品信息
      var GoodsIDArr = mUtils.splitStringJoinChar(_jsonReTxt.OrderMsg.GoodsIDArr);
      var GoodsTitleArr = mUtils.splitStringJoinChar(_jsonReTxt.OrderMsg.GoodsTitleArr);
      var GoodsSpecIDOrderNumArr = mUtils.splitStringJoinChar(_jsonReTxt.OrderMsg.GoodsSpecIDOrderNumArr);
      var GoodsUnitPriceArr = mUtils.splitStringJoinChar(_jsonReTxt.OrderMsg.GoodsUnitPriceArr);
      var IsSpecParamArr = mUtils.splitStringJoinChar(_jsonReTxt.OrderMsg.IsSpecParamArr);
      var SpecNameArr = mUtils.splitStringJoinChar(_jsonReTxt.OrderMsg.SpecParamValArr);
      var GoodsCoverImgPathArr = mUtils.splitStringJoinChar(_jsonReTxt.OrderMsgExtra.GoodsImgArr);


      var myJsVal = "{\"GoodsMsgArr\": [";
      for (var i = 0; i < GoodsIDArr.length; i++) {
        var _orderNum = GoodsSpecIDOrderNumArr[i].split("_")[1];

        //订单商品总数
        _orderGoodsCount += parseInt(_orderNum);

        myJsVal += "{";
        myJsVal += "		\"GoodsID\": \"" + GoodsIDArr[i] + "\",";
        myJsVal += "		\"GoodsTitle\": \"" + GoodsTitleArr[i] + "\",";
        myJsVal += "		\"OrderNum\": \"" + _orderNum + "\",";
        myJsVal += "		\"GoodsUnitPrice\": \"" + GoodsUnitPriceArr[i] + "\",";
        myJsVal += "		\"IsSpecParamArr\": \"" + IsSpecParamArr[i] + "\",";
        myJsVal += "		\"SpecPropName\": \"" + SpecNameArr[i] + "\",";
        myJsVal += "		\"GoodsCoverImgPath\": \"" + GoodsCoverImgPathArr[i] + "\"";
        myJsVal += "},";

      }
      myJsVal = mUtils.removeFrontAndBackChar(myJsVal, ",");
      myJsVal += "]}";

      var _expressType = "shop";
      if (_jsonReTxt.OrderMsg.ExpressType.indexOf("送货上门") >= 0) {
        _expressType = "express";
      }

      //发票的构造
      var _invoiceContent = "不开发票";
      if (_jsonReTxt.OrderInvoice.InvoiceID > 0) {
        if (_jsonReTxt.OrderInvoice.InvoiceContent == "GoodsType") {
          _invoiceContent = "商品类别";
        } else if (_jsonReTxt.OrderInvoice.InvoiceContent == "GoodsDetail") {
          _invoiceContent = "商品明细";
        }
        if (_jsonReTxt.OrderInvoice.InvoiceType == "AddValue") {
          _invoiceContent = "增值税专票 - " + _jsonReTxt.OrderInvoice.CompanyName;
        } else {

          _invoiceContent = "普通发票 - " + _invoiceContent;
        }
      }

     _jsonReTxt.OrderMsg.OrderPrice = mUtils.formatNumberDotDigit(_jsonReTxt.OrderMsg.OrderPrice);

      //设置公共变量
      this.setData({
        initOrderMsg_Data: _jsonReTxt,
        expressType: _expressType,
        orderGoodsList: JSON.parse(myJsVal),
        invoiceShowTxt: _invoiceContent,
        orderGoodsCount: _orderGoodsCount,
        sumOrderPrice:   _jsonReTxt.OrderMsg.OrderPrice,
      });

      // 更新订单的收货地址信息
      this.updateOrderDelivery();

    });
  },
  /**
   * 更新订单的收货地址信息
   */
  updateOrderDelivery: function () {

    if (this.data.bReceiAddrID == "0" || this.data.bReceiAddrID == "" || this.data.bReceiAddrID == undefined || this.data.bReceiAddrID == null) {
      return;
    }

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "2",
      "OrderID": this.data.orderId,
      "BReceiAddrID": this.data.bReceiAddrID,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.payApi_OrderPay, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }

      var _orderDelivery = _jsonReTxt.DataDic;

      //得到订单初始化对象
      var _initOrderMsg_Data = this.data.initOrderMsg_Data;
      console.log(_initOrderMsg_Data);
      if (_initOrderMsg_Data != null) {

        _initOrderMsg_Data.OrderDelivery.DeliName = _orderDelivery.DeliName;
        _initOrderMsg_Data.OrderDelivery.Mobile = _orderDelivery.Mobile;
        _initOrderMsg_Data.OrderDelivery.RegionCodeArr = _orderDelivery.RegionCodeArr;
        _initOrderMsg_Data.OrderDelivery.RegionNameArr = _orderDelivery.RegionNameArr;
        _initOrderMsg_Data.OrderDelivery.DetailAddr = _orderDelivery.DetailAddr;

        //设置公共变量
        this.setData({
          initOrderMsg_Data: _initOrderMsg_Data,
        });

      }


    });
  },

  //-------提交表单-----//
  formSubmit: function (e) {
    console.log(e);
    var _detailVal = e.detail.value;
    var _submitType = e.detail.target.dataset.submitType;
    console.log(_submitType);
    if (_submitType == "order") //提交订单
    {
      //获取表单值
      var OrderMemo = _detailVal.OrderMemo;

      //提交订单信息
      this.submitOrderMsg(OrderMemo);

    }

  },

  /**
   * 提交订单信息
   * @param pOrderMemo 订单备注[可选]
   */
  submitOrderMsg: function (pOrderMemo = "") {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "3",
      "OrderID": this.data.orderId,
      "OrderMemo": pOrderMemo,
    };
    //加载提示
    mUtils.showLoadingWin("支付中");
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.payApi_OrderPay, _dataPOST, _jsonReTxt => {
      console.log(_jsonReTxt);
      //移除加载提示
      mUtils.hideLoadingWin();
      if (_jsonReTxt == "") {
        return;
      }

      //错误提示
      if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
        mUtils.showToast(_jsonReTxt.ErrMsg);
        return;
      }
      //显示支付确认窗口
      this.openSlideBottomPay();

      //赋值公共变量
      this.setData({
        payMsg_Data: _jsonReTxt.DataDic,
        billNumber: _jsonReTxt.DataDic.BillNumber,
        orderID: _jsonReTxt.DataDic.OrderID,
        wxPay_IsSimulatePay: _jsonReTxt.DataDic.WxPay_IsSimulatePay,
      });

    });

  },



  //------------支付确认窗口-----------------//
  /**
   *选择不同支付方式 
   * @param {*} e 
   */
  chgPayType: function (e) {
    console.log(e);
    var _payType = e.currentTarget.dataset.payType;
    //设置公共变量
    this.setData({
      payType: _payType,
    });
  },
  /**
   * 正式去支付
   */
  goPay: function () {

    //console.log("this.data.payType=" + this.data.payType);

    if (this.data.payType == "" || this.data.payType == null) {
      return;
    }

    //微信支付
    if (this.data.payType == "WeiXinPay") {

      //console.log("this.data.wxPay_IsSimulatePay=" + this.data.wxPay_IsSimulatePay);
      //是否开启了模拟支付
      if (this.data.wxPay_IsSimulatePay == "是") {
        mUtils.confirmWin("为了测试方便，系统开启了模拟支付，是否模拟支付？（如需体验正式的 微信支付 ，请联系客服给以配置。）", (res) => {
          if (res == "Ok") {
            //微信模拟支付
            this.payWeiXinSimulate();
          }
        });
      } else {
        //正式的微信支付
        this.payWeiXin();
      }

    } else if (this.data.payType == "Balance") //余额支付
    {
      // 余额支付
      this.payCurrentBalance();
    } else if (this.data.payType == "Integral") //积分支付
    {
      //积分支付
      this.payCurrentIntegral();
    } else if (this.data.payType == "PayDelivery") //货到付款
    {
      //货到付款支付
      this.payDelivery();
    } else if (this.data.payType == "Offline") //到店付支付
    {
      //到店付支付
      this.payOffline();
    } else if (this.data.payType == "Transfer") //银行转账支付
    {
      //银行转账支付
      this.payTransfer();
    }
  },
  /**
   * 微信小程序支付
   */
  payWeiXin: function () {
    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
      "WxOpenID": app.globalData.buyerMiniOpenID,
      "BillNumber": this.data.billNumber,
    };
    //显示加载提示
    mUtils.showLoadingWin("支付中");
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.payApi_Index, _dataPOST, _jsonReTxt => {
      //console.log(_jsonReTxt);
      //移除加载提示
      mUtils.hideLoadingWin();
      if (_jsonReTxt == "") {
        return;
      }
      //错误提示
      if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
        mUtils.showToastCb(_jsonReTxt.ErrMsg, () => {
          //跳转到订单详情页
          mUtils.redirectToURL("../../../pages/buyer/orderdetail/orderdetail?OID=" + this.data.orderID);
        });
        return;
      }

      //---拉起微信小程序支付----//
      //console.log(_jsonReTxt.nonceStr);
      var MiniPayJson = JSON.parse(_jsonReTxt.toString());
      // console.log(MiniPayJson);
      wx.requestPayment({
        timeStamp: MiniPayJson.timeStamp,
        nonceStr: MiniPayJson.nonceStr,
        package: MiniPayJson.package,
        signType: MiniPayJson.signType,
        paySign: MiniPayJson.paySign,
        success(res) {
          console.log(res);

          //BillNumber
          //跳转到支付成功页
          mUtils.redirectToURL("../../../pages/buyer/paysu/paysu?BN=" + this.data.billNumber);

        },
        fail(res) {
          console.log(res);
          //跳转到订单详情页
          mUtils.redirectToURL("../../../pages/buyer/orderdetail/orderdetail?OID=" + this.data.orderID);
        }
      });



    });

  },
  
  /**
   * 微信模拟支付
   */
  payWeiXinSimulate: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "2",
      "PayWay": "WeiXinPay",
      "BillNumber": this.data.billNumber,
    };
    //显示加载提示
    mUtils.showLoadingWin("支付中");
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.payApi_Index, _dataPOST, _jsonReTxt => {
      //console.log(_jsonReTxt);
      //移除加载提示
      mUtils.hideLoadingWin();
      if (_jsonReTxt == "") {
        return;
      }
      //错误提示
      if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
        mUtils.showToastCb(_jsonReTxt.ErrMsg, () => {
          //跳转到订单详情页
          mUtils.redirectToURL("../../../pages/buyer/orderdetail/orderdetail?OID=" + this.data.orderID);
        });
        return;
      }
      //成功提示
      if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
        mUtils.showToastCb(_jsonReTxt.Msg, () => {
          //跳转到支付成功页
          mUtils.redirectToURL("../../../pages/buyer/paysu/paysu?BN=" + this.data.billNumber);
        });
        return;
      }

    });

  },
  /**
   * 余额支付
   */
  payCurrentBalance: function () {
    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "3",
      "PayWay": "Balance",
      "BillNumber": this.data.billNumber,
    };
    //显示加载提示
    mUtils.showLoadingWin("支付中");
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.payApi_Index, _dataPOST, _jsonReTxt => {
      //console.log(_jsonReTxt);
      //移除加载提示
      mUtils.hideLoadingWin();
      if (_jsonReTxt == "") {
        return;
      }
      //错误提示
      if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
        mUtils.showToastCb(_jsonReTxt.ErrMsg, () => {
          //跳转到订单详情页
          mUtils.redirectToURL("../../../pages/buyer/orderdetail/orderdetail?OID=" + this.data.orderID);
        });
        return;
      }

      //成功提示
      if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
        //跳转到支付成功页
        mUtils.redirectToURL("../../../pages/buyer/paysu/paysu?BN=" + this.data.billNumber);
        return;
      }

    });
  },
  /**
   * 积分支付
   */
  payCurrentIntegral: function () {
    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "3",
      "PayWay": "Integral",
      "BillNumber": this.data.billNumber,
    };
    //显示加载提示
    mUtils.showLoadingWin("支付中");
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.payApi_Index, _dataPOST, _jsonReTxt => {
      //console.log(_jsonReTxt);
      //移除加载提示
      mUtils.hideLoadingWin();
      if (_jsonReTxt == "") {
        return;
      }
      //错误提示
      if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
        mUtils.showToastCb(_jsonReTxt.ErrMsg, () => {
          //跳转到订单详情页
          mUtils.redirectToURL("../../../pages/buyer/orderdetail/orderdetail?OID=" + this.data.orderID);
        });
        return;
      }

      //成功提示
      if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
        //跳转到支付成功页
        mUtils.redirectToURL("../../../pages/buyer/paysu/paysu?BN=" + this.data.billNumber);
        return;
      }

    });
  },
  /**
   * 货到付款支付
   */
  payDelivery: function () {
    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "3",
      "PayWay": "PayDelivery",
      "BillNumber": this.data.billNumber,
    };
    //显示加载提示
    mUtils.showLoadingWin("支付中");
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.payApi_Index, _dataPOST, _jsonReTxt => {
      //console.log(_jsonReTxt);
      //移除加载提示
      mUtils.hideLoadingWin();
      if (_jsonReTxt == "") {
        return;
      }
      //错误提示
      if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
        mUtils.showToastCb(_jsonReTxt.ErrMsg, () => {
          //跳转到订单详情页
          mUtils.redirectToURL("../../../pages/buyer/orderdetail/orderdetail?OID=" + this.data.orderID);
        });
        return;
      }

      //成功提示
      if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
        //跳转到订单详情页
        mUtils.redirectToURL("../../../pages/buyer/orderdetail/orderdetail?OID=" + this.data.orderID);
        return;
      }

    });
  },
  /**
   * 到店付支付
   */
  payOffline: function () {
    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "3",
      "PayWay": "Offline",
      "BillNumber": this.data.billNumber,
    };
    //显示加载提示
    mUtils.showLoadingWin("支付中");
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.payApi_Index, _dataPOST, _jsonReTxt => {
      //console.log(_jsonReTxt);
      //移除加载提示
      mUtils.hideLoadingWin();
      if (_jsonReTxt == "") {
        return;
      }
      //错误提示
      if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
        mUtils.showToastCb(_jsonReTxt.ErrMsg, () => {
          //跳转到订单详情页
          mUtils.redirectToURL("../../../pages/buyer/orderdetail/orderdetail?OID=" + this.data.orderID);
        });
        return;
      }

      //成功提示
      if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
        //跳转到订单详情页
        mUtils.redirectToURL("../../../pages/buyer/orderdetail/orderdetail?OID=" + this.data.orderID);
        return;
      }

    });
  },
  /**
   * 银行转账支付
   */
  payTransfer: function () {
    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "3",
      "PayWay": "Transfer",
      "BillNumber": this.data.billNumber,
    };
    //显示加载提示
    mUtils.showLoadingWin("支付中");
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.payApi_Index, _dataPOST, _jsonReTxt => {
      //console.log(_jsonReTxt);
      //移除加载提示
      mUtils.hideLoadingWin();
      if (_jsonReTxt == "") {
        return;
      }
      //错误提示
      if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
        mUtils.showToastCb(_jsonReTxt.ErrMsg, () => {
          //跳转到订单详情页
          mUtils.redirectToURL("../../../pages/buyer/orderdetail/orderdetail?OID=" + this.data.orderID);
        });
        return;
      }

      //成功提示
      if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
        //跳转到银行转账页面
        mUtils.redirectToURL("../../../pages/buyer/banktransfer/banktransfer?BN=" + this.data.billNumber);
        return;
      }

    });
  },

  /**
   * 初始化当前余额
   */
  initCurrentBalance: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.vipApi_Index, _dataPOST, _jsonReTxt => {
      console.log(_jsonReTxt);

      if (_jsonReTxt == "") {
        return;
      }

      this.setData({
        currentBalance: _jsonReTxt.CurrentBalance,
      })


    });
  },
  /**
   * 得到用户当前的可用积分
   */
  initCurrentIntegral: function () {
    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "4",
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.vipApi_Index, _dataPOST, _jsonReTxt => {
      console.log(_jsonReTxt);

      if (_jsonReTxt == "") {
        return;
      }

      this.setData({
        currentIntegral: _jsonReTxt.CurrentIntegral,
      })


    });
  },

  //===================== 底部滑出的自定义窗口===========================//
  /**
   * 显示底部滑出窗口 - 支付确认窗口
   */
  openSlideBottomPay: function () {
    this.setData({
      isDisplaySlidePay: "normal", //是否显示窗口
    });

    //初始化当前余额
    this.initCurrentBalance();
    //得到用户当前的可用积分
    this.initCurrentIntegral();

  },
  /**
   * 隐藏底部滑出窗口
   */
  closeSlideBottom: function () {

    //如果是显示支付窗口
    console.log("this.data.isDisplaySlidePay=" + this.data.isDisplaySlidePay);
    if (this.data.isDisplaySlidePay == "normal") {
      //跳转到订单详情页
      mUtils.redirectToURL("../../../pages/buyer/orderdetail/orderdetail?OID=" + this.data.orderId);
    }

    this.setData({
      isDisplaySlidePay: "none", //是否显示支付确认窗口
    });
  },


  //===================== 公共函数===========================//
  /**
   * 打开地图导航
   */
  openMap: function (e) {
    console.log(e);
    var _latitude = e.currentTarget.dataset.latitude;
    var _longitude = e.currentTarget.dataset.longitude;
    var _name = e.currentTarget.dataset.name;
    var _address = e.currentTarget.dataset.address;

    // success
    //直接打开微信内置地图插件
    wx.openLocation({
      latitude: parseFloat(_latitude), //res.latitude, // 纬度，范围为-90~90，负数表示南纬
      longitude: parseFloat(_longitude), //res.longitude, // 经度，范围为-180~180，负数表示西经
      // scale: 28, // 缩放比例
      name: _name,
      address: _address
    })
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



})