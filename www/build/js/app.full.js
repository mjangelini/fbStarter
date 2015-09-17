(function() {

  'use strict';

  /* Initialization Application */
  var app = angular.module('fbStarter', [
    'ionic',
    'global',
    'login',
    'content'
  ]);

  /* Application Run : Init */
  app.run(appRun);
  appRun.$inject = ['$ionicPlatform'];

  /* Application Config : Init */
  app.config(appConfig);
  appConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider'];


  /* Application Run : Function */
  function appRun($ionicPlatform){

    $ionicPlatform.ready(function() {
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleLightContent();
      }
    });
    
  }

  /* Application Config : Function */
  function appConfig($stateProvider, $urlRouterProvider, $ionicConfigProvider){

    $stateProvider

      .state('login', {
        url: '/',
        templateUrl: "app/login/login.view.html",
        controller: 'LoginCtrl',
        resolve: {
          "Auth": ["User", "$state", function(User, $state) {
            if(User.resolve()) $state.go('content.room');
          }]
        }
      })

      .state('content', {
        url: '/content',
        abstract: true,
        templateUrl: 'app/content/content.view.html',
        controller: 'ContentCtrl',
        resolve: {
          "Auth": ["User", function(User) {
            return User.resolve();
          }]
        }
      })

      .state('content.dashboard', {
        url: '/dashboard',
        templateUrl: 'app/content/dashboard/dashboard.view.html',
        resolve: {
          "Auth": ["User", function(User) {
            return User.resolve();
          }]
        }
      })

      .state('content.room', {
        url: '/room/:roomId',
        templateUrl: 'app/content/room/room.view.html',
        controller: 'RoomCtrl',
        resolve: {
          "Auth": ["User", function(User) {
            return User.resolve();
          }]
        }
      });


    $urlRouterProvider.otherwise('/');
    $ionicConfigProvider.views.transition('none');

  }

})();
(function() {

  'use strict';

  /* Global Module */
  var app = angular.module('global', [
    'global.config',
    'global.filters'
  ]);

})();
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
(function() {

  'use strict';

  /* Content Module */
  var app = angular.module('content', [
    'content.controllers',
    'room'
  ]);

})();
(function() {

  'use strict';

  /* Content Module - Controllers */

  var controllers = angular.module('content.controllers', []);

  /* START CONTENT CONTROLLER */
  controllers.controller('ContentCtrl', ['$scope', '$firebaseArray', 'Config', 'Auth', function($scope, $firebaseArray, Config, Auth) {

    $scope.user = Auth;
    $scope.rooms = [];

    var ref = Config.ref();

    function init(){

      // Load Rooms
      $scope.rooms = $firebaseArray(ref.child('rooms'));

      // Load Rooms - Listener
      $scope.rooms.$loaded().then(function(data) {
        console.log("Rooms Loaded");
      }).catch(function(error) {
        console.log("Rooms Failed To Load");
      });

    } init();

  }]);
  /* END CONTENT CONTROLLER */

})();
(function() {

  'use strict';

  /* Login Module */
  var app = angular.module('login', [
    'login.controllers',
    'user'
  ]);

})();
(function() {

  'use strict';

  /* Login Module - Controllers */

  var controllers = angular.module('login.controllers', []);

  /* START LOGIN CONTROLLER */
  controllers.controller('LoginCtrl', ['$scope', '$state', 'User', function($scope, $state, User) {

    $scope.login = function(method){
      User.login(method).then(function(data) {
        console.log('User Successfully Logged In: ', data);
        $state.go('content.dashboard');
      }).catch(function(error) {
        console.log('Error: ', error);
      });
    };

  }]);
  /* END LOGIN CONTROLLER */

})();
(function() {

  'use strict';

  /* Inventory Module */
  var app = angular.module('room', [
    'room.controllers'
  ]);

})();
(function() {

  'use strict';

  /* Room Module - Controllers */

  var controllers = angular.module('room.controllers', []);

  controllers.controller('RoomCtrl', ['$scope', '$stateParams', '$firebaseObject', '$firebaseArray', 'Config', 'Auth', 'User', function($scope, $stateParams, $firebaseObject, $firebaseArray, Config, Auth, User) {

    /* Bound Variables */
    $scope.user = Auth;
    $scope.logout = User.logout;
    $scope.tstamp = Config.tstamp;

    /* Room Variables */
    $scope.room = null;
    $scope.comments = null;
    $scope.replies = null;
    $scope.commentlikes = null;
    $scope.replylikes = null;
    $scope.loaded = 0;
    $scope.newreply = {};
    $scope.replyshow = {};
    var ref = Config.ref()
    var roomId = $stateParams.roomId;

    /* Add Comment to Room */
    $scope.addComment = function(comment){
      $scope.comments.$add({ 
        id: Auth.auth.uid,
        avatar: Auth.information.image_lg,
        name: Auth.information.name, 
        message: comment,
        time: Firebase.ServerValue.TIMESTAMP
      }).then(function(ref) {
        $scope.newcomment = null;
        console.log("Comment Added");
      }).catch(function(error) {
        console.log("Comment Failed To Add");
      });
    }

    /* Add Reply to Comment */
    $scope.addReply = function(reply, commentId){
      $firebaseArray($scope.replies.$ref().child(commentId)).$add({ 
        id: Auth.auth.uid,
        avatar: Auth.information.image_lg,
        name: Auth.information.name, 
        message: reply,
        time: Firebase.ServerValue.TIMESTAMP
      }).then(function(ref) {
        $scope.newreply[commentId] = null;
        console.log("Reply Added");
      }).catch(function(error) {
        console.log("Reply Failed To Add");
      });
    }

    /* Add Like to Comment */
    $scope.addCommentLike = function(commentId){
      if(!$scope.commentlikes[commentId]) $scope.commentlikes[commentId] = {};
      $scope.commentlikes[commentId][Auth.auth.uid] = true;
      $scope.commentlikes.$save().then(function(ref) {
        ref.key() === Auth.auth.uid;
        console.log("Like Added");
      }, function(error) {
        console.log("Like Failed To Add");
      });
    }

    /* Add Like to Reply */
    $scope.addReplyLike = function(commentId, replyId){
      if(!$scope.replylikes[commentId]) $scope.replylikes[commentId] = {};
      if(!$scope.replylikes[commentId][replyId]) $scope.replylikes[commentId][replyId] = {};
      $scope.replylikes[commentId][replyId][Auth.auth.uid] = true;
      $scope.replylikes.$save().then(function(ref) {
        ref.key() === Auth.auth.uid;
        console.log("Like Added");
      }, function(error) {
        console.log("Like Failed To Add");
      });
    }

    /* Load & Bind Data */
    function init(){

      // Load Room
      $scope.room = $firebaseObject(ref.child('rooms').child(roomId));
      $scope.room.$loaded().then(function(data) {
        console.log("Room Loaded");
        $scope.loaded++;
      }).catch(function(error) {
        console.log("Room Failed To Load");
      });

      // Load Comments
      $scope.comments = $firebaseArray(ref.child('comments').child(roomId));
      $scope.comments.$loaded().then(function(data) {
        console.log("Comments Loaded");
        $scope.loaded++;
      }).catch(function(error) {
        console.log("Comments Failed To Load");
      });

      // Load Replies
      $scope.replies = $firebaseObject(ref.child('replies').child(roomId));
      $scope.replies.$loaded().then(function(data) {
        console.log("Replies Loaded");
        $scope.loaded++;
      }).catch(function(error) {
        console.log("Replies Failed To Load");
      });

      // Load Comment Likes
      $scope.commentlikes = $firebaseObject(ref.child('likes/comments').child(roomId));
      $scope.commentlikes.$loaded().then(function(data) {
        console.log("Comment Likes Loaded");
        $scope.loaded++;
      }).catch(function(error) {
        console.log("Comment Likes Failed To Load");
      });

      // Load Reply Likes
      $scope.replylikes = $firebaseObject(ref.child('likes/replies').child(roomId));
      $scope.replylikes.$loaded().then(function(data) {
        console.log("Reply Likes Loaded");
        $scope.loaded++;
      }).catch(function(error) {
        console.log("Reply Likes Failed To Load");
      });

    } init();

  }]);

})();
(function() {

  'use strict';

  /* User Module */
  var app = angular.module('user', [
    'user.services'
  ]);

})();
(function() {

  'use strict';

  /* User Module - Services */

  var services = angular.module('user.services', []);

  services.factory('User', userService);

  userService.$inject = ['$q', '$state', 'Config'];

  /* START USER SERVICE MODULE */

  function userService($q, $state, Config){

    var userService = {};

    /* User Login */
    userService.login = function(method){
      var p = $q.defer();

      Config.auth().$authWithOAuthPopup(method).then(function(data) {
        p.resolve(buildUser(data));
      }).catch(function(error) {
        p.reject(error);
      });

      return p.promise;
    }

    /* User Logout */
    userService.logout = function(){ 
      Config.auth().$unauth()
    }
    Config.auth().$onAuth(function(authData) {
      if (!authData) $state.go('login');
    });

    /* Resolve User */
    userService.resolve = function(method){
      var p = $q.defer();

      Config.auth().$requireAuth().then(function(data) {
        p.resolve(buildUser(data));
      }).catch(function(error) {
        p.reject(error);
      });

      return p.promise;
    }

    /* Build The User */
    function buildUser(user){
      user.information = {};
      switch(user.provider) {
        case 'twitter':
          user.information.name = user.twitter.displayName;
          user.information.image = user.twitter.cachedUserProfile.profile_image_url_https.replace('_normal', '');
          user.information.image_sm = user.twitter.cachedUserProfile.profile_image_url_https.replace('_normal', '_mini');
          user.information.image_md = user.twitter.cachedUserProfile.profile_image_url_https;
          user.information.image_lg = user.twitter.cachedUserProfile.profile_image_url_https.replace('_normal', '_bigger');
          break;
        case 'facebook':
          user.information.name = user.facebook.displayName;
          user.information.image = 'https://graph.facebook.com/'+user.facebook.id+'/picture?width=256&height=256';
          user.information.image_sm = 'https://graph.facebook.com/'+user.facebook.id+'/picture?width=24&height=24';
          user.information.image_md = 'https://graph.facebook.com/'+user.facebook.id+'/picture?width=48&height=48';
          user.information.image_lg = 'https://graph.facebook.com/'+user.facebook.id+'/picture?width=73&height=73';
          break;
      }
      return user;
    }

    return userService;

  }
  /* END USER SERVICE MODULE */

})();