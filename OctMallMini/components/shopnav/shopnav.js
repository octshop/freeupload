// components/shopnav/shopnav.js
//==============引入相关的Js文件========//
var mBusiCode =  require('../../busicode/busicode');


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    topFix: {
      type: Number,
      value: 100
    },
    tabCurNum: {
      type: Number,
      value: 0
    },
    shopName: {
      type: String,
      value: ""
    },
    shopId: {
      type: String,
      value: ""
    },
    apiWebDoamin: {
      type: String,
      value: ""
    },
    avgAppraiseScore: {
      type: String,
      value: ""
    },
    countFans: {
      type: String,
      value: ""
    },
    countFavShop: {
      type: String,
      value: ""
    },
    shopHeaderImg: {
      type: String,
      value: ""
    },
    appraiseStarRed: {
      type: Number,
      value: 0
    },
    appraiseStarGray: {
      type: Number,
      value: 0
    },
    nologinBackUrl: {
      type: String,
      value: ""
    },
    isSelfShop: {
      type: String,
      value: ""
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  /**
   * 初始化
   */
  attached: function () {
    console.log("组件apiWebDoamin=" + this.data.apiWebDoamin);
    console.log("组件shopName=" + this.data.shopName);

  },

  /**
   * 组件的方法列表
   */
  methods: {
    navShopMsgDetail: function (e) {
      //console.log(e.currentTarget.dataset);
      var _dataSet = e.currentTarget.dataset;
      wx.navigateTo({
        url: '../../../pages/shop/shopmsgdetail/shopmsgdetail?SID=' + _dataSet.shopId,
      })
    },
    /**
   * 买家关注店铺
   */
  addBuyerFocusFav:function(e){
    console.log(e);
    var _dataSet = e.currentTarget.dataset;
    //console.log(_dataSet);
    //买家关注店铺
    //mBusiCode.addBuyerFocusFav(_dataSet.shopId,"../../../pages/shop/shopmsgdetail/shopmsgdetail^SID~" + _dataSet.shopId);

    var _nologinBackUrl = "";
    if (this.data.nologinBackUrl != "")
    {
      _nologinBackUrl =  this.data.nologinBackUrl +  "^SID~" + _dataSet.shopId;
    }

    mBusiCode.addBuyerFocusFav(_dataSet.shopId,_nologinBackUrl);
  },
    // shopNavigate: function (e) {
    //   //获取标签数据
    //   console.log(e.currentTarget.dataset.tab);
    //   var _tab = e.currentTarget.dataset.tab;
    //   if (_tab == "0")
    //   {
    //        wx.redirectTo({
    //          url: '../../../pages/shop/index/index',
    //        })
    //   }
    // }
  }
})