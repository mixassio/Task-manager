import path from 'path';
import _ from 'lodash';
import Koa from 'koa';
import Rollbar from 'rollbar';
import Pug from 'koa-pug';
import Router from 'koa-router';
import koaLogger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import views from 'koa-views';

const port = process.env.PORT || 3000;
const app = new Koa();
const router = new Router();
const rollbar = new Rollbar('POST_SERVER_ITEM_ACCESS_TOKEN');
const pug = new Pug({
  viewPath: path.join(__dirname, 'views'),
  noCache: process.env.NODE_ENV === 'development',
  debug: true,
  pretty: true,
  compileDebug: true,
  locals: [],
  basedir: path.join(__dirname, 'views'),
  helperPath: [
    { _ },
    { urlFor: (...args) => router.url(...args) },
  ],
});
pug.use(app);
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    rollbar.error(err, ctx.request);
  }
});
app.use(koaLogger());
app.use(bodyParser());
app.use(serve(path.join(__dirname, '..', 'public')));
app.use(views(path.join(__dirname, '..', 'views'), { extension: 'pug' }));
router.get('/', async (ctx) => {
  console.log('start render');
  await ctx.render('index');
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => console.log(`run on ${port}`));
