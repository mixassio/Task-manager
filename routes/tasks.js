import buildFormObj from '../lib/formObjectBuilder';
import { Task, TaskStatus } from '../models';

export default (router, { logger }) => {
  router
    .get('tasks', '/tasks', async (ctx) => {
      const tasks = await Task.findAll();
      const { userId } = ctx.session;
      logger('userLoginID', userId);
      ctx.render('tasks', { tasks, userId });
    })
    .post('tasks', '/tasks', async (ctx) => {
      const { form } = ctx.request.body;
      form.creatorId = ctx.session.userId;
      logger('get from form1', form);
      const status = await TaskStatus.findOne({ where: { name: 'new' } });
      form.taskStatusId = status.id;
      logger('get from form2', form);
      const task = await Task.build(form);
      logger(task);
      try {
        await task.save();
        ctx.flash.set('Task has been created');
        ctx.redirect(router.url('tasks'));
      } catch (e) {
        ctx.render('tasks/new', { f: buildFormObj(task, e) });
      }
    })
    .patch('taskUpdate', '/tasks/:id/edit', async (ctx) => {
      const { form } = ctx.request.body;
      const { id } = ctx.params;
      const task = await Task.findOne({ where: { id } });
      logger('update task:', task.name);
      try {
        await task.update(form);
        ctx.flash.set('Task has been updated');
        ctx.redirect(router.url('tasks'));
      } catch (e) {
        ctx.render('tasks/edit', { task, f: buildFormObj(task, e) });
      }
    })
    .get('newTask', '/tasks/new', (ctx) => {
      const task = Task.build();
      ctx.render('tasks/new', { f: buildFormObj(task) });
    })
    .delete('taskDelete', '/tasks/:id', async (ctx) => {
      logger(ctx.params);
      const { id } = ctx.params;
      const task = await Task.findOne({ where: { id } });
      await Task.destroy({ where: { id } });
      logger('deleting user', task.id);
      ctx.redirect(router.url('tasks'));
      ctx.flash.set('Task has been deleted');
    })
    .get('taskShow', '/tasks/:id', async (ctx) => {
      logger(ctx.params);
      const { id } = ctx.params;
      const task = await Task.findOne({ where: { id } });
      ctx.render('tasks/show', { task });
    })
    .get('taskUpdate', '/tasks/:id/edit', async (ctx) => {
      const { id } = ctx.params;
      const task = await Task.findOne({ where: { id } });
      ctx.render('tasks/edit', { task, f: buildFormObj(task) });
    });
};
