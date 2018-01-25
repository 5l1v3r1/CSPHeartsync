require('dotenv').config()
var mongodb = require('mongodb').MongoClient,
url = 'mongodb://localhost:27017',
    getFbInfo = require('../../api/facebookAPI/getFbInfo');

var postInfoUser = async(senderId) => {
    var res = await (getFbInfo.getFbInfo(senderId));
    mongodb.connect(url, (err, db) => {
        if (err) throw err;
        let collect = db.db('cspheartsync').collection('users');
        collect.count({
            _id: senderId.toString()
        }).then(
            count => {
                if (count === 0)
                {
                    collect.insert(res);
                }
                db.close ();
            }
        )
    })
}
module.exports = {
    postInfoUser: postInfoUser
}