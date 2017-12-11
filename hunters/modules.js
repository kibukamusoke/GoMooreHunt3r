/**
 * Created by Trevor on 7/10/17.
 */

let cheerio = require('cheerio');
let requestPromise = require('request-promise');
let core = require('./core/core');
let Promise = require('bluebird');


let padiniProcessor = require('./padini');
let uniqloProcessor = require('./uniqlo');
let eosProcessor = require('./everydayonsale');
let directdProcessor = require('./directd');
let thmProcessor = require('./techhypermart');
let boniaProcessor = require('./bonia');
let HnMProcessor = require('./hm');
let charlsekeithProcessor = require('./charlsekeith');
let bigsaleProcessor = require('./bigsale');
let dealsofamericaProcessor = require('./dealsofamerica');


let allstats = [];
let allErrors = [];

function formatSlackNotification(title, data) {
    console.log(data);
    if (data.length < 1) {
        console.log('no data to format... aborting ...');
        return;
    }
    let message = title + '\n';
    message += '==============================='+'\n';

    /*data.forEach((d, i) => {
        if (i > 0) {
            message += '---------------------------------';
        }

        Object.keys(d).forEach(function (key) {
            let value = d[key];
            message += key + ': ' + value;
        });

    });*/



    message += data + '\n' + '================================';
    return message

}

let thisDOA = function (url) {
    return new Promise((resolve, reject) => {
        let options = core.buildOptions(url);
        requestPromise(options).then(function ($) {
            dealsofamericaProcessor.doaProcess($)
                .then(() => {
                    resolve();
                }).catch(() => {
                resolve();
            })
        }).catch(function (err) {
            console.log(err);
            resolve();
        })
    })
};


let thisBigsale = function (url) {
    console.log(url);
    return new Promise((resolve, reject) => {
        let options = core.buildOptions(url);
        requestPromise(options).then(function ($) {
            bigsaleProcessor.bigsaleProcess($)
                .then((stats) => {

                    resolve();
                }).catch((e) => {

                resolve(e);
            })
        }).catch(function (err) {
            console.log(err);
            resolve(e);
        })
    });
};

let thisPADINI = function (url) {

    console.log(url);
    return new Promise((resolve, reject) => {
        let options = core.buildOptions(url);
        requestPromise(options).then(function ($) {
            padiniProcessor.padiniProcess($)
                .then(resolve)
                .catch(resolve);
        }).catch(function (err) {
            resolve();
            console.log(err);
        })
    })

};

let thisUNIQLO = function (page) {
    return new Promise((resolve, reject) => {

        let options = core.buildOptions(page);
        requestPromise(options).then(function ($) {
            uniqloProcessor.uniqloProcess($)
                .then(resolve)
                .catch(resolve)
        }).catch(function (err) {
            console.log(err);
            resolve();
        })


    });
};

let thisEOS = function (page) {
    return new Promise((resolve, reject) => {

        let options = core.buildOptions(page);
        requestPromise(options)
            .then(function ($) {
                eosProcessor.eosProcess($, 'promotions')
                    .then(resolve)
                    .catch(resolve);
            })
            .catch(function (err) {
                console.log(err);
                resolve();
            })

    });
};

let thisTHM = function (page) {
    return new Promise((resolve, reject) => {
        let options = core.buildOptions(page);

        requestPromise(options).then(function ($) {
            thmProcessor.thmProcess($)
                .then(resolve)
                .catch(resolve);

        }).catch(function (err) {
            console.log(err);

        })
    })
};

let thisBONIA = function (page) {
    return new Promise((resolve, reject) => {
        let options = core.buildOptions(page);
        requestPromise(options).then(function ($) {
            boniaProcessor.boniaProcess($)
                .then((stats) => {
                    resolve();
                }).catch((e) => {

                resolve(e);
            })
        }).catch(function (err) {
            console.log(err);
            resolve(err);
        })
    });
};


let thisHnM = function (page) {
    return new Promise((resolve, reject) => {

        let options = core.buildOptions(page);
        requestPromise(options).then(function ($) {
            HnMProcessor.hmProcess($)
                .then(resolve)
                .catch(resolve);
        }).catch(function (err) {
            console.log(err);
        })

    });
}

module.exports = {

    processPosts: function () {
        core.processPostQueue();
    },

    dealsOfamerica: function () {
        return new Promise((resolve, reject) => {
            // last 20pages
            let pages = [1, 2, 3, 4, 5];
            pages.forEach((page, index) => {
                pages[index] = 'https://www.dealsofamerica.com/hot-deals-page' + page + '.php';
            });

            let runAll = Promise.resolve(pages).map(thisDOA, {concurrency: 1});

            runAll.then(() => {
                console.log('all done');
                core.postToSlack(formatSlackNotification('New Data','Deals or America promos hunt3d'))

                resolve();
            })
        });
    },

    bigsale: function () {
        // last 20pages
        return new Promise((resolve, reject) => {
            let successNotifications = [];
            let errorNotifications = [];
            let pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 20];

            pages.forEach((page, index) => {
                pages[index] = 'http://www.bigsale.com.my/sale.aspx?pg=' + page;
            });


            let runAll = Promise.resolve(pages).map(thisBigsale, {concurrency: 1});

            runAll.then(() => {
                console.log('all done');
                core.postToSlack(formatSlackNotification('New Data','Big Sale Data Hunt3d'));
                resolve();
            });


            /*

            Promise.all(promises)
                .then(() => {
                    console.log('sending success notifications');
                    successNotifications.forEach((notify, index) => {
                        core.postToSlack(notify);
                    });

                    resolve()
                })
                .catch((e) => {
                    console.log(e);
                    console.log('sending error notifications');
                    errorNotifications.forEach((notify, index) => {
                        core.postToSlack(notify);
                    });
                    reject(e);
                });

                */
        });
    },

    padini: function () {

        return new Promise((resolve, reject) => {
            // last 20pages
            let pages = [];
            for (let x = 1; x < 21; x++) {
                pages.push('https://www.padini.com/deals.html?p=' + x);
            }

            console.log(pages);

            let runAll = Promise.resolve(pages).map(thisPADINI, {concurrency: 1});

            runAll.then(() => {
                console.log('all done');
                core.postToSlack(formatSlackNotification('New Data','Padini Data Hunt3d'));
                resolve();
            });


        });


    },

    uniqlo: function () {

        return new Promise((resolve, reject) => {

            let pages = [
                'http://www.uniqlo.com/my/store/women/featured/e-member-special.html',
                'http://www.uniqlo.com/my/store/men/featured/e-member-special.html',
                //'http://www.uniqlo.com/my/store/kids-babies/featured/e-member-special.html'
            ];

            let runAll = Promise.resolve(pages).map(thisUNIQLO, {concurrency: 1});

            runAll.then(() => {
                core.postToSlack(formatSlackNotification('New Data','UNIQLO Data Hunt3d'));
                console.log('all done');
                resolve();
            });

        })


    },

    eosPromotions: function () {
        // last 20pages
        return new Promise((resolve, reject) => {
            let pages = [];
            for (let x = 1; x < 21; x++) {
                pages.push('http://www.everydayonsales.com/promotion-and-sales-malaysia/page/' + x);
            }


            let runAll = Promise.resolve(pages).map(thisEOS, {concurrency: 1});

            runAll.then(() => {
                console.log('all done');
                core.postToSlack(formatSlackNotification('New Data','EOS Promotions Data Hunt3d'));
                resolve();
            });
        });

    },

    eosEvents: function () {

        return new Promise((resolve, reject) => {
            let pages = [];
            for (let x = 1; x < 21; x++) {
                pages.push('http://www.everydayonsales.com/malaysia-event/page/' + x);
            }

            let runAll = Promise.resolve(pages).map(thisEOS, {concurrency: 1});

            runAll.then(() => {
                console.log('all done');
                core.postToSlack(formatSlackNotification('New Data','EOS Events Data Hunt3d'));
                resolve();
            });
        })

    },

    eosSales: function () {
        return new Promise((resolve, reject) => {
            let pages = [];
            for (let x = 1; x < 21; x++) {
                pages.push('http://www.everydayonsales.com/malaysia-sales/page/' + x);
            }

            let runAll = Promise.resolve(pages).map(thisEOS, {concurrency: 1});

            runAll.then(() => {
                console.log('all done');
                core.postToSlack(formatSlackNotification('New Data','EOS Sales Data Hunt3d'));
                resolve();
            });
        })

    },

    directd: function () {
        return new Promise((resolve, reject) => {

            let options = core.buildOptions('http://directd.com.my/newproducts');
            requestPromise(options).then(function ($) {
                directdProcessor.directdProcess($)
                    .then(() => {
                        console.log('all done');
                        core.postToSlack(formatSlackNotification('New Data','Direct D Data Hunt3d'));
                        resolve()
                    }).catch((e) => {
                    resolve();
                })
            }).catch(function (err) {
                console.log(err);
                resolve();
            })

        })


    },
    techhypermart: function () {

        return new Promise((resolve, reject) => {

            let root = 'http://www.techhypermart.com';
            let pages = [
                {
                    page: '/notebooks.html',
                    pageCount: 20
                },
                {
                    page: '/apple-mac.html',
                    pageCount: 1
                },
                {
                    page: '/mobile-phones.html',
                    pageCount: 3
                },
                {
                    page: '/tablets.html',
                    pageCount: 2
                },
                {
                    page: '/computers.html',
                    pageCount: 20
                },
                {
                    page: '/pc-parts/motherboard.html',
                    pageCount: 5
                },
                {
                    page: '/pc-parts/cpu-processors.html',
                    pageCount: 3
                },
                {
                    page: '/pc-parts/ram-memory.html',
                    pageCount: 4
                },
                {
                    page: '/pc-parts/laptop-parts.html',
                    pageCount: 8
                },
                {
                    page: '/printer.html',
                    pageCount: 40
                },
                {
                    page: '/projector.html',
                    pageCount: 7
                },

            ];

            let p_pages = [];

            for (let page of pages) {
                for (let x = 1; x < page.pageCount; x++) {
                    p_pages.push(root + page.page + '?p=' + x);
                }
            }

            let runAll = Promise.resolve(p_pages).map(thisTHM, {concurrency: 1});

            runAll.then(() => {
                console.log('all done');
                core.postToSlack(formatSlackNotification('New Data','Tech Hyper Mart Data Hunt3d'));
                resolve();
            })
        });


    },
    bonia: function () {


        return new Promise((resolve, reject) => {

            let successNotifications = [];
            let errorNotifications = [];

            let offerPages = [
                'https://www.bonia.com/promotion/women/show/all.html',
                'https://www.bonia.com/promotion/men/show/all.html'
            ];

            let runAll = Promise.resolve(offerPages).map(thisBONIA, {concurrency: 1});

            runAll.then(() => {
                console.log('all done');
                core.postToSlack(formatSlackNotification('New Data','BONIA Data Hunt3d'));
                resolve();
            });

        });


    },

    HnM: function () {

        return new Promise((resolve, reject) => {
            let offerPages = [
                'http://www2.hm.com/en_asia4/men/shop-by-product/view-all.html?product-type=men_all&sort=stock&offset=0&page-size=1000',
                'http://www2.hm.com/en_asia4/ladies/shop-by-product/view-all.html?product-type=ladies_all&sort=stock&offset=0&page-size=1000',
                'http://www2.hm.com/en_asia4/kids/shop-by-product/view-all.html?product-type=kids_all&sort=stock&offset=0&page-size=1000'
            ];

            let runAll = Promise.resolve(offerPages).map(thisHnM, {concurrency: 1});

            runAll.then(() => {
                console.log('all done');
                core.postToSlack(formatSlackNotification('New Data','H and M Data Hunt3d'));
                resolve();
            });
        });


    },

    charlsekeith: function () {
        // last 11pages
        for (let x = 1; x < 11; x++) {
            let options = core.buildOptions('http://www.charleskeith.com/my/sale?p=' + x);
            requestPromise(options)
                .then(function ($) {
                    charlsekeithProcessor.charlsekeithProcess($);
                })
                .catch(function (err) {
                    console.log(err);
                })
        }
    },

    fos: function () {
        console.log('get fos data??');
    }

};