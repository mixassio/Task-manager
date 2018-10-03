"use strict";

var _koa = _interopRequireDefault(require("koa"));

var _rollbar = _interopRequireDefault(require("rollbar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = new _koa.default();
const rollbar = new _rollbar.default('POST_SERVER_ITEM_ACCESS_TOKEN');
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    rollbar.error(err, ctx.request);
  }
});
app.use(async ctx => {
  ctx.body = "Hello World!";
});
app.listen(3000);