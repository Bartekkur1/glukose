const express = require("express");
const app = express();
const sugar = require("../sequelize").sugar;

app.get("/:date", (req,res,next) => {
    var dFrom = new Date(req.params.date + " 01:00:00");
    var dTo = new Date(req.params.date + " 23:59:59");
    dTo.setTime(dTo.getTime() + dTo.getTimezoneOffset() * -1 * 60 * 1000);
    req.check("date")
        .notEmpty().withMessage("Data nie może być pusta");
    let errors = req.validationErrors();
    if(errors)
        return next({status: 400, message: errors[0].msg});
    sugar.findAndCountAll({
        order: [["date", "ASC"]],
        attributes: ['id', 'amount', 'date'],
        where: { 
            user_id: req.userId, 
            date: {
                $and: {
                    $gt: dFrom,
                    $lt: dTo
                }
            }
        }
    }).then(response => res.json(response));
});

app.delete("/", async(req,res,next) => {
    req.check("id")
        .notEmpty().withMessage("id nie może być puste")
        .isDecimal().withMessage("id musi być liczbą");
    let errors = req.validationErrors();
    if(errors)
        return next({status: 400, message: errors[0].msg});
    let sugarExist = await sugar.findOne({where: {id: req.params.id}});
    if(sugarExist)
        sugarExist.destroy().then(() => res.sendStatus(200));
    else 
        return next({status: 400, message: "Cukier nie istnieje"});
});

app.post("/", (req,res,next) => {
    req.check("amount")
        .notEmpty().withMessage('Ilość cukru nie może być pusta')
        .isDecimal().withMessage('Ilość musi być liczbą')
        .isInt({min: 0}).withMessage("Ilość nie może być mniejsza niż 0 ");
        let errors = req.validationErrors();
    if(errors)
        return next({status: 400, message: errors[0].msg});
    if(!req.body.date) {
        var d = new Date();
        d.setTime(d.getTime() + d.getTimezoneOffset() * -1 * 60 * 1000);
        req.body.date = d.toString();
    }
    sugar.create({
        "amount": req.body.amount,
        "user_id": req.userId,
        "date": req.body.date
    }).then(success => res.sendStatus(200));
});

app.patch("/", async (req,res,next) => {
    req.check("amount")
        .notEmpty().withMessage('Ilość nie może być pusta')
        .isDecimal().withMessage('Ilość cukru musi być liczbą')
        .isInt({min: 0}).withMessage("Ilość nie może być mniejsza niż 0");
    req.check("id")
        .notEmpty().withMessage('Id nie może być puste');
    let errors = req.validationErrors();
    if(errors)
        return next({status: 400, message: errors[0].msg});
    let foundSugar = await sugar.findOne({where: {id: req.body.id}});
    if(!foundSugar)
        return next({status: 400, message: "Podany rekord nie istnieje"});
    foundSugar.update({
        "amount": req.body.amount
    }).then((success) => {
        success ? res.sendStatus(200) : res.sendStatus(400);        
    });
});

module.exports = app;