const g = require('../common/global');
const secret = require('./secret');
const nodemailer = require('nodemailer');
let email, password, mailTransporter;
function sendEmailP(mailTransporter, mailDetails) {
    return new Promise(function(resolve, reject) {
        mailTransporter.sendMail(mailDetails, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
}
async function sendEmail(to, subject, body) {
    try {
        if (email == null) {
            email = await secret.getSecret(g.EMAIL_SECRET_NAME);
        }

        if (password == null) {
            password = await secret.getSecret(g.EMAIL_SECRET_PASSWORD);
        }

        if (mailTransporter == null) {
            mailTransporter = nodemailer.createTransport({ 
                service: 'gmail', 
                auth: { 
                    user: email, 
                    pass: password
                } 
            });
        }

        let mailDetails = { 
            from: email,
            to: to, 
            subject: subject, 
            text: body
        };

        let data = await sendEmailP(mailTransporter, mailDetails)
        console.log(data);
    } catch(err) {
        console.log(err.message);
    }
}

module.exports = {
    sendEmail: sendEmail
}