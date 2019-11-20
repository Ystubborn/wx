var app = getApp();
var common = require("../../../common.js");
Page({
  //页面数据
  data: {
    type: '',
    imgs: ['../../../images/order/fun21.png', '../../../images/order/fun22.png', '../../../images/order/fun23.png', '../../../images/order/fun24.png', '../../../images/order/fun25.png', '../../../images/order/fun26.png', '../../../images/order/fun27.png'],
    items: [] //fentryid fenumitem
  },
  //页面初次加载
  onLoad: function() {
    this.initPage();
    var that = this;
  },
  selectType: function(event) {
    var type = event.currentTarget.dataset.type;
    var typetxt = event.currentTarget.dataset.typetxt; 
    this.setData({
      type: type
    });
    var obj = wx.getStorageSync("add_order_2");
    if (obj.type != type) {  
      wx.removeStorageSync('add_order_2');
      wx.removeStorageSync('add_order_3');
      wx.removeStorageSync('add_order_4');
      wx.removeStorageSync('add_order_5');
      wx.removeStorageSync('add_order_6'); 
    }
    wx.setStorage({
      key: "add_order_2",
      data: {
        type: type,
        typetxt: typetxt
      }
    });
    wx.navigateTo({
      url: '/pages/order/addOrder3/addOrder3',
    })
  },
  getHistoryData: function() {
    var that = this;
    wx.getStorage({
      key: 'add_order_2',
      success(res) {
        if (res.data) {
          var type = res.data.type;
          that.setData({
            type: type
          });
        }
      }
    });
  },
  initPage: function() {
    var that = this;
    common.httpReq('/bill/bd_enumdata?operationNo=queryenumdata', {
      simpleData: {
        fid: "af5a362c31574bef8bb71f6cbcfc1624"
      }
    }, function(res) {
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var result = res.data.operationResult.srvData.datas;
        that.setData({
          items: result
        });
        that.getHistoryData();
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    });
  }
})