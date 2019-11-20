var app = getApp();
var common = require("../../../common.js");
Page({
  //页面数据
  data: {
    date: '2019-07-08',
    dateList: []
  },
  //页面初次加载
  onLoad: function() {
    var date = new Date();
    var dataList = this.data.dateList; 
    var today = common.formatDate(date);
    dataList.push({
      date: today,
      dateSort: '今天',
      week: common.formatWeek(date)
    }); 
    for (var i = 0; i < 29; i++) {
      date.setDate(date.getDate() + 1);
      dataList.push({
        date: common.formatDate(date),
        dateSort: common.formatShortDate(date),
        week: common.formatWeek(date)
      });
    }
    this.setData({
      date:today,
      dateList:dataList
    });

    var that = this;
    wx.getStorage({
      key: 'add_order_4',
      success(res) {
        if (res.data) {
          var date = res.data.date;
          that.setData({
            date: date
          });
        }
      }
    });
  },
  selectDate: function(event) {
    var date = event.currentTarget.dataset.date;
    this.setData({
      date: date
    });
    wx.setStorage({
      key: "add_order_4",
      data: {
        date: date
      }
    });
    wx.navigateTo({
      url: '/pages/order/addOrder5/addOrder5',
    })
  }
})