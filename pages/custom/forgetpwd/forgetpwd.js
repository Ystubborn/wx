var app = getApp();
var common = require("../../../common.js");
var timeTask;
var isSendSms=false;
Page({
  //页面数据
  data: {
    mobile: '',
    sms: '',
    smsTxt: '获取验证码',
    num: 60,
    disableComp: false, 
    focus: '',
    pwd1: '',
    pwd2: '',
  },
  fillFocus: function (e) {
    this.setData({
      focus: e.currentTarget.dataset.name
    });
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
  fillPwd1: function (e) {
    var val = e.detail.value;
    this.setData({
      pwd1: val
    });
  },
  fillPwd2: function (e) {
    var val = e.detail.value;
    this.setData({
      pwd2: val
    });
  },  
  validMobile:function(){ 
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
      url: app.globalData.domain2 + '/api/User/CheckIsRegister',
      header: {
        'content-type': 'application/json',
        'accept': '	application/json;charset=utf-8',
        'X-AppId': app.globalData.appId
      },
      data: {
        fphone: that.data.mobile
      },
      success(res) {
        if (res.statusCode == 200) {
           if(res.data==1){ 
              that.sendSms();
           } else { 
             wx.showModal({
               title: '提示',
               content: '该号码未注册，请先注册！',
               success: function () {
                 wx.navigateBack();
               }
             })
           }
        } else { 
          wx.hideLoading();
          wx.showToast({
            title: '服务器异常，请稍后再试！',
            icon: 'none'
          })
        }
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
    if (!common.checkPhone(this.data.mobile)) {
      return wx.showToast({
        title: '手机号码格式错误',
        icon: 'none'
      });
    }
    if (isSendSms){
      return;
    }
    isSendSms = true;
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
          var numTemp = that.data.num - 1;
          that.setData({
            num: numTemp,
            smsTxt: numTemp + '秒重发',
            disableComp: true
          });
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
            title: '验证码发送失败',
            icon: 'none'
          })
        }
        isSendSms = false;
      }
    })
  },
  toRegist: function() {
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
    if (common.trim(this.data.sms).length != 4) {
      return wx.showToast({
        title: '请输入4位验证码',
        icon: 'none'
      });
    }  
    if (common.trim(this.data.pwd1).length < 6) {
      return wx.showToast({
        title: '请输入至少6位密码',
        icon: 'none'
      });
    }

    if (common.trim(this.data.pwd2).length < 6) {
      return wx.showToast({
        title: '请输入至少6位密码',
        icon: 'none'
      });
    }
    if (this.data.pwd1 != this.data.pwd2) {
      return wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none'
      });
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
          that.resetPwd();
        } else {
          wx.showToast({
            title: '验证码错误',
            icon: 'none'
          })
        }
      }
    })
  },  
  resetPwd:function(){
    wx.showLoading({
      title: '正在设置密码...',
    })
    var that = this;
    wx.request({
      url: app.globalData.domain + '/authuser/update.json',
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      data: {
        mobilePhone: this.data.mobile,
        activeCode: this.data.sms,
        passWord: this.data.pwd1,
        confirmPassword: this.data.pwd2,
        simpleData: {
          appId: app.globalData.appId
        }
      },
      success(res) {
        wx.hideLoading();
        console.log(res);
        if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
          wx.showModal({
            title: '提示',
            content: '恭喜您，修改密码成功！',
            success: function () {
              wx.reLaunch({
                url: '/pages/custom/login/login'
              });
            }
          });
        } else {
          wx.showToast({
            title: res.data.responseStatus.message,
            icon: 'none'
          })
        }
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: "左右手",
      path: '/pages/custom/index/index'
    }
  } 
})