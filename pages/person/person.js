
var localstorage = require("../../thirds/localStorage.js");
var localObj = new localstorage.LocalStorage();
var app = new getApp();
// pages/person/person.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userinfo:{
      usercode:"",
      encrypteData:"",
      iv:"",
      signature:"",
      nickName:"",
      gender:0,
      language:"",
      city:"",
      province:"",
      avatarUrl:""
    },
    userlist:[{title:"个人信息查看",icon:"",url:""},
      { title: "视频收藏", icon: "", url: "" },
      { title: "音乐收藏", icon: "", url: "" },
      { title: "个人喜好", icon: "", url: "" }
    ]
  },

  bindGetUserInfo: function (e) {
    var that =this;
    localObj.setValue("userinfo", e.detail.rawData);
    console.log(e.detail.rawData);
    that.setData({
      userinfo: localObj.getValue("userinfo")
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      usercode: localObj.getValue("code"),
      userinfo: localObj.getValue("userinfo")
    });
   // app.getOpenid(that.data.usercode);
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
    wx.setNavigationBarTitle({
      title: that.data.userinfo.nickName
    });
    if ("" == localObj.getValue("userinfo"))
    {
       app.getUserInfoAuth();
       that.setData({ userinfo:localObj.getValue("userinfo")});
    }
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