/**
 * Created by Trevor on 7/10/17.
 */

let db = require('./core/mongo');

module.exports = {

    padiniProcess: function($){

        let metadataJson = [];
        let index = 0;
        $('li.item').each(function (i, element) {
            index++;
            //console.log($(this));
            let inner = $(this).children('.inner');
            let productWrapper = inner.children('.product-image-wrapper');
            let infoUrl = productWrapper.children();
            let href = infoUrl.attr('href');
            let imageInfo = infoUrl.children('img');
            let image = imageInfo.attr('src');

            let brandname = inner.children('.brand-name');
            let productNameData = inner.children('h2');
            let productNameDetail = productNameData.children();
            let productName = productNameDetail.attr('title');
            let price = inner.children('.price-box');
            let PriceData = price.children();
            let Price = PriceData.children('.price').text().replace('\\n','').trim().split('\n');
            let oldPrice = Price[0].trim();
            let newPrice = Price[1].trim();
            let item = {
                index:index,
                type: 'store-sales',
                source:'padini',
                contact:'+603 5021 0600',
                location:'Lot G52,AEON Bukit Tinggi Shopping Centre NO.1, Persiaran Batu Nilam 1/KS6 Bandar Bukit Tinggi 2 Selangor Malaysia',
                url:href,
                image:image,
                brandname:brandname.text(),
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
            //console.log(item);

        });

        //db.insert(metadataJson); // bulk insert
        //console.log(metadataJson);

    },

    padiniProcessTest: function ($) {
        let metadataJson = [];
        $('span.comhead').each(function (i, element) {
            let a = $(this).prev();
            let rank = a.parent().parent().text();
            let title = a.text();
            let url = a.attr('href');
            let subtext = a.parent().parent().next().children('.subtext').children();
            let points = $(subtext).eq(0).text();
            let username = $(subtext).eq(1).text();
            let comments = $(subtext).eq(2).text();
            // Our parsed meta data object
            let metadata = {
                rank: parseInt(rank),
                title: title,
                url: url,
                points: parseInt(points),
                username: username,
                comments: parseInt(comments)
            };

            metadataJson.push(metadata);
            //console.log(metadata);
        });
        console.log(metadataJson);
    }

};