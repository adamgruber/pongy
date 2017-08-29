import koa from 'koa';
import koaStatic from 'koa-static';
import cors from 'kcors';
import bodyParser from 'koa-bodyparser';
import router from './routes';
import koaws from './middleware/ws';

const port = 4000; 
const app = new koa();

// Middleware
app.use(cors());
app.use(bodyParser());
app.use(koaStatic('./build'));
app.use(koaws(app));

// HTTP Routes
app.use(router.routes());

// Start the server listening
app.listen(port, () => {
    console.log(`Service started on port ${port}`);
});
