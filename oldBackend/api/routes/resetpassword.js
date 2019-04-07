const express = require("express");
const passwordHash = require('password-hash');
const app = express();
const user = require("../sequelize").user;
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendMail = require("../mailer").sendEmail;
const config = require("../../config");
const dose = require("../sequelize").dose;

app.get("/", async(req,res,next) => {
    
})

app.post("/", async (req,res,next) => {
    req.check("email")
        .notEmpty().withMessage("Email nie może być pusty")
        .isEmail().withMessage("Podany email nie jest poprawny");
    let errors = req.validationErrors();
    if(errors)
        return next({status: 400, message: errors[0].msg});
    let userFound = await user.findOne({where: {email: req.body.email}});
    if(!userFound)
        return next({status: 400, message: "Użytkownik nie istnieje"});
    let data = { id: userFound.id };
    let token = await jwt.sign({data}, config.jwtsign);
    try {
        let kek = await sendMail({
            from: "Glukose", 
            to: userFound.email, 
            subject: "Nowe hasło do glukose", 
            text: config.email_header,
            html: "Link do zmiany hasła : http://" + req.headers.host + "/nowe_haslo/" + token
        });
        res.sendStatus(200);
    }
    catch(e) {
        if(e.responseCode == 535)
            return next({status: 500, message: "Serwer mailowy jest niedostępny"});
    }
});

module.exports = app;