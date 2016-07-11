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

           //var chat = {
           //
           //    connection: null,
           //    address   : 'ws://localhost:3000',
           //
           //    _actionsFromServerMap: {
           //        CHAT_MESSAGE_SENT: 'onChatMessage'
           //    },
           //
           //    _clientActionsMap: {
           //        SEND_MESSAGE: 'SEND_MESSAGE'
           //    },
           //
           //    _chatMessageCallbacks: [],
           //
           //    init: function () {
           //
           //        this.connection = window.io(this.address);
           //        this.connection.on('message', this.onMessageFromServer.bind(this));
           //    },
           //
           //    /**
           //     * Main proxy from server for messages
           //     * @param {string} data - message and action in JSON format
           //     */
           //    onMessageFromServer: function (data) {
           //
           //        var message;
           //
           //        try {
           //            message = JSON.parse(data);
           //        } catch (e) {
           //            return;
           //        }
           //
           //        if (!(message.action && message.action in this._actionsFromServerMap)) {
           //            return;
           //        }
           //
           //        this[this._actionsFromServerMap[message.action]].call(this, message);
           //    },
           //
           //    /**
           //     * Triggers when message arrives from server
           //     * @param {object} message - object with data and action to run
           //     */
           //    onChatMessage: function (message) {
           //
           //    },
           //
           //    sendMessage: function (message) {
           //
           //        this.publishAction(this._clientActionsMap.SEND_MESSAGE, message);
           //    },
           //
           //    /**
           //     * Emits message with some data
           //     * @param {String} action, command to run with data
           //     * @param {String} [data] text to send
           //     */
           //    publishAction: function (action, data) {
           //
           //        if (action === this._clientActionsMap.SEND_MESSAGE && !data) {
           //            return;
           //        }
           //
           //        var infoToSend = {
           //            action: action,
           //            data  : data,
           //            from  : this.connection.id
           //        };
           //        this.connection.emit('message', JSON.stringify(infoToSend));
           //    }
           //};
           //
           //return {
           //    connection : chat.connection,
           //    init       : chat.init,
           //    sendMessage: chat.sendMessage
           //}
       });