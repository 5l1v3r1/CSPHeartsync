var request = require('request');
require('dotenv').config()
class sendMessage {
    constructor() {
        this._token = process.env.PAGE_TOKEN || ""
    }
    sendBotMessage(senderId, title, content) {
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token: this._token
            },
            method: "POST",
            json: {
                recipient: {
                    id: senderId
                },
                "message": {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "generic",
                            "elements": [{
                                "title": title,
                                "subtitle": content
                            }]
                        }
                    }
                }
            }
        }, (err, res, body) => {
            if (err) return console.log("Error: " + err)
            if (res.body.error) return console.log("err: " + res.body.error)
        })
    }
    sendBotMessageWithPromise(senderId, title, content) {
        return new Promise((resolve, reject) => {
            request({
                url: 'https://graph.facebook.com/v2.6/me/messages',
                qs: {
                    access_token: this._token
                },
                method: "POST",
                json: {
                    recipient: {
                        id: senderId
                    },
                    "message": {
                        "attachment": {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [{
                                    "title": title,
                                    "subtitle": content
                                }]
                            }
                        }
                    }
                },
            }, (err, res, body) => {
                if (err) throw (err);
                if (res.body.error) throw (res.body.error);
                resolve('ok')
            })
        })
    }
    sendTextMessage(senderId, text) {
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token: this._token
            },
            method: "POST",
            json: {
                recipient: {
                    id: senderId
                },
                message: {
                    text: text
                },
            }
        }, (err, res, body) => {
            if (err) return console.log("Error: " + err)
            if (res.body.error) return console.log("err: " + res.body.error)
        })
    }
    sendImage(senderId, url) {
        request({
                url: 'https://graph.facebook.com/v2.6/me/messages',
                qs: {
                    access_token: this._token
                },
                method: 'POST',
                json: {
                    recipient: {
                        id: senderId
                    },
                    message: {
                        attachment: {
                            type: "image",
                            payload: {
                                url: url
                            }
                        },
                    }
                }
            },
            (err, res, body) => {
                if (err) return console.log("Error: " + err)
                if (res.body.error) return console.log("err: " + res.body.error)
            })
    }
    sendButtonSelectGender(senderId) {
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token: this._token
            },
            method: "POST",
            json: {
                recipient: {
                    id: senderId
                },
                message: {
                    attachment: {
                        type: "template",
                        payload: {
                            template_type: "button",
                            text: "Bạn muốn người ghép đôi tiếp theo có giới tính gì nào?",
                            buttons: [{
                                    type: "postback",
                                    payload: "SELECT_MALE",
                                    title: "Nam"
                                },
                                {
                                    type: "postback",
                                    payload: "SELECT_FEMALE",
                                    title: "Nữ"
                                },
                                {
                                    type: "postback",
                                    payload: "SELECT_ANY",
                                    title: "Nam hay nữ đều được"
                                }
                            ]
                        }
                    }
                }
            }
        }, (err, res, body) => {
            if (err) return console.log("Error: " + err)
            if (res.body.error) return console.log("err: " + res.body.error)
        })
    }
    sendButtonConfirm(senderId, fburl) {
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token: this._token
            },
            method: "POST",
            json: {
                recipient: {
                    id: senderId
                },
                message: {
                    attachment: {
                        type: "template",
                        payload: {
                            template_type: "button",
                            text: ("Bạn có chắc là muốn gửi tin nhắn trên đến cho người dùng: " + fburl + "chứ ???"),
                            buttons: [
                                {
                                    type: "postback",
                                    payload: "YES",
                                    title: "Có"
                                },
                                {
                                    type: "postback",
                                    payload: "NO",
                                    title: "Không"
                                }
                            ]
                        }
                    }
                }
            }
        }, (err, res, body) => {
            if (err) return console.log("Error: " + err)
            if (res.body.error) return console.log("err: " + res.body.error)
        })
    }
    sendTextMessageWithPromise(senderId, text) {
        return new Promise((resolve, reject) => {
            request({
                url: 'https://graph.facebook.com/v2.6/me/messages',
                qs: {
                    access_token: this._token
                },
                method: "POST",
                json: {
                    recipient: {
                        id: senderId
                    },
                    message: {
                        text: text
                    }
                }
            }, (err, res, body) => {
                if (err) throw (err);
                if (res.body.error) throw (res.body.error);
                resolve('ok')
            })
        })
    }
    sendVideo(senderId, url) {
        request({
                url: 'https://graph.facebook.com/v2.6/me/messages',
                qs: {
                    access_token: this._token
                },
                method: 'POST',
                json: {
                    recipient: {
                        id: senderId
                    },
                    message: {
                        attachment: {
                            type: "video",
                            payload: {
                                url: url
                            }
                        },
                    }
                }
            },
            (err, res, body) => {
                if (err) return console.log("Error: " + err)
                if (res.body.error) return console.log("err: " + res.body.error)
            })
    }
    sendAudio(senderId, url) {
        request({
                url: 'https://graph.facebook.com/v2.6/me/messages',
                qs: {
                    access_token: this._token
                },
                method: 'POST',
                json: {
                    recipient: {
                        id: senderId
                    },
                    message: {
                        attachment: {
                            type: "audio",
                            payload: {
                                url: url
                            }
                        },
                    }
                }
            },
            (err, res, body) => {

                console.log(res.body.error)
            })
    }
}
module.exports = new sendMessage()