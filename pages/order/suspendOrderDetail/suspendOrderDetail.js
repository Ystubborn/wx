var app = getApp();
var common = require("../../../common.js");
Page({
  data: {
    id: '',
    data: {},
    ready: false,
    showWtdxxFlag: true,
    showShxxFlag: true,
    showDdxxFlag: true,
    showAzxxFlag: true
  },
  onLoad: function(options) { 
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      id: options.id
    });
    this.initPage();
  },
  initPage: function() {
    var that = this;
    that.setData({
      data: {},
      ready: false
    }); 
    common.httpReq('/bill/ydj_merchantorder.json?operationno=initbill', {
      selectedRows: [{
        pkValue: that.data.id
      }],
      simpleData: {
        id: that.data.id,
        appId: app.globalData.appId
      }
    }, function(res) {
      wx.hideLoading();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var data = res.data.operationResult.srvData.uiData;
        data.fimage.fimageurl = common.trim(data.fimage.fimageurl).length > 0 ? data.fimage.fimageurl.split(',') : [];
        that.setData({
          data: data,
          ready: true
        });
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    });
  },
  showWtdxx: function() {
    this.setData({
      showWtdxxFlag: !this.data.showWtdxxFlag
    });
  },
  showShxx: function() {
    this.setData({
      showShxxFlag: !this.data.showShxxFlag
    });
  },
  showDdxx: function() {
    this.setData({
      showDdxxFlag: !this.data.showDdxxFlag
    });
  },
  showAzxx: function() {
    this.setData({
      showAzxxFlag: !this.data.showAzxxFlag
    });
  },
  callMobile: function(e) {
    var mobile = e.currentTarget.dataset.mobile;
    wx.makePhoneCall({
      phoneNumber: mobile
    })
  },
  showImg: function(event) {
    var imgs = event.currentTarget.dataset.imgs;
    wx.previewImage({
      current: imgs[0],
      urls: imgs
    })
  },
  showCode: function () {
    var that = this;
    wx.showModal({
      title: '当前订单完工码为：',
      content: that.data.data.fcompletioncode
    })
  },
  showOrder: function () {
    wx.navigateTo({
      url: '/pages/order/orderDetail/orderDetail?id=' + this.data.data.id
    })
  }
})