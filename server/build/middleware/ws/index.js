'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = (0, _debug2.default)('koa-sock:middleware');

const WSMiddleware = (app, opts) => {
    const appListen = app.listen;

    app.ws = new _server2.default(app, opts);

    app.listen = (...args) => {
        debug('Attaching server...');
        app.server = appListen.apply(app, [...args]);
        app.ws.listen(app.server);
        return app;
    };

    return (ctx, next) => {
        ctx.ws = app.ws;
        next();
    };
};

exports.default = WSMiddleware;