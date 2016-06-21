function WebServer() {

    var express = require('express');
    var path = require('path');
    var _this   = null;

    this.init = function (port) {

        _this = express();

        _this.use(express.static('./client/public'));

        _this.get('/', function (req, res) {
            res.render('index');
        });

        _this.listen(port, function () {
            console.log('WebServer is listening on port ' + port + '!');
        });

        _this.set('views', (process.cwd() + '/views'));
        _this.set('view engine', 'ejs');
    };

    return this;
}

module.exports = WebServer;