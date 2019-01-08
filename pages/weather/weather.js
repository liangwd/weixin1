
var app = new getApp();

// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"天气预报",
    province:"",
    city:"",
    bdAk:"QbZNQQHDRQ9SEZeyaZezgjCCX3je330O",
    results:[],
    location:{},
    ipApi:"https://ip.ws.126.net/ipquery",
    weatherApi:"https://api.map.baidu.com/telematics/v3/weather?"
  },

  //获取地理位置
  getPosition:function()
  {
    var that = this;
    if (that.data.city !='') return;
    //获取地理位置
      wx.request({
      url: that.data.ipApi,
      data: {},
      method: "GET",
      header: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8", // 默认值
        "Accept": "text/html;charset=utf-8"//接受文档类型及编码
      },
      success(res) {
        console.log(res.data);
       //get city by ip
        var jsonStr = res.data.replace("city", "\"city\"");
        jsonStr = jsonStr.replace("province", "\"province\"");
        jsonStr = jsonStr.split("=")[3];
        var jsonObj = JSON.parse(jsonStr);
        //set city
        that.setData({
          city: jsonObj.city,
          province: jsonObj.province
        })
        that.getWeather();
      }});
  },

  //获取天气
  getWeather:function()
  {
    var that = this;
    if(that.data.city == '') return;
    
    var bdUrl = "location=" + that.data.city + "&output=json&ak=" + that.data.bdAk;
    bdUrl = that.data.weatherApi + bdUrl;

    wx.request({
      url: bdUrl,
      data: {},
      header: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8", // 默认值
        "Accept": "text/html;charset=utf-8"//接受文档类型及编码
      },
      method: "GET",
      success(res) {
        console.log(res.data);
        if (typeof (res.data) == 'object') {
          that.setData({
            results: res.data.results,
            weather_data: res.data.results[0].weather_data
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad监听页面加载");
      var that = this;

      wx.setNavigationBarTitle({
        title: that.data.title,
      });


    //that.getPosition();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady监听页面初次渲染完成");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow监听页面显示");
    var that = this;
    that.getPosition();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("onHide监听页面隐藏");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("onUnload监听页面卸载");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh页面相关事件处理函数--监听用户下拉动作");
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom页面上拉触底事件的处理函数");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log("onShareAppMessage用户点击右上角分享");
  }
})