'use strict';
module.exports = (sequelize, DataTypes) => {
  const doses = sequelize.define('dose', {
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
    type: {
      type: DataTypes.STRING
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
  doses.associate = function(models) {
    // associations can be defined here
  };
  return doses;
};