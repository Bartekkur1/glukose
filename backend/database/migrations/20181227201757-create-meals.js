'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('meals', {
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
      kcal: {
        type: Sequelize.INTEGER
      },
      fats: {
        type: Sequelize.INTEGER
      },
      carbohydrates: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('meals');
  }
};