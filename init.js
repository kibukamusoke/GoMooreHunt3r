/**
 * Created by Trevor on 7/9/17.
 */

let express = require('express');

let schedule = require('node-schedule');
let modules = require('./hunters/modules');
let core = require('./hunters/core/core');
let runAtStr = process.env.RUN_AT || '13:20';
let processAtStr = process.env.PROCESS_AT || '13:30';
let minuteInterval = process.env.RUN_EVERY_HOUR_AT_MINUTES || '10';
let timezoneOffset = process.env.TIMEZONE_OFFSET || 0;

console.log('set to run at ' + process.env.RUN_AT || 'sys var not set..');

let runAt = runAtStr.split(':');
let processAt = processAtStr.split(':');

let moment = require('moment');
let now = moment();

//hunt();
/*modules.bigsale()
    .then((m) => {
        console.log(m);
    })
    .catch((e) => {
        console.log(e);
    });
core.postToSlack('hunt3r has started...')
    .then((r) => {
        console.log(r);
    })
    .catch((e) => {
        console.log(e);
    });
*/

hunt();


function hunt() {
    //core.postToSlack(formatSlackNotification('New Data','Deals or America promos hunt3d'))

     modules.dealsOfamerica()
        .then(() => {
            return modules.bigsale();
        })
        .then(() => {
         return modules.padini();
        })
        .then(() => {
         return modules.uniqlo();
        })
        .then(() => {
         return modules.eosPromotions();
        })
        .then(() => {
         return modules.eosEvents();
        })
        .then(() => {
         return modules.eosSales();
        })
        .then(() => {
         return modules.directd();
        })
        .then(() => {
         return modules.techhypermart()
        }).catch((e) => {
         console.log(e);
     })


    /*
        setTimeout(function () {
            modules.dealsOfamerica();
        }, 1);



        setTimeout(function () {
            modules.bigsale();
        }, 1000);




        setTimeout(function () {
            modules.padini();
        }, 15000);




        setTimeout(function () {
            modules.uniqlo();
        }, 1);


        setTimeout(function () {
            modules.eosPromotions();
        }, 1);


        setTimeout(function () {
            modules.eosEvents();
        }, 1);



        setTimeout(function () {
            modules.eosSales();
        }, 1);


        setTimeout(function () {
            modules.eosEvents();
        }, 150000);


        setTimeout(function () {
            modules.directd();
        }, 1);




        setTimeout(function () {
            modules.techhypermart();
        }, 1);

        setTimeout(function () {
            modules.bonia();
        }, 1);


        setTimeout(function () {
            //modules.HnM();
        }, 1);

        */


}

schedule.scheduleJob({hour: Number(runAt[0]) + Number(timezoneOffset), minute: runAt[1]}, function () {
    hunt();
});

schedule.scheduleJob({hour: Number(processAt[0]) + Number(timezoneOffset), minute: processAt[1]}, function () {
    //modules.processPosts();
});


let job = schedule.scheduleJob('* ' + minuteInterval + ' * * * *', function () { // run every hour at x minute..
    // hunt();
    console.log('hunt3r is listening');
});

schedule.scheduleJob({hour: 8, minute: 51}, function () {
    console.log('run at 8:51');
});


let app = express();

app.get('/run', function (req, res) {
    res.status(200).send('Starting scrapper ... ');

    modules.padini();
    modules.uniqlo();
    modules.eos();
    modules.directd();
    modules.techhypermart();
    modules.bonia();

});


app.get('/process', function (req, res) {
    res.status(200).send('Starting scrapper ... ');

    modules.processPosts();

});


let port = process.env.PORT || 4408;
let httpServer = require('http').createServer(app);

