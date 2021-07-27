const puppeteer = require('puppeteer');
const tasksModel = require('../models/tasks');
const sendNewPosts = require('./sendnewpostsService');
const config = require('../config/config');
const proxyList = require('../data/openproxySpace');

let browser;

exports.scan = async function() {
  let tasks;
  try{
    tasks = await tasksModel.readAll();// recive all the tasks from the model
  }catch(e){
     console.log("db"+ e)
  }

  if(typeof tasks !== "undefined"){
   if(tasks.length > 0){
    for(task of tasks){
      sendNewPosts.sendToEmail("postText",task.email,task.group);
      try{
        let divsText = await getDom(task.group);
        if(divsText.length >= 2){
          console.log(divsText );
          await tasksModel.putOne(task._id,{lastCheck:divsText}); //replacing the posts for debugging anyway;
          let newRelevant;
          if(task.text && Array.isArray(task.text)) newRelevant = getNewRelevent(divsText, task.text, task.notifiedPosts);
          if(newRelevant && newRelevant.length > 0){
              newRelevant.forEach( postText =>{
                sendNewPosts.sendToEmail(postText,task.email,task.group);
              });  
              await tasksModel.putOne(task._id,{notifiedPosts:task.notifiedPosts.concat(newRelevant)});
          }
        }
      }catch (e){
        console.log( "scan iterate END with error  "+ e);
      }
     } //for loop separate the calls, forEach calling them together without waiting
    }
   }
    function timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    try{
       await timeout(generateRandSeconds());
    }catch{
       console.log("timeout catched");
    }
}    

async function getDom(group_id) {
    try{
      browser = await puppeteer.launch({ 
        headless: true,
        args:[
          // '--proxy-server=socks4://'+generateRandProxy(),
          '--no-sandbox',
          '--disable-setuid-sandbox',
      ]});
      const context = await browser.createIncognitoBrowserContext();
      const page = await context.newPage();
      page.setViewport({width: 800, height: 20000 });
      await page.goto(config.fbLink(group_id), {waitUntil: 'domcontentloaded'});
      await page.waitForTimeout( generateRandSeconds());
   
      let divsText = await page.evaluate(() => {
        const results = Array.from(document.querySelectorAll(`div[data-ad-preview="message"]`));
        return results.map((div) => div.innerText);
      });
      await page.close();
      await browser.close();
      return divsText;
    }catch (e){
      if(browser){ await browser.close();}
      console.log('end with error + '+e);
    }finally{
        if(browser){ await browser.close();}
    }
};

function generateRandSeconds(){ 
  return (Math.floor(Math.random()* 10) + 10) * 1000;
} // random seconds between 10 to 20

function generateRandProxy(){
    let randProxy = proxyList[(Math.floor(Math.random() * proxyList.length)-1)];
    return randProxy;
}

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
