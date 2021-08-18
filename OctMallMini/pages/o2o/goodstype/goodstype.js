//---------------引用文件-----------//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiLogin = require('../../../busicode/busilogin.js');
var mBusiLocation = require('../../../busicode/busilocation.js');
var mBusiRegion = require('../../../busicode/busiregion.js');

//----------数据分页----------//
var mSearchWhereArr = ""; //搜索条件拼接字符串 "^"
var mIntPageCurrent = 1; //当前的分页索引
var mPageSum = 1; //总页数
var mRecordSum = 0; //总记录
var mPageHttpSending = false; //数据分页Http发送中

var mHttpSending = false; //是否正在发送Http请求

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
    isFilterShow: false, //是否显示条件选择层区
    //--------------自定义变量--------------//
    tabNum: "1", //当前选项卡的次序
    lngLatCookie: "", //当前用户的位置, longitude ^ latitude
    regionCityCode: "", //当前选择城市代号
    goodsTypeIdSec: "", //商品第二级分类 - ID
    goodsTypeNameSec: "", //商品第二级分类 - 名称
    goodsTypeName: "全部分类", //商品第三级分类 - 名称
    goodsTypeId: "", //商品第三级分类 - ID
    orderBy: "Distance", //排序类型
    selCityRegionCodeArr: "", //得到 用户选择的城市区域代号拼接  - [ 430000_430100 ] - 省_市

    loadGoodsTypeThirdBySec_Data: null, //第三级分类对象
    loadCurUserCountyList_Data: null, //加载区县列表
    regionCountyCode: "", //当前选择的县区代号
    regionCountyName: "全部地区", //当前选择的县区名称

    //------数据分页------//
    numberPage_Page: null, //数据分页对象
    numberPage_Page_Custom: null, //自定义数据分页对象
    pageOrderCode: "Distance", //排序方式-代码
    pageOrderName: "距离最近", //排序方式-名称


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //---得到navBar的高度----//
    var _navbarHeight = this.selectComponent("#NavBar").getNavBarHeight();
    this.setData({
      navbarHeight: _navbarHeight,
      octContentMarginTop: _navbarHeight + 40,
    });

    //-----获取传递的参数-----//
    //GTIDSe=40064&GTL=Sec&GTNaSe=火锅
    var _goodsTypeId = options.GTID;
    if (_goodsTypeId == undefined) {
      mUtils.switchTabURL("../../../pages/tabbar/shopnear/shopnear");
      return;
    }
    this.setData({
      goodsTypeId: _goodsTypeId,
    });

    //---------调用自定义函数------//

    // 如果用户登录啦，则设置全局的  loginBuyerUserID 和 loginPwdSha1 可根据这两个参数是否为空，判断是否用户登录
    mBusiLogin.setLoginBuyerUserIDPwdSha1Global(res => {
      //用户已登录的状态
      if (res != "") {}

      //----得到与保存当前用户的位置信息-----//
      mBusiLocation.getSaveUserLoctaion(res => {
        //mUtils.logOut("res.longitude=" + res.longitude + " | res.latitude=" + res.latitude);
        //lngLatCookie: "", //当前用户的位置, longitude ^ latitude
        if (res.longitude == undefined || res.latitude == undefined) {
          return;
        }
        this.setData({
          lngLatCookie: res.longitude + "^" + res.latitude,
        });

        //-----得到用户选择的区域  没有选择区域时，设置默认的区域-----//
        mBusiRegion.getUserSelCityRegionArrCookie(res => {
          //console.log(res);
          this.setData({
            selCityRegionCodeArr: res.ProvinceCode + "_" + res.CityCode,
            regionCityCode: res.CityCode,
          });

          if (mHttpSending == false) {
            mHttpSending = true;

            // 加载商品搜索条件选项卡信息O2O
            this.loadGoodsSearchWhereTabMsg(() => {
              //初始化搜索条件
              this.initSearchWhereArr();
              //加载数据分页 - 网络请求
              this.numberPage();

            });

          }

        });
      });
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
   * 第二个按钮
   */
  home: function () {
    wx.navigateTo({
      url: '../../../pages/mall/goodssearch/goodssearch?ST=Entity',
    })
  },
  /**
   * 关闭或显示条件层
   */
  toggleFilterShow: function () {
    if (this.data.isFilterShow == false) {
      this.setData({
        isFilterShow: true,
      });
    } else {
      this.setData({
        isFilterShow: false,
      });
    }
  },
  /**
   * 关闭条件层
   */
  closeFilterShow: function () {
    this.setData({
      isFilterShow: false,
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //重新加载数据
    this.numberPage("1", res => {
      //停止刷新
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //下一页 --数据分页
    this.nextPage();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //================自定义函数===============//

  /**
   * 显示条件筛选层
   */
  showItemSearchWhere: function (e) {
    var _tabNum = e.currentTarget.dataset.tabNum;
    this.setData({
      isFilterShow: true,
      tabNum: _tabNum,
    });
  },

  /**
   * 选择第一个条件
   */
  clickItemSearchWhere1: function (e) {

    var _goodsTypeId = e.currentTarget.dataset.goodsTypeId;
    var _goodsTypeName = e.currentTarget.dataset.goodsTypeName;

    this.setData({
      isFilterShow: false, //关闭窗口
      goodsTypeId: _goodsTypeId,
      goodsTypeName: _goodsTypeName,
    });

    //初始化搜索条件
    this.initSearchWhereArr();
    //加载数据分页 - 网络请求
    this.numberPage();

  },

  /**
   * 选择第二个条件
   */
  clickItemSearchWhere2: function (e) {

    var _regionCountyCode = e.currentTarget.dataset.regionCountyCode;
    var _regionCountyName = e.currentTarget.dataset.regionCountyName;

    this.setData({
      isFilterShow: false, //关闭窗口
      regionCountyCode: _regionCountyCode,
      regionCountyName: _regionCountyName,
    });

    //初始化搜索条件
    this.initSearchWhereArr();
    //加载数据分页 - 网络请求
    this.numberPage();

  },

  /**
   * 选择第三个条件
   */
  clickItemSearchWhere3: function (e) {

    var _pageOrderCode = e.currentTarget.dataset.pageOrderCode;
    var _pageOrderName = e.currentTarget.dataset.pageOrderName;

    this.setData({
      isFilterShow: false, //关闭窗口
      pageOrderCode: _pageOrderCode,
      pageOrderName: _pageOrderName,
      orderBy: _pageOrderCode
    });

    //初始化搜索条件
    this.initSearchWhereArr();
    //加载数据分页 - 网络请求
    this.numberPage();

  },

  /**
   * 加载商品搜索条件选项卡信息O2O
   */
  loadGoodsSearchWhereTabMsg: function (pCallBack) {

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "2",
      "GoodsTypeIDThird": this.data.goodsTypeId,
      "SelCityRegionCodeArr": this.data.selCityRegionCodeArr,
      "BuyerUserID": app.globalData.loginBuyerUserID,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.o2oApi_GoodsType, _dataPOST, _jsonReTxt => {

      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }

      //设置公共变量
      this.setData({
        loadGoodsSearchWhereTabMsg_Data: _jsonReTxt,
        loadGoodsTypeThirdBySec_Data: _jsonReTxt.GoodsTypeEntityList,
        loadCurUserCountyList_Data: _jsonReTxt.UserCountyList,
        goodsTypeIdSec: _jsonReTxt.GoodsTypeEntityList.GoodsTypeIDSec,
        goodsTypeName: _jsonReTxt.GoodsTypeEntityList.GooGoodsTypeCurrent.GoodsTypeName,
      });

      //回调函数
      pCallBack();

    });

  },


  //=====================数据分页==========================//
  /**
   * 初始化搜索条件
   * @param {*} pPageOrderName  Commend 推荐 SaleCount 销量 GoodsPriceAsc 价格升序 GoodsPriceDesc 价格降序 WriteDate 新品 Discount 打折  GroupMsgCount 团购  SecKill  秒杀
   * @param {*} pIsOnlyDiscount 是否只加载打折的商品 ( true / false )
   */
  initSearchWhereArr: function () {

    //SearchKeyword + "^" + pPageOrderName + "^" + pIsOnlyDiscount + "^" + pIsOnlyGroup
    mSearchWhereArr = this.data.regionCountyCode + "^" + this.data.pageOrderCode;
  },
  /**
   * 加载数据分页 - 网络请求
   * @param {*} pPageCurrent 
   */
  numberPage: function (pPageCurrent = "1", pCallBack) {

    if (pCallBack == undefined || pCallBack == null || pCallBack == "") {
      pCallBack = function () {};
    }

    //如果是第一页则重新加载数据
    if (pPageCurrent == "1") {
      this.setData({
        numberPage_Page: null,
      });
    }

    //记录当前的分页索引
    mIntPageCurrent = pPageCurrent;

    //构造POST参数
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "1",
      "PageCurrent": pPageCurrent,
      "SearchWhereArr": mSearchWhereArr,
      "GoodsTypeID": this.data.goodsTypeId,
      "GoodsTypeIDSec": this.data.goodsTypeIdSec,
      "RegionCityCode": this.data.regionCityCode,
      "BuyerUserID": app.globalData.loginBuyerUserID,
    };

    //判断是否分页Http是否发送中
    if (mPageHttpSending == true) {
      return;
    }
    mPageHttpSending = true;

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.o2oApi_GoodsType, _dataPOST, res => {

      //回调函数
      pCallBack(true);

      //可以重新发送Http
      mPageHttpSending = false;
      mHttpSending = false;

      if (res == "") {
        this.setData({
          numberPage_Page: null,
        });
        return;
      }

      //------格式化分页数据-----//
      if (res != "") {
        for (var i = 0; i < res.DataPage.length; i++) {
          if (res.DataPage[i].GoodsTitle.length > 25) {
            res.DataPage[i].GoodsTitle = res.DataPage[i].GoodsTitle.substring(0, 25) + "…";
          }
        }
      }

      //----分页Http完成-----//
      var _numberPage_Page = this.data.numberPage_Page;
      mPageSum = parseInt(res.PageSum);
      mIntPageCurrent = parseInt(res.PageCurrent);
      mRecordSum = parseInt(res.RecordSum);


      //将数据分页数据添加到公共变量中
      if (this.data.numberPage_Page == null) {
        _numberPage_Page = res;
      } else {
        //添加数据分页中
        _numberPage_Page.PageCurrent = (parseInt(_numberPage_Page.PageCurrent) + 1).toString();
        //添加数组
        _numberPage_Page.DataPage = _numberPage_Page.DataPage.concat(res.DataPage);
        _numberPage_Page.DataPageExtra = _numberPage_Page.DataPageExtra.concat(res.DataPageExtra);
      }

      //------设置公共变量-----//
      this.setData({
        numberPage_Page: _numberPage_Page,
      });


    });

  },
  /**
   * 下一页 --数据分页
   */
  nextPage: function () {

    console.log("数据分页nextPage()");

    if (mPageHttpSending == true) {
      return;
    }

    if (mIntPageCurrent < mPageSum) {

      mIntPageCurrent += 1;

      //数据分页
      this.numberPage(mIntPageCurrent);
    }

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




})