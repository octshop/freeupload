// pages/buyer/banktransfer/banktransfer.js
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiLogin = require('../../../busicode/busilogin.js');

//---------公共变量--------//
var mUploadGuid = mUtils.getNewGuid();

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
    //----------自定义变量----------//
    billNumber: "0", //交易号
    orderIDArr: [], //订单ID数组对象
    //----------转账付款支付信息 ----------//
    initPayTransBankMsg_Data: null, //初始化转账付款支付信息
    //----------上传图片 ----------//
    uploadGuid: "", //上传图片的GUID
    outUploadImgPath: "", //上传输出的图片URL
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

    //-------获取传递的参数-------//
    var _billNumber = options.BN;
    this.setData({
      billNumber: _billNumber,
    })

    //----判断用户是否登录 没有登录 则跳转到指定URL 并设置UserID,LoginSha1-----//
    mBusiLogin.isLoginUserNavigateSetUserIDPwdSha1Global(res => {
      //console.log(res)
      //------登录成功后的调用函数-------//
      //初始化转账付款支付信息
      this.initPayTransBankMsg();


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
  //=========================自定义函数=========================//
  /**
   * 初始化转账付款支付信息 [订单信息,平台转账银行信息,买家之前的转账汇款信息,]
   */
  initPayTransBankMsg: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
      "BillNumber": this.data.billNumber,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.payApi_BankTransfer, _dataPOST, _jsonReTxt => {
      console.log(_jsonReTxt);
      if (_jsonReTxt == "") {
        return;
      }

      var _orderIDArr = mUtils.splitStringJoinChar(_jsonReTxt.OrderMsg.OrderIDArr, "^");

      if (_jsonReTxt.InitPayTransRecord.UploadGuid != "" && _jsonReTxt.InitPayTransRecord.UploadGuid != null) {
        mUploadGuid = _jsonReTxt.InitPayTransRecord.UploadGuid;
        this.setData({
          uploadGuid: _jsonReTxt.InitPayTransRecord.UploadGuid,
        });
      }
      if (_jsonReTxt.InitPayTransRecord.TransCertImg != "" && _jsonReTxt.InitPayTransRecord.TransCertImg != null) {
        this.setData({
          outUploadImgPath: _jsonReTxt.InitPayTransRecord.TransCertImg,
        });
      }

      //新的上传订单
      if (_jsonReTxt.InitPayTransRecord.BillNumber != _jsonReTxt.OrderMsg.BillNumber) {
        this.setData({
          outUploadImgPath: "",
          uploadGuid: "",
        });
        mUploadGuid = mUtils.getNewGuid();
      }

      //--------设置公共变量-------//
      this.setData({
        initPayTransBankMsg_Data: _jsonReTxt,
        orderIDArr: _orderIDArr,
      });

    });

  },
  /**
   * 提交买家汇款信息
   */
  submitPayTransRecord: function (e) {
    console.log(e);
    var _detailVal = e.detail.value;
    var BuyerBankName = _detailVal.BuyerBankName;
    var BuyerBankAcc = _detailVal.BuyerBankAcc;
    var BankName = _detailVal.BankName;

    if (BuyerBankName == "" || BuyerBankAcc == "" || BankName == "") {
      mUtils.showToast("汇款账户名,汇款银行账号,汇款银行名称都不能为空！");
      return;
    }

    if (this.data.uploadGuid == "" || this.data.outUploadImgPath == "") {
      mUtils.showToast("请上传汇款凭证！");
      return;
    }

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "4",
      "BillNumber": this.data.billNumber,
      "BuyerBankName": BuyerBankName,
      "BuyerBankAcc": BuyerBankAcc,
      "BankName": BankName,
      "TotalOrderPrice": this.data.initPayTransBankMsg_Data.OrderMsg.TotalOrderPrice,
      "UploadGuid": this.data.uploadGuid,
    };
    //加载提示
    mUtils.showLoadingWin("提交中");
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.payApi_BankTransfer, _dataPOST, _jsonReTxt => {
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

      //保存成功
      if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
        //如果只有一个订单则跳转订单详情,否则跳转到我的订购
        if (_jsonReTxt.DataDic.OrderIDArr.indexOf("^") >= 0) {
          //window.location.href = "../Buyer/MyOrder";
          mUtils.redirectToURL("../../../pages/buyer/myorder/myorder");
        } else {
          mUtils.redirectToURL("../../../pages/buyer/orderdetail/orderdetail?OID=" + _jsonReTxt.DataDic.OrderIDArr);
        }
        return;
      }

    });


  },

  //==================上传图片===================//
  /**
   * 选择上传图片
   */
  btnUploadImg: function () {

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
        this.uploadLandImg(tempFilePaths[0], this.uploadImgCallBack);

      },
    })
  },
  /**
   * ------------上传照片----------
   */
  uploadLandImg: function (pTempFilePath, callback) {

    //显示加载
    mUtils.showLoadingWin("上传中");

    //---- 正式上传图片----//
    wx.uploadFile({
      url: app.apiURLData.payApi_BankTransfer, //上传接口
      filePath: pTempFilePath,
      name: 'file',
      formData: {
        "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
        "Type": "2",
        "UploadGuid": mUploadGuid,
      },
      success: function (res) {
        var data = res.data

        console.log("上传成功后:" + data);
        //移除加载提示
        mUtils.hideLoadingWin();

        callback(data);

      }
    });
  },
  /**
   * -------上传图片的回调函数-------
   */
  uploadImgCallBack: function (_reTxt) {

    var _jsonReTxt = JSON.parse(_reTxt);


    //------其他业务逻辑操作------//
    //提交买家转账凭证照片信息
    this.submitTransCertImg(_jsonReTxt.DataDic.ImgPathDomain, _jsonReTxt.DataDic.ImgKeyGuid);

    //设置公共变量
    this.setData({
      outUploadImgPath: _jsonReTxt.DataDic.ImgPathDomain, //上传的图片
      uploadGuid: _jsonReTxt.DataDic.ImgKeyGuid, //上传GUID
    });


  },
  /**
   *  提交买家转账凭证照片信息
   * @param {any} pTransCertImg 图片URL ( localhost:1400/Upload/ShopHeaderImg/SHI_1_201906160924530250.jpg )
   * @param {any} pUploadGuid 上传GUID
   */
  submitTransCertImg: function (pTransCertImg, pUploadGuid) {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "3",
      "ImgPath": pTransCertImg,
      "UploadGuid": pUploadGuid,
      "BillNumber": this.data.billNumber,
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.payApi_BankTransfer, _dataPOST, _jsonReTxt => {
      console.log(_jsonReTxt);
      if (_jsonReTxt == "") {
        return;
      }

    });

  },
  //==================公共函数===================//

  /**
   *打开预览图片窗口
   * @param {} e 
   */
  previewImgShow: function (e) {
    console.log(e);

    //得到项目的协议头名称
    var _httpName = mUtils.getHttpProtocolURL(app.globalData.apiWebDoamin);

    var _ImgUrl = new Array(_httpName + e.currentTarget.dataset.imgUrl);
    var _curIndex = "0"; //e.currentTarget.dataset.curIndex;

    mUtils.previewImg(_ImgUrl, _curIndex);
  },



})