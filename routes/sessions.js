import buildFormObj from '../lib/formObjectBuilder';
// import { encrypt } from '../lib/secure';
import { User } from '../models';

export default (router, { logger }) => {
  router
    .get('newSession', '/session/new', async (ctx) => {
      const data = {};
      ctx.render('sessions/new', { f: buildFormObj(data) });
    })
    .post('session', '/session', async (ctx) => {
      const { email, password } = ctx.request.body.form;
      logger(`Find user with e-mail= ${email}`);
      const user = await User.findOne({
        where: {
          email,
        },
      });
      if (user && user.passwordDigest === password) {
        ctx.session.userId = user.id;
        logger(`Create new session. User= ${user.id}`);
        ctx.redirect(router.url('root'));
        return;
      }

      ctx.flash.set('email or password were wrong');
      ctx.render('sessions/new', { f: buildFormObj({ email }) });
    })
    .delete('session', '/session', (ctx) => {
      logger(`Delete session user= ${ctx.session.userId}`);
      ctx.session = {};
      ctx.redirect(router.url('root'));
    });
};
