// pages/mall/goodstypelistdetail/goodstypelistdetail.js
//==============引入相关的Js文件========//
var mHttp = require('../../../utils/http.js');
var mUtils = require('../../../utils/util.js');
var mBusiLogin = require('../../../busicode/busilogin.js');

//----------数据分页----------//
var mSearchWhereArr = ""; //搜索条件拼接字符串 "^"
var mIntPageCurrent = 1; //当前的分页索引
var mPageSum = 1; //总页数
var mRecordSum = 0; //总记录
var mPageHttpSending = false; //数据分页Http发送中

//创建全局App对象
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    apiWebDoamin: app.globalData.apiWebDoamin, //小程序Api的网站域名
    navbarHeight: 0, //navBar的高度
    navBarSubTop: 0, //子菜单距顶部高度
    octContentMarginTop: 0, //主体内容距子导航的距离
    isSubTypeShow: false, //是否显示第三级分类面板
    // ----------------自定义变量-----------//
    goodsTypeIdThird: "", //第三级分类ID 
    goodsTypeIdSec: "", //第二级分类ID
    loadAll: "", //是否加载所有商品
    loadListGoodsTypeThirdByThird_Data: null, //根据第三级商品类目ID,加载所有同级的商品类目信息
    //------数据分页------//
    numberPage_Page: null, //数据分页对象

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //---得到navBar的高度----//
    var _navbarHeight = this.selectComponent("#NavBar").getNavBarHeight();
    this.setData({
      navbarHeight: _navbarHeight,
      navBarSubTop: _navbarHeight,
      octContentMarginTop: _navbarHeight + 40,
    });

    //-----获取传递的参数------//
    var _goodsTypeIdThird = options.GTID;
    var _loadAll = options.LoadAll;
    if (_goodsTypeIdThird == undefined) {
      _goodsTypeIdThird = "";
    }
    if (_loadAll == undefined) {
      _loadAll = "";
    }

    this.setData({
      goodsTypeIdThird: _goodsTypeIdThird,
      loadAll: _loadAll,
    });

    //-------调用自定义方法-------//
    //根据第三级商品类目ID,加载所有同级的商品类目信息
    this.loadListGoodsTypeThirdByThird();

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
      url: '../../mall/goodssearch/goodssearch',
    })
  },


  /**
   * 显示与关闭 第三级分类面板
   */
  toggleShowSubType: function () {
    if (this.data.isSubTypeShow == false) {
      this.setData({
        isSubTypeShow: true,
      });
    } else {
      this.setData({
        isSubTypeShow: false,
      });
    }
  },
  /**
   * 关闭 第三级分类面板
   */
  closeShowSubType: function () {
    this.setData({
      isSubTypeShow: false,
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
  //==================自定义函数=================//

  /**
   * 根据第三级商品类目ID,加载所有同级的商品类目信息
   */
  loadListGoodsTypeThirdByThird: function () {

    if (this.data.goodsTypeIdThird == "") {
      return;
    }

    //-----构造POST参数-----//
    var _dataPOST = {
      "SignKey": mHttp.signKeyRsa(),
      "Type": "3",
      "GoodsTypeIDThird": this.data.goodsTypeIdThird,
    };
    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.mallApi_GoodsType, _dataPOST, _jsonReTxt => {
      if (_jsonReTxt == "" || _jsonReTxt == undefined) {
        return;
      }
      //设置公共变量
      this.setData({
        loadListGoodsTypeThirdByThird_Data: _jsonReTxt,
        goodsTypeIdSec: _jsonReTxt.GoodsTypeIDSec,
      });

      //---------数据分页加载--------//
      if (this.data.loadAll == "true") {
        this.setData({
          goodsTypeIdThird: "",
        });
      }
      //初始化搜索条件
      this.initSearchWhereArr();
      //加载数据分页 - 网络请求
      this.numberPage();

    });


  },

  /**
   * 切换第三级分类商品
   */
  chgThirdGoodsTypeItem: function (e) {
    var _goodsTypeIdThird = e.currentTarget.dataset.goodsTypeIdThird;
    mUtils.logOut("_goodsTypeIdThird=" + _goodsTypeIdThird);
    this.setData({
      goodsTypeIdThird: _goodsTypeIdThird,
    });

    //重新加载数据
    this.numberPage();
    //关闭弹出层
    this.closeShowSubType();
  },

  //=====================数据分页==========================//
  /**
   * 初始化搜索条件
   */
  initSearchWhereArr: function (pPageOrderName = "Commend", pIsOnlyDiscount = "false") {
    mSearchWhereArr = " ^" + pPageOrderName + "^" + pIsOnlyDiscount;
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
      "GoodsTypeID": this.data.goodsTypeIdThird,
      "GoodsTypeIDSec": this.data.goodsTypeIdSec,
    };

    //判断是否分页Http是否发送中
    if (mPageHttpSending == true) {
      return;
    }
    mPageHttpSending = true;

    //正式发送Http请求
    mHttp.postHttp(app.apiURLData.searchApi_SearchGoodsResult, _dataPOST, res => {
      //回调函数
      pCallBack(true);

      mPageHttpSending = false;

      if (res == "") {
        this.setData({
          numberPage_Page: null,
        });
        return;
      }

      //------格式化分页数据-----//
      for (var k = 0; k < res.DataPage.length; k++) {

        if (res.DataPage[k].GoodsTitle.length > 21) {
          res.DataPage[k].GoodsTitle = res.DataPage[k].GoodsTitle.substring(0, 21) + "…";
        }

        //------计算折扣------//
        var i = k;
        var item = res.DataPage[i];
        if (item.Discount > 0 && item.GroupDiscount <= 0) {
          res.DataPage[i].GoodsPrice = item.GoodsPrice * (item.Discount / 10);
        } else if (item.GroupDiscount > 0) {
          res.DataPage[i].GoodsPrice = item.GoodsPrice * (item.GroupDiscount / 10);
        } else if (item.SkDiscount > 0 && item.GroupDiscount <= 0) {
          res.DataPage[i].GoodsPrice = item.GoodsPrice * (item.SkDiscount / 10);
        }
        res.DataPage[i].GoodsPrice = mUtils.formatNumberDotDigit(res.DataPage[i].GoodsPrice);
        

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

      //console.log(_numberPage_Page);

      //------设置公共变量-----//
      this.setData({
        numberPage_Page: _numberPage_Page,
      });

      //console.log(this.data.orderGoodsList);

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




})