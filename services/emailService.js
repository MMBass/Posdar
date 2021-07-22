const nodemailer = require('nodemailer');
if(process.env.store !== 'heroku'){
  try{
    const privateConfig = require('../config/privateConfig');
  }catch{
    console.log("privateConfig doesnt exist");
  }
}

exports.sendEmail = function (details) {
  try{
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.emailUser || privateConfig.emailUser,
        pass: process.env.emailPass || privateConfig.emailPass
      }
    }); //TODO create one transport instanc for all app?

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
  }catch (e){
    console.log(e);
  }
}
