//var session = {};

exports.mySession = function (cb) {
    var session = {};
    cb(session);
};

exports.get = function (session, id, key, callback) {
    if (session[id]) {
        return session[id][key];
    } else {
//doesnt exist throw error
        return false;
    }
};

exports.touch = function (session, id, time) {
    if (session[id]) {
        session[id].start = time;
        clearTimeout(session[id].timeout);
        session[id].timeout = setTimeout(function () {
            destory(id); //auto expire after 5sec
        }, 50000000);
    } else {
//doesnt exist throw error
    }
};

exports.set = function (session, id, key, value) {
    if (session[id]) {
        session[id][key] = value;
    } else {
//doesnt exist throw error
    }
};

exports.start = function (session, id, time) {
    session[id] = {};
    session[id].start = time;
    session[id].timeout = setTimeout(function () {
        destory(id); //auto expire after 5sec
    }, 5000000);
};

exports, destory = function (session, id) {
    session[id] = {};
    delete session[id];
};