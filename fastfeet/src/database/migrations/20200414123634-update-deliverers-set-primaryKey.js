module.exports = {
  up: (queryInterface) => {
    return queryInterface.addConstraint('deliverers', ['id'], {
      type: 'primary key',
      name: 'deliverers_pkey',
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeConstraint('deliverers', 'deliverers_pkey');
  },
};
