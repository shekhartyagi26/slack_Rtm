var express = require('express');
var router = express.Router();
var request = require('request');

request({
    url: 'https://slack.com/api/chat.postMessage', //URL to hit
    method: 'POST',
    qs: {"token": process.env.SLACK_API_TOKEN || '', "channel": "D2W9E51FU", "text": "HelloWorld"}
}, function (error, response, body) {
    if (error) {
        console.log(error);
    } else {
        console.log(response.statusCode, body);
    }
});

module.exports = router;