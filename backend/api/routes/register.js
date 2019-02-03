const express = require("express");
const passwordHash = require('password-hash');
const app = express();
const user = require("../sequelize").user;

app.post("/", async (req,res,next) => {
    req.check("login")
        .notEmpty().withMessage('Login nie może być pusty')
        .isLength({ min: 5 }).withMessage('Login musi posiadać przynajmniej 5 znaków')
        .isLength({ max: 32 }).withMessage('Login jest za długi')
    req.check("email")
        .notEmpty().withMessage('Email nie może być pusty')
        .isEmail().withMessage('Podany email jest błędny')
    req.check("password")
        .notEmpty().withMessage('Hasło nie może być puste')
        .isLength({ min: 8 }).withMessage('Hasło musi posiadać przynajmniej 8 znaków')
        .equals(req.body.confirmPassword).withMessage("Hasła muszą być identyczne");
    req.check("approved")
        .equals("true").withMessage("Proszę zapoznać i zakceptować regulamin");
    let errors = req.validationErrors();
    if(errors)
        return next({status: 400, message: errors[0].msg});
    let loginCheck = await user.findOne({where: {login: req.body.login}});
    if(loginCheck)
        return next({status: 400, message: "Podany login jest już zajęty"});
    let emailCheck = await user.findOne({where: {email: req.body.email}});
    if(emailCheck)
        return next({status: 400, message: "Podany email jest już zajęty"});
    let success = await user.create({
        "login": req.body.login,
        "password": passwordHash.generate(req.body.password),
        "email": req.body.email
    });
    if(success)
        res.sendStatus(200);
});

module.exports = app;