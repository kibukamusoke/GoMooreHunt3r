/**
 * Created by Trevor on 7/10/17.
 */

let Promise = require('bluebird');

let Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
   // BSON = require('mongodb').pure().BSON,
    assert = require('assert');

let connection;
let collectionName = 'hunt3r';

function getConnection () {
    return new Promise((resolve,reject) => {
        if(typeof connection !== 'undefined'){
            resolve(connection);
        } else {
            MongoClient.connect(
                "mongodb://gomoore:gomoore@ds147882.mlab.com:47882/simspin",
                {native_parser: true},
                function (err, db) {
                    assert.equal(null, err);
                    if (db) {
                        connection = db;
                        resolve(db);
                    } else {
                        console.log(err);
                        reject(err);
                    }
                });
        }
    })
}


let close = function () {
    if(typeof connection !== 'undefined') {
        connection.close();
    }
};

module.exports = {

    close: function () {
      close();
    },

    insert: function(docs){
        getConnection().then(connection =>
                connection.collection(collectionName).insertMany(docs, function (err, result) {
                //assert.equal(null, err);
                //assert.equal(1, result);

                if (err) throw err;
                console.log(result);

            })).catch(error => {
            console.log(error);
        });

    },

    update: function(filter,doc,upsert=true){
        //console.log(connection);
        getConnection().then(connection =>
            connection.collection(collectionName).updateOne(filter,doc,{upsert:upsert}, function (err, result) {
                if (err) {
                    console.log(err);
                }
                console.log('upserted ID : ' + result.upsertedId);
            })
        ).catch(error => {
            console.log(error);
        });

    },

    query: function(filter,options){
        return new Promise((resolve,reject) => {
            getConnection().then(connection => {
                let stream = connection.collection(collectionName)
                    .find(filter, options)
                    .stream();

                if(stream){
                    resolve(stream)
                }
                else {
                    reject(error);
                }

            });
        })
    }


};


