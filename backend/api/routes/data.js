const express = require("express");
const app = express();
const dose = require("../sequelize").dose;
const sugar = require("../sequelize").sugar;
const meal = require("../sequelize").meal;
const userInfo = require("../sequelize").userInfo;

app.post("/", async (req,res,next) => {
    let payload = {};
    payload["sugar"] = await sugar.findAll({where: {user_id: req.userId}});
    payload["meal"] = await meal.findAll({where: {user_id: req.userId}});
    payload["dose"] = await dose.findAll({where: {user_id: req.userId}});
    payload["userInfo"] = await userInfo.findAll({where: {user_id: req.userId}});
    res.json(payload);
})

app.get("/", async(req,res,next) => {
    var response = await sugar.findOne({
        where: {
            user_id: req.userId
        },
        order: [[ 'date', 'DESC' ]]
    })
    if(response)
        res.json(response)
    else
        res.sendStatus(200)
})

module.exports = app;