var app = getApp();
var common = require("../../../common.js");
Page({
  data: {
    oldPwd: '',
    pwd: '',
    pwd2: ''
  },
  fillOldPwd: function(event) {
    var oldPwd = event.detail.value;
    this.setData({
      oldPwd: oldPwd
    });
  },
  fillPwd: function(event) {
    var pwd = event.detail.value;
    this.setData({
      pwd: pwd
    });
  },
  fillPwd2: function(event) {
    var pwd2 = event.detail.value;
    this.setData({
      pwd2: pwd2
    });
  },
  save: function() {
    if (this.data.oldPwd.length == 0) {
      return wx.showToast({
        title: '请输入旧密码',
        icon: 'none'
      })
    }
    if (this.data.pwd.length == 0) {
      return wx.showToast({
        title: '请输入新密码',
        icon: 'none'
      })
    }
    if (this.data.pwd2.length == 0) {
      return wx.showToast({
        title: '请重复输入新密码',
        icon: 'none'
      })
    }
    if (this.data.pwd != this.data.pwd2) {
      return wx.showToast({
        title: '两次新密码不一致',
        icon: 'none'
      })
    }

    wx.showLoading({
      title: '正在提交'
    })
    var that = this;
    common.httpReq('/dynamic/sys_mainfw?operationno=modifypwd', {
      simpleData: {
        oldpwd: that.data.oldPwd,
        newpwd: that.data.pwd,
        newrepwd: that.data.pwd2,
        appId: app.globalData.appId
      }
    }, function(res) {
      wx.hideLoading();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        wx.showModal({
          title: '提示',
          content: '密码修改成功',
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