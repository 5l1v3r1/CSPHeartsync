require('dotenv').config()
var mongodb = require('mongodb').MongoClient,
url = process.env.URL_DB;
var check_waiting_input = (senderId, input_type) => {
    return new Promise((resolve, reject) => {
        mongodb.connect(url, (err, db) => {
            if (err) throw err;
            let collect = db.db('cspheartsync').collection('input_pending');
            collect.find({ _id: senderId.toString(), type: input_type }).toArray ((err, res) => 
            {
                if (err) reject (err);
                if (input_type === 'mess')
                {
                    if (res == null) resolve (false);
                    resolve (res[0].fburl);
                }
                else
                {
                    if (res == null) resolve (false);
                    else resolve (true);   
                }
            });
        })
    })
}
module.exports = { check_waiting_input: check_waiting_input }