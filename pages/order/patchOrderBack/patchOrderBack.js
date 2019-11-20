var app = getApp();
var common = require("../../../common.js");
Page({

  data: {
    id: '',
    items: [],
    selectIndex: 0,
    selectItem: '',
    remark: '',
    imgList: [],
    imgIdList: [],
    feedbackResultFlag: false
  },
  onLoad: function(options) {
    this.setData({
      id: options.id
    });
    this.initPage();
  },
  initPage: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    common.httpReq('/bill/bd_enumdata?operationNo=queryenumdata', {
      simpleData: {
        fid: "50AA7CEE2E384CE5AA75DC1283378C05"
      }
    }, function(res) {
      wx.hideLoading();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var result = res.data.operationResult.srvData.datas;
        that.setData({
          items: result,
          selectItem: result[0].fentryid
        });
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    });
  },
  bindPickerChange: function(e) {
    this.setData({
      selectIndex: e.detail.value,
      selectItem: this.data.items[e.detail.value].fentryid
    })
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
        title: '请填写问题描述',
        icon: 'none'
      })
    }
    wx.showLoading({
      title: '正在提交',
    })
    common.httpReq('/bill/ydj_servicechange?operationno=unauditbycustomer', {
      selectedRows: [{
        pkValue: that.data.id
      }],
      simpleData: {
        opReasonenum: that.data.selectItem,
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