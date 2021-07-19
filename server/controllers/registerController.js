const { body, validationResult } = require('express-validator');
const tasksModel = require('../models/tasks');
const checkExist = require('../services/checkexistService');

exports.newRegister = [
   
    // Validate and santitize fields.
    body('userName', "userName doesn't exists").exists().isEmail().escape(),
    body('email', 'Invalid email').exists().trim().isEmail().escape(),
    body('group', "no Group id").exists().trim().isLength({ min: 3 }).escape(),
    //TODO add more fields vaildation

    // Process request after validation and sanitization.
    async (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        //TODO Create a Task object with escaped/trimmed data and an old id.
        const task =  {
            "id": new Date(),
            "user": req.body.userName,
            "time": "", //break between client notified (every day, every minute etc.)
            "date": new Date(), //create date
            "group": req.body.group,
            "email": req.body.email,
            "text": req.body.text  //TODO client-side create ready array of inputs.val
        };

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            res.status().send("Some of the fields missing or incorrect");
            return;
        }
        else {
            //TODO check here if task already exist 
            taskExist = await checkExist("tasks",task);
            if(!taskExist){
                await tasksModel.writeTask(task);
                // Data from form is valid. Save the task.
                res.send("Saved to your list, you will get a message when we will find somenthing new");
            }else if(taskExist){
                res.status(200).send("Task already exist");
            };

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
            res.status().send("Some of the fields missing or incorrect");
            return;
        }
        else {
            await tasksModel.deleteTask(task);
            // Data from form is valid. Delete the task.
            res.send("Saved to your list, you will get a message when we will find somenthing new");
        }
    }
];