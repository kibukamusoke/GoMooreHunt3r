/**
 * Created by Trevor on 7/10/17.
 */

var db = require('./core/mongo');

module.exports = {

    padiniProcess: function($){

        var metadataJson = [];
        var index = 0;
        $('li.item').each(function (i, element) {
            index++;
            //console.log($(this));
            var inner = $(this).children('.inner');
            var productWrapper = inner.children('.product-image-wrapper');
            var infoUrl = productWrapper.children();
            var href = infoUrl.attr('href');
            var imageInfo = infoUrl.children('img');
            var image = imageInfo.attr('src');

            var brandname = inner.children('.brand-name');
            var productNameData = inner.children('h2');
            var productNameDetail = productNameData.children();
            var productName = productNameDetail.attr('title');
            var price = inner.children('.price-box');
            var PriceData = price.children();
            var Price = PriceData.children('.price').text().replace('\\n','').trim().split('\n');
            var oldPrice = Price[0].trim();
            var newPrice = Price[1].trim();
            var item = {
                index:index,
                url:href,
                image:image,
                brandname:brandname.text(),
                productname:productName,
                oldPrice:oldPrice,
                newPrice:newPrice
            };


            metadataJson.push(item);
            //console.log(item);

        });

        db.insert(metadataJson);
        //console.log(metadataJson);

    },

    padiniProcessTest: function ($) {
        var metadataJson = [];
        $('span.comhead').each(function (i, element) {
            var a = $(this).prev();
            var rank = a.parent().parent().text();
            var title = a.text();
            var url = a.attr('href');
            var subtext = a.parent().parent().next().children('.subtext').children();
            var points = $(subtext).eq(0).text();
            var username = $(subtext).eq(1).text();
            var comments = $(subtext).eq(2).text();
            // Our parsed meta data object
            var metadata = {
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