var app = getApp();
var common = require("../../../common.js");
Page({
  onShow: function() { 
    this.initPage();
  },
  data: {
    fname: '',
    fphone: '',
    fimageurl: '../../../images/my/photo.png',
    fscore: '0',
    fcouponscount: '0',
    fbalance: '0'
  },
  onLoad: function() {
    this.initPage();
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
          fname: res.fname,
          fphone: res.fphone,
          fimageurl: res.fimageurl,
          fscore: res.fscore,
          fcouponscount: res.fcouponscount,
          fbalance: res.fbalance
        });
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    });
  },
  goPerson: function() {
    var fimageurl = this.data.fimageurl ? this.data.fimageurl : "../../../images/my/photo.png";
    wx.navigateTo({
      url: '/pages/my/config/config?img=' + encodeURIComponent(fimageurl) + '&name=' + this.data.fname
    })
  },
  goWalletList: function() {
    wx.navigateTo({
      url: '/pages/my/walletLogList/walletLogList',
    })
  },
  goWallet: function() {
    wx.navigateTo({
      url: '/pages/my/wallet/wallet',
    })
  },
  goCoupon: function() {
    wx.navigateTo({
      url: '/pages/my/cashCoupon/cashCoupon',
    })
  },
  goRecharge: function() {
    wx.navigateTo({
      url: '/pages/my/recharge/recharge',
    })
  },
  goHelp: function() {
    wx.navigateTo({
      url: '/pages/my/help/help',
    })
  },
  goCenter:function(){
    wx.showModal({
      title: '提示',
      content: '正在完善中...',
    })
  },
  onShareAppMessage: function () {
    return {
      title: "左右手",
      path: '/pages/custom/index/index'
    }
  } 
})