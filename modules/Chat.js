function Chat(server) {

    if (!server) {
        throw new Error('please specify server');
    }

    this.eventsMap = {
        sendChatMessage: ['emitNewChatMessage'],
        connectSuccess : ['saveUserData', 'sendOnlineUsersList'],
        disconnect     : ['removeUserData', 'sendOnlineUsersList']
    };

    this.serverCommandsMap = {
        newMessageInChat   : 'newMessageInChat',
        giveOnlineUsersList: 'onlineUsersListFetch'
    };

    this.server = server;

    this.init = function () {

        this.server.on('connection', this.subscribeForEvents.bind(this));
    };

    this.subscribeForEvents = function (socket) {

        for (var event in this.eventsMap) {
            if (!this.eventsMap.hasOwnProperty(event)) {
                continue;
            }
            socket.on(event, this.triggerEvent.bind(this, event));
        }
    };

    this.emitNewChatMessage = function (data) {

        this.server.sockets.emit(this.serverCommandsMap.newMessageInChat, data);
    };

    this.sendOnlineUsersList = function () {

        this.server.sockets.emit(this.serverCommandsMap.giveOnlineUsersList);
    };

    this.saveUserData = function (data) {

        if (!data) {
            return;
        }
        this.server.sockets.connected['/#' + data.idFrom].username = data.usernameFrom;
    };

    this.removeUserData = function (data) {

    };

    this.triggerEvent = function (event, data) {

        this.eventsMap[event] &&
        this.eventsMap[event].forEach &&
        this.eventsMap[event].forEach(function (callbackName) {

            if (typeof this[callbackName] !== 'function') {
                return;
            }
            this[callbackName].call(this, data);
        }.bind(this));
    };
}

module.exports = function (server) {
    return new Chat(server);
};