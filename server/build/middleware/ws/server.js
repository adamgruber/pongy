'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ws = require('ws');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Debug output
const debug = (0, _debug2.default)('koa-sock:server');

/**
 * KoaWebSocketServer object
 * @param app
 * @param options
 */
class KoaWebSocketServer {
  constructor(app, options) {
    // Save ref to app
    this.app = app;

    // Container for options
    this.options = options || {};

    // Bind callback methods
    this.onConnection = this.onConnection.bind(this);
  }

  listen(server) {
    // Create WebSocketServer
    this.server = new _ws.Server({ server });
    debug('WebSocketServer created');

    // Listen to connection
    this.server.on('connection', this.onConnection);
  }

  /**
   * On new connection
   * @param socket
   */
  onConnection(socket) {
    debug('client connected');

    socket.on('close', () => {
      debug('Client disconnected');
    });

    socket.on('error', err => {
      debug('Error occurred:', err);
    });

    socket.on('message', message => {
      debug(message);
    });

    socket.send('Hello');
  }

  /**
   * Broadcast a message to all connected sockets
   * @param {string|object} message Message to be sent
   */
  broadcast(message) {
    const msg = typeof message === 'object' ? JSON.stringify(message) : message;
    if (this.server && this.server.clients) {
      this.server.clients.forEach(client => {
        debug('broadcasting');
        client.send(msg);
      });
    }
  }
}
exports.default = KoaWebSocketServer;