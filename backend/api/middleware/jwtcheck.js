const jwt = require("jsonwebtoken");
const user = require("../sequelize").user;
const jwtsign = require("../../config.json").jwtsign;

module.exports = {
    jwtcheck:function(req,res,next) {
        req.check("authorization", "").notEmpty();
        let error = req.validationErrors();
        if(error) throw {status: 401}
        const token = req.headers['authorization'].split(' ')[1];
        jwt.verify(token, jwtsign, (err, authData) => {
            if(err) throw {status: 401}
            user.findOne({
                where: { id: authData.userId }
            }).then(foundUser => {
                if(foundUser && foundUser.id == authData.userId) {
                    req.userId = foundUser.id;
                    next();
                } 
                else
                    next({status: 401});
            })
        });
    }
}