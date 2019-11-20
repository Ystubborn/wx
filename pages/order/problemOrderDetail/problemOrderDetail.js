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
    showAzxxFlag: true,
    cancelFlag: false
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
    common.httpReq('/list/ser_servicefeed.json?operationno=initbill', {
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
        data.fprograph.url = common.trim(data.fprograph.url).length > 0 ? data.fprograph.url.split(',') : [];
        data.freplyimage.freplyimageurl = common.trim(data.freplyimage.freplyimageurl).length > 0 ? data.freplyimage.freplyimageurl.split(',') : [];
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
  showCancelOrder:function(){
    this.setData({
      cancelFlag: true
    });
  },
  hideCancelOrder:function(){
    this.setData({
      cancelFlag: false
    });
  },
  cancelOrder:function(){
    wx.showLoading({
      title: '正在提交',
    })
    var that=this;
    common.httpReq('/list/ser_servicefeed.json?operationno=Feedback_cancel', {
      selectedRows: [{
        pkValue: that.data.id
      }],
      simpleData: { 
        appId: app.globalData.appId
      }
    }, function (res) {
      wx.hideLoading();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        that.setData({
          cancelFlag: false
        });
        that.initPage();
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    });
  },
  acceptOrder:function(){
    wx.navigateTo({
      url: '/pages/order/problemOrderAccept/problemOrderAccept?id='+this.data.id,
    })
  }
})