angular.module('directives', ['services'])
       .directive(
           'usernameChecker',
           [
               'UserModule',
               '$timeout',
               function (UserModule, $timeout) {

                   return {
                       timeoutToCheck: 500,
                       timeoutID     : -1,
                       restrict      : 'A',
                       require       : 'ngModel',
                       link          : function ($scope, $element, attrs, ngModelCtrl) {

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

                               // select intitial username
                               $element[0].setSelectionRange(0, $element.val().length);
                               ngModelCtrl.$setValidity('username', false);
                           }, 0)
                       }
                   };
               }
           ]);