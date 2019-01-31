const express = require("express");
const app = express();
const meal = require("../sequelize").meal;

// TODO : filter somehow
app.get("/", (req,res,next) => {
    req.check("offset")
        .notEmpty().withMessage("Offset nie może pusty")
        .isDecimal().withMessage("Offset musi być liczbą");
    req.check("limit")
        .notEmpty().withMessage("Limit nie może pusty")
        .isDecimal().withMessage("Limit musi być liczbą");
    let errors = req.validationErrors();
    if(errors)
        return next({status: 400, message: errors[0].msg});
    meal.findAndCountAll({
        order: [["date", "DESC"]],
        attributes: ['id', 'kcal', 'fats', 'carbohydrates', 'date'],
        offset: parseInt(req.query.offset),
        limit: parseInt(req.query.limit),
        where: { user_id: req.userId }
    }).then(found => res.json(found));
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
    if(!req.body.date)
        req.body.date = new Date();
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