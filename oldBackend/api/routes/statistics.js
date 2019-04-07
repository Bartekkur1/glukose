const express = require("express");
const app = express();
const sugar = require("../sequelize").sugar;
const meal = require("../sequelize").meal;
const dose = require("../sequelize").dose;
const sequelize = require("../sequelize").sequelize;

async function getDbAvg(sequelize, name, t1, t2, model, valName, user_id) {
    var ans = await sequelize.query(
        "SELECT AVG(`"+valName+"`) as 'avg' FROM `" +name+ "` WHERE DATE_FORMAT(`date`, '%k') >= " + t1 + " AND DATE_FORMAT(`date`, '%k') < " + t2 + " AND `user_id` = " + user_id,
        { model: model });
    if(ans[0].dataValues.avg)
        return {y: Math.round(ans[0].dataValues.avg), x: i * 3600000};
    else
        return {y: 0, x: i * 3600000};
}

app.get("/", async (req,res,next) => {
    let avg = {
        sugars: [],
        meals: [],
        doses: [],
    }
    let ans = null;
    for(i = 0; i <= 23; i++) {
        var j = i + 1;
        avg["sugars"].push(await getDbAvg(sequelize, "sugars", i, j, sugar, "amount", req.userId));
    }
    for(i = 0; i <= 23; i++) {
        var j = i + 1;
        avg["meals"].push(await getDbAvg(sequelize, "meals", i, j, meal, "kcal", req.userId));
    }
    for(i = 0; i <= 23; i++) {
        var j = i + 1;
        avg["doses"].push(await getDbAvg(sequelize, "doses", i, j, dose, "amount", req.userId));
    }
    res.json(avg);
}); 

module.exports = app;