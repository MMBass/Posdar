const emailService = require('./emailService');
const config = require('../config/config');
const tasksModel = require('../models/tasks');

exports.sendEmails = async function (newRelevant, task) {
  const link = `Link to group: ` + config.fbLink(task.group);
  const email = task.email;

  const postsText = newRelevant.join("<br><br>");
  const rand = (Math.random() + 1).toString(36).substring(2);
  const subject = "Posdar. For search: " + task.text.join(" | ") + postsText.substring(0, 60) +"...";
  const from = "From Group " + task.group + "  ( ID: " + rand + " )";
  try {
    await emailService.sendEmail({
      subject,
      template: `<div style="width:100%; text-align:center; background-color: lightgray; color: black; margin: 5px;">
                      <h3 style="background-color: gray; padding: 8px;">${subject}</h3>
                      <h3 style="background-color: gray; padding: 8px;">${from}</h3>
                      <strong>${postsText}</strong>
                      <p style="background-color: gray; padding: 8px;">${link}</p>
                   </div>`,
      email,
    });
    console.log('email sent');
    let notifiedPosts = [...task.notifiedPosts, newRelevant];
    await tasksModel.putOne(task._id, { notifiedPosts });
  } catch (e) {
    throw new Error(e);
  }

}