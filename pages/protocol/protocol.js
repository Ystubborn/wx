var app = getApp();
var common = require("../../common.js");
Page({
  data: {
    title: '',
    content: ''
  },
  onLoad: function (options) {
    var title = options.title;
    wx.setNavigationBarTitle({
      title: title
    })
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.domain2 + '/api/User/GetArticleItemInfo?fknowledge=' + options.type,
      header: { 
        'content-type': 'application/json',
        'accept': '	application/json;charset=utf-8',
        'X-AppId': app.globalData.appId
      },
      success(res) {
        wx.hideLoading();
        if (res.statusCode == 200 && res.data) {
          var result = res.data;
          that.setData({
            title: result.ftitle,
            content: result.fcontent
          });
        } else {
          wx.showToast({
            title: '获取失败',
            icon: 'none'
          })
        }
      }
    });
  }
})