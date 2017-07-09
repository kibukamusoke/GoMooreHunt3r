/**
 * Created by Trevor on 7/10/17.
 */

var cheerio = require('cheerio');
var requestPromise = require('request-promise');
var padiniProcessor = require('./padini');
var core = require('./core/core');


module.exports = {

    padini: function () {
        // last 20pages
        for(var x=1;x<21;x++){
            var options = core.buildOptions('http://www.padini.com/deals.html?p='+x);
            requestPromise(options).
            then(function($){
                padiniProcessor.padiniProcess($)
            }).
            catch(function(err){
                console.log(err);
            })
        }

    },

    fos: function(){
        console.log('get fos data as well?');
    }

};