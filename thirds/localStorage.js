function LocalStorage(x,y)
{
  //同步方式
  this.setValue = function(key,data) {
    var res = true;
    try{
      wx.setStorageSync(key, data);
    }catch(e)
    {
      console.log(e);
      res = false;
    }
    return res;
  };
  
  //同步方法
  this.getValue = function(key){
    var val ="";
      try{
       val = wx.getStorageSync(key);
      }catch(e){
        console.log(e); 
      }
    return val;
  };
  
  //同步方式
  this.remove = function(key) {
     var res = true;
     try{   
       wx.removeStorageSync(key);
     } 
     catch(e)
     {
       console.log(e);
       res =false;
     }
    return res;
  };

  //清除
  this.clear = function()
  {
    var res = true;
    try{
      wx.clearStorageSync();
    }catch(e){
      console.log(e);
      res = false;
    }
    return res;
  };

  //获取所以可以
  this.getKeys = function(){
    var keys = [];
    try{
      const res = wx.getStorageInfoSync();
      keys = res.keys;
    }catch(e){
      console.log(e);
    }
    return keys;
  }
}


module.exports =
{
  LocalStorage:LocalStorage
}