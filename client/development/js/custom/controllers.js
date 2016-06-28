angular.module('controllers', ['services'])

       .controller('helloController', [
           '$scope', 'AuthModule', function ($scope, AuthModule) {

               $scope.username = AuthModule.currentUser ? AuthModule.currentUser : 'guest';
           }
       ])

       .controller('aboutController', function ($scope) {

       })

       .controller('chatController', function ($scope) {

       });