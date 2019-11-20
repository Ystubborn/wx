 var app = getApp();
 var common = require("../../../common.js");
 Page({
   data: {
     item: {}
   },
   onLoad: function(options) {
     this.initPage(options.fid);
   },
   initPage: function(fid) {
     var that = this; 
     wx.showLoading({
       title: '加载中',
     })
     common.httpReq('/dynamic/coo_incomedisburse?operationno=LoadData', {
       selectedRows: {
         PKValue: fid
       }
     }, function(res) {
       wx.hideLoading();
       if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
         var res = res.data.operationResult.srvData.uidata;
         that.setData({
           item: res
         });
       } else {
         wx.showToast({
           title: res.data.responseStatus.message,
           icon: 'none'
         })
       }
     });
   },

 })