var app = getApp();
var common = require("../../../common.js");
var count = 0;
Page({
  onShow: function() { 
    count = 0;
    this.initPage();
  },
  data: {
    keyword: '',
    sht_serstatus03: 0, //待报价
    sht_serstatus10: 0, //待雇佣
    sht_serstatus11: 0, //待支付
    sht_serstatus12: 0, //待预约
    sht_serstatus13: 0, //待上门
    sht_serstatus06: 0, //服务中
    sht_serstatus07: 0, //待验收
    ffeed: 0, //问题单
    fchange: 0, //补价单
    fadditional: 0, //附加费用
    fishang: 0 //挂起单
  },
  onLoad: function (options) {
  },
  onPullDownRefresh: function() {
    this.initPage();
  },
  initPage: function() {
    var that = this;
    common.httpReq('/bill/ydj_merchantorder?operationNo=getMorderStatistics', {
      simpleData: {
        merchantId: app.globalData.userId,
        appId: app.globalData.appId
      }
    }, function(res) {
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var arrayList = res.data.operationResult.srvData;
        if (!arrayList) {
          return wx.showToast({
            title: '服务异常，请稍后重试',
            icon: 'none'
          })
        }
        var sht_serstatus03 = 0,
          sht_serstatus10 = 0,
          sht_serstatus11 = 0,
          sht_serstatus12 = 0,
          sht_serstatus13 = 0,
          sht_serstatus06 = 0,
          sht_serstatus07 = 0;
        for (var item of arrayList) {
          if (item.fname == 'sht_serstatus03') {
            sht_serstatus03 = item.fcount;
          } else if (item.fname == 'sht_serstatus10') {
            sht_serstatus10 = item.fcount;
          } else if (item.fname == 'sht_serstatus11') {
            sht_serstatus11 = item.fcount;
          } else if (item.fname == 'sht_serstatus12') {
            sht_serstatus12 = item.fcount;
          } else if (item.fname == 'sht_serstatus13') {
            sht_serstatus13 = item.fcount;
          } else if (item.fname == 'sht_serstatus06') {
            sht_serstatus06 = item.fcount;
          } else if (item.fname == 'sht_serstatus07') {
            sht_serstatus07 = item.fcount;
          }
        }
        that.setData({
          sht_serstatus03: sht_serstatus03,
          sht_serstatus10: sht_serstatus10,
          sht_serstatus11: sht_serstatus11,
          sht_serstatus12: sht_serstatus12,
          sht_serstatus13: sht_serstatus13,
          sht_serstatus06: sht_serstatus06,
          sht_serstatus07: sht_serstatus07
        });
        if (count >0) {
          wx.stopPullDownRefresh();
          count = 0;
        } else {
          count++;
        }
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
        if (count >0) {
          wx.stopPullDownRefresh();
          count = 0;
        } else {
          count++;
        }
      }
    }, "POST", function() {
      if (count > 0) {
        wx.stopPullDownRefresh();
        count = 0;
      } else {
        count++;
      }
    });

    common.httpReq('/bill/ydj_merchantorder?operationNo=getordercounting', {
      simpleData: {
        merchantId: app.globalData.userId,
        appId: app.globalData.appId
      }
    }, function(res) {
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var arrayList = res.data.operationResult.srvData;
        if (!arrayList) {
          return wx.showToast({
            title: '服务异常，请稍后重试',
            icon: 'none'
          });
        }
        var ffeed = 0,
          fchange = 0,
          fadditional = 0,
          fishang = 0;
        for (var item of arrayList) {
          if (item.fname == 'ffeed') {
            ffeed = item.fcount;
          } else if (item.fname == 'fchange') {
            fchange = item.fcount;
          } else if (item.fname == 'fadditional') {
            fadditional = item.fcount;
          } else if (item.fname == 'fishang') {
            fishang = item.fcount;
          }
        }
        that.setData({
          ffeed: ffeed,
          fchange: fchange,
          fadditional: fadditional,
          fishang: fishang
        });
        if (count > 0) {
          wx.stopPullDownRefresh();
          count = 0;
        } else {
          count++;
        }
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
        if (count > 0) {
          wx.stopPullDownRefresh();
          count = 0;
        } else {
          count++;
        }
      }
    }, "POST", function() {
      if (count > 0) {
        wx.stopPullDownRefresh();
        count = 0;
      } else {
        count++;
      }
    });
  },
  goOrderList: function(event) {
    var status = event.currentTarget.dataset.status;
    wx.navigateTo({
      url: '/pages/order/orderList/orderList?status=' + status,
    })
  },
  goSuspendOrderList: function(event) {
    var status = event.currentTarget.dataset.status;
    wx.navigateTo({
      url: '/pages/order/suspendOrderList/suspendOrderList',
    })
  },
  fillkeyword: function(e) {
    this.setData({
      keyword: e.detail.value
    });
  },
  search: function() {
    wx.navigateTo({
      url: '/pages/order/orderList/orderList?status=0&keyword=' + this.data.keyword,
    })
  },
  goProblemOrderList: function() {
    wx.navigateTo({
      url: '/pages/order/problemOrderList/problemOrderList'
    })
  },
  goPatchOrderList: function() {
    wx.navigateTo({
      url: '/pages/order/patchOrderList/patchOrderList'
    })
  },
  goSurchargeOrderList: function() {
    wx.navigateTo({
      url: '/pages/order/surchargeOrderList/surchargeOrderList'
    })
  },
  onShareAppMessage: function () {
    return {
      title: "左右手",
      path: '/pages/custom/index/index'
    }
  } 

});