const express = require('express')
const cors = require('cors');
const helmet = require('helmet');
const cron = require('node-cron');

const findBySelector = require('./services/findbyselectorService.js');
const config = require('./config/config');
const registerRouter = require('./routes/register.js');
const indexRouter = require('./routes/index.js');
const authMw = require('./middleware/auth.js');

const app = express();
const port = process.env.PORT || config.PORT;

let running = false;
async function start() {
    if (running) {
        console.log('The previous execution is still running, skipping this one');
        return;
    }
    try {
        running = true;
        await findBySelector.scan();
        console.log('end');
        running = false
    } catch (err) {
        console.log(err);
    }
}
var cronJob = cron.schedule('* */5 * * * *', start); //Create a cron job


app.use(express.json());
app.use(helmet());
app.use(cors({
    exposedHeaders: ['access-token']
}));

app.use('/', authMw, indexRouter);
app.use('/register', authMw, registerRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(err.status || 500).send({ message: err.message });
})

app.listen(port, () => console.log(`app listening at port ${port}...`));
