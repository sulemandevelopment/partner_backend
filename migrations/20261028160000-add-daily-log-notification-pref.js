'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('NotificationPreferences', 'dailyLog', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('NotificationPreferences', 'dailyLog');
  },
};
