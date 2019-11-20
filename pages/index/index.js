var app = getApp();
var common = require("../../common.js");
Page({ 
  data: {
    isReady: false,
    banner: null,
    advertise: null,
    sht_serstatus10: 0,
    sht_serstatus11: 0,
    sht_serstatus06: 0,
    sht_serstatus07: 0
  },
  onLoad: function () {
    var that = this;
    if (app.globalData.userId == '') {
      wx.showLoading({
        title: '微信登录中...',
        icon:'none'
      })
      wx.login({
        success(data) {
          wx.request({
            url: app.globalData.domain2 + '/api/User/GetWXUserOpenid',
            header: {
              'content-type': 'application/json',
              'accept': '	application/json;charset=utf-8',
              'X-AppId': app.globalData.appId
            },
            data: {
              code: data.code
            },
            success(res) {
              if (res.statusCode == 200 && res.data.errcode == '') {
                app.globalData.openId = res.data.openid;
                that.autoLoginByOpenid();
              } else { 
                wx.hideLoading(); 
                wx.showToast({
                  title: '服务器异常，请稍后再试！',
                  icon: 'none'
                })
              }
            },
            fail:function(){
              wx.showToast({
                title: '服务器异常，请稍后再试！',
                icon:'none'
              })
            }
          });
        },
        fail(err) {
          wx.showToast({
            title: '获取登录权限失败',
            icon: 'none'
          })
        }
      })
      return;
    }
    this.initPage();
  },
  initPage: function () {
    this.initPageData();
    this.setBanner();
    this.setTxtAds();
    wx.showShareMenu({
      withShareTicket: true
    })
    this.setData({
      isReady: true
    })
  },
  autoLoginByOpenid: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain2 + '/api/User/AutoLoginByOpenid',
      header: {
        'content-type': 'application/json',
        'accept': '	application/json;charset=utf-8',
        'X-AppId': app.globalData.appId
      },
      data: {
        openid: app.globalData.openId
      },
      success(res) {
        wx.hideLoading();
        if (res.statusCode == 200 && res.data != null) {
          app.globalData.userId = JSON.parse(res.data.meta.merchantData).id;
          app.globalData.token = res.data.meta.usertoken;
          app.globalData.userName = res.data.userName;
          app.globalData.companyCount = JSON.parse(res.data.meta.companys).length;
          app.globalData.cookie = 'ss-opt=temp; ' + res.data.meta.usertoken + '=' + res.data.sessionId;
          that.initPage();
        } else {
          wx.reLaunch({
            url: '/pages/custom/login/login'
          });
        }
      }
    });
  },
  initPageData: function () {
    if (!app.globalData.userId) {
      return;
    }
    var that = this;
    common.httpReq('/bill/ydj_merchantorder?operationNo=getMorderStatistics', {
      simpleData: {
        merchantId: app.globalData.userId,
        appId: app.globalData.appId
      }
    }, function (res) {
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var arrayList = res.data.operationResult.srvData;
        var sht_serstatus10 = 0,
          sht_serstatus11 = 0,
          sht_serstatus06 = 0,
          sht_serstatus07 = 0;
        for (var item of arrayList) {
          if (item.fname == 'sht_serstatus10') {
            sht_serstatus10 = item.fcount;
          } else if (item.fname == 'sht_serstatus11') {
            sht_serstatus11 = item.fcount;
          } else if (item.fname == 'sht_serstatus06') {
            sht_serstatus06 = item.fcount;
          } else if (item.fname == 'sht_serstatus07') {
            sht_serstatus07 = item.fcount;
          }
        }
        that.setData({
          sht_serstatus10: sht_serstatus10,
          sht_serstatus11: sht_serstatus11,
          sht_serstatus06: sht_serstatus06,
          sht_serstatus07: sht_serstatus07
        });
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    });
  },
  /*
   * 首页banner
   */
  setBanner: function () {
    let that = this;
    common.httpReq('/list/news_carousel?operationNo=GetCarouselList&appId=' + app.globalData.appId, { 
    }, function (res) {
      if (res.statusCode == 200 && res.data.operationResult.isSuccess) {
        var datas = res.data.operationResult.srvData.datas;
        var banner = [];
        for (var item of datas) {
          banner.push({
            image: item.fimage,
            target: item.fhrefurl,
            id: item.fid,
            title: item.ftitle,
            isUrl: common.trim(item.fhrefurl).length > 0
          });
        }
        that.setData({
          banner: banner
        });
      } else {
        wx.showToast({
          title: res.data.responseStatus.message,
          icon: 'none'
        })
      }
    },"GET");

  },
  setTxtAds: function () {
    let that = this;
    that.setData({
      advertise: {
        image: '../../images/index/activty.png'
      }
    });
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '左右手',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  goOrderList: function (event) {
    var status = event.currentTarget.dataset.status;
    wx.navigateTo({
      url: '/pages/order/orderList/orderList?status=' + status,
    })
  }

});