const { body, validationResult } = require('express-validator');
let privateConfig;
if(process.env.store !== 'heroku'){
  try{
    privateConfig = require('../config/privateConfig');
  }catch{
    console.log("privateConfig doesnt exist");
  }
}

function validateToken(reqToken,cb){
    let secretToken = process.env.secretToken ||privateConfig.secretToken;
    if(reqToken === secretToken){
      cb(null,true)
    }
    else{
      cb(null,false)
    }
  }
  
module.exports = {validateToken};