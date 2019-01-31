'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    login: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
  }, {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
    paranoid: false,
  })
  User.associate = function(models) {

  };
  return User;
};