var nodemailer = require('nodemailer');
let auth = {
    user: "infodev321@gmail.com",
    pass: "System@321",


}


var transporterAdmin = nodemailer.createTransport({
    // service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465, // 587 or 25 or 2525
    secure: true,
    auth: auth
});

var transporterInfo = nodemailer.createTransport({
    // service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465, // 587 or 25 or 2525 
    secure: true,
    auth: auth
});

const Helper = {

    sendEmail(email, subject, msg_body) {
        // email sending
        var mailOptions = {
            from: 'infodev321@gmail.com',
            to: email,
            subject: subject,
            html: msg_body
        };
        transporterAdmin.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    },



}

module.exports = Helper;