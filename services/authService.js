const dev_config = (process.env.store === undefined) ? require('../config/devConfig') : undefined;
const bcrypt = require('bcrypt');

const usersModel = require('../models/users');

async function validateKey(reqUser, cb) {
  try {
    let user = await usersModel.readOne(reqUser.name);
    let dbKey = user.api_key;

    bcrypt.compare(reqUser.key/*clinet pass*/, dbKey/*hash*/, function (err, result) {
      if (err) {
        cb(err)
      }else if (result === true) {
        cb(null, true)
      }else {
        cb(null, false)
      }
    });
  } catch (err) {
    cb(err);
  }
}

function validateAccess(at) {
  //TODO jwt functions here
  // turn the hash into userName for list request
  console.log(at)
  return true;
}

module.exports = { validateKey, validateAccess };