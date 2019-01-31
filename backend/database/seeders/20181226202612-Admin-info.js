'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
      queryInterface.dropAllTables();
      return queryInterface.bulkInsert('Userinfos', [{
        user_id: 1,
        age: 19,
        gender: "Mężczyzna",
        height: 190,
        weight: 80,
        insulinType: "Humalog",
        dailyInsulinType: "Lantus",
        dailyInsulinAmount: 24,
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('UserInfos', null, { truncate: true });
  }
};
