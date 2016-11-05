var express = require('express');
var moment = require('moment');
var router = express.Router();
var request = require('request');
const request_ = require('../service/request');
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

rtm.on(RTM_EVENTS.MESSAGE, function (message) {

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
        request_.request(message, function (req, response, msg) {
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
    } else if (dm && dm.id) {
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