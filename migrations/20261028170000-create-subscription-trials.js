"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SubscriptionTrials", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: Sequelize.INTEGER, allowNull: false, unique: true },
      startedAt: { type: Sequelize.DATE, allowNull: false },
      endsAt: { type: Sequelize.DATE, allowNull: false },
      status: {
        type: Sequelize.ENUM("active", "ended", "continued"),
        allowNull: false,
        defaultValue: "active",
      },
      reminderSentAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("SubscriptionTrials");
  },
};
