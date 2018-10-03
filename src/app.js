import Koa from 'koa';
import Rollbar from 'rollbar';

const port = process.env.PORT || 80;
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
  ctx.body = 'Hello World!';
});

app.listen(port, () => console.log(`run on ${port}`));
