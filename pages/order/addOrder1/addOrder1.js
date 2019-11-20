var app = getApp();
var common = require("../../../common.js");
Page({
  //页面数据
  data: {
    model: '',
    imgs: ['../../../images/order/fun1.png', '../../../images/order/fun2.png'],
    items: [] //fentryid fenumitem
  },
  //页面初次加载
  onLoad: function() {
    this.initPage();
  },
  selectType: function(event) {
    var model = event.currentTarget.dataset.model;
    this.setData({
      model: model
    });
    wx.setStorage({
      key: "add_order_1",
      data: {
        model: model
      }
    });
    wx.navigateTo({
      url: '/pages/order/addOrder2/addOrder2',
    });
  },
  getHistoryData: function() { 
    var that = this;
    wx.getStorage({
      key: 'add_order_1',
      success(res) {
        if (res.data) {
          var model = res.data.model;
          wx.showModal({
            title: '提示',
            content: '是否继续上次未完成下单？',
            success(res) {
              if (res.confirm) {
                that.setData({
                  model: model
                });
              } else {
                wx.removeStorageSync('add_order_1');
                wx.removeStorageSync('add_order_2');
                wx.removeStorageSync('add_order_3');
                wx.removeStorageSync('add_order_4');
                wx.removeStorageSync('add_order_5');
                wx.removeStorageSync('add_order_6'); 
              }
            }
          })
        }
      }
    });
  },
  initPage: function() {
    var that = this;
    common.httpReq('/bill/bd_enumdata?operationNo=queryenumdata', {
      simpleData: {
        fid: "99222505751543559a346725d96d6094"
      }
    }, function (res) {
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