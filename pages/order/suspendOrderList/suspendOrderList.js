var app = getApp();
var common = require("../../../common.js");
Page({
  data: {
    keyword: '', 
    items: [],
    pageIndex: 1,
    pageCount: 10,
    allPage: 0,
    nomoredata: false,
    nodata: false
  },
  onLoad: function (option) {
    this.setData({
      currentId: option.status,
      pageIndex: 1,
      items: []
    });
    this.loadPage();
  },
  loadPage: function () { 
    wx.showLoading({
      title: '加载中',
    })
    var currentId = this.data.currentId;
    var status = " and fserstatus='sht_serstatus06' and fishang=1"; 
    var filter = "";
    var keyword = this.data.keyword;
    if (keyword.length > 0) {
      filter = " and (fname like '%" + keyword + "%' or fphone like '%" + keyword + "%' or fbillno like '%" + keyword + "%')";
    }
    var that = this;
    common.httpReq('/list/ydj_merchantorder.json?operationno=querydata', {
      filterString: "fmerchantid='" + app.globalData.userId +"'"+ status + filter,
      simpleData: {
        appId: app.globalData.appId
      },
      pageIndex: that.data.pageIndex,
      pageCount: that.data.pageCount
    }, function (res) {
      wx.stopPullDownRefresh();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var datas = res.data.operationResult.srvData.data;
        var pages = res.data.operationResult.srvData.dataDesc;
        var orders = that.data.items;
        for (var item of datas) { 
          orders.push({
            fcount: item.fcount,
            fserstatus: item.fserstatus, 
            fservicetype_fenumitem: item.fservicetype_fenumitem,
            fprofield_txt: item.fprofield_txt,
            fname: item.fname, 
            fbillno: item.fbillno, 
            fserstatus_txt: '订单挂起', 
            fphone: item.fphone,
            fcusaddress: item.fcusaddress,
            fcreatedate: common.formatDateTime2(item.fcreatedate),
            fservicedate: common.formatDateTime2(item.fservicedate),
            fimages: item.fentityimage.split(','),
            fbillhead_id: item.fbillhead_id,
            famount: item.famount
          });
        }
        that.setData({
          allPage: pages.pages,
          pageIndex: that.data.pageIndex + 1,
          items: orders,
          nodata: orders.length == 0,
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
  goOrderDetail: function (event) {
    wx.navigateTo({
      url: '/pages/order/suspendOrderDetail/suspendOrderDetail?id=' + event.currentTarget.dataset.id
    })
  },
  showImg: function (event) {
    var imgs = event.currentTarget.dataset.imgs;
    wx.previewImage({
      current: imgs[0],
      urls: imgs
    })
  },
  fillKeyword: function (e) {
    this.setData({
      keyword: e.detail.value
    });
  },
  search: function () {
    this.setData({
      pageIndex: 1,
      items: []
    })
    this.loadPage();
  }
})