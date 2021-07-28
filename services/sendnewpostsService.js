const emailService = require('./emailService');
const config = require('../config/config');
const tasksModel = require('../models/tasks');

exports.sendEmails = async function (newRelevant,task) {
  const subject = "Podar. New post in group " + task.group;
  const email = task.email;

  for (postText of newRelevant) {
    try {
      await emailService.sendEmail({
        subject,
        text: postText + `Link to group: ` + config.fbLink(task.group),
        email,
      });
      task.notifiedPosts.push(postText);
      await tasksModel.putOne(task._id, { notifiedPosts:task.notifiedPosts });
    } catch (e) {
      console.log(e);
    }
  };
 
}