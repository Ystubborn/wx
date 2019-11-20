var app = getApp();
var common = require("../../../common.js");
var timeTask;
Page({
  //页面数据
  data: {
    pwd1: '',
    pwd2: '',
    mobile: '',
    activeCode: '',
    joinCode: '',
    type: '',
    focus:''
  },
  //页面初次加载
  onLoad: function(option) {
    this.setData({
      mobile: option.mobile,
      activeCode: option.activeCode,
      joinCode: option.joinCode,
      type: option.type
    });
  },
  fillFocus: function (e) {
    this.setData({
      focus: e.currentTarget.dataset.name
    });
  },
  fillPwd1: function(e) {
    var val = e.detail.value;
    this.setData({
      pwd1: val
    });
  },
  fillPwd2: function(e) {
    var val = e.detail.value;
    this.setData({
      pwd2: val
    });
  }, 
  saveCode: function () {
    if (this.data.joinCode.length==0) {
      return;
    } 
    var that = this;
    wx.request({
      url: app.globalData.domain2 + '/api/User/AddInviteCode',
      header: {
        'content-type': 'application/json',
        'accept': '	application/json;charset=utf-8',
        'X-AppId': app.globalData.appId
      },
      data: {
        fphone: that.data.mobile,
        invitecode:that.data.joinCode
      },
      success(res) { 
      }
    });
  },
  toRegist: function() {
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
    wx.showLoading({
      title: '正在注册...',
    })
    var that = this;
    wx.request({
      url: app.globalData.domain + '/reguser?format=json',
      header: {
        'content-type': 'application/json'
      }, 
      method:'POST',
      data: {
        phoneNumber: this.data.mobile,
        userName: this.data.mobile,
        activeCode: this.data.activeCode,
        joinCode: this.data.activeCode,
        passWord: this.data.pwd1,
        rePassword: this.data.pwd2,
        company: "",
        userType: 32768,
        meta: {
          registerRole: "商户通用户",
          merchant_type: this.data.type,
          joinEnterpriseId: app.globalData.companyId,
          fname: this.data.mobile,
          fduty: this.data.mobile,
          fservernature: 'merchant_servernature01',
          fphone: this.data.mobile,
          fprovince: '',
          fcity: '',
          fregion: '',
          faddress: ''
        },
        simpleData: {
          appId: app.globalData.appId
        }
      },
      success(res) {
        wx.hideLoading();
        if (res.statusCode == 200 && res.data.userId) {
          that.saveCode();
          wx.showModal({
            title: '提示',
            content: '恭喜您，注册成功！',
            success:function(){
              wx.reLaunch({
                url: '/pages/custom/login/login'
              });
            }
          }); 
        } else {
          wx.showToast({
            title: '您的账号已注册，请直接登录',
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