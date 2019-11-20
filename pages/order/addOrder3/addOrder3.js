var app = getApp();
var common = require("../../../common.js");
Page({ 
  //页面数据
  data: {
    type: '',
    imgs: ['../../../images/order/fun31.png', '../../../images/order/fun32.png', '../../../images/order/fun33.png', '../../../images/order/fun34.png', '../../../images/order/fun35.png', '../../../images/order/fun36.png', '../../../images/order/fun37.png', '../../../images/order/fun38.png'],
    items: [] //fentryid fenumitem
  },
  //页面初次加载
  onLoad: function () {
    this.initPage();
  }, 
  getHistoryData: function () {
    var that = this; 
    wx.getStorage({
      key: 'add_order_3',
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
  selectType: function (event) {
    var type = event.currentTarget.dataset.type;
    var obj1 = wx.getStorageSync("add_order_1");
    if (obj1.model == 'offer_type_01' && (type == 'fres_type_01' || type == 'fres_type_03')) {
      return wx.showToast({
        title: '一口价方式不支持含有配送类的项目',
        icon: 'none'
      });
    }
    this.setData({
      type: type
    });
    var obj2 = wx.getStorageSync("add_order_3");
    if (obj2.type != type) {  
      wx.removeStorageSync('add_order_3');
      wx.removeStorageSync('add_order_4');
      wx.removeStorageSync('add_order_5');
      wx.removeStorageSync('add_order_6'); 
    }
    wx.setStorage({
      key: "add_order_3",
      data: {
        type: type
      }
    });
    wx.navigateTo({
      url: '/pages/order/addOrder4/addOrder4',
    }) 
  }, 
  initPage: function () {
    var that = this;
    common.httpReq('/bill/bd_enumdata?operationNo=queryenumdata', {
      simpleData: {
        fid: "a299d3fa3c4d49e4b72049a289e8b455"
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