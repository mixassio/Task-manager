import buildFormObj from '../lib/formObjectBuilder';
import { User } from '../models';

export default (router, { logger }) => {
  router
    .get('users', '/users', async (ctx) => {
      const users = await User.findAll();
      const { userId } = ctx.session;
      logger('userLoginID', userId);
      ctx.render('users', { users, userId });
    })
    .post('users', '/users', async (ctx) => {
      const { form } = ctx.request.body;
      const user = User.build(form);
      try {
        await user.save();
        ctx.flash.set('User has been created');
        ctx.redirect(router.url('root'));
      } catch (e) {
        ctx.render('users/new', { f: buildFormObj(user, e) });
      }
    })
    .patch('users', '/users', async (ctx) => {
      const { form } = ctx.request.body;
      console.log(form);
      const { userId: id } = ctx.session;
      const user = await User.findOne({
        where: { id },
      });
      await user.update(form);
      ctx.render('users/show', { user });
    })
    .get('newUser', '/users/new', (ctx) => {
      const user = User.build();
      ctx.render('users/new', { f: buildFormObj(user) });
    })
    .delete('userDelete', '/users/:id', async (ctx) => {
      logger(ctx.params);
      const { id } = ctx.params;
      const user = await User.findOne({
        where: { id },
      });
      const anything = await User.destroy({
        where: { id },
      });
      logger('deleting user', anything, user.id);
      ctx.flash.set('User has been deleted');
      logger(`Delete session user= ${ctx.session.userId}`);
      ctx.session = {};
      ctx.redirect(router.url('root'));
    })
    .get('userShow', '/users/:id', async (ctx) => {
      const { id } = ctx.params;
      const user = await User.findOne({
        where: { id },
      });
      ctx.render('users/show', { user });
    })
    .get('userUpdate', '/users/:id/edit', async (ctx) => {
      const { id } = ctx.params;
      const user = await User.findOne({
        where: { id },
      });
      ctx.render('users/edit', { user, f: buildFormObj(user) });
    });
};
