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

                       case $scope.userForm.$pristine:
                           $scope.errors.usernameError = 'Please, type your username!';
                           break;

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

       .controller('aboutController', function ($scope) {

       })

       .controller('chatController', function ($scope) {

       });