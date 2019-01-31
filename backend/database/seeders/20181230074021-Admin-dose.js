'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Doses', [{
      user_id: 1,
      amount: 4,
      date: "2018-12-05 00:00:00",
      type: "Humalog"
    }, {
      user_id: 1,
      amount: 5,
      date: "2018-12-05 00:10:00",
      type: "Humalog"
    }, {
      user_id: 1,
      amount: 7,
      date: "2018-12-05 00:15:00",
      type: "Humalog"
    }, {
      user_id: 1,
      amount: 12,
      date: "2018-12-05 00:17:00",
      type: "Humalog"
    }, {
      user_id: 1,
      amount: 11,
      date: "2018-12-05 00:21:00",
      type: "Humalog"
    }], {});
},

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Doses', null, {});
  }
};
