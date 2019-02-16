const express = require("express");
const app = express();
const meal = require("../sequelize").meal;

app.get("/:date", (req,res,next) => {
    var dFrom = new Date(req.params.date + " 01:00:00");
    var dTo = new Date(req.params.date + " 23:59:59");
    dTo.setTime(dTo.getTime() + dTo.getTimezoneOffset() * -1 * 60 * 1000);
    req.check("date")
        .notEmpty().withMessage("Data nie może być pusta");
    let errors = req.validationErrors();
    if(errors)
        return next({status: 400, message: errors[0].msg});
    meal.findAndCountAll({
        order: [["date", "ASC"]],
        attributes: ['id', 'kcal', 'fats', 'carbohydrates', 'date'],
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
        .isDecimal().withMessage("id musi byc liczbą");
    let errors = req.validationErrors();
    if(errors)
        return next({status: 400, message: errors[0].msg});
    let mealExists = await meal.findOne({where: {id: req.params.id}});
    if(mealExists)
        mealExists.destroy().then(() => res.sendStatus(200));
    else
        return next({status: 400, message: "Cukier nie istnieje"});
});

app.post("/", (req,res,next) => {
    req.check("kcal")
        .notEmpty().withMessage("Ilość kalorii nie może być pusta")
        .isDecimal().withMessage("Ilość kalorii musi być liczbą")
        .isInt({min: 0}).withMessage("Ilość kalorii nie może być mniejsza niż 0");
    req.check("fats")
        .notEmpty().withMessage("Ilość tłuszczy nie może być pusta")
        .isDecimal().withMessage("Ilość tłuszczy musi być liczbą")
        .isInt({min: 0}).withMessage("Ilość tłuszczy nie może być mniejsza niż 0");
    req.check("carbohydrates")
        .notEmpty().withMessage("Ilość węglowodanów nie może być pusta")
        .isDecimal().withMessage("Ilość węglowodanów musi być liczbą")
        .isInt({min: 0}).withMessage("Ilość węglowodanów musi być liczbą");
    let errors = req.validationErrors();
    if(errors)
        return next({status: 400, message: errors[0].msg});
    if(!req.body.date) {
        var d = new Date();
        d.setTime(d.getTime() + d.getTimezoneOffset() * -1 * 60 * 1000);
        req.body.date = d.toString();
    }
    meal.create({
        "user_id": req.userId,
        "kcal": req.body.kcal,
        "fats": req.body.fats,
        "carbohydrates": req.body.carbohydrates,
        "date": req.body.date,
    }).then(success => res.sendStatus(200));
});

app.patch("/", async (req,res,next) => {
    req.check("kcal")
        .notEmpty().withMessage('Ilość kalorii nie może być pusta')
        .isDecimal().withMessage('Ilość kalorii musi być liczbą')
        .isInt({min: 0}).withMessage("Ilość kalorii nie może być mniejsza niż 0");
    req.check("fats")
        .notEmpty().withMessage('Ilość tłuszczy nie może być pusta')
        .isDecimal().withMessage('Ilość tłuszczy musi być liczbą')
        .isInt({min: 0}).withMessage("Ilość tłuszczy nie może być mniejsza niż 0");
    req.check("carbohydrates")
        .notEmpty().withMessage('Ilość węglowodanów nie może być pusta')
        .isDecimal().withMessage('Ilość węglowodanów musi być liczbą')
        .isInt({min: 0}).withMessage("Ilość węglowodanów musi być liczbą");
    req.check("id")
        .notEmpty().withMessage('Id nie może być puste');  
    let errors = req.validationErrors();
    if(errors)
        return next({status: 400, message: errors[0].msg});
    let foundMeal = await meal.findOne({where: { id: req.body.id }});
    if(!foundMeal)
        return next({status: 400, message: "Podany rekord nie istnieje"});
    foundMeal.update({
        "kcal": req.body.kcal,
        "fats": req.body.fats,
        "carbohydrates": req.body.carbohydrates
    }).then(success => res.sendStatus(200));
});

module.exports = app;