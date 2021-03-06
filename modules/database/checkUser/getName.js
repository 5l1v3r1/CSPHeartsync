require('dotenv').config()
var mongodb = require('mongodb').MongoClient,
url = process.env.URL_DB;
var getName = (senderId) => {
    return new Promise((resolve, reject) => {
        mongodb.connect(url, (err, db) => {
            if (err) throw err;
            db.db('cspheartsync').collection('users').find({ _id: senderId.toString() }).toArray((err, res) => {
                resolve(res[0].name);
            })
        })
    })
}
module.exports = { getName: getName };   