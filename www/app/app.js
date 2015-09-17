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