const dev_config = (process.env.store === undefined) ? require('../config/devConfig') : undefined;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usersModel = require('../models/users');

async function validateKey(reqUser, cb) {
    try {
      if (reqUser.name.includes("$") || reqUser.name.includes("(")||reqUser.name.includes(")")){
        throw new Error("unsafe string");//avoid mongo injection
      }
      let user = await usersModel.readOne(reqUser.name);
      let dbKey = user.api_key;
  
      bcrypt.compare(reqUser.key/*clinet pass*/, dbKey/*hash*/, function (err, result) {
        if (err) {
          cb(err);
        }else if (result === true) {
          const at_secret =  process.env.atSecret ||  dev_config.at_secret;
          const accessToken = jwt.sign({ userName: user.user_name }, at_secret, { expiresIn: 60 * 60 });
          cb(null, accessToken)
        }else {
          cb(null, false)
        }
      });
      
    } catch (err) {
      cb(err);
    }
}

function validateAccess(at,cb) {
  const at_secret =  process.env.atSecret ||  dev_config.at_secret;
  const decoded = jwt.verify(at, at_secret, function(err, decoded) {
    if(err){
      console.log(err);
      cb(err);
    } 
    cb(null,decoded.userName);
  });
}

module.exports = { validateKey, validateAccess };