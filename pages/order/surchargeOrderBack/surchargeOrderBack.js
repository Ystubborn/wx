var app = getApp();
var common = require("../../../common.js");
Page({

  data: {
    id: '', 
    remark: '', 
    feedbackResultFlag: false
  },
  onLoad: function(options) {
    this.setData({
      id: options.id
    }); 
  },  
  fillRemark: function(event) {
    var val = event.detail.value;
    this.setData({
      remark: val
    });
  },
  save: function() {
    let that = this;
    if (that.data.remark.length == 0) {
      return wx.showToast({
        title: '请填写驳回原因',
        icon: 'none'
      })
    }
    wx.showLoading({
      title: '正在提交',
    })
    common.httpReq('/bill/ydj_additionalfee?operationno=unauditbycustomer', {
      selectedRows: [{
        pkValue: that.data.id
      }],
      simpleData: { 
        opDesc: that.data.remark,
        appId: app.globalData.appId
      }
    }, function(res) {
      wx.hideLoading();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        that.setData({
          feedbackResultFlag: true
        });
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    });
  },
  toIndex: function() {
    wx.switchTab({
      url: '/pages/order/orderCenter/orderCenter'
    })
  },
  hideFeedbackResult: function() {
    var pages = getCurrentPages(); // 当前页面
    var beforePage = pages[pages.length - 2]; // 前一个页面 
    wx.navigateBack({
      success: function() {
        beforePage.initPage();
      }
    });
  }
})