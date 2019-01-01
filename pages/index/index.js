
var app = new getApp();

// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    province:"",
    city:"",
    bdAk:"QbZNQQHDRQ9SEZeyaZezgjCCX3je330O",
    results:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("Page index onLoad");
    //console.log(options);
    var self = this;
    this.ipUrl = "https://ip.ws.126.net/ipquery";
   
    wx.request({
      url: this.ipUrl,
      data: { },
      method:"GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data);
        var str = res.data.replace("city","\"city\"");
        str = str.replace("province", "\"province\"");
        var jsonStr = str.split("=")[3];
        var jsonObj = JSON.parse(jsonStr);
        console.log(jsonObj);
        self.setData({
          city: jsonObj.city,
          province:jsonObj.province
        })
        console.log(self.data.city);
       
        if (self.data.city) {
        
          var param = "location=" + self.data.city + "&output=json&ak=" + self.data.bdAk;
          var bdUrl = "https://api.map.baidu.com/telematics/v3/weather?" + param;
          console.log(bdUrl);
          wx.request({
            url: bdUrl,
            data: {},
            method:"GET",
            success(res) {
              console.log(typeof res.data);
              if(typeof(res.data) =='object')
              {
                self.setData({
                  results:res.data.results,
                })
              }
           

            },
            fail(res) {

            }
          })

        }

      }     
    })

 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})