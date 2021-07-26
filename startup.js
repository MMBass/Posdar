const findBySelector = require('./services/findbyselectorService.js');
const mongoose = require('mongoose');

let dev_db_Url;
let privateConfig;
if (process.env.store !== 'heroku') {
    try {
        privateConfig = require('./config/privateConfig');
        dev_db_Url = privateConfig.dev_db_Url;
    } catch {
        console.log("privateConfig doesnt exist");
    }
}

try {
       // Set up mongoose connection
      mongoose.connect(process.env.dbUrl || dev_db_Url, {useNewUrlParser: true, useUnifiedTopology: true});
      const db = mongoose.connection;
      db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    } catch (e){
        console.log(e);
    }

async function main(){
      await findBySelector.scan();
      main();
}
main();//Start scanning groups on startup 

module.exports = main;
