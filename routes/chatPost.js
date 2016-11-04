var express = require('express');
var router = express.Router();
var request = require('request');

var attachment = '[{ "pretext": "text world", "text":"fruits" , "fallback": "Message Send to Employee","color": "#36a64f"}]'

request({
    url: 'https://slack.com/api/chat.postMessage', //URL to hit
    method: 'POST',
    qs: {"token": process.env.SLACK_API_TOKEN || '', "channel": "D2W9E51FU","attachments":attachment},
}, function (error, response, body) {
    if (error) {
        console.log(error);
    } else {
        console.log(response.statusCode, body);
    }
});


module.exports = router;