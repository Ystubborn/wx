var app = getApp();
var common = require("../../../common.js");
Page({
  data: {
    id: '',
    status:'',
    isRuleTrue: false,
    items: [],
    pageIndex: 1,
    pageSize: 10,
    allPage: 0,
    nodata: false,
    nomoredata: false,
    fautodowntime: '',
    fautodowntime_day: '0',
    fautodowntime_hour: '0',
    fautodowntime_mintue: '0',
    fautodowntime_second: '0',
    fid:'', 
    fquotationamount: '',
    fdescription: '',
    fvaliditydate: '',
    ffastestdate: '',
    fserviceentry: '',
    foffertype:'', 
    ffreightamount: 0,
    fhandlingamount: 0,
    fliftbuildamount:0,
    fshippingamount: 0
  },

  onLoad: function(options) {
    this.setData({
      id: options.id,
      status: options.status,
      foffertype: options.foffertype,
      fautodowntime: options.fautodowntime, 
      pageIndex: 1,
      items: []
    });
    this.loadPage(); 
    this.runTimeOut();
  }, 
  runTimeOut: function () {
    var day = '0',
      hour = '0',
      mintue = '0',
      second = '0';
    if (this.data.fautodowntime) {
      var date = common.convertDateFromString(this.data.fautodowntime);
      var curdate = new Date();
      var timeCha = date.getTime() - curdate.getTime();
      if (timeCha > 60000) {
        if (timeCha > 86400000 && timeCha / 86400000 > 0) {
          var temp = parseInt(timeCha / 86400000);
          day = temp;
        }
        if (timeCha > 3600000 && (timeCha % 86400000) / 3600000 > 0) {
          var temp = parseInt((timeCha % 86400000) / 3600000);
          hour = temp;
        }
        if (timeCha > 60000 && ((timeCha % 86400000) % 3600000) / 60000 > 0) {
          var temp = parseInt(((timeCha % 86400000) % 3600000) / 60000);
          mintue = temp;
        }
        if (timeCha > 1000 && (((timeCha % 86400000) % 3600000) % 60000) / 1000 > 0) {
          var temp = parseInt((((timeCha % 86400000) % 3600000) % 60000) / 1000);
          second = temp;
        }

        this.setData({
          fautodowntime_day: day,
          fautodowntime_hour: hour,
          fautodowntime_mintue: mintue,
          fautodowntime_second: second
        });
        var that = this;
        setTimeout(function () {
          that.runTimeOut();
        }, 1000);
      }
    }
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
  loadQuoteDetail:function(){ 
    var that = this;
    common.httpReq('/bill/ydj_quotation?operationno=GetQuotationDetail', {
      selectedRows:{
        pkValue: that.data.fid
      },
      simpleData: { 
        appId: app.globalData.appId 
      }
    }, function (res) { 
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
  showRule: function (event) {
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
  },
  quoteMaster2: function (event) {
    var fid = event.currentTarget.dataset.id;
    this.setData({ 
      fid: fid
    });
    this.quoteMaster();
  },
  quoteMaster: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否雇佣此师傅？',
      success: function (res) {
        if (res.confirm) {
          common.httpReq('/bill/ydj_quotation?operationno=agree', {
            selectedRows: {
              pkValue: that.data.fid
            },
            simpleData: {
              appId: app.globalData.appId
            }
          }, function (res) {
            if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
              wx.showToast({
                title: '雇佣成功！',
                icon: 'success'
              });
              var pages = getCurrentPages(); // 当前页面
              var beforePage = pages[pages.length - 2]; // 前一个页面 
              wx.navigateBack({
                success: function () {
                  beforePage.initPage(); // 执行前一个页面的onLoad方法
                }
              });
            } else {
              wx.showToast({
                title: res.data.operationResult.simpleMessage,
                icon: 'none'
              })
            }
          });
        }
      }
    })
  }
})