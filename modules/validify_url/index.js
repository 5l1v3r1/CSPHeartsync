var check_url_validity = (str) => {
    var pattern = new RegExp('^(https?:\/\/)?' + // protocol
        '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|' + // domain name
        '((\d{1,3}\.){3}\d{1,3}))' + // OR ip (v4) address
        '(\:\d+)?(\/[-a-z\d%_.~+]*)*' + // port and path
        '(\?[;&a-z\d%_.~+=-]*)?' + // query string
        '(\#[-a-z\d_]*)?$', 'i'); // fragment locater
    if (!pattern.test(str)) {
        return false;
    } else {
        return true;
    }
}

var validify = (str) => {
    var spl = str.split ('.');
    var res;
    for (var i = 1; i < spl.length; ++i)
    {
        res += spl[i];
    }
    return spl;
}

module.exports = {
    check_url_validity: check_url_validity,
    validify: validify
}