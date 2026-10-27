module.exports = (sequelize, DataTypes) => {
  const ExerciseCompletion = sequelize.define(
    "ExerciseCompletion",
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      exerciseId: { type: DataTypes.INTEGER, allowNull: false },
      date: { type: DataTypes.STRING(10), allowNull: false },
    },
    {
      tableName: "ExerciseCompletions",
      indexes: [{ unique: true, fields: ["userId", "exerciseId", "date"] }],
    }
  );

  ExerciseCompletion.associate = (models) => {
    ExerciseCompletion.belongsTo(models.User, { foreignKey: "userId" });
    ExerciseCompletion.belongsTo(models.Exercise, { foreignKey: "exerciseId" });
  };

  return ExerciseCompletion;
};
