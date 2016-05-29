;(function () {

    var clientChatManager = {

        connection: null,
        address   : 'ws://192.168.0.105:3000',
        id        : null,

        actionsFromServerMap: {
            CLIENT_CONNECTED : 'onClientConnect',
            CHAT_MESSAGE_SENT: 'onChatMessageSent'
        },

        clientActionsMap: {
            SEND_MESSAGE: 'SEND_MESSAGE'
        },

        soundsHash: {
            MESSAGE_ARRIVED: {
                id    : 'MESSAGE_ARRIVED',
                source: '/sounds/notify.mp3'
            }
        },

        eventsMap: {
            ENTER_KEY: 13
        },

        cachedElements: {
            $body       : null,
            $chatList   : null,
            $chatMessage: null,
            sounds      : {}
        },

        init: function () {

            this.cachedElements.$body          = jQuery('body');
            this.cachedElements.$chatList      = this.cachedElements.$body.find('.chat');
            this.cachedElements.$chatMessage   = this.cachedElements.$body.find('.messageText');
            this.cachedElements.$submitMessage = this.cachedElements.$body.find('.sendMessage');

            this.cacheSounds();
            this.addListeners();
            this.chaseOnlineUsers();

            this.connection = window.io(this.address);
            this.connection.on('message', this.onMessageFromServer.bind(this));
        },

        cacheSounds: function () {

            var audio;
            for (var soundEvent in this.soundsHash) {
                if (!this.soundsHash.hasOwnProperty(soundEvent)) {
                    continue;
                }
                audio                                                      = new Audio();
                audio.src                                                  = this.soundsHash[soundEvent].source;
                this.cachedElements.sounds[this.soundsHash[soundEvent].id] = audio;
            }
        },

        addListeners: function () {

            this.cachedElements.$submitMessage.on('click', this.sendMessage.bind(this));
            this.cachedElements.$chatMessage.on('keypress', this.sendMessage.bind(this));
        },

        chaseOnlineUsers: function () {

        },

        sendMessage: function (event) {

            var chatMessage;

            if (!(event.type === 'keypress' &&
                event.which === this.eventsMap.ENTER_KEY ||
                event.type === 'click')) {
                return;
            }

            chatMessage = this.cachedElements.$chatMessage.val().trim();
            this.cachedElements.$chatMessage.val('');
            this.publishAction(this.clientActionsMap.SEND_MESSAGE, chatMessage);
        },

        playSound: function (soundEvent) {

            if (!this.cachedElements.sounds.hasOwnProperty(soundEvent.id)) {
                return;
            }
            this.cachedElements.sounds[soundEvent.id].play();
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

            if (!(message.action && message.action in this.actionsFromServerMap)) {
                return;
            }

            this[this.actionsFromServerMap[message.action]].call(this, message);
        },

        onClientConnect: function () {

            console.log('inited');
        },

        /**
         * Triggers when message arrives from server(another user)
         * @param {object} message - object with data and action to run
         */
        onChatMessageSent: function (message) {

            this.cachedElements.$chatList.append('<li class="message">' + message.data + '</li>');
            this.playSound(this.soundsHash.MESSAGE_ARRIVED);
        },

        /**
         * Emits message with some data
         * @param {String} action, command to run with data
         * @param {String} [data] text to send
         */
        publishAction: function (action, data) {

            if (action === this.clientActionsMap.SEND_MESSAGE && !data) {
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

    jQuery(clientChatManager.init.bind(clientChatManager));
})();