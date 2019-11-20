var app = getApp();
var common = require("../../../common.js");
Page({
  data: {
    items: [],
    startDate: '',
    endDate: '',
    limitDate: '',
    search: false,
    type: '',
    pageIndex: 1,
    pageCount: 10,
    allPage: 0,
    nomoredata: false,
    nodata: false,
    groupbyDataList:[]
  },
  onLoad: function(options) {
    var today = common.formatDate(new Date());
    this.setData({
      endDate: common.formatDate(new Date()),
      startDate: common.formatAddDate(new Date(), -30),
      limitDate: today
    });
    this.loadPage();
  },
  loadPage: function() {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this;
    common.httpReq('/bill/ydj_merchantorder?operationno=getconsumptions', {
      simpleData:{
        appId: app.globalData.appId,
        purpose: that.data.type,
        dtStart: that.data.startDate + ' 00:00:00',
        dtEnd: that.data.endDate + ' 23:59:59',
        customerId: app.globalData.userId,
        pageIndex: that.data.pageIndex,
        pageSize: that.data.pageCount
      }
    }, function(res) {
      wx.stopPullDownRefresh();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var datas = res.data.operationResult.srvData.list.rptGridDataSource;
        var pages = res.data.operationResult.srvData.list.listDesc;
        var groupbyDataList = res.data.operationResult.srvData.groupbyDataList;
        var orders = that.data.items;
        orders = orders.concat(datas);
        that.setData({
          allPage: pages.pages,
          pageIndex: that.data.pageIndex + 1,
          items: orders,
          nodata: orders.length == 0,
          nomoredata: false,
          groupbyDataList: groupbyDataList
        });
        wx.hideLoading();
      } else {
        wx.hideLoading();
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    }, 'POST', function() {
      wx.hideLoading();
      wx.stopPullDownRefresh();
    });
  },
  bindStartDateChange: function(e) {
    this.setData({
      startDate: e.detail.value,
      pageIndex: 1,
      items: []
    })
    this.loadPage();
  },
  bindEndDateChange: function(e) {
    this.setData({
      endDate: e.detail.value,
      pageIndex: 1,
      items: []
    })
    this.loadPage();
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
  showSearchDetail: function() {
    this.setData({
      search: !this.data.search
    });
  },
  selectType: function(event) {
    var type = event.currentTarget.dataset.type;
    this.setData({
      type: type,
      search: !this.data.search,
      pageIndex: 1,
      items: []
    });
    this.loadPage();
  },
  goDetail: function(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/my/walletLogDetail/walletLogDetail?fid=' + id,
    })
  }
})