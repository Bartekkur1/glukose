'use strict';
module.exports = (sequelize, DataTypes) => {
  const meal = sequelize.define('meal', {
    user_id: {
      type: DataTypes.INTEGER,
      references : {
        model : "users",
        key   : "id",
      }
    },
    kcal: {
      type: DataTypes.INTEGER
    },
    fats: {
      type: DataTypes.INTEGER
    },
    carbohydrates: {
      type: DataTypes.INTEGER
    },
    date: {
      type: DataTypes.DATE
    }
  }, {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
    paranoid: false,
  });
  meal.associate = function(models) {
    // associations can be defined here
  };
  return meal;
};