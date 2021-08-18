//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiLogin = require('../../../busicode/busilogin.js');
var mBusiLocation = require('../../../busicode/busilocation.js');
var mBusiRegion = require('../../../busicode/busiregion.js');
var mBusiCookie = require('../../../busicode/busicookie.js');

//----公共变量------//
var mHttpSending = false;

//创建全局App对象
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: 0,
    tabbarMidIndex: app.globalData.tabbarMidIndex,
    apiWebDoamin: app.globalData.apiWebDoamin, //小程序Api的网站域名
    navbarHeight: 0, //navBar的高度
    octContentMarginTop: 0, //主体内容距子导航的距离
    octContentMarginTopMsg: 0, //消息栏 主体内容距子导航的距离
    //--------------消息频道 - 自定义变量--------------//
    sysMsgType: "All", //系统信息类别 (Order交易 AfterSale 售后 CusSer 客服咨询 All所有消息)
    loadReadAllSysMsgBuyerList_Data: null, //加载买家端所有的系统消息阅读集合
    countOrderMsg: 0, //交易消费统计
    countAfterSaleMsg: 0, //售后消息统计
    countCusSerMsg: 0, //咨询消息统计
    countAllMsg: 0, //总的消息之和

    //--------------附近频道 - 自定义变量--------------//
    selRegionCityName: "", //当前选择的 城市名称 --用于显示
    selCityRegionCodeArr: "", //得到 用户选择的城市区域代号拼接  - [ 430000_430100 ] - 省_市
    lngLatCookie: "", //当前用户的位置, longitude ^ latitude
    loadAdvCarousel_Data: null, //加载主轮播图片
    loadListNavIconMsg_Data: null, // 栏目图标导航信息
    loadAdvImgList_Data: null, //加载图片列表广告
    loadRcdGoods_Data: null, //推荐商品列表
    loadRcdShop_Data: null, //推荐店铺列表

    // ------========城市选择器变量=========-------//
    multiIndex: [0, 0],
    multiArray: null,
    objectMultiArray: null,
    objectProvinceList: null,
    objectSelCityRegionArrColumnChange: null, //Picker 城市列表变化时获取的,最终城市信息对象
    cityListColumnChange: null, //Picker 省列表变化时获取的城市信息列表对象

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 通过获取系统信息计算导航栏高度
    this.getSysStatusBarHeight();

    //---得到navBar的高度----//
    var _navbarHeight = this.selectComponent("#NavBar").getNavBarHeight();
    console.log("_navbarHeight=" + _navbarHeight);
    this.setData({
      navbarHeight: _navbarHeight,
      octContentMarginTop: _navbarHeight + 3,
      octContentMarginTopMsg: _navbarHeight + 70,
    });

    //----------附近频道-------------//
    if (this.data.tabbarMidIndex == 0 || this.data.tabbarMidIndex == 1) {


      //----加载小程序省市二级联动json数据，并返回数组对象-----//
      mBusiRegion.loadWxMiniRegionCodeProvinceCityData((outMultiIndex, outMultiArray, outObjectProvinceList, outObjectMultiArray) => {
        // console.log(outMultiIndex);
        // console.log(outMultiArray);
        // console.log(outObjectMultiArray);
        this.setData({
          multiIndex: outMultiIndex,
          multiArray: outMultiArray,
          objectProvinceList: outObjectProvinceList,
          objectMultiArray: outObjectMultiArray
        });
      });

      //栏目图标导航信息
      this.loadListNavIconMsg();

      // 如果用户登录啦，则设置全局的  loginBuyerUserID 和 loginPwdSha1 可根据这两个参数是否为空，判断是否用户登录
      mBusiLogin.setLoginBuyerUserIDPwdSha1Global(res => {
        //用户已登录的状态
        if (res != "") {

        }

        //----得到与保存当前用户的位置信息-----//
        mBusiLocation.getSaveUserLoctaion(res => {
          console.log(res);
          //lngLatCookie: "", //当前用户的位置, longitude ^ latitude
          this.setData({
            lngLatCookie: res.longitude + "^" + res.latitude,
          });


          //----得到当前选择的 城市名称 --用于显示----//
          mBusiRegion.showSelRegionCityName(res => {
            this.setData({
              selRegionCityName: res,
            });

            //得到 用户选择的城市区域代号信息 --Cookie值 
            mBusiRegion.getSelCityRegionArrCookie(res => {
              console.log(res);

              this.setData({
                selCityRegionCodeArr: res.ProvinceCode + "_" + res.CityCode,
              });

              if (mHttpSending == false) {

                mHttpSending = true; //Http发送中

                //加载主轮播图片
                this.loadAdvCarousel();
                //加载图片列表广告
                this.loadAdvImgList();

                //加载推荐商家与商品信息 (首页显示)
                this.loadRcdGoodsShop("Shop", () => {
                  this.loadRcdGoodsShop("Goods", () => {});
                });

                console.log("加载推荐商家与商品信息 (首页显示)");
                //this. loadRcdGoodsShop("Goods", ()=>{}); 
              }



            });

          });

        });


      });





    }



  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("app.globalData.tabbarMidIndex=" + app.globalData.tabbarMidIndex);
    this.setData({
      tabbarMidIndex: app.globalData.tabbarMidIndex,
    });

    //---------自定义函数------------//
    if (this.data.tabbarMidIndex == 3 || this.data.tabbarMidIndex == 4) {
      //加载买家端所有的系统消息阅读集合
      this.loadReadAllSysMsgBuyerList("All");
    }

  },
  // 通过获取系统信息计算导航栏高度,并设置navBar的top和高度
  getSysStatusBarHeight: function () {
    var that = this,
      sysinfo = wx.getSystemInfoSync(),
      statusHeight = sysinfo.statusBarHeight,
      isiOS = sysinfo.system.indexOf('iOS') > -1,
      navHeight;
    if (!isiOS) {
      navHeight = 34;
    } else {
      navHeight = 30;
    }
    that.setData({
      statusHeight: statusHeight,
      navBarHeight: navHeight,
      navBarSubTop: statusHeight + navHeight + 8,
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
  //-----------------------附近频道函数--------------------------//

  /**
   * 保存选择的 当前城市区域信息 -- 到数据库
   * @param {*} pSelCityRegionCodeArr  省_市 区域代号 [ 430000_430100 ]
   */
  saveSelCityRegionCodeArr: function (pSelCityRegionCodeArr) {

    if (app.globalData.loginBuyerUserID == "" || app.globalData.loginBuyerUserID == null || app.globalData.loginBuyerUserID == undefined) {
      return;
    }

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "2",
      "SelCityRegionCodeArr": pSelCityRegionCodeArr,
      "BuyerUserID": app.globalData.loginBuyerUserID,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.o2oApi_Index, _dataPOST, _jsonReTxt => {
      // if (_jsonReTxt == "" || _jsonReTxt == undefined) {
      //   return;
      // }

      //重新加载数据
      this.onLoad();

    });

  },

  /**
   * 加载主轮播图片
   */
  loadAdvCarousel: function () {
    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "1",
      "AdvOsTypeFix": "Mini",
      "AdvType": "AdvO2o",
      "AdvTitleType": "O2oIndex",
      "SelCityRegionCodeArr": this.data.selCityRegionCodeArr,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.mallApi_Index, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }
      //设置公共变量
      this.setData({
        loadAdvCarousel_Data: _jsonReTxt,
      });

    });

  },

  /**
   * 栏目图标导航信息
   */
  loadListNavIconMsg: function () {
    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "4",
      "NavType": "O2oIndex",
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.mallApi_Index, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }
      //设置公共变量
      this.setData({
        loadListNavIconMsg_Data: _jsonReTxt,
      });

    });
  },

  /**
   * 加载图片列表广告
   */
  loadAdvImgList: function () {
    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "3",
      "AdvType": "AdvO2o",
      "AdvTitleType": "O2oIndex",
      "SelCityRegionCodeArr": this.data.selCityRegionCodeArr,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.mallApi_Index, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }
      //设置公共变量
      this.setData({
        loadAdvImgList_Data: _jsonReTxt,
      });

    });
  },

  /**
   * 加载推荐商家与商品信息 (首页显示)
   * @param {*} pRcdType  推荐类别 ( Shop店铺，Goods商品 )
   * @param {*} pCallBack 
   */
  loadRcdGoodsShop: function (pRcdType, pCallBack) {
    var _loadNum = 6
    if (pRcdType == "Shop") {
      _loadNum = 8;
    } else if (pRcdType == "Goods") {
      _loadNum = 6;
    }

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "3",
      "AdvType": "AdvO2o",
      "RcdType": pRcdType,
      "LoadNum": _loadNum,
      "SelCityRegionCodeArr": this.data.selCityRegionCodeArr,
      "BuyerUserID": app.globalData.loginBuyerUserID,
      "LngLatCookie": this.data.lngLatCookie,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.o2oApi_Index, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }

      if (pRcdType == "Goods") {

        //mUtils.logOut(_jsonReTxt.GoodsMsgList);
        if (_jsonReTxt.GoodsMsgList != undefined) {
          for (var i = 0; i < _jsonReTxt.GoodsMsgList.length; i++) {
            if (_jsonReTxt.GoodsMsgList[i].GoodsTitle.length > 20) {
              _jsonReTxt.GoodsMsgList[i].GoodsTitle = _jsonReTxt.GoodsMsgList[i].GoodsTitle.substring(0, 20) + "…";
            }
          }
        }

        //设置公共变量
        this.setData({
          loadRcdGoods_Data: _jsonReTxt,
        });
      } else {
        //设置公共变量
        this.setData({
          loadRcdShop_Data: _jsonReTxt,
        });
      }

      if (pRcdType == "Goods") {
        mHttpSending = false;
      }

      //回调函数
      pCallBack();
    });

  },

  //-----------------------消息频道函数--------------------------//

  /**
   * 切换选项卡 消息
   */
  chgTabMsg: function (e) {

    var _sysMsgType = e.currentTarget.dataset.sysMsgType

    //设置公共变量值
    this.setData({
      sysMsgType: _sysMsgType,
    });

    //加载买家端所有的系统消息阅读集合
    this.loadReadAllSysMsgBuyerList(_sysMsgType);

  },

  /**
   * 加载买家端所有的系统消息阅读集合
   * @param pSysMsgType 系统信息类别 (Order交易 AfterSale 售后 CusSer 客服咨询 All所有消息)
   */
  loadReadAllSysMsgBuyerList: function (pSysMsgType) {

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(app.globalData.loginBuyerUserID, app.globalData.loginPwdSha1),
      "Type": "1",
      "SysMsgType": pSysMsgType,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.buyerApi_BuyerMsg, _dataPOST, _jsonReTxt => {
      // if (_jsonReTxt == "" || _jsonReTxt == undefined) {
      //   return;
      // }



      if (_jsonReTxt != "" && _jsonReTxt == undefined) {
        var _countOrderMsg = 0; //交易消费统计
        var _countAfterSaleMsg = 0; //售后消息统计
        var _countCusSerMsg = 0; //咨询消息统计
        var _countAllMsg = 0; //总的消息之和
        for (var i = 0; i < _jsonReTxt.ReadAllSysMsgList.length; i++) {

          if (_jsonReTxt.ReadAllSysMsgList[i].IsRead == "false" && _jsonReTxt.ReadAllSysMsgList[i].SysMsgType == "Order") {
            _countOrderMsg++;
          }
          if (_jsonReTxt.ReadAllSysMsgList[i].IsRead == "false" && _jsonReTxt.ReadAllSysMsgList[i].SysMsgType == "AfterSale") {
            _countAfterSaleMsg++;
          }
          if (_jsonReTxt.ReadAllSysMsgList[i].IsRead == "false" && _jsonReTxt.ReadAllSysMsgList[i].SysMsgType == "CusSer") {
            _countCusSerMsg++;
          }
        }
        _countAllMsg = _countOrderMsg + _countAfterSaleMsg + _countCusSerMsg;
      }

      //设置公共变量值
      this.setData({
        loadReadAllSysMsgBuyerList_Data: _jsonReTxt,
        countOrderMsg: _countOrderMsg,
        countAfterSaleMsg: _countAfterSaleMsg,
        countCusSerMsg: _countCusSerMsg,
        countAllMsg: _countAllMsg,
      });

    });


  },

  //========================城市选择器 函数=======================//
  bindMultiPickerChange: function (e) {

    this.setData({
      "multiIndex[0]": e.detail.value[0],
      "multiIndex[1]": e.detail.value[1]
    })

    //单击确定按钮保存选择的城市值 Cookie中
    mBusiRegion.setSelCityRegionArrCookie(this.data.objectSelCityRegionArrColumnChange.ProvinceCode, this.data.objectSelCityRegionArrColumnChange.CityCode, this.data.objectSelCityRegionArrColumnChange.ProvinceName, this.data.objectSelCityRegionArrColumnChange.CityName);

    //设置选择的城市名称 - 显示
    this.setData({
      selRegionCityName: this.data.objectSelCityRegionArrColumnChange.CityName,
    });

    //保存选择的 当前城市区域信息 --到数据库
    this.saveSelCityRegionCodeArr(this.data.objectSelCityRegionArrColumnChange.ProvinceCode + "_" + this.data.objectSelCityRegionArrColumnChange.CityCode);

  },
  bindMultiPickerColumnChange: function (e) {

    //console.log(e);

    var cityList = [];

    switch (e.detail.column) {
      case 0:
        var list = [];
        for (var i = 0; i < this.data.objectMultiArray.length; i++) {
          if (this.data.objectMultiArray[i].PCODE == this.data.objectProvinceList[e.detail.value].REGIONCODE) {
            list.push(this.data.objectMultiArray[i].REGIONNAME);

            var _cityMsg = {};
            _cityMsg.REGIONCODE = this.data.objectMultiArray[i].REGIONCODE;
            _cityMsg.REGIONNAME = this.data.objectMultiArray[i].REGIONNAME;
            cityList.push(_cityMsg);
          }
        }
        this.setData({
          "multiArray[1]": list,
          "multiIndex[0]": e.detail.value,
          "multiIndex[1]": 0,
          cityListColumnChange: cityList,
        })
    }

    //获取最终选择的值
    var _provinceCode = "";
    var _provinceName = "";
    var _cityCode = "";
    var _cityName = "";

    //省这一列变动时
    if (e.detail.column == 0) {
      _provinceCode = this.data.objectProvinceList[e.detail.value].REGIONCODE;
      _provinceName = this.data.objectProvinceList[e.detail.value].REGIONNAME;
      try {
        _cityCode = cityList[0].REGIONCODE;
        _cityName = cityList[0].REGIONNAME;
      } catch (e) {};

    }

    //城市这一列变动时
    if (e.detail.column == 1) {
      _provinceCode = this.data.objectSelCityRegionArrColumnChange.ProvinceCode;
      _provinceName = this.data.objectSelCityRegionArrColumnChange.ProvinceName;
      _cityCode = this.data.cityListColumnChange[e.detail.value].REGIONCODE;
      _cityName = this.data.cityListColumnChange[e.detail.value].REGIONNAME;
    }

    var _jsonSelCityRegionArrColumnChange = "{";
    _jsonSelCityRegionArrColumnChange += "\"ProvinceCode\":\"" + _provinceCode + "\","
    _jsonSelCityRegionArrColumnChange += "\"CityCode\":\"" + _cityCode + "\","
    _jsonSelCityRegionArrColumnChange += "\"ProvinceName\":\"" + _provinceName + "\","
    _jsonSelCityRegionArrColumnChange += "\"CityName\":\"" + _cityName + "\""
    _jsonSelCityRegionArrColumnChange += "}"
    //mUtils.logOut(_jsonSelCityRegionArrColumnChange);
    //设置公共变量值
    this.setData({
      objectSelCityRegionArrColumnChange: JSON.parse(_jsonSelCityRegionArrColumnChange),
    });


  },


  //==================公共函数============//
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
  buildBuyerGoToImSysURL_ShopWap: function (e) {

    var _shopUserId = e.currentTarget.dataset.shopUserId;

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "1",
      "ShopUserID": _shopUserId,
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
        //mUtils.makePhoneCall(this.data.initOrderMsg_Data.ShopMsg.ShopMobile);
      }

    });
  },




})