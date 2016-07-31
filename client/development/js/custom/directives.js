angular.module('directives', ['services'])

       .directive('usernameChecker', [
           'UserModule',
           '$timeout',
           function (UserModule, $timeout) {

               return {

                   timeoutToCheck   : 500,
                   timeoutID        : -1,
                   restrict         : 'A',
                   deprecatedSymbols: new RegExp('[\\sа-я`\/\\\-=+\\(\\)]', 'gi'),
                   require          : 'ngModel',

                   link: function ($scope, $element, attrs, ngModelCtrl) {

                       // filter typing cyrillic
                       ngModelCtrl.$parsers.push(function (username) {

                           var correctUsername = username.replace(this.deprecatedSymbols, '');

                           if (correctUsername !== username) {
                               ngModelCtrl.$setViewValue(correctUsername);
                               ngModelCtrl.$render();
                           }
                           return correctUsername.trim();
                       }.bind(this));

                       // change view function callback
                       ngModelCtrl.$parsers.unshift(function (username) {

                           clearTimeout(this.timeoutID);
                           $scope.usernameCheckPending = true;

                           this.timeoutID = setTimeout(function () {

                               if (!username ||
                                   username.length < 3) {

                                   ngModelCtrl.$setValidity('username', false);
                                   $scope.errors.usernameError = 'Username is too short!';
                                   $scope.usernameCheckPending = false;
                                   return $scope.$apply();
                               }

                               UserModule.checkUsername(username)
                                         .then(function (response) {

                                             ngModelCtrl.$setValidity('username', response.data.valid);
                                             $scope.errors.usernameError = response.data.error;
                                             $scope.usernameCheckPending = false;
                                         });
                           }, this.timeoutToCheck);

                           return username;
                       }.bind(this));

                       $timeout(function () {

                           // select initial username
                           $element[0].setSelectionRange(0, $element.val().length);
                           ngModelCtrl.$setValidity('username', false);
                       }, 0);
                   }
               };
           }
       ])

       .directive('chatSubmit', [

           function () {

               return {

                   ENTER_KEY_CODE: 13,
                   restrict      : 'A',

                   link: function ($scope, $element) {

                       $element.bind("keydown keypress", function (event) {

                           var $this        = angular.element(event.target),
                               messageValue = $this.val().trim();

                           if (event.which === this.ENTER_KEY_CODE) {
                               event.preventDefault();
                               $this.val('');
                               $scope.$emit('keyPressedToSendMessage', messageValue);
                           }
                       }.bind(this));
                   }
               };
           }
       ])

       .directive('chatMessage', [
               function () {
                   return {
                       restrict   : 'E',
                       templateUrl: '/templates/chatMessage.html'
                   }
               }
           ]
       );