module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('deliveries', 'signature_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('deliveries', 'signature_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
