'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Doses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references : {
          model : "users",
          key   : "id",
        }
      },
      amount: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('doses');
  }
};