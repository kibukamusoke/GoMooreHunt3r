/**
 * Created by Trevor on 7/10/17.
 */

let db = require('./core/mongo');

module.exports = {

    uniqloProcess: function ($) {

        let metadataJson = [];
        let index = 0;
        $('li.item').each(function (i, element) {
            index++;
            let infoUrl = $(this).children('a');
            let href = infoUrl.attr('href');
            let imageData = infoUrl.children('span');
            let image = imageData.children('img').attr('data-original');
            let itemData = $(this).children('.item_np_wrap');
            let productName = itemData.children('.product-name').text();
            let priceData = itemData.children('.price-box');
            let oldPriceData = priceData.children('.old-price');
            let oldPrice = oldPriceData.children('.price').text();

            let newPriceData = priceData.children('.special-price');
            let newPrice = newPriceData.children('.price').text();

            let item = {
                index: index,
                source: 'uniqlo',
                url: href,
                image: image,
                productName: productName,
                oldPrice: oldPrice,
                newPrice: newPrice
            };
            let filter = {
                url: href
            };
            //console.log(item);
            db.update(filter,item); // upsert
            //metadataJson.push(item);
        });

    }
};