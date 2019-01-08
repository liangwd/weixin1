// 引用百度地图微信小程序JSAPI模块 
var bmap = require('../../thirds/bmap-wx/bmap-wx.min.js');
var localstorage = require("../../thirds/localStorage.js");
var localObj = new localstorage.LocalStorage();

var wxMarkerData = [];
var bMapHandle = null;
var initState = false;
var app = new getApp();
// pages/map/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'地图',
    markers: [],
    latitude: '',
    longitude: '',
    province:'',
    city:'',
    placeData: {},
    list:[],
    inputPlace:"",//输入框键盘输入值
    buttonPlace:""//下拉框点击的place
  }, 

  //点击标记获取数据
  showSearchInfo: function (data, i) {
    var that = this;
    that.setData({
      rgcData: {
        title: data[i].title,
        address: data[i].address,
        desc: data[i].desc,
        business: data[i].business,
        telephone: data[i].telephone
      }
    });
  },

  //点击标记修改颜色
  changeMarkerColor: function (data, i) {
    var that = this;
    var markers = [];
    for (var j = 0; j < data.length; j++) {
      if (j == i) {
        // 此处需要在相应路径放置图片文件 
        data[j].iconPath = "../../images/marker_yellow.png";
      } else {
        // 此处需要在相应路径放置图片文件 
        data[j].iconPath = "../../images/marker_red.png";
      }
      markers[j] = data[j];
    }
    that.setData({
      markers: markers
    });
  },


  //点击地图标记显示
  makertap: function (e) {
    var that = this;
    var id = e.markerId;
    that.showSearchInfo(wxMarkerData, id);
    that.changeMarkerColor(wxMarkerData, id);
  }, 

  //周边搜索地点
  searchPlace:function(e)
  {
    var that = this;
    var id = e.target.id;
    var place = '';
    if(id == 'view')
    {
      place = that.data.inputPlace;
      //清除查询列表
      that.setData({
        list: []
      });
      console.log(id,place);
    }
    else if(id == 'button')
    {
      place = e.target.dataset.name;
      console.log(id,place);
      //清除查询列表 修改input值
      that.setData({
        list: [],
        inputPlace: place
      });
    }
    else
    {
      return;
    }
  


    // 新建百度地图对象 
    if (bMapHandle == null) {
      bMapHandle = new bmap.BMapWX({
        ak: "QbZNQQHDRQ9SEZeyaZezgjCCX3je330O",
      });
    }

    bMapHandle.search({
      "query": place,
      fail: function (data) {
        console.log(data);
      },
      success: function (data) {
        wxMarkerData = data.wxMarkerData;
        that.setData({
          markers: wxMarkerData
        });
        that.setData({
          latitude: wxMarkerData[0].latitude
        });
        that.setData({
          longitude: wxMarkerData[0].longitude
        });
      },
      // 此处需要在相应路径放置图片文件 
      iconPath: "../../images/marker_red.png",
      // 此处需要在相应路径放置图片文件 
      iconTapPath: '../../images/marker_yellow.png'
    });
  },

 
  //百度地图地理位置检索
  bindKeyInput: function (e) {
    var that = this;
    if (e.detail.value == '') {
       that.setData({
         list:[]
       })
       return;
    }
    that.data.inputPlace = e.detail.value;
    // 新建百度地图对象 
    if (bMapHandle == null) {
      bMapHandle = new bmap.BMapWX({
        ak: "QbZNQQHDRQ9SEZeyaZezgjCCX3je330O",
      });
    }

    if (bMapHandle) bMapHandle.suggestion({
      query: e.detail.value,
      region: that.data.city,
      city_limit: true,
      fail : function (data) {
        console.log(data)
      },
      success : function (data) {
        console.log(data);
        var list=[];
        for (var i = 0; i < data.result.length; i++) {
          list[i] =data.result[i].name;
        }
        console.log(list);
        that.setData({
          list: list
        });
      }
    });
  },

  //初始化小地图
  initMap:function()
  {
    console.log("initMap初始化小地图");
    var location = localObj.getValue("userlocation");
    
    if (location == "" || location== 2)  app.getLocationAuth();
    var that = this;
   // 新建百度地图对象 
    if (bMapHandle == null) bMapHandle = new bmap.BMapWX({
      ak: "QbZNQQHDRQ9SEZeyaZezgjCCX3je330O",
    });

  //初始化地图数据
    bMapHandle.regeocoding({
      fail: function (data) {
        console.log(data);
        initState = false;
      },
      success: function (data) {
        initState = true;
        console.log(data);
        wxMarkerData = data.wxMarkerData;
        that.setData({
          province: data.originalData.result.addressComponent.province,
          city: data.originalData.result.addressComponent.city,
          markers: wxMarkerData,
          latitude: wxMarkerData[0].latitude,
          longitude: wxMarkerData[0].longitude
        });
      },
      iconPath: '../../images/marker_red.png',
      iconTapPath: '../../images/marker_red.png'
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
    initState = false;
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
   if(!initState) that.initMap();
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