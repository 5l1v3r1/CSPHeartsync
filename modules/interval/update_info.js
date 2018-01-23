require('dotenv').config()
var request = require('request'),
    mongodb = require('mongodb').MongoClient,
    url = process.env.URL_DB || 'mongodb://localhost:27017';
var get_info = (senderId) => {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://graph.facebook.com/v2.11/' + senderId,
            qs: {
                access_token: process.env.PAGE_TOKEN
            },
            method: "GET"
        }, (err, res, body) => {
            if (err) return reject(err);
            body = JSON.parse(body);
            var obj = {
                name: body.last_name + " " + body.first_name,
                profile_pic: body.profile_pic,
                gender: body.gender,
                pic_id: body.profile_pic.split('_')[1].toString(),
            };
            resolve(obj);
        })
    })
}

function execute() {
    console.log ('updating ' + (new Date ().getTime ()).toString());
    mongodb.connect(url, (err, db) => {
        if (err) throw err;
        var collection = db.db('cspheartsync').collection('users');
        var cursor = collection.find(),
            infos = []
        cursor.each((err, user) => {
            if (err) throw err;
            if (user) {
                var info = get_info(user._id);
                infos.push({
                    id: user._id,
                    info: info
                })
            }
        })
        infos.forEach((item) => {
            var info = item.info;
            collection.updateOne({
                _id: item.id,
            }, {
                $set: {
                    name: info,
                    profile_pic: info.profile_pic,
                    gender: info.gender,
                    pic_id: info.pic_id
                }
            })
        })
    })
}

function run() {
    setInterval(execute, 1800000);
}

module.exports = {
    update: run
}