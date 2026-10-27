"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("DailyCheckins");
    const add = async (name, spec) => {
      if (!table[name]) await queryInterface.addColumn("DailyCheckins", name, spec);
    };
    await add("digestionLevel", { type: Sequelize.INTEGER, allowNull: true });
    await add("supplementLog", { type: Sequelize.STRING(255), allowNull: true });
    await add("skinStatus", { type: Sequelize.STRING(32), allowNull: true });
    await add("hairStatus", { type: Sequelize.STRING(32), allowNull: true });
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable("DailyCheckins");
    for (const name of ["digestionLevel", "supplementLog", "skinStatus", "hairStatus"]) {
      if (table[name]) await queryInterface.removeColumn("DailyCheckins", name);
    }
  },
};
