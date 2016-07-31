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
           'ChatModule',
           function ($scope, UserModule, ChatModule) {

               var chatManager = {

                   actionsFromServerMap    : {},
                   clientToServerActionsMap: {},

                   $messagesWrapper: null,

                   init: function () {

                       this.$messagesWrapper = jQuery('.chat-messages-wrapper');

                       ChatModule.init()
                                 .then(this.subscribeForActions.bind(this));
                   },

                   subscribeForActions: function () {

                       ChatModule.subscribeForChatMessage(this.onChatMessage, this);

                       for (var action in this.actionsFromServerMap) {
                           if (!this.actionsFromServerMap.hasOwnProperty(action)) {
                               continue;
                           }
                           ChatModule.subscribeForServerAction(action, this[this.actionsFromServerMap[action]], this);
                       }

                       $scope.$on('enterPressToSendMessage', function (event, textToSend) {

                           chatManager.sendMessageToChat(textToSend);
                       });
                   },

                   /**
                    * Triggers when message arrives from server
                    * @param {object} message - object with data and action to run
                    */
                   onChatMessage: function (message) {

                       if (ChatModule.getConnection().id === message.from) {
                           return;
                       }
                       //this.playSound(this.soundsMap.MESSAGE_ARRIVED);
                   },

                   sendMessageToChat: function (message) {

                       ChatModule.sendChatMessage(message);
                   }
               };

               chatManager.init();
           }
       ])

       .controller('aboutController', function ($scope) {

       });
