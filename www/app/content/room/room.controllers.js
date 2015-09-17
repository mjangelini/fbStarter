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