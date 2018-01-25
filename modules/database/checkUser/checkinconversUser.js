require('dotenv').config()
var mongodb = require('mongodb').MongoClient,
url = 'mongodb://localhost:27017';
var checkincovers = (senderId) => {
    return new Promise((resolve, reject) => {
        mongodb.connect(url, (err, db) => {
            if (err) throw err;
            let collect = db.db('cspheartsync').collection('users');
            collect.find({ _id: senderId.toString() }).toArray(function (err, result) {
                if (err) return reject(err)
                if(result==null || result==''){return resolve(null)}
                let incovers = result[0].inconversation;
                resolve(incovers);
                db.close ();
            });
        })
    })
}
module.exports = { checkincovers: checkincovers }