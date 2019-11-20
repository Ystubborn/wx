 
var app = getApp();
var common = require("../../../common.js");
Page({ 
  onShow: function () { 
    this.initPage();
  },
  data: {
    balance:0,
    claim:0
  }, 
  onLoad: function (options) {
    this.initPage();
  },  
  initPage: function (fid) {
    var that = this; 
    wx.showLoading({
      title: '加载中',
    })
    common.httpReq('/dynamic/pay_settleorder?operationno=querybalance', {
      simpleData: {
        customerId: app.globalData.userId,
        appId: app.globalData.appId
      }
    }, function (res) {
      wx.hideLoading();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var res = res.data.operationResult.srvData;
        that.setData({ 
          balance: res.balance,
          claim: res.claim
        });
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    });
  },
  goRecharge: function () {
    wx.navigateTo({
      url: '/pages/my/recharge/recharge',
    })
  },
  goWalletList:function(){ 
    wx.navigateTo({
      url: '/pages/my/walletLogList/walletLogList',
    })
  },
  goPayPwd: function () {
    wx.navigateTo({
      url: '/pages/my/payPwd/payPwd',
    })
  },
  goCash:function(){
    wx.showModal({
      title: '提示',
      content: '目前小程序不支持提现，请用电脑登录商家端提现！',
    })
  }
})