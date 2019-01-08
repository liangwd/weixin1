
var app = new getApp();

// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */

  data: {
    title: '首页',
    searchinfo:"",
    icpdata:{
       type:0,
       nature:"",
       icp:"",
       indexUrl:"",
       sitename :"",
       checkDate:""
    }
  },
  
  bindKeyInput:function(e){
    var that = this;
    that.data.searchinfo = e.detail.value;
   // console.log("输入框",e.detail.value);
  },

  //
  requestQQMuisc:function()
  {

  },

  //获取域名ICP备案
  requestDomainICP:function(e)
  {
    var that = this;
    if (that.data.searchinfo == '') return;
    var url = "https://www.sojson.com/api/beian/" + that.data.searchinfo;
    console.log("域名查询",that.data.searchinfo);
    wx.request({
      url:url,
      data:null,
      header:{
      "content-type": "application/x-www-form-urlencoded;charset=utf-8", // 默认值
        "Accept": "text/html;charset=UTF-8"//接受文档类型及编码
      },
      method:"GET",
      success:function(res){
        if(res.statusCode == 200)
        {
          that.setData({
            icpdata:res.data
          });
        }else
        {
          that.setData({
            icpdata:{type:1}
          });
        }  
        console.log(res.data);
      },
      fail:function(res)
      {
        that.setData({
          icpdata: { type: 1}
        });
        console.log(res);
      }
    })


  },


  bindGetUserInfo: function(e) {
    console.log(e.detail)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: that.data.title,
    });

   //app.getUseInfoAuth();
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