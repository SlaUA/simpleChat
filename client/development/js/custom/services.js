angular.module('services', [])

       .factory('UserModule', function ($http) {

           var username = null;

           return {

               get isLoggedIn() {
                   return Boolean(username);
               },

               get username() {

                   return username;
               },

               set username(usernameToSet) {

                   username = usernameToSet;
               },

               checkUsername: function (username) {

                   return $http({
                       method  : 'POST',
                       url     : '/checkUsername',
                       dataType: 'JSON',
                       data    : angular.toJson({username: username})
                   });
               }
           }
       });