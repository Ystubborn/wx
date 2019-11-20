var app = getApp();
var common = require("../../../common.js");
var area = require("../../../area.js");
let playTimeInterval;
let recordTimeInterval;
let submitFlag = false;
Page({
  //页面数据
  data: {
    fname: '',
    fphone: '',
    fcusaddress: '',
    sex: 1,
    arrival: 0,
    arrivalIndex: 0,
    arrivalList: [{
      name: '未到',
      id: 0
    }, {
      name: '已到',
      id: 1
    }],
    remarkNum: 0,
    remark: '',
    date: '',
    regionArray: [
      [],
      [],
      []
    ],
    regionName: ['', '', ''],
    region: [0, 0, 0],
    furgentname: '',
    furgentphone: '',
    recording: false,
    playing: false,
    hasRecord: false,
    recordTime: 0,
    playTime: 0,
    formatedRecordTime: '00:00:00',
    formatedPlayTime: '00:00:00',
    fprovince: '',
    fcity: '',
    fregion: ''
  },
  //页面初次加载
  onLoad: function () {
    this.getHistoryData();
  },
  onUnload: function() {
    var that = this;
    wx.setStorage({
      key: "add_order_6",
      data: that.data
    });
  },
  initPage: function() {
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
          if (common.trim(this.data.fregion).length == 0) { } else {
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
      region: [pindex, cindex, rindex],
      date: common.formatDate(new Date())
    });
    wx.hideLoading();
  },
  getHistoryData: function() {
    var that = this;
    wx.getStorage({
      key: 'add_order_6',
      success(res) {
        if (res.data) {
          that.setData(res.data);
        }else{ 
          that.initRegion();
        }
      },
      fail: function () {
        that.initRegion();
      }
    });
  },
  initRegion: function() {
    wx.showLoading({
      title: '正在加载',
      icon:'none'
    })
    var that = this;
    common.httpReq('/bill/ydj_customer?operationno=getcustomerinfo', {
      selectedRows: {
        pkValue: app.globalData.userId
      }
    }, function(res) {
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var res = res.data.operationResult.srvData;
        that.setData({
          fprovince: res.fprovince,
          fcity: res.fcity,
          fregion: res.fregion,
        });
        that.initPage();
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    });
  },
  bindfurgentname: function(e) {
    var val = e.detail.value;
    this.setData({
      furgentname: val
    });
  },
  bindfurgentphone: function(e) {
    var val = e.detail.value;
    this.setData({
      furgentphone: val
    });
  },
  bindRadioChange: function(e) {
    var val = e.detail.value;
    this.setData({
      sex: val
    });
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  changeRemark: function(event) {
    var val = event.detail.value;
    this.setData({
      remark: val,
      remarkNum: val.length
    });
  },
  bindArrivalPickerChange: function(e) {
    this.setData({
      arrivalIndex: e.detail.value,
      arrival: this.data.arrivalList[e.detail.value].id
    })
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
  goPre: function() {
    wx.navigateBack();
  },
  addProduct: function(event) {
    if (this.data.fname.length == 0) {
      return wx.showToast({
        title: '请输入联系人姓名',
        icon: 'none'
      });
    }
    if (this.data.fphone.length == 0) {
      return wx.showToast({
        title: '请输入联系电话',
        icon: 'none'
      });
    }
    if (!common.checkPhone(this.data.fphone)) {
      return wx.showToast({
        title: '联系电话格式错误',
        icon: 'none'
      });
    }
    if (this.data.fcusaddress.length == 0) {
      return wx.showToast({
        title: '详细地址',
        icon: 'none'
      });
    }
    if (common.validHasPhone(this.data.fcusaddress)) {
      return wx.showToast({
        title: '详细地址请勿填写联系电话',
        icon: 'none'
      });
    }  
    if (common.validHasPhone(this.data.remark)) {
      return wx.showToast({
        title: '备注请勿填写联系电话',
        icon: 'none'
      });
    }
    if (this.data.furgentname.length == 0) {
      return wx.showToast({
        title: '请输入紧急联系人',
        icon: 'none'
      });
    }
    if (this.data.furgentphone.length == 0) {
      return wx.showToast({
        title: '请输入紧急电话',
        icon: 'none'
      });
    }
    if (!common.checkPhone(this.data.furgentphone)) {
      return wx.showToast({
        title: '紧急电话格式错误',
        icon: 'none'
      });
    }
    //下单
    var that = this;
    wx.setStorage({
      key: "add_order_6",
      data: that.data
    });
 
    var foffertype = wx.getStorageSync("add_order_1").model;
    var fservicetype = wx.getStorageSync("add_order_3").type;
    var servicedata = wx.getStorageSync("add_order_4").date;
    var obj1 = wx.getStorageSync("add_order_2");
    var obj2 = wx.getStorageSync("add_order_5");
    var fexpectamount = 0; //订单金额
    var fserviceentry = []; //项目列表
    for (var item of obj2.items) {
      var amount = parseFloat(item.price) * item.num;
      fexpectamount += amount;

      fserviceentry.push({
        id: '',
        fentityimage: {
          id: item.imgIdList.join(','),
          name: '',
          url: item.imgList.join(',')
        }, //服务图片id
        fseritemid: {
          id: item.serviceItem,
          name: ''
        }, //服务项目id
        fmaterial: {
          id: item.materialItem,
          name: ''
        }, //材质
        fqty: item.num, //数量
        fprice: item.price, //单价
        frequire: item.remark, //要求说明
        froomno: {
          id: '',
          name: ''
        }, //房号
        funitid: item.priceUnit, //单位
        famount: amount, //金额
        funitid_fname: "",
        fprofieldentry: {
          id: obj1.type
        }
      });
    }
    var regionArray = this.data.regionArray;
    var region = this.data.region;
    var fprovince = regionArray[0][region[0]].id;
    var fcity = regionArray[1][region[1]].id;
    var fregion = regionArray[2][region[2]].id;
    if (submitFlag) {
      return;
    }
    submitFlag = true;
    wx.showLoading({
      title: '正在提交中...',
    })
    common.httpReq('/bill/ydj_merchantorder.json?operationno=save', {
      billData: JSON.stringify([{
        id: '',
        fbillno: '',
        fdescription: '',
        fcreatorid: {
          id: "",
          fnumber: "",
          fname: ""
        },
        fcreatedate: "",
        fmodifierid: {
          id: "",
          fnumber: "",
          fname: ""
        },
        fmodifydate: "",
        fstatus: {
          id: "",
          fnumber: "",
          fname: ""
        },
        fapproveid: {
          id: "",
          fnumber: "",
          fname: ""
        },
        fapprovedate: "",
        fcancelstatus: false,
        fcancelid: {
          id: "",
          fnumber: "",
          fname: ""
        },
        fcanceldate: "",
        fchangestatus: {
          id: "",
          fnumber: "",
          fname: ""
        },
        fclosestatus: {
          id: "0",
          fnumber: "正常",
          fname: "正常"
        },
        fcloseid: {
          id: "",
          fnumber: "",
          fname: ""
        },
        fclosedate: "",
        fmainorgid: {
          id: "",
          name: "",
          productId: ""
        },
        fbizruleid: "",
        fflowinstanceid: "",
        ftranid: "",
        ffromtranid: "",
        froottranid: "",
        fsourcetype: {
          id: "",
          fnumber: "",
          fname: ""
        },
        fsourcenumber: "",
        fpublishcid: {
          id: "",
          name: "",
          productId: ""
        },
        fdataorigin: "",
        fprintcount: 0,
        fprintid: {
          id: "",
          fnumber: "",
          fname: ""
        },
        fprintdate: '',
        fservicetype: {
          fenumitem: '',
          id: fservicetype,
          fnumber: '',
          fname: ''
        }, //服务项目
        foffertype: {
          fenumitem: '',
          id: foffertype,
          fnumber: '',
          fname: ''
        }, //报价方式
        fprofield: {
          id: obj1.type,
          name: obj1.typetxt
        }, //服务类目 
        forderdate: servicedata + 'T00:31:53.396Z',
        fmerchantid: {
          id: app.globalData.userId,
          fnumber: '',
          fname: ''
        }, //所属公司
        fmasterphone: '',
        fdatasource: {
          fenumitem: '商户订单',
          id: 'sourcetype_merchant',
          fnumber: '商户订单',
          fname: '商户订单'
        }, //数据来源
        fannotation: '',
        fcompletioncode: '',
        fishang: false,
        fhang: '',
        fisappointedorder: false,
        fmasterid: {
          id: "",
          fnumber: "",
          fname: ""
        },
        fisrepublish: false,
        fcarid: {
          id: "",
          fnumber: "",
          fname: ""
        },
        fceper: 0,
        fcollectadd: obj2.fcollectadd, //提货地址
        fcollectrel: obj2.fcollectrel, //联系方式
        fcollectpho: obj2.fcollectpho, //联系电话
        fisupstairs: false,
        fistransport: false,
        fisarrival: that.data.arrival ? true : false, //是否到货
        flogistics: obj2.flogistics, //物流公司
        flogisticsno: obj2.flogisticsno, //物流单号
        fpieces: obj2.fpieces, //包装件数
        fexpectedarrivaldate: that.data.date + 'T00:00:00.000Z', //到货日期
        fsafeorder: '', //保险单号
        fsafedate: common.formatDate(new Date()) + ' 00:00:00', //投保日期 
        fsafeprice: 0, //保险费用
        fhandlingamount: 0, //搬运费
        fliftbuildamount: 0, //抬楼费
        fshippingamount: obj2.dfPrice, //代付运费
        ffreightamount: 0, //物流运费
        fispay: obj2.payment ? true : false, //是否代付
        fiselevator: false, //是否有电梯
        fisbuyinsurance: false, //是否购买保险
        felevator: 0, //电梯层数
        fname: that.data.fname + (that.data.sex == 1 ? '先生' : '女士'), //业主姓名
        fphone: that.data.fphone, //业主电话
        fcusaddress: that.data.fcusaddress, //详细地址
        fdeductiondate: '',
        furgentname: that.data.furgentname, //紧急联系人
        furgentphone: that.data.furgentphone, //紧急电话 
        fgetnote: '',
        frenode: '',
        fprovince: {
          id: fprovince
        },
        fcity: {
          id: fcity
        },
        fregion: {
          id: fregion
        },
        faddress: '',
        fserstatus: {
          fenumitem: '草稿',
          id: 'sht_serstatus00',
          fnumber: '草稿',
          fname: '草稿'
        }, //状态
        fsettlestatus: {
          fenumitem: '未结算',
          id: 'settle_status01',
          fnumber: '未结算',
          fname: '未结算'
        }, //结算状态
        fservobjid: {
          id: "",
          fnumber: "",
          fname: ""
        },
        fsettleobjid: {
          id: "",
          fnumber: "",
          fname: ""
        },
        fcompletiondate: '',
        fserviceid: '',
        fexpectamount: fexpectamount, //订单金额
        frefundamount: 0, //退款金额
        fsettleamount: 0, //结算金额
        fadditionalfee: 0, //附加费用
        fcashdeducteamount: 0, //现金券抵扣金额
        fcashdeducteid: '',
        fsourcebillnum: '',
        fsourceid: '',
        faccountableamount: 0,
        fwlcaritemid: {
          id: "",
          fnumber: "",
          fname: ""
        },
        fmileage: 0,
        fimage: {
          id: "",
          name: ""
        },
        forderbillno: "",
        fisdelivery: false,
        finstalldate: that.data.date + ' 00:00:00',
        fdeliverydate: "",
        fcareful: that.data.remark, //备注 
        fdispatchtype: {
          id: "",
          fnumber: "",
          fname: ""
        },
        fdispatchbillno: "",
        fdispatchbilldate: "",
        fservicebillno: "",
        finstallbilldate: "",
        fdispatchcombinebillno: "",
        fdispatchcombinebilldate: "",
        fqualstar: {
          id: "",
          fnumber: "",
          fname: ""
        },
        fqual: {
          id: "",
          name: ""
        },
        fevaluatedate: "",
        fevaludesc: "",
        fparenttranid: "",
        ftoptranid: "",
        fname_py: "",
        fname_py2: "",
        sealimg: [],
        sumfield: {},
        fserviceentry: fserviceentry,
        fquotationentry: [],
        fprofield_txt: obj1.typetxt
      }]),
      simpleData: {
        appId: app.globalData.appId
      }
    }, function(res) {
      wx.hideLoading();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        wx.removeStorageSync('add_order_1');
        wx.removeStorageSync('add_order_2');
        wx.removeStorageSync('add_order_3');
        wx.removeStorageSync('add_order_4');
        wx.removeStorageSync('add_order_5');
        wx.removeStorageSync('add_order_6');
        var id = res.data.operationResult.srvData[0].id;
        wx.navigateTo({
          url: '/pages/order/addOrder7/addOrder7?id=' + id
        });
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
      submitFlag = false;
    }, "POST", function() {
      submitFlag = false;
    });
  },
  startRecord: function() {
    if (this.data.recording) {
      return this.stopRecord();
    }
    this.setData({
      recording: true
    })
    const that = this
    recordTimeInterval = setInterval(function() {
      const recordTime = that.data.recordTime += 1
      that.setData({
        formatedRecordTime: common.formatTime(that.data.recordTime),
        recordTime
      })
    }, 1000)

    wx.startRecord({
      success(res) {
        that.setData({
          tempFilePath: res.tempFilePath,
          formatedPlayTime: common.formatTime(that.data.playTime)
        })
      },
      complete() {
        that.setData({
          hasRecord: true,
          recording: false
        })
        clearInterval(recordTimeInterval)
      }
    })
  },
  stopRecord: function() {
    clearInterval(recordTimeInterval);
    wx.stopRecord();
    this.setData({
      hasRecord: true,
      recording: false
    })
  },
  playVoice() {
    if (this.data.playing) {
      return this.stopVoice();
    }
    this.setData({
      playing: true
    })
    const that = this
    playTimeInterval = setInterval(function() {
      const playTime = that.data.playTime + 1;
      that.setData({
        formatedPlayTime: common.formatTime(playTime),
        playTime
      })
    }, 1000)
    wx.playVoice({
      filePath: this.data.tempFilePath,
      success() {
        clearInterval(playTimeInterval)
        that.setData({
          playing: false,
          formatedPlayTime: common.formatTime(playTime),
          playTime: 0
        })
      }
    })
  },

  stopVoice() {
    if (playTimeInterval) {
      clearInterval(playTimeInterval)
    }
    this.setData({
      playing: false,
      formatedPlayTime: common.formatTime(0),
      playTime: 0
    })
    wx.stopVoice()
  },
  deleteRecord: function() {
    this.setData({
      hasRecord: false
    });
    this.stopVoice();
  },
  fillfphone: function(e) {
    var val = e.detail.value;
    this.setData({
      fphone: val
    });
  },
  fillfname: function(e) {
    var val = e.detail.value;
    this.setData({
      fname: val
    });
  },
  fillfcusaddress: function(e) {
    var val = e.detail.value;
    this.setData({
      fcusaddress: val
    });
  }
})