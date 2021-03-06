var app = new getApp();

  Page({
    data:{
      title: '娱乐',
      inputvalue:"",
      songs:[],
      songcount: 0,
      songindex:0,//音乐下标
      pagenum:0,//当前页数
      pagecount:0,//总页数
      numOfpage:5
    },
    
    onLoad:function(e){
      console.log("Music onLoad");
    },
  
    onShow: function (e) {
      console.log("Music onShow");
      wx.setNavigationBarTitle({
        title: this.data.title
      })
    },

   onReady:function(e) {
     console.log("Music onShow"); 
   },

    //输入框输入查询
    bindKeyInput:function(e){
      var that = this;
      that.data.source = e.detail.value;
    },


   getMusicInfo:function(e){
	//  * 网易云音乐歌曲信息API
  //      * @param context
  //        * @param id 歌曲id
  //          * @param ids 用[]包裹起来的歌曲id 写法 % 5B % 5D
     var id = e.currentTarget.dataset.name;
     var url ="https://s.music.163.com/api/song/detail//?id="+id;
    // var url = "https://music.163.com/api/song/detail/?id=" +id +"&ids=%5B["+id+"]%5D";
     console.log("getMusicInfo",url);
     wx.request({
        url: url,
        data:null,
        method:"GET",
        header:{
          "Content-Type": "application/json;charset=UTF-8",
           "Accept":"text/html;charset=UTF-8"
        },
        success:function(res){
          console.log("getMusicInfo ok.",res);
        },
        fail:function(res){
          console.log("getMusicInfo fail.", res);
        }
     })
   },

    //搜索
    searchMuisc:function(e){
      var that = this;
      /**
       * s: 搜索词
          limit: 返回数量
          sub: 意义不明(非必须参数)；取值：false
          type: 搜索类型；取值意义
          1 单曲
          10 专辑
          100 歌手
          1000 歌单
          1002 用户
       * http://s.music.163.com/search/get/?type=1&limit=5&s=
       * 
       * 
       * http 406 请求头部参数不对
       * 
      */
      if(that.data.source == "") return;
      var url = "https://s.music.163.com/search/get/?type=1&limit=100&s="+that.data.source;
      console.log("request",url,e.target.dataset);
      wx.request({
        url: url,
        data:null,
        method:"GET",
        header:{
          "Content-Type": "application/json;charset=UTF-8"
          // "Accept":"text/html;charset=UTF-8"
        },
        success:function(res){
          if(res.statusCode == 200)
          {
            console.log(res.data);
            if(typeof (res.data.result) == undefined)
            {
              var tmp =[];
              var songs =[];
              tmp = res.data.songs;
              
              for (var i = 0; i < tmp.length;i++){
                var song ={
                  id: tmp[i].id,
                  picUrl: tmp.album.picUrl,
                  music: tmp[i].name,
                  album: tmp[i].album.name,
                  name: tmp[i].artists[0].name,
                  start: 0
                };
                songs.push(song);
              }
              app.globalData.index = 0;
              app.globalData.songs = songs;
              console.log("歌曲列表", app.globalData.songs);

              var count = songs.length;
              var pages = count / 5 + 0.4;
              that.setData({
                songs: songs,
                songcount: count,
                songindex: 0,//音乐下标
                pagenum: 1,//当前页数
                pagecount: pages.toFixed()//四舍五入
              });

            }else if(res.data.code == 200){

              var tmp = [];
              var songs = [];
              tmp = res.data.result.songs;
              for (var i = 0; i < tmp.length; i++) {
                var song = {
                  id: tmp[i].id,
                  picUrl: tmp[i].album.picUrl,
                  music: tmp[i].name,
                  album: tmp[i].album.name,
                  name: tmp[i].artists[0].name,
                  start:0
                };
                songs.push(song);
              }
              app.globalData.index = 0;
              app.globalData.songs = songs;
              console.log("歌曲列表", app.globalData.songs);

              var count = songs.length;
              var pages = count / 5 + 0.4;
              that.setData({
                songs: songs,
                songcount: count,
                songindex: 0,//音乐下标
                pagenum: 1,//当前页数
                pagecount: pages.toFixed()//四舍五入
              });

            }else if(res.data.code == 400){
                 console.log("未查询到",that.data.source);
            }
          }
        },
        fail:function(res){
          console.log("查询失败",res);
          that.setData({
            musiclist: [],
            songcount: 0,
            songindex: 0,//音乐下标
            pagenum: 0,//当前页数
            pagecount: 0//四舍五入
           });
          app.globalData.songs = [];
        }
      })
    },    

  nextPage:function()
  {
    var that = this;
    var nextpage = that.data.pagenum+1;
    if(nextpage <= that.data.pagecount)
    {
      that.setData({
        pagenum: nextpage
      });
    }
  },

  prevPage:function()
  {
      var that = this;
      var prevpage = that.data.pagenum -1;
      if (prevpage >= 1) {
        that.setData({
          pagenum: prevpage
        });
      }
  },

  audioPlay(e) {
    var index = e.currentTarget.dataset.index;
    app.skipPlayerPage(index);
  },

  audioPause() {
    this.innerAudioContext.pause()
  },
  audio14() {
    this.innerAudioContext.seek(14)
  },
  audioStart() {
    this.innerAudioContext.seek(0)
  }
})