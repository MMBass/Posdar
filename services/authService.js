const { body, validationResult } = require('express-validator');
const dev_config = (process.env.store === undefined) ? require('../config/devConfig') : undefined;

function validateToken(reqToken,cb){
    let secretToken = process.env.secretToken ||dev_config.secretToken;
    if(reqToken === secretToken){
      cb(null,true)
    }
    else{
      cb(null,false)
    }
  }
  
module.exports = {validateToken};