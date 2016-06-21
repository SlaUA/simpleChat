function SocketServer() {

    var server = require('http').createServer();
    var io     = require('socket.io');
    var Chat   = require('./Chat');
    var _this  = null;
    /**
     * @type {null|Chat}
     * single chat instance
     */
    this.chat = null;

    this.init = function (port) {

        _this = io(server);
        _this.chat = Chat(_this);
        _this.chat.init();

        server.listen(port, function () {

            console.log('SocketServer is listening on port ' + port + '!');
        });
    };

    return this;
}

module.exports = SocketServer;