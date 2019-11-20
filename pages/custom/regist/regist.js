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
    type: 0,
    typeIndex: 0,
    code: '',
    agree: true,
    item: [{
      id: "merchant_type01",
      name: "商家"
    }, {
      id: "merchant_type02",
      name: "厂家"
    }, {
      id: "merchant_type03",
      name: "电商"
    }, {
      id: "merchant_type04",
      name: "装修公司"
    }, {
      id: "merchant_type05",
      name: "个人"
    }],
    focus: ''
  },
  fillFocus: function (e) {
    this.setData({
      focus: e.currentTarget.dataset.name
    });
  }, 
  bindPickerChange: function(e) {
    this.setData({
      typeIndex: e.detail.value,
      type: this.data.item[e.detail.value].id
    })
  },
  initPage: function() {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/bill/bd_enumdata?operationNo=queryenumdata',
      header: {
        'content-type': 'application/json',
        'accept': '	application/json;charset=utf-8'
      }, 
      data: {
        simpleData: {
          fid: "b870b8c44c6d4ab58da05d1c82b2890c"
        }
      },
      success(res) {
        console.log(res);
        if (res.statusCode == 200) {

        } else {
          wx.showToast({
            title: res.data.responseStatus.message,
            icon: 'none'
          })
        }
      }
    })
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
  fillType: function(e) {
    var val = e.detail.value;
    this.setData({
      type: val
    });
  },
  fillCode: function(e) {
    var val = e.detail.value;
    this.setData({
      code: val
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
              wx.showModal({
                title: '提示',
                content: '该号码已注册，请直接登录！',
                success:function(){
                  wx.navigateBack();
                }
              })
           }else{
             that.sendSms();
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

    if (common.trim(this.data.type).length == 0) {
      return wx.showToast({
        title: '请选择注册类目',
        icon: 'none'
      });
    }

    if (!this.data.agree) {
      return wx.showToast({
        title: '请同意注册协议',
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
          wx.navigateTo({
            url: '/pages/custom/setpwd/setpwd?mobile=' + that.data.mobile + '&activeCode=' + that.data.sms + '&joinCode=' + that.data.code + '&type=' + that.data.type,
          })
        } else {
          wx.showToast({
            title: '验证码错误',
            icon: 'none'
          })
        }
      }
    })
  },
  agreeNo: function() {
    this.setData({
      agree: false
    });
  },
  agreeYes: function() {
    this.setData({
      agree: true
    });
  },
  toUserRegistProtocol:function(){
    wx.navigateTo({
      url: '/pages/protocol/protocol?title=商家注册协议&type=singlearticle_14'
    })
  },
  toLawProtocol: function () {
    wx.navigateTo({
      url: '/pages/protocol/protocol?title=法律声明&type=singlearticle_19'
    })
  },
  onShareAppMessage: function () {
    return {
      title: "左右手",
      path: '/pages/custom/index/index'
    }
  } 
})