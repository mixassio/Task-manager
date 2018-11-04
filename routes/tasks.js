import _ from 'lodash';
import buildFormObj from '../lib/formObjectBuilder';
import { Task, TaskStatus, Tag } from '../models';

const getTagsByNames = tagsNames => Promise.all(tagsNames
  .map(name => Tag.findOne({ where: { name } })))
  .then((results) => {
    const foundTags = results.filter(v => v);
    const foundTagsNames = foundTags.map(tag => tag.name);
    return Promise.all(_.difference(tagsNames, foundTagsNames)
      .map(name => Tag.build({ name }).save()))
      .then(createdTags => [...foundTags, ...createdTags]);
  });


export default (router, { logger }) => {
  router
    .get('tasks', '/tasks', async (ctx) => {
      const tasks = await Task.findAll({ include: ['taskStatus', 'creator', 'assignedTo'] });
      const { userId } = ctx.session;
      logger('userLoginID', userId);
      ctx.render('tasks', { tasks, userId });
    })
    .post('tasks', '/tasks', async (ctx) => {
      const { form } = ctx.request.body;
      form.creatorId = ctx.session.userId;
      form.assignedToId = ctx.session.userId;
      logger('get from form1', form);
      const status = await TaskStatus.findOne({ where: { name: 'new' } });
      form.taskStatusId = status.id;
      logger('get from form2->', form);
      const { tagsName } = form;
      const tags = await getTagsByNames(tagsName.split(',').map(v => v.trim()).filter(v => v));
      const task = await Task.build(form);
      try {
        await task.save();
        logger('task is saved');
        await task.addTags(tags);
        logger('tags is added');
        ctx.flash.set('Task has been created');
        ctx.redirect(router.url('tasks'));
      } catch (e) {
        logger(e);
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
      if (!ctx.session.userId) {
        ctx.flash.set('Only reg user can create tasks');
        ctx.redirect(router.url('newSession'));
      }
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
      const task = await Task.findOne({ where: { id }, include: ['taskStatus', 'creator', 'assignedTo', 'Tags'] });
      // logger('task was fineded:', task);
      ctx.render('tasks/show', { task });
    })
    .get('taskUpdate', '/tasks/:id/edit', async (ctx) => {
      const { id } = ctx.params;
      const task = await Task.findOne({ where: { id } });
      ctx.render('tasks/edit', { task, f: buildFormObj(task) });
    });
};
