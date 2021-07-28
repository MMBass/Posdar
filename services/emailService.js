const nodemailer = require('nodemailer');
const dev_config = (process.env.store) ? undefined : require('../config/devConfig');

const transporter = nodemailer.createTransport({
  service: 'Zoho',
  auth: {
    user: process.env.emailUser || dev_config.emailUser,
    pass: process.env.emailPass || dev_config.emailPass
  },
  tls: {
    rejectUnauthorized: false
  }
}); //TODO track if one instance is good;

exports.sendEmail = async function (details) {
    const mailOptions = {
      from: process.env.emailUser || dev_config.emailUser,
      to: details.email,
      subject: details.subject,
      text: details.text
    };
    await transporter.sendMail(mailOptions);
}
