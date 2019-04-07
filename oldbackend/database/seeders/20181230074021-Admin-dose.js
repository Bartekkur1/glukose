'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Doses', [{
      user_id: 1,
      amount: 4,
      date: "2018-12-05 7:15:00",
      type: "Humalog"
    }, {
      user_id: 1,
      amount: 5,
      date: "2018-12-05 11:10:00",
      type: "Humalog"
    }, {
      user_id: 1,
      amount: 7,
      date: "2018-12-05 14:15:00",
      type: "Humalog"
    }, {
      user_id: 1,
      amount: 12,
      date: "2018-12-05 17:17:00",
      type: "Humalog"
    }, {
      user_id: 1,
      amount: 3,
      date: "2018-12-05 20:21:00",
      type: "Humalog"
    }], {});
},

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Doses', null, {});
  }
};
