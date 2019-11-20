var app = getApp();
var common = require("../../../common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    status: '',
    fserstatus: '',
    fservicetype_txt: '', //类型 
    fbillno: '',
    fservicebillno: '',
    fmasterid_fname: '',
    fmasterid_fphone: '',
    fappointdate: '',
    fappointenddate: '',
    showWghbFlag: true,
    showFkjlFlag: true,
    showTsjlFlag: true,
    showTkjlFlag: true,
    showPjFlag: true,
    other: {},
    fdoneimageurl_all: [],
    feedBackOrders: [],
    complaintOrders: [],
    refundOrders: []
  },

  onLoad: function(options) {
    this.setData({
      id: options.id
    });
    this.initPage();
  },
  initPage: function() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    common.httpReq('/bill/ydj_merchantorder.json?operationno=initbill', {
      simpleData: {
        id: that.data.id,
        appId: app.globalData.appId
      }
    }, function(res) {
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var datas = res.data.operationResult.srvData.uiData;
        var other = res.data.operationResult.srvData.tagData.linkSrvBillData[0];
        var status = datas.fserstatus.id;
        var fserstatus = '';
        if (status == 'sht_serstatus00') {
          fserstatus = '待发布';
        } else if (status == 'sht_serstatus01') {
          fserstatus = '已取消';
        } else if (status == 'sht_serstatus02') {
          fserstatus = '已拒单';
        } else if (status == 'sht_serstatus03') {
          fserstatus = '待报价';
        } else if (status == 'sht_serstatus10') {
          fserstatus = '待雇佣';
        } else if (status == 'sht_serstatus11') {
          fserstatus = '待支付';
        } else if (status == 'sht_serstatus12') {
          fserstatus = '待预约';
        } else if (status == 'sht_serstatus13' || status == 'sht_serstatus16') {
          fserstatus = '待上门';
        } else if (status == 'sht_serstatus06') {
          fserstatus = '服务中';
        } else if (status == 'sht_serstatus07') {
          fserstatus = '待验收';
        } else if (status == 'sht_serstatus08') {
          fserstatus = '已完成';
        }
        that.setData({
          status: status,
          fserstatus: fserstatus,
          fservicetype_txt: datas.fservicetype.fname, //类型 
          fbillno: datas.fbillno,
          fservicebillno: datas.fservicebillno,
          fmasterid_fname: other ? other.fmasterid_fname : '',
          fmasterid_fphone: other ? other.fmasterid_fphone : '',
          fappointdate: other ? common.formatDateTime2(other.fappointdate) : '',
          fappointenddate: other ? common.formatDateTime3(other.fappointenddate) : '',
          other: other,
          fdoneimageurl_all: common.trim(other.fdoneimageurl_all).length > 0 ? other.fdoneimageurl_all.split(',') : [],
          fqual_txt: common.trim(other.fqual_txt).length > 0 ? other.fqual_txt.split(',') : [],
          fmqual_txt: common.trim(other.fmqual_txt).length > 0 ? other.fmqual_txt.split(',') : []
        });
        that.loadFeedBackPage();
        that.loadComplaintPage();
        that.loadRefundPage();
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
  loadFeedBackPage: function() {
    wx.showLoading({
      title: '加载中',
    })
    var filter = " and (fmerbill = '" + this.data.fbillno + "')";
    var that = this;
    common.httpReq('/list/ser_servicefeed.json?operationno=querydata', {
      filterString: "fdealerid='" + app.globalData.userId + "' and fcancelstatus=0" + filter,
      simpleData: {
        appId: app.globalData.appId
      },
      pageIndex: 1,
      pageCount: 50
    }, function(res) {
      wx.stopPullDownRefresh();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var datas = res.data.operationResult.srvData.data;
        var pages = res.data.operationResult.srvData.dataDesc;
        var orders = that.data.feedBackOrders;
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
            fimages: common.trim(item.fprographurl).length > 0 ? item.fprographurl.split(',') : [],
            fbillhead_id: item.fbillhead_id,
            fprodesript: item.fprodesript,
            fsprotype_fenumitem: item.fsprotype_fenumitem
          });
        }
        that.setData({
          feedBackOrders: orders
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
  loadComplaintPage: function() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    common.httpReq('/list/ser_complaintrecord.json?operationno=querydata', {
      filterString: "fmerchantid='" + app.globalData.userId + "' and fmerorderid='" + that.data.id + "'",
      simpleData: {
        appId: app.globalData.appId
      },
      pageIndex: 1,
      pageCount: 50
    }, function(res) {
      wx.stopPullDownRefresh();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var datas = res.data.operationResult.srvData.data;
        var pages = res.data.operationResult.srvData.dataDesc;
        for (var item of datas) {
          item.fimageurl = common.trim(item.fimageurl).length > 0 ? item.fimageurl.split(',') : [];
        }
        that.setData({
          complaintOrders: datas
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
  loadRefundPage: function() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    common.httpReq('/list/ser_refund.json?operationno=querydata', {
      filterString: "fdealerid='" + app.globalData.userId + "' and fmerbill='" + this.data.fbillno + "'",
      simpleData: {
        appId: app.globalData.appId
      },
      pageIndex: 1,
      pageCount: 50
    }, function(res) {
      wx.stopPullDownRefresh();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var datas = res.data.operationResult.srvData.data;
        var pages = res.data.operationResult.srvData.dataDesc;
        for (var item of datas) {
          item.fimageurl = common.trim(item.fimageurl).length > 0 ? item.fimageurl.split(',') : [];
        }
        that.setData({
          refundOrders: datas
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
  callMobile: function(e) {
    var mobile = e.currentTarget.dataset.mobile;
    wx.makePhoneCall({
      phoneNumber: mobile
    })
  },
  showWghb: function() {
    this.setData({
      showWghbFlag: !this.data.showWghbFlag
    });
  },
  showFkjl: function() {
    this.setData({
      showFkjlFlag: !this.data.showFkjlFlag
    });
  },
  showTsjl: function() {
    this.setData({
      showTsjlFlag: !this.data.showTsjlFlag
    });
  },
  showTkjl: function() {
    this.setData({
      showTkjlFlag: !this.data.showTkjlFlag
    });
  },
  showPj: function() {
    this.setData({
      showPjFlag: !this.data.showPjFlag
    });
  },
  showImg: function(event) {
    var imgs = event.currentTarget.dataset.imgs;
    wx.previewImage({
      current: imgs[0],
      urls: imgs
    })
  },
})