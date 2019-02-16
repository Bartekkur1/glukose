'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('meals', [{
        user_id: 1,
        kcal: 500,
        fats: 30,
        carbohydrates: 70,
        date: "2018-12-05 07:00:00"
      }, {
        user_id: 1,
        kcal: 600,
        fats: 50,
        carbohydrates: 50,
        date: "2018-12-05 14:10:00"
      }, {
        user_id: 1,
        kcal: 430,
        fats: 70,
        carbohydrates: 30,
        date: "2018-12-05 17:13:00"
      },{
        user_id: 1,
        kcal: 350,
        fats: 70,
        carbohydrates: 30,
        date: "2018-12-05 20:13:00"
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('meals', null, {});
  }
};
