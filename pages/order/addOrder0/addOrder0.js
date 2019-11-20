var app = getApp();
var common = require("../../../common.js");
Page({
  onShow: function () { 
    var orderId = wx.getStorageSync('orderId')
    if (orderId && orderId.length > 0) {
      wx.showLoading({
        title: '加载中',
      })
      wx.navigateTo({
        url: '/pages/order/orderDetail/orderDetail?id=' + orderId
      });
      wx.removeStorageSync('orderId');
    }  
  },
  //页面数据
  data: {
  }, 
  goAddOrder: function(){ 
    var that = this;
    common.httpReq('/bill/ydj_merchantorder?operationno=checknewbill', {
      simpleData: {
        merchantId: app.globalData.userId,
        appId: app.globalData.appId
      }
    }, function (res) {
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var result = res.data.operationResult.srvData.linkUnclosedBills.ydj_servicechange;
        if(result.length>0){
          wx.showModal({
            title: '提示',
            content: '您当前还有'+result.length+'个待处理订单，请先处理完再下单',
            success(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/order/orderCenter/orderCenter'
                })
              }
            }
          })
        }else{
          wx.navigateTo({
            url: '/pages/order/addOrder1/addOrder1',
          })
        } 
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    }); 
  },
  onShareAppMessage: function () {
    return {
      title: "左右手",
      path: '/pages/custom/index/index'
    }
  } 
})