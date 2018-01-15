require('dotenv').config();
var mongodb = require('mongodb').MongoClient,
    url = process.env.URL_DB;

var add_awaiting_input = (senderId, fburl) => {
    return new Promise((resolve, reject) => {
        mongodb.connect(url, (err, db) => {
            if (err) throw err;
            db.db('cspheartsync').collection('input_pending').insertOne({
                _id = senderId.toString(),
                type = 'message',
                fburl = fburl
            })
        })
    })
}

module.exports = {
    add: add_awaiting_input
}