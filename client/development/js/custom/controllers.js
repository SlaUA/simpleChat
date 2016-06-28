angular.module('controllers', ['services'])

       .controller('helloController', [
           '$scope', 'UserModule', function ($scope, UserModule) {

               $scope.username = UserModule.username ? UserModule.username : 'guest';
           }
       ])

       .controller('aboutController', function ($scope) {

       })

       .controller('chatController', function ($scope) {

       });