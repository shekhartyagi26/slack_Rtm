var leave_ = require('../leaveApply');
var moment = require('moment');
require('node-import');
imports('config/index');

var from = '', to = '', reason = '';

exports.apply = function (rtm, date, message, dm, user, callback) {
    if (message == 'apply') {
        rtm.sendMessage(user.name + '!' + ' can you please provide me the details', dm.id);
        rtm.sendMessage('from (YYYY-MM-DD) ', dm.id);
    } else if (date == true && from == '') {
        from = message;
        rtm.sendMessage('to (YYYY-MM-DD)', dm.id);
        callback(from);
    } else if (date == true && from != '' && to == '') {
        to = message;
        var myDay = moment(to).isAfter(from);
        if (myDay == true) {
            rtm.sendMessage('reason', dm.id);
            callback(to);
        } else {
            from = '';
            to = '';
            rtm.sendMessage('Invalid days. So enter again from (YYYY-MM-DD) ', dm.id);
        }
    } else if (from != '' && to != '' && reason == '') {
        rtm.sendMessage('Please wait...', dm.id);
        reason = message;
        var id = message.user;
        var fromDate = moment(from, 'YYYY-MM-DD'); // format in which you have the date
        var toDate = moment(to, 'YYYY-MM-DD');     // format in which you have the date
        /* using diff */
        var duration = toDate.diff(fromDate, 'days');
        if (duration > 0) {
            var number_of_day = duration + 1;
            leave_.leaveApply(id, from, to, number_of_day, reason, function (response) {
                if (response == 0) {
                    rtm.sendMessage('Your leave has been submitted approval!', dm.id);
                    callback(reason);
                } else {
                    rtm.sendMessage('Oops! Some problem occurred. We are looking into it. In the mean time you can use HR system to apply your leave', dm.id);
                }
            });
            to = '';
            from = '';
            reason = '';
        } else {
            rtm.sendMessage('Invalid Days. So please try again', dm.id);
        }
    }

};