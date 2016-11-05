var leave_ = require('../leaveApply');
var moment = require('moment');
require('node-import');
imports('config/index');

var from = '', to = '', reason = '';

exports.apply = function (rtm, date, message, dm, user, callback) {
    console.log('apply chala');
    console.log(from + "::::" + to + "::::" + reason);
    if (message == 'apply') {
        rtm.sendMessage(user.name + '!' + ' can you please provide me the details', dm.id);
        rtm.sendMessage('from (DD-MM-YYYY) ', dm.id);
    } else if (date == true && from == '') {
        from = message;
        rtm.sendMessage('to (DD-MM-YYYY)', dm.id);
    } else if (date == true && from != '' && to == '') {
        to = message;
        var fromTimeStamp = moment(from, "DD-MM-YYYY").unix();
        var toTimeStamp = moment(to, "DD-MM-YYYY").unix();
        if (toTimeStamp > fromTimeStamp) {
            rtm.sendMessage('reason', dm.id);
        } else {
            from = '';
            to = '';
            rtm.sendMessage('Invalid days. So enter again from (DD-MM-YYYY) ', dm.id);
        }
    } else if (from != '' && to != '' && reason == '') {
        rtm.sendMessage('Please wait...', dm.id);
        reason = message;
        var id = message.user;
        var fromDate = moment(from, "DD-MM-YYYY"); // format in which you have the date
        var toDate = moment(to, "DD-MM-YYYY");     // format in which you have the date

        /* using diff */
        var duration = toDate.diff(fromDate, 'days');

        if (duration > 0) {
            var number_of_day = duration + 1;
//            var dateTimeFrom = moment(from, "MM-DD-YYYY");
            var myFrom = moment(fromDate).format("YYYY-MM-DD");
//            var dateTimeTo = moment(to, "MM-DD-YYYY");
            var myTo = moment(toDate).format("YYYY-MM-DD");
            console.log('-=-------====');
            console.log(myFrom);
            console.log(myTo);
            leave_.leaveApply(id, myFrom, myTo, number_of_day, reason, function (response) {
                if (response == 0) {
                    rtm.sendMessage('Your leave has been submitted approval!', dm.id);
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