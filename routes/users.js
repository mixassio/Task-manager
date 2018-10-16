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
    .get('newUser', '/users/new', (ctx) => {
      const user = User.build();
      ctx.render('users/new', { f: buildFormObj(user) });
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
    .get('userShow', '/users/:id', async (ctx) => {
      const { id } = ctx.params;
      const user = await User.findOne({
        where: { id },
      });
      ctx.render('users/show', { user });
    });
  // .get('userUpdate', '/users/:id/edit', async (ctx) => {})
  // .patch('userUpdate', '/users/:id', async (ctx) => {});
};
