 
Page({
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      })
    }
  },
  //页面数据
  data: {
  }, 
  goOrderMessage: function () {
    wx.navigateTo({
      url: '/pages/message/messageInfo/messageInfo?type=order'
    })
  },
  goMoneyMessage: function () {
    wx.navigateTo({
      url: '/pages/message/messageInfo/messageInfo?type=money'
    })
  },
  goSystemMessage: function () {
    wx.navigateTo({
      url: '/pages/message/messageSystem/messageSystem',
    })
  },
  goHelp: function () {
    wx.navigateTo({
      url: '/pages/my/help/help',
    })
  },
  goOnline:function(){
    wx.showToast({
      title: '正在完善中..',
      icon:'none'
    })
  },
  callPhone:function(){
    wx.makePhoneCall({
      phoneNumber: '4009608388'
    })
  },
  onShareAppMessage: function () {
    return {
      title: "左右手",
      path: '/pages/custom/index/index'
    }
  } 
})