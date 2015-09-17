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