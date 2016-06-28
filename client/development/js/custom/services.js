angular.module('services', [])

       .factory('AuthModule', function () {

           var currentUser = null;

           return {
               isLoggedIn : function () {
                   return Boolean(currentUser);
               },
               currentUser: currentUser
           };
       });