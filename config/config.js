let path = require('path');

const config = {
    PORT: 5000,
    tasksPath: path.join(__dirname, '../data/tasks.json'),
    selectors: `div.rq0escxv.a8c37x1j.rz4wbd8a.a8nywdso, div[data-ad-preview="message"],  div.linoseic.ggxiycxj.hihg3u9x`,
    fbLink: function(group_id){return `https://www.facebook.com/groups/${group_id}/?sorting_setting=CHRONOLOGICAL`},
    oldfbLink: function(group_id){return `https://m.facebook.com/groups/${group_id}`},
};
   
module.exports = config;

//selectors:
// old fb - option - _5msi

