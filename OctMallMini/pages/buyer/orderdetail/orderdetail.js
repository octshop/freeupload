// pages/buyer/orderdetail/orderdetail.js
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiLogin = require('../../../busicode/busilogin.js');
var mBusiCookie = require('../../../busicode/busicookie.js');


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
    //----------底部滑出的自定义窗口---------------//
    isDisplaySlide: "none", //是否显示窗口 normal ,none
    slideBottomWinHeight: 400, //窗口高度
    isDisplaySlideGift: "none", //是否显示赠品信息窗口
    //-----------------自定义变量-------------//
    orderInvoiceShow: "", //发票的显示
    orderId: "0", //订单ID
    billNumber: "0", //交易号
    shopUserID: "0", //商家UserID
    initOrderMsg_Data: null, //初始化订单信息
    orderGoodsList: null, //订单商品信息列表
    sumOrderGoodsPrice: 0, //商品总价
    orderGiftCount: 0, //订单赠品的个数
    orderGivingMsgList: null, //赠送信息列表
    bReceiAddrID: "0", //选择的收货地址ID
    confirmReceiReturnIntegralShow: "", //确认收货按钮显示,是否送积分
    isShowRefundBtn: false, //是否显示退款按钮
    initShopCheckOrderStatus_Data: null, //初始化 订单 [待消费/自取] 验证码 --包括重新生成
    shareGroupGoodsTitle: "", //邀请好参团商品标题
    statusLogoImgUrl: "", //订单进度图标URL
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

    //-------加载后的业务逻辑--------//
    var _orderId = options.OID;
    var _bReceiAddrID = options.BID;

    //设置全局变量值
    this.setData({
      orderId: _orderId,
      bReceiAddrID: _bReceiAddrID,
    });


  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    //判断用户是否登录 没有登录 则跳转到指定URL 并设置UserID,LoginSha1
    mBusiLogin.isLoginUserNavigateSetUserIDPwdSha1Global(res => {
      //console.log(res)

      //----------登录后的函数-----------//
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
   * 跳转到我的
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
  onShareAppMessage: function (options) {
    console.log(options);

    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "【好友邀请你拼团】-" + this.data.shareGroupGoodsTitle, // 默认是小程序的名称(可以写slogan等)
      path: '/pages/goods/groupdetail/groupdetail?GID=' + this.data.initOrderMsg_Data.OrderMsg.GoodsIDArr + "&GroupID=" + this.data.initOrderMsg_Data.OrderMsg.GroupID, // 默认是当前页面，必须是以‘/’开头的完整路径
      imgUrl: this.data.apiWebDoamin + '/Assets/Imgs/sharegroup.png', //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {}
      },
      fail: function () {

      },
      complete: function () {

      },
    }

    return shareObj;


  },
  //=====================自定义函数==========================//
  /**
   *  初始化订单信息
   */
  initOrderMsg: function () {

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
      "OrderID": this.data.orderId,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.orderApi_OrderDetail, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }

      // {
      //   "GoodsMsgArr": [{
      //     "GoodsTitle": "国金筑梦智能影院房aa",
      //     "OrderNum": "12",
      //     "GoodsUnitPrice": "255.00",
      //     "IsSpecParamArr": "true",
      //     "SpecPropName": "2天,豪华型",
      //     "GoodsCoverImgPath": "localhost:1400/Upload/GooGoodsImg/GoGI_20040_202012131517297700.png"
      //   }, {
      //     "GoodsTitle": "国金筑梦智能影院房aa",
      //     "OrderNum": "12",
      //     "GoodsUnitPrice": "255.00",
      //     "IsSpecParamArr": "true",
      //     "SpecPropName": "2天,豪华型",
      //     "GoodsCoverImgPath": "localhost:1400/Upload/GooGoodsImg/GoGI_20040_202012131517297700.png"
      //   }]
      // }

      this.setData({
        billNumber: _jsonReTxt.OrderMsg.BillNumber,
      });

      //分割商品信息
      var GoodsIDArr = mUtils.splitStringJoinChar(_jsonReTxt.OrderMsg.GoodsIDArr);
      var GoodsTitleArr = mUtils.splitStringJoinChar(_jsonReTxt.OrderMsg.GoodsTitleArr);
      var GoodsSpecIDOrderNumArr = mUtils.splitStringJoinChar(_jsonReTxt.OrderMsg.GoodsSpecIDOrderNumArr);
      var GoodsUnitPriceArr = mUtils.splitStringJoinChar(_jsonReTxt.OrderMsg.GoodsUnitPriceArr);
      var IsSpecParamArr = mUtils.splitStringJoinChar(_jsonReTxt.OrderMsg.IsSpecParamArr);
      var SpecNameArr = mUtils.splitStringJoinChar(_jsonReTxt.OrderMsg.SpecParamValArr);
      var GoodsCoverImgPathArr = mUtils.splitStringJoinChar(_jsonReTxt.OrderMsgExtra.GoodsImgArr);

      var _sumOrderGoodsPrice = 0; //商品总价

      var myJsVal = "{\"GoodsMsgArr\": [";
      for (var i = 0; i < GoodsIDArr.length; i++) {
        var _orderNum = GoodsSpecIDOrderNumArr[i].split("_")[1];

        var _SpecNameArr = SpecNameArr[i];
        if (_SpecNameArr == undefined) {
          _SpecNameArr = "";
        }

        myJsVal += "{";
        myJsVal += "		\"GoodsID\": \"" + GoodsIDArr[i] + "\",";
        myJsVal += "		\"GoodsTitle\": \"" + GoodsTitleArr[i] + "\",";
        myJsVal += "		\"OrderNum\": \"" + _orderNum + "\",";
        myJsVal += "		\"GoodsUnitPrice\": \"" + GoodsUnitPriceArr[i] + "\",";
        myJsVal += "		\"IsSpecParamArr\": \"" + IsSpecParamArr[i] + "\",";
        myJsVal += "		\"SpecPropName\": \"" + _SpecNameArr + "\",";
        myJsVal += "		\"GoodsCoverImgPath\": \"" + GoodsCoverImgPathArr[i] + "\"";
        myJsVal += "},";

        //统计商品总价
        _sumOrderGoodsPrice += parseFloat(GoodsUnitPriceArr[i]) * parseInt(_orderNum);

      }
      myJsVal = mUtils.removeFrontAndBackChar(myJsVal, ",");
      myJsVal += "]}";

      _sumOrderGoodsPrice = mUtils.formatNumberDotDigit(_sumOrderGoodsPrice);

      //发票显示内容
      var _orderInvoiceShow = "不开发票";
      if (_jsonReTxt.OrderInvoice.InvoiceContent != null && _jsonReTxt.OrderInvoice.InvoiceContent != "InvoiceNo") {
        if (_jsonReTxt.OrderInvoice.InvoiceType == "AddValue") {
          _orderInvoiceShow = "增值税专用发票";
        } else {
          _orderInvoiceShow = "普通发票";
        }
        if (_jsonReTxt.OrderInvoice.InvoiceContent == "GoodsDetail") {
          _orderInvoiceShow += "(商品明细)";
        } else if (_jsonReTxt.OrderInvoice.InvoiceContent == "GoodsType") {
          _orderInvoiceShow += "(商品类别)";
        } else {
          _orderInvoiceShow = "不开发票";
        }
      }
      if (_jsonReTxt.OrderInvoice.ReceiMobile == null) {
        _jsonReTxt.OrderInvoice.InvoiceType = "";
        _jsonReTxt.OrderInvoice.InvoiceTitle = "";
        _jsonReTxt.OrderInvoice.ReceiMobile = "";
        _jsonReTxt.OrderInvoice.ReceiEmail = "";
        _jsonReTxt.OrderInvoice.CompanyName = "";
        _jsonReTxt.OrderInvoice.TaxNumber = "";
        _jsonReTxt.OrderInvoice.CompanyRegAddr = "";
        _jsonReTxt.OrderInvoice.CompanyTel = "";
        _jsonReTxt.OrderInvoice.BankAcc = "";
        _jsonReTxt.OrderInvoice.OpeningBank = "";
        _jsonReTxt.OrderInvoice.BankCode = "";
        _jsonReTxt.OrderInvoice.IsInvoiced = "";
      }


      //赠品的个数
      var _orderGiftCount = 0;
      if (_jsonReTxt.OrderGiftMsg != undefined && _jsonReTxt.OrderGiftMsg != null) {
        _orderGiftCount = _jsonReTxt.OrderGiftMsg.GiftMsgList.length;
      }

      //构造赠送信息数组
      var _orderGivingMsgList = new Array();
      if (_jsonReTxt.OrderGivingMsg.GivingMsgID > 0) {
        _orderGivingMsgList = mUtils.splitStringJoinChar(_jsonReTxt.OrderGivingMsg.GivingDescArr);
      }

      //确认收货按钮
      var _confirmReceiReturnIntegralShow = "";
      if (_jsonReTxt.OrderMsgExtra.ConfirmReceiReturnIntegral != '' && _jsonReTxt.OrderMsgExtra.ConfirmReceiReturnIntegral != '0' && _jsonReTxt.OrderMsgExtra.ConfirmReceiReturnIntegral != null) {
        _confirmReceiReturnIntegralShow = "+" + _jsonReTxt.OrderMsgExtra.ConfirmReceiReturnIntegral + "积分";
      }

      //是否显示退款按钮
      var _isShowRefundBtn = false;
      if ((_jsonReTxt.OrderMsg.OrderStatus == '待发货' || _jsonReTxt.OrderMsg.OrderStatus == '待消费/自取') && _jsonReTxt.OrderMsg.PayWay.indexOf("货到付款") < 0 && _jsonReTxt.OrderMsg.PayWay.indexOf("积分支付") < 0) {
        _isShowRefundBtn = true;
      } else {
        _isShowRefundBtn = false
      }

      //收货地址电话隐藏
      if (_jsonReTxt.OrderDelivery != undefined) {
        _jsonReTxt.OrderDelivery.Mobile = mUtils.maskMobileNumber(_jsonReTxt.OrderDelivery.Mobile);
      }

      //设置订单状态Logo图片
      this.setStatusLogoImg(_jsonReTxt.OrderMsg.OrderStatus);


      //设置全局变量值
      this.setData({
        initOrderMsg_Data: _jsonReTxt,
        orderGoodsList: JSON.parse(myJsVal),
        sumOrderGoodsPrice: _sumOrderGoodsPrice,
        orderInvoiceShow: _orderInvoiceShow,
        orderGiftCount: _orderGiftCount,
        orderGivingMsgList: _orderGivingMsgList,
        shopUserID: _jsonReTxt.ShopMsg.ShopUserID,
        confirmReceiReturnIntegralShow: _confirmReceiReturnIntegralShow,
        isShowRefundBtn: _isShowRefundBtn,
        shareGroupGoodsTitle: _jsonReTxt.OrderMsg.GoodsTitleArr,
      });


      //更新订单的收货地址信息
      this.updateOrderDelivery();

      // 初始化 订单 [待消费/自取] 验证码 --包括重新生成
      this.initShopCheckOrderStatus();

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
    mHttp.postHttp(app.apiURLData.orderApi_OrderDetail, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }

      var _orderDelivery = _jsonReTxt.DataDic;

      //得到订单初始化对象
      var _initOrderMsg_Data = this.data.initOrderMsg_Data;
      console.log(_initOrderMsg_Data);
      if (_initOrderMsg_Data != null) {

        _initOrderMsg_Data.OrderDelivery.DeliName = _orderDelivery.DeliName;
        _initOrderMsg_Data.OrderDelivery.Mobile = mUtils.maskMobileNumber(_orderDelivery.Mobile);
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
  /**
   * 取消订单
   */
  cancelOrder: function () {
    mUtils.confirmWin("确定要取消订单吗？", res => {
      if (res == "Ok") {
        //-----构造POST参数-----//
        var _dataPOST = {
          "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
          "Type": "3",
          "OrderID": this.data.orderId,
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
            //初始化订单信息
            this.initOrderMsg();
          }

        });

      }
    });
  },
  /**
   * 提醒商家订单发货
   */
  remindSendGoods: function () {
    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "4",
      "OrderID": this.data.orderId,
      "ShopUserID": this.data.shopUserID
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.orderApi_OrderDetail, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }

      mUtils.showToast("提醒成功");
      return;

      if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {}

      if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {}

    });

  },
  /**
   * 延长自动确认收货时间
   */
  delayReceiOrder: function () {

    mUtils.confirmWin("延长自动确认收货时间？", res => {
      if (res == "Ok") {

        //-----构造POST参数-----//
        var _dataPOST = {
          "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
          "Type": "9",
          "OrderID": this.data.orderId,
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
              //重新加载订单
              this.initOrderMsg();
            });
          }

        });

      }
    });

  },
  /**
   * 确认收货 
   */
  confirmReceiOrder: function () {
    mUtils.confirmWin("确认收货吗？", res => {
      if (res == "Ok") {

        //-----构造POST参数-----//
        var _dataPOST = {
          "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
          "Type": "8",
          "OrderID": this.data.orderId,
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
              //重新加载订单
              this.initOrderMsg();
            });
          }

        });
      }
    });
  },
  /**
   * 申请退款(未发货)
   */
  applyRefund: function () {

    mUtils.confirmWin("确定要申请退款吗？", res => {
      if (res == "Ok") {

        //-----构造POST参数-----//
        var _dataPOST = {
          "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
          "Type": "5",
          "OrderID": this.data.orderId,
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
              //重新加载订单
              this.initOrderMsg();
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
    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "6",
      "OrderID": this.data.orderId,
      "ShopUserID": this.data.shopUserID,
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
   * 初始化 订单 [待消费/自取] 验证码 --包括重新生成
   * @param {any} pIsReSet 如果存在,是否重新生成 [false / true 重新生成]
   */
  initShopCheckOrderStatus: function (e) {
    var _isReSet = "false";
    if (e != undefined) {
      _isReSet = e.currentTarget.dataset.isReSet;
    }
    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "7",
      "OrderID": this.data.orderId,
      "IsReSet": _isReSet,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.orderApi_OrderDetail, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }
      //设置公共变量值
      this.setData({
        initShopCheckOrderStatus_Data: _jsonReTxt,
      });

    });



  },
  /**
   * 邀好友参团
   */
  shareGroupFriend: function () {
    wx.showsha({
      withShareTicket: true,
    })
  },
  /**
   * 设置订单状态Logo图片
   * @param {any} pOrderStatus 订单状态 [ 待付款]，[ 待确认(货到付款)]，[到店付], [转账]， [取消] ,[待消费/自取] ,[待发货]，[退款中]，[退款成功]，[待收货],[待评价]，[完成]
   */
  setStatusLogoImg: function (pOrderStatus) {

    var _statusLogoImgUrl = "/Assets/Imgs/Icon/order_trucks.png";

    if (pOrderStatus == "待付款" || pOrderStatus == "待确认" || pOrderStatus == "到店付" || pOrderStatus == "转账") {
      _statusLogoImgUrl = "/Assets/Imgs/Icon/order_waitpay.png";
    } else if (pOrderStatus == "待发货") {
      _statusLogoImgUrl = "/Assets/Imgs/Icon/order_trucks.png";
    } else if (pOrderStatus == "待收货") {
      _statusLogoImgUrl = "/Assets/Imgs/Icon/order_trucks.png";
    } else if (pOrderStatus == "待消费/自取") {
      _statusLogoImgUrl = "/Assets/Imgs/Icon/order_shopconfirm.png";
    } else if (pOrderStatus == "待评价") {
      _statusLogoImgUrl = "/Assets/Imgs/Icon/order_appraise.png";
    } else if (pOrderStatus == "完成") {
      _statusLogoImgUrl = "/Assets/Imgs/Icon/order_finish.png";
    } else if (pOrderStatus == "取消") {
      _statusLogoImgUrl = "/Assets/Imgs/Icon/order_cancel.png";
    } else if (pOrderStatus.indexOf("退款") >= 0) {
      _statusLogoImgUrl = "/Assets/Imgs/Icon/order_refund.png";
    }

    //设置公共变量
    this.setData({
      statusLogoImgUrl: _statusLogoImgUrl,
    });

    console.log(this.data.statusLogoImgUrl);

  },

  //===================== 公共函数===========================//
  /**
   * 显示底部滑出窗口
   */
  openSlideBottom: function () {
    this.setData({
      isDisplaySlide: "normal", //是否显示窗口
    });
  },
  /**
   * 显示底部滑出窗口
   */
  openSlideBottomGift: function () {
    this.setData({
      isDisplaySlideGift: "normal", //是否显示窗口
    });
  },
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
  /**
   * 复制内容到剪贴板上
   * @param {*} e 
   */
  copyContentClipboard: function (e) {
    var _copyContent = e.currentTarget.dataset.copyContent;
    mUtils.copyContentClipboard(_copyContent);

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
   * 拨打电话
   * @param {} e 
   */
  makePhoneCall: function (e) {
    //mUtils.logOut(e.target.dataset.phoneNumber)
    var _dataSet = e.currentTarget.dataset;
    //拨打电话
    mUtils.makePhoneCall(_dataSet.phoneNumber);
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
      "ShopUserID": this.data.shopUserID,
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
        mUtils.makePhoneCall(this.data.initOrderMsg_Data.ShopMsg.ShopMobile);
      }

    });
  },




})