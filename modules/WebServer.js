function WebServer(config) {

    var express    = require('express');
    var bodyParser = require('body-parser');
    var _this      = null;

    this.init = function () {

        _this = express();

        _this.use(express.static(config.sharedFolder));
        _this.use(bodyParser.json());

        _this.post(config.usernameCheckURL, config.usernameCheck);

        _this.get('*', function (req, res) {
            res.render('index');
        });

        _this.listen(config.port, function () {
            console.log('WebServer is listening on port ' + config.port + '!');
        });

        _this.set('views', (process.cwd() + '/views'));
        _this.set('view engine', config.viewEngine);
    };

    return this;
}

module.exports = WebServer;