/**
 * Created by Trevor on 7/10/17.
 */

var cheerio = require('cheerio');
var requestPromise = require('request-promise');
var padiniProcessor = require('./padini');
var core = require('./core/core');


module.exports = {

    padini: function () {
        // TODO : get number of pages and iterate over all of them.
        var options = core.buildOptions('http://www.padini.com/deals.html');
        //var options = core.buildOptions('https://news.ycombinator.com');
        requestPromise(options).
        then(function($){
            padiniProcessor.padiniProcess($)
        }).
        catch(function(err){
            console.log(err);
        })
    },

    fos: function(){
        console.log('get fos data as well?');
    }

};