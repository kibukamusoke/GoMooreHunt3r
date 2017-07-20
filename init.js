/**
 * Created by Trevor on 7/9/17.
 */

let express = require('express');

let schedule = require('node-schedule');
let modules = require('./hunters/modules');

let runAtStr = process.env.RUN_AT || '13:20';
let processAtStr = process.env.PROCESS_AT || '13:30';
let minuteInterval = process.env.RUN_EVERY_HOUR_AT_MINUTES || '10';
let timezoneOffset = process.env.TIMEZONE_OFFSET || 0;

console.log('set to run at ' + process.env.RUN_AT || 'sys var not set..');
//modules.padini();
//modules.uniqlo();
//modules.eos();
//modules.techhypermart();
//modules.processPosts();
//modules.directd();
//modules.bonia();
//modules.HnM();

let runAt = runAtStr.split(':');
let processAt = processAtStr.split(':');

let moment = require('moment');
let now = moment();
let formatted = now.format('YYYY-MM-DD HH:mm:ss Z');
console.log(formatted)
//modules.processPosts();

function hunt(){
    modules.padini();
    modules.uniqlo();
    modules.eos();
    modules.directd();
    modules.techhypermart();
    modules.bonia();
    modules.HnM();
}

schedule.scheduleJob({hour: Number(runAt[0]) + Number(timezoneOffset), minute:runAt[1]}, function () {
    hunt();
});

schedule.scheduleJob({hour: Number(processAt[0]) + Number(timezoneOffset), minute:processAt[1]}, function () {
    modules.processPosts();
});



let job = schedule.scheduleJob('* '+minuteInterval+' * * * *', function(){ // run every hour at x minute..
   // hunt();
    console.log('hunt3r is listening');
});

schedule.scheduleJob({hour: 8, minute: 51}, function(){
    console.log('run at 8:51');
});


/*
let port = process.env.PORT || 4044;
let httpServer = require('http').createServer();
httpServer.listen(port, function() {
    console.log('go-moore hunter running on port ' + port + '.');
   // res.status(200).send('go-moore hunter running on port ' + port + '.');
});
*/

let app = express();

app.get('/run', function(req, res) {
    res.status(200).send('Starting scrapper ... ');

    modules.padini();
    modules.uniqlo();
    modules.eos();
    modules.directd();
    modules.techhypermart();
    modules.bonia();

});



app.get('/process', function(req, res) {
    res.status(200).send('Starting scrapper ... ');

    modules.processPosts();

});


let port = process.env.PORT || 4408;
let httpServer = require('http').createServer(app);
//httpServer.listen(port, function() {
//    console.log('hunt3r running on port ' + port);
//});
