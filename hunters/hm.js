/**
 * Created by Trevor on 20/07/2017.
 */


let db = require('./core/mongo');
let core = require('./core/core');
let requestPromise = require('request-promise');

function hmDetail(url){
    let options = core.buildOptions(url);
    return requestPromise(options).
    then(function($){

        return $('.product-detail-description-text').text().trim();
    }).
    catch(function(err){
        return '';
    })

}

module.exports = {

    hmProcess: function ($) {
        console.log('hello');
        let metadataJson = [];
        let index = 0;
        $('.product-items-wrapper').children('.product-items').each(function (i, element) {

            let section = $(this);
            section.children('.product-items-content').children('.row').children('.col-3').each(function (i, element) {


                let itembox = $(this).children('.product-item');
                let addressInfo = itembox.children('a');
                let href = 'http://www2.hm.com' + addressInfo.attr('href');
                let images = addressInfo.children('img');
                let image1 = 'http:' + images.attr('src');
                let image2 = 'http:' + images.attr('data-altimage');
                let details = itembox.children('.product-item-details');
                let productName = details.children('h3.product-item-heading').children('a').text().trim();
                let newPrice = details.children('.price').text().trim();

                // get description data first

                new Promise(function (resolve, reject) {

                    let detail = hmDetail(href);
                    if (detail !== null)
                        resolve(detail);
                    else
                        reject();

                })
                    .then((description) => {
                        let item = {
                            index: index,
                            source: 'H-and-M',
                            contact: '+60.35613.7288',
                            location: 'OB5.G.1, Sunway Pyramid Shopping Mall, 3, Jalan PJS 11/15, Bandar Sunway, Subang Jaya, 47500 Selangor, Malaysia',
                            url: href,
                            image: image1,
                            image2: image2,
                            productName: productName,
                            description: description,
                            oldPrice: newPrice, // no old price
                            newPrice: newPrice,
                            status: 0
                        };
                        let filter = {
                            url: href
                        };
                        //console.log(item);
                         db.update(filter,item); // upsert
                        //metadataJson.push(item);
                    })
                    .catch(err => {
                        console.log(err);
                    });

            });
        });
    }
};
