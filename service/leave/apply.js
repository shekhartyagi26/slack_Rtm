var leave_ = require('../leaveApply');
var moment = require('moment');
require('node-import');
imports('config/index');

exports.apply = function (message, dm, id,session,date,time,rtm,user,from,to,reason, callback) {
    console.log({from:from,to:to})
    exists(id);
        function exists(id) {
        var check_session = session[id] ? true : false;
        if (check_session == false) {
            start(id);
            rtm.sendMessage(user.name + '!' + ' can you please provide me the details \n from (YYYY-MM-DD) ', dm.id);
        } else if (check_session == true && date == true || date == false) {
            if (date == true && from == '') {
                touch(id);
                from = message.text;
                callback(from);
                set(id, 'from', message.text);
                rtm.sendMessage('to (YYYY-MM-DD)', dm.id);
            } else if (date == true && from != '' && to == '') {
                to = message.text;
                callback(from,to);
                touch(id);
                set(id, 'to', message.text);
                rtm.sendMessage('reason', dm.id);
            } else if (from != '' && to != '' && reason == '') {
                // console.log({from:from,to:to})
                touch(id);
                reason = message.text;
                set(id, 'reason', message.text);
                var fromDate = moment(from, "YYYY-MM-DD");
                var toDate = moment(get(id, 'to'), "YYYY-MM-DD");
                var duration = toDate.diff(get(id, 'from'), 'days');
                var number_of_day = duration + 1;
                if (number_of_day > 0) {
                    // request({
                    //     url: config.url, //URL to hit
                    //     method: 'GET',
                    //     qs: {"action": 'apply_leave', "userslack_id": message.user, "from_date": from,
                    //         "to_date": to, "no_of_days": number_of_day, "reason": reason}
                    // }, function (error, response, body) {
                    //     if (error) {
                    //         callback(error);
                    //     } else {
                    //         destory(id);
                    //         rtm.sendMessage('your leave application has been submitted', dm.id);
                    //         to = '';
                    //         from = '';
                    //         reason = '';
                    //     }
                    // });
                } else {
                    rtm.sendMessage('you must have to apply leave for more than one day !', dm.id);
                    destory(id);
                }
            }
        }
    }
    function get(id, key, callback) {
        if (session[id]) {
            return session[id][key]
        } else {
//doesnt exist throw error
            return false
        }
    }

    function touch(id) {
        if (session[id]) {
            session[id].start = time;
            clearTimeout(session[id].timeout)
            session[id].timeout = setTimeout(function () {
                destory(id); //auto expire after 5sec
            }, 50000000)
        } else {
//doesnt exist throw error
        }
    }

    function set(id, key, value) {
        if (session[id]) {
            session[id][key] = value;
        } else {
//doesnt exist throw error
        }
    }

    function start(id) {
        session[id] = {};
        session[id].start = time;
        session[id].timeout = setTimeout(function () {
            destory(id); //auto expire after 5sec
        }, 5000000)
    }

    function destory(id) {
        session[id] = {}
        delete session[id]
    }


};