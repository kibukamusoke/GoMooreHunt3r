/**
 * Created by Trevor on 7/10/17.
 */

let cheerio = require('cheerio');
let requestPromise = require('request-promise');
let db = require('./mongo');
let Promise = require('bluebird');

function updateStatus(id, status) {
    filter = { _id: id};
    doc = {
        status: status
    };
    db.update(filter,doc,false);
}

function postToBackend(payload) {

    adjustedPayload = {
        title:payload.productName,
        long_text:(payload.description) ? payload.description : payload.productName,
        detail_url:payload.url,
        video_url:'',
        sales_promotion:payload.productName,
        contact_person:'sales',
        contact_number:payload.contact,
        location:payload.location,
        picture_amount:1,
        cover_pic:payload.image
        //sales_promotion:
    };

    let options = {
        method: 'POST',
        uri: process.env.POST_URL || 'https://a1.go-moore.com/index.php/Services/Campaign_Creation/add_campaign',
        body: adjustedPayload,
        json: true // Automatically stringifies the body to JSON
    };

    return new Promise((resolve,reject) => {
        requestPromise(options)
            .then(function (parsedBody) {
                console.log('success');
                console.log(parsedBody);
                resolve(true);
            })
            .catch(function (err) {
                console.log(err);
                reject(false);
            });
    });

}


module.exports = {

    buildOptions: function(url){
        return {
            uri: url,
            transform: function (body) {
                return cheerio.load(body);
            }
        };
    },

    processPostQueue: function () {
        console.log('sending posts');
        filter = {
            status:0
        };
        options = {
            sort : { _id:-1 }
            //limit: 10
        };

        db.query(filter,options).then((stream) => {
            stream.on("data",function (item) {
                // post to backend
                postToBackend(item)
                    .then((result) => {
                    if(result === true){
                        console.log(item);
                        updateStatus(item._id,1);
                    }
                })
                    .catch((error) => {
                        console.log(error);
                    });

             });

             stream.on("end", function() {
                 //db.close();
             });
        });


    },

    postToSlack: function(data) {
        let slackWebhook = 'https://hooks.slack.com/services/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';
        let options = {
            method: 'POST',
            uri: process.env.SLACKWEBHOOK_URL || slackWebhook,
            body: {text : data},
            json: true // Automatically stringifies the body to JSON
        };

        return new Promise((resolve,reject) => {
            requestPromise(options)
                .then(function (parsedBody) {
                    //console.log('success');
                    //console.log(parsedBody);
                    resolve(parsedBody);
                })
                .catch(function (err) {
                    //console.log(err);
                    reject(err);
                });
        });
    }


};