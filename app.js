var localstorage = require("thirds/localStorage.js");
var localObj = new localstorage.LocalStorage();
localObj.clear();
App({

  globalData:{
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