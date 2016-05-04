function Chat(server) {

    if (!server) {
        throw new Error('please specify server');
    }

    this.subscribers = {};
    this.server      = server;

    this.init = function () {

        this.server.on('connection', function (socket) {

            this.subscribers[socket.id] = socket;

            socket.on('message', this.onMessage);

            socket.on('disconnect', function (socket) {

                delete this.subscribers[socket.id];
            }.bind(this, socket));

            this.publishAction(socket, this.serverActionsMap.CLIENT_CONNECTED);
        }.bind(this));
    };

    this.onMessage = function (data) {

        var message;

        try {
            message = JSON.parse(data);
        } catch (e) {
            return;
        }

        if (!(message.action && message.action in this.serverActionsMap)) {
            return;
        }

        this[message.action].call(this, message);
    };

    this.publishAction = function (socket, action, data) {

        if (action === this.clientActionsMap.SEND_MESSAGE && !data) {
            return;
        }

        var message = {
            action: action,
            data  : data
        };

        socket.emit('message', JSON.stringify(message));
    };
}

Chat.prototype.clientActionsMap = {
    SEND_MESSAGE: 'sendMessageToChat'
};

Chat.prototype.serverActionsMap = {
    CLIENT_CONNECTED: 'CLIENT_CONNECTED',
    MESSAGE_ARRIVED : 'MESSAGE_ARRIVED'
};

module.exports = Chat;