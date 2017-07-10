/**
 * Created by Trevor on 7/10/17.
 */

let cheerio = require('cheerio');
let requestPromise = require('request-promise');
let db = require('./mongo');

function updateStatus(id, status) {
    filter = { _id: id};
    doc = {
        status: status
    };
    db.update(filter,doc,false);
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
        filter = {
            status:0
        };
        options = {
            sort : { _id:-1 }
        };
        db.query(filter,options).then((stream) => {
            stream.on("data",function (item) {
                // post to backend
                core.postToBackend(item)
                    .then((result) => {
                    if(result === true){
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

    postToBackend: function(payload) {
        let options = {
            method: 'POST',
            uri: 'http://api.go-moore.com',
            body: payload,
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




};