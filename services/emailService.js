const nodemailer = require('nodemailer');
const config = require('../config/config');
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
});

exports.sendEmail = async function (details) {
  try {
    const mailOptions = {
      from: process.env.emailUser || dev_config.emailUser,
      to: process.env.toEmail || dev_config.toEmail,
      subject: details.subject,
      html: details.template
    };
    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw new Error(err);
  }

}
