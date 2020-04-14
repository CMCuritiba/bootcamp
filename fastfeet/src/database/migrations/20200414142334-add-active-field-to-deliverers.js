module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('deliverers', 'active', {
      type: Sequelize.BOOLEAN,
      default: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('deliverers', 'active');
  },
};
