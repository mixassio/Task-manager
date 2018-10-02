import Koa from 'koa';
import Rollbar from 'rollbar';

export default () => {
  const app = new Koa();
  const rollbar = new Rollbar('POST_SERVER_ITEM_ACCESS_TOKEN');
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      rollbar.error(err, ctx.request);
    }
  });
  app.use(async (ctx) => {
    ctx.body = 'Hello World';
  });
  return app;
};
