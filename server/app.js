const express = require('express')
const path = require('path');
const config = require('./config/config');
const myAuth = require('./services/authService.js');
const registerRouter = require('./routes/register.js');
const findBySelector = require('./services/findbyselectorService.js');

const app = express();
const port = process.env.PORT || config.PORT;

findBySelector.scan(); //Start scanning groups on startup // TODO check why looping by default.

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    myAuth.validateToken(req.body.token, (err, userValid)=>{
        if(err){
            res.status(500).send('Auth Error');
        }
        if(!userValid){
            res.send(403);
        }
        if(userValid){
            next();
        }
    });
});

app.use('/register', registerRouter);

app.listen(() => console.log(`app listening at port ${port}...`));