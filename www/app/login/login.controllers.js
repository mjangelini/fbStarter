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