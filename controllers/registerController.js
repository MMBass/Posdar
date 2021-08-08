const { body, validationResult } = require('express-validator');
const tasksModel = require('../models/tasks');

exports.newRegister = [
    // Validate and santitize fields.
    body('userName', "invalid userName").exists().isEmail().escape(),
    body('email', 'Invalid email').exists().trim().isEmail().escape(),
    body('group', "no Group id").exists().trim().isLength({ min: 3 }),
    body('text', "array text error").exists().isArray(),
    //TODO regex for words to not contain special chars, and return to client "try again";

    // Process request after validation and sanitization.
    async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            res.status(400).send({message:"Some of the fields missing or incorrect"});
            return;
        } else {
            if (findChars(req.body.text)=== "false") {
                res.status(400).send({message:"The text must contain only letters or numbers"});
            }else{
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
                    res.status(200).send({message:"Task saved"});
                } catch (err) {
                    res.status(500).send({message:"Error saving"});
                }
            }

        }
    }
];

exports.delRegister = [
    // Validate and santitize fields.
    body('userName', "userName doesn't exists").exists().isEmail().escape(),
    body('email', 'Invalid email').exists().trim().isEmail().escape(),
    body('group', "no Group id").exists().trim().isLength({ min: 3 }).escape(),

    // Process request after validation and sanitization.
    async (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
        const task = req.body;

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            res.status(200).send({ message: "Some of the fields missing or incorrect" });
            return;
        }
        else {
            await tasksModel.removeOne(task);
            // Data from form is valid. Delete the task.
            res.send({ message: "Saved to your list, you will get a message when we will find somenthing new" });
        }
    }
];

function findChars(text) {
    const regex = /[^A-Za-z0-9]+/;
    text.forEach((a) => {
        if (!regex.test(a)) {
            return "false";
        }
    });
    return true;
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