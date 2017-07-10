/**
 * Created by Trevor on 7/10/17.
 */

let cheerio = require('cheerio');
let requestPromise = require('request-promise');
let core = require('./core/core');


let padiniProcessor = require('./padini');
let uniqloProcessor = require('./uniqlo');



module.exports = {

    processPosts: function () {
        core.processPostQueue();
    },

    padini: function () {
        // last 20pages
        for(let x=1;x<21;x++){
            let options = core.buildOptions('http://www.padini.com/deals.html?p='+x);
            requestPromise(options).
            then(function($){
                padiniProcessor.padiniProcess($)
            }).
            catch(function(err){
                console.log(err);
            })
        }

    },

    uniqlo: function(){

        let offerPages = [
            'http://www.uniqlo.com/my/store/women/featured/e-member-special.html',
            'http://www.uniqlo.com/my/store/men/featured/e-member-special.html',
            'http://www.uniqlo.com/my/store/kids-babies/featured/e-member-special.html'
        ];

        for(let page of offerPages){
            let options = core.buildOptions(page);
            requestPromise(options).
            then(function($){
                uniqloProcessor.uniqloProcess($)
            }).
            catch(function(err){
                console.log(err);
            })
        }

    },

    fos: function(){
        console.log('get fos data??');
    }

};