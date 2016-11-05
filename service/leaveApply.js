var request = require('request');

exports.leaveApply = function (id, from, to, number_of_day, reason, callback) {
    request({
        url: 'http://excellencemagentoblog.com/slack_dev/hr/attendance/API_HR/api.php', //URL to hit
        method: 'GET',
        qs: {"action": 'apply_leave', "userslack_id": id, "from_date": from,
            "to_date": to, "no_of_days": number_of_day, "reason": reason}
    }, function (error, response, body) {
        if (error) {
            callback(error);
        } else {
            var p = JSON.parse(body);
            callback(p.error);
        }
    });
};