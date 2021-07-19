const nodemailer = require('nodemailer');
const privateConfig = require('../config/privateConfig');

exports.sendEmail = function (details) {
  console.log(details)
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: privateConfig.emailUser,
      pass: privateConfig.emailPass
    }
  });

  var mailOptions = {
    from: '0777816627a@gmail.com',
    to: details.email,
    subject: details.subject,
    text: details.text
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}
