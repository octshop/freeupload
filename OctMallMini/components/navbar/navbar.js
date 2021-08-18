Component({
  /**
   * 组件的属性列表
   */
  properties: {
      background: {
          type: String,
          value: 'rgba(255, 255, 255, 1)'
      },
      color: {
          type: String,
          value: 'rgba(0, 0, 0, 1)'
      },
      titleText: {
          type: String,
          value: '导航栏'
      },
      titleImg: {
          type: String,
          value: ''
      },
      backIcon: {
          type: String,
          value: ''
      },
      homeIcon: {
          type: String,
          value: ''
      },
      fontSize: {
          type: Number,
          value: 16
      },
      iconHeight: {
          type: Number,
          value: 19
      },
      iconWidth: {
          type:Number,
          value: 58
      }
  },
  attached: function(){
      var that = this;
      that.setNavSize();
      that.setStyle();
  },
  data: {

  },
  methods: {
      // 通过获取系统信息计算导航栏高度
      setNavSize: function() {
          var that = this
              , sysinfo = wx.getSystemInfoSync()
              , statusHeight = sysinfo.statusBarHeight
              , isiOS = sysinfo.system.indexOf('iOS') > -1
              , navHeight;
          if (!isiOS) {
              navHeight = 44;
          } else {
              navHeight = 40;
          }
          that.setData({
              status: statusHeight,
              navHeight: navHeight
          })
      },
      setStyle: function() {
          var that  = this
              , containerStyle
              , textStyle
              , iconStyle;
          containerStyle = [
              'background:' + that.data.background
              ].join(';');
          textStyle = [
              'color:' + that.data.color,
              'font-size:' + that.data.fontSize + 'px'
          ].join(';');
          iconStyle = [
              'width: ' + that.data.iconWidth + 'px',
              'height: ' + that.data.iconHeight + 'px'
          ].join(';');
          that.setData({
              containerStyle: containerStyle,
              textStyle: textStyle,
              iconStyle: iconStyle
          })
      },
      //得到navbar的高度
      getNavBarHeight:function(){
          return this.data.status + this.data.navHeight;
      },
      // 返回事件
      back: function(){
        this.triggerEvent('back',{}); 
          // wx.navigateBack({
          //     delta: 1
          // })
          // this.triggerEvent('back', {back: 1}) //把事件参数返回去
      },
      home: function() {
          this.triggerEvent('home', {});
      }
  }
})