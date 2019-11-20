var app = getApp();
var common = require("../../../common.js");
Page({ 
  data: {
    id:''
  },
  onUnload:function(){
    wx.navigateBack({
      delta:6
    })
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    });
  },
  goDetail: function() {
    var id = this.data.id;
    // wx.navigateBack({
    //   delta: 7,
    //   complete:function(){
    //     wx.navigateTo({
    //       url: '/pages/order/orderDetail/orderDetail?id=' + id,
    //     })
    //   }
    // });
    wx.setStorageSync('orderId',id);
    wx.switchTab({ 
      url: '/pages/order/addOrder0/addOrder0', 
    });
  },
  goAddOrder: function() {
    wx.navigateBack({
      delta: 7
    });
  }

})