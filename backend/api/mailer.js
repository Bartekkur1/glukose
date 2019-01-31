const smtpTransport = require('nodemailer-smtp-transport');
const nodemailer = require('nodemailer');
const config = require("../config");

module.exports = {
    sendEmail:function(mailOptions) {
        let transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: config.email_login,
                pass: config.email_password
            }
        }));

        transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
                console.log(error);
                return next({status: 500, message: "Coś poszło nie tak"});
            } else {
                res.sendStatus(200);
            }
            console.log('Message sent: %s', info.messageId);
        });
    }
}