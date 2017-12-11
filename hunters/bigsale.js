/**
 * Created by kibuk on 7/15/2017.
 */

let db = require('./core/mongo');
let core = require('./core/core');
let requestPromise = require('request-promise');
let Promise = require('bluebird');
let totalCnt = 0; // result size of page
let totalGrabbed = 0;
let newItemsInserted = 0;

function findUrl($) {

    return new Promise((resolve, reject) => {
        try {
            $.each(function (index, stuff) {
                if ($.children('p').children('span').children('a').attr('href') !== 'undefined') {
                    resolve($.children('p').children('span').children('a').attr('href'));
                }

                if (index === $.length - 1) {
                    resolve();
                }

            });
        } catch (error) {
            console.log(error);
            resolve(error);
        }
    });
    //console.log(section);

    //console.log($(this).children('dd').children('p').children('span').children('a').attr('href'));
    //console.log(section.children('dd'));

}

function bigsaleDetail(url) {
    return new Promise((resolve, reject) => {

        let options = core.buildOptions(url);
         requestPromise(options).then(function ($) {
            let data = $('.promotion').children('.well');

             findUrl(data.children('.saleinfo').children('dl').children('dd'))
                .then((url) => {

                    let result = {
                        period: data.children('.text-muted').children('span').text().trim(),
                        description: data.children('.saleinfo').children('dl').children('dd').text().trim(),
                        url: ''
                    };
                    if (typeof url !== 'undefined') {
                        //console.log(url);
                        result.url = url;
                    }

                    resolve(result);

                }).catch(error => {
                    console.log(error);
                    resolve() ;
                });


        }).catch(function (err) {
            console.log(err);
            resolve();
        })

    })

}

module.exports = {

    bigsaleProcess: function ($) {

        let cnt = 0;

        return new Promise((resolve, reject) => {
            let metadataJson = [];
            let cnt_a = 0;
            let cnt_b = 0;
            let level1 = $('.product-list-inline-small');
            let level2 = [];
            level1.each(function (i, element) {
                console.log(i);
                cnt_a++;
                level2 = $(this).children('.col-sm-3');

                level2.each(function (index, ele) {
                    cnt ++;
                    //console.log(cnt);
                    cnt_b++;
                    totalCnt++;
                    totalGrabbed++;

                    let href = $(this).children('a').attr('href');
                    let thumbnail = $(this).children('.thumbnail');
                    let image = thumbnail.children('a').children('img').attr('src');
                    let productName = thumbnail.children('a').children('.caption').children('h5').text().trim();
                    let period = thumbnail.children('a').children('.caption').children('.meta-info').text().trim();
                    bigsaleDetail(href)
                        .then((detail) => {
                            //console.dir(detail);
                            if (detail) {
                                let item = {
                                    type: 'promotions',
                                    index: index,
                                    source: 'bigsale',
                                    contact: '',
                                    location: '',
                                    url: detail.url ? detail.url : href,
                                    image: image,
                                    productName: productName,
                                    description: detail.description,
                                    oldPrice: '',
                                    newPrice: '',
                                    status: 0
                                };
                                let filter = {
                                    url: detail.url ? detail.url : href
                                };

                                metadataJson.push(item);
                                //console.log(item);
                                db.update(filter, item)
                                    .then((id) => {
                                    if(id !== null){
                                        newItemsInserted++;
                                    }
                                    console.log('cnt b = ' + cnt_b + 'index = ' + index);
                                        if (level2.length-1 === index) {
                                            //console.log('all done');
                                            let stat = {
                                                total: totalCnt,
                                                processed: totalGrabbed,
                                                newItems: newItemsInserted
                                            };
                                            resolve(stat);


                                        }
                                    })
                                    .catch((e) => { // resolve anyway?
                                        console.log('not caught 1');
                                        resolve(e);
                                    })

                            } else {
                                console.log('not caught 2');
                                resolve();
                            }


                        }).catch((error) => {
                        console.log('not caught');
                        resolve(error);
                    })

                });
                /*

                let imageData = $(this).children('');
                let href = imageData.children('a').attr('href');
                let image = imageData.children('a').children('.front').children('img').attr('src');

                let productName = $(this).children('h3.product-name').children('a').text().trim();

                let priceData = $(this).children('.price-box');
                let oldPrice = priceData.children('.old-price').children('span.price').text().trim();

                let newPrice = priceData.children('.special-price').children('span.price').text().trim();

                // get description data first

                new Promise(function (resolve, reject) {

                    let detail = boniaDetail(href);
                    if(detail !== null)
                        resolve(detail);
                    else
                        reject();

                })
                    .then((description) => {
                        let item = {
                            index: index,
                            source: 'bonia',
                            contact:'+603.2284.1749',
                            location:'Lot G.031, Ground Floor, Mid Valley Megamall, Mid Valley City, 59200 Lingkaran Syed Putra, Federal Territory of Kuala Lumpur, Malaysia',
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
                        console.log(item);
                        db.update(filter,item); // upsert
                        //metadataJson.push(item);
                    })
                    .catch(err => {
                        console.log(err);
                    });
                */


            });
        });


    }
};