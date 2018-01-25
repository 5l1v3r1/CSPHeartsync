require('dotenv').config()
var mongodb = require('mongodb').MongoClient,
    url = 'mongodb://localhost:27017',
    pair = require('../database/pair/pair');

function execute() {
    mongodb.connect(url, (err, db) => {
        if (err) throw err;
        let collect = db.db('cspheartsync').collection('pending');
        collect.count().then(cnt => {
            if (cnt >= 2) {
                collect.find().sort({
                    _time: 1
                }).limit(1).toArray((err, result) => {
                    pair.pair(result[0]._id.toString(), result[0].gender, result[0].favorite);
                })
            }
        })
    })
}

function run () {
    setInterval (execute, 300000);
}

module.exports = {
    pair : run
}