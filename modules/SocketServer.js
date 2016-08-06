function SocketServer(options) {

    var Chat  = require('./Chat');
    var _this = null;

    var express = require('express')();
    var server  = express.listen(options.port);
    var io      = require('socket.io');

    /**
     * @type {null|Chat}
     * single chat instance
     */
    this.chat = null;

    this.init = function () {

        _this      = io.listen(server);
        _this.chat = Chat(_this);
        _this.chat.init();

        server.listen(options.port, function () {

            global.socketConnectedClients            = _this.sockets.connected;
            global.socketConnectedClients['/#guest'] = {
                username: 'guest'
            };
            console.log('SocketServer is listening on port ' + options.port + '!');
        });
    };

    return this;
}

module.exports = SocketServer;