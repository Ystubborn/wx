var app = getApp();
var common = require("../../../common.js");
var payFlag = false;
Page({
  data: {
    id: '',
    data: {},
    ready: false,
    showWtdxxFlag: true,
    showShxxFlag: true,
    showDdxxFlag: true,
    showAzxxFlag: true,
    showPay: false,
    showPayContent: true,
    showPayItem: false,
    showPayResult: false,
    pwdVal: '',
    payFocus: true,
    payType: 'account',
    payResult: true,
    payRestltTxt: '',
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      id: options.id
    });
    this.initPage();
  },
  initPage: function () {
    var that = this;
    that.setData({
      data: {},
      showPay: false,
      showPayContent: true,
      showPayItem: false,
      showPayResult: false,
      ready: false
    });
    common.httpReq('/bill/ydj_additionalfee?operationno=initbill', {
      selectedRows: [{
        pkValue: that.data.id
      }],
      simpleData: {
        id: that.data.id,
        appId: app.globalData.appId
      }
    }, function (res) {
      wx.hideLoading();
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var data = res.data.operationResult.srvData.uiData;
        data.fimage.fimageurl = common.trim(data.fimage.fimageurl).length > 0 ? data.fimage.fimageurl.split(',') : [];
        that.setData({
          data: data,
          ready: true
        });
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    });
  },
  showWtdxx: function () {
    this.setData({
      showWtdxxFlag: !this.data.showWtdxxFlag
    });
  },
  showShxx: function () {
    this.setData({
      showShxxFlag: !this.data.showShxxFlag
    });
  },
  showDdxx: function () {
    this.setData({
      showDdxxFlag: !this.data.showDdxxFlag
    });
  },
  showAzxx: function () {
    this.setData({
      showAzxxFlag: !this.data.showAzxxFlag
    });
  },
  callMobile: function (e) {
    var mobile = e.currentTarget.dataset.mobile;
    wx.makePhoneCall({
      phoneNumber: mobile
    })
  },
  showImg: function (event) {
    var imgs = event.currentTarget.dataset.imgs;
    wx.previewImage({
      current: imgs[0],
      urls: imgs
    })
  },
  showPay: function () {
    var that = this;
    common.httpReq('/bill/ydj_customer?operationno=getcustomerpaypwd', {
      selectedRows: {
        pkValue: app.globalData.userId
      }
    }, function (res) {
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
  hidePay: function () {
    this.setData({
      pwdVal: '',
      showPay: false
    })
    this.initPage();
  },
  hidePayItem: function () {
    this.setData({
      pwdVal: '',
      showPayContent: true,
      showPayItem: false,
      showPayResult: false,
    })
  },
  hidePayResult: function () {
    this.setData({
      showPay: false,
      showPayContent: true,
      showPayItem: false,
      showPayResult: false,
    })
  },
  /**
   * 获取焦点
   */
  getFocus: function () {
    this.setData({
      payFocus: true
    });
  },
  goRecharge: function () {
    this.hidePayResult();
    wx.navigateTo({
      url: '/pages/my/recharge/recharge',
    })
  },
  /**
   * 输入密码监听
   */
  inputPwd: function (e) {
    this.setData({
      pwdVal: e.detail.value,
      payFocus: this.data.payType == 'account' ? true : false
    });
    if (e.detail.value.length >= 6) {
      this.paySubmit();
    }
  },
  selectPayType: function (e) {
    var type = e.currentTarget.dataset.type;
    this.setData({
      pwdVal: '',
      showPayContent: true,
      showPayItem: false,
      payType: type,
      payFocus: type == 'account' ? true : false
    });
  },
  showPayType: function (e) {
    this.setData({
      showPayResult: false,
      showPayContent: false,
      showPayItem: true,
      payFocus: this.data.payType == 'account' ? true : false
    });
  },
  paySubmit: function () {
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
    }, function (res) {
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
    }, "POST", function () {
      wx.hideLoading();
    });

  },
  accoutPay: function () {
    var that = this;
    common.httpReq('/bill/ydj_additionalfee?operationno=agreeadditionalfee', {
      simpleData: {
        appId: app.globalData.appId
      },
      selectedRows: {
        pkValue: that.data.id
      },
    }, function (res) {
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var fpay = res.data.operationResult.srvData.fpay;
        var famount = res.data.operationResult.srvData.famount;
        if (fpay == 0) {
          wx.hideLoading();
          payFlag = false;
          that.setData({
            showPayContent: false,
            showPayItem: false,
            showPayResult: true,
            payResult: true
          });
        } else {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '余额不足，还差' + famount + '元,是否使用微信支付？',
            success: function (res) {
              if (res.confirm) {
                that.wxpay();
              } else if (res.cancel) { 
                payFlag = false;
                that.setData({
                  pwdVal: '',
                  showPayContent: false,
                  showPayItem: false,
                  showPayResult: true,
                  payResult: false,
                  payRestltTxt: "余额不足，请用微信支付或充值！"
                });
              }
            }
          })
        }
      } else {
        wx.hideLoading();
        payFlag = false;
        that.setData({
          pwdVal: '',
          showPayContent: false,
          showPayItem: false,
          showPayResult: true,
          payResult: false,
          payRestltTxt: res.data.operationResult.simpleMessage
        });
      }
    }, "POST", function () {
      wx.hideLoading();
      payFlag = false;
    });
  },
  wxpay: function () {
    // if (payFlag) {
    //   return;
    // }
    // payFlag = true;
    wx.showLoading({
      title: '正在支付'
    })
    var that = this;
    common.httpReq('/bill/ydj_additionalfee?operationno=orderPayApplet', {
      simpleData: {
        fpaymethod: "WeChat",
        openid: app.globalData.openId,
        fid: that.data.id
      },
      selectedRows: {
        pkValue: that.data.id
      },
    }, function (res) {
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
              content: '附加费支付成功！',
              success: function () {
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
          title: res.data.operationResult.simpleMessage,
          icon: 'none'
        });
      }
    }, "POST", function () {
      wx.hideLoading();
      payFlag = false;
    });
  },
  showImg: function (event) {
    var imgs = event.currentTarget.dataset.imgs;
    wx.previewImage({
      current: imgs[0],
      urls: imgs
    })
  },
  toIndex: function () {
    wx.switchTab({
      url: '/pages/order/orderCenter/orderCenter'
    })
  },
  cancelOrder: function () {
    wx.navigateTo({
      url: '/pages/order/surchargeOrderBack/surchargeOrderBack?id=' + this.data.id,
    })
  }
})