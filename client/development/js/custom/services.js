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
       })

       .factory('ChatModule', function () {

           var chat = {

               connection: null,
               address   : 'ws://localhost:3000',

               _actionsFromServerMap: {
                   CHAT_MESSAGE_SENT: 'onChatMessage',
                   SERVER_MESSAGE   : 'onServerMessage'
               },

               _clientActionsMap: {
                   SEND_CHAT_MESSAGE  : 'SEND_CHAT_MESSAGE',
                   SEND_SERVER_MESSAGE: 'SEND_SERVER_MESSAGE'
               },

               _chatMessageCallbacks   : [],
               _serverMessagesCallbacks: [],

               init: function () {

                   if (this.connection) {
                       return;
                   }

                   this.connection = window.io(this.address);
                   this.connection.on('message', this.onMessageFromServer.bind(this));
               },

               /**
                * Main proxy from server for messages
                * @param {string} data - message and action in JSON format
                */
               onMessageFromServer: function (data) {

                   var message;

                   try {
                       message = JSON.parse(data);
                   } catch (e) {
                       return;
                   }

                   if (!(message.action && message.action in this._actionsFromServerMap)) {
                       return;
                   }

                   this[this._actionsFromServerMap[message.action]].call(this, message);
               },

               /**
                * @param callback {Function} callback for chat message
                */
               addChatMessageListener: function (callback) {

                   this._chatMessageCallbacks.push(callback);
               },

               /**
                * @param callback {Function} callback for server message
                */
               addServerMessageListener: function (callback) {

                   this._serverMessagesCallbacks.push(callback);
               },

               /**
                * Triggers when chat message arrives from server
                * @param {object} message - object with data and action to run
                */
               onChatMessage: function (message) {

                   this._chatMessageCallbacks.forEach(function (callback) {

                       callback.call(undefined, message);
                   });
               },

               /**
                * Triggers when server message arrives from server
                * @param {object} message - object with data and action to run
                */
               onServerMessage: function (message) {

                   this._serverMessagesCallbacks.forEach(function (callback) {

                       callback.call(undefined, message);
                   });
               },

               sendChatMessage: function (message) {

                   this.publishAction(this._clientActionsMap.SEND_CHAT_MESSAGE, message);
               },

               sendServerMessage: function (message) {

                   this.publishAction(this._clientActionsMap.SEND_SERVER_MESSAGE, message);
               },

               /**
                * Emits message with some data
                * @param {String} action, command to run with data
                * @param {String} [data] text to send
                */
               publishAction: function (action, data) {

                   if (action === this._clientActionsMap.SEND_CHAT_MESSAGE && !data) {
                       return;
                   }

                   var infoToSend = {
                       action: action,
                       data  : data,
                       from  : this.connection.id
                   };
                   this.connection.emit('message', JSON.stringify(infoToSend));
               }
           };

           return {
               init                    : chat.init.bind(chat),
               sendChatMessage         : chat.sendChatMessage.bind(chat),
               sendServerMessage       : chat.sendServerMessage.bind(chat),
               addChatMessageListener  : chat.addChatMessageListener.bind(chat),
               addServerMessageListener: chat.addServerMessageListener.bind(chat)
           }
       });