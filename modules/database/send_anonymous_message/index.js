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
            if (err) {
                throw (err);
                resolve('not_found');
            }
            if (res.body.error) {
                throw (res.body.error);
                resolve('not_found')
            }
            resolve(body);
        })
    })
}

var send_message = (message, fburl, message_type) => {
    return new Promise((resolve, reject) => {
        find_fb_ava_id(fburl).then(img_id => {
            if (img_id == 'not_found') {
                resolve('not found')
            } else {
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
                            if (res[0].accept_mess === false) {
                                resolve('not receiving')
                            } else {
                                checkinconvers.checkincovers(receiverId).then(inconvers => {
                                    if (inconvers === 0) {
                                        sendMessage.sendBotMessageWithPromise(receiverId, "Bạn có một tin nhắn bí ẩn", "Tin nhắn sẽ gửi ngay bây giờ").then(result => {
                                            if (message_type == 'text') {
                                                sendMessage.sendTextMessage(receiverId, message);
                                            } else if (message_type == 'img') {
                                                sendMessage.sendImage(receiverId, message);
                                            } else if (message_type == 'video') {
                                                sendMessage.sendVideo(receiverId, message);
                                            } else if (message_type == 'audio') {
                                                sendMessage.sendAudio(receiverId, message);
                                            }
                                            resolve('ok');
                                        })
                                    } else {
                                        dbase.db('cspheartsync').collection('pending_message').insertOne({
                                            message: message,
                                            receiverId: receiverId,
                                            message_type: message_type
                                        }, (err, res) => {
                                            resolve('ok');
                                        })
                                    }
                                })
                            }
                        }
                    })
                })
            }
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
                            if (element.message_type == 'text') {
                                sendMessage.sendTextMessage(receiverId, element.message);
                            } else if (element.message_type == 'img') {
                                sendMessage.sendImage(receiverId, element.message);
                            } else if (element.message_type == 'video') {
                                sendMessage.sendVideo(receiverId, element.message);
                            } else if (element.message_type == 'audio') {
                                sendMessage.sendAudio(receiverId, element.message);
                            }
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