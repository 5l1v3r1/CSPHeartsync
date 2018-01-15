require('dotenv').config()
var checkinconvers = require('../checkUser/checkinconversUser'),
    mongodb = require('mongodb').MongoClient(),
    request = require('request'),
    url = process.env.URL_DB;
sendMessage = require('../../api/facebookAPI/sendMessage'),
    var find_fb_ava_id = (fburl) => {
        return new Promise((resolve, reject) => {
            request({
                url: '000webhost.....',
                method: "get",
                // chua ro, can hoi them
            }, (err, res, body) => {
                if (err) reject(err);
                if (res.body.error) reject(res.body.error);
                resolve(res);
            })
        })
    }

var send_message = (message, fburl) => {
    return new Promise((resolve, reject) => {
        find_fb_ava_id(fburl).then(img_id => {
            mongodb.connect(url, (err, db) => {
                if (err) throw (err);
                let collect = db.db('cspheartsync').collection('user');
                collect.find({
                    pic_id = img_id
                }).toArray((err, res) => {
                    if (err) reject(err);
                    if (res == null) {
                        resolve('not_found');
                    } else {
                        sendMessage.sendBotMessage(res[0]._id, "Bạn có một tin nhắn bí ẩn", "Tin nhắn sẽ gửi ngay bây giờ");
                        sendMessage.sendTextMessage(res[0]._id, message);
                        resolve('ok');
                    }
                })
            })
        })
    })
}