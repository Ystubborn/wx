var app = getApp();
var common = require("../../../common.js");
Page({
  data: {
    currentId: '0',
    section: [{
        name: '待使用',
        typeId: '0'
      },
      {
        name: '已使用',
        typeId: '1'
      },
      {
        name: '已失效',
        typeId: '2'
      }
    ],
    items: [],
    pageIndex: 1,
    pageCount: 10,
    allPage: 0,
    nomoredata: false,
    nodata: false
  },
  onLoad: function() {
    this.setData({
      currentId: 0,
      pageIndex: 1,
      items: []
    });
    this.loadPage();
  },
  loadPage: function() {
    wx.showLoading({
      title: '加载中',
    })
    var currentId = this.data.currentId;
    var that = this;
    common.httpReq('/dynamic/ydj_customer?operationno=getcashcoupons', {
      selectedRows: {
        pkValue: app.globalData.userId
      },
      simpleData: {
        usetype: that.data.currentId,
        appId: app.globalData.appId
      },
      // pageIndex: that.data.pageIndex,
      // pageCount: that.data.pageCount
    }, function(res) {
      wx.stopPullDownRefresh();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var datas = res.data.operationResult.srvData.date;
        that.setData({
          // allPage: pages.pages,
          // pageIndex: that.data.pageIndex + 1,
          items: datas,
          nodata: datas.length == 0,
          nomoredata: false
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
  //点击每个导航的点击事件
  handleTap: function(e) {
    let id = e.currentTarget.dataset.id;
    if (id) {
      this.setData({
        currentId: id,
        pageIndex: 1,
        items: []
      })
      this.loadPage();
    }
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
  showDesc: function(event) { 
    let desc = event.currentTarget.dataset.desc;
    wx.showModal({
      title: '现金券使用规则',
      content: desc,
    })
  },
  goOrderCenter:function(){
    wx.switchTab({
      url: '/pages/order/orderCenter/orderCenter',
    })
  }

})