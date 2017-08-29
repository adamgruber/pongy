'use strict';

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaStatic = require('koa-static');

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _kcors = require('kcors');

var _kcors2 = _interopRequireDefault(_kcors);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _ws = require('./middleware/ws');

var _ws2 = _interopRequireDefault(_ws);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const port = 4000;
const app = new _koa2.default();

// Middleware
app.use((0, _kcors2.default)());
app.use((0, _koaBodyparser2.default)());
app.use((0, _koaStatic2.default)('./build'));
app.use((0, _ws2.default)(app));

// HTTP Routes
app.use(_routes2.default.routes());

// Start the server listening
app.listen(port, () => {
    console.log(`Service started on port ${port}`);
});