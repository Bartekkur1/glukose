const smtpTransport = require('nodemailer-smtp-transport');
const nodemailer = require('nodemailer');
const config = require("../config");

module.exports = {
    sendEmail:async function(mailOptions) {
        let transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: config.email_login,
                pass: config.email_password
            }
        }));
        return await transporter.sendMail(mailOptions);
    }
}