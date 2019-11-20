Page({
  data: {
    val: 20
  },
  selectMoney: function(event) {
    var val = event.currentTarget.dataset.val;
    this.setData({
      val: val
    });
  },
  fillMoney: function(event) {
    var val = event.detail.value;
    this.setData({
      val: val
    });
  },
  goAddOrder:function(){
    wx.showToast({
      title: '正在完善中..',
      icon: 'none'
    })
  }
})