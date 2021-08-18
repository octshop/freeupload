//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mLogin = require('../../../utils/wxloginuserinfo.js');
var mUtils = require('../../../utils/util');
var mDecryptData = require('../../../utils/decryptdatautil.js');
var mEncryption = require('../../../utils/encryptionclass.js');
var mBusiLogin = require('../../../busicode/busilogin.js');
var mBusiLocation = require('../../../busicode/busilocation.js');
var mBusiRegion = require('../../../busicode/busiregion.js');


//-----初始化公共Js-----//
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    apiWebDoamin: app.globalData.apiWebDoamin, //小程序Api的网站域名
    navbarData: {
      gobank: true,
      gohome: true,
      has_search: false,
    },

    //----------底部滑出的自定义窗口---------------//
    isDisplaySlide: "none", //是否显示窗口 normal ,none
    slideBottomWinHeight: 400, //窗口高度
    //---------需要预览的图片URL数组---------------//
    imgUrlArr: [
      'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2983603240,1347526268&fm=26&gp=0.jpg',
      'https://pic.90tu.com/d/file/update/201410/07/baxea3h1y1z07.jpg',
      'https://pic.90tu.com/d/file/update/201410/07/qekyke1cinr07.jpg'
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log("apiWebDoamin=" + this.data.apiWebDoamin);

    // console.log(this.data.slideBottomWinHeight);

    // //加载小程序省市二级联动json数据，并返回数组对象
    // mBusiRegion.loadWxMiniRegionCodeProvinceCityData(function (outMultiIndex, outMultiArray, outObjectMultiArray) {
    //   console.log(outMultiIndex);
    //   console.log(outMultiArray);
    //   console.log(outObjectMultiArray);
    // });

    // var multiArray = [
    //   ['北京', '安徽', "福建", "甘肃", "广东"],
    //   ['北京']
    // ]
    // multiArray[1][1] = "长沙"; 
    // mUtils.logOut(multiArray[1][1]);


    //-------定位测试-----//
    // mBusiLocation.getSaveUserLoctaion(res => {
    //   //console.log(res);
    // });

    //----直接简单的获取 微信用户信息UserInfo-------//
    // mLogin.getWxUserInfoSimple(res => {
    //   console.log(res);
    //   if (res == "") {
    //     console.log("获取用户信息失败！ -- 未授权 -- ");
    //   } else {
    //     console.log("获取用户信息成功！");
    //   }
    // });

    // //SHA1加密
    // var SHA1Content = mEncryption.getSHA1("111111");
    // console.log(SHA1Content);

    // //RSA加密
    // var RSAContent = mEncryption.rsaEncryptSection("111111");
    // console.log("RSA加密=" + RSAContent);
    // //解密RSA内容
    // var DeRSAContent = mEncryption.rsaDecryptSection(RSAContent);
    // console.log("RSA解密" + DeRSAContent);

    //-----测试登录信息------//
    //设置登录
    //mBusiLogin.setLoginCookieSHA1("10009", "3d4f2bf07dc1be38b20cd6e46949a1071f9d0e3d");

    //清除登录 
    //mBusiLogin.clearLoginCookie();

    //得到登录信息
    // mBusiLogin.getLoginCookieAsyn(res => {
    //   console.log(res);
    // });

    // //----判断是否登录 异步----//
    // mBusiLogin.isLoginUserNavigate(res => {
    //   console.log(res);

    // }, true);

    //http 远程验证用户登录是否正确
    // mBusiLogin.httpIsCheckUserLogin(res=>{
    //   console.log(res);
    // });



  },
  controlBtn: function () {
    //调用自定义组件
    this.btn1 = this.selectComponent("#btn1"); //获取组件对象
    this.btn1.chgButtonTxt(false, '另一个按钮控制我'); // //调用组件中的方法
  },
  back: function () //回退函数
  {
    //back
    //  console.log("回退返回的参数=" +backData.detail.back);
    //回退
    wx.navigateBack({
      delta: 1
    })
  },
  home: function () //回退函数
  {
    //跳转到首页
    // wx.navigateTo({
    //   url: '../../tabbar/buyerindex/buyerindex',
    // })
    // wx.redirectTo({
    //   url: '../../tabbar/buyerindex/buyerindex',
    // })
    wx.switchTab({
      url: '../../tabbar/index/index',
    })

  },
  /**
   * 打开地图导航
   */
  openMap: function () {
    //这里是执行定位
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        console.log(res);
        // success
        //直接打开微信内置地图插件
        wx.openLocation({
          latitude: res.latitude, // 纬度，范围为-90~90，负数表示南纬
          longitude: res.longitude, // 经度，范围为-180~180，负数表示西经
          // scale: 28, // 缩放比例
          name: "店铺名称",
          address: "店铺地址呀店铺地址呀"
        })
      }
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
   * 隐藏底部滑出窗口
   */
  closeSlideBottom: function () {
    this.setData({
      isDisplaySlide: "none", //是否显示窗口
    });
  },
  //=====================l图片预览函数====================//
  previewImg: function () {
    //图片预览
    wx.previewImage({
      current: this.data.imgUrlArr[0], // 当前显示图片的http链接
      urls: this.data.imgUrlArr // 需要预览的图片http链接列表
    })
  },
  //=====================Http签名测试====================//
  testSignHttp() {

    //POST参建
    var dataPOST = {
      SignKey: mHttp.signKeyRsa("20048", "d1c03391e43b8c86b404d009886acb40c14e617f"), //mHttp.signKeyRsa("10003321","3d4f2bf07dc1be38b20cd6e46949a1071f9d0e3d"),
      Type: '1',
    };
    console.log(dataPOST);

    mHttp.postHttp(app.apiURLData.shopApi_Index, dataPOST, res => {

      console.log("Http返回：" + res);

    });

    // mHttp.postHttp(app.globalData.apiWebDoamin + "/ShopApi/Index", dataPOST, res => {

    //   console.log("Http返回：" + res);

    // });
  },
  /**
   * 得到小程序登录 信息 -登录并得到 openid,unionid,session_key
   */
  getLoginWxMiniMsg: function () {
    mLogin.wxLoginGetMsg(res => {

      console.log("得到小程序登录信息=" + JSON.stringify(res));


    });
  },
  /**
   * 得到登录用户的个人信息
   */
  getLoginWxUserInfo: function (e) {
    console.log(e);


    // mLogin.getWxUserInfo(res => {

    //   console.log("得到登录用户的个人信息=" + JSON.stringify(res));

    //   // {"nickName":"IT独孤键客😇","avatarUrl":"https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIbWFEIJj8IpLx2lWWp8KpAicibFWbeFD8bv8BYLuSo8adUfLKCSRmlPrprvzmWgNU2sibDVVDTv5k0A/132","gender":1,"province":"Hunan","city":"Changsha","country":"China"}

    // });
  },
  /**
   * 得到登录用户手机号
   * @param {*} e 
   */
  getPhoneNumber: function (e) {

    mLogin.wxLoginGetMsg(res => {

      console.log("得到小程序登录信息=" + JSON.stringify(res));

      var _sesstionKey = res.data.session_key;

      console.log(e);
      var _encrypteData = e.detail.encryptedData;
      var _iv = e.detail.iv;

      console.log("_sesstionKey=" + _sesstionKey + " | _encrypteData=" + _encrypteData + " | _iv=" + _iv);

      var _loginMobile = mDecryptData.decryptDataContent(_encrypteData, _sesstionKey, _iv);
      console.log(_loginMobile);

    });

  },


  
})