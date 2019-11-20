var app = getApp();
var common = require("../../../common.js");

Page({

  data: {
    keyword:'',
    items: [],
    helps: [],
    icons: ['../../../images/my/help/p1.png', '../../../images/my/help/p2.png', '../../../images/my/help/p3.png', '../../../images/my/help/p4.png', '../../../images/my/help/p5.png', '../../../images/my/help/p6.png']
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    common.httpReq('/bill/ydj_helpcenter?operationNo=QueryComboBatch', {
      simpleData: {
        fieldKey: 'fknowledge',
        appId: app.globalData.appId
      }
    }, function(res) {
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var datas = res.data.operationResult.srvData.fknowledge;
        that.setData({
          items: datas
        });
        if (datas.length > 0) {
          that.initPage();
        }
      } else {
        wx.hideLoading();
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    });
  },
  initPage() {
    let that = this;
    common.httpReq('/list/ydj_helpcenter.json?operationNo=querydata', {
      filterString: "fpublishstatus='send_status_01' and fknowledge = '" + that.data.items[0].id + "'",
      pageSize: 5,
      pageIndex: 0,
      simpleData: {
        appId: app.globalData.appId
      }
    }, function(res) {
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var datas = res.data.operationResult.srvData.data;
        var orders = [];
        for (var item of datas) {
          orders.push({
            type: that.data.items[0].id,
            id: item.fbillhead_id,
            title: item.ftitle,
            content: item.fdescription,
            category: item.fknowledge_fenumitem
          });
        }
        that.setData({
          helps: orders
        });
        wx.hideLoading();
      } else {
        wx.hideLoading();
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    });
  },
  goQuestion: function(event) {
    var type = event.currentTarget.dataset.type;
    var index = event.currentTarget.dataset.index;
    var title = event.currentTarget.dataset.title;
    wx.navigateTo({
      url: '/pages/my/helpList/helpList?type=' + type + '&index=' + index + '&title=' + title,
    })
  },
  goFeedback: function() {
    wx.navigateTo({
      url: '/pages/my/feedback/feedback',
    })
  },
  fillkeyword: function (event){
    var val = event.detail.value;
    this.setData({
      keyword: val
    });
  },
  search:function(){
    if (this.data.keyword.length==0){
      return wx.showToast({
        title: '请输入搜索内容',
        icon:'none'
      })
    }
    wx.navigateTo({
      url: '/pages/my/helpList/helpList?keyword=' + this.data.keyword+'&title=问题搜索',
    })
  },
  goOnline: function () {
    wx.showToast({
      title: '正在完善中..',
      icon: 'none'
    })
  },
  callPhone: function () {
    wx.makePhoneCall({
      phoneNumber: '4009608388'
    })
  }

})