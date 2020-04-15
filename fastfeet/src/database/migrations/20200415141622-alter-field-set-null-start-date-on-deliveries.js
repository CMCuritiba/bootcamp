module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('deliveries', 'start_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('deliveries', 'start_date', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
};
