// components/customerbar/customerbar.js
//==============引入相关的Js文件========//
var mUtils = require('../../utils/util.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    apiWebDoamin: {
      type: String,
      value: ""
    },
    complainNavigateUrl: {
      type: String,
      value: ''
    },
    phoneNumber: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

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

    /**
     * 拨打电话
     * @param {} e 
     */
    makePhoneCall: function (e) {
      //console.log(e.target.dataset.phoneNumber)
      var _dataSet = e.currentTarget.dataset;
      //拨打电话
      mUtils.makePhoneCall(_dataSet.phoneNumber);
    },

    /**
     * 店铺咨询
     */
    buildBuyerGoToImSysURL_ShopWap: function () {
      this.triggerEvent('imshopwap', {});
      // console.log("执行啦imshopwap");
    },



  }


})