const express = require("express");
const app = express();
const bodyParser = require('body-parser');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, authorization, Origin, X-Requested-With, Content-Type, Accept");

    if ('OPTIONS' === req.method) {
        res.sendStatus(200);
    }
    else
        next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

module.exports = app;