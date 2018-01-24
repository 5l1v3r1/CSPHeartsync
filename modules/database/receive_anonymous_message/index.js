require('dotenv').config();
var mongodb = require('mongodb').MongoClient,
    url = process.env.URL_DB || 'mongodb://localhost:27017';

var start_receiving_message = (ID) => {
    return new Promise((resolve, reject) => {
        mongodb.connect(url, (err, db) => {
            if (err) throw err;
            db.db('cspheartsync').collection('users').updateOne ({
                _id: ID
            }, {$set : {accept_mess: true}})
        })
    })
}

var stop_receiving_message = (ID) => {
    return new Promise((resolve, reject) => {
        mongodb.connect(url, (err, db) => {
            if (err) throw err;
            db.db('cspheartsync').collection('users').updateOne({
                _id: ID
            }, { $set: { accept_mess: false } })
        })
    })
}

module.exports = {
    start_receiving: start_receiving_message,
    stop_receiving: stop_receiving_message
}