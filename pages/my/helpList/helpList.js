var app = getApp();
var common = require("../../../common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowSearch:false,
    items: [],
    keyword: '',
    type: '',
    index: '',
    pageIndex: 1,
    pageSize: 10,
    allPage: 0,
    nomoredata: false,
    nodata: false
  },

  onLoad: function(options) {
    var keyword = options.keyword;
    var title = options.title;
    var type = options.type;
    var index = options.index;
    wx.setNavigationBarTitle({
      title: title
    })
   var isShowSearch =false;
    if(keyword && keyword.length>0){
      isShowSearch =true;
    }
    this.setData({
      isShowSearch: isShowSearch,
      keyword: keyword?keyword:'',
      type: type,
      index: index,
      pageIndex: 1,
      items: []
    });
    this.loadPage();
  },
  loadPage: function() { 
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    var filter = " and fknowledge = '" + that.data.type + "'";
    if (that.data.keyword && that.data.keyword.length > 0) {
      filter = " and ftitle like '%" + that.data.keyword + "%' or fdescription like '%" + that.data.keyword + "%'";
    }
    common.httpReq('/list/ydj_helpcenter.json?operationNo=querydata', {
      filterString: "fpublishstatus='send_status_01' " + filter,
      pageSize: that.data.pageSize,
      pageIndex: that.data.pageIndex,
      simpleData: {
        appId: app.globalData.appId
      }
    }, function(res) {
      wx.stopPullDownRefresh();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var datas = res.data.operationResult.srvData.data;
        var pages = res.data.operationResult.srvData.dataDesc;
        var orders = that.data.items;
        var i = 0;
        for (var item of datas) {
          orders.push({
            id: item.fbillhead_id,
            title: item.ftitle,
            content: item.fdescription,
            openFlag: that.data.index == i
          });
          i++;
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
    }, 'POST', function() {
      wx.hideLoading();
      wx.stopPullDownRefresh();
    });

  },
  showQuestion: function(event) {
    var pid = event.currentTarget.dataset.pid;
    var items = this.data.items;
    items[pid].openFlag = !items[pid].openFlag;
    this.setData({
      items: items
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
  fillKeyword: function (event){ 
    var val = event.detail.value;
    this.setData({
      keyword: val
    });
  },
  search: function() {
    this.setData({
      pageIndex: 1,
      items: []
    })
    this.loadPage();
  }
})