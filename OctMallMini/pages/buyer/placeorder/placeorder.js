// pages/buyer/placeordermul/placeordermul.js
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiLogin = require('../../../busicode/busilogin.js');
var mBusiCookie = require('../../../busicode/busicookie.js');
const busicookie = require('../../../busicode/busicookie.js');


//--------公共变量------//
var mCounterTimer = null;
var mKeyEn = ""; //加密后的 商品分享KEY  带 + 的

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
    initOrderGoodsMsg_Data: null, //初始化订单信息
    goodsID: 0, //商品ID
    orderNumCurrent: 1, //订购数量 
    orderSpecID: "0", //当前订购商品的规格属性ID
    groupID: 0, //参与拼团的ID,开团ID
    isGroup: false, //是否团购
    groupSettingID: "0", //拼团设置信息ID
    expressType: "express", //配送方式（送货上门 express  到店消费自取 shop）
    sumFreight: 0, //计算运费
    sumFreightPre: 0, //计算的保留运费
    initBuyerReceiAddr_Data: null, //初始化买家收货地址
    bReceiAddrIDSel: "0", //当前选择的收货地址
    shopId: 0, //店铺ID
    shopUserId: 0, //商家UserID
    initShopAddrNav_Data: null, //初始化店铺地址坐标信息
    goodPriceShow: 0, //当前显示的商品价格
    currentGoodsPriceNoDicount: 0, //当前商品的价格没有折扣的，有规格选择规格价格，没有就本身的价格
    initGroupGoodsSetting_Data: null, //初始化拼团商品设置信息
    goodsdetailUrl: "", //商品详情跳转的URL
    sumOrderPrice: "0", //订单小计总额，订单总额
    orderGuid: "", //订单的GUID （标记一次性提交的订单信息）
    orderID: "0", //订单ID
    //-------------限时秒杀----------//
    countDownTimer: null, //倒计时对象
    secKillTypeTxt: "抢购秒杀", //秒杀类型，限时秒杀，一般抢购秒杀
    countDownEndTime: "", //限时秒杀结束时间
    //-------------发票信息----------//
    invoiceType: "General", //切换发票类型
    invoiceTitle: "Person", //切换发票抬头  
    invoiceContent: "InvoiceNo", //发票内容（GoodsDetail 商品明细 GoodsType 商品类别  InvoiceNo 不开发票  等）
    invoiceGuid: "", //标记发票的唯一性 GUID
    invoiceShowTxt: "不开发票", //不开发票
    preLoadInvoiceMsg_Data: null, //预加载订单发票信息
    //-------------优惠券----------//
    initUseCouponsMsgList_Data: null,
    useCouponsShow: "无优惠券", //优惠券显示
    useDiscountMoney: "0", //优惠券使用折扣与金额
    issueID: "0", //默认使用的优惠券放发ID
    issueIDSel: "0", //选择的使用优惠券
    //-------------优惠券窗口----------//
    goodsAbleUseCouponsListJson: null, //得到商品可以使用的优惠券列表Json对象
    isDisplaySlideCoupons: "none", //是否显示优惠券窗口
    slideWinHeightCoupons: 430, //优惠券窗口高度
    couponsStyleValObj: null, //优惠券窗口相关样式显示值对象
    //------------选择支付的窗口----------//
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
    //IsGroup=true&GroupID=0
    var _isGroup = options.IsGroup;
    var _groupID = options.GroupID;
    if (_isGroup == undefined) {
      _isGroup = false
    }
    if (_groupID == undefined) {
      _groupID = 0;
    }
    //设置传递的参数
    this.setData({
      groupID: _groupID,
      isGroup: _isGroup,
    });

    //得到 - 分享商品返佣Cookie
    mBusiCookie.getBuyerShareGoodsCookie(res => {
      if (res == "" || res == undefined) {
        return;
      }
      mKeyEn = res;
      mUtils.logOut("mKeyEn=" + mKeyEn);
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

      //------登录成功后的调用函数-------//

      //初始化订购商品信息
      this.initOrderGoodsMsg();


    });

    this.setData({
      invoiceGuid: mUtils.getNewGuid(),
      orderGuid: mUtils.getNewGuid(),
    });

    console.log("this.data.isGroup=" + this.data.isGroup);

  },
  onUnload: function () {
    clearTimeout(mCounterTimer);
    mCounterTimer = null;
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //=========================自定义函数=========================//
  /**
   * 初始化订购商品信息
   */
  initOrderGoodsMsg: function () {

    //得到当前订购信息Cookie
    mBusiCookie.getOrderGoodsMsgCookieArrSingle(res => {
      console.log(res);
      //{GoodsID: "60069", OrderNum: "1", SpecID: "191392", GroupSettingID: "0"}
      var _orderGoodsMsg = res;
      if (_orderGoodsMsg.GoodsID <= 0) {
        return;
      }
      this.setData({
        orderSpecID: _orderGoodsMsg.SpecID,
        groupSettingID: _orderGoodsMsg.GroupSettingID,
      });

      //是否团购
      if (this.data.isGroup == "true") {
        this.setData({
          goodsdetailUrl: "../../../pages/goods/groupdetail/groupdetail?GID=" + _orderGoodsMsg.GoodsID,
        });
      } else {
        this.setData({
          goodsdetailUrl: "../../../pages/goods/goodsdetail/goodsdetail?GID=" + _orderGoodsMsg.GoodsID,
        });
      }

      //得到选择的当前收货地址Cookie
      mBusiCookie.getBuyerSelReceiAddrRegionCookie(res => {
        console.log(res);
        //{BReceiAddrID: "120051", RegionCodeArr: "430000_430300_430321", RegionNameArr: "湖南省_湘潭市_湘潭县"}
        var _buyerSelReceiAddrRegion = res;
        var _regionProCode = "";
        if (_buyerSelReceiAddrRegion.RegionCodeArr != "" && _buyerSelReceiAddrRegion.RegionCodeArr != undefined && _buyerSelReceiAddrRegion.RegionCodeArr != null) {
          _regionProCode = _buyerSelReceiAddrRegion.RegionCodeArr.split("_")[0];
        }

        //构造POST参数
        var _dataPOST = {
          "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
          "Type": "2",
          "GoodsID": _orderGoodsMsg.GoodsID,
          "orderNumCurrent": _orderGoodsMsg.OrderNum,
          "SpecID": _orderGoodsMsg.SpecID,
          "RegionProCode": _regionProCode,
        };

        //正式发送Http请求
        mHttp.postHttp(app.apiURLData.orderApi_PlaceOrder, _dataPOST, _jsonReTxt => {
          console.log(_jsonReTxt);
          if (_jsonReTxt == "") {
            return;
          }

          //------全局变量赋值-------//
          this.setData({
            goodsID: _jsonReTxt.ModelGooGoodsMsg.GoodsID,
            orderNumCurrent: _orderGoodsMsg.OrderNum,
            shopUserId: _jsonReTxt.ModelGooGoodsMsg.ShopUserID,
          });

          //计算当前商品的价格，是规格的呢还是本身的 ,不包括折扣
          var _currentGoodsPriceNoDicount = _jsonReTxt.ModelGooGoodsMsg.GoodsPrice;

          //如果有规格属性
          if (_jsonReTxt.GooSpecParam != undefined) {
            if (_jsonReTxt.GooSpecParam.GoodsPrice > 0 && _jsonReTxt.GooSpecParam.GoodsPrice != null && _jsonReTxt.GooSpecParam.GoodsPrice != undefined && _jsonReTxt.GooSpecParam.GoodsPrice != "") {
              _currentGoodsPriceNoDicount = _jsonReTxt.GooSpecParam.GoodsPrice;
            }
          }

          //计算当前显示的商品价格, 先计算打折的
          var _goodPriceShow = 0;
          if (_jsonReTxt.ModelGooGoodsMsg.Discount > 0) {
            _goodPriceShow = this.showDiscountGoodsPrice(_currentGoodsPriceNoDicount, _jsonReTxt.ModelGooGoodsMsg.Discount);
          }
          //计算秒杀的折扣
          if (_jsonReTxt.SecKillMsg.SkDiscount > 0 && _jsonReTxt.SecKillMsg.SkDiscount != null && _jsonReTxt.SecKillMsg.SkDiscount != undefined && _jsonReTxt.SecKillMsg.SkDiscount != "") {
            _goodPriceShow = this.showDiscountGoodsPrice(_currentGoodsPriceNoDicount, _jsonReTxt.SecKillMsg.SkDiscount);

            //初始化限时秒杀Bar
            this.initSecKillBar(_jsonReTxt.SecKillMsg);
          }

          //计算拼团的折扣
          if (this.data.isGroup == "true") {
            //初始化拼团商品设置信息
            this.initGroupGoodsSetting(() => {

              _goodPriceShow = this.showDiscountGoodsPrice(_currentGoodsPriceNoDicount, this.data.initGroupGoodsSetting_Data.GroupDiscount);
              //-----全局变量赋值-----//
              this.setData({
                goodPriceShow: _goodPriceShow,
              });

            });
          }


          //------------数据赋值---------//
          this.setData({
            initOrderGoodsMsg_Data: _jsonReTxt,
            shopId: _jsonReTxt.ModelShopMsg.ShopID,
            currentGoodsPriceNoDicount: _currentGoodsPriceNoDicount,
            goodPriceShow: _goodPriceShow,
          });

          //-----------调用相关函数-----------//
          if (_jsonReTxt.ModelGooGoodsMsg.IsShopExpense == "both" || _jsonReTxt.ModelGooGoodsMsg.IsShopExpense == "false") {
            //初始化买家收货地址
            this.initBuyerReceiAddr();
          }
          if (_jsonReTxt.ModelGooGoodsMsg.IsShopExpense == "both" || _jsonReTxt.ModelGooGoodsMsg.IsShopExpense == "true") { //到店消费自取
            //加载店铺地址和位置信息
            this.initShopAddrNav();
          }

          //预加载订单发票信息
          this.preLoadInvoiceMsg();

          //初始化默认使用的优惠券
          this.initUseCouponsDefault();

          //配送方式（送货上门 express  到店消费自取 shop）
          var _expressType = "express";
          if (_jsonReTxt.ModelGooGoodsMsg.IsShopExpense == "true") {
            _expressType = "shop";
          }

          //计算运费
          //console.log("_jsonReTxt.FreightTemplateParam.FreightMoney=" + _jsonReTxt.FreightTemplateParam.FreightMoney);
          if (_jsonReTxt.FreightTemplateParam.FreightMoney > 0) {

            this.countFreight(_jsonReTxt.FreightTemplateParam.FreightMoney, _jsonReTxt.FreightTemplateParam.AddPieceMoney);
          }

          //---全局变量赋值----//
          this.setData({
            expressType: _expressType,
          });

        });


      });

    });
  },
  /**
   * 初始化买家收货地址
   */
  initBuyerReceiAddr: function () {

    //得到选择的收货地址
    mBusiCookie.getBuyerSelReceiAddrRegionCookie(res => {
      //{BReceiAddrID: "120051", RegionCodeArr: "430000_430300_430321", RegionNameArr: "湖南省_湘潭市_湘潭县"}
      console.log(res);
      var _BReceiAddrID = "0";
      if (res.BReceiAddrID != "" && res.BReceiAddrID != undefined && res.BReceiAddrID != null) {
        _BReceiAddrID = res.BReceiAddrID;
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

        //--------设置公共变量-------//
        this.setData({
          initBuyerReceiAddr_Data: _jsonReTxt,
          bReceiAddrIDSel: _jsonReTxt.BReceiAddrID,
        });

      });


    });

  },
  /**
   * 加载店铺地址和位置信息
   */
  initShopAddrNav: function () {

    if (this.data.shopId <= 0) {
      return;
    }

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
      "ShopID": this.data.shopId,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.shopApi_ShopMsg, _dataPOST, _jsonReTxt => {
      console.log(_jsonReTxt);
      if (_jsonReTxt == "") {
        return;
      }

      //--------设置公共变量-------//
      this.setData({
        initShopAddrNav_Data: _jsonReTxt,
      });

    });




  },
  /**
   * 显示打折后的商品价格
   * @param {any} pGoodsPriceLow 商品规格最低价
   * @param {any} pDiscount 折扣
   */
  showDiscountGoodsPrice: function (pGoodsPriceLow, pDiscount) {

    if (pDiscount != "0") {
      var _goodsPriceLow = parseFloat(pGoodsPriceLow) * (parseFloat(pDiscount) * 0.1);
      return mUtils.formatNumberDotDigit(_goodsPriceLow, 2);
    }

    return mUtils.formatNumberDotDigit(pGoodsPriceLow, 2);

  },
  /**
   * 初始化拼团商品设置信息
   */
  initGroupGoodsSetting: function (pCallBack) {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "1",
      "GoodsID": this.data.goodsID,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.groupApi_GroupGoodsSetting, _dataPOST, _jsonReTxt => {
      console.log(_jsonReTxt);
      if (_jsonReTxt == "") {
        return;
      }

      //--------设置公共变量-------//
      this.setData({
        initGroupGoodsSetting_Data: _jsonReTxt,
      });

      //回调函数
      pCallBack();

    });



  },
  /**
   * 切换 /配送方式（送货上门 express  到店消费自取 shop ）
   * @param {*} e 
   */
  chgExpressType(e) {
    var _expressType = e.currentTarget.dataset.expressType;
    console.log("_expressType=" + _expressType);

    var _sumFreight = "0";
    if (_expressType == "express") {
      _sumFreight = this.data.sumFreightPre;
    }

    //设置公共变量
    this.setData({
      expressType: _expressType,
      sumFreight: _sumFreight,
    });

    //重新计算运费
    this.countFreight(this.data.initOrderGoodsMsg_Data.FreightTemplateParam.FreightMoney, this.data.initOrderGoodsMsg_Data.FreightTemplateParam.AddPieceMoney);
    //重新计算订单总额
    this.sumOrderPrice();

  },
  /**
   * 计算运费
   */
  countFreight: function (pFreightMoney, pAddPieceMoney) {

    //console.log("pFreightMoney=" + pFreightMoney + " | pAddPieceMoney=" + pAddPieceMoney);

    //获取当前订购数量
    var OrderNum = parseInt(this.data.orderNumCurrent);

    var sumFreight = 0;

    if (this.data.expressType == "express") {
      if (OrderNum <= 1) {
        sumFreight = pFreightMoney;
      } else {
        if (pAddPieceMoney < 0) {
          pAddPieceMoney = 0;
        }
        sumFreight = pFreightMoney + (pAddPieceMoney * (OrderNum - 1));
      }
    } else {
      sumFreight = 0;
    }

    //return mUtils.formatNumberDotDigit(sumFreight);
    //设置全局变量
    this.setData({
      sumFreight: mUtils.formatNumberDotDigit(sumFreight),
      sumFreightPre: mUtils.formatNumberDotDigit(sumFreight),
    });

  },
  /**
   * 统计订单总额
   */
  sumOrderPrice: function () {
    //计算当前订购数量与单价的小计金额
    var _sumGoodsPrice = parseFloat(this.data.goodPriceShow) * parseInt(this.data.orderNumCurrent);
    console.log("_sumGoodsPrice=" + _sumGoodsPrice);

    var _sumOrderPrice = _sumGoodsPrice;
    //---加上运费----//
    console.log("this.data.expressType=" + this.data.expressType + " | this.data.sumFreight=" + this.data.sumFreight);
    if (parseFloat(this.data.sumFreight) > 0 && this.data.expressType == "express") {
      _sumOrderPrice = _sumOrderPrice + parseFloat(this.data.sumFreight);
      console.log("执行了加运费计算");
    } else {
      _sumOrderPrice = _sumOrderPrice + 0;
    }
    //----减去优惠券金额-----//
    if (parseFloat(this.data.useDiscountMoney) > 0) {
      _sumOrderPrice = _sumOrderPrice - parseFloat(this.data.useDiscountMoney);
    } else {
      _sumOrderPrice = _sumOrderPrice - 0;
    }

    if (parseFloat(_sumOrderPrice) < 0) {
      _sumOrderPrice = 0.00;
    }

    this.setData({
      sumOrderPrice: mUtils.formatNumberDotDigit(_sumOrderPrice),
    });

  },
  /**
   * 提交订单信息
   * @param pOrderMemo 订单备注[可选]
   */
  submitOrderMsg: function (pOrderMemo = "") {


    var _IssueID = this.data.issueID;
    if (parseInt(this.data.issueIDSel) > 0) {
      _IssueID = this.data.issueIDSel;
    }

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "5",
      "GoodsID": this.data.goodsID,
      "SpecID": this.data.orderSpecID,
      "OrderNum": this.data.orderNumCurrent,
      "ExpressType": this.data.expressType,
      "IssueID": _IssueID,
      "InvoiceGuid": this.data.invoiceGuid,
      "OrderMemo": pOrderMemo,
      "OrderGuid": this.data.orderGuid,
      "GroupSettingID": this.data.groupSettingID,
      "GroupID": this.data.groupID,
      "BReceiAddrID": this.data.bReceiAddrIDSel,
      "KeyEn": mKeyEn,
    };
    //加载提示
    mUtils.showLoadingWin("下单中");
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.orderApi_PlaceOrder, _dataPOST, _jsonReTxt => {
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

  //------------限时秒杀-----------------//
  /**
   * 初始化限时秒杀Bar
   * @param {*} pJsonSecKillMsg 
   */
  initSecKillBar: function (pJsonSecKillMsg) {
    //没有折扣的情况
    if (pJsonSecKillMsg.SkDiscount <= 0 || pJsonSecKillMsg.SkDiscount >= 10) {
      return;
    }

    var _secKillTypeTxt = "抢购秒杀";

    //判断是否为 限时秒杀 或一般抢购秒杀
    if (pJsonSecKillMsg.EndTime != "" && pJsonSecKillMsg.EndTime != null && pJsonSecKillMsg.EndTime != undefined) {
      _secKillTypeTxt = "限时秒杀";

      this.setData({
        countDownEndTime: pJsonSecKillMsg.EndTime,
      });

      //倒计时开始
      this.countDown();

    } else {
      _secKillTypeTxt = "抢购秒杀";
    }

    //------全局变量赋值------//
    this.setData({
      secKillTypeTxt: _secKillTypeTxt,
    });

  },
  //------------发票相关-----------------//
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
   * 预加载订单发票信息
   */
  preLoadInvoiceMsg: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "2",
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

  //-------提交表单-----//
  formSubmit: function (e) {
    console.log(e);
    var _detailVal = e.detail.value;
    var _submitType = e.detail.target.dataset.submitType;
    console.log(_submitType);
    //提交表单类别 
    if (_submitType == "invoice") //提交订单发票信息
    {
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
        //关掉窗口
        this.closeSlideBottom();
        //构造显示信息
        this.setData({
          invoiceShowTxt: _invoiceShowTxt,
        });


      });
    } else if (_submitType == "order") //提交订单
    {
      //获取表单值
      var OrderMemo = _detailVal.OrderMemo;

      //提交订单信息
      this.submitOrderMsg(OrderMemo);

    }


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


  //------------优惠券相关-----------------//

  /**
   * 初始化默认使用的优惠券
   */
  initUseCouponsDefault: function () {

    // if (parseInt(this.data.issueIDSel) > 0) {
    //   return;
    // }

    //计算当前订购数量与单价的小计金额
    var _ExpenseReachSum = parseFloat(this.data.goodPriceShow) * parseInt(this.data.orderNumCurrent);

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "4",
      "GoodsID": this.data.goodsID,
      "ExpenseReachSum": _ExpenseReachSum,
      "SpecPropID": this.data.orderSpecID,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.orderApi_PlaceOrder, _dataPOST, _jsonReTxt => {
      console.log(_jsonReTxt);
      if (_jsonReTxt == "" || _jsonReTxt.CouponsID <= 0) {
        //统计订单总额
        this.sumOrderPrice();
        return;
      }

      //-----构造优惠券显示------//
      var _useCouponsShow = "";

      if (parseFloat(_ExpenseReachSum) <= parseFloat(_jsonReTxt.UseDiscountMoney)) {
        _useCouponsShow = "没有可用优惠券";
        _jsonReTxt.CouponsID = 0;
        _jsonReTxt.IssueID = 0;
        _jsonReTxt.CouponsTitle = "";
        _jsonReTxt.UseMoney = 0;
        _jsonReTxt.UseDiscount = 0;
        _jsonReTxt.UseDiscountMoney = 0;
        _jsonReTxt.UseGoodsID = 0;
      } else {
        if (_jsonReTxt.UseMoney > 0) {
          _useCouponsShow = "抵用券减" + _jsonReTxt.UseDiscountMoney + "元";
        } else if (_jsonReTxt.UseDiscount > 0) {
          _useCouponsShow = _jsonReTxt.UseDiscount + "折券减" + _jsonReTxt.UseDiscountMoney + "元";
        }
      }


      //--------设置公共变量-------//
      this.setData({
        initUseCouponsMsgList_Data: _jsonReTxt,
        useCouponsShow: _useCouponsShow,
        useDiscountMoney: _jsonReTxt.UseDiscountMoney,
        issueID: _jsonReTxt.IssueID,
        issueIDSel: "0",
      });


      //统计订单总额
      this.sumOrderPrice();



    });


  },
  /**
   * 得到单个商品买家可使用的优惠券列表
   */
  initUseCouponsMsgList: function () {

    //计算当前订购数量与单价的小计金额
    var _ExpenseReachSum = parseFloat(this.data.goodPriceShow) * parseInt(this.data.orderNumCurrent);

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "3",
      "GoodsID": this.data.goodsID,
      "ExpenseReachSum": _ExpenseReachSum
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.orderApi_PlaceOrder, _dataPOST, _jsonReTxt => {
      console.log(_jsonReTxt);
      if (_jsonReTxt == "") {
        return;
      }

      //------格式化与赋值返回数据------//
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
    //console.log(e);
    var _issueID = e.currentTarget.dataset.issueId;
    var _useMoney = e.currentTarget.dataset.useMoney;
    var _useDiscount = e.currentTarget.dataset.useDiscount;
    var _useDiscountMoney = e.currentTarget.dataset.useDiscountMoney;

    if (parseFloat(_useDiscountMoney) <= 0 && parseFloat(_useDiscount) > 0) {
      //计算当前订购数量与单价的小计金额
      var _goodPriceShow = parseFloat(this.data.goodPriceShow);
      _useDiscountMoney = mUtils.formatNumberDotDigit(_goodPriceShow - _goodPriceShow * (parseFloat(_useDiscount) / 10)); //计算折扣券抵用金额
    }

    //-----构造优惠券显示------//
    var _useCouponsShow = "";
    if (_useMoney > 0) {
      _useCouponsShow = "抵用券减" + _useDiscountMoney + "元";
    } else if (_useDiscount > 0) {
      _useCouponsShow = _useDiscount + "折券减" + _useDiscountMoney + "元";
    }

    //设置公共用变量
    this.setData({
      useCouponsShow: _useCouponsShow,
      useDiscountMoney: _useDiscountMoney,
      issueIDSel: _issueID,
      issueID: "0",
    });
    //关闭窗口
    this.closeSlideBottom();

    //统计订单总额
    this.sumOrderPrice();

  },

  //================倒计时===============//
  addZero: function (i) {
    return i < 10 ? "0" + i : i + "";
  },
  /**
   * 倒计时器 
   */
  countDown: function () {

    clearTimeout(mCounterTimer);
    mCounterTimer = null;

    var nowtime = new Date();
    //var endtime = new Date("2020/07/03 17:57:00");
    var endtime = new Date(this.data.countDownEndTime);
    var lefttime = parseInt((endtime.getTime() - nowtime.getTime()) / 1000);
    var d = parseInt(lefttime / (24 * 60 * 60))
    var h = parseInt(lefttime / (60 * 60) % 24);
    var m = parseInt(lefttime / 60 % 60);
    var s = parseInt(lefttime % 60);
    d = this.addZero(d)
    h = this.addZero(h);
    m = this.addZero(m);
    s = this.addZero(s);

    // var myJsVal = "";
    // myJsVal += "<span>" + d + "</span>天";
    // myJsVal += "<span>" + h + "</span>:";
    // myJsVal += "<span>" + m + "</span>:";
    // myJsVal += "<span>" + s + "</span>";

    // // document.querySelector("#SecKillMid").innerHTML = `活动倒计时  ${d}天 ${h} 时 ${m} 分 ${s} 秒`;
    // document.querySelector("#SecKillMid").innerHTML = myJsVal;
    var _isOver = false; //是否结束
    if (lefttime <= 0) {
      //document.querySelector("#SecKillMid").innerHTML = "活动已结束";
      _isOver = true;
      clearTimeout(mCounterTimer);
    }

    var _countDownTimerObj = {
      "day": d,
      "hour": h,
      "minute": m,
      "second": s,
      "isOver": _isOver,
    }
    //------全局变量赋值-------//
    this.setData({
      countDownTimerObj: _countDownTimerObj,
    });

    //console.log(this.data.countDownTimerObj);

    if (_isOver == false) //没有结束
    {
      mCounterTimer = setTimeout(this.countDown, 1000);
    }
  },
  /**
   * 当订购数量直接输入数值时
   * @param {*} e 
   */
  bindInputOrderNum: function (e) {
    //console.log(e);
    var _detailVal = e.detail.value;
    _detailVal = parseInt(_detailVal);

    //-----设置全部变量值-----//
    this.setData({
      orderNumCurrent: _detailVal,
    });


  },
  /**
   * 订购数量文本框失去焦点
   * @param {*} e 
   */
  bindBlurOrderNum: function (e) {
    var _detailVal = e.detail.value;
    if (_detailVal == "" || _detailVal == undefined || _detailVal == null) {
      //-----设置全部变量值-----//
      this.setData({
        orderNumCurrent: 1,
      });
    }


    //重新计算运费
    if (this.data.initOrderGoodsMsg_Data.FreightTemplateParam.FreightMoney > 0) {
      this.countFreight(this.data.initOrderGoodsMsg_Data.FreightTemplateParam.FreightMoney, this.data.initOrderGoodsMsg_Data.FreightTemplateParam.AddPieceMoney);
    }

    //初始化默认使用的优惠券
    this.initUseCouponsDefault();

  },
  /**
   * 增减订购数量
   * @param {} e 
   */
  addReduceOrderNum: function (e) {
    var _dataset = e.currentTarget.dataset;
    //console.log(_dataset);
    var _exeType = _dataset.exeType //操作类型 add / reduce

    //当前订购数量
    var _orderNumCurrent = this.data.orderNumCurrent;
    if (_exeType == "add") {
      _orderNumCurrent++;
    } else if (_exeType == "reduce") {
      if (_orderNumCurrent <= 1) {
        _orderNumCurrent = 1;
      } else {
        _orderNumCurrent--;
      }
    }
    //-----设置全部变量值-----//
    this.setData({
      orderNumCurrent: _orderNumCurrent,
    });

    //重新计算运费
    if (this.data.initOrderGoodsMsg_Data.FreightTemplateParam.FreightMoney > 0) {
      this.countFreight(this.data.initOrderGoodsMsg_Data.FreightTemplateParam.FreightMoney, this.data.initOrderGoodsMsg_Data.FreightTemplateParam.AddPieceMoney);
    }

    //初始化默认使用的优惠券
    this.initUseCouponsDefault();

  },
  //===================== 底部滑出的自定义窗口===========================//
  /**
   * 显示底部滑出窗口
   */
  openSlideBottom: function () {
    this.setData({
      isDisplaySlide: "normal", //是否显示窗口
    });
  },
  /**
   * 显示底部滑出窗口 - 优惠券窗口
   */
  openSlideBottomCoupons: function () {
    this.setData({
      isDisplaySlideCoupons: "normal", //是否显示窗口
    });

    //得到单个商品买家可使用的优惠券列表
    this.initUseCouponsMsgList();

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
      mUtils.redirectToURL("../../../pages/buyer/orderdetail/orderdetail?OID=" + this.data.orderID);
    }

    this.setData({
      isDisplaySlide: "none", //是否显示窗口
      isDisplaySlideCoupons: "none", //是否显示窗口
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