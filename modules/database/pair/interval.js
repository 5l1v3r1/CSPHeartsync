require('dotenv').config()
var mongodb = require('mongodb').MongoClient,
    url = process.env.URL_DB,
    pair = require('./pair');
var Pr = (collection) => {
    return new Promise((resolve, reject) => {
        collection.find().sort({
            time: -1
        }).limit(1).toArray((err, r) => {
            pair.pair(r[0]._id, r[0].gender, r[0].favorite).then(res => {
                if (res === 'matched') resolve(true);
                else resolve(false);
            });
        })
    })
}
var execute = () => {
    mongodb.connect(url, (err, db) => {
        if (err) throw err;
        let collection = db.db('cspheartsync').collection('pending');
        collection.count().then(count => {
            var cnt = count;
            for (var i = 0; i < cnt; ++i) {
                (async() => {
                    let a = await (Pr(collection));
                    if (a === true) cnt -= 2;
                })()
            }
        })
    })
}