(function() {

  'use strict';

  /* Global Module - Filters */

  var services = angular.module('global.filters', []);

  services.filter('count', countFilter);
  services.filter('likecount', countLikeFilter);
  services.filter('commentcount', commentCountFilter);
  services.filter('prettyDate', prettyDate);

  function countFilter(){
    return function(val){
      var amnt = 0;
      if(val !== undefined && val !== null) amnt = Object.keys(val).length;
      if(amnt == 1){
        return amnt + " Like";
      }else{
        return amnt + " Likes";
      }
    }
  }

  function countLikeFilter(){
    return function(val){
      var amnt = 0;
      if(val !== undefined && val !== null){
        for (var key in val) {
          if(key.indexOf("-") == -1){
            amnt++;
          }
        }
      }
      if(amnt == 1){
        return amnt + " Like";
      }else{
        return amnt + " Likes";
      }
    }
  }

  function commentCountFilter(){
    return function(val){
      var amnt = 0;
      if(val !== undefined && val !== null) amnt = Object.keys(val).length;
      if(amnt == 1){
        return amnt + " Comment";
      }else{
        return amnt + " Comments";
      }
    }
  }

  function prettyDate(){
    return function(val, arg){
      return makePretty((new Date().getTime() + val) - arg);
    }
  }

  function makePretty(milliDiff){
    var newTime = Math.floor(milliDiff/1000);
    var plural = "";
    var ret = "";
    
    var yeart = newTime/31556926;
    var montht = newTime/2629743;
    var weekt = newTime/604800;
    var dayt = newTime/86400;
    var hourt = newTime/3600;
    var minutet = newTime/60;
        
    if(yeart > 1.0){
      if(yeart > 2.0){ plural = "s"; }
      ret = Math.floor(yeart) + " Year" + plural + " Ago";
    }else if(montht > 1.0){
      if(montht > 2.0){ plural = "s"; }
      ret = Math.floor(montht) + " Month" + plural + " Ago";
    }else if(weekt > 1.0){
      if(weekt > 2.0){ plural = "s"; }
      ret = Math.floor(weekt) + " Week" + plural + " Ago";
    }else if(dayt > 1.0){
      if(dayt > 2.0){ plural = "s"; }
      ret = Math.floor(dayt) + " Day" + plural + " Ago";
    }else if(hourt > 1.0){
      if(hourt > 2.0){ plural = "s"; }
      ret = Math.floor(hourt) + " Hour" + plural + " Ago";
    }else if(minutet > 1.0){
      if(minutet > 2.0){ plural = "s"; }
      ret = Math.floor(minutet) + " Minute" + plural + " Ago";
    }else{
      if(newTime > 2.0) { plural = "s"; }
      ret = newTime + " Second" + plural + " Ago";
      if(newTime <= 0){
        ret = "Just Added";
      }
    }
    return ret;
  }


})();