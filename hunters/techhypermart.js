/**
 * Created by kibuk on 7/15/2017.
 */

/**
 * Created by kibuk on 7/15/2017.
 */


let db = require('./core/mongo');
let Promise = require('bluebird');

module.exports = {

    thmProcess: function($){

        return new Promise((resolve, reject) => {
            let metadataJson = [];
            let index = 0;
            //$('div.category-products').children('ul.products-grid').each(function (i, element) {
             //   index++;
                //console.log($(this));

                //$(this).children('li.item').each(function (i,element) {

            let items = $('li.item');
            items.each(function (i,element) {

                    let productWrapper = $(this);
                    let imageInfo = productWrapper.children('a');
                    let href = imageInfo.attr('href');
                    let image = imageInfo.children('img').attr('src');
                    let details = productWrapper.children('.item-bottom');
                    let productName = details.children('h2.product-name').children('a').text();
                    let priceData = details.children('.price-box');
                    let oldPrice = priceData.children('.old-price').children('span.price').text().trim();
                    let newPrice = priceData.children('.special-price').children('span.price').text().trim();

                    let item = {
                        index:index,
                        type: 'store-sales',
                        source:'techhypermart',
                        contact:'+03.8070.0996',
                        location:'Tech Hypermart SDN BHD (838654-D) 99, Jalan Kenari 23, Bandar Puchong Jaya, 47100 Puchong, Selangor.',
                        url:href,
                        image:image,
                        productName:productName,
                        oldPrice:oldPrice,
                        newPrice:newPrice,
                        status:0
                    };

                    let filter = {
                        url:href
                    };

                    db.update(filter,item); // upsert
                    metadataJson.push(item);
                    console.log(item);

                    if(items.length-1 === i) {
                        resolve();
                    }

                })


            });

            //db.insert(metadataJson); // bulk insert
            //console.log(metadataJson);
       // });


    }
};