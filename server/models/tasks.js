const { group } = require('console');
const fs = require('fs');
let path = require('path');
const config = require('../config/config');
const tasksPath = config.tasksPath;

exports.readAll = function(){
    let rawdata = fs.readFileSync(tasksPath);
    let tasks = JSON.parse(rawdata);
    return tasks;
}

exports.writeTask = function(details){
    try{
        let rawdata = fs.readFileSync(tasksPath);
        let tasks = JSON.parse(rawdata);
        tasks.push(details);
        tasks = JSON.stringify(tasks);
        fs.writeFileSync(tasksPath,tasks);
        return true;
    }catch{
        return "error writing";
    }
   
}

exports.updateTask = function(details){
    try{
        let rawdata = fs.readFileSync(tasksPath);
        let tasks = JSON.parse(rawdata);
        tasks.map((task)=>{
            if(details.id === task["id"]){
                task[details.key] = details.val;
            };
        });
        
        tasks = JSON.stringify(tasks);
        fs.writeFileSync(tasksPath,tasks);

        return true;
    }catch{
        return "error updating";
    }
}

exports.deleteTask = function(group, user){
    try{
        let rawdata = fs.readFileSync(tasksPath);
        let tasks = JSON.parse(rawdata);
        Array.splice()
        tasks.map((task,i)=>{
            if(group === task["group"] && user === task["user"]){
                tasks.splice(i,0);
            };
        });
        tasks = JSON.stringify(tasks);
        
        fs.writeFileSync(tasksPath,tasks);

        return true;
    }catch{
        return "error deleting";
    }
}