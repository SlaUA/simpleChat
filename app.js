var WebServer    = require('./modules/WebServer.js');
var SocketServer = require('./modules/SocketServer.js');
var httpServer   = new WebServer();
var wsServer     = new SocketServer();

httpServer.init(8080);
wsServer.init(3000);