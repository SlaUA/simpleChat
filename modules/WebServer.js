function WebServer(config) {

    var express    = require('express');
    var bodyParser = require('body-parser');
    var _this      = null;

    this.init = function () {

        _this = express();

        _this.use(express.static(config.sharedFolder));
        _this.use(bodyParser.json());

        for (var postURL in config.POST_REQUESTS_MAP) {
            if (!config.POST_REQUESTS_MAP.hasOwnProperty(postURL)) {
                continue;
            }
            _this.post(postURL, config[config.POST_REQUESTS_MAP[postURL]]);
        }

        for (var getURL in config.GET_REQUESTS_MAP) {
            if (!config.GET_REQUESTS_MAP.hasOwnProperty(getURL)) {
                continue;
            }
            _this.get(getURL, config[config.GET_REQUESTS_MAP[getURL]]);
        }

        _this.listen(config.port, function () {
            console.log('WebServer is listening on port ' + config.port + '!');
        });

        _this.set('views', (process.cwd() + '/views'));
        _this.set('view engine', config.viewEngine);
    };

    return this;
}

module.exports = WebServer;