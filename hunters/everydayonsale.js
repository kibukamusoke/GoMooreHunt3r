/**
 * Created by Trevor on 7/11/17.
 */

let db = require('./core/mongo');
let core = require('./core/core');
let requestPromise = require('request-promise');
let Promise = require('bluebird');


function eosDetail(url) {
    let options = core.buildOptions(url);
    return requestPromise(options).then(function ($) {
        let data = $('.entry');
        return {
            image: data.children('p').children('a').attr('href'),
            period: '',
            description: data.text().trim()
        };


    }).catch(function (err) {
        return '';
    })
}

module.exports = {


    eosProcess: function ($, type) {


        return new Promise((resolve, reject) => {
            let metadataJson = [];
            let index = 0;
            let items = $('div.maincontent');
            items.each(function (i, element) {
                index++;
                let content_ = $(this).children('.entry');
                let a = content_.children('a');
                let href = a.attr('href');
                let imgdata = a.children('img');
                //let image = imgdata.attr('src').split('?')[0];
                let title = content_.children('h2').children('a').text();
                let short_detail = content_.children('p').text();


                eosDetail(href)
                    .then((detail) => {
                        //console.dir(detail);
                        if (detail) {

                            let item = {
                                index: index,
                                type: type,
                                source: 'everydayonsales',
                                contact: '',
                                location: '',
                                url: (detail.url ? detail.url : href),
                                image: detail.image,
                                productName: title,
                                oldPrice: 0,
                                newPrice: 0,
                                status: 0,
                                short_detail: short_detail,
                                description: detail.description
                            };


                            let filter = {
                                url: (detail.url ? detail.url : href)
                            };

                            db.update(filter, item); // upsert
                            metadataJson.push(item);
                            console.log(item);
                            if (items.length - 1 === i) {
                                resolve();
                            }


                        }
                    }).catch((error) => {
                    console.log(error);
                    resolve(error);
                });


            });
        });


    }
};