module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('deliveries', 'recipient_id', {
      type: Sequelize.INTEGER,
      references: { model: 'recipients', key: 'id' },
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
    queryInterface.addColumn('deliveries', 'deliverer_id', {
      type: Sequelize.INTEGER,
      references: { model: 'deliverers', key: 'id' },
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
    return queryInterface.addColumn('deliveries', 'signature_id', {
      type: Sequelize.INTEGER,
      references: { model: 'files', key: 'id' },
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: (queryInterface) => {
    queryInterface.removeColumn('deliveries', 'recipient_id');
    queryInterface.removeColumn('deliveries', 'deliverer_id');
    return queryInterface.removeColumn('deliveries', 'signature_id');
  },
};
