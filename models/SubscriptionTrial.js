module.exports = (sequelize, DataTypes) => {
  const SubscriptionTrial = sequelize.define(
    "SubscriptionTrial",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endsAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("active", "ended", "continued"),
        allowNull: false,
        defaultValue: "active",
      },
      reminderSentAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { tableName: "SubscriptionTrials" }
  );

  SubscriptionTrial.associate = (models) => {
    SubscriptionTrial.belongsTo(models.User, { foreignKey: "userId" });
  };

  return SubscriptionTrial;
};
