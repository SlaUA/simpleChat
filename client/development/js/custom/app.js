angular.module('chatApp', ['ngRoute', 'controllers', 'services'])

       .config(function ($routeProvider, $locationProvider) {

           $routeProvider

               .when('/', {
                   templateUrl: '/templates/index.html',
                   controller : 'helloController'
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