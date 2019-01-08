var bmap = require('../../thirds/bmap-wx/bmap-wx.min.js');

  Page({
  
    data:{
      title: '音乐',
      innerAudioContext:{},
      source:"",
      musiclist:[],
      currentlist:[],
      songcount:0,
      pagenum:0,
      pagecount:5,
      pagetotal:0
    },
    
    onLoad:function(e){
      
    },
  
    onShow: function (e) {
      console.log("onShow");
    },

   onReady:function(e) {
      // 使用 wx.createInnerAudioContext 获取 audio 上下文 context
      this.innerAudioContext = wx.createInnerAudioContext();
      this.innerAudioContext.audioPlay = false;
      //this.innerAudioContext.autoplay = true；
  },

    //
    bindKeyInput:function(e){
      var that = this;
      //console.log("bindKeyInput", e.detail.value);
      that.data.source = e.detail.value;
      // if (e.detail.value == "")
      // {
      //   that.setData({
      //     musiclist:[]
      //   });
      // }
    },


   getMusicInfo:function(e){
	//  * 网易云音乐歌曲信息API
  //      * @param context
  //        * @param id 歌曲id
  //          * @param ids 用[]包裹起来的歌曲id 写法 % 5B % 5D
     var id = e.currentTarget.dataset.name;
     var url ="https://s.music.163.com/discover/playlist/?id="+id;
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
                 var arr = res.data.songs.slice(0,that.data.pagecount);
                 var a = (res.data.songs.length) % (that.data.pagecount);
                 var b = (res.data.songs.length) / (that.data.pagecount);
                 var total = (a > 0 ? (b.toFixed() + 1 ): b.toFixed());
                  that.setData({
                  musiclist: res.data.songs,
                  currentlist:arr,
                  pagenum:1,
                  pagetotal: total});
            }else{
                var arr = res.data.result.songs.slice(0, that.data.pagecount);
               var a = (res.data.result.songs.length) % (that.data.pagecount);
                var b = (res.data.result.songs.length) / (that.data.pagecount);
                var total = (a > 0 ? (b.toFixed() + 1) : b.toFixed());
                that.setData({
                 musiclist: res.data.result.songs,
                currentlist: arr,
                pagenum: 1,
                pagetotal: total});
            }
          }
        },
        fail:function(res){
          console.log(res.data);
          that.setData({
            musiclist: [],
            currentlist: [],
            pagenum: 0,
            pagetotal: 0});
        }
      })
    },    

  nextPage:function()
  {
    var that = this;
    var nextpage = that.data.pagenum;
    if (nextpage  * that.data.pagecount <= that.data.musiclist.length)
    {
        var begin = nextpage * that.data.pagecount;
        var end = (nextpage +1)* that.data.pagecount;
        that.setData({
        currentlist: that.data.musiclist.slice(begin, end),
        pagenum:nextpage+1
      });
    }
  },

  prevPage:function()
  {
    var that = this;
    var nextpage = that.data.pagenum - 1;
    if (nextpage>1) {
      var begin = (nextpage)* that.data.pagecount;
      var end = (nextpage +1) * that.data.pagecount;
      that.setData({
        currentlist: that.data.musiclist.slice(begin, end),
        pagenum: nextpage
      })
    } 
    else if (nextpage == 1)
    {
      that.setData({
        currentlist: that.data.musiclist.slice(0, that.data.pagecount),
        pagenum: nextpage
      })
    }
  },

  audioPlay(e) {
    var url = 'http://music.163.com/song/media/outer/url?id=' + e.currentTarget.dataset.name;
    console.log(url);
    this.innerAudioContext.src= url;
    this.innerAudioContext.src = url;
    this.innerAudioContext.play();
    this.innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    this.innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
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