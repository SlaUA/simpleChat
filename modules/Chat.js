function Chat(server) {

    if (!server) {
        throw new Error('please specify server');
    }

    this._actionsFromClientMap = {
        SEND_CHAT_MESSAGE: 'onSendMessageToChat'
    };

    this._serverCommandsMap = {
        CLIENT_CONNECTED : 'CLIENT_CONNECTED',
        CHAT_MESSAGE_SENT: 'CHAT_MESSAGE_SENT'
    };

    this.server = server;

    this.init = function () {

        this.server.on('connection', this.onConnection.bind(this));
    };

    this.onConnection = function (socket) {

        for (var event in this._actionsFromClientMap) {
            if (!(this._actionsFromClientMap.hasOwnProperty(event) &&
                this.hasOwnProperty(this._actionsFromClientMap[event]) &&
                typeof this[this._actionsFromClientMap[event]] === 'function')) {
                continue;
            }
            socket.on(event, this[this._actionsFromClientMap[event]].bind(this));
        }
    };

    this.onSendMessageToChat = function (data) {

        this.server.sockets.emit(this._serverCommandsMap.CHAT_MESSAGE_SENT, data);
    };
}

module.exports = function (server) {
    return new Chat(server);
};