function SocketServer() {

    var server = require('http').createServer();
    var io     = require('socket.io');
    var _this  = null;

    this.init = function (port) {

        _this = io(server);

        _this.on('connection', function (socket) {

            socket.on('message', function (data) {

                console.log('message: ' + data);
            });

            socket.on('disconnect', function () {});
        });

        server.listen(port, function () {

            console.log('SocketServer is listening on port ' + port + '!');
        });
    };

    return this;
}

module.exports = SocketServer;