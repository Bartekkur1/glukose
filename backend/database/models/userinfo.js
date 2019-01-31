'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserInfo = sequelize.define('UserInfo', {
    user_id: {
      type: DataTypes.INTEGER,
      rerfences: {
        model: "users",
        key: "id"
      }
    },
    age: {
      type: DataTypes.INTEGER
    },
    gender: {
      type: DataTypes.STRING
    },
    height: {
      type: DataTypes.INTEGER
    },
    weight: {
      type:   DataTypes.INTEGER
    },
    insulinType: {
      type: DataTypes.STRING
    },
    dailyInsulinType: {
      type: DataTypes.STRING
    },
    dailyInsulinAmount: {
      type: DataTypes.INTEGER
    }
  }, {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
    paranoid: false,
  });
  UserInfo.associate = function(models) {
    // associations can be defined here
  };
  return UserInfo;
};