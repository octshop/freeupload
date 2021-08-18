// pages/shop/activitydetail/activitydetail.js
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
    //-----------------自定义变量-------------//
    activityId: "0", //活动ID
    initActivityDetail_Data: null, //初始化活动详情
    activityJoinNumber: 0, //活动当前报名 
    // loginBuyerUserID: "", //买家UserID，判断是否登录 
    loginBuyerMobile: "", //登录用户的手机号
    initActivityJoinVerifyCode_Data: null, // 初始化 活动参与 验证码 --包括重新生成
    shopUserId: "", //商家UserID
    shopId: "", //店铺ID
    phoneNumber: "", //商家电话
    //-------------加载店铺信息Bar----------//
    loadShopBarMsg_Data: null, // 加载店铺信息Bar数据
    shopLabelArr: null, //店铺的标签
    //----------底部滑出的自定义窗口---------------//
    isDisplaySlide: "none", //是否显示窗口 normal ,none
    slideBottomWinHeight: 400, //窗口高度
    isDisplaySlideJoin: "none", //参与抽奖窗口
    slideBottomWinHeightJoin: 250, //参与抽奖窗口高度

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
    var _activityId = options.AID;
    this.setData({
      activityId: _activityId,
    });

    //-----------自定义方法--------//

    // 如果用户登录啦，则设置全局的  loginBuyerUserID 和 loginPwdSha1 可根据这两个参数是否为空，判断是否用户登录
    mBusiLogin.setLoginBuyerUserIDPwdSha1Global(res => {
      //用户已登录的状态
      if (res != "") {

      }

      //初始化活动详情
      this.initActivityDetail();

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
   * 进入分享
   */
  home: function () {
    wx.switchTab({
      url: '../../../pages/tabbar/index/index',
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

    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "【好友邀请你参与活动】-" + this.data.initActivityDetail_Data.ActivityMsg.AcTitle, // 默认是小程序的名称(可以写slogan等)
      path: '/pages/shop/activitydetail/activitydetail?AID=' + this.data.activityId, // 默认是当前页面，必须是以‘/’开头的完整路径
      //imgUrl: this.data.apiWebDoamin + '/Assets/Imgs/sharegroup.png', //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
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
   * 初始化活动详情
   */
  initActivityDetail: function () {

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
      "ActivityID": this.data.activityId,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.activityApi_ActivityDetail, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }

      //------------格式化数据------------//
      var _activityJoinNumber = 0;
      if (_jsonReTxt.ActivityJoin != undefined) {
        _activityJoinNumber = _jsonReTxt.ActivityJoin.length;
      }

      //时间格式化
      _jsonReTxt.ActivityMsg.StartDate = _jsonReTxt.ActivityMsg.StartDate.replace(":00", "");
      _jsonReTxt.ActivityMsg.EndDate = _jsonReTxt.ActivityMsg.EndDate.replace(":00", "");

      var _loginBuyerMobile = "";
      if (_jsonReTxt.UserMsgCurrent.BuyerMobile != "" && _jsonReTxt.UserMsgCurrent.BuyerMobile != undefined) {
        _loginBuyerMobile = _jsonReTxt.UserMsgCurrent.BuyerMobile;
      }

      //设置公共变量值
      this.setData({
        initActivityDetail_Data: _jsonReTxt,
        activityJoinNumber: _activityJoinNumber,
        shopUserId: _jsonReTxt.ActivityMsg.ShopUserID,
        shopId: _jsonReTxt.ActivityMsg.ShopID,
        phoneNumber: _jsonReTxt.ActivityMsg.AcMobile,
        loginBuyerMobile: _loginBuyerMobile,
      });

      //-----是否加载验证-------//
      if (_jsonReTxt.ActivityMsg.IsJoinCheck == 'true' && _jsonReTxt.UserMsgCurrent.UserNick != '' && _jsonReTxt.UserMsgCurrent.IsChecked != 'true') {
        //初始化 活动参与 验证码 --包括重新生成
        this.initActivityJoinVerifyCode();
      }

      //加载店铺Bar信息
      this.loadShopBarMsg();


    });


  },

  /**
   * 初始化 活动参与 验证码 --包括重新生成
   * @param {any} pIsReSet 如果存在,是否重新生成 [false / true 重新生成]
   */
  initActivityJoinVerifyCode: function (e) {
    var _isReSet = "false";
    if (e != undefined) {
      _isReSet = e.currentTarget.dataset.isReSet;
    }
    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "3",
      "ActivityID": this.data.activityId,
      "IsReSet": _isReSet,
      "ShopUserID": this.data.shopUserId,

    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.activityApi_ActivityDetail, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }
      //设置公共变量值
      this.setData({
        initActivityJoinVerifyCode_Data: _jsonReTxt,
      });

    });

  },

  /**
   * 加载店铺Bar信息
   */
  loadShopBarMsg: function () {

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "2",
      "ShopID": this.data.shopId,
      "ShopUserID": this.data.shopUserId,
      "IsLoadGoods": "true",
    };

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.shopApi_ShopMsg, _dataPOST, _jsonReTxt => {

      //----格式化数据---//
      var _shopLabelArr = mUtils.splitStringJoinChar(_jsonReTxt.ShopMsg.ShopLabelArr);
      for (var i = 0; i < _jsonReTxt.PreListGoodsMsg.length; i++) {
        if (_jsonReTxt.PreListGoodsMsg[i].GoodsTitle.length > 5) {
          _jsonReTxt.PreListGoodsMsg[i].GoodsTitle = _jsonReTxt.PreListGoodsMsg[i].GoodsTitle.substring(0, 5);
        }
      }

      //-----全局变量赋值-----//
      this.setData({
        loadShopBarMsg_Data: _jsonReTxt,
        shopLabelArr: _shopLabelArr,
      });

    });

    
  },

  /**
   * 监听参与抽奖的手机输入
   */
  bindInputJoinMobile: function (e) {
    console.log(e);
    var _buyerBindMobile = e.detail.value;
    this.setData({
      loginBuyerMobile: _buyerBindMobile,
    });
  },

  /**
   * 立即报名
   */
  addActivityJoin: function () {

    if (this.data.loginBuyerMobile == "") {
      mUtils.showToast("手机号不能为空！");
      return;
    }

    //判断手机号是否正确
    var _isCheckMobile = mUtils.checkMobileNumber(this.data.loginBuyerMobile);
    if (_isCheckMobile == false) {
      mUtils.showToast("手机号错误！");
      return;
    }

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "2",
      "ActivityID": this.data.activityId,
      "LinkMobile": this.data.loginBuyerMobile,
    };

    //加载提示
    mUtils.showLoadingWin("提交中");

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.activityApi_ActivityDetail, _dataPOST, _jsonReTxt => {
      //移除加载提示
      mUtils.hideLoadingWin();
      if (_jsonReTxt == "" || _jsonReTxt == null || _jsonReTxt == undefined) {
        return;
      }

      if (_jsonReTxt.ErrMsg != "" && _jsonReTxt.ErrMsg != null && _jsonReTxt.ErrMsg != undefined) {
        mUtils.showToast(_jsonReTxt.ErrMsg);
        return;
      }

      if (_jsonReTxt.Msg != "" && _jsonReTxt.Msg != null && _jsonReTxt.Msg != undefined) {
        mUtils.showToastCb(_jsonReTxt.Msg, () => {
          //重新加载信息
          this.initActivityDetail();
          //关闭窗口
          this.closeSlideBottom();
        });
        return;
      }

    });
  },



  //===================== 底部弹出窗口===========================//

  /**
   * 显示底部滑出窗口
   */
  openSlideBottom: function () {
    this.setData({
      isDisplaySlide: "normal", //是否显示窗口
    });
  },

  /**
   * 显示底部滑出窗口 -- 打开参与抽奖窗口
   */
  openSlideBottomJoin: function () {

    // 如果用户登录啦，则设置全局的  loginBuyerUserID 和 loginPwdSha1 可根据这两个参数是否为空，判断是否用户登录
    mBusiLogin.isLoginUserNavigate(res => {

    }, false, "../../../pages/login/bindmobile/bindmobile", "../../../pages/shop/activitydetail/activitydetail^AID~" + this.data.activityId);


    this.setData({
      isDisplaySlideJoin: "normal", //是否显示窗口
    });
  },

  /**
   * 隐藏底部滑出窗口
   */
  closeSlideBottom: function () {

    this.setData({
      isDisplaySlide: "none", //是否显示窗口
      isDisplaySlideJoin: "none", //是否显示窗口
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
   * 显示图片预览组件
   * @param {*} e 
   */
  previewImg: function (e) {
    var _dataSet = e.currentTarget.dataset;

    // console.log(this.data.initPresentMsg_Data.PresentImgs);
    // console.log(_dataSet.preIndex);

    //得到项目的协议头名称
    var _httpName = mUtils.getHttpProtocolURL(app.globalData.apiWebDoamin);

    var _presentImgs = new Array(this.data.initActivityDetail_Data.ActivityImgs.length);
    for (var i = 0; i < this.data.initActivityDetail_Data.ActivityImgs.length; i++) {
      _presentImgs[i] = _httpName + this.data.initActivityDetail_Data.ActivityImgs[i].ImgURL;
      console.log(_presentImgs[i]);
    }
    //显示预览图片
    mUtils.previewImg(_presentImgs, _dataSet.preIndex);
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

    //=====================在线客服接入==========================//

  /**
   * 构建【商家店铺】咨询进入IM在线客服系统 跳转 URL
   */
  buildBuyerGoToImSysURL_ShopWap: function () {
    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "1",
      "ShopUserID": this.data.shopUserId,
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
        mUtils.makePhoneCall(this.data.loadShopBarMsg_Data.ShopMsg.ShopMobile);
      }

    });
  },



})