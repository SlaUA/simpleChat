angular.module('controllers', ['services'])

       .controller('welcomeController', [
           '$scope',
           'UserModule',
           '$location',
           function ($scope, UserModule, $location) {

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
           '$location',
           function ($scope, UserModule, $location) {

               $scope.currentUsername = UserModule.username;
               $scope.chatVisible = true;

               $scope.closeChat = function () {

                   try {
                       chatManager.publishAction(chatManager.clientActions.TRY_DISCONNECT);
                   } catch (e) {}
                   UserModule.username = '';
                   $location.path('/');
               };

               var chatManager = {

                   _stackedMessages: [],

                   connection: null,
                   address   : 'ws://' + location.hostname + ':3000',

                   eventsMap: {
                       connect             : ['onConnect'],
                       sendMessageToChat   : ['sendChatMessage'],
                       sendMessageToServer : ['sendServerMessage'],
                       newMessageInChat    : ['onNewChatMessage'],
                       onlineUsersListFetch: ['onFetchOnlineUsers']
                   },

                   clientActions: {
                       SEND_CHAT_MESSAGE     : 'sendChatMessage',
                       CONNECTED_SUCCESSFULLY: 'connectSuccess',
                       TRY_DISCONNECT        : 'forceDisconnect'
                   },

                   clientToServerActionsMap: {},

                   init: function () {

                       if (this.connection) {
                           throw new Error('connection already instantiated');
                       }

                       $scope.chatMessages = [];
                       $scope.onlineUsers  = [];

                       this.connection = window.io(this.address);
                       this.subscribeForEvents();
                   },

                   onConnect: function () {

                       setTimeout(this.triggerEvent.bind(
                           this, 'sendMessageToServer',
                           this.clientActions.CONNECTED_SUCCESSFULLY), 0
                       );
                   },

                   onNewChatMessage: function (messageData) {

                       $scope.chatMessages.push(messageData);
                       $scope.$apply();
                   },

                   onFetchOnlineUsers: function (usersList) {

                       $scope.onlineUsers = usersList;
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

                       if (!action) {
                           return;
                       }

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

                       if (!action) {
                           return;
                       }

                       this.connection.emit(action, {
                           messageText : messageText,
                           idFrom      : this.connection.id,
                           usernameFrom: UserModule.username,
                           messageDate : new Date()
                       });
                   }
               };

               var dragDropManager = {

                   chatWrapper: document.querySelector('.chat-wrapper'),
                   chatWindow : document.querySelector('.chat-window'),

                   // deltas of client event and chat offset
                   deltaX: 0,
                   deltaY: 0,

                   // bound to "this" function to run on mouse move
                   onMoveBoundFn: function () {
                   },

                   init: function () {

                       this.onMoveBoundFn = this.onMouseMove.bind(this);

                       this.chatWrapper
                           .addEventListener('mousedown', function (e) {

                               if (!e.target.classList.contains('chat-header-wrapper')) {
                                   return;
                               }

                               this.chatWindow.style.position = 'absolute';

                               this.deltaX = e.clientX - this.chatWindow.offsetLeft;
                               this.deltaY = e.clientY - this.chatWindow.offsetTop;

                               this.chatWrapper.addEventListener(
                                   'mousemove',
                                   this.onMoveBoundFn
                               );
                           }.bind(this));

                       this.chatWrapper
                           .addEventListener('mouseup', function () {

                               this.chatWrapper.removeEventListener('mousemove', this.onMoveBoundFn);
                           }.bind(this));
                   },

                   onMouseMove: function (e) {

                       this.chatWindow.style.left = (e.clientX - this.deltaX) + 'px';
                       this.chatWindow.style.top  = (e.clientY - this.deltaY) + 'px';
                   }
               };

               chatManager.init();
               dragDropManager.init();
           }
       ]);
