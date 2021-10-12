const authService = require('../services/authService.js');

module.exports = (req, res, next) => {
    if (req.path === '/' && req.method === 'GET') { return next() }

    if (req.header("x-api-key")) {
        authService.validateKey({ key: req.header("x-api-key"), name: req.header("user-name") }, (err, accessToken) => {
            if (err) {
               next(err);
            } else if (!accessToken) {
                res.status(401).send({ message: 'Accsess denied' });
            } else if (accessToken) {
                res.set('access-token', accessToken);
                next();
            }
        });
    }

    if (req.method === 'DELETE' || (req.path === '/register' && req.method === 'GET' && req.header("x-access-token"))) {
        if (req.header("x-access-token")) {
            authService.validateAccess(req.header("x-access-token"), (err, user) => {
                if (err) {
                    next(err);
                }else if (user) {
                    req.headers['user-name'] = user;
                    next();
                } else {
                    res.status(401).send({ message: 'Accsess denied' });
                }
            });

        }
    }
}