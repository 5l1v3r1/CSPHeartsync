require('dotenv').config()
var mongodb = require('mongodb').MongoClient,
    url = process.env.URL_DB,
    getFav = require('../checkUser/checkFav'),
    getGender = require('../checkUser/checkGender'),
    pair = require('./pair'),
    inconverPending = require('../resUser/inconverPending');
var pending = async (senderId) => {
    let favorite = await (getFav.checkFav(senderId));
    let gender = await (getGender.checkGender(senderId));
    mongodb.connect(url, (err, db) => {
        if (err) throw err;
        let collect = db.db('cspheartsync').collection('pending');
        collect.insert({
            _id: senderId.toString(),
            favorite: favorite,
            gender: gender,
            timestamp: new Date().getTime().toString()
        }, (err, res) => {
            if (err) throw err;
            inconverPending.inconverPending(senderId)
        });

    })
}

module.exports = {
    pending: pending
}