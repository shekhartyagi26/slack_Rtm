var request = require('request');
var leave_ = require('../leaveApply');
var moment = require('moment');
require('node-import');
imports('config/index');

var from = '', to = '', reason = '';

//exports.apply = function (message, dm, id, session, date, time, rtm, user, from, to, reason, callback) {
exports.apply = function (message, dm, id, session, date, time, rtm, user, callback) {
    exists(id);
    function exists(id) {
        var check_session = session[id] ? true : false;
        if (check_session == false) {
            start(id);
            rtm.sendMessage(user.name + '!' + ' can you please provide me the details \n from (DD-MM-YYYY) ', dm.id);
        } else if (check_session == true && date == true || date == false) {
            if (date == true && from == '') {
                touch(id);
                from = message.text;
                set(id, 'from', message.text);
                rtm.sendMessage('to (DD-MM-YYYY)', dm.id);
                callback(from);
            } else if (date == true && from != '' && to == '') {
                touch(id);
                to = message.text;
                set(id, 'to', message.text);
                rtm.sendMessage('reason', dm.id);
                callback(from, to);
            } else if (from != '' && to != '' && reason == '') {
                var getFrom = get(id, 'from');
                var getTo = get(id, 'to');
                touch(id);
                reason = message.text;
                set(id, 'reason', message.text);
                rtm.sendMessage('Please wait...', dm.id);
                var fromDate = moment(getFrom, "DD-MM-YYYY");
                var toDate = moment(getTo, "DD-MM-YYYY");
                var duration = toDate.diff(fromDate, 'days');
                var number_of_day = duration + 1;
                if (number_of_day > 0) {
                    var myFromDate = moment(getFrom, 'DD-MM-YYYY').format('YYYY-MM-DD');
                    var myToDate = moment(getTo, 'DD-MM-YYYY').format('YYYY-MM-DD');
                    leave_.leaveApply(id, myFromDate, myToDate, number_of_day, reason, function (status) {
                        if (status == 0) {
                            destory(id);
                            rtm.sendMessage('Your leave has been submitted approval!', dm.id);
                        } else {
                            destory(id);
                            rtm.sendMessage('Oops! Some problem occurred. We are looking into it. In the mean time you can use HR system to apply your leave', dm.id);
                        }
                    });
                } else {
                    rtm.sendMessage('You must have to apply leave for more than one day !', dm.id);
                    destory(id);
                }
            } else if (date == false) {
                if (to == '' && from != '') {
                    rtm.sendMessage('Invalid Date. So please enter a valid date again in proper format to (DD-MM-YYYY)', dm.id);
                } else if (from == '') {
                    rtm.sendMessage('Invalid Date. So please enter a valid date again in proper format from (DD-MM-YYYY)', dm.id);
                }
            }
        }
    }

    function get(id, key, callback) {
        if (session[id]) {
            return session[id][key];
        } else {
//doesnt exist throw error
            return false;
        }
    }

    function touch(id) {
        if (session[id]) {
            session[id].start = time;
            clearTimeout(session[id].timeout)
            session[id].timeout = setTimeout(function () {
                destory(id); //auto expire after 5sec
            }, 50000000);
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
        }, 5000000);
    }

    function destory(id) {
        session[id] = {};
        delete session[id];
    }


};