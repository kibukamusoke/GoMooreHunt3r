/**
 * Created by Trevor on 7/10/17.
 */

var Db = require('mongodb').Db,
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


var connection;

MongoClient.connect("mongodb://gomoore:gomoore@ds147882.mlab.com:47882/simspin", {native_parser:true}, function(err, db) {
    assert.equal(null, err);

    connection = db;
});

var close = function () {
    connection.close();
};

module.exports = {

    insert: function(docs){
        connection.collection('hunt3r').insertMany(docs, function (err, result) {
            //assert.equal(null, err);
            //assert.equal(1, result);

            if (err) throw err;

        });
    }


};


