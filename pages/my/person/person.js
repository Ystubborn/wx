var app = getApp();
var common = require("../../../common.js");
var area = require("../../../area.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fname: '',
    fphone: '',
    fimageurl: '../../../images/my/photo.png',
    fimageId: '',
    fprovince: '',
    fcity: '',
    fregion: '',
    faddress: '',
    fcontacts: '',
    regionArray: [
      [],
      [],
      []
    ],
    regionName: ['', '', ''],
    region: [0, 0, 0],
    changeMobile: app.globalData.companyCount <= 1
  },

  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    this.initPage();
  },
  initRegion: function() {
    var provinces = [];
    var citys = [];
    var countys = [];
    var pindex = 0,
      cindex = 0,
      rindex = 0;
    for (var f = 0; f < area.city_data.length; f++) {
      var item = area.city_data[f];
      provinces.push({
        id: item.id,
        name: item.name
      });
      if (common.trim(this.data.fprovince).length == 0) {
        if (f > 0) {
          continue;
        }
      } else {
        if (item.id != this.data.fprovince) {
          continue;
        }
      }
      pindex = f;
      for (var t = 0; t < item.city.length; t++) {
        var item2 = item.city[t];
        citys.push({
          id: item2.id,
          name: item2.name
        });
        if (common.trim(this.data.fcity).length == 0) {
          if (t > 0) {
            continue;
          }
        } else {
          if (item2.id != this.data.fcity) {
            continue;
          }
        }
        cindex = t;
        for (var w = 0; w < item2.region.length; w++) {
          var item3 = item2.region[w];
          if (common.trim(this.data.fregion).length == 0) {} else {
            if (item3.id == this.data.fregion) {
              rindex = w;
            }
          }
          countys.push({
            id: item3.id,
            name: item3.name
          });
        }

      }
    }
    var that = this;
    this.setData({
      regionArray: [provinces, citys, countys],
      regionName: [provinces[pindex].name, citys[cindex].name, countys[rindex].name],
      region: [pindex, cindex, rindex]
    });
    wx.hideLoading();
  },
  initPage: function() {
    var that = this;
    common.httpReq('/bill/ydj_customer?operationno=getcustomerinfo', {
      selectedRows: {
        pkValue: app.globalData.userId
      }
    }, function(res) {
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var res = res.data.operationResult.srvData;
        that.setData({
          fname: res.fname,
          fphone: res.fphone,
          fimageId: res.fimage,
          fimageurl: res.fimageurl,
          fprovince: res.fprovince,
          fcity: res.fcity,
          fregion: res.fregion,
          faddress: res.faddress,
          fcontacts: res.fcontacts
        });
        that.initRegion();
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    });
  },
  bindMultiRegionChange: function(e) {
    var region = this.data.region;
    var provinces = this.data.regionArray[0];

    if (e.detail.column == 0) {
      this.setData({
        region: [e.detail.value, 0, 0]
      });

      var citys = [];
      var countys = [];
      var item = area.city_data[e.detail.value];
      var i = 0;
      if (!item) {
        return;
      }
      for (var item2 of item.city) {
        citys.push({
          id: item2.id,
          name: item2.name
        });
        if (i != 0) {
          continue;
        }
        for (var item3 of item2.region) {
          countys.push({
            id: item3.id,
            name: item3.name
          });
        }
        i++;
      }
      region = this.data.region;
      this.setData({
        regionArray: [provinces, citys, countys],
        regionName: [provinces[region[0]].name, citys[region[1]].name, countys[region[2]].name]
      });
    } else if (e.detail.column == 1) {
      this.setData({
        region: [region[0], e.detail.value, 0]
      });
      var citys = this.data.regionArray[1];
      var countys = [];
      if (!area.city_data[region[0]]) {
        return;
      }
      var item = area.city_data[region[0]].city[e.detail.value].region;
      for (var item3 of item) {
        countys.push({
          id: item3.id,
          name: item3.name
        });
      }
      region = this.data.region;
      this.setData({
        regionArray: [provinces, citys, countys],
        regionName: [provinces[region[0]].name, citys[region[1]].name, countys[region[2]].name]
      });
    } else if (e.detail.column == 2) {
      this.setData({
        region: [region[0], region[1], e.detail.value],
      });
      var citys = this.data.regionArray[1];
      var countys = this.data.regionArray[2];
      region = this.data.region;
      this.setData({
        regionArray: [provinces, citys, countys],
        regionName: [provinces[region[0]].name, citys[region[1]].name, countys[region[2]].name]
      });
    }
  },
  changeHeader: function() {
    var that = this;
    wx.showActionSheet({
      itemList: ['拍照', '照片图库'],
      success: function(e) {
        var i = e.tapIndex;
        if (i == 0) {
          wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['camera'],
            success(res) {
              // tempFilePath可以作为img标签的src属性显示图片
              const tempFilePaths = res.tempFilePaths;
              that.uploadImg(tempFilePaths[0], function(res2) {
                var imgInfo = JSON.parse(res2);
                that.setData({
                  fimageurl: imgInfo.url,
                  fimageId: imgInfo.fileId
                });
              });
            }
          })
        } else {
          wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album'],
            success(res) {
              // tempFilePath可以作为img标签的src属性显示图片
              const tempFilePaths = res.tempFilePaths;
              that.uploadImg(tempFilePaths[0], function(res2) {
                var imgInfo = JSON.parse(res2);
                that.setData({
                  fimageurl: imgInfo.url,
                  fimageId: imgInfo.fileId
                });
              });
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
  save: function() {
    var regionArray = this.data.regionArray;
    var region = this.data.region;
    var fprovince = regionArray[0][region[0]].id;
    var fcity = regionArray[1][region[1]].id;
    var fregion = regionArray[2][region[2]].id;

    if (this.data.fname.length == 0) {
      return wx.showToast({
        title: '请输入商户名称',
        icon: 'none'
      })
    }
    if (this.data.fcontacts.length == 0) {
      return wx.showToast({
        title: '请输入商户联系人',
        icon: 'none'
      })
    }
    if (this.data.faddress.length == 0) {
      return wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
    }
    wx.showLoading({
      title: '正在提交'
    })
    var that = this;
    common.httpReq('/bill/ydj_customer?operationno=savecustomerinfo', {
      simpleData: {
        fimage: that.data.fimageId,
        fname: that.data.fname,
        fcontacts: that.data.fcontacts,
        fprovince: fprovince,
        fcity: fcity,
        fregion: fregion,
        faddress: that.data.faddress
      },
      selectedRows: {
        pkValue: app.globalData.userId
      }
    }, function(res) {
      wx.hideLoading();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        wx.showModal({
          title: '提示',
          content: '修改商户信息成功',
          success: function() {
            var pages = getCurrentPages(); // 当前页面
            var beforePage = pages[pages.length - 2]; // 前一个页面 
            wx.navigateBack({
              success: function() {
                beforePage.onLoad({
                  name: that.data.fname,
                  img: that.data.fimageurl
                });
              }
            });
          }
        })
      } else {
        wx.showToast({
          title: res.data.operationResult.simpleMessage,
          icon: 'none'
        })
      }
    });
  },
  fillfname: function(event) {
    var fname = event.detail.value;
    this.setData({
      fname: fname
    });
  },
  fillfcontacts: function(event) {
    var fcontacts = event.detail.value;
    this.setData({
      fcontacts: fcontacts
    });
  },
  fillfaddress: function(event) {
    var faddress = event.detail.value;
    this.setData({
      faddress: faddress
    });
  },
  changeMobile: function() {
    if (app.globalData.companyCount > 1) {
      return wx.showToast({
        title: '由于您的手机号绑定了多个企业，暂不支持修改',
        icon: 'none'
      })
    }
    wx.navigateTo({
      url: '/pages/my/changeMobile/changeMobile',
    })
  }
})