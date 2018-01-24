require('dotenv').config();
var mongodb = require('mongodb').MongoClient,
    url = 'mongodb://localhost:27017';

var add_awaiting_input = (senderId, fburl) => {
    return new Promise((resolve, reject) => {
        mongodb.connect(url, (err, db) => {
            if (err) throw err;
            db.db('cspheartsync').collection('input_pending').insertOne({
                id: senderId,
                type: 'mess',
                fburl: fburl,
                mess: ''
            })
        })
    })
}

var remove_awaiting_input = (senderId) => {
    return new Promise((resolve, reject) => {
        mongodb.connect(url, (err, db) => {
            if (err) throw err;
            db.db('cspheartsync').collection('input_pending').deleteMany(
                {
                    id: senderId,
                    type: 'mess'
                }
            )
        })
    })
}

module.exports = {
    add : add_awaiting_input,
    remove : remove_awaiting_input
}