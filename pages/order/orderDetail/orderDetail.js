var app = getApp();
var common = require("../../../common.js");
var taskRun = false;
var payFlag = false;
Page({
  data: {
    ready: false,
    id: '',
    status: '',
    fservicetype: '',
    fprofield: '',
    fisarrival: '',
    fexpectedarrivaldate: '',
    fexpectamount: '',
    fserviceentry: '',
    fname: '',
    fphone: '',
    fprovince: '',
    fcity: '',
    fregion: '',
    fcusaddress: '',
    fbillno: '',
    fservicebillno: '',
    fcreatedate: '',
    forderdate: '',
    flogistics: '',
    flogisticsno: '',
    fcollectadd: '',
    fcollectrel: '',
    fcollectpho: '',
    fpieces: '',
    fshippingamount: '',
    fispay: '',
    furgentname: '',
    furgentphone: '',
    fmastercount: '0',
    fmasterList: [],
    fmasterOtherList: [],
    fmasterid_fname: '',
    fmasterid_fimage: '',
    fquotationamount: '',
    fappointdate: '',
    fappointenddate: '',
    fautodowntime: '',
    freportdate: '',
    fsubscribedate: '',
    fmasterphone: '',
    fautodowntime_day: '0',
    fautodowntime_hour: '0',
    fautodowntime_mintue: '0',
    fautodowntime_second: '0',
    fcompletioncode: '',
    fquotationid: '',
    cid: '',
    cname: '请选择',
    cval: 0,
    showPay: false,
    showPayContent: true,
    showPayItem: false,
    showPayResult: false,
    pwdVal: '',
    payFocus: true,
    payType: 'account',
    hasYsbx: 0,
    hasYsbxVal: 10,
    foffertype: {},
    payResult: true,
    finishResultFlag: false,
    payRestltTxt: ''
  },
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      ready: false,
      id: options.id
    });
    this.initPage();
  },
  onReady: function() {
    this.popover = this.selectComponent('#popover');
  },
  initPage: function() {
    var that = this;
    common.httpReq('/bill/ydj_merchantorder.json?operationno=initbill', {
      simpleData: {
        id: that.data.id,
        appId: app.globalData.appId
      }
    }, function(res) {
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        that.setData({
          status: '',
          fservicetype: '',
          fprofield: '',
          fisarrival: '',
          fexpectedarrivaldate: '',
          fexpectamount: '',
          fserviceentry: '',
          fname: '',
          fphone: '',
          fprovince: '',
          fcity: '',
          fregion: '',
          fcusaddress: '',
          fbillno: '',
          fservicebillno: '',
          fcreatedate: '',
          forderdate: '',
          flogistics: '',
          flogisticsno: '',
          fcollectadd: '',
          fcollectrel: '',
          fcollectpho: '',
          fpieces: '',
          fshippingamount: '',
          fispay: '',
          furgentname: '',
          furgentphone: '',
          fmastercount: '0',
          fmasterList: [],
          fmasterOtherList: [],
          fmasterid_fname: '',
          fmasterid_fimage: '',
          fquotationamount: '',
          fappointdate: '',
          fappointenddate: '',
          fautodowntime: '',
          freportdate: '',
          fsubscribedate: '',
          fmasterphone: '',
          fautodowntime_day: '0',
          fautodowntime_hour: '0',
          fautodowntime_mintue: '0',
          fautodowntime_second: '0',
          fcompletioncode: '',
          fquotationid: '',
          cid: '',
          cname: '请选择',
          cval: 0,
          showPay: false,
          showPayContent: true,
          showPayItem: false,
          showPayResult: false,
          pwdVal: '',
          payFocus: true,
          payType: 'account',
          hasYsbx: 0,
          hasYsbxVal: 10,
          foffertype: {},
          payResult: true,
          finishResultFlag: false,
          payRestltTxt: ''
        });
        var datas = res.data.operationResult.srvData.uiData;
        var other = res.data.operationResult.srvData.tagData.linkSrvBillData[0];
        var status = datas.fserstatus.id;
        var fserstatus = '';
        if (status == 'sht_serstatus01') {
          fserstatus = '您已取消订单！';
        } else if (status == 'sht_serstatus02') {
          fserstatus = '订单已拒单！';
        } else if (status == 'sht_serstatus03') {
          fserstatus = '订单发布成功！';
        } else if (status == 'sht_serstatus10') {
          if (datas.foffertype.id == 'offer_type_01') {
            fserstatus = '师傅已抢单，请雇佣师傅！';
          } else {
            fserstatus = '师傅已报价，请雇佣师傅！';
          }
        } else if (status == 'sht_serstatus11') {
          fserstatus = '已雇佣，请及时支付费用！';
        } else if (status == 'sht_serstatus12') {
          fserstatus = '已支付,待师傅预约时间！';
        } else if (status == 'sht_serstatus13' || status == 'sht_serstatus16') {
          fserstatus = '已预约,待师傅上门服务！';
        } else if (status == 'sht_serstatus06') {
          fserstatus = '服务中，请及时验收！';
        } else if (status == 'sht_serstatus07') {
          fserstatus = '已完工，请及时验收！';
        } else if (status == 'sht_serstatus08') {
          fserstatus = '订单已验收完成！';
        } else if (status == 'sht_serstatus00') {
          fserstatus = '订单待提交发布！';
        }
        var fserviceentry = datas.fserviceentry;
        if (fserviceentry) {
          for (var item of fserviceentry) {
            var imageArray = item.fentityimage.imageurl.split(',');
            item.img = imageArray[0];
            item.imgs = imageArray;
          }
        }

        that.setData({
          status: status,
          fserstatus: fserstatus,
          fservicetype_txt: datas.fservicetype.fname, //类型 
          fservicetype: datas.fservicetype.id, //类型 
          fprofield: datas.fprofield.name, //类目
          fisarrival: datas.fisarrival, //是否到货
          fexpectedarrivaldate: datas.fexpectedarrivaldate ? datas.fexpectedarrivaldate.substr(0, 10) : '', //预计到货日期
          fexpectamount: datas.fexpectamount, //订单金额
          fserviceentry: fserviceentry, //产品信息
          fname: datas.fname, //客户姓名
          fphone: datas.fphone, //联系电话
          fprovince: datas.fprovince.fenumitem, //省
          fcity: datas.fcity.fenumitem, //市
          fregion: datas.fregion.fenumitem, //区
          fcusaddress: datas.fcusaddress, //详细地址
          fbillno: datas.fbillno, //订单编号
          fservicebillno: datas.fservicebillno,
          fcreatedate: common.formatDateTime0(datas.fcreatedate), //创建时间
          forderdate: datas.forderdate.substr(0, 10), //期望服务日期
          flogistics: datas.flogistics,
          flogisticsno: datas.flogisticsno,
          fcollectadd: datas.fcollectadd,
          fcollectrel: datas.fcollectrel,
          fcollectpho: datas.fcollectpho,
          fpieces: datas.fpieces,
          fshippingamount: datas.fshippingamount,
          fispay: datas.fispay,
          furgentname: datas.furgentname,
          furgentphone: datas.furgentphone,
          fmasterid_fname: other ? other.fmasterid_fname : '',
          fmasterid_fimage: other ? other.fmasterid_fimage : '',
          fquotationamount: other ? other.fquotationamount : '',
          fappointdate: other ? common.formatDateTime2(other.fappointdate) : '',
          fappointenddate: other ? common.formatDateTime3(other.fappointenddate) : '',
          freportdate: other ? other.freportdate : '',
          fsubscribedate: other ? common.formatDateTime2(other.fsubscribedate) : '',
          fmevaluatedate: other ? other.fmevaluatedate : '',
          fmasterphone: datas.fmasterphone,
          fmasterphone_txt: datas.fmasterphone.length == 11 ? datas.fmasterphone.substr(0, 3) + '****' + datas.fmasterphone.substr(7, 4) : '',
          fautodowntime: datas.fautodowntime,
          fcompletioncode: datas.fcompletioncode,
          amountlist: datas.amountlist,
          faccountableamount: datas.frealamount,
          foffertype: datas.foffertype,
          fquotationid: datas.fquotationid
        });
        if (!other || other.fmasterid_fname == '') {
          that.loadQuotation();
        } else {
          that.setData({
            ready: true
          });
          wx.hideLoading();
        }
        if (!taskRun) {
          that.runTimeOut();
        }
      } else {
        wx.hideLoading();
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    });

  },
  runTimeOut: function() {
    taskRun = true;
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
        setTimeout(function() {
          that.runTimeOut();
        }, 1000);
      }
    }
  },
  loadQuotation: function() {
    var that = this;
    common.httpReq('/bill/ydj_quotation?operationno=getQuotationList', {
      simpleData: {
        orderId: that.data.id,
        appId: app.globalData.appId,
        pageIndex: 1,
        pageSize: 4
      }
    }, function(res) {
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var datas = res.data.operationResult.srvData.datas;
        var pages = res.data.operationResult.srvData.pageInfos;
        that.setData({
          fmastercount: pages.pageRows,
          fmasterList: datas
        });
        if (datas.length != 4) {
          var temp = [];
          for (var i = 0; i < 4 - datas.length; i++) {
            temp.push(i);
          }
          that.setData({
            fmasterOtherList: temp
          });
        }
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
      wx.hideLoading();
      that.setData({
        ready: true
      });
    });

  },
  goOrderQuote: function() {
    wx.navigateTo({
      url: '/pages/order/orderQuote/orderQuote?id=' + this.data.id + '&fautodowntime=' + this.data.fautodowntime + '&foffertype=' + this.data.foffertype.id + '&status=' + this.data.status,
    })
  },
  callMobile: function(e) {
    var mobile = e.currentTarget.dataset.mobile;
    wx.makePhoneCall({
      phoneNumber: mobile
    })
  },
  showImg: function(event) {
    var imgs = event.currentTarget.dataset.imgs;
    wx.previewImage({
      current: imgs[0],
      urls: imgs
    })
  },
  cancelOrder: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否取消订单？',
      success: function(res) {
        if (res.confirm) {
          common.httpReq('/bill/ydj_merchantorder.json?operationno=sht_cancelbill', {
            selectedRows: {
              pkValue: that.data.id
            },
            simpleData: {
              appId: app.globalData.appId
            }
          }, function(res) {
            if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
              wx.showToast({
                title: res.data.operationResult.complexMessage.successMessages[0],
                icon: 'success'
              });
              that.initPage();
            } else {
              wx.showToast({
                title: res.data.operationResult.complexMessage.errorMessages[0],
                icon: 'none'
              })
            }
          });
        }
      }
    })
  },
  rePublish: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否重新发布订单？',
      success: function(res) {
        if (res.confirm) {
          common.httpReq('/bill/ydj_merchantorder.json?operationno=releaseorder', {
            selectedRows: {
              pkValue: that.data.id
            },
            simpleData: {
              appId: app.globalData.appId
            }
          }, function(res) {
            if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
              wx.showToast({
                title: '重新发布成功！',
                icon: 'success'
              });
              that.initPage();
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
  },
  publish: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否发布订单？',
      success: function(res) {
        if (res.confirm) {
          common.httpReq('/bill/ydj_merchantorder.json?operationno=sht_submitbill', {
            selectedRows: {
              pkValue: that.data.id
            },
            simpleData: {
              appId: app.globalData.appId
            }
          }, function(res) {
            if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
              wx.showToast({
                title: '提交发布成功！',
                icon: 'success'
              });
              that.initPage();
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
  },
  showCode: function() {
    var that = this;
    wx.showModal({
      title: '当前订单完工码为：',
      content: that.data.fcompletioncode
    })
  },
  showFinishResult: function() {
    this.setData({
      finishResultFlag: true
    });
  },
  hideFinishResult: function() {
    this.setData({
      finishResultFlag: false
    });
  },
  finishOrder: function() {
    var that = this;
    common.httpReq('/bill/ydj_merchantorder.json?operationno=sht_acceptbill', {
      selectedRows: {
        pkValue: that.data.id
      },
      simpleData: {
        appId: app.globalData.appId
      }
    }, function(res) {
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        wx.showToast({
          title: '订单验收成功',
          icon: 'success'
        });
        that.initPage();
        wx.navigateTo({
          url: '/pages/order/comment/comment?id=' + that.data.id
        })
      } else {
        wx.showToast({
          title: res.data.operationResult.simpleMessage,
          icon: 'none'
        })
      }
    });
  },
  goCoupon: function() {
    wx.navigateTo({
      url: '/pages/my/usableCoupon/usableCoupon?oid=' + this.data.id + '&cid=' + this.data.cid,
    })
  },
  setCoupon: function(cid, cname, cval) {
    this.setData({
      cid: cid,
      cname: cname,
      cval: cval
    });
  },
  switchYsbxChange: function(e) {
    this.setData({
      hasYsbx: e.detail.value ? 1 : 0
    });
  },
  switchDsfzrxChange: function(e) {
    this.setData({
      hasDsfzrx: e.detail.value
    });
  },
  showPay: function() {
    var that = this;
    common.httpReq('/bill/ydj_customer?operationno=getcustomerpaypwd', {
      selectedRows: {
        pkValue: app.globalData.userId
      }
    }, function(res) {
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var res = res.data.operationResult.srvData;
        if (res.fispaypwd) {
          that.setData({
            showPay: true
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '您还未设置支付密码，去设置？',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/my/payPwd/payPwd',
                })
              } else if (res.cancel) {
                that.setData({
                  showPay: true
                })
              }
            }
          })
        }
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    });
  },
  hidePay: function() {
    this.setData({
      pwdVal: '',
      showPay: false
    })
    this.initPage();
  },
  hidePayItem: function() {
    this.setData({
      pwdVal: '',
      showPayContent: true,
      showPayItem: false,
      showPayResult: false,
    })
  },
  hidePayResult: function() {
    this.setData({
      showPay: false,
      showPayContent: true,
      showPayItem: false,
      showPayResult: false,
    });
    this.initPage();
  },
  /**
   * 获取焦点
   */
  getFocus: function() {
    this.setData({
      payFocus: true
    });
  },
  reflushOrder: function() {
    this.initPage();
  },
  goAddOrder: function() {
    wx.switchTab({
      url: '/pages/order/addOrder0/addOrder0'
    })
  },
  goRecharge: function() {
    this.hidePayResult();
    wx.navigateTo({
      url: '/pages/my/recharge/recharge',
    })
  },
  /**
   * 输入密码监听
   */
  inputPwd: function(e) {
    this.setData({
      pwdVal: e.detail.value,
      payFocus: this.data.payType == 'account' ? true : false
    });
    if (e.detail.value.length >= 6) {
      this.paySubmit();
    }
  },
  selectPayType: function(e) {
    var type = e.currentTarget.dataset.type;
    this.setData({
      pwdVal: '',
      showPayContent: true,
      showPayItem: false,
      payType: type,
      payFocus: type == 'account' ? true : false
    });
  },
  showPayType: function(e) {
    this.setData({
      showPayResult: false,
      showPayContent: false,
      showPayItem: true,
      payFocus: this.data.payType == 'account' ? true : false
    });
  },
  paySubmit: function() {
    if (payFlag) {
      return;
    }
    payFlag = true;
    var that = this;
    wx.showLoading({
      title: '正在支付'
    })
    common.httpReq('/bill/ydj_customer?operationno=validatepaypwd', {
      simpleData: {
        fpaypwd: that.data.pwdVal.substr(0, 6)
      },
      selectedRows: {
        pkValue: app.globalData.userId
      },
    }, function(res) {
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        that.accoutPay();
      } else {
        payFlag = false;
        that.setData({
          pwdVal: ''
        });
        wx.hideLoading();
        wx.showToast({
          title: res.data.operationResult.simpleMessage,
          icon: 'none'
        })
      }
    }, "POST", function() {
      wx.hideLoading();
    });

  },
  accoutPay: function() {
    var that = this;
    common.httpReq('/bill/ydj_merchantorder?operationno=orderPayApplet', {
      simpleData: {
        fpaymethod: "",
        openid: "",
        fid: that.data.id,
        fisbalancepayment: 1,
        fisbuyinsurance: that.data.hasYsbx,
        appId: app.globalData.appId,
        fcashcouponsid: that.data.cid
      },
      selectedRows: {
        pkValue: that.data.id
      },
    }, function(res) {
      payFlag = false;
      wx.hideLoading();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        that.setData({
          showPayContent: false,
          showPayItem: false,
          showPayResult: true,
          payResult: true
        });
      } else {
        that.setData({
          pwdVal: '',
          showPayContent: false,
          showPayItem: false,
          showPayResult: true,
          payResult: false,
          payRestltTxt: res.data.operationResult.simpleMessage
        });
      }
    }, "POST", function() {
      wx.hideLoading();
      payFlag = false;
    });
  },
  wxpay: function() {
    if (payFlag) {
      return;
    }
    payFlag = true;
    wx.showLoading({
      title: '正在支付'
    })
    var that = this;
    common.httpReq('/bill/ydj_merchantorder?operationno=orderPayApplet', {
      simpleData: {
        fpaymethod: "WeChat",
        openid: app.globalData.openId,
        fid: that.data.id,
        fisbalancepayment: 0,
        fisbuyinsurance: that.data.hasYsbx,
        appId: app.globalData.appId,
        fcashcouponsid: that.data.cid
      },
      selectedRows: {
        pkValue: that.data.id
      },
    }, function(res) {
      payFlag = false;
      wx.hideLoading();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var res = res.data.operationResult.srvData;
        wx.requestPayment({
          timeStamp: res.timeStamp,
          nonceStr: res.nonceStr,
          package: res.package,
          signType: res.signType,
          paySign: res.paySign,
          success(res) {
            wx.showModal({
              title: '支付提示',
              content: '订单支付成功！',
              success: function() {
                that.setData({
                  showPayContent: false,
                  showPayItem: false,
                  showPayResult: true,
                  payResult: true
                });
              }
            })
          },
          fail(res) {
            if (res.errMsg == "requestPayment:fail cancel") {
              wx.showToast({
                title: '支付已取消！',
                icon: 'none'
              });
            } else {
              wx.showToast({
                title: '支付失败，请稍后重试！',
                icon: 'none'
              });
            }
          }
        })
      } else {
        wx.showToast({
          title: '获取支付参数失败！',
          icon: 'none'
        });
      }
    }, "POST", function() {
      wx.hideLoading();
      payFlag = false;
    });
  },
  showMore: function(e) {
    // 获取元素的坐标信息
    wx.createSelectorQuery().select('#' + e.target.id).boundingClientRect(res => {
      this.popover.onDisplay(res);
    }).exec();
  },
  goQuoteDetail: function(e) {
    wx.navigateTo({
      url: '/pages/order/orderQuoteDetail/orderQuoteDetail?id=' + this.data.id,
    })
    this.popover.onHide();
  },
  goOrderProcess: function(e) {
    wx.navigateTo({
      url: '/pages/order/orderProcess/orderProcess?id=' + this.data.id,
    })
    this.popover.onHide();
  },
  feedback: function() {
    wx.navigateTo({
      url: '/pages/order/feedback/feedback?id=' + this.data.id + '&fbillno=' + this.data.fbillno + '&fservicebillno=' + this.data.fservicebillno,
    })
  },
  goComment: function() {
    wx.navigateTo({
      url: '/pages/order/comment/comment?id=' + this.data.id,
    })
  },
  toTransportProtocol: function() {
    wx.navigateTo({
      url: '/pages/protocol/protocol?title=左右手运送保细则&type=singlearticle_11',
    })
  },
  toThirdProtocol: function() {
    wx.navigateTo({
      url: '/pages/protocol/protocol?title=第三方保障细则&type=singlearticle_09'
    })
  }
})