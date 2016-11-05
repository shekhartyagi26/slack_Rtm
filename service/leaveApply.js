var request = require('request');
//var Approved = [];
//var Pending = [];
//var cancelled = [];
//var request_send = require('../service/request_send');

exports.leaveApply = function (id, from, to, number_of_day, reason, callback) {
    console.log(id);
    request({
        url: 'http://excellencemagentoblog.com/slack_dev/hr/attendance/API_HR/api.php', //URL to hit
        method: 'GET',
        qs: {"action": 'apply_leave', "userslack_id": 'U0FJZ0KDM', "from_date": from,
            "to_date": to, "no_of_days": number_of_day, "reason": reason}
    }, function (error, response, body) {
        if (error) {
            console.log(error);
        } else {
            console.log('************');
//            console.log(response);
            console.log('------------');
            console.log(body);
            console.log('************');
            callback(body);
        }
    });
};