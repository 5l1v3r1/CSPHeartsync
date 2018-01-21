require('dotenv').config();
var mongodb = require('mongodb').MongoClient,
    url = process.env.URL_DB;

var add_awaiting_input = (senderId, fburl, mess, tp) => {
    return new Promise((resolve, reject) => {
        mongodb.connect(url, (err, db) => {
            if (err) throw err;
            db.db('cspheartsync').collection('input_pending').insertOne({
                id: senderId,
                type: 'confirm',
                fburl: fburl,
                mess: {
                    tp: tp,
                    cont: mess
                }
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
                    type: 'confirm'
                }
            )
        })
    })
}

module.exports = {
    add : add_awaiting_input,
    remove : remove_awaiting_input
}