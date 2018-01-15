var request = require('request');
require('dotenv').config()
var getFbInfo = (senderId) => {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://graph.facebook.com/v2.11/' + senderId,
            qs: {
                access_token: process.env.PAGE_TOKEN || "EAALBIgDENZB8BAMavZBWhN7ECJnzsWtaZCOaaaZCZAfcw6qjDTQYMNQQqQ8Ix5pnWLN3m0h8MKOfoTosHjlwhF5bkQSdiHrwRyRPq9zEIqZAhWsL6JQYpkoNLhWB62C7yQZBc9zsZBZBmLuX6Ph9JzqMU490olnZBIamA6cRKLeZBJX2AZDZD"
            },
            method: "GET"
        }, (err, res, body) => {
            if (err) return reject(err);
            body = JSON.parse(body);
            var obj = {
                name: body.last_name + " " + body.first_name,
                profile_pic: body.profile_pic,
                gender: body.gender,
                _id: body.id + "",
                favorite: "none",
                inconversation: 0, //0 no, 1 pending, 2 yep
                pic_id: body.profile_pic.split('_')[1].toString(),
                accept_mess: true
            };
            resolve(obj);
        })
    })
}
getFbInfo(1746618088744994)
module.exports = { getFbInfo: getFbInfo };
