let path = require('path');

const config = {
    PORT: 5000,
    tasksPath: path.join(__dirname, '../data/tasks.json'),
    divsSelector: `div[data-ad-preview="message"]`, 
    // another selector: // data-ad-comet-preview="message"
    fbLink: function(group_id){return `https://www.facebook.com/groups/${group_id}/?sorting_setting=CHRONOLOGICAL`},
    oldfbLink: function(group_id){return `https://m.facebook.com/groups/${group_id}`},
};
   
module.exports = config;

