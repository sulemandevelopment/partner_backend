"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Exercises", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(120), allowNull: false },
      instructions: { type: Sequelize.TEXT, allowNull: true },
      intensity: {
        type: Sequelize.ENUM("gentle", "moderate", "intense"),
        allowNull: false,
        defaultValue: "moderate",
      },
      bodyArea: {
        type: Sequelize.ENUM("full_body", "lower_body", "upper_body", "core"),
        allowNull: false,
        defaultValue: "full_body",
      },
      equipment: {
        type: Sequelize.ENUM("none", "mat", "dumbbell", "band"),
        allowNull: false,
        defaultValue: "none",
      },
      loadsAreas: { type: Sequelize.JSON, allowNull: true },
      videoUrl: { type: Sequelize.STRING(500), allowNull: true },
      published: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.createTable("ExerciseCompletions", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: Sequelize.INTEGER, allowNull: false },
      exerciseId: { type: Sequelize.INTEGER, allowNull: false },
      date: { type: Sequelize.STRING(10), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex("ExerciseCompletions", ["userId", "exerciseId", "date"], {
      unique: true,
      name: "exercise_completions_user_exercise_date",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ExerciseCompletions");
    await queryInterface.dropTable("Exercises");
  },
};
