var express = require('express');
var router = express.Router();
var request = require('request');

request({
    url: 'https://slack.com/api/chat.postMessage', //URL to hit
    method: 'POST',
    qs: {"token": "xoxb-98246795219-K2wljPXhhowEJoiT1Gua72C7", "channel": "D2W9E51FU", "text": "HelloWorld"}
}, function (error, response, body) {
    if (error) {
        console.log(error);
    } else {
        console.log(response.statusCode, body);
    }
});

module.exports = router;