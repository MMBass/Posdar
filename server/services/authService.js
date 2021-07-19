const { body, validationResult } = require('express-validator');
const privateConfig = require('../config/privateConfig');

function validateToken(reqToken){
    if(reqToken === privateConfig.secretToken){
      return true;
    }
  
    // TODO set it to false while uploading to server.
    return true;
  }
  
module.exports = {validateToken};