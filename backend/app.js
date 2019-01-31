const express = require('express');
const app = express();
const router = require("./api/router");
const headers = require("./api/middleware/headers");
const handler = require("./error").Handle;

app.use(headers);
app.use("/api", router);
app.use(() => { throw {status: 404} });
app.use(handler);

module.exports = app;