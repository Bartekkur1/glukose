'use strict';
module.exports = (sequelize, DataTypes) => {
  const sugars = sequelize.define('sugars', {
    user_id: {
      type: DataTypes.INTEGER,
      references : {
        model : "users",
        key   : "id",
      }
    },
    amount: {
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
  sugars.associate = function(models) {

  };
  return sugars;
};