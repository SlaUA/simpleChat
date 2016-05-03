;(function () {

    var chatManager = {

        server : null,
        address: 'ws://localhost:3000',

        serverActionsMap: {
            CLIENT_CONNECTED: 'onInit',
            MESSAGE_ARRIVED : 'onMessageArrive'
        },

        clientActionsMap: {
            SEND_MESSAGE: 'sendMessage'
        },

        cachedElements: {
            $body       : null,
            $chatList   : null,
            $chatMessage: null
        },

        init: function () {

            this.cachedElements.$body        = jQuery('body');
            this.cachedElements.$chatList    = this.cachedElements.$body.find('#chatList');
            this.cachedElements.$chatMessage = this.cachedElements.$body.find('#chatMessage');

            this.server = window.io(this.address);
            this.server.on('message', this.onMessage);
        },

        onMessage: function (data) {

            try {
                var message = JSON.parse(data);
            } catch (e) {
                return;
            }

            if (!(message.action && message.action in this.serverActionsMap)) {
                return;
            }

            this[message.action].call(this, message);
        },

        onInit: function (message) {


        },

        onMessageArrive: function (message) {

        },

        sendMessage: function () {

        },

        publishAction: function (action, data) {

            if (action === this.clientActionsMap.SEND_MESSAGE && !data) {
                return;
            }

            var message = {
                action: action,
                data  : data
            };
            this.server.emit('message', JSON.stringify(message));
        }
    };

    jQuery(chatManager.init);
})();