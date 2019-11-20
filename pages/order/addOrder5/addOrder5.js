var app = getApp();
var common = require("../../../common.js");
var service_price = {}; 
var source_item = "";
Page({
  //页面数据
  data: {
    fservicetype: '',
    flogistics: '',
    flogisticsno: '',
    fcollectadd: '',
    fcollectrel: '',
    fcollectpho: '',
    fpieces: 1,
    dfPrice: 0,
    payment: 1,
    paymentIndex: 1,
    paymentList: [{
      name: '否',
      id: 0
    }, {
      name: '是',
      id: 1
    }],
    items: [{
      priceUnit: '',
      priceUnitName:'',
      priceUnitIndex: 0,
      priceUnitList: [],
      imgList: [],
      imgIdList: [],
      serviceItems: [{
        id: '0',
        name: '请选择服务项目'
      }],
      serviceIndex: 0,
      serviceItem: '0',
      materialItems: [{
        id: '0',
        name: '请选择材质'
      }],
      materialIndex: 0,
      materialItem: '0',
      num: 1,
      price: 0,
      remarkNum: 0,
      remark: ''
    }]
  },
  onLoad: function() {
    var that = this; 
    that.getHistoryData(); 
  },
  onUnload: function() {
    var that = this;
    wx.setStorage({
      key: "add_order_5",
      data: that.data
    });
  },
  getHistoryData: function() {
    var that = this;
    wx.getStorage({
      key: 'add_order_5',
      success(res) {
        if (res.data) { 
          that.setData(res.data);
        }else{
          that.initPage();
        }
      },
      fail:function(){
        that.initPage();
      }
    });
  },
  bindServiceItemsChange: function(event) {
    var pid = event.currentTarget.dataset.pid;
    var items = this.data.items;
    items[pid].serviceIndex = event.detail.value;
    items[pid].serviceItem = items[pid].serviceItems[event.detail.value].id;

    this.setData({
      items: items
    })
    if (items[pid].materialItem) {
      var name = items[pid].serviceItem + '_' + items[pid].materialItem;
      var price = service_price[name];
      if (!price || price == '') {
        price = 0;
      }
      items[pid].price = price;
      this.setData({
        items: items
      })
    }

  },
  bindMaterialIndexChange: function(event) {
    var pid = event.currentTarget.dataset.pid;
    var items = this.data.items;
    items[pid].materialIndex = event.detail.value;
    if (items[pid].materialItems.length == 0) {
      return;
    }
    items[pid].materialItem = items[pid].materialItems[event.detail.value].id;
    this.setData({
      items: items
    })
    if (items[pid].serviceItem) {
      var name = items[pid].serviceItem + '_' + items[pid].materialItem;
      var price = service_price[name];
      if (!price || price == '') {
        price = 0;
      }
      items[pid].price = price;
      this.setData({
        items: items
      })
    }
  },
  bindPaymentPickerChange: function(e) {
    this.setData({
      paymentIndex: e.detail.value,
      payment: this.data.paymentList[e.detail.value].id
    })
  },
  bindPriceUnitPickerChange: function(event) {
    var pid = event.currentTarget.dataset.pid;
    var items = this.data.items;
    items[pid].priceUnitIndex = event.detail.value;
    items[pid].priceUnit = items[pid].priceUnitList[event.detail.value].id;
    items[pid].priceUnitName = items[pid].priceUnitList[event.detail.value].name;
    this.setData({
      items: items
    })
  },
  chooseImg: function(event) {
    var id = event.currentTarget.dataset.id;
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
              var items = that.data.items;
              var imgList = items[id].imgList;
              var imgIdList = items[id].imgIdList;
              for (var i = 0; i < tempFilePaths.length; i++) {
                that.uploadImg(tempFilePaths[i], function(res2) {
                  var imgInfo = JSON.parse(res2);
                  imgList.push(imgInfo.url);
                  imgIdList.push(imgInfo.fileId);
                  items[id].imgList = imgList;
                  items[id].imgIdList = imgIdList;
                  that.setData({
                    items: items
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
              var items = that.data.items;
              var imgList = items[id].imgList;
              var imgIdList = items[id].imgIdList;
              for (var i = 0; i < tempFilePaths.length; i++) {
                that.uploadImg(tempFilePaths[i], function(res2) {
                  var imgInfo = JSON.parse(res2);
                  imgList.push(imgInfo.url);
                  imgIdList.push(imgInfo.fileId);
                  items[id].imgList = imgList;
                  items[id].imgIdList = imgIdList;
                  that.setData({
                    items: items
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
    var pid = event.currentTarget.dataset.pid;
    var items = this.data.items;
    var imgList = items[pid].imgList
    var imgIdList = items[pid].imgIdList
    imgList.splice(id, 1);
    imgIdList.splice(id, 1);
    items[pid].imgList = imgList;
    items[pid].imgIdList = imgIdList;
    this.setData({
      items: items
    });
  },
  showImg: function(event) {
    var id = event.currentTarget.dataset.id;
    var pid = event.currentTarget.dataset.pid;
    var items = this.data.items;
    var imgList = items[pid].imgList;
    wx.previewImage({
      current: imgList[id], // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  decrFpieces: function(event) {
    if (this.data.fpieces > 1) {
      this.setData({
        fpieces: parseInt(this.data.fpieces) - 1
      });
    }
  },
  incrFpieces: function(event) {
    this.setData({
      fpieces: parseInt(this.data.fpieces) + 1
    });
  },
  decrDfPrice: function(event) {
    if (this.data.dfPrice > 1) {
      this.setData({
        dfPrice: parseFloat(this.data.dfPrice) - 1
      });
    }
  },
  incrDfPrice: function(event) {
    this.setData({
      dfPrice: parseFloat(this.data.dfPrice) + 1
    });
  },
  decrNum: function(event) {
    var pid = event.currentTarget.dataset.pid;
    var items = this.data.items;
    if (items[pid].num > 1) {
      items[pid].num = parseInt(items[pid].num) - 1;
      this.setData({
        items: items
      });
    }
  },
  incrNum: function(event) {
    var pid = event.currentTarget.dataset.pid;
    var items = this.data.items;
    items[pid].num = parseInt(items[pid].num) + 1;
    this.setData({
      items: items
    });
  },
  decrPrice: function(event) {
    var pid = event.currentTarget.dataset.pid;
    var items = this.data.items;
    if (items[pid].price > 1) {
      items[pid].price = parseFloat(items[pid].price) - 1;
      this.setData({
        items: items
      });
    }
  },
  incrPrice: function(event) {
    var pid = event.currentTarget.dataset.pid;
    var items = this.data.items;
    items[pid].price = parseFloat(items[pid].price) + 1;
    this.setData({
      items: items
    });
  },
  fillNum: function(event) {
    var pid = event.currentTarget.dataset.pid;
    var items = this.data.items;
    items[pid].num = event.detail.value;
    this.setData({
      items: items
    });
  },
  fillPrice: function(event) {
    var pid = event.currentTarget.dataset.pid;
    var items = this.data.items;
    items[pid].price = event.detail.value;
    this.setData({
      items: items
    });
  },
  changeRemark: function(event) {
    var pid = event.currentTarget.dataset.pid;
    var val = event.detail.value;
    var items = this.data.items;
    items[pid].remarkNum = val.length;
    items[pid].remark = val;
    this.setData({
      items: items
    });
  },
  addItem: function() {
    var items = this.data.items;
    items.push(JSON.parse(source_item));
    this.setData({
      items: items
    });
  },
  removeItem: function(event) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否删除当前商品组',
      success(res) {
        if (res.confirm) {
          var pid = event.currentTarget.dataset.pid;
          var items = that.data.items;
          items.splice(pid, 1);
          that.setData({
            items: items
          });
        }
      }
    })
  },
  addProduct: function(event) {
    if (this.data.fservicetype == 'fres_type_01' || this.data.fservicetype == 'fres_type_03') { 
      if (this.data.flogistics.length == 0) {
        return wx.showToast({
          title: '请输入物流公司名称',
          icon: 'none'
        });
      }
      if (this.data.flogisticsno.length == 0) {
        return wx.showToast({
          title: '请填写物流单号',
          icon: 'none'
        });
      }
      if (this.data.fcollectadd.length == 0) {
        return wx.showToast({
          title: '请填写提货详细地址',
          icon: 'none'
        });
      }
      if (common.validHasPhone(this.data.fcollectadd)) {
        return wx.showToast({
          title: '提货详细地址请勿填写联系电话',
          icon: 'none'
        });
      }
      // if (this.data.fcollectrel.length == 0) {
      //   return wx.showToast({
      //     title: '请填写提货人',
      //     icon: 'none'
      //   });
      // }
      if (this.data.fcollectpho.length == 0) {
        return wx.showToast({
          title: '请填写联系电话',
          icon: 'none'
        });
      }
      if (!common.checkPhone(this.data.fcollectpho)) {
        return wx.showToast({
          title: '联系电话格式错误',
          icon: 'none'
        });
      }
      if (this.data.fpieces.length == 0) {
        return wx.showToast({
          title: '请输入包装件数',
          icon: 'none'
        });
      }
      if (this.data.payment == 1 && this.data.dfPrice == 0) {
        return wx.showToast({
          title: '代付运费必须大于0元',
          icon: 'none'
        });
      }
    }
    if (this.data.fservicetype != 'fres_type_03') {
      var count = 0;
      var serviceStr = '';
      for (var item of this.data.items) {
        count++;
        if (item.imgList.length == 0) {
          return wx.showToast({
            title: '请在安装详情(' + count + ')中添加安装照片',
            icon: 'none'
          });
        }
        if (item.serviceItem == '0') {
          return wx.showToast({
            title: '请在安装详情(' + count + ')中选择服务项目',
            icon: 'none'
          });
        }
        if (item.materialItem == '0') {
          return wx.showToast({
            title: '请在安装详情(' + count + ')中选择材质',
            icon: 'none'
          });
        }
        if (item.num == '' || item.num <=0 ) {
          return wx.showToast({
            title: '请在安装详情(' + count + ')中设置数量',
            icon: 'none'
          });
        }
        if (item.price == '' || item.price <= 0) {
          return wx.showToast({
            title: '请在安装详情(' + count + ')中设置期望单价',
            icon: 'none'
          });
        } 
        if (item.remark.length > 0 && common.validHasPhone(item.remark)){
          return wx.showToast({
            title: '安装详情(' + count + ')中特殊要求请勿填写联系电话',
            icon: 'none'
          });
        }
        if (serviceStr.indexOf(item.serviceItem + ",") > -1) {
          return wx.showToast({
            title: '安装详情中服务项目重复',
            icon: 'none'
          });
        }
        serviceStr += item.serviceItem + ",";
      }
    }

    var that = this;
    wx.setStorage({
      key: "add_order_5",
      data: that.data
    });
    wx.navigateTo({
      url: '/pages/order/addOrder6/addOrder6',
    })
  },
  fillFlogistics: function(e) {
    var val = e.detail.value;
    this.setData({
      flogistics: val
    });
  },
  fillFlogisticsno: function(e) {
    var val = e.detail.value;
    this.setData({
      flogisticsno: val
    });
  },
  fillFcollectadd: function(e) {
    var val = e.detail.value;
    this.setData({
      fcollectadd: val
    });
  },
  fillFcollectrel: function(e) {
    var val = e.detail.value;
    this.setData({
      fcollectrel: val
    });
  },
  fillFcollectpho: function(e) {
    var val = e.detail.value;
    this.setData({
      fcollectpho: val
    });
  },
  fillFpieces: function(e) {
    var val = e.detail.value;
    this.setData({
      fpieces: val
    });
  },
  fillDfPrice: function(e) {
    var val = e.detail.value;
    this.setData({
      dfPrice: val
    });
  },
  initPage: function() {
    wx.showLoading({
      title: '正在加载...',
    })
    var that = this;
    var data1 = wx.getStorageSync("add_order_3");
    var data2 = wx.getStorageSync("add_order_2");
    this.setData({
      fservicetype: data1.type
    });

    common.httpReq('/list/ydj_seritemprice?operationno=querydata', {
      filterString: "(fservicetype='" + data1.type + "' and fprofield='" + data2.type + "') and  fdealerid='425236371930746886'",
      simpleData: {
        appId: app.globalData.appId
      }
    }, function(res) {
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var curList = res.data.operationResult.srvData.data; 
        var items = that.data.items;
        var item = items[0];
        var serviceItemString = '';
        var materialItemsString = '';
        for (var obj of curList) {
          if (serviceItemString.indexOf(obj.fseritemid) == -1) {
            serviceItemString += (obj.fseritemid + '|');
            item.serviceItems.push({
              id: obj.fseritemid,
              name: obj.fseritemid_fname
            });
          }
          if (materialItemsString.indexOf(obj.fmaterial) == -1) {
            materialItemsString += (obj.fmaterial + '|');
            item.materialItems.push({
              id: obj.fmaterial,
              name: obj.fmaterial_fenumitem
            });
          }
          var name = obj.fseritemid + '_' + obj.fmaterial;
          service_price[name] = obj.fsellprice;
        } 
        items[0] = item;
        that.setData({
          items: items
        });
        that.initUnit();
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    });
  },
  initUnit: function() {
    var that = this;
    common.httpReq('/list/ydj_unit?operationno=querydata', {
      filterString: "",
      simpleData: {
        appId: app.globalData.appId
      }
    }, function(res) {
      wx.hideLoading();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var curList = res.data.operationResult.srvData.data;
        var items = that.data.items;
        for (var i = 0; i < curList.length; i++) {
          var item = curList[i];
          items[0].priceUnitList.push({
            id: item.fbillhead_id,
            name: item.fname,
          });
          if (i == 0) {
            items[0].priceUnit = item.fbillhead_id;
            items[0].priceUnitName = item.fname;
          }
        }
        that.setData({
          items: items
        });
        source_item = JSON.stringify(that.data.items[0]);
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    });
  }

})