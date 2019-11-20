var app = getApp();
var common = require("../../../common.js");
Page({

  data: {
    id:'', 
    remark: '',
    imgList: [],
    imgIdList: [],
    feedbackResultFlag: false
  },
  onLoad: function(options) {
    this.setData({
      id:options.id 
    }); 
  }, 
  fillRemark: function(event) {
    var val = event.detail.value;
    this.setData({
      remark: val
    });
  },
  chooseImg: function(event) {
    var that = this;
    wx.showActionSheet({
      itemList: ['拍照', '照片图库'],
      success: function(e) {
        var i = e.tapIndex;
        if (i == 0) {
          wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['camera'],
            success(res) {
              // tempFilePath可以作为img标签的src属性显示图片
              const tempFilePaths = res.tempFilePaths;
              var data = that.data;
              var imgList = data.imgList;
              var imgIdList = data.imgIdList;
              for (var i = 0; i < tempFilePaths.length; i++) {
                that.uploadImg(tempFilePaths[i], function(res2) {
                  var imgInfo = JSON.parse(res2);
                  imgList.push(imgInfo.url);
                  imgIdList.push(imgInfo.fileId);
                  that.setData({
                    imgList: imgList,
                    imgIdList: imgIdList
                  });
                });
              }
            }
          })
        } else {
          wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album'],
            success(res) {
              // tempFilePath可以作为img标签的src属性显示图片
              const tempFilePaths = res.tempFilePaths;
              var data = that.data;
              var imgList = data.imgList;
              var imgIdList = data.imgIdList;
              for (var i = 0; i < tempFilePaths.length; i++) {
                that.uploadImg(tempFilePaths[i], function(res2) {
                  var imgInfo = JSON.parse(res2);
                  imgList.push(imgInfo.url);
                  imgIdList.push(imgInfo.fileId);
                  that.setData({
                    imgList: imgList,
                    imgIdList: imgIdList
                  });
                });
              }
            }
          })
        }
      }
    })
  },
  uploadImg(url, callBack) {
    var that = this;
    common.httpUpload(url, function(res) {
      if (res.statusCode == 200) {
        callBack(res.data);
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    });
  },
  deleteImg: function(event) {
    var id = event.currentTarget.dataset.id;
    var imgList = this.data.imgList
    var imgIdList = this.data.imgIdList
    imgList.splice(id, 1);
    imgIdList.splice(id, 1);
    this.setData({
      imgList: imgList,
      imgIdList: imgIdList
    });
  },
  showImg: function(event) {
    var id = event.currentTarget.dataset.id;
    var imgList = this.data.imgList;
    wx.previewImage({
      current: imgList[id], // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  save: function() {
    let that = this;
    if (that.data.remark.length == 0) {
      return wx.showToast({
        title: '请填写受理说明',
        icon: 'none'
      })
    }
    wx.showLoading({
      title: '正在提交',
    }) 
    common.httpReq('/bill/ser_servicefeed?operationno=replyservicefeedsht', { 
      selectedRows: [{
        pkValue: that.data.id
      }],
      simpleData: {
        freplyimage: that.data.imgIdList.join(","),
        freplycontent:that.data.remark,
        appId: app.globalData.appId
      }
    }, function(res) {
      wx.hideLoading();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        that.setData({
          feedbackResultFlag: true
        });
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    });
  }, 
  toIndex: function () {
    wx.switchTab({
      url: '/pages/order/orderCenter/orderCenter'
    })
  },
  hideFeedbackResult: function() { 
    var pages = getCurrentPages(); // 当前页面
    var beforePage = pages[pages.length - 2]; // 前一个页面 
    wx.navigateBack({
      success: function () {
        beforePage.initPage();
      }
    });
  }
})