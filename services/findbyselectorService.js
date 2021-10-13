const puppeteer = require('puppeteer');
const tasksModel = require('../models/tasks');
const sendNewPosts = require('./sendnewpostsService');
const config = require('../config/config');
const proxyList = require('../data/openproxySpace');

let browser;
let page;

exports.scan = async function () {
  let tasks;
  try {
    tasks = await tasksModel.readAll();// recive all the tasks from the model
  } catch (err) {
    throw new Error(err);
  }

  if (typeof tasks !== "undefined") {
    if (tasks.length > 0) {
      for (task of tasks) {
        try {
          let divsText = await getDom(task.group);
          if (divsText.length >= 2) {
            await tasksModel.putOne(task._id, { lastCheck: divsText }); //replacing the posts for debugging anyway;
            let newRelevant;
            if (task.text && Array.isArray(task.text)) newRelevant = getNewRelevent(divsText, task.text, task.notifiedPosts);
            if (newRelevant && newRelevant.length > 0) {
              await sendNewPosts.sendEmails(newRelevant, task);
            }
          }
        } catch (err) {
          throw new Error(err);
        }
      } //for loop separate the calls, forEach calling them together without waiting
    }
  }
  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  await timeout(generateRandSeconds());
}

async function getDom(group_id) {
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--proxy-server=socks4://' + generateRandProxy(),
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ]
    });
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    page.setViewport({ width: 800, height: 20000 });
    await page.goto(config.fbLink(group_id), { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(generateRandSeconds());

    let divsText = await page.evaluate(() => {
      const results = Array.from(document.querySelectorAll(`div.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.c1et5uql, div[data-ad-preview="message"],  div.linoseic.ggxiycxj.hihg3u9x`));

      return results.map((div) => div.innerText);
    });
    await page.close();
    await browser.close();
    divsText = [...new Set(divsText)]; //removing duplicates
    return divsText;
  } catch (e) {
    await page.close();
    await browser.close();
    throw new Error(err);
  }
};

function generateRandSeconds() {
  return (Math.floor(Math.random() * 10) + 10) * 1000;
} // random seconds between 10 to 20

function generateRandProxy() {
  let randProxy = proxyList[(Math.floor(Math.random() * proxyList.length) - 1)];
  return randProxy;
}

function getNewRelevent(newPosts, taskText, notifiedPosts) {
  let relevant = [];
  let newRelevant = [];

  newPosts.forEach((post) => {
    for (words of taskText) {
      if (post.toLocaleLowerCase().includes(words.toLocaleLowerCase())) {
        relevant.push(post);
        break; // one match is enough
      }
    }
  });

  relevant.forEach(post => {
    post = post.split("…")[0]; // remove string that represents 'more' in other langs
    post = post.split("...")[0]; // remove string that represents 'more' in other langs
    if (!notifiedPosts.toString().includes(post)) {
      newRelevant.push(post);
    }
  });
  return newRelevant;
}// look for match and new in the new posts array
