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