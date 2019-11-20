var app = getApp(); 
Page({ 
  data: {
    img: '../../../images/my/photo.png',
    name:''
  }, 
  onLoad: function (options) {  
    this.setData({
      name: options.name,
      img: options.img.length>0?decodeURIComponent(options.img):this.data.img
    });
  },
  logOut:function(){
    wx.request({
      url: app.globalData.domain2 + '/api/User/UserUNBindOpenid',
      header: {
        'content-type': 'application/json',
        'accept': '	application/json;charset=utf-8',
        'X-AppId': app.globalData.appId
      },
      data: {
        username: app.globalData.userName
      },
      success(res) {
        if (res.statusCode == 200 && res.data) { 
          wx.clearStorageSync();
          wx.reLaunch({
            url: '/pages/custom/login/login',
          })
        } else {
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none'
          })
        }
      }
    });
  },
  goPerson:function(){
    wx.navigateTo({
      url: '/pages/my/person/person',
    })
  },
  goLoginPwd:function(){
    wx.navigateTo({
      url: '/pages/my/loginPwd/loginPwd',
    })
  },
  goPayPwd: function () {
    wx.navigateTo({
      url: '/pages/my/payPwd/payPwd',
    })
  }
})