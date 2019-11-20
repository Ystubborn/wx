var app = getApp();
var common = require("../../../common.js");
Page({
  data: {
    keyword: '',
    currentId: '0',
    section: [{
      name: '全部',
      typeId: '0'
    },
    {
      name: '待商户处理',
      typeId: '1'
    },
    {
      name: '待师傅处理',
      typeId: '2'
    },
    {
      name: '已完成',
      typeId: '3'
    }
    ],
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
    var status = "";
    if (currentId == 1) {
      status = " and ffeeder<>'' and fhandlestatus='handle_sta002'";
    } else if (currentId == 2) {
      status = " and ffeeder='' and fhandlestatus='handle_sta002'";
    } else if (currentId == 3) {
      status = " and fhandlestatus='handle_sta004'";
    }
    var filter = "";
    var keyword = this.data.keyword;
    if (keyword.length > 0) {
      filter = " and (fname like '%" + keyword + "%' or fphone like '%" + keyword + "%' or fmerbill like '%" + keyword + "%')";
    }
    var that = this;
    common.httpReq('/list/ser_servicefeed.json?operationno=querydata', {
      filterString: "fdealerid='" + app.globalData.userId + "' and fcancelstatus=0" + status + filter,
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
          var status_txt = '';
          if (item.fhandlestatus == 'handle_sta004') {
            status_txt = '已完成';
          } else if (item.fhandlestatus == 'handle_sta003') {
            status_txt = '已取消';
          } else if (item.fhandlestatus == 'handle_sta002' && item.ffeeder == '') {
            status_txt = '待师傅处理';
          } else if (item.fhandlestatus == 'handle_sta002' && item.ffeeder != '') {
            status_txt = '待商户处理';
          }

          orders.push({
            fbillno: item.fmerbill,
            fserstatus: item.fhandlestatus,
            fserstatus_txt: status_txt,
            fservicetype_fenumitem: item.fservicetype_fenumitem,
            fprofield_txt: item.fprofield_txt,
            fname: item.fname,
            fphone: item.fphone,
            fcusaddress: item.faddress,
            ffeeddate: common.formatDateTime2(item.ffeeddate),
            fimages: item.fentityimageurl.split(','),
            fbillhead_id: item.fbillhead_id,
            fsprotype_fenumitem: item.fsprotype_fenumitem
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
  //点击每个导航的点击事件
  handleTap: function (e) {
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
      url: '/pages/order/problemOrderDetail/problemOrderDetail?id=' + event.currentTarget.dataset.id
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