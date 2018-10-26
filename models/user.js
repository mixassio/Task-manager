import { encrypt } from '../lib/secure';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'First name can not be empty',
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Last name can not be empty',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        msg: 'Email already exist',
      },
      validate: {
        isEmail: {
          msg: 'Email is wrong',
        },
      },
    },
    passwordDigest: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.VIRTUAL,
      set: function set(value) {
        this.setDataValue('passwordDigest', encrypt(value));
        this.setDataValue('password', value);
        return value;
      },
      validate: {
        len: [1, +Infinity],
      },
    },
  }, {
    getterMethods: {
      fullName() {
        // console.log('hello', `${this.firstName} ${this.lastName} ${this.email}`);
        return `${this.firstName} ${this.lastName} / ${this.email}`;
      },
      // associate(models) {
      // associations can be defined here
      // },
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Task, {
      as: 'tasks',
      foreignKey: {
        name: 'assignee_id',
        allowNull: false,
      },
    });
  };
  return User;
};
