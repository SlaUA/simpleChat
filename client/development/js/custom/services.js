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

       .factory('ChatModule', [
           '$q', function ($q) {

               var chat = {

                   connection: null,

                   address: 'ws://localhost:3000',

                   _actionsFromServerMap: {
                       CHAT_MESSAGE_SENT: 'onChatMessage'
                   },

                   _clientActionsMap: {
                       SEND_CHAT_MESSAGE: 'SEND_CHAT_MESSAGE'
                   },

                   _stackedMessages: [],

                   init: function () {

                       var connected = $q.defer();

                       if (this.connection) {
                           throw new Error('connection already instantiated');
                       }

                       this.connection = window.io(this.address);
                       this.connection
                           .on('connect', this.onConnect.bind(this, connected));

                       return connected.promise;
                   },

                   onConnect: function (connectedDeferred) {

                       this.sendStackedMessages();
                       connectedDeferred.resolve();
                   },

                   getConnection: function () {

                       return this.connection;
                   },

                   sendStackedMessages: function () {

                       this._stackedMessages
                           .forEach(function (message) {

                               this.sendChatMessage(message);
                           }.bind(this));

                       this._stackedMessages = [];
                   },

                   /**
                    * @param callback {function} callback for chat message
                    * @param context {object} context for callback
                    */
                   subscribeForChatMessage: function (callback, context) {

                       this.connection.on(this._actionsFromServerMap.CHAT_MESSAGE_SENT, callback.bind(context));
                   },

                   /**
                    * @param action {String} action name
                    * @param callback {Function} callback for chat message
                    * @param context {Object} context for callback
                    */
                   subscribeForServerAction: function (action, callback, context) {

                       if (typeof callback !== 'function') {
                           throw new Error('callback must be a function');
                       }
                       this.connection.on(action, callback.bind(context));
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

                       this.publishAction(this._clientActionsMap.SEND_CHAT_MESSAGE, message);
                   },

                   /**
                    *
                    * @param action {String} action name
                    * @param [message] {String|Number|Object} data to send
                    */
                   sendServerMessage: function (action, message) {

                       this.publishAction(action, message);
                   },

                   /**
                    * Emits message with some data
                    * @param {String} action, command to run with data
                    * @param {String} [message] text to send
                    */
                   publishAction: function (action, message) {

                       this.connection.emit(action, {
                           message: message,
                           from   : this.connection.id
                       });
                   }
               };

               return {
                   init                    : chat.init.bind(chat),
                   sendChatMessage         : chat.sendChatMessage.bind(chat),
                   sendServerMessage       : chat.sendServerMessage.bind(chat),
                   subscribeForChatMessage : chat.subscribeForChatMessage.bind(chat),
                   subscribeForServerAction: chat.subscribeForServerAction.bind(chat),
                   getConnection           : chat.getConnection.bind(chat)
               }
           }
       ]);