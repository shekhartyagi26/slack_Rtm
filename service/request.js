var request = require('request');
var Approved = [];
var Pending = [];
var cancelled = [];
const request_send = require('../service/request_send');

exports.request = function (message) {
    request({
        url: 'http://excellencemagentoblog.com/slack_dev/hr/attendance/API_HR/api.php', //URL to hit
        method: 'POST',
        qs: {"action": 'get_my_leaves', "userslack_id": message.user}
    }, function (error, response, body) {
        if (error) {
            console.log(error);
        } else {
            if (body == '') {
                rtm.sendMessage("You don't have any upcoming leaves", dm.id);
            } else {
                var data1 = JSON.parse(body);
                for (i = 0; i < data1.data.leaves.length; i++) {
                    var leave = data1.data.leaves[i].from_date;
                    var leave1 = data1.data.leaves[i].to_date;
                    var leave2 = data1.data.leaves[i].status;
                    if (data1.data.leaves[i].status == "Approved") {
                        Approved.push('Leave from: ' + data1.data.leaves[i].from_date + ' to: ' + data1.data.leaves[i].to_date + '\n')
// rtm.sendMessage('\n applied leave from ' + data1.data.leaves[i].from_date + ' to ' + data1.data.leaves[i].to_date + '\n' + '*status:' + data1.data.leaves[i].status + '*', dm.id);
                    } else if (data1.data.leaves[i].status == "Pending") {
                        Pending.push('Leave from: ' + data1.data.leaves[i].from_date + ' to: ' + data1.data.leaves[i].to_date + '\n')
// rtm.sendMessage('\n applied leave from ' + data1.data.leaves[i].from_date + ' to ' + data1.data.leaves[i].to_date + '\n' + '*status:' + data1.data.leaves[i].status + '*', dm.id);
                    } else if (data1.data.leaves[i].status == "Cancelled Request") {
                        cancelled.push('Leave from: ' + data1.data.leaves[i].from_date + ' to: ' + data1.data.leaves[i].to_date + '\n')
                    }
                }
                request_send.request_send(message, Approved, Pending, cancelled, function (error, response, msg) {
                });
            }
        }
    });
}