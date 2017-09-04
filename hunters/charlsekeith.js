/**
 * Created by Trevor on 7/19/2017.
 */


let db = require('./core/mongo');
let core = require('./core/core');
let requestPromise = require('request-promise');

function charlsekeithDetail(url){
    let options = core.buildOptions(url);
    return requestPromise(options).
    then(function($){

        $('dd').children('.short-description').each(function (i, element) {
            return $(this).children('.std').text().trim();
        })
    }).
    catch(function(err){
        return '';
    })

}

module.exports = {

    charlsekeithProcess: function ($) {

        let metadataJson = [];
        let index = 0;
        $('.products-grid').children('.item').each(function (i, element) {
            index++;

            let item = $(this);
            let addressInfo = item.children('a');
            let href = addressInfo.attr('href');
            let imageInfo = addressInfo.children('img');
            let image = imageInfo.attr('src');
            let details = item.children('.product-info');
            let productName = details.children('h2.product-name').text().trim();
            let priceDetails = details.children('.price-box');
            let oldPrice = priceDetails.children('p.old-price').children('.price').text().trim();
            let newPrice = priceDetails.children('p.special-price').children('.price').text().trim();

            // get description

            new Promise(function (resolve, reject) {

                let detail = charlsekeithDetail(href);
                if(detail !== null)
                    resolve(detail);
                else
                    reject();

            })
                .then((description) => {
                    let item = {
                        index: index,
                        type: 'store-sales',
                        source: 'charlsekeith',
                        contact:'+60.37726.5522',
                        location:'Lot G307, Ground FLoor, Highstreet, 1 Utama Shopping Centre, 1, Lebuh Bandar Utama, Bandar Utama, 47800 Petaling Jaya, Selangor, Malaysia',
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
                    //console.log(item);
                    db.update(filter,item); // upsert
                    //metadataJson.push(item);
                })
                .catch(err => {
                    console.log(err);
                });




        });
    }
}



