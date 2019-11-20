Page({
  //页面数据
  data: {
    url: '',
    title:''
  },
  onLoad: function (options){ 
    var url = options.url;
    var title = options.title;
    this.setData({
      url:url,
      title:title
    }); 
    wx.setNavigationBarTitle({
      title: this.data.title
    })
  },
  onShareAppMessage: function () {
    return {
      title: "左右手",
      path: '/pages/custom/index/index'
    }
  } 
})