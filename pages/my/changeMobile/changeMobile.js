var app = getApp();
var common = require("../../../common.js");
var timeTask;
Page({

  data: {
    mobile: '',
    sms: '',
    smsTxt: '获取验证码',
    num: 60,
    disableComp: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  fillMobile: function(e) {
    var val = e.detail.value;
    this.setData({
      mobile: val
    });
  },
  fillSms: function(e) {
    var val = e.detail.value;
    this.setData({
      sms: val
    });
  },
  sendSms: function() {
    if (common.trim(this.data.mobile).length != 11) {
      return wx.showToast({
        title: '请输入11位手机号码',
        icon: 'none'
      });
    }
    if (!common.checkPhone(this.data.mobile)) {
      return wx.showToast({
        title: '手机号码格式错误',
        icon: 'none'
      });
    }
    var that = this;
    wx.request({
      url: app.globalData.domain + '/sms/code?format=json',
      header: {
        'content-type': 'application/json'
      },
      data: {
        mobilePhone: this.data.mobile
      },
      success(res) {
        if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
          timeTask = setInterval(function() {
            if (that.data.num > 1) {
              var numTemp = that.data.num - 1;
              that.setData({
                num: numTemp,
                smsTxt: numTemp + '秒重发',
                disableComp: true
              });
            } else {
              that.setData({
                num: 60,
                smsTxt: '获取验证码',
                disableComp: false
              });
              clearInterval(timeTask);
            }
          }, 1000);
          wx.showToast({
            title: res.data.operationResult.simpleMessage,
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: res.data.responseStatus.message,
            icon: 'none'
          })
        }
      }
    })
  },
  save: function() {
    if (common.trim(this.data.mobile).length != 11) {
      return wx.showToast({
        title: '请输入11位手机号码',
        icon: 'none'
      });
    }

    if (common.trim(this.data.sms).length != 4) {
      return wx.showToast({
        title: '请输入4位验证码',
        icon: 'none'
      });
    }

    wx.showLoading({
      title: '正在提交'
    })

    var that = this;
    wx.request({
      url: app.globalData.domain + '/sms/code/validate.json',
      header: {
        'content-type': 'application/json'
      },
      data: {
        mobilePhone: this.data.mobile,
        authCode: this.data.sms
      },
      success(res) {
        if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
          that.submit();
        } else {
          wx.hideLoading();
          wx.showToast({
            title: res.data.responseStatus.message,
            icon: 'none'
          })
        }
      }
    })
  },
  submit: function() {
    var that = this;
    common.httpReq('/dynamic/ydj_customer?operationno=setphone', {
      simpleData: {
        phone: that.data.mobile,
        appId: app.globalData.appId
      },
      selectedRows: {
        PKValue: app.globalData.userId
      }
    }, function(res) {
      wx.hideLoading();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        wx.showModal({
          title: '提示',
          content: '手机号修改成功,请用新号码重新登录',
          success: function() {
            wx.reLaunch({
              url: '/pages/custom/login/login'
            });
            return; 
          }
        })
      } else {
        wx.showToast({
          title: res.data.operationResult.simpleMessage,
          icon: 'none'
        })
      }
    });
  }
})