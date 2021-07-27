const nodemailer = require('nodemailer');

let privateConfig;
if (process.env.store !== 'heroku') {
  try {
    privateConfig = require('../config/privateConfig');
  } catch {
    console.log("privateConfig doesnt exist");
  }
}

exports.sendEmail = async function (details) {
  try {
    var transporter = nodemailer.createTransport({
      service: 'zoho',
      auth: {
        user: process.env.emailUser || privateConfig.emailUser,
        pass: process.env.emailPass || privateConfig.emailPass
      },
      tls: {
        rejectUnauthorized: false
      }
    }); //TODO create one transport instanc for all app?

    var mailOptions = {
      from: 'mendibass@zohomail.com',
      to: details.email,
      subject: details.subject,
      text: details.text
    };
    
      await transporter.sendMail(mailOptions);
      // return "sent";
  } catch (e) {
      console.log(e);
      // return "send faild";
  }
}
