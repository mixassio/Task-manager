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
  });

  Task.associate = (models) => {
    models.Task.belongsTo(models.User, {
      as: 'creator',
      foreignKey: {
        allowNull: false,
      },
    });
    models.Task.belongsTo(models.User, { as: 'assignedTo' });
    models.Task.belongsTo(models.TaskStatus, {
      as: 'status',
      foreignKey: {
        allowNull: false,
      },
    });
    models.Task.belongsToMany(
      models.Tag,
      { through: 'TaskTags', foreignKey: 'taskId', otherKey: 'tagId' },
    );
  };

  return Task;
};
