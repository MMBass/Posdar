const express = require('express')
const cors = require('cors');
const helmet = require('helmet');

const findBySelector = require('./services/findbyselectorService.js');
const config = require('./config/config');
const registerRouter = require('./routes/register.js');
const indexRouter = require('./routes/index.js');
const authMw = require('./middleware/auth.js');

const app = express();
const port = process.env.PORT || config.PORT;

async function start() {
    await findBySelector.scan();
    start();
}
// start(); //Start scanning groups


app.use(function ( req, res) {
    console.error(req.path);
})

app.use(express.json());
app.use(helmet());
app.use(cors({
    exposedHeaders: ['access-token']
}));

app.use('/',authMw, indexRouter);
app.use('/register',authMw, registerRouter);

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send({ message: 'Server Error' });
}) // error handler

app.listen(port, () => console.log(`app listening at port ${port}...`));