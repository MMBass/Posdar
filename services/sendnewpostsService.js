const emailService = require('./emailService');
const config = require('../config/config');

exports.sendToEmail = function(postText, email, group){
  let subject = "We found new post for you from group "+group;
  emailService.sendEmail({
      subject,
      text: postText + `Link to group: `+ config.fbLink(group),
      email  
    });
}