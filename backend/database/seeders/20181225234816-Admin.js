'use strict';
const passwordHash = require('password-hash');
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', [{
            login: 'Admin',
            password: passwordHash.generate('123'),
            email: 'Bartekkur1@gmail.com',
            isAdmin: true,
            token: "",
        }], {});
    },
    down: (queryInterface, Sequelize) => {
        queryInterface.bulkDelete('Users', null, { truncate: true });
    }
};
