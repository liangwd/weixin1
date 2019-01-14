var localstorage = require("thirds/localStorage.js");
var localObj = new localstorage.LocalStorage();
// localObj.clear();
App({

  globalData:{
     songs:[],
     index:0,
     AppId:"wxda2abee5df9507eb",
     AppSecret:"58613d84e1380e58f258458059450a92",
    },

    onLaunch:function(res)
    {
      console.log(res);

      //检查版本升级
      this.checkUpgrade();

      //用户登录获取 code
      this.wxLogin();

      //获取用户授权
      this.getUserInfoAuth();

      //
      //this.initDemoData1();

      console.log("本地缓存收藏数据", localObj.getValue("start")); 
      console.log("本地缓存数据", localObj.getKeys());
    },

    onShow:function(){
      console.log("App onShow");
    },



  initDemoData: function () {
    var psx = 10;
    var psy = 80;
 
    for(var i=0; i<3;i++){
     var song = {
        id: 486194111,
        album: "最美",
        picUrl: "../../images/2.jpg",
        name: "美",
        music: "最美",
        start: 1,
        x: psx,
        y: psy
      }
      psx += 25;
      psy += 80;
     this.globalData.songs.push(song);
    }
    psx = 300;
    psy = 0;
    for (var i = 0; i < 3; i++) {
      psx -= 25;
      psy += 80;
      var song = {
        id: 486194111,
        album: "最美",
        picUrl: "../../images/2.jpg",
        name: "美",
        music: "最美",
        start: 1,
        x: psx,
        y: psy
      }
      this.globalData.songs.push(song);
    }
    psx = 140;
    psy = 320;
    var song = {
      id: 486194111,
      album: "最美",
      picUrl: "../../images/2.jpg",
      name: "美",
      music: "最美",
      start: 1,
      x: psx,
      y: psy
    }
    this.globalData.songs.push(song);

    psx = 140;
    psy = 120;
    var song = {
      id: 486194111,
      album: "丫丫最美",
      picUrl: "../../images/zuimei.jpg",
      name: "美",
      music: "丫丫最美",
      start: 1,
      x: psx,
      y: psy
    }
    this.globalData.songs.push(song);
    localObj.setValue("start", this.globalData.songs); 
  },

  initDemoData1: function () {
    var userinfo = localObj.getValue("userinfo");
    var avatarUrl = userinfo.avatarUrl;
    var nickName = userinfo.nickName;
    var psx = 10;
    var psy = 80;

    for (var i = 0; i < 3; i++) {

      var song = {
        id: 486194111,
        album: "最美",
        picUrl: "../../images/2.jpg",
        name: "美",
        music: "最美",
        start: 1,
        x: psx,
        y: psy
      }
      psx += 25;
      psy += 80;
      this.globalData.songs.push(song);
    }
    psx = 270;
    psy = 0;
    for (var i = 0; i < 3; i++) {
      psx -= 25;
      psy += 80;
      var song = {
        id: 486194111,
        album: "最美",
        picUrl: "../../images/2.jpg",
        name: "美",
        music: "最美",
        start: 1,
        x: psx,
        y: psy
      }
      this.globalData.songs.push(song);
    }

    psx = 125;
    psy = 320;
    var song = {
      id: 486194111,
      album: "最美",
      picUrl: "../../images/2.jpg",
      name: "美",
      music: "最美",
      start: 1,
      x: psx,
      y: psy
    }
    this.globalData.songs.push(song);
    if (avatarUrl == undefined || avatarUrl == ""){
      avatarUrl = "../../images/2.jpg"
    }
    psx = 125;
    psy = 120;
    var song = {
      id: 486194111,
      album: "最美",
      picUrl: avatarUrl,
      name: nickName,
      music: nickName+"最美",
      start: 1,
      x: psx,
      y: psy
    }
    this.globalData.songs.push(song);

    localObj.setValue("start", this.globalData.songs); 
  },

/*
      id: 444523720,
      album: 
      picUrl: avatarUrl,
      music:
      artists: 
      name: 
*/
  getStartSongs:function(){
   return localObj.getValue("start");
  },

  setStartSongs:function(song){
     if(typeof(song)!="object"|| song.id == undefined || song.id == "") return false;
     var songs = [];
     var val =localObj.getValue("start");
     if(val != "") songs = val;
     songs.push(song);
     return localObj.setValue("start", songs); 
  },

  removeStartSongs:function(song){
    var songs = [];
    songs = localObj.getValue("start");
    for(var i =0;i<songs.length;i++){
      if(songs[i].id == song.id){
        songs.splice(i,1);
        break;
      }
    }
   return localObj.setValue("start", songs); 
  },

  setSongsFromStart:function(){
    this.globalData.songs = localObj.getValue("start");
  },

  //跳到播放页面
  skipPlayerPage:function(param){
    console.log("skipPlayerPage song index:",param);
    if(param == undefined){
      wx.navigateTo({
        url: '/pages/player/player'
      });
    }else{
      this.globalData.index = param;
      wx.navigateTo({
        url: '/pages/player/player?index='+ param
      });
    }
 
  },

  //调到查询页面
  skipSearchPage: function() {
    console.log("skipSearchPage");
    wx.switchTab({
      url: '../search/search'
    });
  },
 
  //调到首页
  skipHomePage: function () {
    console.log("skipHomePage");
    wx.switchTab({
      url: '../home/home'
    });
  },


  getOpenid:function(loginCode)
  {
    var that = this;
    var url = "https://api.weixin.qq.com/sns/jscode2session?appid="
      + that.globalData.AppId + "&secret="
      + that.globalData.AppSecret + "&js_code=" + loginCode + "&grant_type=authorization_code";
    console.log(url);
    wx.request({
      url: url,
      data: null,
      method: 'GET',
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      }
    });

  },

  wxLogin:function()
  {
    var that = this;
    wx.login({
      success(res) {
        
        if (res.code) {
          console.log(res);
          localObj.setValue("code",res.code);
         // that.getOpenid(res.code);
          // 发起网络请求
          //获取session_key  
          /*
          *
          *GET https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
          */
          // var url = "https://api.weixin.qq.com/sns/jscode2session?appid="
          //   + that.globalData.AppId + "&secret="
          //   + that.globalData.AppSecret +"&js_code="+that.globalData.code+"&grant_type=authorization_code";
          // console.log(url);
          // wx.request({
          //   url: url,
          //   data:null,
          //   method:'GET',
          //   success:function(res)
          //   {
          //     console.log(res);
          //   },
          //   fail:function(res)
          //   {
          //     console.log(res);
          //   }
          // });
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  //获取用户信息授权
  getUserInfoAuth:function()
  {
     var that = this;
     wx.getSetting({
      success(res)
      {
        console.log("getSetting ok!",res);
        if (res.authSetting['scope.userInfo'] != undefined && !res.authSetting['scope.userInfo'])
        {
          console.log("用户信息之前拒绝授权");
          wx.showModal({
            title: '是否授权当前用户信息',
            content: '需要展示你的信息，请确认授权，否则无法显示你的信息',
            success: function(res){
              if(res.confirm){
                console.log("确定用户信息授权操作");
                wx.openSetting({
                  sucess:function(data){
                    console.log("openSetting ok!", data);
                  },
                  fail:function(data){
                    console.log("openSetting fail!", data);
                  }
                });

                if (wx.canIUse("getUserInfo")) {
                  wx.getUserInfo({
                    success(res) {
                      console.log("getUserInfo ok!", res);
                      localObj.setValue("userinfo", res.userInfo);
                    },
                    fail(res) {
                      console.log("getUserInfo fail!",res);
                      localObj.remove("userinfo");
                    }
                  });
                }
              }else if(res.cancel){
                console.log("取消用户信息授权操作");
                localObj.remove("userinfo");
              }
            }
          });
        } 
        else if (res.authSetting['scope.userInfo'] == undefined)
        {//用户之前未授权,未弹出窗口
          console.log("用户之前未授权");
          if (wx.canIUse("getUserInfo")) {
            wx.getUserInfo({
              success(res) {
                console.log("getUserInfo", res);
                localObj.setValue("userinfo", res.userInfo);
              },
              fail(res) {
                console.log(res);
              }
            });
          }
        }
        else
        {
          console.log("当前用户已授权");
          if (wx.canIUse("getUserInfo")) {
            wx.getUserInfo({
              success(res) {
                console.log("getUserInfo", res);
                localObj.setValue("userinfo", res.userInfo);
              },
              fail(res) {
                console.log(res);
              }
            });
          }
        }
      }
    });
  },

  //是否授权微信运动步数
  getWeRunfoAuth:function(){
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.werun']) {
          wx.authorize({
            scope: 'scope.werun',
            success(res) {
              
            }
          });
        }else{

        }
      }
    });
  },

  //获取用户通信地址
  getAdressInfoAuth: function () {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.address']) {
          wx.authorize({
            scope: 'scope.address',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
            }
          });
        }else{

        }
      }
    });
  },



  //获取用户位置信息授权
    getLocationAuth:function(){
      wx.getSetting({
        success:function(res)
        {
          console.log(res);
           //之前拒绝过授权再次授权需要调用 需要调openSetting 、authorize
          if (res.authSetting['scope.userLocation'] != undefined && !res.authSetting['scope.userLocation'])
          {
            localObj.setValue("userlocation", 2);
            console.log("当前位置之前拒绝授权，再次授权");
            wx.showModal({
                  title: '是否授权当前位置',
                  content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                  success:function(res){
                      if(res.cancel){
                        console.log("取消当前位置授权操作");
                      }else if(res.confirm){
                        console.log("确定当前位置授权操作")
                       wx.openSetting({
                        //sucess:function(data){
                        // console.log("openSetting",data);
                        // if (data.authSetting["scope.userLocation"] == true) {
                        //  wx.showToast({
                        //     title: '授权成功',
                        //     icon: 'success',
                        //     duration: 5000});
                        //     localObj.setValue("userlocation",1);
                        // }else {
                        //  wx.showToast({
                        //  title: '授权失败',
                        //  icon: 'success',
                        //  duration: 5000});
                        // }}
                        });
                        localObj.setValue("userlocation", 2);
                      }
                  }
                 });
                }else if(res.authSetting['scope.userLocation'] == undefined){
                    console.log("当前位置之前未授权");
                    localObj.setValue("userlocation",0);
                }else{
                    console.log("当前位置已授权");
                    localObj.setValue("userlocation", 1);
                }
              }
            });
        },

//微信小程序检查升级
  checkUpgrade: function () {
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log(res)
      });

      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            }
          }
        })
      });

      updateManager.onUpdateFailed(function () {
        // 新版本下载失败
        wx.showModal({
          title: '更新提示',
          content: '新版本更新失败!',
          showCancel: false,
          success: function (res) {
            // if (res.confirm) {
            //   // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            //   updateManager.applyUpdate()
            // }
          }
        })
      }
      );
    }
  }

})