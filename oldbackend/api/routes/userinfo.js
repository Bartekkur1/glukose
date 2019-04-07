const express = require("express");
const app = express();
const userInfo = require("../sequelize").userInfo;

app.post("/", (req,res,next) => {
    userInfo.destroy({where: {user_id: req.userId}});
    req.body.user_id = req.userId;
    userInfo.create(req.body);
    res.sendStatus(200);
});

app.get("/", (req,res,next) => {
    userInfo.findOne({where: {user_id: req.userId}})
        .then((foundInfo) => {
            res.json(foundInfo);
        });
});

module.exports = app;