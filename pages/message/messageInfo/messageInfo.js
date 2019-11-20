 Page({
   //页面数据
   data: {
     items:[],
     pageIndex: 1,
     pageCount: 10,
     allPage: 0,
     nomoredata: false,
     nodata: true
   },
   onLoad: function(params) {
     var type = params.type;
     if (type == 'order') {
       wx.setNavigationBarTitle({
         title: '订单消息',
       })
     } else if (type == 'money') {
       wx.setNavigationBarTitle({
         title: '钱包消息',
       })
     }
   }
 })