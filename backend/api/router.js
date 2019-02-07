const express = require("express");
const router = express.Router();
const registerApi = require("./routes/register");
const userInfoApi = require("./routes/userinfo");
const authApi = require("./routes/auth");
const sugarApi = require("./routes/sugar");
const doseApi = require("./routes/dose");
const mealApi = require("./routes/meal");
const userApi = require("./routes/user");
const resetpasswordApi = require("./routes/resetpassword");
const jwtcheck = require("./middleware/jwtcheck").jwtcheck;
const connectionCheck = require("./sequelize").connectionCheck;
const expressValidator = require("express-validator");

router.use(expressValidator());
router.use(connectionCheck);
router.use("/auth", authApi);
router.use("/register", registerApi);
router.use("/resetpassword", resetpasswordApi);
router.use(jwtcheck);
router.use("/userinfo", userInfoApi);
router.use("/user", userApi);
router.use("/sugar", sugarApi);
router.use("/dose", doseApi);
router.use("/meal", mealApi);

module.exports = router;