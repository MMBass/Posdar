const emailService = require('./emailService');
const config = require('../config/config');
const tasksModel = require('../models/tasks');

exports.sendEmails = async function (newRelevant,task) {
  const subject = "Posdar. New post in group " + task.group;
  const link = `Link to group: ` + config.fbLink(task.group);
  const email = task.email;

  for (postText of newRelevant) {
    try {
      await emailService.sendEmail({
        subject,
        template: `<div style="width:95%; text-align:center; background-color:antiquewhite; margin: 5px;">
                      <h3 style="background-color:aliceblue; padding: 8px;">${subject}</h3>
                      <strong>${postText}</strong>
                      <p style="background-color: lightgray; padding: 8px;">${link}</p>
                   </div>`,
        email,
      });
      task.notifiedPosts.push(postText);
      await tasksModel.putOne(task._id, { notifiedPosts:task.notifiedPosts });
    } catch (e) {
      console.log(e);
    }
  };
 
}