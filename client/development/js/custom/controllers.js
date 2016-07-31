angular.module('controllers', ['services'])

       .controller('welcomeController', [
           '$scope', 'UserModule', '$location', function ($scope, UserModule, $location) {

               $scope.username             = 'guest';
               $scope.usernameCheckPending = false;
               $scope.errors               = {
                   usernameError: null
               };

               $scope.submitUsername = function ($scope) {

                   switch (true) {

                       // user has not interacted with the form yet
                       case $scope.userForm.$pristine:
                           $scope.errors.usernameError = 'Please, type your username!';
                           break;

                       // pending request or not valid
                       case (!$scope.userForm.$valid ||
                       $scope.usernameCheckPending):
                           return false;
                           break;

                       default:
                           UserModule.username = $scope.username;
                           $location.path('/chat');
                   }
               };
           }
       ])

       .controller('chatController', [
           '$scope',
           'UserModule',
           function ($scope, UserModule) {

               var chatManager = {

                   _stackedMessages: [],

                   connection: null,
                   address   : 'ws://localhost:3000',

                   eventsMap: {
                       connect            : ['onConnect'],
                       sendMessageToChat  : ['sendChatMessage'],
                       sendMessageToServer: ['sendServerMessage'],
                       newMessageInChat   : ['onNewChatMessage']
                   },

                   clientActions: {
                       SEND_CHAT_MESSAGE: 'sendChatMessage'
                   },

                   clientToServerActionsMap: {},

                   init: function () {

                       if (this.connection) {
                           throw new Error('connection already instantiated');
                       }

                       $scope.chatMessages = [];

                       this.connection = window.io(this.address);
                       this.subscribeForEvents();
                   },

                   onConnect: function () {

                       console.log('connected!');
                   },

                   onNewChatMessage: function (messageData) {

                       $scope.chatMessages.push(messageData);
                       $scope.$apply();
                   },

                   sendStackedMessages: function () {

                       this._stackedMessages
                           .forEach(function (message) {

                               this.publishAction(this.clientActions.SEND_CHAT_MESSAGE, message);
                           }.bind(this));

                       this._stackedMessages = [];
                   },

                   /**
                    * sends message to chat
                    * @param message {String} message to send
                    */
                   sendChatMessage: function (message) {

                       if (!message) {
                           return;
                       }

                       if (!(this.connection &&
                           this.connection.id)) {
                           this._stackedMessages.push(message);
                           return;
                       }

                       this.publishAction(this.clientActions.SEND_CHAT_MESSAGE, message);
                   },

                   /**
                    *
                    * @param action {String} action name
                    * @param [message] {String|Number|Object} data to send
                    */
                   sendServerMessage: function (action, message) {

                       this.publishAction(action, message);
                   },

                   subscribeForEvents: function () {

                       for (var event in this.eventsMap) {
                           if (!this.eventsMap.hasOwnProperty(event)) {
                               continue;
                           }
                           this.connection.on(event, this.triggerEvent.bind(this, event));
                       }

                       $scope.$on('keyPressedToSendMessage', function (event, textToSend) {

                           this.triggerEvent('sendMessageToChat', textToSend);
                       }.bind(this));
                   },

                   triggerEvent: function (event, options) {

                       this.eventsMap[event] &&
                       this.eventsMap[event].forEach &&
                       this.eventsMap[event].forEach(function (callbackName) {

                           if (typeof this[callbackName] !== 'function') {
                               return;
                           }
                           this[callbackName].call(this, options);
                       }.bind(this));
                   },

                   /**
                    * Emits message with some data
                    * @param {String} action, command to run with data
                    * @param {String} [messageText] text to send
                    */
                   publishAction: function (action, messageText) {

                       this.connection.emit(action, {
                           messageText : messageText,
                           idFrom      : this.connection.id,
                           usernameFrom: UserModule.username,
                           messageDate : new Date()
                       });
                   }
               };

               chatManager.init();
           }
       ]);
