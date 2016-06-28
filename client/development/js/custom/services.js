angular.module('services', [])

       .factory('UserModule', function () {

           var username = null;

           return {
               get isLoggedIn() {
                   return Boolean(username);
               },

               get username() {
                   return username;
               },

               set username(usernameToSet) {

                   if (!(usernameToSet &&
                         typeof usernameToSet === 'string' &&
                         usernameToSet.length > 1 &&
                         usernameToSet !== 'guest')) {
                       return;
                   }
                   username = usernameToSet;
               }
           }
       });