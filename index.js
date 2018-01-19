var app = require('express')(),
    bodyParser = require('body-parser'),
    http = require('http'),
    bot = require('./modules/bot');
    require('dotenv').config()


server = http.createServer(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
var addr = process.env.LOCALHOST_ADDR,
    webhook_addr = addr + '/webhook';
app.get(addr, (req, res) => {
    res.send("It work!!");
})

app.get(webhook_addr, function (req, res) {
    if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN|| '') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Oops :< Wrong token. So sorry <3');
});

app.post(webhook_addr, function (req, res) {
    var entries = req.body.entry;
    for (var entry of entries) {
        var messaging = entry.messaging;
        for (var message of messaging) {
            var senderId = message.sender.id;
            if (message.message) {
                if (message.message.text) {
                    bot.reply(senderId, message.message.text);
                }
                if (message.message.attachments) {
                    let type = message.message.attachments[0].type;
                    if (type === 'image') {
                        let payload = message.message.attachments[0].payload.url;
                        bot.procImage(senderId, payload);
                    }
                    if (type === 'video') {
                        let payload = message.message.attachments[0].payload.url;
                        bot.procVideo(senderId, payload);
                    }
                    if (type === 'audio') {
                        let payload = message.message.attachments[0].payload.url;
                        bot.procAudio(senderId, payload);
                    }
                }
            }
            if (message.postback) {
                let payload = message.postback.payload;
                bot.procPostback(senderId, payload);
            }
        }
    }
    res.status(200).send("OK");
});

app.set('port', process.env.PORTs);
app.set('ip', process.env.IP || "127.0.0.1");

server.listen(app.get('port'), app.get('ip'), function () {
    console.log("Express server listening at %s:%d ", app.get('ip'), app.get('port'));
});