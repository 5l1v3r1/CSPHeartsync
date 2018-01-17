require('dotenv').config()
var checkinconvers = require('../checkUser/checkinconversUser'),
    mongodb = require('mongodb').MongoClient,
    request = require('request'),
    url = 'mongodb://127.0.0.1:27017',
    sendMessage = require('../../api/facebookAPI/sendMessage');
var find_fb_ava_id = (fburl) => {
    return new Promise((resolve, reject) => {
        request({
            url: 'http://getfbid.000webhostapp.com/getID/index.php?url=' + encodeURI(fburl),
            method: "get"
        }, (err, res, body) => {
            if (err) throw (err);
            if (res.body.error) throw (res.body.error);
            resolve(body);
        })
    })
}

var send_message = (message, fburl) => {
    return new Promise((resolve, reject) => {
        find_fb_ava_id(fburl).then(img_id => {
            mongodb.connect(url, (err, dbase) => {
                if (err) throw err;
                img_id = parseInt(img_id).toString()
                dbase.db('cspheartsync').collection('users').find({
                    pic_id: img_id
                }).toArray((err, res) => {
                    if (err) throw err;
                    if (res == null || typeof res == 'undefined' || res.length == 0) {
                        resolve('not_found');
                    } else {
                        let receiverId = res[0]._id;
                        checkinconvers.checkincovers(receiverId).then(inconvers => {
                            if (inconvers === 0) {
                                sendMessage.sendBotMessageWithPromise(receiverId, "Bạn có một tin nhắn bí ẩn", "Tin nhắn sẽ gửi ngay bây giờ").then (result =>
                                {
                                    sendMessage.sendTextMessage(receiverId, message);
                                    resolve('ok');
                                })
                            } else {
                                dbase.db('cspheartsync').collection('pending_message').insertOne({
                                    message: message,
                                    receiverId: receiverId
                                }, (err, res) => {
                                    resolve(ok);
                                })
                            }
                        })
                    }
                })
            })
        })
    })
}
var fetch_message = (receiverId) => {
    return new Promise((resolve, reject) => {
        mongodb.connect(url, (err, db) => {
            if (err) throw err;
            var collect = db.db('cspheartsync').collection('pending_message')
            collect.find({
                receiverId: receiverId
            }).toArray((err, res) => {
                if (err) throw err;
                if (res.length != 0) {
                    sendMessage.sendBotMessageWithPromise(receiverId, "Bạn có " + res.length + " tin nhắn bí ẩn", "Tin nhắn sẽ gửi ngay bây giờ").then(a => {
                        res.forEach(element => {
                            sendMessage.sendTextMessage(receiverId, element.message);
                        });
                    });
                    resolve('sent');
                } else {
                    resolve('none');
                }
                collect.deleteMany({
                    receiverId: receiverId
                })
            })
        })
    })
}
module.exports = {
    send_message: send_message,
    fetch_message: fetch_message
}