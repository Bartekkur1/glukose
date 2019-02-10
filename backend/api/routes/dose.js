const express = require("express");
const app = express();
const dose = require("../sequelize").dose;

// TODO : filter somehow
app.get("/", (req,res,next) => {
    // req.check("offset")
    //     .notEmpty().withMessage("Offset nie może pusty")
    //     .isDecimal().withMessage("Offset musi być liczbą");
    // req.check("limit")
    //     .notEmpty().withMessage("Limit nie może pusty")
    //     .isDecimal().withMessage("Limit musi być liczbą");
    // let errors = req.validationErrors();
    // if(errors)
    //     return next({status: 400, message: errors[0].msg});
    dose.findAndCountAll({
        order: [["date", "DESC"]],
        attributes: [ 'id', 'amount', 'date' ],
        // offset: parseInt(req.query.offset),
        // limit: parseInt(req.query.limit),
        where: { user_id: req.userId }
    }).then(found => res.json(found));
});

app.delete("/:id", async (req,res,next) => {
    req.check("id")
        .notEmpty().withMessage('id nie może być puste')
        .isDecimal().withMessage('id musi być liczbą')
    let errors = req.validationErrors();
    if(errors)
        return next({status: 400, message: errors[0].msg});
    let doseExist = await dose.findOne({ where: {id: req.params.id }});
    if(doseExist)
        doseExist.destroy().then(() => res.sendStatus(200));
    else
        return next({status: 400, message: "Dawka nie istnieje"});
});

app.post("/", (req,res,next) => {
    req.check("amount")
        .notEmpty().withMessage('Ilość jednostek nie może być pusta')
        .isDecimal().withMessage('Ilość musi być liczbą')
        .isInt({min: 0}).withMessage("Ilość nie może być mniejsza niż 0 ");
    let errors = req.validationErrors();
    if(errors)
        return next({status: 400, message: errors[0].msg});
    if(!req.body.date)
        req.body.date = new Date();
    dose.create({
        "user_id": req.userId,
        "amount": req.body.amount,
        "type": req.body.type,
        "date": req.body.date
    }).then(success => res.sendStatus(200));
});

app.patch("/", async (req,res,next) => {
    req.check("amount")
        .notEmpty().withMessage('Ilość nie może być pusta')
        .isDecimal().withMessage('Ilość insuliny musi być liczbą')
        .isInt({min: 0}).withMessage("Ilość nie może być mniejsza niż 0");
    req.check("id")
        .notEmpty().withMessage('Id nie może być puste');
    let errors = req.validationErrors();
    if(errors)
        return next({status: 400, message: errors[0].msg});
    let founddose = await dose.findOne({where: {id: req.body.id}});
    if(!founddose)
        return next({status: 400, message: "Podany rekord nie istnieje"});
    founddose.update({
        "amount": req.body.amount
    }).then((success) => {
        success ? res.sendStatus(200) : res.sendStatus(400);        
    });
});

module.exports = app;