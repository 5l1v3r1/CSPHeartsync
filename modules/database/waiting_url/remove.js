require('dotenv').config();
var mongodb = require('mongodb').MongoClient,
    url = process.env.URL_DB;

var remove_awaiting_input = (senderId) => {
    return new Promise((resolve, reject) => {
        mongodb.connect(url, (err, db) => {
            if (err) throw err;
            db.db ('cspheartsync').collection('input_pending').deleteMany (
                {
                    _id = senderId.toString (),
                    type = 'url'
                }
            )
        })
    })
}
module.exports = {
    remove: remove_awaiting_input
}