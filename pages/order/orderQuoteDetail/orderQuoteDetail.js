var app = getApp();
var common = require("../../../common.js");
Page({
  data: {
    id: '',
    isRuleTrue: false,
    items: [],
    pageIndex: 1,
    pageSize: 10,
    allPage: 0,
    nodata: false,
    nomoredata: false,
    fid: '',
    fquotationamount: '',
    fdescription: '',
    fvaliditydate: '',
    ffastestdate: '',
    fserviceentry: '',
    foffertype: '',
    ffreightamount: 0,
    fhandlingamount: 0,
    fliftbuildamount: 0,
    fshippingamount: 0
  },

  onLoad: function(options) {
    this.setData({
      id: options.id,
      pageIndex: 1,
      items: []
    });
    this.loadPage();
  },
  loadPage: function() {
    var that = this;
    common.httpReq('/bill/ydj_quotation?operationno=getQuotationList', {
        simpleData: {
          orderId: that.data.id,
          appId: app.globalData.appId,
          pageIndex: that.data.pageIndex,
          pageSize: that.data.pageSize
        }
      }, function(res) {
        wx.stopPullDownRefresh();
        if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
          var datas = res.data.operationResult.srvData.datas;
          var pages = res.data.operationResult.srvData.pageInfos;
          var items = that.data.items.concat(datas);
          that.setData({
            allPage: pages.pageRows,
            items: items,
            pageIndex: that.data.pageIndex + 1,
            nodata: items.length == 0,
            nomoredata: false
          });
        } else {
          wx.showToast({
            title: res.data.responseStatus.message,
            icon: 'none'
          })
        }
      }, 'POST',
      function() {
        wx.stopPullDownRefresh();
      });
  },
  onReachBottom: function() {
    var allPage = this.data.allPage;
    var pageIndex = this.data.pageIndex;
    if (pageIndex < allPage) {
      this.loadPage();
    } else {
      this.setData({
        nomoredata: true
      });
    }
  },
  onPullDownRefresh: function() {
    this.setData({
      pageIndex: 1,
      items: []
    })
    this.loadPage();
  },
  loadQuoteDetail: function() {
    var that = this;
    common.httpReq('/bill/ydj_quotation?operationno=GetQuotationDetail', {
      selectedRows: {
        pkValue: that.data.fid
      },
      simpleData: {
        appId: app.globalData.appId
      }
    }, function(res) {
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var datas = res.data.operationResult.srvData;
        that.setData({
          fquotationamount: datas.fquotationamount,
          fdescription: datas.fdescription,
          fvaliditydate: datas.fvaliditydate,
          ffastestdate: common.formatDateTime2(datas.ffastestdate),
          fserviceentry: datas.fserviceentry,
          ffreightamount: datas.ffreightamount,
          fhandlingamount: datas.fhandlingamount,
          fliftbuildamount: datas.fliftbuildamount,
          fshippingamount: datas.fshippingamount
        });
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    });

  },
  showRule: function(event) {
    var fid = event.currentTarget.dataset.id;
    this.setData({
      isRuleTrue: true,
      fid: fid
    });
    this.loadQuoteDetail();
  },
  //关闭透明层
  hideRule: function() {
    this.setData({
      isRuleTrue: false
    })
  }
})