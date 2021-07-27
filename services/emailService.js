const nodemailer = require('nodemailer');

let privateConfig;
if(process.env.store !== 'heroku'){
  try{
    privateConfig = require('../config/privateConfig');
  }catch{
    console.log("privateConfig doesnt exist");
  }
}

exports.sendEmail = function (details) {
   console.log("mail service:   "+details)
  try{
    var transporter = nodemailer.createTransport({
      service: 'outlook',
      auth: {
        user: process.env.emailUser || privateConfig.emailUser,
        pass: process.env.emailPass || privateConfig.emailPass
      },
      tls: {
        rejectUnauthorized: false
      }
    }); //TODO create one transport instanc for all app?

    var mailOptions = {
      from: 'mendibass@outlook.com',
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
  }catch (e){
    console.log(e);
  }
}
