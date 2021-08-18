// components/buttontest/buttontest.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    buttonText: {
      type: String,
      value: '按钮的Text',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isHide: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickEvent: function (e) { //单击事件
      //弹出提示
      wx.showToast({
        title: '按钮的单击事件clickEvent',
        icon: 'none'
      })

      //设置组件中的参数值
      this.setData({
        isHide: true,
        buttonText: "单击了自己"
      });

    },
    chgButtonTxt: function (pIsHide,pButtonText) {
      console.log("执行啦pIsHide=" + pIsHide);
      //设置组件中的参数值
      this.setData({
        isHide: pIsHide,
        buttonText:pButtonText
      });
    }
  }
})
