const { header, body, validationResult } = require('express-validator');
const tasksModel = require('../models/tasks');

exports.getList = [
    // Validate and santitize fields.
    header('user-name', "userName required").exists().isEmail().escape(),

    // Process request after validation and sanitization.
    async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            res.status(400).send({ message: "Some of the fields missing or incorrect" });
            return;
        }
        else {
            const allOfUser = await tasksModel.read(req.header("user-name"));
            res.send({ tasks: allOfUser });
        }
    }
];

exports.newRegister = [
    // Validate and santitize fields.
    body('userName', "invalid userName").exists().isEmail().escape(),
    body('email', 'Invalid email').exists().trim().isEmail().escape(),
    body('group', "no Group id").exists().trim().isLength({ min: 3 }),
    body('text', "array text error").exists().isArray(),
    
    // Process request after validation and sanitization.
    async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            res.status(400).send({ message: "Some of the fields missing or incorrect" });
            return;
        } else {
            if (findChars(req.body.text) === false) {
                res.status(400).send({ message: "The text must contain only letters or numbers" });
            } else {
                const task = {
                    user: req.body.userName,
                    time: "", //break between client notified (every day, every minute etc.)
                    date: new Date(),
                    group: req.body.group,
                    email: req.body.email,
                    text: clearList(req.body.text),
                    lastCheck: [],
                    notifiedPosts: []
                };
                try {
                    await tasksModel.createOne(task);
                    res.status(200).send({ message: "Task saved" });
                } catch (err) {
                    return next(err);
                }
            }

        }
    }
];

exports.delRegister = [
    // Validate and santitize fields.
    header('t-id', "task id doesn't exists").exists().escape(),

    // Process request after validation and sanitization.
    async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            res.status(400).send({ message: "data missing or incorrect" });
            return;
        }
        else {
            try{
                await tasksModel.removeOne(req.header("t-id"));
                // Data from form is valid. Delete the task.
                res.status(200).send({ message: "Task Deleted" });
            }catch (err){
                return next(err);
            }
            
        }
    }
];

function findChars(text) {
    let ret = true;
    text.forEach((a) => {
        if (/[^A-Za-z0-9 אבגדהוזחטיכךלמנסעםןפףצץקרשת]+/.test(a)) {
            ret = false;
        }
    });
    return ret;
}

function clearList(text) {
    const cleanList = [];
    text.forEach((a) => {
        if (typeof a === "string" && a.length > 1) {
            cleanList.push(a);
        }
    });
    return cleanList;
}