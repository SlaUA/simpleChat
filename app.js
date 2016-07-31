var WebServer    = require('./modules/WebServer.js');
var SocketServer = require('./modules/SocketServer.js');

var webServerConfig = {
    port            : 8080,
    sharedFolder    : './client/public',
    viewEngine      : 'ejs',
    usernameCheckURL: '/checkUsername',

    usernameCheck: function usernameCheck(req, res) {

        var isValid = webServerConfig.checkUsernameIsExists(req.body.username);

        res.json({
            valid: isValid,
            error: isValid ? null : 'username exists'
        });
    },

    checkUsernameIsExists: function (username) {

        var isValid = true;

        for (var client in global.socketConnectedClients) {
            if (!global.socketConnectedClients.hasOwnProperty(client)) {
                continue;
            }
            if (global.socketConnectedClients[client].username === username) {
                isValid = false;
                break;
            }
        }

        return isValid;
    }
};

var httpServer = new WebServer(webServerConfig);
var wsServer   = new SocketServer(3000);

httpServer.init();
wsServer.init();