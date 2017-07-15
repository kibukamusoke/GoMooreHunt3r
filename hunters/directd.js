/**
 * Created by kibuk on 7/15/2017.
 */


let db = require('./core/mongo');

module.exports = {

    directdProcess: function($){

        let metadataJson = [];
        let index = 0;
        $('div.product-grid').children('.item-box').each(function (i, element) {
            index++;
            //console.log($(this));
            let productWrapper = $(this).children('.product-item');

            let imageInfo = productWrapper.children('.picture').children('a');
            let image = imageInfo.children('img').attr('src');

            let href = 'http://directd.com.my' + imageInfo.attr('href');

            let details = productWrapper.children('.details');
            let productName = details.children('h2.product-title').children('a').text();
            let description = details.children('.description').text();
            let priceData = details.children('.add-info').children('.prices');
            let newPrice = priceData.children('.actual-price').text();
            let oldPrice = priceData.children('.old-price').text();

            let item = {
                index:index,
                source:'directd',
                contact:'+603.5621.1355',
                location:'LNo. 58,62,64,69,77,79 & 85 Jalan SS15/4B Subang Jaya, 47500 Selangor Malaysia',
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

        });

        //db.insert(metadataJson); // bulk insert
        //console.log(metadataJson);

    }
};