const express = require('express')
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

const config = require('./config/config');
const myAuth = require('./services/authService.js');
const registerRouter = require('./routes/register.js');
const findBySelector = require('./services/findbyselectorService.js');

const app = express();
const port = process.env.PORT || config.PORT;

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

// Set up mongoose connection
mongoose.connect(process.env.dbUrl || dev_db_Url, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
// db.on('open', console.log('db connected...'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

(async function main(){
      await findBySelector.scan();
      main();
})();//Start scanning groups on startup 

app.use(cors());
app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    console.log(req.body)
    if(req.body.token){
       myAuth.validateToken(req.body.token, (err, userValid)=>{
        if(err){
            res.status(500).send({message:'Server Error'});
        }else if(!userValid){
            res.status(403).send({message:'Accsess denied'});
        }else if(userValid){
            next();
        }
       });  
    }else{
        res.sendStatus(403); 
    }
});

app.use('/register', registerRouter);

app.listen(port,() => console.log(`app listening at port ${port}...`));
