var express = require('express');
var moment = require('moment');
var router = express.Router();
var request = require('request');
const leave_status = require('../service/leave/status');
// const request_ = require('../service/request');
// var leave_ = require('../service/leaveApply');
// var apply_ = require('../service/leave/apply');
require('node-import');
imports('config/index');
var RtmClient = require('@slack/client').RtmClient;
var MemoryDataStore = require('@slack/client').MemoryDataStore;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var token = process.env.SLACK_API_TOKEN || '';
var rtm = new RtmClient(token, {
    logLevel: 'error',
    dataStore: new MemoryDataStore()
});
rtm.start();


// Wait for the client to connect
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
    var user = rtm.dataStore.getUserById(rtm.activeUserId);
    var team = rtm.dataStore.getTeamById(rtm.activeTeamId);
    console.log('Connected to ' + team.name + ' as ' + user.name);
});
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
// Responds to a message with a 'hello' DM


//////////////////////when app is started it sends a mesage to shekhar  //////////////////////////
var RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;
// you need to wait for the client to fully connect before you can send messages
rtm.on(RTM_CLIENT_EVENTS.RTM_CONNECTION_OPENED, function () {
// This will send the message 'this is a test message' to the channel identified by id 'C0CHZA86Q'
    rtm.sendMessage('text : welcome,\n username: shekhar, \n your app is running now', config.shekhar_channelId, function messageSent() {
    });
});


var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
// Responds to a message with a 'hello' DM
var to = '';
var from = '';
var reason = '';
var session = {};


rtm.on(RTM_EVENTS.MESSAGE, function (message) {
    var time = moment().format('h:mm:ss');
    var user = rtm.dataStore.getUserById(message.user)
    if (user == undefined) {
        return;
    }
    var dm = rtm.dataStore.getDMByName(user.name);
    if (dm == undefined) {
        return;
    }
    var dateFormat = "YYYY-MM-DD";
    var date = moment(message.text, dateFormat, true).isValid();
    if (message.text == 'hello' || message.text == 'hi' || message.text == 'helo' || message.text == 'hey') {
        rtm.sendMessage('hello ' + user.name + '!', dm.id);
    } else if (message.text == 'leave') {
        rtm.sendMessage('These are the different options for you: \n 1. apply \n 2. status', dm.id);
    } else if (message.text == 'help') {
        rtm.sendMessage('These are the different options for you: \n 1. leave', dm.id);
    } else if (message.text == 'status') {
        leave_status.fetch(message, dm, function (req, response, msg) {
        });
    } else if (message.text == 'apply' || date == true || to != '') {
        var id = message.user;
        exists(id);

    } else if (date == false && to != '' || date == false && from != '') {
        rtm.sendMessage('invalid format \n use this format (YYYY-MM-DD)', dm.id);
    } else if (dm && dm.id) {
        rtm.sendMessage("I don't understand" + " " + message.text + ". " + "Please use 'help' to see all options" + '.', dm.id);
    }


    function exists(id) {
        var check_session = session[id] ? true : false;
        if (check_session == false) {
            start(id);
            rtm.sendMessage(user.name + '!' + ' can you please provide me the details \n from (YYYY-MM-DD) ', dm.id);
        } else if (check_session == true && date == true || date == false) {
            if (date == true && from == '') {
                touch(id);
                from = message.text;
                set(id, 'from', message.text);
                rtm.sendMessage('to (YYYY-MM-DD)', dm.id);
            } else if (date == true && from != '' && to == '') {
                to = message.text;
                touch(id);
                set(id, 'to', message.text);
                rtm.sendMessage('reason', dm.id);
            } else if (from != '' && to != '' && reason == '') {
                touch(id);
                reason = message.text;
                set(id, 'reason', message.text);
                var fromDate = moment(from, "YYYY-MM-DD");
                var toDate = moment(get(id, 'to'), "YYYY-MM-DD");
                var duration = toDate.diff(get(id, 'from'), 'days');
                var number_of_day = duration + 1;
                if (number_of_day > 0) {
                    request({
                        url: config.url, //URL to hit
                        method: 'GET',
                        qs: {"action": 'apply_leave', "userslack_id": message.user, "from_date": from,
                            "to_date": to, "no_of_days": number_of_day, "reason": reason}
                    }, function (error, response, body) {
                        if (error) {
                            callback(error);
                        } else {
                            destory(id);
                            rtm.sendMessage('your leave application has been submitted', dm.id);
                            to = '';
                            from = '';
                            reason = '';
                        }
                    });
                } else {
                    rtm.sendMessage('you must have to apply leave for more than one day !', dm.id);
                    destory(id);
                }
            }
        }
    }
    function get(id, key, callback) {
        if (session[id]) {
            return session[id][key]
        } else {
//doesnt exist throw error
            return false
        }
    }

    function touch(id) {
        if (session[id]) {
            session[id].start = time;
            clearTimeout(session[id].timeout)
            session[id].timeout = setTimeout(function () {
                destory(id); //auto expire after 5sec
            }, 50000000)
        } else {
//doesnt exist throw error
        }
    }

    function set(id, key, value) {
        if (session[id]) {
            session[id][key] = value;
        } else {
//doesnt exist throw error
        }
    }

    function start(id) {
        session[id] = {};
        session[id].start = time;
        session[id].timeout = setTimeout(function () {
            destory(id); //auto expire after 5sec
        }, 5000000)
    }

    function destory(id) {
        session[id] = {}
        delete session[id]
    }
});

module.exports = router;