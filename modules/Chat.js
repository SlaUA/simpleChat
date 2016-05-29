function Chat(server) {

    if (!server) {
        throw new Error('please specify server');
    }

    this.subscribers = {};
    this.server      = server;

    this.init = function () {

        this.server.on('connection', this.onConnection.bind(this));
    };

    this.onConnection = function (socket) {

        this.subscribers[socket.id] = socket;

        socket.on('message', this.onMessageFromClient.bind(this));

        socket.on('disconnect', function (socket) {

            delete this.subscribers[socket.id];
        }.bind(this, socket));

        this.publishAction(this.serverCommandsMap.CLIENT_CONNECTED, {from: socket.id}, socket);
    };

    /**
     * Main proxy for messages from client
     * @param {string} data - message and action in JSON format
     */
    this.onMessageFromClient = function (data) {

        var message;

        try {
            message = JSON.parse(data);
        } catch (e) {
            return;
        }

        if (!(message.action &&
            message.action in this.actionsFromClientMap)) {
            return;
        }

        this[this.actionsFromClientMap[message.action]].call(this, message);
    };

    /**
     * @param {string} action
     * @param {object} message, info to send
     * @param {object} [socket], client's socket
     */
    this.publishAction = function (action, message, socket) {

        if (action === this.actionsFromClientMap.SEND_MESSAGE && !message.data) {
            return;
        }

        var infoToSend = {
            action: action,
            data  : message && message.data || null,
            from  : message && message.from
        };

        console.log(infoToSend);

        if (socket) {
            socket.emit('message', JSON.stringify(infoToSend));
            return;
        }

        for (var client in this.subscribers) {
            if (!this.subscribers.hasOwnProperty(client)) {
                continue;
            }
            this.subscribers[client].emit('message', JSON.stringify(infoToSend));
        }
    };

    /**
     * @param {object} message
     * message.data - text from client
     * sends message for each client
     */
    this.onSendMessageToChat = function (message) {

        if (!message) {
            return;
        }
        this.publishAction(this.serverCommandsMap.CHAT_MESSAGE_SENT, message);
    }
}

Chat.prototype.actionsFromClientMap = {
    SEND_MESSAGE: 'onSendMessageToChat'
};

Chat.prototype.serverCommandsMap = {
    CLIENT_CONNECTED : 'CLIENT_CONNECTED',
    CHAT_MESSAGE_SENT: 'CHAT_MESSAGE_SENT'
};

module.exports = Chat;