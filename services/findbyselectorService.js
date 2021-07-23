const puppeteer = require('puppeteer');
const tasksModel = require('../models/tasks');
const sendNewPosts = require('./sendnewpostsService');
const config = require('../config/config');

let browser;

exports.scan = async function() {
    console.log("scan")
//     let tasks = await tasksModel.readAll();
     getDom("277156988971707")// recive all the tasks from the model
    if(tasks && tasks.length > 0){
    for(task of tasks){
      try{
        let divsText = await getDom(task.group);
        if(divsText.length >= 2){
          tasksModel.updateTask({key:"lastCheck",val:divsText, id:task.id}); //replacing the posts for debugging anyway;
          let newRelevant;
          if(task.text && Array.isArray(task.text)) newRelevant = getNewRelevent(divsText, task.text, task.notifiedPosts);
          if(newRelevant && newRelevant.length > 0){
              newRelevant.forEach( postText =>{
                sendNewPosts.sendToEmail(postText,task.email,task.group);
              });  
              tasksModel.updateTask({key:"notifiedPosts",val:task.notifiedPosts.concat(newRelevant),  id:task.id});
          }
        }
      }catch (e){
        console.log( "scan iterate END with error  "+ e);
      }
     } //for loop separate the calls, forEach calling them together without waiting
    }
    function timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    await timeout(3000);
}    

async function getDom(group_id) {
    try{
      browser = await puppeteer.launch({ 
        headless: true,
        args:[
          '--no-sandbox',
          '--disable-setuid-sandbox',
      ]});
      const context = await browser.createIncognitoBrowserContext();
      const page = await context.newPage();
      page.setViewport({width: 800, height: 20000 });
      await page.goto(config.fbLink(group_id), {waitUntil: 'domcontentloaded'});
      await page.waitForTimeout( 1000 || generateRandSeconds());
   
     // await page.screenshot({ path: './data/example.png' });
      let divsText = await page.evaluate(() => {
        const results = Array.from(document.querySelectorAll(`div[data-ad-preview="message"]`));
        return results.map((div) => div.textContent);
      });
         console.log(divsText);
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
