const puppeteer = require('puppeteer');
const tasksModel = require('../models/tasks');
const sendNewPosts = require('./sendnewpostsService');
const config = require('../config/config');
const proxyList = require('../data/openproxySpace4');

let browser;
let page;
let newRelevant = [];

exports.scan = async function () {
  let tasks;
  try {
    tasks = await tasksModel.readAll();// recive all the tasks from the model
  } catch (err) {
    throw new Error(err);
  }

  if (typeof tasks !== "undefined") {
    if (tasks.length > 0) {
      for (let task of tasks) {
        try {
          let divsText = await getDom(task.group);
          // console.log(divsText);
          if (divsText.length >= 2) {
            await tasksModel.putOne(task._id, { lastCheck: divsText }); //replacing the posts anyway for debugging;

            if (task.text && Array.isArray(task.text)) newRelevant = checkNewRelevant(divsText, task.text, task.notifiedPosts);
            if (newRelevant && newRelevant.length > 0) {
              console.log("New posts For search: " + task.text.join(" | ") + " : " + newRelevant.join(" ########### "));
              // todo notify in other way.
              // await sendNewPosts.sendEmails(newRelevant, task);
            }
          } else if (divsText.length === 0) {
            console.log('Error: 0 results for task. Selector problem or group not exsist');
            // await sendNewPosts.sendEmails(['Error: 0 results for task. Selector problem or group not exsist'], task);
          };
        } catch (err) {
          throw new Error(err);
        }
      } //for loop separates the calls, forEach calling them together without waiting
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
        // '--proxy-server=socks4://' + generateRandProxy(),
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ]
    });
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
    page.setViewport({ width: 800, height: 1000, deviceScaleFactor: 1 });
    await page.goto(config.oldfbLink(group_id), { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, generateRandSeconds()));

    let divsText = await page.evaluate(() => {
      const results = Array.from(document.querySelectorAll(`._5msi`)); // old fb - not blocked with login prompt
      // document.querySelectorAll(`div.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.c1et5uql, div[data-ad-preview="message"],  div.linoseic.ggxiycxj.hihg3u9x`) // new Fb last working classes - blocked by login prompt
      return results.map((div) => div.innerText);
    });
    await page.close();
    await browser.close();
    divsText = [...new Set(divsText)]; //remove duplicates
    return divsText;
  } catch (err) {
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

function checkNewRelevant(newPosts, taskText, notifiedPosts) {
  let relevant = [];

  newPosts.forEach((post) => {
    for (let words of taskText) {
      if (post.toLowerCase().includes(words)) {
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
