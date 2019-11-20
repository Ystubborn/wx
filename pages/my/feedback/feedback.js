var app = getApp();
var common = require("../../../common.js");
Page({

  data: {
    items: [],
    selectIndex: 0,
    selectItem: '',
    name: '',
    mobile: '',
    remark: ''
  },
  onLoad: function(options) {
    this.initPage();
  },
  initPage: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    common.httpReq('/bill/bd_enumdata?operationNo=queryenumdata', {
      simpleData: {
        fid: "8359F8D1AE7643B09A7AD970EC4D5EDC"
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
  fillName: function(event) {
    var val = event.detail.value;
    this.setData({
      name: val
    });
  },
  fillMobile: function(event) {
    var val = event.detail.value;
    this.setData({
      mobile: val
    });
  },
  fillRemark: function(event) {
    var val = event.detail.value;
    this.setData({
      remark: val
    });
  },
  save: function () {
    let that = this;
    if (that.data.name.length == 0) {
      return wx.showToast({
        title: '请填写联系人',
        icon: 'none'
      })
    }
    if (that.data.mobile.length == 0) {
      return wx.showToast({
        title: '请填写联系电话',
        icon: 'none'
      })
    }
    if (that.data.remark.length==0){
       return wx.showToast({
         title: '请填写问题描述',
         icon:'none'
       })
    }
    wx.showLoading({
      title: '正在提交',
    })
    common.httpReq('/bill/ser_customerservicehelp?operationNo=submitkefuhelp', {
      fusertype: 'usertype_01',
      fdealerid: app.globalData.userId,
      fhelptype: that.data.selectItem,
      fdescription: that.data.remark,
      flinkid: that.data.name,
      fphone: that.data.mobile,
      simpleData: {
        appId: app.globalData.appId
      }
    }, function(res) {
      wx.hideLoading();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        wx.showModal({
          title: '提示',
          content: '您的问题建议已反馈成功！',
          success: function() {
            wx.navigateBack();
          }
        })
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    });
  }
})