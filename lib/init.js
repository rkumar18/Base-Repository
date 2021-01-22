global.Promise = require('bluebird');

require('./logger/initLogger');


global.CONSTANTS = require('./constants/constants');
const connection = require('../connection/connect');
const socket = require("../lib/socket/index");


require('../index');
let startServer;

(function startInitialProcess() {
    let http = require('http');
    startServer = http.createServer(app).listen(app.get('port'), function() {
        console.log('start socketInitialize');
        let io = require('socket.io')(startServer);
        socket(io)
        logger.info({ context: "APP", event: "Express server listening", message: { port: process.env.PORT || config.get('PORT'), ENV: process.env.NODE_ENV } });
    });
})();

exports.initializeServer = function () {
    Promise.coroutine(function* () {
        yield connection.connect().then().catch(error => console.log('iscon-empex Db not connected.', error));
    })().catch((err) => {
        logger.error(err.toString());
        process.exit(1);
    });
}

if (!('toJSON' in Error.prototype)) {
    Object.defineProperty(Error.prototype, 'toJSON', {
        value: function() {
            var error = "{}";
            if (this.stack) {
                var errStack = this.stack.split('\n');
                error = errStack[0] + errStack[1];
            } else if (this.message) {
                error = this.message;
            }
            return error;
        },
        configurable: true,
        writable: true
    });
}