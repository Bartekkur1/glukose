const express = require("express");
const passwordHash = require("password-hash");
const app = express();
const user = require("../sequelize").user;

app.patch("/", async (req,res,next) => {
    let data = {};
    if(req.body.email) {
        req.check("email")
            .isEmail().withMessage("Podany email nie jest poprawny")
        let emailCheck = await user.findOne({where: {email: req.body.email}});
        if(emailCheck && emailCheck.id != req.userId)
            return next({status: 400, message: "Podany email jest zajęty"});
        data["email"] = req.body.email;
    }
    if(req.body.password) {
        req.check("password")
            .len({min: "6"}).withMessage("Nowe hasło powinno posiadać przynajmniej 6 znaków")
        data["password"] = passwordHash.generate(req.body.password);
    }
    let errors = req.validationErrors();
    if(errors)
        return next({status: 400, message: errors[0].msg});
    let userFound = await user.findOne({where: {id: req.userId}});
    let success = await userFound.update(data);
    if(success)
        res.sendStatus(200);
});

module.exports = app;