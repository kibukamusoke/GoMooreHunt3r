/**
 * Created by kibuk on 7/15/2017.
 */

let db = require('./core/mongo');
let core = require('./core/core');
let requestPromise = require('request-promise');

function boniaDetail(url) {
    let options = core.buildOptions(url);
    return requestPromise(options).
    then(function($){
        let data = $('.short-description').children('.std');
        let description = data.children('p').text().trim();
        let features = '';
        let index = 0;
        data.children('ul').children('li').each(function (i, element) {
            features += $(this).text();
            if(index > 0)
                features += ',';
        });

        description += features;
        return description;
    }).
    catch(function(err){
        return '';
    })
}

module.exports = {

    boniaProcess: function ($) {

        let metadataJson = [];
        let index = 0;
        $('.products-grid').children('.item').each(function (i, element) {
            index++;
            let imageData = $(this).children('.item-product-image-box');
            let href = imageData.children('a').attr('href');
            let image = imageData.children('a').children('.front').children('img').attr('src');

            let productName = $(this).children('h3.product-name').children('a').text().trim();

            let priceData = $(this).children('.price-box');
            let oldPrice = priceData.children('.old-price').children('span.price').text().trim();

            let newPrice = priceData.children('.special-price').children('span.price').text().trim();
            
            // get description data first 
            
            new Promise(function (resolve, reject) {

                let detail = boniaDetail(href);
                if(detail !== null)
                    resolve(detail);
                else
                    reject();

            })
                .then((description) => {
                    let item = {
                        index: index,
                        source: 'bonia',
                        contact:'+603.2284.1749',
                        location:'Lot G.031, Ground Floor, Mid Valley Megamall, Mid Valley City, 59200 Lingkaran Syed Putra, Federal Territory of Kuala Lumpur, Malaysia',
                        url: href,
                        image: image,
                        productName: productName,
                        description: description,
                        oldPrice: oldPrice,
                        newPrice: newPrice,
                        status:0
                    };
                    let filter = {
                        url: href
                    };
                    console.log(item);
                    db.update(filter,item); // upsert
                    //metadataJson.push(item);
                })
                .catch(err => {
                    console.log(err);
                });


        });

    }
};