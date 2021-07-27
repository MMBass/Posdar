const emailService = require('./emailService');
const config = require('../config/config');

exports.sendToEmail = async function(postText, email, group){
  let subject = "We found new post for you from group "+group;
  await emailService.sendEmail({
      subject,
      text: postText + `Link to group: `+ config.fbLink(group),
      email  
  }).catch(e=> console.log(e));
}