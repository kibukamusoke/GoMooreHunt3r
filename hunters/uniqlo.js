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
                contact:'+603 5523 4850',
                location:'G-39, Ground Floor, AEON Mall Shah Alam, No.1, Jalan Akuatik 13/64, D’Kayangan, Seksyen 13, 40100 Shah Alam, Selangor',
                url: href,
                image: image,
                productName: productName,
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
        });

    }
};