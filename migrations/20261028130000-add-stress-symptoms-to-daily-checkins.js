'use strict';

/** 1NH1 / 1NH2 — stress + structured daily symptoms on DailyCheckins */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('DailyCheckins', 'stressLevel', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('DailyCheckins', 'stressCause', {
      type: Sequelize.STRING(32),
      allowNull: true,
    });
    await queryInterface.addColumn('DailyCheckins', 'symptomsJson', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('DailyCheckins', 'symptomsJson');
    await queryInterface.removeColumn('DailyCheckins', 'stressCause');
    await queryInterface.removeColumn('DailyCheckins', 'stressLevel');
  },
};
