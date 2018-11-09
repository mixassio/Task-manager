export default (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Name can not be empty',
        },
      },
    },
    description: DataTypes.STRING,
  }, {
    scopes: {
      filterAssigned: id => ({
        where: {
          assignedToId: id,
        },
      }),
      filterTaskStatus: id => ({
        where: {
          taskStatusId: id,
        },
      }),
      filterCreator: id => ({
        where: {
          creatorId: id,
        },
      }),
    },
  });

  Task.associate = (models) => {
    Task.belongsTo(models.TaskStatus, { as: 'taskStatus', foreignKey: 'taskStatusId' });
    Task.belongsTo(models.User, { as: 'creator', foreignKey: 'creatorId' });
    Task.belongsTo(models.User, { as: 'assignedTo', foreignKey: 'assignedToId' });
    Task.belongsToMany(models.Tag, { through: 'TaskTags', foreignKey: 'taskId', otherKey: 'tagId' });
    Task.addScope('full', {
      include: ['taskStatus', 'creator', 'assignedTo', 'Tags'],
    });
  };

  return Task;
};
