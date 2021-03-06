angular.module('chatApp', ['ngRoute', 'controllers', 'services', 'directives'])

       .config(function ($routeProvider, $locationProvider) {

           $routeProvider

               .when('/', {
                   templateUrl: '/templates/welcome.html',
                   controller : 'welcomeController',
                   resolve    : {
                       check: function ($location, UserModule) {

                           if (UserModule.isLoggedIn) {
                               return $location.path('/chat');
                           }
                       }
                   }
               })

               .when('/chat', {
                   templateUrl: '/templates/chat.html',
                   controller : 'chatController',
                   resolve    : {
                       check: function ($location, UserModule) {

                           if (!UserModule.isLoggedIn) {
                               return $location.path('/');
                           }
                       }
                   }
               })

               .when('/about', {
                   templateUrl: '/templates/about.html',
                   controller : 'aboutController'
               })

               .otherwise({
                   redirectTo: '/'
               });

           $locationProvider.html5Mode(true);
       });