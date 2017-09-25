/**
 * Created by kibuk on 7/15/2017.
 */

/**
 * Created by kibuk on 7/15/2017.
 */


let db = require('./core/mongo');
let core = require('./core/core');
let requestPromise = require('request-promise');

function detail(url) {
    let options = core.buildOptions(url);
    return requestPromise(options).
    then(function($){
        let ret = $('.deal-desc').text();
        //console.log(ret);
        return ret;
    }).
    catch(function(err){
        return '';
    })
}

module.exports = {

    doaProcess: function($){

        let metadataJson = [];
        let index = 0;
        $('section#deals').children('section.deal').each(function (i, element) {
            index++;
            //console.log($(this));
            let href = $(this).children('.col-xs-4').children('div').children('a').attr('href');
            let image = $(this).children('.col-xs-4').children('div').children('a').children('img').attr('src');
            let productName = $(this).children('section.col-xs-8').children('header').children('a').text().trim();
            let short_detail = $(this).children('section.col-xs-8').children('section.deal-desc').children('p').text();
            let newPrice = $(this).children('.col-xs-4').children('div').children('span.our-price').text().trim();
            let oldPrice = $(this).children('.col-xs-4').children('div').children('span.list-price').text().trim();
            let iUrl = $(this).children('section.col-xs-8').children('header').children('a').attr('href');
            detail(iUrl)
                .then((stuff) => {
                //console.log(stuff);
                    let item = {
                        index:index,
                        type: 'sales',
                        source:'dealsofamerica',
                        contact:'',
                        location:'',
                        url: href,
                        image:image,
                        productName:productName,
                        oldPrice:oldPrice,
                        newPrice:newPrice,
                        status:0,
                        short_detail: short_detail,
                        description: stuff
                    };



                    let filter = {
                        url:href
                    };

                    db.update(filter,item); // upsert
                    metadataJson.push(item);
                    console.log(item);
                })
                .catch((err) => {
                    console.log(err);
                })


        });


    }
};