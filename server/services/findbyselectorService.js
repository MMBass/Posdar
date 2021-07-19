const puppeteer = require('puppeteer');
const tasksModel = require('../models/tasks');
const sendNewPosts = require('./sendnewpostsService');
const config = require('../config/config');

let browser;

exports.scan = async function() {
    let tasks = tasksModel.readAll(); // recive all the tasks from the model
    for(task of tasks){
      console.log(task.id + "START");
      try{
        let divsText = await getDom(task.group);
        if(divsText.length >= 2){
          tasksModel.updateTask({key:"lastCheck",val:divsText, id:task.id}); //replacing the posts for debugging anyway;
          const newRelevant = getNewRelevent(divsText, task.text, task.notifiedPosts);
          if(newRelevant){
            console.log("new Relevant");
              newRelevant.forEach( postText =>{
                console.log(postText);
                sendNewPosts.sendToEmail(postText,task.email,task.group);
                
              });  
              tasksModel.updateTask({key:"notifiedPosts",val:task.notifiedPosts.concat(newRelevant),  id:task.id});
          }
        }
      }catch (e){
        console.log( "scan iterate END with error  "+ e);
        // TODO here filter errors?
      }
    } //for loop separate the calls, forEach calling them together without waiting
};

async function getDom(group_id) {
    try{
      browser = await puppeteer.launch({ headless: false });
      const context = await browser.createIncognitoBrowserContext();
      const page = await context.newPage();
      page.setViewport({width: 800, height: 20000 });
      await page.goto(config.fbLink(group_id), {waitUntil: 'domcontentloaded'});
      await page.waitForTimeout(generateRandSeconds());
   
      await page.screenshot({ path: './data/example.png' });
      let divsText = await page.evaluate(() => {
        const results = Array.from(document.querySelectorAll(`div[data-ad-preview="message"]`));
        return results.map((div) => div.textContent);
      });
      page.close();
      return divsText;
    }catch (e){
      console.log('end with error + '+e);
    }finally{
      await browser.close();
    }
};

function generateRandSeconds(){ 
  return (Math.floor(Math.random()* 10) + 10) * 1000;
} // return random seconds between 10 to 20

function getNewRelevent(newPosts, taskText, notifiedPosts){
   let relevant = [];
   let newRelevant = [];
  
   newPosts.forEach((post)=>{
      for(words of taskText){
          if(post.includes(words)){
            relevant.push(post);
            break; // one match is enough
          }
      }
   });
   
   relevant.forEach(post => {
        if(!notifiedPosts.toString().includes(post)){
          newRelevant.push(post);
        }
   });
  return newRelevant;
}// look for match and new in the new posts array