var app = getApp();
var common = require("../../../common.js");
Page({
  data: {
    currentId: '', 
    currentName: '',
    currentVal: 0,
    items: [],
    pageIndex: 1,
    pageCount: 10,
    allPage: 0,
    nomoredata: false,
    nodata: false
  },
  onLoad: function (params) { 
    if (params.cid){
      this.setData({
        currentId: params.cid
      });
    }
    this.loadPage(params.oid);
  },
  loadPage: function (oid) { 
    wx.showLoading({
      title: '加载中',
    })
    var currentId = this.data.currentId;
    var that = this;
    common.httpReq('/dynamic/ydj_merchantorder?operationno=getcashcoupons', {
      selectedRows: {
        pkValue: oid
      },
      simpleData: { 
        appId: app.globalData.appId
      },
      // pageIndex: that.data.pageIndex,
      // pageCount: that.data.pageCount
    }, function (res) {
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
    }, 'POST', function () {
      wx.hideLoading();
      wx.stopPullDownRefresh();
    });
  }, 
  onReachBottom: function () {
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
  onPullDownRefresh: function () {
    this.setData({
      pageIndex: 1,
      items: []
    })
    this.loadPage();
  },
  bindRadioChange: function (e) {
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    var val = e.currentTarget.dataset.val; 
    this.setData({
      currentId: id,
      currentName:name,
      currentVal: val
    });
    var pages = getCurrentPages(); // 当前页面
    var beforePage = pages[pages.length - 2]; // 前一个页面 
    var that = this;
    wx.navigateBack({
      success: function () {
        beforePage.setCoupon(id,name,val); // 执行前一个页面的onLoad方法
      }
    });

  },

})