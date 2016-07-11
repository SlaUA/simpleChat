angular.module('controllers', ['services'])

       .controller('welcomeController', [
           '$scope', 'UserModule', '$location', function ($scope, UserModule, $location) {

               $scope.username             = 'guest';
               $scope.usernameCheckPending = false;
               $scope.errors               = {
                   usernameError: null
               };

               $scope.submitUsername = function ($scope) {

                   switch (true) {

                       // user has not interacted with the form yet
                       case $scope.userForm.$pristine:
                           $scope.errors.usernameError = 'Please, type your username!';
                           break;

                       // pending request or not valid
                       case (!$scope.userForm.$valid ||
                       $scope.usernameCheckPending):
                           return false;
                           break;

                       default:
                           UserModule.username = $scope.username;
                           $location.path('/chat');
                   }
               };
           }
       ])

       .controller('chatController', [
           '$scope', 'UserModule', 'ChatModule', function ($scope, UserModule, ChatModule) {

               debugger;
               var chatManager = {};

               /**
                * Triggers when message arrives from server
                * @param {object} message - object with data and action to run
                */
               var onChatMessageSent = function (message) {

                   if (this.connection.id === message.from) {
                       return;
                   }
                   this.playSound(this.soundsMap.MESSAGE_ARRIVED);
               };
           }
       ])

       .controller('aboutController', function ($scope) {

       });
