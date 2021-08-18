// pages/buyer//appraiseform/appraiseform.js
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
    //-----------------自定义变量-------------//
    orderId: "", //订单ID
    initOrderGoodsMsg_Data: null, //初始化订单商品信息
    initAppraiseShopIntegralSetting_Data: null, //初始化商品评价晒单的返积分信息
    goodsIDArr: "", //商品ID拼接字符串 "^"
    jsonAppraieList: null, //用户评价的Json数据
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

    //----------获取传递的参数-----------//
    var _orderId = options.OID;
    if (_orderId == undefined || _orderId == null) {
      _orderId = "";
    }
    this.setData({
      orderId: _orderId,
    });

    //判断用户是否登录 没有登录 则跳转到指定URL 并设置UserID,LoginSha1
    mBusiLogin.isLoginUserNavigateSetUserIDPwdSha1Global(res => {
      //console.log(res)
      //------登录成功后的调用函数-------//

      //初始化订单商品信息
      this.initOrderGoodsMsg();

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //===================自定义函数=========================//

  /**
   * 初始化订单商品信息
   */
  initOrderGoodsMsg: function () {

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
      "OrderID": this.data.orderId,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.buyerApi_AppraiseForm, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }

      //如果不处于“待评价”状态，跳转到订单详情页
      if (_jsonReTxt.OrderStatus != "待评价") {
        //跳转到订单详情
        mUtils.redirectToURL("../../../pages/buyer/orderdetail/orderdetail?OID=" + this.data.orderId);
        return;
      }

      //-----构造相关数据-----//
      var _goodsIDArr = ""; //商品拼接字符串

      var _jsonAppraieList = "{"; //用户评价的Json数据
      _jsonAppraieList += "\"OrderID\":\"" + this.data.orderId + "\",";
      _jsonAppraieList += "\"BuyerUserID\":\"" + _jsonReTxt.BuyerUserID + "\",";
      _jsonAppraieList += "\"ShopUserID\":\"" + _jsonReTxt.ShopUserID + "\",";
      _jsonAppraieList += "\"AppraiseGoodsArr\":[";

      for (var i = 0; i < _jsonReTxt.OrderGoodsList.length; i++) {

        var _orderGoods = _jsonReTxt.OrderGoodsList[i];
        //商品ID拼接
        _goodsIDArr += _jsonReTxt.OrderGoodsList[i].GoodsID + "^";

        //用户评价的Json数据
        _jsonAppraieList += "{";
        _jsonAppraieList += "\"IsShow\":\"false\",";
        _jsonAppraieList += "\"GoodsID\":\"" + _orderGoods.GoodsID + "\",";
        _jsonAppraieList += "\"SpecParamVal\":\"" + _orderGoods.SpecParamVal + "\",";
        _jsonAppraieList += "\"AppraiseScore\":4,";
        _jsonAppraieList += "\"IsAnonymity\":\"false\",";
        _jsonAppraieList += "\"AppraiseContent\":\"\",";
        _jsonAppraieList += "\"UploadGuid\":\"" + mUtils.getNewGuid() + "\",";
        //构造晒单图片列表
        _jsonAppraieList += "\"AppraiseImgs\":[";
        _jsonAppraieList += "]},"
      }
      _goodsIDArr = mUtils.removeFrontAndBackChar(_goodsIDArr, "^");
      //用户评价的Json数据
      _jsonAppraieList = mUtils.removeFrontAndBackChar(_jsonAppraieList, ",");
      _jsonAppraieList += "],";
      _jsonAppraieList += "\"ShopAppraise\":{"
      _jsonAppraieList += "\"ConformityScore\":5,";
      _jsonAppraieList += "\"AttitudeScore\":5,";
      _jsonAppraieList += "\"ExpressScore\":5,";
      _jsonAppraieList += "\"DeliverymanScore\":5";
      _jsonAppraieList += "}}";

      this.setData({
        initOrderGoodsMsg_Data: _jsonReTxt,
        goodsIDArr: _goodsIDArr,
        jsonAppraieList: JSON.parse(_jsonAppraieList),
      });
      mUtils.logOut(_jsonAppraieList);

      //初始化商品评价晒单的返积分信息
      this.initAppraiseShopIntegralSetting();

    });

  },

  /**
   * 初始化商品评价晒单的返积分信息
   */
  initAppraiseShopIntegralSetting: function () {

    if (this.data.goodsIDArr == "" || this.data.goodsIDArr == null) {
      return;
    }

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "3",
      "GoodsIDArr": this.data.goodsIDArr,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.buyerApi_AppraiseForm, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }

      this.setData({
        initAppraiseShopIntegralSetting_Data: _jsonReTxt,
      });

    });

  },

  /**
   * 切换评价表单的显示
   * @param {*} e 
   */
  tglFormShow: function (e) {
    var _index = e.currentTarget.dataset.index;

    var _jsonAppraieList = this.data.jsonAppraieList;
    //设置值
    if (_jsonAppraieList.AppraiseGoodsArr[_index].IsShow == "true") {
      _jsonAppraieList.AppraiseGoodsArr[_index].IsShow = "false";
    } else {
      _jsonAppraieList.AppraiseGoodsArr[_index].IsShow = "true";
    }

    //设置公共变量
    this.setData({
      jsonAppraieList: _jsonAppraieList,
    });
  },

  /**
   * 切换匿名评价
   * @param {*} e 
   */
  tglIsAnonymity: function (e) {
    var _index = e.currentTarget.dataset.index;
    var _jsonAppraieList = this.data.jsonAppraieList;
    //设置值
    if (_jsonAppraieList.AppraiseGoodsArr[_index].IsAnonymity == "true") {
      _jsonAppraieList.AppraiseGoodsArr[_index].IsAnonymity = "false";
    } else {
      _jsonAppraieList.AppraiseGoodsArr[_index].IsAnonymity = "true";
    }

    //设置公共变量
    this.setData({
      jsonAppraieList: _jsonAppraieList,
    });
  },

  /**
   * 星星评分
   * @param {*} e 
   */
  clickAppraiseStar: function (e) {
    var _index = e.currentTarget.dataset.index;
    var _appScore = e.currentTarget.dataset.appScore;

    var _jsonAppraieList = this.data.jsonAppraieList;
    //设置值
    _jsonAppraieList.AppraiseGoodsArr[_index].AppraiseScore = parseInt(_appScore);

    //设置公共变量
    this.setData({
      jsonAppraieList: _jsonAppraieList,
    });

  },

  /**
   * 监听评价内容输入
   * @param {*} e 
   */
  bindInputAppContent: function (e) {
    //mUtils.logOut(e);
    var _index = e.currentTarget.dataset.index;
    var _detailVal = e.detail.value;

    var _jsonAppraieList = this.data.jsonAppraieList;
    //设置值
    _jsonAppraieList.AppraiseGoodsArr[_index].AppraiseContent = _detailVal;

    //设置公共变量
    this.setData({
      jsonAppraieList: _jsonAppraieList,
    });
    //mUtils.logOut(this.data.jsonAppraieList);
  },

  /**
   * 店铺的评分
   */
  appraiseShopScore: function (e) {
    mUtils.logOut(e);
    var _itemScore = e.currentTarget.dataset.itemScore;
    var _itemIndex = e.currentTarget.dataset.itemIndex;

    //获取数据
    var _jsonAppraieList = this.data.jsonAppraieList;

    //设置值
    if (_itemIndex == 1) {
      _jsonAppraieList.ShopAppraise.ConformityScore = _itemScore;
    } else if (_itemIndex == 2) {
      _jsonAppraieList.ShopAppraise.AttitudeScore = _itemScore;
    } else if (_itemIndex == 3) {
      _jsonAppraieList.ShopAppraise.ExpressScore = _itemScore;
    } else if (_itemIndex == 4) {
      _jsonAppraieList.ShopAppraise.DeliverymanScore = _itemScore;
    }


    //设置公共变量
    this.setData({
      jsonAppraieList: _jsonAppraieList,
    });
    mUtils.logOut(JSON.stringify(_jsonAppraieList));

  },

  /**
   * 提交订单商品评价
   */
  submitAppraiseMsg: function () {

    mUtils.confirmWin("确定提交评价吗？", res => {
      if (res == "Ok") {
        //-----构造POST参数-----//
        var _dataPOST = {
          "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
          "Type": "2",
          "AppraiseJson": JSON.stringify(this.data.jsonAppraieList),
        };
        //加载提示
        mUtils.showLoadingWin("提交中");
        //正式发送Http请求
        mHttp.postHttp(app.apiURLData.buyerApi_AppraiseForm, _dataPOST, _jsonReTxt => {
          //移除加载提示
          mUtils.hideLoadingWin();
          if (_jsonReTxt == "" || _jsonReTxt == undefined) {
            return;
          }
          if (_jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != undefined) {
            mUtils.showToast(_jsonReTxt.ErrMsg);
            return;
          }
          if (_jsonReTxt.Msg != null && _jsonReTxt.Msg != "" && _jsonReTxt.Msg != undefined) {
            //跳转到订单详情
            //window.location.href = "../Buyer/AppraiseDetail?OID=" + mOrderID + "";
            mUtils.redirectToURL("../../../pages/buyer/appraisedetail/appraisedetail?OID=" + this.data.orderId);
          }

        });
      }
    });

  },

  //==================上传图片===================//
  /**
   * 选择上传图片
   */
  btnUploadImg: function (e) {
    var _index = e.currentTarget.dataset.index; //列表索引

    //弹出图片选择器，选择图片
    wx.chooseImage({
      count: 6, //默认9
      sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有\
      sourceType: ["album", "camera"], //可以指定来源是相册还是相机，默认二者都有
      success: res => {
        //返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res);
        var tempFilePaths = res.tempFilePaths;

        // this.setData({
        //   progressNum: 0,
        //   uploadCurrentNum: 0,
        //   uploadCount: tempFilePaths.length,
        //   tempFilePaths: tempFilePaths
        // });

        //-----------循环上传多张图片-----------//
        //---- 正式上传图片----//
        this.uploadLandImg(tempFilePaths[0], this.uploadImgCallBack, _index);

      },
    })
  },
  /**
   * ------------上传照片----------
   */
  uploadLandImg: function (pTempFilePath, callback, pIndex) {

    //显示加载
    mUtils.showLoadingWin("上传中");

    //---- 正式上传图片----//
    wx.uploadFile({
      url: app.apiURLData.fileUploadApi_GooAppraiseImg, //上传接口
      filePath: pTempFilePath,
      name: 'file',
      formData: {
        "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
        "Type": "1",
        "UploadGuid": this.data.jsonAppraieList.AppraiseGoodsArr[pIndex].UploadGuid,
      },
      success: function (res) {
        var data = res.data

        console.log("上传成功后:" + data);
        //移除加载提示
        mUtils.hideLoadingWin();

        callback(data, pIndex);

      }
    });
  },
  /**
   * -------上传图片的回调函数-------
   */
  uploadImgCallBack: function (_reTxt, pIndex) {

    var _jsonReTxt = JSON.parse(_reTxt);
    mUtils.logOut(_jsonReTxt);

    if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
      mUtils.showToast(_jsonReTxt.ErrMsg);
      return;
    }

    //----------其他数据操作------------//
    var _jsonAppraieList = this.data.jsonAppraieList;

    var _appraiseImgs = _jsonAppraieList.AppraiseGoodsArr[pIndex].AppraiseImgs;
    var _jsonAppraiseImg = {
      UploadGuid: _jsonAppraieList.AppraiseGoodsArr[pIndex].UploadGuid,
      ImgUrl: _jsonReTxt.DataDic.ImgPathDomain,
    };
    _appraiseImgs = _appraiseImgs.concat(_jsonAppraiseImg);
    //赋值评价晒单数组对象
    _jsonAppraieList.AppraiseGoodsArr[pIndex].AppraiseImgs = _appraiseImgs;

    //设置公共变量值
    this.setData({
      jsonAppraieList: _jsonAppraieList,
    });
    mUtils.logOut(JSON.stringify(_jsonAppraieList));


  },
  /**
   * 删除图片
   * @param {} e 
   */
  delUploadImg: function (e) {
    var _imgPath = e.currentTarget.dataset.imgPath;
    var _uploadGuid = e.currentTarget.dataset.uploadGuid;
    var _index = e.currentTarget.dataset.index;
    var _idx3 = e.currentTarget.dataset.idx3;

    //去掉图片路径的域名
    _imgPath = _imgPath.substring(_imgPath.indexOf("/") + 1);

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "3",
      "ImgKeyGuid": _uploadGuid,
      "ImgPath": _imgPath
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.fileUploadApi_GooAppraiseImg, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }

      //-----操作数据-------//
      var _jsonAppraieList = this.data.jsonAppraieList;
      var _appraiseImgs = _jsonAppraieList.AppraiseGoodsArr[_index].AppraiseImgs;
      //移除数组
      _appraiseImgs.splice(_idx3, 1);

      _jsonAppraieList.AppraiseGoodsArr[_index].AppraiseImgs = _appraiseImgs;
      //设置公共变量
      this.setData({
        jsonAppraieList: _jsonAppraieList,
      });

    });
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



})