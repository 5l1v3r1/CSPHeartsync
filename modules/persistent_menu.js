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
                        }]
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
};

request({
    url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
    qs: {
        access_token: process.env.PAGE_TOKEN
    },
    method: 'POST',
    json: menu
})