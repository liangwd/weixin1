var localstorage = require("../../thirds/localStorage.js");
var app = new getApp();
var localObj = new localstorage.LocalStorage();
// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */

  data: {
    title: '丫丫',
    songs:[]
  },
  
  playMusic:function(e){
    console.log("playMusic",e);
    app.setSongsFromStart();
    app.skipPlayerPage(e.target.id);
  },

 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;


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
    var that = this;
    that.setData({
      songs: app.getStartSongs()
    });
    var userinfo = localObj.getValue("userinfo");
    wx.setNavigationBarTitle({
      title: userinfo.nickName  
    })
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