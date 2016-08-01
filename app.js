var WebServer    = require('./modules/WebServer.js');
var SocketServer = require('./modules/SocketServer.js');

var webServerConfig = {
    port        : 8080,
    sharedFolder: './client/public',
    viewEngine  : 'ejs',

    POST_REQUESTS_MAP: {
        '/checkUsername': 'checkUsername'
    },

    GET_REQUESTS_MAP: {
        '*': 'onEachGetRequest'
    },

    onEachGetRequest:  function (req, res) {

        res.render('index');
    },

    checkUsername: function (req, res) {

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

var wsServer   = new SocketServer(3000);
var httpServer = new WebServer(webServerConfig);

httpServer.init();
wsServer.init();