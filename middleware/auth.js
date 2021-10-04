const dev_config = (process.env.store === undefined) ? require('../config/devConfig') : undefined;
const authService = require('../services/authService.js');

module.exports = (req, res, next) => {
    if (req.path === '/' && req.method === 'GET') { return next() }

    if (req.method === 'DELETE' || (req.path === '/register' && req.method === 'get' && req.header("at"))) {
        if (req.header("at")) {
            if (!authService.validateAccess(req.header("at"))) {
                res.status(401).send({ message: 'Accsess denied' });
            } else if (authService.validateAccess(req.header("at"))) {
                next();
            }
        } else {
            res.status(401).send({ message: 'Accsess denied' });
        }
    // } else if ()) {
    //     if (req.header("at")) {
    //         if (!authService.validateAccess(req.header("at"))) {
    //             res.status(401).send({ message: 'Accsess denied' });
    //         } else if (authService.validateAccess(req.header("at"))) {
    //             next();
    //         }
    //     } else {
    //         res.status(401).send({ message: 'Accsess denied' });
    //     }
    } else {
        if (req.header("apiKey")) {
            authService.validateKey({key:req.header("apiKey"), name:req.header("userName")}, (err, userValid) => {
                if (err) {
                    res.status(500).send({ message: 'Server Error' });
                } else if (!userValid) {
                    res.status(401).send({ message: 'Accsess denied' });
                } else if (userValid) {
                    next();
                }
            });
        } else {
            res.sendStatus(403);
        }
    }

}