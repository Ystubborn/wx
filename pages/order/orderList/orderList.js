var app = getApp();
var common = require("../../../common.js");
Page({
  data: {
    keyword: '',
    currentId: '0',
    section: [{
        name: '全部订单',
        typeId: '0'
      },
      {
        name: '待报价',
        typeId: '1'
      },
      {
        name: '待雇佣',
        typeId: '2'
      },
      {
        name: '待支付',
        typeId: '3'
      },
      {
        name: '待预约',
        typeId: '4'
      },
      {
        name: '待上门',
        typeId: '5'
      },
      {
        name: '服务中',
        typeId: '6'
      },
      {
        name: '待验收',
        typeId: '7'
      },
      {
        name: '已完成',
        typeId: '8'
      },
      {
        name: '交易关闭',
        typeId: '9'
      }
    ],
    items: [],
    pageIndex: 1,
    pageCount: 10,
    allPage: 0,
    nomoredata: false,
    nodata: false
  },
  onLoad: function(option) {
    this.setData({
      keyword: option.keyword ? option.keyword : '',
      currentId: option.status,
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
    var status = "";
    if (currentId == 1) {
      status = "and (fserstatus='sht_serstatus03')";
    } else if (currentId == 2) {
      status = "and (fserstatus='sht_serstatus10')";
    } else if (currentId == 3) {
      status = "and (fserstatus='sht_serstatus11')";
    } else if (currentId == 4) {
      status = "and (fserstatus='sht_serstatus12')";
    } else if (currentId == 5) {
      status = "and (fserstatus='sht_serstatus13' or fserstatus='sht_serstatus16')";
    } else if (currentId == 6) {
      status = "and (fserstatus='sht_serstatus06')";
    } else if (currentId == 7) {
      status = "and (fserstatus='sht_serstatus07')";
    } else if (currentId == 8) {
      status = "and (fserstatus='sht_serstatus08')";
    } else if (currentId == 9) {
      status = "and (fserstatus='sht_serstatus01')";
    }
    var keyword = this.data.keyword;
    var filter = keyword.length > 0 ? " and (fname like '%" + keyword + "%' or fphone like '%" + keyword + "%' or fbillno like '%" + keyword + "%') " : "";
    var that = this;
    common.httpReq('/list/ydj_merchantorder.json?operationno=querydata', {
      filterString: "fmerchantid='" + app.globalData.userId + "' " + status + filter,
      simpleData: {
        merchantId: app.globalData.userId,
        appId: app.globalData.appId
      },
      pageIndex: that.data.pageIndex,
      pageCount: that.data.pageCount
    }, function(res) {
      wx.stopPullDownRefresh();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var datas = res.data.operationResult.srvData.data;
        var pages = res.data.operationResult.srvData.dataDesc;
        var orders = that.data.items;
        for (var item of datas) {
          var fserstatus = '';
          if (item.fserstatus == 'sht_serstatus00') {
            fserstatus = '待发布';
          } else if (item.fserstatus == 'sht_serstatus01') {
            fserstatus = '已取消';
          } else if (item.fserstatus == 'sht_serstatus02') {
            fserstatus = '已拒单';
          } else if (item.fserstatus == 'sht_serstatus03') {
            fserstatus = '待报价';
          } else if (item.fserstatus == 'sht_serstatus10') {
            fserstatus = '待雇佣';
          } else if (item.fserstatus == 'sht_serstatus11') {
            fserstatus = '待支付';
          } else if (item.fserstatus == 'sht_serstatus12') {
            fserstatus = '待预约';
          } else if (item.fserstatus == 'sht_serstatus13' || item.fserstatus == 'sht_serstatus16') {
            fserstatus = '待上门';
          } else if (item.fserstatus == 'sht_serstatus06') {
            fserstatus = '服务中';
          } else if (item.fserstatus == 'sht_serstatus07') {
            fserstatus = '待验收';
          } else if (item.fserstatus == 'sht_serstatus08') {
            fserstatus = '已完成';
          }
          var day = '',
            hour = '',
            mintue = '';
          if (item.fautodowntime) {
            var date = common.convertDateFromString(item.fautodowntime);
            var curdate = new Date();
            var timeCha = date.getTime() - curdate.getTime();
            if (timeCha > 0) {
              if (timeCha > 86400000 && timeCha / 86400000 > 0) {
                var temp = parseInt(timeCha / 86400000);
                day = temp + '天';
              }
              if (timeCha > 3600000 && (timeCha % 86400000) / 3600000 > 0) {
                var temp = parseInt((timeCha % 86400000) / 3600000);
                hour = temp + '小时';
              }
              if (timeCha > 60000 && ((timeCha % 86400000) % 3600000) / 60000 > 0) {
                var temp = parseInt(((timeCha % 86400000) % 3600000) / 60000);
                mintue = temp + '分';
              }
            }
          }
          orders.push({
            fcount: item.fcount,
            fserstatus: item.fserstatus,
            fserstatus_txt: fserstatus,
            fservicetype_fenumitem: item.fservicetype_fenumitem,
            fprofield_txt: item.fprofield_txt,
            fname: item.fname,
            fphone: item.fphone,
            fcusaddress: item.fcusaddress,
            fcreatedate: common.formatDateTime2(item.fcreatedate),
            forderdate: common.formatDateTime2(item.forderdate),
            fcompletiondate: common.formatDateTime2(item.freportdate),
            fservicedate: common.formatDateTime2(item.fservicedate),
            fappointdate: common.formatDateTime2(item.fappointdate),
            fappointenddate: common.formatDateTime3(item.fappointenddate),
            fcanceldate: common.formatDateTime2(item.fmodifydate),
            fclosestatus: item.fclosestatus,
            fmaster_name: item.fmaster_name,
            fmaster_price: item.fquotationamount,
            fmaster_header: item.fmaster_fimage,
            fimages: item.fentityimage.split(','),
            fmaster_count: item.fentityimage.split(',').length,
            fbillhead_id: item.fbillhead_id,
            fautodowntime: day + hour + mintue,
            foffertype_fenumitem: item.foffertype_fenumitem,
            foffertype: item.foffertype
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
  goOrderDetail: function(event) {
    wx.navigateTo({
      url: '/pages/order/orderDetail/orderDetail?id=' + event.currentTarget.dataset.id,
    })
  },
  showImg: function(event) {
    var imgs = event.currentTarget.dataset.imgs;
    if (imgs.length == 0 || imgs[0].length == 0) {
      return;
    }
    wx.previewImage({
      current: imgs[0],
      urls: imgs
    })
  },
  fillKeyword: function(e) {
    this.setData({
      keyword: e.detail.value
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