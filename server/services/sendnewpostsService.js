const emailService = require('./emailService');

exports.sendToEmail = function(postText, email, group){
  let subject = "We found new post for you from group "+group;
  console.log(email);
  emailService.sendEmail({
      subject,
      text: postText,
      email  
    });
}