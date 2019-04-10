const Sequelize = require('sequelize');
const config = require("../config.json").development;
const UserModel = require("../database/models/user");
const UserInfoModel = require("../database/models/userinfo");
const SugarModel = require("../database/models/sugar");
const DoseModel = require("../database/models/dose");
const MealModel = require("../database/models/meal");

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});

const user = UserModel(sequelize, Sequelize);
const userInfo = UserInfoModel(sequelize, Sequelize);
const sugar = SugarModel(sequelize, Sequelize);
const dose = DoseModel(sequelize, Sequelize);
const meal = MealModel(sequelize, Sequelize);
userInfo.belongsTo(user, { foreignKey:  "user_id" });
sugar.belongsTo(user, { foreignKey:  "user_id" });
dose.belongsTo(user, { foreignKey:  "user_id" });
meal.belongsTo(user, { foreignKey:  "user_id" });

module.exports = {
    user, userInfo, sugar, dose, meal, sequelize,
    connectionCheck:function(req,res,next) {
        sequelize.authenticate()
        .then(() => {
            next();
        })
        .catch(error => {
            if(error.original.code == "ECONNREFUSED")
                next({status: 500, message: "Serwer baz danych jest wyłączony"});
        });
    },
};