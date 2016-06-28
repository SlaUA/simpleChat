angular.module('chatApp', ['ngRoute', 'controllers'])

       .config(function ($routeProvider, $locationProvider) {

           $routeProvider

               .when('/', {
                   templateUrl: '/templates/index.html',
                   controller : 'helloController'
               })

               .when('/chat', {
                   templateUrl: '/templates/chat.html',
                   controller : 'chatController'
               })

               .when('/about', {
                   templateUrl: '/templates/about.html',
                   controller : 'aboutController'
               })

               .otherwise({redirectTo: '/'});

           $locationProvider.html5Mode(true);
       });