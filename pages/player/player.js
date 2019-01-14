
var app = new getApp();
const innerAudioContext = wx.createInnerAudioContext();
const animation = wx.createAnimation();
innerAudioContext.autoplay = false;
innerAudioContext.loop = false;
var picturenum = 6;

var page =Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationData:[],
    angle :0,
    timer:null,
    isplay:false,
    start:0,
    index:0,
    id:0,
    picUrl:"",
    music:"",
    album:"",
    name:"",
    progress:0,
    bgimage:"../../images/0.jpg",
    bgnum:0,
    bgchangtimer:null
    },

  //
  skippage:function(){
    app.skipSearchPage();
  },


  //设置背景图片
  changeBgImage:function(){
 
    if (this.data.bgnum > picturenum)
    {
      this.data.bgnum = 0;
    }
    var bgurl = "../../images/" + this.data.bgnum+".jpg";
    this.data.bgnum++;
    //console.log("背景图片",bgurl);
    this.setData({
      bgimage:bgurl
    })
  },

  //设置背景图片
  changeRandomBg: function () {
    var index = (Math.random() * 10) % picturenum;
    var bgurl = "../../images/" + index.toFixed() + ".jpg";
    //console.log("随机背景图片", bgurl);
    this.setData({
      bgimage: bgurl
    })
  },

  //自动切换背景图片
  autoChangeBg:function(){
    var that = this;
    that.data.bgchangtimer = setInterval(
      function () {
        that.changeBgImage();
      }, 7000);
  },

  //清除切换背景图片定时器
  clearAutoBg:function(){
    clearInterval(this.data.bgchangtimer);
  },

  //收藏
  bindstart: function () {
    this.setData({ start: !this.data.start });
    if (this.data.start){
      var psx = Math.random()*500;
      var psy = Math.random() * 1000;
     var song={
       id: this.data.id,
       picUrl: this.data.picUrl,
       music: this.data.music,
       album: this.data.album,
       name: this.data.name,
       start:1,
       x: psx,
       y: psy};
      if(app.setStartSongs(song)){
        console.log("收藏成功", song);
      }else{
        console.log("收藏失败", song);
      }
    }else{
      var song = {
        id: this.data.id,
        picUrl: this.data.idpicUrl,
        music: this.data.music,
        album: this.data.album,
        name: this.data.name,
        start: 0
      };

      if (app.removeStartSongs(song)) {
        console.log("取消收藏成功", song);
      } else {
        console.log("取消收藏失败", song);
      }
    }
   
  },

  //动画
  rotate:function(angle){
    var that = this;    
    animation.rotate(angle).step();
    that.setData({
      animationData: tanimation.export()
    });
  },

  //动画播放
  animationPlay:function()
  {
    var that = this;
    that.setData({ isplay:true });
    that.initSongData();

    if (that.data.timer!=null)
    clearInterval(that.data.timer);
    
    that.data.timer = setInterval(
      function () {
        animation.rotate(that.data.angle*5).step({duration:200});
        that.setData({
             animationData:animation.export()
        });
        that.data.angle++;
      }, 200);
  },

  //动画停止播放
  animationStop:function(){
    var that = this;
    that.setData({ isplay: false });
    clearInterval(that.data.timer);
    animation.step({duration:0})
    that.setData({ animationData: animation.export()});
  },

  //初始化音乐信息
  initSongData: function () {
    var item = app.globalData.songs[this.data.index];
    console.log("初始化音乐信息", this.data.index, item);
    this.setData({
      id: item.id,
      picUrl: item.picUrl,
      music: item.music,
      album: item.album,
      name: item.name,
      start: item.start
    });
  },


  //开发播放音乐按钮
  start: function () {
    if (!this.data.isplay) {   
      this.audioPlay();
    } else {
      this.audioPause();
    }
  },

  audioPause:function() {
    this.animationStop();
    innerAudioContext.pause();
  },
  
  audioPlay: function () {
    var that = this;
    that.animationPlay();

    var url = 'http://music.163.com/song/media/outer/url?id=' + that.data.id;
    console.log("audioInit url", url);
    innerAudioContext.src = url;
    innerAudioContext.pause();
    innerAudioContext.play();
  
    innerAudioContext.onPlay(function (res) {
      console.log('开始播放')
    });
    innerAudioContext.onPause(function (res) {
      console.log('开始暂停')
    });
    innerAudioContext.onError(function (res) {
      console.log("监听音频播放错误事件", res.errMsg)
      console.log("监听音频播放错误事件", res.errCode)
    });
    innerAudioContext.onEnded(function (res) {
      console.log("onEnded监听音频自然播放至结束的事件", res);
      that.animationStop();
     // that.bindnext();
    });
    innerAudioContext.onSeeking(function (res) {
      console.log("onSeeking监听音频进行跳转操作的事件", res);
      that.animationStop();
    });
    innerAudioContext.onSeeked(function (res) {
      console.log("onSeeked监听音频完成跳转操作的事件", res);
    });
    innerAudioContext.onTimeUpdate(function (res) {
      var progress = (innerAudioContext.currentTime * 100) / innerAudioContext.duration;
      that.setData({
        progress: progress
      });

    });   
  },

  //上一首
  bindprev:function() {
    clearInterval(this.data.timer);
    this.data.index--;
    if(this.data.index < 0)
    {
      this.data.index = app.globalData.songs.length-1;
    }
    app.globalData.index = this.data.index;
    this.changeBgImage();
    this.audioPlay();
  },

  //下一首
  bindnext:function(){
    clearInterval(this.data.timer);
    this.data.index++;
    if (this.data.index == app.globalData.songs.length) {
      this.data.index = 0;
    }
    app.globalData.index = this.data.index;
    this.changeBgImage();
    this.audioPlay();
  },

  /**
    * 生命周期函数--监听页面加载
    */
  onLoad: function (options) {
 
    console.log("player onLoad index",options.index);
    if (options.index == undefined || options.index < 0)
    {      
      this.setData({
        isplay: false,
        index: app.globalData.index
      })
      this.audioPlay();
      this.autoChangeBg();
    }else{
      this.setData({
        isplay: false,
        progress: 0,
        index: options.index
      })
      this.audioPlay();
      this.autoChangeBg();
    }
    
    console.log("player onLoad index", options.index);
    console.log("Animation obj", this.data.animation);
    console.log("innerAudioContext obj", innerAudioContext);
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
    console.log("player onShow");
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("player onHide");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
     this.animationStop();
     this.clearAutoBg();
    console.log("player onUnload");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("player onPullDownRefresh");
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("player onReachBottom");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log("player onShareAppMessage");
  }
})