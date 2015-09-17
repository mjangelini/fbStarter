(function() {

  'use strict';

  /* Global Module - Configuration */

  var services = angular.module('global.config', ['firebase']);

  services.factory('Config', configService);

  configService.$inject = ['$rootScope', '$firebaseAuth', '$interval'];

  function configService($rootScope, $firebaseAuth, $interval){

    var configService = {};
    var FIREBASE_URL = 'https://fbstarter.firebaseio.com/';
    var refObj = new Firebase(FIREBASE_URL);
    var timestamp = null;
    var timetoggle = false;
    var timestampInterval;

    /* GETTER - Firebase URL */
    configService.url = function(){ 
      return FIREBASE_URL;
    }

    /* GETTER - Firebase Reference */
    configService.ref = function(){ 
      return refObj;
    }

    /* GETTER - Firebase Auth */
    configService.auth = function(){
      return $firebaseAuth(new Firebase(FIREBASE_URL));
    }

    
    /* Handle Timestamp */
    configService.tstamp = function(){
      return timestamp;
    }
    configService.setTstamp = function(val){
      timestamp = val;
    }
    function init(){
      var offsetRef = new Firebase(FIREBASE_URL+".info/serverTimeOffset");
      offsetRef.on("value", function(snap) { timestamp = snap.val();});
      if (angular.isDefined(timestampInterval)) return;
      timestampInterval = $interval(reloadTime, 10000);
    } init();
    function reloadTime(){
      if(timetoggle){
        configService.setTstamp(timestamp+1);
      }else{
        configService.setTstamp(timestamp-1);
      }
      timetoggle = !timetoggle;
    }
    function stopTimer(){
      if (angular.isDefined(timestampInterval)) {
        $interval.cancel(timestampInterval);
        timestampInterval = undefined;
      }
    }
    $rootScope.$on('$destroy', function() { stopTimer(); });

    return configService;

  }

})();