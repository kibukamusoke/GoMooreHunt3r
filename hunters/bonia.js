/**
 * Created by kibuk on 7/15/2017.
 */

let db = require('./core/mongo');
let core = require('./core/core');
let requestPromise = require('request-promise');
let Promise = require('bluebird');

let totalCnt = 0; // result size of page
let totalGrabbed = 0;
let newItemsInserted = 0;

function boniaDetail(url) {

    return new Promise((resolve, reject) => {
        //resolve('');
        //return;
        let options = core.buildOptions(url);
         requestPromise(options).then(function ($) {
            let data = $('.short-description').children('.std');
            let description = data.children('p').text().trim();
            let features = '';

            let dd = data.children('ul');

            if(dd.contents().length > 0){
                dd.children('li').each(function (i, element) {
                    features += $(this).text();
                    if (i > 0) {
                        features += ',';
                    }

                    if(i > dd.contents().length -2) {
                        description += features;
                        resolve(description);
                    }

                });
            } else {

                resolve(description);
            }



        }).catch(function (err) {
            resolve(err);
        })
    });

}

module.exports = {

    boniaProcess: function ($) {

        return new Promise((resolve, reject) => {
            let metadataJson = [];

            let items = $('.item');


            items.each(function (i, element) {

                let imageData = $(this).children('.item-product-image-box');
                let href = imageData.children('a').attr('href');
                let image = imageData.children('a').children('.front').children('img').attr('src');

                let productName = $(this).children('h3.product-name').children('a').text().trim();

                let priceData = $(this).children('.price-box');
                let oldPrice = priceData.children('.old-price').children('span.price').text().trim();

                let newPrice = priceData.children('.special-price').children('span.price').text().trim();

                // get description data first
                    console.log(href);

                   boniaDetail(href)
                    .then((description) => {
                        let item = {
                            index: i,
                            type: 'store-sales',
                            source: 'bonia',
                            contact: '+603.2284.1749',
                            location: 'Lot G.031, Ground Floor, Mid Valley Megamall, Mid Valley City, 59200 Lingkaran Syed Putra, Federal Territory of Kuala Lumpur, Malaysia',
                            url: href,
                            image: image,
                            productName: productName,
                            description: description,
                            oldPrice: oldPrice,
                            newPrice: newPrice,
                            status: 0
                        };
                        let filter = {
                            url: href
                        };
                        //console.log(item);



                        db.update(filter, item);



                    })
                    .catch(err => {
                        //console.log(err);
                    });

                if(items.length-1 === i) {
                    resolve();
                }


            });
        });

    }
};