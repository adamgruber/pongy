import './env';
import koa from 'koa';
import koaStatic from 'koa-static';
import cors from 'kcors';
import bodyParser from 'koa-bodyparser';
import respond from 'koa-respond';
import apiRouter from './routes/api';
import appRouter from './routes/app';
import koaws from './middleware/ws';
import connectToDb from './db';

const port = process.env.SERVER_PORT || 4000;
const app = new koa();

// Mongoose
connectToDb({
  host: process.env.MONGO_HOST,
  db: process.env.MONGO_DB,
});

// Middleware
app.use(cors());
app.use(bodyParser());
app.use(koaStatic('./build'));
app.use(koaws(app));
app.use(respond());

// HTTP Routes
app.use(apiRouter.routes());
app.use(appRouter.routes());

// Start the server listening
app.listen(port, () => {
    console.log(`Service started on port ${port}`);
});
