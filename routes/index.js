var express = require('express');
var moment = require('moment');
var router = express.Router();
var request = require('request');
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
var to = '';
var from = '';
var reason = '';
var Approved = [];
var Pending = [];
var cancelled = [];


rtm.on(RTM_EVENTS.MESSAGE, function (message) {

    var user = rtm.dataStore.getUserById(message.user)
    if (user == undefined) {
        return;
    }
    var dm = rtm.dataStore.getDMByName(user.name);
    var dateFormat = "YYYY-MM-DD";
    var date = moment(message.text, dateFormat, true).isValid();
    if (message.text == 'hello' || message.text == 'hi' || message.text == 'helo' || message.text == 'hey') {
        rtm.sendMessage('hello ' + user.name + '!', dm.id);
    } else if (message.text == 'leave') {
        rtm.sendMessage('These are the different options for you: \n 1. apply \n 2. status', dm.id);
    } else if (message.text == 'help') {
        rtm.sendMessage('These are the different options for you: \n 1. leave', dm.id);
    } else if (message.text == 'status') {
        request({
            url: 'http://excellencemagentoblog.com/slack_dev/hr/attendance/API_HR/api.php', //URL to hit
            method: 'POST',
            qs: {"action": 'get_my_leaves', "userslack_id": 'U0FJZ0KDM'}
        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                if (body == '') {
                    rtm.sendMessage("You don't have any upcoming leaves", dm.id);
                } else {
                    var data1 = JSON.parse(body);
                    rtm.sendMessage(user.name + '!', dm.id);
                    for (i = 0; i < data1.data.leaves.length; i++) {
                        var leave = data1.data.leaves[i].from_date;
                        var leave1 = data1.data.leaves[i].to_date;
                        var leave2 = data1.data.leaves[i].status;
                        if (data1.data.leaves[i].status == "Approved") {
                            // Leave from 3rd Nov to 4th Nov
                            Approved.push('Leave from: ' + data1.data.leaves[i].from_date + ' to: ' + data1.data.leaves[i].to_date + '\n')
// rtm.sendMessage('\n applied leave from ' + data1.data.leaves[i].from_date + ' to ' + data1.data.leaves[i].to_date + '\n' + '*status:' + data1.data.leaves[i].status + '*', dm.id);
                        } else if (data1.data.leaves[i].status == "Pending") {
                            Pending.push('Leave from: ' + data1.data.leaves[i].from_date + ' to: ' + data1.data.leaves[i].to_date + '\n')
// rtm.sendMessage('\n applied leave from ' + data1.data.leaves[i].from_date + ' to ' + data1.data.leaves[i].to_date + '\n' + '*status:' + data1.data.leaves[i].status + '*', dm.id);
                        } else if (data1.data.leaves[i].status == "Cancelled Request") {
                            cancelled.push('Leave from: ' + data1.data.leaves[i].from_date + ' to: ' + data1.data.leaves[i].to_date + '\n')
                        }
                    }
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
                                console.log(response.statusCode, body);
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
                                console.log(response.statusCode, body);
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
                                Cancelled = '';
                                console.log(response.statusCode, body);
                            }
                        })

                    }
                }
            }
        });
    } else if (message.text == 'apply' || date == true || from != '') {
        if (message.text == 'apply') {
            rtm.sendMessage(user.name + '!' + ' can you please provide me the details', dm.id);
            rtm.sendMessage('to (YYYY-MM-DD) ', dm.id);
        } else if (date == true && to == '') {
            to = message.text;
            rtm.sendMessage('from (YYYY-MM-DD)', dm.id);
        } else if (date == true && to != '' && from == '') {
            from = message.text;
            rtm.sendMessage('reason', dm.id);
        } else if (from != '' && to != '' && reason == '') {
            reason = message.text;
            rtm.sendMessage('your leave application has been submitted', dm.id);
            to = '';
            from = '';
            reason = '';
        }
    } else if (date == false && to != '' || date == false && from != '') {
        rtm.sendMessage('invalid format \n use this format (YYYY-MM-DD)', dm.id);
    } else {
        rtm.sendMessage("I don't understand" + " " + message.text + ". " + "Please use 'help' to see all options" + '.', dm.id);
    }
});

//////////////////////when app is started it sends a mesage to shekhar  //////////////////////////
var RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;
// you need to wait for the client to fully connect before you can send messages
rtm.on(RTM_CLIENT_EVENTS.RTM_CONNECTION_OPENED, function () {
// This will send the message 'this is a test message' to the channel identified by id 'C0CHZA86Q'
    rtm.sendMessage('text : welcome,\n username: shekhar, \n your app is running now', config.shekhar_channelId, function messageSent() {
    });
});

module.exports = router;