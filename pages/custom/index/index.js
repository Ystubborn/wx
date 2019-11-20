 
Page({ 
  data:{
    aminate:'animated bounce'
  },
  onLoad: function (options) {
    var that=this;
    setInterval(function () {
      if (that.data.aminate==''){
        that.setData({
          aminate:'animated bounce'
        })
      }else{
        that.setData({
          aminate: ''
        })
      }
    }, 500);
  },  
  goAddOrder: function () {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },   
  onShareAppMessage: function () { 
    return {
      title: "左右手",
      path: '/pages/custom/index/index'
    } 
  } 
})