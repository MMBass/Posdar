const express = require('express')
const path = require('path');
const cors = require('cors');
const findBySelector = require('./services/findbyselectorService.js');

const config = require('./config/config');
const myAuth = require('./services/authService.js');
const registerRouter = require('./routes/register.js');

const app = express();
const port = process.env.PORT || config.PORT;

async function startup(){
    await findBySelector.scan();
    startup();
}
startup(); //Start scanning groups on startup

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
