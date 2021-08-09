const { body, validationResult } = require('express-validator');
const tasksModel = require('../models/tasks');

exports.getList = [
    // Validate and santitize fields.
    body('userName', "userName doesn't exists").exists().isEmail().escape(),

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
            const all = await tasksModel.readAll();
            // Data from form is valid. Delete the task.
            res.send({tasks: all});
        }
    }
];
