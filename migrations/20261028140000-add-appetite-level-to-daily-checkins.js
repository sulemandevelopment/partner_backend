"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("DailyCheckins");
    if (!table.appetiteLevel) {
      await queryInterface.addColumn("DailyCheckins", "appetiteLevel", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable("DailyCheckins");
    if (table.appetiteLevel) {
      await queryInterface.removeColumn("DailyCheckins", "appetiteLevel");
    }
  },
};
