'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Sugars', [{
        user_id: 1,
        amount: 100,
        date: "2018-12-05 00:00:00"
      }, {
        user_id: 1,
        amount: 150,
        date: "2018-12-05 00:01:00"
      }, {
        user_id: 1,
        amount: 170,
        date: "2018-12-05 00:02:00"
      }, {
        user_id: 1,
        amount: 130,
        date: "2018-12-05 00:03:00"
      }, {
        user_id: 1,
        amount: 110,
        date: "2018-12-05 00:04:00"
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Sugars', null, {});
  }
};
