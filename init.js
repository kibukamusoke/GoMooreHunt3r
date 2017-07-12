/**
 * Created by Trevor on 7/9/17.
 */

let schedule = require('node-schedule');
let modules = require('./hunters/modules');
//modules.padini();
//modules.uniqlo();
//modules.eos();
modules.processPosts();

let job = schedule.scheduleJob('* * */6 * * *', function(){ // run every 6 hours..
    modules.padini();
    modules.uniqlo();
    modules.eos();
    modules.processPosts();
});

schedule.scheduleJob({hour: 8, minute: 51}, function(){
    console.log('run at 8:51');
});




