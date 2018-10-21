
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', [{ // eslint-disable-line no-unused-vars
    firstName: 'John',
    lastName: 'Doe',
    email: 'demo@demo.com',
    passwordDigest: '3cadb7fcc5c2c9370de3f8ca7c5ea37110cb7a6d791a241c262ffe72e109a7eb',
    createdAt: new Date(),
    updatedAt: new Date(),
  }], {}),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {}), // eslint-disable-line no-unused-vars
};
