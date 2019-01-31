const express = require("express");
const app = express();
const user = require("../sequelize").user;
const passwordHash = require('password-hash');
const jwt = require("jsonwebtoken");
const jwtsign = require("../../config.json").jwtsign;
const crypto = require('crypto');

app.post("/", (req,res,next) => {
    req.check("login", "Login nie może być pusty").notEmpty();
    req.check("password", "Hasło nie może być puste").notEmpty();
    let errors = req.validationErrors();
    if(errors)
        throw {status: 400, message: errors[0].msg}
    user.findOne({
        attributes: [ 'id', 'login', 'password' ],
        where: { login: req.body.login }
    }).then((foundUser) => {
        if(foundUser && passwordHash.verify(req.body.password, foundUser.password)) {
            jwt.sign({userId: foundUser.id}, jwtsign, {expiresIn: 60 * 30 }, (err, token) => {
                res.json({ token });
            });
        } else
            next({status: 400, message: "Zły login lub hasło"});
    });
});

app.post("/check", (req,res,next) => {
    req.check("authorization", "").notEmpty();
    let error = req.validationErrors();
    if(error) throw {status: 401}
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, jwtsign, (err, authData) => {
        if(err) throw {status: 401}
        user.findOne({
            where: { id: authData.userId}
        }).then((foundUser) => {
            res.json({
                id: foundUser.id,
                login: foundUser.login,
                email: foundUser.email,
                avatarUrl: `https://www.gravatar.com/avatar/${crypto.createHash('md5').update(foundUser.email).digest("hex")}`,
                isAdmin: foundUser.isAdmin                
            });
        });
    });
});

module.exports = app;