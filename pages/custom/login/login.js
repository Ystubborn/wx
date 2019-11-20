var app = getApp();
var common = require("../../../common.js");
var timeTask;
Page({
  //页面数据
  data: {
    mobile: '',
    password: '',
    sms: null,
    smsTxt: '获取验证码',
    num: 60,
    disableComp: false,
    loading: false,
    loginText: '登录',
    focus:''
  },
  fillFocus:function(e){
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
  fillPwd: function(e) {
    var val = e.detail.value;
    this.setData({
      password: val
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
        'content-type': 'application/json',
        'accept': '	application/json;charset=utf-8',
        'X-AppId': app.globalData.appId
      },
      data: {
        mobilePhone: this.data.mobile
      },
      success(res) {
        if (res.statusCode == 200) {
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
  toRegist: function() {
    wx.navigateTo({
      url: '/pages/custom/regist/regist'
    });
  }, 
  toForgetPwd:function(){
    wx.navigateTo({
      url: '/pages/custom/forgetpwd/forgetpwd'
    });
  },
  userBindOpenid: function () {
    var that=this;
    wx.request({
      url: app.globalData.domain2+'/api/User/UserBindOpenid',
      header: {
        'content-type': 'application/json',
        'accept': '	application/json;charset=utf-8',
        'X-AppId': app.globalData.appId
      },
      data: {
        username: that.data.mobile,
        userpwd: that.data.password,
        openid: app.globalData.openId
      },
      success(res) {
        if (res.statusCode == 200 && res.data) {
          wx.switchTab({
            url: '/pages/index/index'
          });
        }else{
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    });
  },
  toLogin: function() {
    if (common.trim(this.data.mobile).length != 11) {
      return wx.showToast({
        title: '请输入11位手机号码',
        icon: 'none'
      });
    }

    if (common.trim(this.data.password).length < 1) {
      return wx.showToast({
        title: '请输入密码',
        icon: 'none'
      });
    }
    this.setData({
      loading: true,
      loginText: '正在登录...'
    });
    var that = this;
    wx.request({
      url: app.globalData.domain + '/auth/credentials',
      header: {
        'Content-Type': 'application/json',
        'X-AppId': app.globalData.appId
      },
      data: {
        format:'json',
        userName: that.data.mobile,
        password: that.data.password
      },
      success(res) {
        if (res.statusCode == 200) {
          var datas = res.data;
          var company = JSON.parse(datas.meta.company); 
          if (company.companyId != app.globalData.companyId){ 
            that.setData({
              loading: false,
              loginText: '登录'
            });
           return wx.showToast({
              title: '本小程序系统只给抢单平台商户使用！',
              icon: 'none'
            });
          }
          var userInfo = JSON.parse(datas.meta.merchantData); 
          app.globalData.userId = userInfo.id;
          app.globalData.userName = datas.userName;
          app.globalData.token = datas.meta.usertoken; 
          app.globalData.companyCount = JSON.parse(datas.meta.companys).length;
          app.globalData.cookie = 'ss-opt=temp; ' + datas.meta.usertoken + '=' + datas.sessionId;
          that.userBindOpenid(); 
        } else {
          that.setData({
            loading: false,
            loginText: '登录'
          });
          wx.showToast({
            title: res.data.responseStatus.message,
            icon: 'none'
          })
        }
      },
      fail: function (e) { 
        that.setData({
          loading: false,
          loginText: '登录'
        });
        wx.showToast({
          title: JSON.stringify(e),
          icon: 'none'
        })
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