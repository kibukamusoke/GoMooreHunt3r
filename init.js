/**
 * Created by Trevor on 7/9/17.
 */

let schedule = require('node-schedule');
let modules = require('./hunters/modules');

let runAtStr = process.env.RUN_AT || '04:00';
let processAtStr = process.env.PROCESS_AT || '04:30';
//modules.padini();
//modules.uniqlo();
//modules.eos();
//modules.techhypermart();
//modules.processPosts();
//modules.directd();
//modules.bonia();

let runAt = runAtStr.split(':');
let processAt = processAtStr.split(':');

schedule.scheduleJob({hour: runAt[0], minute:runAt[1]}, function () {
    modules.padini();
    modules.uniqlo();
    modules.eos();
    modules.directd();
    modules.techhypermart();
    modules.bonia();
});

schedule.scheduleJob({hour: processAt[0], minute:processAt[1]}, function () {
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

