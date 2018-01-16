require('dotenv').config()
var mongodb = require('mongodb').MongoClient,
url = process.env.URL_DB;
var check_waiting_input = (senderId, input_type) => {
    return new Promise((resolve, reject) => {
        mongodb.connect(url, (err, db) => {
            if (err) throw err;
            let collect = db.db('cspheartsync').collection('input_pending');
            collect.find({ id: senderId.toString(), type: input_type }).toArray ((err, res) => 
            {
                if (err) reject (err);
                if (input_type === 'mess')
                {
                    if (typeof res == 'undefined' || res == null || res.length == 0) resolve (false);
                    else resolve (res[0].fburl);
                }
                else
                {
                    if (typeof res == 'undefined' || res == null || res.length == 0) resolve (false);
                    else resolve (true);   
                }
            });
        })
    })
}
module.exports = { check_waiting_input: check_waiting_input }