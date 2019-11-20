var app = getApp();
var common = require("../../../common.js");
var timeTask;
Page({
  data: {
    pwdVal: '', //输入的密码
    payFocus: false, //文本框焦点
    pwdVal1: '', //输入的密码
    payFocus1: false, //文本框焦点
    pwdVal2: '', //输入的密码
    payFocus2: false, //文本框焦点
    mobile: '',
    sms: '',
    smsTxt: '获取验证码',
    num: 60,
    disableComp: false,
    fispaypwd:0
  },
  onLoad: function() {
    this.initPage();
  },
  /**
   * 获取焦点
   */
  getFocus: function() {
    this.setData({
      payFocus: true,
      payFocus1: false,
      payFocus2: false,
      pwdVal: ''
    });
  },
  /**
   * 输入密码监听
   */
  inputPwd: function(e) {
    this.setData({
      pwdVal: e.detail.value
    });
    if (e.detail.value.length >= 6) {

    }
  },
  /**
   * 获取焦点
   */
  getFocus1: function() {
    this.setData({
      payFocus1: true,
      payFocus: false,
      payFocus2: false,
      pwdVal1: ''
    });
  },
  /**
   * 输入密码监听
   */
  inputPwd1: function(e) {
    this.setData({
      pwdVal1: e.detail.value
    });
  },
  /**
   * 获取焦点
   */
  getFocus2: function() {
    this.setData({
      payFocus2: true,
      payFocus: false,
      payFocus1: false,
      pwdVal2: ''
    });
  },
  /**
   * 输入密码监听
   */
  inputPwd2: function(e) {
    this.setData({
      pwdVal2: e.detail.value
    });
  },
  fillSms: function(e) {
    var val = e.detail.value;
    this.setData({
      sms: val
    });
  },
  initPage: function() {
    var that = this;
    common.httpReq('/bill/ydj_customer?operationno=getcustomerinfo', {
      selectedRows: {
        pkValue: app.globalData.userId
      }
    }, function(res) {
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var res = res.data.operationResult.srvData;
        that.setData({
          mobile: res.fphone
        });
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
      });
    common.httpReq('/bill/ydj_customer?operationno=getcustomerpaypwd', {
      selectedRows: {
        pkValue: app.globalData.userId
      }
    }, function (res) {
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) { 
        var res = res.data.operationResult.srvData;
        that.setData({
          fispaypwd: res.fispaypwd
        });
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    });
  },
  sendSms: function() {
    if (common.trim(this.data.mobile).length != 11) {
      return wx.showToast({
        title: '请输入11位手机号码',
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
  validSms: function() {
    if (this.data.sms == '') {
      return wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    }
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
          that.save();
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
    if (this.data.fispaypwd==1 && this.data.pwdVal.length != 6) {
      return wx.showToast({
        title: '请输入6位旧支付密码',
        icon: 'none'
      })
    }
    if (this.data.pwdVal1.length != 6) {
      return wx.showToast({
        title: '请输入6位新支付密码',
        icon: 'none'
      })
    }
    if (this.data.pwdVal2.length != 6) {
      return wx.showToast({
        title: '请重复输入6位新支付密码',
        icon: 'none'
      })
    }
    if (this.data.pwdVal1 != this.data.pwdVal2) {
      return wx.showToast({
        title: '两次新密码不一致',
        icon: 'none'
      })
    }
    wx.showLoading({
      title: '正在提交'
    })
    var that = this;
    common.httpReq('/dynamic/ydj_customer?operationno=updatepaypwd', {
      simpleData: {
        oldPayPwd: that.data.pwdVal,
        newPayPwd: that.data.pwdVal1,
        repeatPayPwd: that.data.pwdVal2,
        appId: app.globalData.appId
      },
      selectedRows: {
        pkValue: app.globalData.userId
      }
    }, function(res) {
      wx.hideLoading();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        wx.showModal({
          title: '提示',
          content: '支付密码修改成功',
          success: function() {
            wx.navigateBack();
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