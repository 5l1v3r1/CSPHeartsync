require('dotenv').config()
var mongodb = require('mongodb').MongoClient,
url = 'mongodb://localhost:27017';
var check_in_db = (senderId) => {
    return new Promise((resolve, reject) => {
        mongodb.connect(url, (err, db) => {
            if (err) throw err;
            let collect = db.db('cspheartsync').collection('users');
            collect.count({ _id: senderId.toString() }).then (cnt =>
            {
                if (cnt === 0) resolve (false);
                else resolve (true)
            })
        })
    })
}
module.exports = { check: check_in_db }