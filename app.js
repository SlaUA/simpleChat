var WebServer    = require('./modules/WebServer.js');
var SocketServer = require('./modules/SocketServer.js');

var webServerConfig = {
    port            : 8080,
    sharedFolder    : './client/public',
    viewEngine      : 'ejs',
    usernameCheckURL: '/checkUsername',

    // TODO: add global array of usernames
    invalidUsernames: ['slava', 'slaua', 'guest'],

    usernameCheck   : function usernameCheck(req, res) {

        var isValid = webServerConfig.invalidUsernames.indexOf(req.body.username) === -1;
        res.json({
            valid: isValid,
            error: isValid ? null : 'username exists'
        });
    }
};

var httpServer = new WebServer(webServerConfig);
var wsServer   = new SocketServer();

httpServer.init();
wsServer.init(3000);