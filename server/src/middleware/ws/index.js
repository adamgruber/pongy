import debugFn from 'debug';
import KoaWebSocketServer from './server';

const debug = debugFn('koa-sock:middleware');

const WSMiddleware = (app, opts) => {
    const appListen = app.listen;

    app.ws = new KoaWebSocketServer(app, opts);

    app.listen = (...args) => {
        debug('Attaching server...')
        app.server = appListen.apply(app, [...args]);
        app.ws.listen(app.server);
        return app;
    };

    return (ctx, next) => {
        ctx.ws = app.ws;
        next();
    };
};

export default WSMiddleware;
