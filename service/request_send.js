var request = require('request');
        const request_send = require('../service/request_send');
        exports.request_send = function (message, Approved, Pending, cancelled, callback) {
        if (Approved != '') {
        request({
        url: 'https://slack.com/api/chat.postMessage', //URL to hit
                method: 'POST',
                qs: {"token": process.env.SLACK_API_TOKEN || '', "channel": message.channel, "attachments": '[{ "pretext": "Status : Approved", "text":"' + Approved + '", "fallback": "Message Send to Employee","color": "#36a64f" }]'},
                }, function (error, response, body) {
        if (error) {
        console.log(error);
                } else {
        Approved = [];
                }
        })
                }
        if (Pending != '') {
        request({
        url: 'https://slack.com/api/chat.postMessage', //URL to hit
                method: 'POST',
                qs: {"token": process.env.SLACK_API_TOKEN || '', "channel": message.channel, "attachments": '[{ "pretext": "Status : Pending", "text":"' + Pending + '", "fallback": "Message Send to Employee","color": "#AF2111"}]'},
                }, function (error, response, body) {
        if (error) {
        console.log(error);
                } else {

        Pending = [];
                }
        })
                }
        if (cancelled != '') {
        request({
        url: 'https://slack.com/api/chat.postMessage', //URL to hit
                method: 'POST',
                qs: {"token": process.env.SLACK_API_TOKEN || '', "channel": message.channel, "attachments": '[{ "pretext": "Status : Cancelled Request", "text":"' + cancelled + '", "fallback": "Message Send to Employee","color": "#F2801D"}]'},
                }, function (error, response, body) {
        if (error) {
        console.log(error);
                } else {
        cancelled = '';
                }
        })

                }
        }