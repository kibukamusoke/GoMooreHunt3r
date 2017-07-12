/**
 * Created by Trevor on 7/11/17.
 */

let db = require('./core/mongo');

module.exports = {

    eosProcess: function ($) {
        console.log('starting');
        let metadataJson = [];
        let index = 0;
        $('div.maincontent').each(function (i, element) {
            index++;
            let content_ = $(this).children('.entry');
            let a = content_.children('a');
            let href = a.attr('href');
            let imgdata = a.children('img');
            let image = imgdata.attr('src').split('?')[0];
            let title = content_.children('h2').children('a').text();
            let detail = content_.children('p').text();

            let item = {
                index:index,
                source:'everydayonsales',
                contact:'',
                location:'',
                url:href,
                image:image,
                productName:title,
                oldPrice:0,
                newPrice:0,
                status:0
            };
            let filter = {
                url:href
            };

            db.update(filter,item); // upsert
            metadataJson.push(item);
            //console.log(item);


        });

    }
};