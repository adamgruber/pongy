'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const router = new _koaRouter2.default();

/**
 * Validate all POST requests to ensure
 * they conform to the expected schema.
 *
 * {
 *   action: {string} Name of action function to call
 *   args: {array} Array of arguments to pass to action
 * }
 *
 */
const validatePostRequest = (ctx, next) => {
  const { body, method } = ctx.request;
  if (method !== 'POST') {
    return next();
  }

  if (body && typeof body.action === 'string' && Array.isArray(body.args)) {
    return next();
  } else {
    ctx.response.status = 500;
    const err = 'Failed to validate. Request body must include \'action\' and \'args\' properties.';
    ctx.body = err;
  }
};

router.use(validatePostRequest);

/**
 * Health check
 *
 * @return {object}
 */
router.get('/_health', (() => {
  var _ref = _asyncToGenerator(function* (ctx) {
    ctx.body = { ok: true };
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})());

/**
 * Create a new game via broadcast message
 * containing `newGame` action and id.
 *
 * @return {string} ID of new game 
 */
router.get('/games/new', (() => {
  var _ref2 = _asyncToGenerator(function* (ctx) {
    const id = _uuid2.default.v4();
    ctx.ws.broadcast({
      action: 'newGame',
      args: [id]
    });

    ctx.body = id;
  });

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
})());

/**
 * Update the current game via broadcast message
 * containing update action and args.
 *
 * @return {object} Success object
 */
router.post('/games/update', (() => {
  var _ref3 = _asyncToGenerator(function* (ctx) {
    const { body } = ctx.request;
    ctx.ws.broadcast(body);
    ctx.body = { success: true };
  });

  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
})());

exports.default = router;