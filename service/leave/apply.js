var leave_ = require('../leaveApply');
var session_ = require('../session');
var moment = require('moment');
require('node-import');
imports('config/index');

var from = '', to = '', reason = '';

exports.apply = function (message, dm, id, date, time, rtm, user, callback) {
    exists(id);
    function exists(id) {
        session_.mySession(function (res) {
            var check_session = res[id] ? true : false;
            if (check_session == false) {
                session_.start(res, id, time, callback);
                rtm.sendMessage(user.name + '!' + ' can you please provide me the details \n from (DD-MM-YYYY) ', dm.id);
            } else if (check_session == true && date == true || date == false) {
                if (date == true && from == '') {
                    session_.touch(res, id);
                    from = message.text;
                    session_.set(res, id, 'from', message.text);
                    rtm.sendMessage('to (DD-MM-YYYY)', dm.id);
                } else if (date == true && from != '' && to == '') {
                    session_.touch(res, id);
                    to = message.text;
                    session_.set(res, id, 'to', message.text);
                    rtm.sendMessage('reason', dm.id);
                } else if (from != '' && to != '' && reason == '') {
                    var getFrom = session_.get(res, id, 'from');
                    var getTo = session_.get(res, id, 'to');
                    session_.touch(res, id);
                    reason = message.text;
                    session_.set(res, id, 'reason', message.text);
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
                                session_.destory(res, id);
                                rtm.sendMessage('Your leave has been submitted approval!', dm.id);
                            } else {
                                session_.destory(res, id);
                                rtm.sendMessage('Oops! Some problem occurred. We are looking into it. In the mean time you can use HR system to apply your leave', dm.id);
                            }
                        });
                    } else {
                        rtm.sendMessage('You must have to apply leave for more than one day !', dm.id);
                        session_.destory(res, id);
                    }
                } else if (date == false) {
                    if (to == '' && from != '') {
                        rtm.sendMessage('Invalid Date. So please enter a valid date again in proper format to (DD-MM-YYYY)', dm.id);
                    } else if (from == '') {
                        rtm.sendMessage('Invalid Date. So please enter a valid date again in proper format from (DD-MM-YYYY)', dm.id);
                    }
                }
            }
        });
    }
};