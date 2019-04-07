'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Sugars', [{
        user_id: 1,
        amount: 120,
        date: "2018-12-05 07:00:00"
      }, {
        user_id: 1,
        amount: 150,
        date: "2018-12-05 11:01:00"
      }, {
        user_id: 1,
        amount: 170,
        date: "2018-12-05 14:02:00"
      }, {
        user_id: 1,
        amount: 210,
        date: "2018-12-05 17:03:00"
      }, {
        user_id: 1,
        amount: 110,
        date: "2018-12-05 20:04:00"
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Sugars', null, {});
  }
};
