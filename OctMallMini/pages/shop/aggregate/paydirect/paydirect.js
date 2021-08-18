// pages/shop//aggregate/paydirect/paydirect.js
//==============引入相关的Js文件========//
var mHttp = require('../../../../utils/http.js');
var mUtils = require('../../../../utils/util.js');
var mBusiLogin = require('../../../../busicode/busilogin.js');


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
    shopId: "", //店铺ID
    shopUserId: "", //商家UserID
    orderPrice: 0, //支付金额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //---得到navBar的高度----//
    var _navbarHeight = this.selectComponent("#NavBar").getNavBarHeight();
    this.setData({
      navbarHeight: _navbarHeight,
      octContentMarginTop: _navbarHeight
    });

    //获取传递的参数
    var _shopId = options.SID;
    if (_shopId == "" || _shopId == undefined) {
      mUtils.switchTabURL("../../../../pages/tabbar/index/index");
      return;
    }
    this.setData({
      shopId: _shopId,
    });

    //-----------自定义方法--------//

    //加载店铺简单信息
    this.loadShopMsgSimple();

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
   * 第二个按钮
   */
  home: function () {
    wx.navigateTo({
      url: '../../../../pages/shop/index/index?SID=' + this.data.shopId,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //===================自定义方法===================//

  /**
   * 加载店铺简单信息
   */
  loadShopMsgSimple: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "1",
      "ShopID": this.data.shopId,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.aggregateApi_Index, _dataPOST, res => {

      //设置其他数据
      this.setData({
        shopUserId: res.UserID,
      });

      //----设置公共变量 ----//
      this.setData({
        loadShopMsgSimple_Data: res,
      });

    });

  },


  /**
   * 立即提交支付
   */
  payAggregateOrder: function () {

    if (this.data.shopUserId == "" || this.data.shopUserId == undefined) {
      return;
    }

    if (this.data.orderPrice <= 0 || isNaN(this.data.orderPrice)) {
      mUtils.showToast("支付金额必须是数字且大于零！");
      return;
    }


    mUtils.confirmWin("确认支付？", res => {
      if (res == "Ok") {


        //构造POST参数
        var _dataPOST = {
          "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
          "Type": "1",
          "OrderPrice": this.data.orderPrice,
          "ShopUserID": this.data.shopUserId,
          "PayWay": "WeiXinPay",
        };
        //加载提示
        mUtils.showLoadingWin("支付中");
        //正式发送Http请求
        mHttp.postHttp(app.apiURLData.aggregateApi_PayDirect, _dataPOST, _jsonReTxt => {
          //移除加载提示
          mUtils.hideLoadingWin();

          if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
            mUtils.showToast(_jsonReTxt.ErrMsg);
            return;
          }
          if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {

            if (_jsonReTxt.DataDic.WxPay_IsSimulatePay == "是") {

              mUtils.confirmWin("为了测试方便，系统开启了模拟支付，是否模拟支付？（如需体验正式的 微信支付 ，请联系客服给以配置。）", (res) => {
                if (res == "Ok") {
                  //微信模拟支付
                  this.payWeiXinSimulate(_jsonReTxt.DataDic.AggregateBillNumber);
                }
              });

            } else {
              //微信小程序支付 - 买单聚合支付
              this.payWeiXinAggregate(_jsonReTxt.DataDic.AggregateBillNumber);
            }
            return;
          }


        });


      }
    });

  },


  /**
   * 微信小程序支付 - 买单聚合支付
   */
  payWeiXinAggregate: function (pBillNumber) {

    if (pBillNumber == "" || pBillNumber == null) {
      return;
    }

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "5",
      "WxOpenID": app.globalData.buyerMiniOpenID,
      "BillNumber": pBillNumber,
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
          //跳转到支付页
          mUtils.redirectToURL("../../../../pages/shop/aggregate/paydirect/paydirect?SID=" + this.data.shopId);
          //this.onLoad();
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
          mUtils.redirectToURL("../../../../pages/buyer/paysunoorder/paysunoorder");

        },
        fail(res) {
          console.log(res);
          //跳转到支付页
          mUtils.redirectToURL("../../../../pages/shop/aggregate/paydirect/paydirect?SID=" + this.data.shopId);
        }
      });



    });

  },




  /**
   * 微信模拟支付
   */
  payWeiXinSimulate: function (pBillNumber) {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "2",
      "PayWay": "WeiXinPay",
      "BillNumber": pBillNumber,
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
          //跳转到支付页
          mUtils.redirectToURL("../../../../pages/shop/aggregate/paydirect/paydirect?SID=" + this.data.shopId);
        });
        return;
      }
      //成功提示
      if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
        mUtils.showToastCb(_jsonReTxt.Msg, () => {
          //跳转到支付成功页
          mUtils.redirectToURL("../../../../pages/buyer/paysunoorder/paysunoorder");
        });
        return;
      }

    });

  },


  /**
   * 监听支付金额值
   * @param {*} e 
   */
  bindInputOrderPrice(e) {
    var _detailVal = e.detail.value;
    this.setData({
      orderPrice: _detailVal,
    });
  },




  //===================公共函数===================//

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



})