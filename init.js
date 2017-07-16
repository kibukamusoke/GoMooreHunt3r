/**
 * Created by Trevor on 7/9/17.
 */

let schedule = require('node-schedule');
let modules = require('./hunters/modules');

let runAtStr = process.env.RUN_AT || '13:05';
let processAtStr = process.env.PROCESS_AT || '13:15';
//modules.padini();
//modules.uniqlo();
//modules.eos();
//modules.techhypermart();
//modules.processPosts();
//modules.directd();
//modules.bonia();

let runAt = runAtStr.split(':');
let processAt = processAtStr.split(':');

let moment = require('moment');
let now = moment();
let formatted = now.format('YYYY-MM-DD HH:mm:ss Z');
console.log(formatted)
//modules.processPosts();

schedule.scheduleJob({hour: Number(runAt[0]) + 8, minute:runAt[1]}, function () {
    modules.padini();
    modules.uniqlo();
    modules.eos();
    modules.directd();
    modules.techhypermart();
    modules.bonia();
});

schedule.scheduleJob({hour: Number(processAt[0]) + 8, minute:processAt[1]}, function () {
    modules.processPosts();
});

//let job = schedule.scheduleJob('* * */6 * * *', function(){ // run every 6 hours..
//    modules.padini();
//    modules.uniqlo();
//    modules.eos();
//    modules.directd();
//    modules.techhypermart();
//    modules.bonia();
//    modules.processPosts();
//});

schedule.scheduleJob({hour: 8, minute: 51}, function(){
    console.log('run at 8:51');
});



let port = process.env.PORT || 4044;
let httpServer = require('http').createServer();
httpServer.listen(port, function() {
    console.log('go-moore hunter running on port ' + port + '.');
});

