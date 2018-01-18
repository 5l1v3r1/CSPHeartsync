require('dotenv').config()
var request = require('request');
var menu = {
        "persistent_menu": [{
                "locale": "default",
                "composer_input_disabled": false,
                "call_to_actions": [{
                        "title": "Nhắn tin",
                        "type": "nested",
                        "call_to_actions": [{
                                "title": "Ghép đôi",
                                "type": "postback",
                                "payload": "START_CHATTING"
                            },
                            {
                                "title": "Tin nhắn bí ẩn",
                                "type": "postback",
                                "payload": "ANON_MESSAGE"
                            }
                        ]
                    },
                    {
                        "title": "Trợ giúp",
                        "type": "postback",
                        "payload": "HELP"
                    }
                ]
            },
        };

request({
    url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
    qs: {
        access_token: process.env.PAGE_TOKEN
    },
    method: 'POST',
    json: menu
})