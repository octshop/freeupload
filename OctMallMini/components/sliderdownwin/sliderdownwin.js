// components/silderdownwin/silderdownwin.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    slideWinTitle: {
      type: String,
      value: ""
    },
    isDisplaySlide: {
      type: String,
      value: "none"
    },
    isDisplayTitle: {
      type: String,
      value: "true"
    },
    slideWinHeight: {
      type: Number,
      value: 100
    },
  },

    // 设置注册项 -- 这个可以向组件传入Wxml代码
  options: {
    multipleSlots: true 
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
    console.log("slideWinHeight=" + this.data.isDisplaySlide);
    console.log("slideWinHeight=" + this.data.slideWinHeight);

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 隐藏底部滑出窗口
     */
    closeSlideBottom: function () {
      this.setData({
        isDisplaySlide: "none", //是否显示窗口
      });
    },
  }
})