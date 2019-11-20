var app = getApp();
var common = require("../../../common.js");
Page({

  data: {
    id:'',
    fbillno: '',
    fservicebillno:'',
    items: [],
    selectIndex: 0,
    selectItem: '',
    remark: '',
    imgList: [],
    imgIdList: [],
    feedbackResultFlag: false
  },
  onLoad: function(options) {
    this.setData({
      id:options.id,
      fbillno: options.fbillno ,
      fservicebillno: options.fservicebillno 
    });
    this.initPage();
  },
  initPage: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    common.httpReq('/bill/bd_enumdata?operationNo=queryenumdata', {
      simpleData: {
        fid: "deebb5f505214264a917335505ea8e65"
      }
    }, function(res) {
      wx.hideLoading();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var result = res.data.operationResult.srvData.datas;
        that.setData({
          items: result,
          selectItem: result[0].fentryid
        });
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    });
  },
  bindPickerChange: function(e) {
    this.setData({
      selectIndex: e.detail.value,
      selectItem: this.data.items[e.detail.value].fentryid
    })
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
        title: '请填写问题描述',
        icon: 'none'
      })
    }
    wx.showLoading({
      title: '正在提交',
    }) 
    common.httpReq('/bill/ser_servicefeed.json?operationno=save', {
      selectedRows: [],
      billData: JSON.stringify( [{
        "id": "",
        "fbillno": "",
        "fdescription": "",
        "fcreatorid": {
          "id": "",
          "fnumber": "",
          "fname": ""
        },
        "fcreatedate": "",
        "fmodifierid": {
          "id": "",
          "fnumber": "",
          "fname": ""
        },
        "fmodifydate": "",
        "fstatus": {
          "id": "",
          "fnumber": "",
          "fname": ""
        },
        "fapproveid": {
          "id": "",
          "fnumber": "",
          "fname": ""
        },
        "fapprovedate": "",
        "fcancelstatus": false,
        "fcancelid": {
          "id": "",
          "fnumber": "",
          "fname": ""
        },
        "fcanceldate": "",
        "fchangestatus": {
          "id": "",
          "fnumber": "",
          "fname": ""
        },
        "fclosestatus": {
          "id": "0",
          "fnumber": "正常",
          "fname": "正常"
        },
        "fcloseid": {
          "id": "",
          "fnumber": "",
          "fname": ""
        },
        "fclosedate": "",
        "fmainorgid": {
          "id": "",
          "name": "",
          "productId": ""
        },
        "fbizruleid": "",
        "fflowinstanceid": "",
        "ftranid": "",
        "ffromtranid": "",
        "froottranid": "",
        "fsourcetype": {
          "id": "",
          "fnumber": "",
          "fname": ""
        },
        "fsourcenumber": "",
        "fpublishcid": {
          "id": "",
          "name": "",
          "productId": ""
        },
        "fdataorigin": "",
        "fprintcount": 0,
        "fprintid": {
          "id": "",
          "fnumber": "",
          "fname": ""
        },
        "fprintdate": "",
        "fsourceser": that.data.fservicebillno,
        "fmerbill": that.data.fbillno,
        "fsprotype": {
          "fenumitem": that.data.items[that.data.selectIndex].fenumitem,
          "id": that.data.items[that.data.selectIndex].fentryid,
          "fnumber": that.data.items[that.data.selectIndex].fenumitem,
          "fname": that.data.items[that.data.selectIndex].fenumitem
        },
        "fsprotype_txt": "",
        "ffeeddate": common.formatDateTime(new Date()),
        "ffeeder": {
          "id": "",
          "fnumber": "",
          "fname": ""
        },
        "fdealerid": {
          "id": app.globalData.userId,
          "fnumber": "",
          "fname": ""
        },
        "fname": "",
        "fphone": "",
        "faddress": "",
        "fexpectamount": 0,
        "fservicetype": {
          "fenumitem": "",
          "id": "",
          "fnumber": "",
          "fname": ""
        },
        "fhandlestatus": {
          "fenumitem": "待处理",
          "id": "handle_sta002",
          "fnumber": "待处理",
          "fname": "待处理"
        },
        "fprograph": {
          "id": that.data.imgIdList.join(","),
          "fname": ""
        },
        "fprodesript": that.data.remark,
        "freplyimage": {
          "id": "",
          "name": ""
        },
        "freplycontent": "",
        "fresponse": {
          "id": "",
          "fnumber": "",
          "fname": ""
        },
        "freason": "",
        "frestype": {
          "fenumitem": "",
          "id": "",
          "fnumber": "",
          "fname": ""
        },
        "fdealstyle": "",
        "fparenttranid": "",
        "ftoptranid": "",
        "fname_py": "",
        "fname_py2": "",
        "sealimg": [],
        "sumfield": {}
      }]),
      simpleData: {
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
  showDetail: function() {
    wx.redirectTo({
      url: '/pages/order/orderProcess/orderProcess?id=' + this.data.id,
    })
  },
  hideFeedbackResult: function() {
    this.setData({
      feedbackResultFlag: false
    });
    wx.navigateBack();
  }
})