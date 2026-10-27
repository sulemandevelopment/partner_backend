module.exports = (sequelize, DataTypes) => {
  const Exercise = sequelize.define(
    "Exercise",
    {
      name: { type: DataTypes.STRING(120), allowNull: false },
      instructions: { type: DataTypes.TEXT, allowNull: true },
      intensity: {
        type: DataTypes.ENUM("gentle", "moderate", "intense"),
        allowNull: false,
        defaultValue: "moderate",
      },
      bodyArea: {
        type: DataTypes.ENUM("full_body", "lower_body", "upper_body", "core"),
        allowNull: false,
        defaultValue: "full_body",
      },
      equipment: {
        type: DataTypes.ENUM("none", "mat", "dumbbell", "band"),
        allowNull: false,
        defaultValue: "none",
      },
      loadsAreas: { type: DataTypes.JSON, allowNull: true },
      videoUrl: { type: DataTypes.STRING(500), allowNull: true },
      published: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      tableName: "Exercises",
      indexes: [{ fields: ["published"] }, { fields: ["intensity"] }],
    }
  );

  return Exercise;
};
