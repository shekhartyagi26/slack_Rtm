var request = require('request');

exports.message = function (message, paramaters, message_data, url, callback) {
    request({
        url: url, //URL to hit
        method: 'POST',
        qs: paramaters,
    }, function (error, response, body) {
        if (error) {
            console.log(error);
        } else {
            message_data = '';
            callback(body)
        }
    });
};