var app = getApp();
var common = require("../../../common.js");
Page({

  data: {
    id: '',
    score: 0,
    scoreText: '请给这次评价打分',
    items: [],
    remark: '',
    feedbackResultFlag: false
  },
  onLoad: function(options) {
    this.setData({
      id: options.id
    });
    this.initPage();
  },
  selectTag: function(e) {
    var id = e.currentTarget.dataset.id;
    var items = this.data.items;
    if (items[id].clazz && items[id].clazz.length > 0) {
      items[id].clazz = '';
    } else {
      items[id].clazz = 'selected';
    }
    this.setData({
      items: items
    });
  },
  changeScore: function(e) {
    var score = e.currentTarget.dataset.score;
    var scoreText;
    if (score == 1) {
      scoreText = "非常不满意，各方面都很差";
      if (this.data.score>3){
        this.initTag();
      }
    } else if (score == 2) {
      scoreText = "很差，很多地方都没做好";
      if (this.data.score > 3) {
        this.initTag();
      }
    } else if (score == 3) {
      scoreText = "一般般，有些地方做的不够好";
      if (this.data.score > 3) {
        this.initTag();
      }
    } else if (score == 4) {
      scoreText = "还行，还有进步空间";
      if (this.data.score < 4) {
        this.initTag();
      }
    } else if (score == 5) {
      scoreText = "非常满意，无可挑剔";
      if (this.data.score < 4) {
        this.initTag();
      }
    }
    this.setData({
      score: score,
      scoreText: scoreText
    });
  },
  initTag:function(){
    var items = this.data.items;
    for(var item of items){ 
      item.clazz = '';
    } 
    this.setData({
      items: items
    });
  },
  initPage: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    common.httpReq('/bill/ydj_merchantorder?operationno=querycombo&fieldkey=fqual', {
      simpleData: {
        appId: app.globalData.appId
      }
    }, function(res) {
      wx.hideLoading();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var result = res.data.operationResult.srvData.data;
        that.setData({
          items: result
        });
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    });
  },
  fillRemark: function(event) {
    var val = event.detail.value;
    this.setData({
      remark: val
    });
  },
  save: function() {
    let that = this;
    if (that.data.score == 0) {
      return wx.showToast({
        title: '请给这次服务打分',
        icon: 'none'
      })
    } 
    wx.showLoading({
      title: '正在提交',
    })
    var fqual = "";
    var fqual_txt = ""
    for (var item of that.data.items) {
      if (item.clazz && item.clazz == 'selected') {
        if (fqual.length > 0) {
          fqual += ',';
          fqual_txt += ',';
        }
        fqual += item.id;
        fqual_txt += item.name;
      }
    }
    common.httpReq('/bill/ydj_merchantorder?operationno=evaluate', {
      selectedRows: [{
        pkValue: that.data.id
      }],
      simpleData: {
        fqualstar: 'gradestar_0'+that.data.score,
        fqual: fqual,
        fqual_txt: fqual_txt,
        fevaludesc: that.data.remark,
        appId: app.globalData.appId
      }
    }, function(res) {
      wx.hideLoading();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        that.setData({
          feedbackResultFlag: true
        }); 
        
        var pages = getCurrentPages(); // 当前页面
        var beforePage = pages[pages.length - 2]; // 前一个页面 
        beforePage.initPage(); // 执行前一个页面的onLoad方法

      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    });
  },
  hideFeedbackResult: function() {
    this.setData({
      feedbackResultFlag: false
    });
    wx.navigateBack();
  },
  rewardMaster: function() {
    wx.redirectTo({
      url: '/pages/order/reward/reward?id=' + this.data.id,
    })
  }
})