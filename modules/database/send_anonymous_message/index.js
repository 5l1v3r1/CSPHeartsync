require('dotenv').config()
var checkinconvers = require('../checkUser/checkinconversUser'),
    mongodb = require('mongodb').MongoClient(),
    request = require('request'),
    url = process.env.URL_DB;
sendMessage = require('../../api/facebookAPI/sendMessage');
    var find_fb_ava_id = (fburl) => {
        return new Promise((resolve, reject) => {
            request({
                url: 'http://getfbid.000webhostapp.com/getID/index.php?url='+encodeURI(fburl),
                method: "get"
                // chua ro, can hoi them
            }, (err, res, body) => {
                if (err) throw(err);
                if (res.body.error) throw(res.body.error);
                resolve(body);
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
                        let receiverId = res[0]._id;
                        let inconvers = checkinconvers.checkincovers (receiverId)
                        if (inconvers === 0) 
                        {
                            sendMessage.sendBotMessage(receiverId, "Bạn có một tin nhắn bí ẩn", "Tin nhắn sẽ gửi ngay bây giờ");
                            sendMessage.sendTextMessage(receiverID, message);
                            resolve('ok');
                        }
                        else
                        {
                            
                        }                        
                    }
                })
            })
        })
    })
}

find_fb_ava_id('https://www.facebook.com/nghminh163').then(res=>{console.log(res)})