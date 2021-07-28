const nodemailer = require('nodemailer');

let privateConfig;
if (process.env.store !== 'heroku') {
  try {
    privateConfig = require('../config/privateConfig');
  } catch {
    console.log("privateConfig doesnt exist");
  }
}

const transporter = nodemailer.createTransport({
  service: 'zoho',
  auth: {
    user: process.env.emailUser || privateConfig.emailUser,
    pass: process.env.emailPass || privateConfig.emailPass
  },
  tls: {
    rejectUnauthorized: false
  }
}); //TODO track if one instance is good;

exports.sendEmail = async function (details) {
  try {
    const mailOptions = {
      from: 'mendibass@zohomail.com',
      to: details.email,
      subject: details.subject,
      text: details.text
    };
    await transporter.sendMail(mailOptions);

  } catch (e) {
    console.log(e);
  }
}
