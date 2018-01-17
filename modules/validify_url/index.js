var valid_url = require ('valid-url');
var check_url_validity = (url) => {
    if (valid_url.isUri (url))
    {
        return true;
    }
    else 
    {
        return false;
    }
}

var validify = (str) => {
    var spl = str.split ('.');
    var res = "";
    for (var i = 1; i < spl.length; ++i)
    {
        res += spl[i] + ".";
    }
    return res;
}
module.exports = {
    check_url_validity: check_url_validity,
    validify: validify
}