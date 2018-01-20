require('dotenv').config()
var mongodb = require ('mongodb').MongoClient,
    url = 'mongodb://localhost:27017/cspheartsync',
    request = require('request');
var menu = {
        "persistent_menu": [{
            "locale": "default",
            "composer_input_disabled": false,
            "call_to_actions": [{
                    "title": "Nhắn tin",
                    "type": "nested",
                    "call_to_actions": [{
                            "title": "Ghép đôi",
                            "type": "nested",
                            "call_to_actions": [{
                                    "title": "Bắt đầu",
                                    "type": "postback",
                                    "payload": "START_CHATTING"
                                },
                                {
                                    "title": "Kết thúc (Hủy bỏ)",
                                    "type": "postback",
                                    "payload": "END_CHAT"
                                }
                            ]
                        },
                        {
                            "title": "Tin nhắn bí ẩn",
                            "type": "nested",
                            "call_to_actions": [{
                                    "title": "Gửi tin",
                                    "type": "postback",
                                    "payload": "ANON_MESSAGE"
                                },
                                {
                                    "title": "Dừng nhận tin",
                                    "type": "postback",
                                    "payload": "STOP_RECEIVING"
                                },
                                {
                                    "title": "Tiếp tục nhận tin",
                                    "type": "postback",
                                    "payload": "START_RECEIVING"
                                }
                            ]
                        }
                    ]
                },
                {
                    "title": "Trợ giúp",
                    "type": "postback",
                    "payload": "HELP"
                },
                {
                    "title": "Liên hệ",
                    "type": "web_url",
                    "url": "https://www.facebook.com/ADAPT.CSP/"
                }
            ]
        }]
    },
    get_started = {
        "get_started": {
            "payload": "GET_STARTED_PAYLOAD"
        }
    }
request({
    url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
    qs: {
        access_token: process.env.PAGE_TOKEN
    },
    method: 'POST',
    json: menu
})
request({
    url: "https://graph.facebook.com/v2.6/me/messenger_profile",
    qs: {
        access_token: process.env.PAGE_TOKEN
    },
    method: 'POST',
    json: get_started
})
mongodb.connect (url, (err, db) =>
{
    db.createUser ({
        user: process.env.ACC_DB,
        pwd: process.env.PWD,
        roles: ["dbOwner"]
    })
})