// components/shopnavbottom/shopnavbottom.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    apiWebDoamin: {
      type: String,
      value: ""
    },
    shopId: {
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
   * 组件的方法列表
   */
  methods: {
    buildBuyerGoToImSysURL_ShopWap: function () {
      this.triggerEvent('imshopwap', {});
      console.log("执行啦imshopwap");
    },

  }
})