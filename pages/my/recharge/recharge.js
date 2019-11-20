var app = getApp();
var common = require("../../../common.js");
Page({
  data: {
    val: 0,
    fid: '',
    hasActive: true,
    items: [],
    map: {}
  },
  onLoad: function() {
    wx.showLoading({
      title: '正在加载',
      icon:'none'
    })
    var that = this;
    common.httpReq('/bill/ydj_rechargediscount?operationno=getrechargediscount', {
      simpleData: {
        fdealerid: app.globalData.userId,
        appId: app.globalData.appId
      }
    }, function(res) {
      wx.hideLoading();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var res = res.data.operationResult.srvData;
        var map = {};
        for (var i = 0; i < res.length; i++) {
          map[res[i].fmoney] = res[i].fid;
        }
        that.setData({
          items: res,
          map: map
        });
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    });
  },
  selectMoney: function(event) {
    var val = event.currentTarget.dataset.val;
    var fid = event.currentTarget.dataset.fid;
    this.setData({
      val: val,
      fid: fid
    });
  },
  fillMoney: function(event) {
    var val = event.detail.value;
    this.setData({
      val: val,
      fid: this.data.map[val]
    });
  },
  goAddOrder: function() {
    if (this.data.val == 0) {
      return wx.showToast({
        title: '请选择充值金额',
        icon: 'none'
      });
    }
    wx.showLoading({
      title: '正在提交'
    })
    var that = this;
    common.httpReq('/bill/ydj_customer?operationno=onlinerechargeapplet', {
      selectedRows: {
        pkValue: app.globalData.userId
      },
      simpleData: {
        frechargeid: that.data.fid,
        openid: app.globalData.openId,
        frechargemoney: that.data.val,
        fpaymethod: "WeChat" 
      } 
    }, function (res) {
      wx.hideLoading();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) { 
        var res = res.data.operationResult.srvData;
        wx.requestPayment({
          timeStamp: res.timeStamp,
          nonceStr: res.nonceStr,
          package: res.package,
          signType: res.signType,
          paySign: res.paySign,
          success(res) {  
            wx.showModal({
              title: '支付提示',
              content: '成功充值' + that.data.val+'元！请查看账号余额！' 
            }) 
          },
          fail(res) { 
            if (res.errMsg == "requestPayment:fail cancel")
            { 
              wx.showToast({
                title: '支付已取消！',
                icon:'none'
              });
            }else{ 
              wx.showToast({
                title: '支付失败，请稍后重试！',
                icon: 'none'
              }); 
            }
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