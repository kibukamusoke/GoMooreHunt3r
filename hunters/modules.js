/**
 * Created by Trevor on 7/10/17.
 */

let cheerio = require('cheerio');
let requestPromise = require('request-promise');
let core = require('./core/core');


let padiniProcessor = require('./padini');
let uniqloProcessor = require('./uniqlo');
let eosProcessor = require('./everydayonsale');
let directdProcessor = require('./directd');
let thmProcessor = require('./techhypermart');
let boniaProcessor = require('./bonia');
let HnMProcessor = require('./hm');
let charlsekeithProcessor = require('./charlsekeith');
let bigsaleProcessor = require('./bigsale');

module.exports = {

    processPosts: function () {
        core.processPostQueue();
    },

    bigsale: function () {
        // last 20pages
        for(let x=1;x<10;x++){
            let options = core.buildOptions('http://www.bigsale.com.my/sale.aspx?pg='+x);
            requestPromise(options).
            then(function($){
                bigsaleProcessor.bigsaleProcess($)
            }).
            catch(function(err){
                console.log(err);
            })
        }

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

    eosPromotions: function () {
        // last 20pages
        for(let x=1;x<21;x++) {
            let options = core.buildOptions('http://www.everydayonsales.com/promotion-and-sales-malaysia/page/' + x);
            requestPromise(options)
                .then(function ($) {
                    eosProcessor.eosProcess($, 'promotions');
                })
                .catch(function (err) {
                    console.log(err);
                })
        }
    },

    eosEvents: function () {
        // last 20pages
        for(let x=1;x<21;x++) {
            let options = core.buildOptions('http://www.everydayonsales.com/malaysia-event/page/' + x);
            requestPromise(options)
                .then(function ($) {
                    eosProcessor.eosProcess($, 'events');
                })
                .catch(function (err) {
                    console.log(err);
                })
        }
    },

    eosSales: function () {
        // last 20pages
        for(let x=1;x<21;x++) {
            let options = core.buildOptions('http://www.everydayonsales.com/malaysia-sales/page/' + x);
            requestPromise(options)
                .then(function ($) {
                    eosProcessor.eosProcess($, 'sales');
                })
                .catch(function (err) {
                    console.log(err);
                })
        }
    },

    directd: function () {

            let options = core.buildOptions('http://directd.com.my/newproducts');
            requestPromise(options).
            then(function($){
                directdProcessor.directdProcess($);
            }).
            catch(function(err){
                console.log(err);
            })


    },
    techhypermart: function(){

        let root = 'http://www.techhypermart.com';
        let pages = [
            {
                page: '/notebooks.html',
                pageCount: 20
            },
            {
                page: '/apple-mac.html',
                pageCount: 1
           },
            {
                page: '/mobile-phones.html',
                pageCount: 3
            },
            {
                page: '/tablets.html',
                pageCount: 2
            },
            {
                page: '/computers.html',
                pageCount: 20
            },
            {
                page: '/pc-parts/motherboard.html',
                pageCount: 5
            },
            {
                page: '/pc-parts/cpu-processors.html',
                pageCount: 3
            },
            {
                page: '/pc-parts/ram-memory.html',
                pageCount: 4
            },
            {
                page: '/pc-parts/laptop-parts.html',
                pageCount:8
            },
            {
                page: '/printer.html',
                pageCount: 40
            },
            {
                page: '/projector.html',
                pageCount: 7
            },

        ];


        for(let page of pages){

            for(let x=1;x<page.pageCount;x++){

                let options = core.buildOptions(root + page.page+'?p='+x);

                setTimeout(function () {
                    requestPromise(options).
                    then(function($){
                        thmProcessor.thmProcess($)
                    }).
                    catch(function(err){
                        console.log(err);
                    },15000);
                })


            }

        }

    },
    bonia: function(){

        let offerPages = [
            'http://www.bonia.com/promotion/women.html',
            'http://www.bonia.com/promotion/men.html'
        ];

        for(let page of offerPages){
            let options = core.buildOptions(page);
            requestPromise(options).
            then(function($){
                boniaProcessor.boniaProcess($)
            }).
            catch(function(err){
                console.log(err);
            })
        }

    },

    HnM: function(){

        let offerPages = [
            'http://www2.hm.com/en_asia4/men/shop-by-product/view-all.html?product-type=men_all&sort=stock&offset=0&page-size=1000',
            'http://www2.hm.com/en_asia4/ladies/shop-by-product/view-all.html?product-type=ladies_all&sort=stock&offset=0&page-size=1000',
            'http://www2.hm.com/en_asia4/kids/shop-by-product/view-all.html?product-type=kids_all&sort=stock&offset=0&page-size=1000'
        ];

        for(let page of offerPages){
            let options = core.buildOptions(page);
            requestPromise(options).
            then(function($){
                HnMProcessor.hmProcess($);
            }).
            catch(function(err){
                console.log(err);
            })
        }

    },

    charlsekeith: function () {
        // last 11pages
        for(let x=1;x<11;x++) {
            let options = core.buildOptions('http://www.charleskeith.com/my/sale?p=' + x);
            requestPromise(options)
                .then(function ($) {
                    charlsekeithProcessor.charlsekeithProcess($);
                })
                .catch(function (err) {
                    console.log(err);
                })
        }
    },

    fos: function(){
        console.log('get fos data??');
    }

};