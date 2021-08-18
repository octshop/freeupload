// pages/buyer/placeordermul/placeordermul.js
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiLogin = require('../../../busicode/busilogin.js');
var mBusiCookie = require('../../../busicode/busicookie.js');

//--------公共变量-------//

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    apiWebDoamin: app.globalData.apiWebDoamin, //小程序Api的网站域名
    navbarHeight: 0, //navBar的高度
    octContentMarginTop: 0, //主体内容距子导航的距离
    //----------自定义函数---------------//
    initBuyerReceiAddr_Data: null,
    bReceiAddrIDSel: "0", //当前选择的收货地址
    scartIDOrderNumArr: "", //得到去结算的Cookie  得到购物车信息ID 与之对应的  订购数量 拼接字符串  [ SCartID _ OrderNum ^ SCartID _ OrderNum | SCartID _ OrderNum ^ SCartID _ OrderNum]
    regionProCode: "", //当前选择的收货地址省份
    initGoodsShopListMsg_Data: null, //初始化商家商品列表信息
    shopUserId: "0", //商家UserID
    sumOrderPrice: 0, //统计订单总额
    //----------多商品下单订购---------------//
    jsonOrderMsg: null, //下单订购Jso对象
    //-----运费显示------//
    freightMoneyArrShow: null, //运费显示数组对象
    //----------发票申请窗口---------------//
    //-------------发票信息----------//
    isDisplaySlide: "none", //是否显示窗口 normal ,none
    slideBottomWinHeight: 400, //窗口高度
    invoiceType: "General", //切换发票类型
    invoiceTitle: "Person", //切换发票抬头  
    invoiceContent: "InvoiceNo", //发票内容（GoodsDetail 商品明细 GoodsType 商品类别  InvoiceNo 不开发票  等）
    invoiceGuid: "", //标记发票的唯一性 GUID
    invoiceShowTxt: "不开发票", //不开发票
    preLoadInvoiceMsg_Data: null, //预加载订单发票信息
    //-------------优惠券窗口----------//
    goodsAbleUseCouponsListJson: null, //得到商品可以使用的优惠券列表Json对象
    isDisplaySlideCoupons: "none", //是否显示优惠券窗口
    slideWinHeightCoupons: 430, //优惠券窗口高度
    couponsStyleValObj: null, //优惠券窗口相关样式显示值对象
    couponsIndex: "0", //当前优惠券的索引,商品订单Index
    //------------选择支付的窗口----------//
    isDisplaySlidePay: "none", //是否显示支付窗口
    payMsg_Data: null, //支付信息数据
    payType: "WeiXinPay", //选择了微信支付
    currentBalance: "0.00", //当前用户余额
    currentIntegral: "0.00", //当前用户积分
    billNumber: "0", //当前的支付交易号
    orderID: "0", //当前订单ID
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
  },
  /**
   * 进入页面显示事件
   */
  onShow: function () {

    //----判断用户是否登录 没有登录 则跳转到指定URL 并设置UserID,LoginSha1-----//
    mBusiLogin.isLoginUserNavigateSetUserIDPwdSha1Global(res => {
      //console.log(res)

      //设置全局变量中的 buyerMiniOpenID
      mBusiLogin.setAppMiniOpenID();

      //得到去结算的Cookie  得到购物车信息ID 与之对应的  订购数量 拼接字符串  [ SCartID _ OrderNum ^ SCartID _ OrderNum | SCartID _ OrderNum ^ SCartID _ OrderNum]
      mBusiCookie.getScartIDOrderNumArrCookie((res) => {
        this.setData({
          scartIDOrderNumArr: mUtils.strReplace(res, "|", "^"),
        });
      });

      //------登录成功后的调用函数-------//
      //初始化买家收货地址
      this.initBuyerReceiAddr();



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
   * 初始化买家收货地址
   */
  initBuyerReceiAddr: function () {

    //得到选择的收货地址
    mBusiCookie.getBuyerSelReceiAddrRegionCookie(res => {
      //{BReceiAddrID: "120051", RegionCodeArr: "430000_430300_430321", RegionNameArr: "湖南省_湘潭市_湘潭县"}
      //console.log("res.BReceiAddrID=" + res.BReceiAddrID);
      var _BReceiAddrID = "0";
      var _regionProCode = "";
      if (res.BReceiAddrID != "" && res.BReceiAddrID != undefined && res.BReceiAddrID != null) {
        _BReceiAddrID = res.BReceiAddrID;
        _regionProCode = res.RegionCodeArr.split("_")[0];
      }

      //构造POST参数
      var _dataPOST = {
        "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
        "Type": "1",
        "BReceiAddrID": _BReceiAddrID,
      };

      //正式发送Http请求
      mHttp.postHttp(app.apiURLData.orderApi_PlaceOrder, _dataPOST, _jsonReTxt => {
        console.log(_jsonReTxt);
        if (_jsonReTxt == "") {
          return;
        }

        if (_regionProCode == "" || _regionProCode == undefined || _regionProCode == null || _regionProCode == "0") {
          _regionProCode = _jsonReTxt.RegionCodeArr.split("_")[0];
        }

        //--------设置公共变量-------//
        this.setData({
          initBuyerReceiAddr_Data: _jsonReTxt,
          bReceiAddrIDSel: _jsonReTxt.BReceiAddrID,
          regionProCode: _regionProCode,
        });

        // 初始化商家商品列表信息
        this.initGoodsShopListMsg();

      });


    });

  },
  /**
   * 初始化商家商品列表信息
   */
  initGoodsShopListMsg: function () {

    console.log("this.data.scartIDOrderNumArr=" + this.data.scartIDOrderNumArr + " | this.data.regionProCode=" + this.data.regionProCode);

    if (this.data.scartIDOrderNumArr == "" || this.data.scartIDOrderNumArr == null || this.data.scartIDOrderNumArr == undefined) {
      return;
    }
    if (this.data.regionProCode == "" || this.data.regionProCode == null || this.data.regionProCode == undefined) {
      return;
    }

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
      "ScartIDOrderNumArrCookie": this.data.scartIDOrderNumArr,
      "RegionProCode": this.data.regionProCode,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.orderApi_PlaceOrderMul, _dataPOST, _jsonReTxt => {
      console.log(_jsonReTxt);
      if (_jsonReTxt == "") {
        return;
      }

      // {
      //   "GoodsMsgArr": [{
      //     "ShopGoodsArr": [{
      //       "CartID": "160144",
      //       "GoodsID": "40058",
      //       "SpecID": "0",
      //       "PropID": "0",
      //       "OrderNum": "1"
      //     }, {
      //       "CartID": "160143",
      //       "GoodsID": "50058",
      //       "SpecID": "171336",
      //       "PropID": "0",
      //       "OrderNum": "2"
      //     }]
      //   }, {
      //     "ShopGoodsArr": [{
      //       "CartID": "160147",
      //       "GoodsID": "50068",
      //       "SpecID": "0",
      //       "PropID": "0",
      //       "OrderNum": "1"
      //     }, {
      //       "CartID": "160146",
      //       "GoodsID": "30051",
      //       "SpecID": "161330",
      //       "PropID": "161332",
      //       "OrderNum": "1"
      //     }]
      //   }],
      //   "OrderMsgArr": [{
      //     "IsShopExpense": "express",
      //     "InvoiceGuid": "08dba772-1aad-446f-9144-ee4cb70e5884",
      //     "CouponsIssueID": "0",
      //     "CouponsUseGoodsID": "0",
      //     "OrderMemo": ""
      //   }, {
      //     "IsShopExpense": "shop",
      //     "InvoiceGuid": "111c596b-575e-4b3e-8f52-d69fec379467",
      //     "CouponsIssueID": "160213",
      //     "CouponsUseGoodsID": "50068",
      //     "OrderMemo": ""
      //   }],
      //   "BuyerReceiAddr": {
      //     "BReceiAddrID": "120059"
      //   }
      // }

      //[ SCartID _ OrderNum ^ SCartID _ OrderNum ^ SCartID _ OrderNum ^ SCartID _ OrderNum]
      //160151_1^160150_1^160149_1^160153_1^160152_1
      console.log(this.data.scartIDOrderNumArr);
      var _scartIDOrderNumArr = mUtils.splitStringJoinChar(this.data.scartIDOrderNumArr, "^");
      var _scartIDArr = new Array();
      var _orderNumArr = new Array();
      for (var k = 0; k < _scartIDOrderNumArr.length; k++) {
        var _arr = mUtils.splitStringJoinChar(_scartIDOrderNumArr[k], "_");
        _scartIDArr[k] = _arr[0];
        _orderNumArr[k] = _arr[1];
      }

      //下单订购Json信息
      var _jsonOrderMsg = "";
      _jsonOrderMsg += "{";
      _jsonOrderMsg += "\"BuyerReceiAddr\":{";
      _jsonOrderMsg += "\"BReceiAddrID\":\"" + this.data.bReceiAddrIDSel + "\"";
      _jsonOrderMsg += "}";

      //订单信息数组
      var _jsonOrderMsgArr = "\"OrderMsgArr\": [";

      //店铺商品信息
      var _jsonGoodsMsgArr = "\"GoodsMsgArr\": [";

      //-----运费的显示-----//
      var _freightMoneyArrShow = new Array(_jsonReTxt.GoodsMsgArr.length);

      //------格式化数据------//
      for (var i = 0; i < _jsonReTxt.GoodsMsgArr.length; i++) {

        //店铺商品信息
        _jsonGoodsMsgArr += "{";
        _jsonGoodsMsgArr += "\"ShopGoodsArr\":[";

        //快递类型
        var _expressTypeVal = "express";



        //----------运费对象---------//
        //统计运费
        var _sumFreightPrice = 0;
        var _freightTemplateParamArr = _jsonReTxt.GoodsMsgArr[i].FreightTemplateParamArr;
        _sumFreightPrice = 0; //运费总额
        //上一个单品的ID
        var _preGoodsID = 0;
        console.log("_freightTemplateParamArr.length=" + _freightTemplateParamArr.length);
        for (var m = 0; m < _freightTemplateParamArr.length; m++) {

          //如果是到店则跳过
          if (_jsonReTxt.GoodsMsgArr[i].ShopGoodsArr[m].IsShopExpense == "true") {
            continue;
          }
          console.log("执行啦1111");
          console.log(_freightTemplateParamArr[m]);

          //如果上一个商品ID与当前商品ID相同，说明是同一个商品,乘以续件。
          if (_preGoodsID == _jsonReTxt.GoodsMsgArr[i].ShopGoodsArr[m].GoodsID) {
            _sumFreightPrice += _freightTemplateParamArr[m].AddPieceMoney * _jsonReTxt.GoodsMsgArr[i].ShopGoodsArr[m].OrderNum;
          } else {
            _sumFreightPrice += this.sumFreightPrice(_freightTemplateParamArr[m].FreightMoney, _freightTemplateParamArr[m].AddPieceMoney, _jsonReTxt.GoodsMsgArr[i].ShopGoodsArr[m].OrderNum);
          }
          _preGoodsID = _jsonReTxt.GoodsMsgArr[i].ShopGoodsArr[m].GoodsID;

          console.log("_sumFreightPrice=" + _sumFreightPrice);
        }
        _sumFreightPrice = mUtils.formatNumberDotDigit(_sumFreightPrice, 2);
        //如果订单是到店消费或自取则运费为0
        if (_jsonReTxt.OrderMsgArr[i].IsShopExpense == "true" || _jsonReTxt.OrderMsgArr[i].IsShopExpense == true) {
          _sumFreightPrice = 0;
        }
        //运费显示赋值
        _freightMoneyArrShow[i] = _sumFreightPrice;

        var _SumOrderNum = 0; //商家订单总的商品数，用于初始化

        //--------商品信息-------//
        for (var j = 0; j < _jsonReTxt.GoodsMsgArr[i].ShopGoodsArr.length; j++) {

          //商家商品对象
          var _shopGoodsArr = _jsonReTxt.GoodsMsgArr[i].ShopGoodsArr[j];

          if (_shopGoodsArr.IsShopExpense == "true") {
            _expressTypeVal = "shop"; //到店消费自取
          }

          var _goodsTitle = _jsonReTxt.GoodsMsgArr[i].ShopGoodsArr[j].GoodsTitle;
          if (_goodsTitle.length > 28) {
            _jsonReTxt.GoodsMsgArr[i].ShopGoodsArr[j].GoodsTitle = _goodsTitle.substring(0, 25) + "…";
          }
          //有规格属性价格
          if (parseFloat(_shopGoodsArr.GoodsPriceSpec) > 0) {
            _shopGoodsArr.GoodsPrice = _shopGoodsArr.GoodsPriceSpec;
          }
          //计算折扣后的价格
          if (parseFloat(_shopGoodsArr.Discount) > 0) {
            _shopGoodsArr.GoodsPrice = parseFloat(_shopGoodsArr.GoodsPrice) * (parseFloat(_shopGoodsArr.Discount) / 10);
            _jsonReTxt.GoodsMsgArr[i].ShopGoodsArr[j].GoodsPrice = mUtils.formatNumberDotDigit(_shopGoodsArr.GoodsPrice, 2);
          }

          //循环找到当前产品订单数量
          for (var m = 0; m < _scartIDArr.length; m++) {
            if (_shopGoodsArr.CartID == _scartIDArr[m]) {

              _shopGoodsArr.OrderNum = _orderNumArr[m];
              //显示赋值
              _jsonReTxt.GoodsMsgArr[i].ShopGoodsArr[j].OrderNum = _orderNumArr[m];
            }
          }

          //商家订单商品总数
          _SumOrderNum += parseInt(_shopGoodsArr.OrderNum);


          //店铺商品信息
          _jsonGoodsMsgArr += "{";
          _jsonGoodsMsgArr += "\"CartID\": \"" + _shopGoodsArr.CartID + "\",";
          _jsonGoodsMsgArr += "\"GoodsID\": \"" + _shopGoodsArr.GoodsID + "\",";
          _jsonGoodsMsgArr += "\"SpecID\": \"" + _shopGoodsArr.SpecID + "\",";
          _jsonGoodsMsgArr += "\"PropID\": \"" + _shopGoodsArr.PropID + "\",";
          _jsonGoodsMsgArr += "\"OrderNum\": \"" + _shopGoodsArr.OrderNum + "\"";
          _jsonGoodsMsgArr += "},";
        }

        //去掉前后的","
        _jsonGoodsMsgArr = mUtils.removeFrontAndBackChar(_jsonGoodsMsgArr, ",");
        //店铺商品信息
        _jsonGoodsMsgArr += "]},";

        //console.log(_jsonReTxt.OrderMsgArr[i]);
        //构造优惠券的显示文本
        var _useCouponsShow = "没有可用优惠券";
        if (_jsonReTxt.OrderMsgArr[i].CouponsDefault != undefined) {
          if (_jsonReTxt.OrderMsgArr[i].CouponsDefault.UseMoney > 0) {
            _useCouponsShow = "抵用券减" + _jsonReTxt.OrderMsgArr[i].CouponsDefault.UseDiscountMoney + "元";
          } else if (_jsonReTxt.OrderMsgArr[i].CouponsDefault.UseDiscount > 0) {
            _useCouponsShow = _jsonReTxt.OrderMsgArr[i].CouponsDefault.UseDiscount + "折券减" + _jsonReTxt.OrderMsgArr[i].CouponsDefault.UseDiscountMoney + "元";
          }
        }

        var _UseDiscountMoney = "0"
        if (_jsonReTxt.OrderMsgArr[i].CouponsDefault.UseDiscountMoney != undefined) {
          _UseDiscountMoney = _jsonReTxt.OrderMsgArr[i].CouponsDefault.UseDiscountMoney
        }

        //商家订单小计总额，用于初始化
        var _OrderPriceSubTotal = parseFloat(_jsonReTxt.OrderMsgArr[i].OrderPriceSubTotal);
        _OrderPriceSubTotal = _OrderPriceSubTotal + parseFloat(_freightMoneyArrShow[i]) - parseFloat(_UseDiscountMoney);

        //如果使用优惠券，订单金额为负数时
        if (_OrderPriceSubTotal <= 0) {

          _jsonReTxt.OrderMsgArr[i].CouponsDefault.IssueID = "0";
          _jsonReTxt.OrderMsgArr[i].CouponsDefault.UseGoodsID = "0";
          _useCouponsShow = "没有可用优惠券";
          _UseDiscountMoney = "0"

          _OrderPriceSubTotal = parseFloat(_jsonReTxt.OrderMsgArr[i].OrderPriceSubTotal) + parseFloat(_freightMoneyArrShow[i]);
        }
        _OrderPriceSubTotal = mUtils.formatNumberDotDigit(_OrderPriceSubTotal, 2);

        var _IssueID = "0";
        var _UseGoodsID = "0";
        if (_jsonReTxt.OrderMsgArr[i].CouponsDefault.IssueID != undefined) {
          _IssueID = _jsonReTxt.OrderMsgArr[i].CouponsDefault.IssueID;
        }
        if (_jsonReTxt.OrderMsgArr[i].CouponsDefault.UseGoodsID != undefined) {
          _UseGoodsID = _jsonReTxt.OrderMsgArr[i].CouponsDefault.UseGoodsID;
        }

        //构造订单信息
        _jsonOrderMsgArr += "{"
        _jsonOrderMsgArr += "\"IsShopExpense\": \"" + _expressTypeVal + "\",";
        _jsonOrderMsgArr += "		\"InvoiceGuid\": \"" + _jsonReTxt.OrderMsgArr[i].InvoiceGuid + "\",";
        _jsonOrderMsgArr += "		\"invoiceShow\": \"不开发票\",";
        _jsonOrderMsgArr += "		\"CouponsIssueID\": \"" + _IssueID + "\",";
        _jsonOrderMsgArr += "		\"CouponsUseGoodsID\": \"" + _UseGoodsID + "\",";
        _jsonOrderMsgArr += "		\"UseCouponsShow\": \"" + _useCouponsShow + "\",";
        _jsonOrderMsgArr += "		\"UseDiscountMoney\": \"" + _UseDiscountMoney + "\",";
        _jsonOrderMsgArr += "		\"SumOrderNum\": \"" + _SumOrderNum + "\",";
        _jsonOrderMsgArr += "		\"OrderPriceSubTotal\": \"" + _OrderPriceSubTotal + "\",";

        _jsonOrderMsgArr += "		\"OrderMemo\": \"\"";
        _jsonOrderMsgArr += "},";
      }
      //去掉前后的","
      _jsonGoodsMsgArr = mUtils.removeFrontAndBackChar(_jsonGoodsMsgArr, ",");
      _jsonOrderMsgArr = mUtils.removeFrontAndBackChar(_jsonOrderMsgArr, ",");

      _jsonGoodsMsgArr += "]"
      _jsonOrderMsgArr += "]";

      //拼接到主字符串
      _jsonOrderMsg += "," + _jsonOrderMsgArr + "," + _jsonGoodsMsgArr;
      _jsonOrderMsg += "}";


      //--------设置公共变量-------//
      this.setData({
        initGoodsShopListMsg_Data: _jsonReTxt,
        jsonOrderMsg: JSON.parse(_jsonOrderMsg),
        freightMoneyArrShow: _freightMoneyArrShow, //运费
      });

      //统计总个订单的金额
      this.sumOrderPrice();

      console.log(_jsonOrderMsg);

    });
  },

  /**
   * 统计商家订单的总运费是多少
   * @param pOrderNum 订购数量
   */
  sumFreightPrice: function (pFreightMoney, pAddPieceMoney, pOrderNum) {

    var _sumPrice = parseFloat(pFreightMoney);

    if (pOrderNum > 1 && parseFloat(pAddPieceMoney) > 0) {
      _sumPrice += (parseInt(pOrderNum) - 1) * parseFloat(pAddPieceMoney);
    }

    return _sumPrice;
  },

  /**
   * 切换 /配送方式（送货上门 express  到店消费自取 shop ）
   * @param {*} e 
   */
  chgExpressType(e) {
    var _expressType = e.currentTarget.dataset.expressType;
    var _indexItem = e.currentTarget.dataset.indexItem;
    console.log("_expressType=" + _expressType);
    console.log("_indexItem=" + _indexItem);

    //----获取操作Json对象----//
    var _jsonOrderMsg = this.data.jsonOrderMsg;
    var _freightMoneyArrShow = this.data.freightMoneyArrShow;

    //console.log(_jsonOrderMsg.OrderMsgArr);
    //-----循环进行赋值------//
    for (var i = 0; i < _jsonOrderMsg.OrderMsgArr.length; i++) {

      if (parseInt(_indexItem) == i) {
        _jsonOrderMsg.OrderMsgArr[i].IsShopExpense = _expressType;
      }
    }

    if (_expressType == "express") {
      //重新计算运费
      _freightMoneyArrShow[_indexItem] = this.countShopOrderFreightPrice(_indexItem);
    } else {
      _freightMoneyArrShow[_indexItem] = 0;
    }


    //------设置公共变量------//
    this.setData({
      jsonOrderMsg: _jsonOrderMsg,
      freightMoneyArrShow: _freightMoneyArrShow,
    });

    // 统计店铺订单小计
    this.countShopOrderPrice(_indexItem);

  },
  /**
   * 统计总个订单的金额
   */
  sumOrderPrice: function () {
    //得到相关的初始化数据
    var _jsonOrderMsg = this.data.jsonOrderMsg; //操作订单Json

    var _sumOrderPrice = 0;
    for (var i = 0; i < _jsonOrderMsg.OrderMsgArr.length; i++) {
      _sumOrderPrice += parseFloat(_jsonOrderMsg.OrderMsgArr[i].OrderPriceSubTotal);
    }
    //console.log("_sumOrderPrice=" + _sumOrderPrice);
    if (parseFloat(_sumOrderPrice) <= 0) {
      _sumOrderPrice = 0.01;
    }
    _sumOrderPrice = mUtils.formatNumberDotDigit(_sumOrderPrice, 2);

    //设置公共变量值
    this.setData({
      sumOrderPrice: _sumOrderPrice,
    });

  },
  /**
   * 统计店铺订单小计
   */
  countShopOrderPrice: function (pShopIndex) {

    //得到相关的初始化数据
    var _jsonOrderMsg = this.data.jsonOrderMsg; //操作订单Json
    var _initGoodsShopListMsg = this.data.initGoodsShopListMsg_Data; //初始化订单信息

    //操作时的商品信息
    var _ShopGoodsArr = _jsonOrderMsg.GoodsMsgArr[pShopIndex].ShopGoodsArr;
    var _OrderMsgArr = _jsonOrderMsg.OrderMsgArr[pShopIndex];
    //初始化的商品信息
    var _shopGoodsArrInit = _initGoodsShopListMsg.GoodsMsgArr[pShopIndex].ShopGoodsArr;

    //商家订单总的商品数
    var _sumOrderNum = 0;

    //计算商品价格与订购数量的小计
    var _sumGoodsPriceOrderNum = 0;
    for (var i = 0; i < _ShopGoodsArr.length; i++) {
      _sumGoodsPriceOrderNum += parseInt(_ShopGoodsArr[i].OrderNum) * parseFloat(_shopGoodsArrInit[i].GoodsPrice);

      _sumOrderNum += parseInt(_ShopGoodsArr[i].OrderNum);
    }

    //计算当前的运费
    var _countShopOrderFreightPrice = parseFloat(this.countShopOrderFreightPrice(pShopIndex));

    //计算当前优惠券的使用金额
    var _useDiscountMoney = parseFloat(_OrderMsgArr.UseDiscountMoney);

    //商家订单总额
    var _sumShopOrderPrice = _sumGoodsPriceOrderNum + _countShopOrderFreightPrice - _useDiscountMoney;
    // if (parseFloat(_sumShopOrderPrice) <= 0) {
    //   _sumShopOrderPrice = 0.01;
    // }
    //格式化数字
    _sumShopOrderPrice = mUtils.formatNumberDotDigit(_sumShopOrderPrice, 2);

    //对操作Json字符串进行赋值
    _jsonOrderMsg.OrderMsgArr[pShopIndex].SumOrderNum = _sumOrderNum;
    _jsonOrderMsg.OrderMsgArr[pShopIndex].OrderPriceSubTotal = _sumShopOrderPrice;

    //设置公共变量值
    this.setData({
      jsonOrderMsg: _jsonOrderMsg,
    });

    //统计总个订单的金额
    this.sumOrderPrice();

    return _sumShopOrderPrice;
  },
  /**
   * 统计店铺订单总的运费
   * @param {*} pShopIndex 
   */
  countShopOrderFreightPrice: function (pShopIndex) {
    //得到相关的初始化数据
    var _jsonOrderMsg = this.data.jsonOrderMsg; //操作订单Json
    var _initGoodsShopListMsg = this.data.initGoodsShopListMsg_Data; //初始化订单信息

    //操作时的商品信息
    var _ShopGoodsArr = _jsonOrderMsg.GoodsMsgArr[pShopIndex].ShopGoodsArr;
    var _OrderMsgArr = _jsonOrderMsg.OrderMsgArr[pShopIndex];
    //初始化时的运费信息
    var _FreightTemplateParamArr = _initGoodsShopListMsg.GoodsMsgArr[pShopIndex].FreightTemplateParamArr;

    var _preGoodsID = "0";

    //运费总额
    var _ShopOrderFreightPrice = 0;
    if (_OrderMsgArr.IsShopExpense == "express") {
      //循环算出运费
      for (var i = 0; i < _ShopGoodsArr.length; i++) {
        if (_preGoodsID == _ShopGoodsArr[i].GoodsID) {
          _ShopOrderFreightPrice += parseFloat(_FreightTemplateParamArr[i].AddPieceMoney) * parseFloat(_ShopGoodsArr[i].OrderNum);
        } else {
          _ShopOrderFreightPrice += this.sumFreightPrice(_FreightTemplateParamArr[i].FreightMoney, _FreightTemplateParamArr[i].AddPieceMoney, _ShopGoodsArr[i].OrderNum);
        }
        _preGoodsID = _ShopGoodsArr[i].GoodsID;
      }
    }

    return _ShopOrderFreightPrice;
  },

  //-------------发票相关----------------//
  /**
   * 预加载发票信息
   * @param {*} pInvoiceGuid 
   */
  preLoadInvoiceMsgMul: function (pInvoiceGuid) {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "3",
      "InvoiceGuid": pInvoiceGuid,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.orderApi_OrderInvoice, _dataPOST, _jsonReTxt => {
      console.log(_jsonReTxt);
      if (_jsonReTxt == "") {
        return;
      }
      if (_jsonReTxt.InvoiceID <= 0) {
        return;
      }
      //------相关操作-----//


      //--------设置公共变量-------//
      this.setData({
        preLoadInvoiceMsg_Data: _jsonReTxt,
        invoiceType: _jsonReTxt.InvoiceType,
        invoiceTitle: _jsonReTxt.InvoiceTitle,
        invoiceContent: _jsonReTxt.InvoiceContent,
      });


    });

  },
  /**
   * 切换发票类型
   * @param {*} e 
   */
  chgInvoiceType: function (e) {
    var _invoiceType = e.currentTarget.dataset.invoiceType;

    if (_invoiceType == "AddValue") {
      //设置全局变量
      this.setData({
        invoiceTitle: "Company", //切换发票抬头  
      });
    } else {

    }

    //设置全局变量
    this.setData({
      invoiceType: _invoiceType,
    });

  },
  /**
   * 切换发票抬头  
   * @param {*} e 
   */
  chgInvoiceTitle: function (e) {
    var _invoiceTitle = e.currentTarget.dataset.invoiceTitle;

    if (this.data.invoiceType != "AddValue") {
      //设置全局变量
      this.setData({
        invoiceTitle: _invoiceTitle,
      });
    }

  },
  /**
   * 切换发票内容
   * @param {*} e 
   */
  chgInvoiceContent: function (e) {
    //发票内容（ GoodsDetail 商品明细 GoodsType 商品类别  InvoiceNo 不开发票  等）
    var _invoiceContent = e.currentTarget.dataset.invoiceContent;
    //设置全局变量
    this.setData({
      invoiceContent: _invoiceContent,
    });
  },
  /**
   * 输入订单备注
   * @param {}} e 
   */
  bindInputOrderMemo(e) {
    console.log(e);
    //获取留言值
    var _orderMemo = e.detail.value;
    var _shopIndex = e.currentTarget.dataset.shopIndex;
    //得到相关的初始化数据
    var _jsonOrderMsg = this.data.jsonOrderMsg; //操作订单Json
    //设置留言值
    _jsonOrderMsg.OrderMsgArr[_shopIndex].OrderMemo = _orderMemo;

    //设置公共变量值
    this.setData({
      jsonOrderMsg: _jsonOrderMsg,
    });
    console.log(_jsonOrderMsg);
  },

  //-------提交表单-----//
  formSubmit: function (e) {
    console.log(e);
    var _detailVal = e.detail.value;
    var _submitType = e.detail.target.dataset.submitType;
    console.log(_submitType);
    //提交表单类别 
    if (_submitType == "invoice") //提交订单发票信息
    {
      if (this.data.invoiceGuid == "" || this.data.invoiceGuid == null || this.data.invoiceGuid == undefined) {
        return;
      }

      var CompanyName = _detailVal.CompanyName;
      var TaxNumber = _detailVal.TaxNumber;
      var CompanyRegAddr = _detailVal.CompanyRegAddr;
      var CompanyTel = _detailVal.CompanyTel;
      var BankAcc = _detailVal.BankAcc;
      var OpeningBank = _detailVal.OpeningBank;
      var ReceiMobile = _detailVal.ReceiMobile;
      var ReceiEmail = _detailVal.ReceiEmail;

      //-----判断表单的输入------//
      if (ReceiMobile == "") {
        mUtils.showToast("【收票人手机号】不能为空！");
        return;
      }
      //判断手机号是否正确
      var _isMobile = mUtils.checkMobileNumber(ReceiMobile);
      if (_isMobile == false) {
        mUtils.showToast("【收票人手机号】错误，请检查！");
        return;
      }

      if (this.data.invoiceType == "AddValue") //增值税发票
      {
        if (CompanyName == "" || TaxNumber == "" || CompanyRegAddr == "" || CompanyTel == "" || BankAcc == "" || OpeningBank == "" || ReceiMobile == "") {
          mUtils.showToast("【增值专票】信息填写不这完整，请检查！");
          return;
        }
      }
      //抬头如果是企业
      if (this.data.invoiceTitle == "Company" && this.data.invoiceType == "General") {
        if (CompanyName == "" || TaxNumber == "") {
          mUtils.showToast("【单位名称】【纳税人识别号】不能为空！");
          return;
        }
      }

      if (this.data.shopUserId <= 0) {
        console.log("this.data.shopUserId=" + this.data.shopUserId);
        return;
      }

      console.log("this.data.invoiceContent=" + this.data.invoiceContent);
      if (this.data.invoiceContent == "" || this.data.invoiceContent == undefined) {
        mUtils.showToast("发票内容错误！");
        return;
      }

      //构造POST参数
      var _dataPOST = {
        "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
        "Type": "1",
        "InvoiceGuid": this.data.invoiceGuid,
        "ShopUserID": this.data.shopUserId,
        "InvoiceType": this.data.invoiceType,
        "InvoiceTitle": this.data.invoiceTitle,
        "InvoiceContent": this.data.invoiceContent,
        "CompanyName": CompanyName,
        "TaxNumber": TaxNumber,
        "CompanyRegAddr": CompanyRegAddr,
        "CompanyTel": CompanyTel,
        "BankAcc": BankAcc,
        "OpeningBank": OpeningBank,
        "ReceiMobile": ReceiMobile,
        "ReceiEmail": ReceiEmail,
      };
      console.log(_dataPOST);
      //显示加载提示
      mUtils.showLoadingWin("提交中")

      //正式发送Http请求
      mHttp.postHttp(app.apiURLData.orderApi_OrderInvoice, _dataPOST, _jsonReTxt => {
        //移除加载提示
        mUtils.hideLoadingWin();
        if (_jsonReTxt.ErrMsg != undefined && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "") {
          mUtils.showToast(_jsonReTxt.ErrMsg);
          return;
        }
        var _invoiceShowTxt = "不开发票"
        if (this.data.invoiceContent == "GoodsType") {
          _invoiceShowTxt = "商品类别";
          if (CompanyName != "" && this.data.invoiceTitle == "Company") {
            _invoiceShowTxt += "(" + CompanyName + ")";
          }
        } else if (this.data.invoiceContent == "GoodsDetail") {
          _invoiceShowTxt = "商品明细";
          if (CompanyName != "" && this.data.invoiceTitle == "Company") {
            _invoiceShowTxt += "(" + CompanyName + ")";
          }
        }

        //订单信息Json
        var _jsonOrderMsg = this.data.jsonOrderMsg;
        //判断是否为当前的发票
        for (var i = 0; i < _jsonOrderMsg.OrderMsgArr.length; i++) {
          //判断是否为当前发票
          if (_jsonOrderMsg.OrderMsgArr[i].InvoiceGuid == this.data.invoiceGuid) {
            _jsonOrderMsg.OrderMsgArr[i].invoiceShow = _invoiceShowTxt;
          }
        }

        //关掉窗口
        this.closeSlideBottom();
        //构造显示信息
        this.setData({
          jsonOrderMsg: _jsonOrderMsg,
        });


      });
    } else if (_submitType == "order") //提交订单
    {
      //正式提交表单
      this.submitOrderMsgMul();
    }
  },

  /**
   * 正式提交表单
   */
  submitOrderMsgMul: function () {

    //判断输入是否正确
    if (this.data.jsonOrderMsg == "" || this.data.jsonOrderMsg == null || this.data.jsonOrderMsg == undefined) {
      mUtils.showToast("下单信息错误，请重试！");
      return;
    }
    if (this.data.bReceiAddrIDSel == "" || this.data.bReceiAddrIDSel == undefined || this.data.bReceiAddrIDSel == null) {
      mUtils.showToast("收货地址错误！");
      return;
    }

    console.log(this.data.jsonOrderMsg);

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "5",
      "JsonOrder": escape(JSON.stringify(this.data.jsonOrderMsg)),
      "BReceiAddrID": this.data.bReceiAddrIDSel,
    };
    //显示加载提示
    mUtils.showLoadingWin("下单中");
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.orderApi_PlaceOrderMul, _dataPOST, _jsonReTxt => {
      console.log(_jsonReTxt);
      //移除加载提示
      mUtils.hideLoadingWin();
      if (_jsonReTxt == "") {
        return;
      }
      //------相关操作-----//
      if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
        mUtils.showToast(_jsonReTxt.ErrMsg);
        return;
      }
      //-----下单成功------//

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

  //---------优惠券相关---------//
  /**
   * 加载多个商品买家可使用的优惠券列表 (商家多个商品的订单)
   * @param {*} pGoodsIDArr 
   * @param {*} pGoodsUnitPriceArr 
   * @param {*} pOrderExpenseReachSum 
   */
  initUseCouponsMsgList: function (pGoodsIDArr, pGoodsUnitPriceArr, pOrderExpenseReachSum) {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "2",
      "GoodsIDArr": pGoodsIDArr,
      "OrderExpenseReachSum": pOrderExpenseReachSum,
      "GoodsUnitPriceArr": pGoodsUnitPriceArr,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.orderApi_PlaceOrderMul, _dataPOST, _jsonReTxt => {
      console.log(_jsonReTxt);
      if (_jsonReTxt == "") {
        return;
      }

      //------相关操作-----//
      var _couponsStyleValObj = [];
      for (var i = 0; i < _jsonReTxt.UseCouponsMsgList.length; i++) {
        var _goodsAbleUseCoupons = _jsonReTxt.UseCouponsMsgList[i];
        _couponsStyleValObj[i] = {
          "couponsId": _goodsAbleUseCoupons.CouponsID,
          "btnValTxt": "立即使用",
          "isGetCoupons": false
        };
      }
      //console.log(_couponsStyleValObj);
      //------全局变量赋值-----//
      this.setData({
        goodsAbleUseCouponsListJson: _jsonReTxt,
        couponsStyleValObj: _couponsStyleValObj,
        initUseCouponsMsgList_Data: _jsonReTxt,
      });

    });

  },
  /**
   * 使用优惠券
   * @param {*} e    
   */
  useCoupons: function (e) {
    var _issueId = e.currentTarget.dataset.issueId;
    var _useGoodsId = e.currentTarget.dataset.useGoodsId;
    var _useMoney = e.currentTarget.dataset.useMoney;
    var _useDiscount = e.currentTarget.dataset.useDiscount;
    var _useDiscountMoney = e.currentTarget.dataset.useDiscountMoney;
    console.log("_useDiscountMoney=" + _useDiscountMoney);

    //获取下单信息
    var _jsonOrderMsg = this.data.jsonOrderMsg;
    var _couponsIndex = this.data.couponsIndex;
    //赋值
    _jsonOrderMsg.OrderMsgArr[_couponsIndex].CouponsIssueID = _issueId
    _jsonOrderMsg.OrderMsgArr[_couponsIndex].CouponsUseGoodsID = _useGoodsId

    //构造优惠券的显示文本
    var _useCouponsShow = "";
    if (parseFloat(_useMoney) > 0) {
      _useCouponsShow = "抵用券减" + parseFloat(_useDiscountMoney) + "元";
    } else if (parseFloat(_useDiscount) > 0) {
      _useCouponsShow = _useDiscount + "折券减" + parseFloat(_useDiscountMoney) + "元";
    }
    _jsonOrderMsg.OrderMsgArr[_couponsIndex].UseCouponsShow = _useCouponsShow;
    _jsonOrderMsg.OrderMsgArr[_couponsIndex].UseDiscountMoney = _useDiscountMoney;

    //-----赋值公共变量------//
    this.setData({
      jsonOrderMsg: _jsonOrderMsg,
    });
    //关闭窗口
    this.closeSlideBottom();

  },
  /**
   * 重新加载默认使用的优惠券
   */
  reloadDefaultUseCouponsMsgMul: function (pCouponsIndex) {

    var _couponsIndex = pCouponsIndex;
    //console.log("_couponsIndex=" + _couponsIndex);

    //构造重新加载使用优惠券的参数
    var _goodsIDArr = ""; //用“^”分割
    var _specPropIDArr = ""; //用“^”分割,规格ID或属性ID
    var _goodsUnitPriceArr = ""; //用“^”分割 商品单价，加入折扣后
    var _goodsOrderNumArr = ""; //用“^”分割
    var _expenseReachSum = 0; //店铺订单金额小计

    //获取初始化对象
    var _initGoodsShopListMsg_Data = this.data.initGoodsShopListMsg_Data;
    //console.log(_initGoodsShopListMsg_Data);
    var _jsonOrderMsg = this.data.jsonOrderMsg;
    console.log(_jsonOrderMsg);

    //商家商品信息数组对象
    //初始化时的ShopGoodsArr信息
    var _shopGoodsArr = _initGoodsShopListMsg_Data.GoodsMsgArr[_couponsIndex].ShopGoodsArr;
    //操作更改后的ShopGoodsArr信息
    var _shopGoodsArrJson = _jsonOrderMsg.GoodsMsgArr[_couponsIndex].ShopGoodsArr;

    for (var i = 0; i < _shopGoodsArr.length; i++) {
      //商品ID拼接
      _goodsIDArr += _shopGoodsArr[i].GoodsID + "^";
      //商品单价拼接
      var _goodsUnitPrice = _shopGoodsArr[i].GoodsPrice; //这个价格已经计算了折扣，同时也判断了是否有规格价格
      _goodsUnitPriceArr += _goodsUnitPrice + "^";
      //规格属性ID拼接
      if (parseInt(_shopGoodsArr[i].PropID) > 0) {
        _specPropIDArr += _shopGoodsArr[i].PropID + "^";
      } else {
        _specPropIDArr += _shopGoodsArr[i].SpecID + "^";
      }
      //构造订购数量拼接
      _goodsOrderNumArr += _shopGoodsArrJson[i].OrderNum + "^";

      //计算 订单小计总额,消费满多少的总额，需乘以折扣(不包括运费)
      _expenseReachSum += (parseInt(_shopGoodsArrJson[i].OrderNum) * parseFloat(_goodsUnitPrice));
    }
    //去掉前后的"^"
    _goodsIDArr = mUtils.removeFrontAndBackChar(_goodsIDArr, "^");
    _goodsUnitPriceArr = mUtils.removeFrontAndBackChar(_goodsUnitPriceArr, "^");
    _specPropIDArr = mUtils.removeFrontAndBackChar(_specPropIDArr, "^");
    _goodsOrderNumArr = mUtils.removeFrontAndBackChar(_goodsOrderNumArr, "^");

    //打印日志构造的信息
    // console.log("_goodsIDArr=" + _goodsIDArr);
    // console.log("_specPropIDArr=" + _specPropIDArr);
    // console.log("_goodsUnitPriceArr=" + _goodsUnitPriceArr);
    // console.log("_goodsOrderNumArr=" + _goodsOrderNumArr);
    // console.log("_expenseReachSum=" + _expenseReachSum);

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "4",
      "GoodsIDArr": _goodsIDArr,
      "SpecPropIDArr": _specPropIDArr,
      "GoodsUnitPriceArr": _goodsUnitPriceArr,
      "ExpenseReachSum": _expenseReachSum,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.orderApi_PlaceOrderMul, _dataPOST, _jsonReTxt => {
      console.log(_jsonReTxt);
      if (_jsonReTxt == "") {

        //获取下单信息
        var _jsonOrderMsg = this.data.jsonOrderMsg;
        //赋值
        _jsonOrderMsg.OrderMsgArr[_couponsIndex].CouponsIssueID = "0";
        _jsonOrderMsg.OrderMsgArr[_couponsIndex].CouponsUseGoodsID = "0";
        _jsonOrderMsg.OrderMsgArr[_couponsIndex].UseCouponsShow = "没有可用优惠券";
        _jsonOrderMsg.OrderMsgArr[_couponsIndex].UseDiscountMoney = "0";

        //-----赋值公共变量------//
        this.setData({
          jsonOrderMsg: _jsonOrderMsg,
        });

        //再去统计一下，商家订单总金额
        this.countShopOrderPrice(_couponsIndex);

        return;
      }

      //获取下单信息
      var _jsonOrderMsg = this.data.jsonOrderMsg;

      //判断商家订单总额 ,计算商家订单小计总额
      var _OrderPriceSubTotal = this.countShopOrderPrice(_couponsIndex);

      if (_OrderPriceSubTotal <= parseFloat(_jsonReTxt.UseDiscountMoney)) {

        //获取下单信息
        var _jsonOrderMsg = this.data.jsonOrderMsg;
        //赋值
        _jsonOrderMsg.OrderMsgArr[_couponsIndex].CouponsIssueID = "0";
        _jsonOrderMsg.OrderMsgArr[_couponsIndex].CouponsUseGoodsID = "0";
        _jsonOrderMsg.OrderMsgArr[_couponsIndex].UseCouponsShow = "没有可用优惠券";
        _jsonOrderMsg.OrderMsgArr[_couponsIndex].UseDiscountMoney = "0";

      } else {

        //赋值
        _jsonOrderMsg.OrderMsgArr[_couponsIndex].CouponsIssueID = _jsonReTxt.IssueID;
        _jsonOrderMsg.OrderMsgArr[_couponsIndex].CouponsUseGoodsID = _jsonReTxt.UseGoodsID;

        //构造优惠券的显示文本
        var _useCouponsShow = "";
        if (parseFloat(_jsonReTxt.UseMoney) > 0) {
          _useCouponsShow = "抵用券减" + parseFloat(_jsonReTxt.UseMoney) + "元";
        } else if (parseFloat(_jsonReTxt.UseDiscount) > 0) {
          _useCouponsShow = _jsonReTxt.UseDiscount + "折券减" + parseFloat(_jsonReTxt.UseDiscountMoney) + "元";
        }
        _jsonOrderMsg.OrderMsgArr[_couponsIndex].UseCouponsShow = _useCouponsShow;
        _jsonOrderMsg.OrderMsgArr[_couponsIndex].UseDiscountMoney = _jsonReTxt.UseDiscountMoney;
      }

      //-----赋值公共变量------//
      this.setData({
        jsonOrderMsg: _jsonOrderMsg,
      });

      //console.log(_jsonOrderMsg);
      //再去统计一下，商家订单总金额
      this.countShopOrderPrice(_couponsIndex);

    });

  },


  //-------增减订购数量-----//
  /**
   * 增减订购数量
   * @param {} e 
   */
  addReduceOrderNum: function (e) {
    var _dataset = e.currentTarget.dataset;
    //console.log(_dataset);
    var _shopIndex = _dataset.shopIndex;
    var _shopGoodsIndex = _dataset.shopGoodsIndex;
    var _exeType = _dataset.exeType //操作类型 add / reduce

    //获取下单信息
    var _jsonOrderMsg = this.data.jsonOrderMsg;
    var _orderNum = _jsonOrderMsg.GoodsMsgArr[_shopIndex].ShopGoodsArr[_shopGoodsIndex].OrderNum;

    //当前订购数量
    var _orderNumCurrent = parseInt(_orderNum);
    console.log("_orderNumCurrent=" + _orderNumCurrent);
    if (_exeType == "add") {
      _orderNumCurrent++;
    } else if (_exeType == "reduce") {
      if (_orderNumCurrent <= 1) {
        _orderNumCurrent = 1;
      } else {
        _orderNumCurrent--;
      }
    }

    //设置当前订购数量
    _jsonOrderMsg.GoodsMsgArr[_shopIndex].ShopGoodsArr[_shopGoodsIndex].OrderNum = _orderNumCurrent;

    //设置公共变量
    this.setData({
      jsonOrderMsg: _jsonOrderMsg,
    });

    // 统计店铺订单总的运费
    var _shopOrderFreightPrice = this.countShopOrderFreightPrice(_shopIndex);
    var _freightMoneyArrShow = this.data.freightMoneyArrShow;
    _freightMoneyArrShow[_shopIndex] = parseFloat(_shopOrderFreightPrice);

    //设置全局变量值
    this.setData({
      freightMoneyArrShow: _freightMoneyArrShow,
    });

    //重新加载默认使用的优惠券
    this.reloadDefaultUseCouponsMsgMul(_shopIndex);

    // 统计店铺订单小计
    //this.countShopOrderPrice(_shopIndex);

  },
  /**
   * 当订购数量直接输入数值时
   * @param {*} e 
   */
  bindInputOrderNum: function (e) {
    //console.log(e);
    var _shopIndex = e.currentTarget.dataset.shopIndex;
    var _shopGoodsIndex = e.currentTarget.dataset.shopGoodsIndex;

    var _detailVal = e.detail.value;
    _detailVal = parseInt(_detailVal);

    //获取下单信息
    var _jsonOrderMsg = this.data.jsonOrderMsg;
    //设置当前订购数量
    _jsonOrderMsg.GoodsMsgArr[_shopIndex].ShopGoodsArr[_shopGoodsIndex].OrderNum = _detailVal;

    //设置公共变量
    this.setData({
      jsonOrderMsg: _jsonOrderMsg,
    });

    //重新加载默认使用的优惠券
    this.reloadDefaultUseCouponsMsgMul(_shopIndex);

  },
  /**
   * 订购数量文本框失去焦点
   * @param {*} e 
   */
  bindBlurOrderNum: function (e) {

    var _shopIndex = e.currentTarget.dataset.shopIndex;
    var _shopGoodsIndex = e.currentTarget.dataset.shopGoodsIndex;

    var _detailVal = e.detail.value;
    if (_detailVal == "" || _detailVal == undefined || _detailVal == null) {
      //获取下单信息
      var _jsonOrderMsg = this.data.jsonOrderMsg;
      //设置当前订购数量
      _jsonOrderMsg.GoodsMsgArr[_shopIndex].ShopGoodsArr[_shopGoodsIndex].OrderNum = 1;
      //设置公共变量
      this.setData({
        jsonOrderMsg: _jsonOrderMsg,
      });
    }

    //重新加载默认使用的优惠券
    this.reloadDefaultUseCouponsMsgMul(_shopIndex);

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
          mUtils.redirectToURL("../../../pages/buyer/myorder/myorder");
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
          mUtils.redirectToURL("../../../pages/buyer/myorder/myorder");
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
          mUtils.redirectToURL("../../../pages/buyer/myorder/myorder");
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
          mUtils.redirectToURL("../../../pages/buyer/myorder/myorder");
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
          mUtils.redirectToURL("../../../pages/buyer/myorder/myorder");
        });
        return;
      }

      //成功提示
      if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
        //跳转到订单详情页
        mUtils.redirectToURL("../../../pages/buyer/myorder/myorder");
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
          mUtils.redirectToURL("../../../pages/buyer/myorder/myorder");
        });
        return;
      }

      //成功提示
      if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
        //跳转到订单详情页
        mUtils.redirectToURL("../../../pages/buyer/myorder/myorder");
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
          mUtils.redirectToURL("../../../pages/buyer/myorder/myorder");
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

  //=========================公共函数=========================//
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

  //===================== 底部滑出的自定义窗口===========================//
  /**
   * 打开使用优惠券的窗口
   * @param {*} e 
   */
  openUseTicketWin: function (e) {
    //pGoodsIDArr, pGoodsUnitPriceArr, pOrderExpenseReachSum
    var _couponsIndex = e.currentTarget.dataset.couponsIndex;
    console.log("_couponsIndex=" + _couponsIndex);
    this.setData({
      couponsIndex: _couponsIndex
    });

    //构造初始化优惠券的信息
    var _goodsIDArr = "";
    var _goodsUnitPriceArr = "";
    var _orderExpenseReachSum = "";

    //获取初始化对象
    var _initGoodsShopListMsg_Data = this.data.initGoodsShopListMsg_Data;
    console.log(_initGoodsShopListMsg_Data);

    //订单消费总额 不包括其他费用 
    _orderExpenseReachSum = _initGoodsShopListMsg_Data.OrderMsgArr[_couponsIndex].OrderPriceSubTotal;
    //商家商品信息数组对象
    var _shopGoodsArr = _initGoodsShopListMsg_Data.GoodsMsgArr[_couponsIndex].ShopGoodsArr;
    for (var i = 0; i < _shopGoodsArr.length; i++) {
      //商品ID拼接
      _goodsIDArr += _shopGoodsArr[i].GoodsID + "^";
      //商品单价拼接
      var _goodsUnitPrice = _shopGoodsArr[i].GoodsPrice; //这个价格已经计算了折扣，同时也判断了是否有规格价格
      _goodsUnitPriceArr += _goodsUnitPrice + "^";

    }
    //去掉前后的"^"
    _goodsIDArr = mUtils.removeFrontAndBackChar(_goodsIDArr, "^");
    _goodsUnitPriceArr = mUtils.removeFrontAndBackChar(_goodsUnitPriceArr, "^");


    //加载多个商品买家可使用的优惠券列表 (商家多个商品的订单)
    this.initUseCouponsMsgList(_goodsIDArr, _goodsUnitPriceArr, _orderExpenseReachSum);

    this.setData({
      isDisplaySlideCoupons: "normal", //是否显示窗口
    });

  },
  /**
   * 显示底部滑出窗口
   */
  openSlideBottom: function (e) {

    var _invoiceGuid = e.currentTarget.dataset.invoiceGuid;
    var _shopUserId = e.currentTarget.dataset.shopUserId;

    this.setData({
      isDisplaySlide: "normal", //是否显示窗口
    });

    //预加载发票信息
    this.preLoadInvoiceMsgMul(_invoiceGuid);

    this.setData({
      invoiceGuid: _invoiceGuid,
      shopUserId: _shopUserId,
    });

  },
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
      mUtils.redirectToURL("../../../pages/buyer/myorder/myorder");
    }

    this.setData({
      isDisplaySlide: "none", //是否显示窗口
      isDisplaySlideCoupons: "none",
      isDisplaySlidePay: "none", //是否显示窗口
    });
  },



})